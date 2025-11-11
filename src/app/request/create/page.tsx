"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Demande, DocumentDemande } from "@/lib/interfaces/models.interface"
import { createEmptyDemande, fileToDocumentDemande } from "@/lib/utils/form.create.utils"
import { RequestComponent } from "@/lib/components/request.form"
import { FileUploader } from "@/lib/components/upload"

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
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Demande d&apos;homologation
        </h1>

        <Button onClick={handleAddDemande} className="bg-primary">
          + Ajouter une demande
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {demandes.map((_, index) => {
          const isActive = index === activeIndex
          return (
            <Button
              key={index}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveIndex(index)}
            >
              Demande {index + 1}
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
  )
}
