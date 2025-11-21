// components/EquipementForm.tsx
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "@/lib/components/upload"
import { Button } from "@/components/ui/button"
import { extendDemande } from "../types/extendedDossier.type"
import { HelpButton } from "./help-button"
import { Trash, Trash2 } from "lucide-react"
import { validateExtendDemande } from "../utils/checkEquipement"
import { useToast } from "@/context/toastModal"
import { useAlert } from "../hooks/useAlert"
import { ErrorText } from "../ressources/error.ressource"

type EquipementFormProps = {
  label: string
  initialValue?: Partial<extendDemande>
  onChange: (value: extendDemande) => void
  onDelete : ()=>void 
}

export const EquipementForm: React.FC<EquipementFormProps> = ({
  label,
  initialValue,
  onChange,
  onDelete
}) => {
  const form = useForm<extendDemande>({
    defaultValues: {
      equipement: initialValue?.equipement ?? "",
      modele: initialValue?.modele ?? "",
      marque: initialValue?.marque ?? "",
      fabricant: initialValue?.fabricant ?? "",
      type: initialValue?.type ?? "",
      description: initialValue?.description ?? "",
      quantiteEquipements: initialValue?.quantiteEquipements ?? "",
      fiche_technique:
        (initialValue?.fiche_technique as File) ?? (null as unknown as File),
    },
  })

  React.useEffect(() => {
    form.reset({
      equipement: initialValue?.equipement ?? "",
      modele: initialValue?.modele ?? "",
      marque: initialValue?.marque ?? "",
      fabricant: initialValue?.fabricant ?? "",
      type: initialValue?.type ?? "",
      description: initialValue?.description ?? "",
      quantiteEquipements: initialValue?.quantiteEquipements ?? "",
      fiche_technique:
        (initialValue?.fiche_technique as File) ?? (null as unknown as File),
    })
  }, [initialValue, form])

  const alert = useAlert()
  const toast = useToast()

  const onSubmit = (values: extendDemande) => {

    const {valid, errors} = validateExtendDemande(values)

    if(!valid){

      const messages = Object.values(errors)
        .map((msg) => `• ${msg}`)
        .join("\n")          // chaque erreur sur une nouvelle ligne

      alert.error("Erreur", messages)
      return;
    }
      
    onChange(values)

    toast.success(ErrorText.dossier_form.ep_added.title)

    return;
  }

  const handleFicheUpload = (files: File[]) => {
    const file = files[0]
    if (!file) return
    form.setValue("fiche_technique", file)
    const values = form.getValues()
    onChange({
      ...values,
      fiche_technique: file,
    })
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{label}</h2>
        <div>
          <HelpButton/>
          <Button onClick={onDelete} variant={'ghost'}><Trash2/></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
        {/* Formulaire texte */}
        <div className="col-span-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-lg border bg-card p-6"
            >
              {/* Ligne 1 : Équipement / Modèle */}
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

              {/* Ligne 3 : Type / Quantité */}
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
                    <FormItem>
                      <FormLabel>Quantité</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description détaillée de l'équipement..."
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Fiche technique</h3>
                <p className="text-sm text-muted-foreground">
                  Ajoutez la fiche technique détaillée de l&apos;équipement à homologuer (PDF, 3&nbsp;Mo max).
                </p>
                <FileUploader
                  title="Fiche technique"
                  accept=".pdf"
                  maxSizeMb={3}
                  multiple={false}
                  onFiles={handleFicheUpload}
                  type="fiche_technique"
                  file={initialValue?.fiche_technique}
                />
              </div>

              <Button type="submit" className="w-full">
                Enregistrer l&apos;équipement
              </Button>
            </form>
          </Form>
        </div>
        
      </div>
    </div>
  )
}
