"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Demande, DocumentDemande } from "@/lib/interfaces/models.interface"
import { createEmptyDemande, fileToDocumentDemande } from "@/lib/utils/form.create.utils"
import { RequestComponent, RequestComponentRef } from "@/lib/components/request.form"
import { FileUploader } from "@/lib/components/upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TypeLibelle } from "@/types/types"
import { Plus, Loader2 } from "lucide-react"
import { useAlert } from "@/lib/hooks/useAlert"
import { dossiers } from "@/lib/endpoints/dossiers"
import { pathsUtils } from "@/lib/utils/path.util"

// Type pour le formulaire du dossier
type DossierFormData = {
  libelle: string;
}

export default function MultiDemandesScreen() {
  const router = useRouter()
  const [demandes, setDemandes] = React.useState<Demande[]>([
    createEmptyDemande(),
  ])
  
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [documentsLetter, setDocumentsLetter] = React.useState<File[]>([])
  const [libelle, setLibelle] = React.useState<string>("")
  const [loading, setLoading] = React.useState(false)
  const formRef = React.useRef<RequestComponentRef>(null)
  const alert = useAlert()

  const handleSubmitDemande = (index: number, demande: Demande) => {
    setDemandes((prev) =>
      prev.map((d, i) => (i === index ? demande : d))
    )
  }

  const handleUploadLetter = (files: File[]) => {
    setDocumentsLetter(files)
    
    const docs = files.map((f) => fileToDocumentDemande(f, "Courrier d'homologation"))
    setDemandes((prev) =>
        ([...prev.map((demande) => ({
        ...demande,
        documentIds: docs
        }))])
    )
  }

  const checkFormData = (idx: number) => {
    return checkFormDataWithDemande(idx, demandes[idx])
  }

  const checkFormDataWithDemande = (idx: number, demande: Demande | undefined) => {
    if (!demande) return false

    const contactEmail = String(demande.contactEmail || "").trim()
    const contactNom = String(demande.contactNom || "").trim()
    const type = String(demande.type || "").trim()
    const quantiteEquipements = demande.quantiteEquipements
    const marque = String(demande.marque || "").trim()
    const modele = String(demande.modele || "").trim()
    const fabricant = String(demande.fabricant || "").trim()
    const equipement = String(demande.equipement || "").trim()

    if (!contactEmail) return false
    if (!contactNom) return false
    if (!type) return false
    if (!quantiteEquipements || quantiteEquipements <= 0) return false
    if (!marque) return false
    if (!modele) return false
    if (!fabricant) return false
    if (!equipement) return false

    return true
  }

  const handleAddDemande = () => {

    if(!checkFormData(activeIndex)){
        alert.confirm(
          "Confirmation",
          "Êtes-vous sûr de vouloir perdre les champs saisie de cet equipement ?",
          
          () => {

          },
          () => {
            setDemandes((item)=>[...item.filter((_, i) => i !== activeIndex)])
            return;
          },
          "warning",
          "Conserver",
          "Supprimer",
        )

        
    }

    setDemandes((prev) => [...prev, createEmptyDemande()])
    setActiveIndex(demandes.length == 1 ? 0 : demandes.length - 1) 
  }



  const handleCreerDossier = async () => {
    if (!libelle.trim()) {
      alert.error("Erreur", "Veuillez saisir un libellé pour le dossier.")
      return
    }

    if (documentsLetter.length === 0) {
      alert.error("Erreur", "Veuillez télécharger le courrier d'homologation.")
      return
    }

    const demandesAvecValeursActuelles = [...demandes]
    
    if (formRef.current) {
      const valeursActuelles = formRef.current.getCurrentValues()
      if (valeursActuelles) {
        demandesAvecValeursActuelles[activeIndex] = valeursActuelles
      }
    }

    const demandesValides = demandesAvecValeursActuelles.filter((d, index) => {
      const demande = demandesAvecValeursActuelles[index]
      return checkFormDataWithDemande(index, demande)
    })
    
    if (demandesValides.length === 0) {
      alert.error("Erreur", "Veuillez remplir au moins un équipement complet.")
      return
    }

    setLoading(true)

    try {
      const courrierFile = documentsLetter[0]
      if (!courrierFile) {
        alert.error("Erreur", "Veuillez télécharger le courrier d'homologation.")
        setLoading(false)
        return
      }

      const response = await dossiers.creer({
        Libelle: libelle,
        CourrierFile: courrierFile,
      })

      const dossierId = response.dossierId

      for (const demande of demandesValides) {
        const ficheTechniqueDoc = demande.documentsDemandes?.find(
          (doc) => doc.nom?.includes("Fiche technique")
        )
        
        const ficheTechniqueFile = ficheTechniqueDoc?.donnees 
          ? (ficheTechniqueDoc.donnees as unknown as File)
          : undefined

        await dossiers.ajouterEquipement(dossierId, {
          IdDossier: dossierId,
          Equipement: String(demande.equipement || ""),
          Modele: demande.modele ? String(demande.modele) : undefined,
          Marque: demande.marque ? String(demande.marque) : undefined,
          Fabricant: demande.fabricant ? String(demande.fabricant) : undefined,
          Description: demande.description ? String(demande.description) : undefined,
          QuantiteEquipements: demande.quantiteEquipements ? Number(demande.quantiteEquipements) : undefined,
          ContactNom: demande.contactNom ? String(demande.contactNom) : undefined,
          ContactEmail: demande.contactEmail ? String(demande.contactEmail) : undefined,
          TypeURL_FicheTechnique: ficheTechniqueFile,
        })
      }

      alert.success(
        "Succès",
        "Votre dossier a été créé avec succès."
      )

      router.push(`${pathsUtils.projects}${dossierId}`)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Erreur lors de la création du dossier."
      alert.error("Erreur", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const activeDemande = demandes[activeIndex]

  return (
    <div className="space-y-8">
      <div className=" space-y-8">

        {/* Section dossier */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">Dossier</CardTitle>
            <CardDescription>
              Initiez votre dossier de certification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="libelle" className="text-sm font-medium text-gray-700">
                Libellé du dossier *
              </label>
              <Input
                id="libelle"
                placeholder="Ex: Homologation équipement réseau"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <FileUploader
              title="Courrier d'homologation"
              accept=".pdf"
              multiple={false}
              maxSizeMb={3}
              onFiles={handleUploadLetter}
              type={"mail"}
            />
          </CardContent>
        </Card>
        <Separator className="my-8" />
        <div className="flex flex-wrap gap-2 justify-between items-center">
          {demandes.map((_, index) => {
            const isActive = index === activeIndex
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveIndex(index)}
              >
                {index + 1}
              </Button>
            )
          })}
            <Button
              onClick={handleAddDemande}
              variant={"default"}
              className="bg-primary text-white border border-white/30 backdrop-blur-sm px-6 py-3 font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              {"Ajouter un équipement"}
            </Button>
        </div>
        {/* Formulaire actif */}
        {activeDemande && (
          <div>
            <RequestComponent
              ref={formRef}
              key={activeIndex} 
              initialValue={activeDemande}
              label={`Equipement ${activeIndex + 1}`}
              onSubmitDemande={(demande : Demande) =>
                handleSubmitDemande(activeIndex, demande)
              }
            />
          </div>
        )}
      </div>
      
      <Button 
        className="w-full bg-secondary" 
        onClick={handleCreerDossier}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Enregistrer le Dossier"
        )}
      </Button>
      
    </div>
  )
}