"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Demande, DocumentDemande } from "@/lib/interfaces/models.interface"
import { createEmptyDemande, fileToDocumentDemande } from "@/lib/utils/form.create.utils"
import { RequestComponent } from "@/lib/components/request.form"
import { FileUploader } from "@/lib/components/upload"
import { ScreenHeader } from "@/lib/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TypeLibelle } from "@/types/types"
import { Plus } from "lucide-react"

// Type pour le formulaire du dossier
type DossierFormData = {
  libelle: string;
}

export default function MultiDemandesScreen() {

  const [demandes, setDemandes] = React.useState<Demande[]>([
    createEmptyDemande(),
  ])
  
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [documentsLetter, setDocumentsLetter] = React.useState<DocumentDemande[]>([])

  // Formulaire pour gérer le libellé du dossier
  const [libelle, setLibelle] = React.useState<TypeLibelle>()

  const handleSubmitDemande = (index: number, demande: Demande) => {
    setDemandes((prev) =>
      prev.map((d, i) => (i === index ? demande : d))
    )
  }

  const handleUploadLetter = (files: File[]) => {
    const docs = files.map((f) => fileToDocumentDemande(f, "Courrier d'homologation"))
    setDocumentsLetter(docs)

    setDemandes((prev) =>
        ([...prev.map((demande) => ({
        ...demande,
        documentIds: docs
        }))])
    )
  }

  const handleAddDemande = () => {
    setDemandes((prev) => [...prev, createEmptyDemande()])
    setActiveIndex(demandes.length) 
  }

  const activeDemande = demandes[activeIndex]

  return (
    <div className="space-y-8">
      <div className=" space-y-8">

        {/* Section dossier */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">Dossier</CardTitle>
            {/* <CardDescription>
              .
            </CardDescription> */}
            {/* Champ "Libellé" avec bouton de validation */}
            <div className="mt-4">
              <Input
                placeholder="Nom du dossier"
                onChange={(event)=>setLibelle(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <FileUploader
              title="Lettre d'homologation"
              accept=".pdf"
              multiple={false}
              maxSizeMb={3}
              onFiles={handleUploadLetter}
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
      
      <Button className="w-full bg-secondary"> Enregistrer le Dossier</Button>
      
    </div>
  )
}