"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BinaryData, Demande, DocumentDemande, TypeCle, TypeCode, TypeLibelle, TypeNombre, TypeNoms, TypeNomsComplet, TypeRemarques } from "../interfaces/models.interface"
import { Input } from "@/components/ui/input"
import { FileUploader } from "./upload"
import { Textarea } from "@/components/ui/textarea"
import { DemandeFormProps } from "../interfaces/requestComponentProps.interface"
import { fileToDocumentDemande } from "../utils/form.create.utils"



export function RequestComponent({
  initialValue,
  label,
  onSubmitDemande
}: DemandeFormProps) {

  const form = useForm<Demande>({
    defaultValues: initialValue,
  })


  const [documentsZone1, setDocumentsZone1] = React.useState<DocumentDemande[]>([])
  const [documentsZone2, setDocumentsZone2] = React.useState<DocumentDemande[]>([])

  // State final pour voir la Demande complète (typée Demande)
  const [demandeSoumise, setDemandeSoumise] = React.useState<Demande | null>(null)


  const handleUploadZone1 = (files: File[]) => {
    const docs = files.map((f) => fileToDocumentDemande(f, "Document zone 1"))
    setDocumentsZone1((prev) => [...prev, ...docs])
  }

  const handleUploadZone2 = (files: File[]) => {
    const docs = files.map((f) => fileToDocumentDemande(f, "Document zone 2"))
    setDocumentsZone2((prev) => [...prev, ...docs])
  }



  // ------------------------------------
  // SUBMIT
  // ------------------------------------
  const onSubmit = (values: Demande) => {

    

    const tousLesDocs: DocumentDemande[] = [
      ...documentsZone1,
      ...documentsZone2,
    ]

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
      <h1 className="text-2xl font-semibold tracking-tight">
        {label}
      </h1>

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


              {/* Description */}
              {/* <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description / Justification</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Décrivez le besoin, le contexte, etc."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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

              {/* Bouton submit */}
              <Button type="submit">Enregistrer la demande</Button>
            </form>
          </Form>
        </div>

        {/* 3 ZONES D’UPLOAD JUSTE APRÈS LE FORMULAIRE */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Pièces jointes</h2>

          <FileUploader
            title="Documents administratifs"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            maxSizeMb={10}
            multiple
            onFiles={handleUploadZone1}
          />

          <FileUploader
            title="Autres justificatifs"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            maxSizeMb={10}
            multiple
            onFiles={handleUploadZone2}
          />
        </div>
      </div>
    </div>
  )
}
