// app/demandes/multi/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader, Loader2, Plus } from "lucide-react"
import { DossierForm } from "@/lib/components/dossierForm"
import { extendDemande, extendDossier } from "@/lib/types/extendedDossier.type"
import { EquipementForm } from "@/lib/components/request.form"
import { dossiers } from "@/lib/endpoints/dossiers"

import { useAlert } from "@/lib/hooks/useAlert"
import { TextRessource } from "@/lib/ressources/alert.ressource"
import { useToast } from "@/context/toastModal"
// import { dossiers } from "@/lib/endpoints/dossiers"

const createEmptyDemande = (): extendDemande => ({
  equipement: "",
  modele: "",
  marque: "",
  fabricant: "",
  type: "",
  description: "",
  quantiteEquipements: "1",
  fiche_technique: null as unknown as File,
})

const createEmptyDossier = (): extendDossier => ({
  libelle: "",
  courrier: null as unknown as File,
})

export default function MultiDemandesScreen() {
  const router = useRouter()
  const alert = useAlert()
  const toast = useToast()

  const [dossier, setDossier] = React.useState<extendDossier>(createEmptyDossier)
  const [demandes, setDemandes] = React.useState<extendDemande[]>([
    createEmptyDemande(),
  ])
  const [activeIndex, setActiveIndex] = React.useState(0)
  
  const handleDossierChange = (value: extendDossier) => {
    setDossier(value)
  }

  const [isCreating, setIsCreating] = React.useState(false)

  const handleDemandeChange = (index: number, value: extendDemande) => {
    setDemandes((prev) => prev.map((d, i) => (i === index ? value : d)))
  }

  const handleAddDemande = () => {

    alert.confirm(
      "Attention", 
      `Vous perdrez les modification apporter à l'equipement-${activeIndex + 1}`, 
      ()=>{

        return;
      },
      ()=>{
        
        setDemandes((prev) => {
          const updated = [...prev, createEmptyDemande()]
          setActiveIndex(updated.length - 1)
          return updated
        })
        return;
      },
      "warning",
      "Annuler",
      "Ecraser",
    )


  }

  const handleSubmitAll = async () => {


    try {
      
      setIsCreating(true)
      const date = new Date()

      const {dossierId} = await dossiers.creer({
        Libelle : 'LIBELE_' + date.getUTCMilliseconds().toString(),
        CourrierFile : dossier.courrier
      })

      Promise.all([

        demandes.map((dmd)=>{
          
          dossiers.ajouterEquipement(dossierId, {
              IdDossier: dossierId,
              Equipement: dmd.equipement,
              Modele : dmd.equipement,
              Marque : dmd.marque,
              Fabricant : dmd.fabricant,
              Description : dmd.description,
              QuantiteEquipements : parseInt(dmd.quantiteEquipements),
              ContactNom : "ras",
              ContactEmail : "ras",
              ContactTelephone : "ras",
              ContactFonction : "ras",
              TypeURL_FicheTechnique : dmd.fiche_technique
          })
        })

      ])

      setDemandes([createEmptyDemande()])
      alert.success(TextRessource.dossier_form.created_succes.title, TextRessource.dossier_form.created_succes.desc)
      toast.success(TextRessource.dossier_form.created_succes.title, TextRessource.dossier_form.created_succes.desc)

    } catch (error) {
      alert.error(TextRessource.dossier_form.created_error.title, TextRessource.dossier_form.created_error.desc)
    }finally{

      setIsCreating(false)
    }


  }

  const deleteEquipement = ()=>{

    if(demandes.length <= 1) return;

    setDemandes((prev)=>[...prev.filter((_, idx)=> idx !== activeIndex)])
    setActiveIndex((prev)=>prev-1)
  }

  const activeDemande = demandes[activeIndex]

  return (
    <div className="space-y-8">
      {/* Dossier */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Dossier
          </CardTitle>
          <CardDescription>
            Initiez votre dossier de certification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DossierForm initialValue={dossier} onChange={handleDossierChange} />
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Navigation entre équipements */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
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
        </div>

        <Button
          onClick={handleAddDemande}
          variant="default"
          className="bg-primary text-white border border-white/30 backdrop-blur-sm px-6 py-3 font-semibold"
        >
          <Plus className="mr-2 h-5 w-5" />
          Ajouter un équipement
        </Button>
      </div>

      {/* Formulaire de l’équipement actif */}
      {activeDemande && (
        <EquipementForm
          label={`Équipement ${activeIndex + 1}`}
          initialValue={activeDemande}
          onChange={(value) => handleDemandeChange(activeIndex, value)}
          key={activeIndex}
          onDelete={deleteEquipement}
        />
      )}

      {/* Bouton global pour tout envoyer */}
      <div className="flex justify-end">
        <Button  size="lg" onClick={handleSubmitAll} disabled={isCreating}>
          {isCreating && <Loader2 className="animate-spin"/>} Envoyer le dossier complet
        </Button>
      </div>
    </div>
  )
}
