"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Demande, DocumentDemande } from "@/lib/interfaces/models.interface"
import { createEmptyDemande, fileToDocumentDemande } from "@/lib/utils/form.create.utils"
import { RequestComponent } from "@/lib/components/request.form"
import { FileUploader } from "@/lib/components/upload"
import { ScreenHeader } from "@/lib/components/header"

export default function MultiDemandesScreen() {


  const [demandes, setDemandes] = React.useState<Demande[]>([
    createEmptyDemande(),
  ])
  

  const [activeIndex, setActiveIndex] = React.useState(0)
  const [documentsLetter, setDocumentsLetter] = React.useState<DocumentDemande | null>(null)

  const handleSubmitDemande = (index: number, demande: Demande) => {
    setDemandes((prev) =>
      prev.map((d, i) => (i === index ? demande : d))
    )
  }

  const handleUploadLetter = (files: File[]) => {
    const docs = files.map((f) => fileToDocumentDemande(f, "Document zone 3"))
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
      <ScreenHeader onActionClick={handleAddDemande} actionTitle="Ajouter une demande" title="Demande d&apos;homologation" desc=""/>
      <div className="mx-auto max-w-7xl space-y-8">

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

          <FileUploader
              title="Lettre de votre demande d'homologation"
              accept=".pdf"
              multiple={false}
              maxSizeMb={5}
              onFiles={handleUploadLetter}
          />

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
