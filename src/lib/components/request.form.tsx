"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {  Demande, DocumentDemande, TypeNombre } from "../interfaces/models.interface"
import { Input } from "@/components/ui/input"
import { FileUploader } from "./upload"
import { DemandeFormProps } from "../interfaces/requestComponentProps.interface"
import { fileToDocumentDemande } from "../utils/form.create.utils"
import { HelpButton } from "./help-button"
import { useHelp } from "@/context/helpContext"



export function RequestComponent({
  initialValue,
  label,
  onSubmitDemande
}: DemandeFormProps) {

  const form = useForm<Demande>({
    defaultValues: initialValue,
  })


  const [documentsFicheTechnique, setDocumentsFicheTechnique] = React.useState<DocumentDemande[]>([])

  // State final pour voir la Demande complète (typée Demande)
  const [demandeSoumise, setDemandeSoumise] = React.useState<Demande | null>(null)
  const { setHelp } = useHelp()

  const handleUploadFicheTechnique = (files: File[]) => {
    const docs = files.map((f) => fileToDocumentDemande(f, "Fiche technique"))
    setDocumentsFicheTechnique((prev) => [...prev, ...docs])
  }



  // ------------------------------------
  // SUBMIT
  // ------------------------------------
  const onSubmit = (values: Demande) => {

    

    const tousLesDocs: DocumentDemande[] = [...documentsFicheTechnique]

    const demandeComplete: Demande = {
      ...values,
      documentsDemandes: tousLesDocs,
    }

    // State typé Demande
    setDemandeSoumise(demandeComplete)

    onSubmitDemande(demandeComplete)

  }

  // ------------------------------------
  // RENDER
  // ------------------------------------
  return (

    

    <div className="mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {label}
        </h1>

        <HelpButton onClick={()=>setHelp("equipement")}/>

      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* FORMULAIRE SHADCN */}
        <div className="col-span-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-lg border bg-card p-6"
            >
              {/* Ligne 1 : Equipement / Modèle */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="equipement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Équipement</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Imprimante laser"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modele"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: HP LaserJet Pro M404"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Ligne 2 : Marque / Fabricant */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="marque"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: HP"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fabricant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fabricant</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Hewlett-Packard"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Ligne 3 : Type / Catégorie */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Périphérique bureautique"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantiteEquipements"
                  render={({ field }) => (
                    <FormItem className="max-w-xs">
                      <FormLabel>Quantité</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? (Number(e.target.value) as unknown as TypeNombre)
                                : (undefined as unknown as TypeNombre)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* Contact */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactNom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact (nom complet)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nom du responsable"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact (email)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemple.com"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </form>
          </Form>
        </div>

        {/* Zone d’upload Fiche technique */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Fiche technique</h2>
          <p className="text-sm text-muted-foreground">
            Ajoutez la fiche technique détaillée de l&apos;équipement à homologuer (PDF, 3&nbsp;Mo max).
          </p>
          <FileUploader
            title="Fiche technique"
            accept=".pdf"
            maxSizeMb={3}
            multiple
            onFiles={handleUploadFicheTechnique}
            type="fiche_technique"
          />
              <Button type="submit"> Enregistrer demande</Button>

        </div>

        
      </div>
    </div>
    
  )
}
