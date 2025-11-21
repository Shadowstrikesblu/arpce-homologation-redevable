// components/DossierForm.tsx
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
import { FileUploader } from "@/lib/components/upload"
import { extendDossier } from "../types/extendedDossier.type"

type DossierFormProps = {
  initialValue?: Partial<extendDossier>
  onChange: (value: extendDossier) => void
}

export const DossierForm: React.FC<DossierFormProps> = ({
  initialValue,
  onChange,
}) => {
  const form = useForm<extendDossier>({
    defaultValues: {
      libelle: initialValue?.libelle ?? "",
      courrier: (initialValue?.courrier as File) ?? (null as unknown as File),
    },
  })

  const handleCourrierUpload = (files: File[]) => {
    const file = files[0]
    if (!file) return
    form.setValue("courrier", file)
    const current = form.getValues()
    onChange({
      ...current,
      courrier: file,
    })
  }

  const handleLibelleChange = () => {
    const current = form.getValues()
    onChange(current)
  }

  return (
    <div className="space-y-2">
        <label className="text-sm font-medium">
        Courrier d&apos;homologation
        </label>
        <FileUploader
        title="Courrier d'homologation"
        accept=".pdf"
        multiple={false}
        maxSizeMb={3}
        onFiles={handleCourrierUpload}
        type="courrier"
        />
    </div>
  )
}
