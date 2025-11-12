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
  const dossierForm = useForm<DossierFormData>({
    defaultValues: {
      libelle: "",
    },
  })

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
    <div className="min-h-screen space-y-4">
      <ScreenHeader onActionClick={handleAddDemande} actionTitle="Ajouter un équipement" title="Demande d&apos;homologation" desc=""/>
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Section dossier */}
        <Card className="border border-dashed border-gray-200">
          <CardHeader>
            <CardTitle>Votre courrier</CardTitle>
            <CardDescription>
              Téléversez la lettre d&apos;homologation signée relative à ce dossier (PDF, 3&nbsp;Mo max).
            </CardDescription>
            {/* Champ "Libellé" avec bouton de validation */}
            <div className="mt-4">
              <Form {...dossierForm}>
                <FormField
                  control={dossierForm.control}
                  name="libelle"
                  // La règle "required" a été supprimée
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Libellé</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nom du dossier"
                            className="max-w-sm" 
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline"
                          size="sm"
                          onClick={() => dossierForm.trigger('libelle')}
                        >
                          Valider
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
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
        <div className="flex flex-wrap gap-2 justify-center items-center">
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
        {/* Formulaire actif */}
        {activeDemande && (
          <RequestComponent
            key={activeIndex} 
            initialValue={activeDemande}
            label={`Demande ${activeIndex + 1}`}
            onSubmitDemande={(demande : Demande) =>
              handleSubmitDemande(activeIndex, demande)
            }
          />
        )}
      </div>
    </div>
  )
}