"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Import pour le libellé
import { Separator } from "@/components/ui/separator" // Import pour le séparateur
import { Demande, DocumentDemande } from "@/lib/interfaces/models.interface"
import { createEmptyDemande, fileToDocumentDemande } from "@/lib/utils/form.create.utils"
import { RequestComponent } from "@/lib/components/request.form"
import { FileUploader } from "@/lib/components/upload"
import { ScreenHeader } from "@/lib/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MultiDemandesScreen() {

  const [demandes, setDemandes] = React.useState<Demande[]>([
    createEmptyDemande(),
  ])
  
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [documentsLetter, setDocumentsLetter] = React.useState<DocumentDemande[]>([])
  const [dossierName, setDossierName] = React.useState<string>("")

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
            <div className="mt-6 space-y-2">
              <Label htmlFor="dossier-name">Libellé</Label>
              <Input
                id="dossier-name"
                placeholder="Nom du dossier"
                value={dossierName}
                onChange={(e) => setDossierName(e.target.value)}
              />
            </div>
            <CardDescription>
              Téléversez la lettre d&apos;homologation signée relative à ce dossier (PDF, 3&nbsp;Mo max).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader
              title="Lettre d'homologation"
              accept=".pdf"
              multiple={false}
              maxSizeMb={3}
              onFiles={handleUploadLetter}
            />
            {/* Champ "Libellé" intégré dans la même carte */}
            
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
            key={activeIndex} // force remount quand on change de demande
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