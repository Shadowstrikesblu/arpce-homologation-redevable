"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/lib/components/confirm-dialog"

type MobileMoneyFormValues = {
  phone: string
}

type MobileMoneyFormProps = {
  onValidate?: (values: MobileMoneyFormValues) => void
  defaultPhone?: string
}

export function MobileMoneyForm({ onValidate, defaultPhone }: MobileMoneyFormProps) {
  const form = useForm<MobileMoneyFormValues>({
    defaultValues: { phone: defaultPhone ?? "" },
  })

  const [submitting, setSubmitting] = React.useState(false)
  const [operator, setOperator] = React.useState<"mtn" | "airtel" | null>(null)
  const countryCode = "+242"
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const onSubmit = async () => {
    setConfirmOpen(true)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Sélecteur opérateur */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setOperator("mtn")
              const current = form.getValues("phone") || ""
              if (!/^06/.test(current)) {
                form.setValue("phone", "06")
              }
            }}
            className={`h-14 w-28 flex items-center justify-center rounded-lg border p-2 transition ${
              operator === "mtn" ? "ring-2 ring-primary bg-yellow-50" : "hover:bg-muted"
            }`}
            aria-pressed={operator === "mtn"}
          >
            <img src="/momo.png" alt="MTN MoMo" className="max-h-10 object-contain" />
          </button>
          <button
            type="button"
            onClick={() => {
              setOperator("airtel")
              const current = form.getValues("phone") || ""
              if (!/^05/.test(current)) {
                form.setValue("phone", "05")
              }
            }}
            className={`h-14 w-28 flex items-center justify-center rounded-lg border p-2 transition ${
              operator === "airtel" ? "ring-2 ring-primary bg-red-50" : "hover:bg-muted"
            }`}
            aria-pressed={operator === "airtel"}
          >
            <img src="/Airtel_money.png" alt="Airtel Money" className="max-h-10 object-contain" />
          </button>
        </div>

        {/* Indicatif et numéro sur la même ligne (aspect groupé) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Numéro Mobile Money</label>
          <div className="flex">
            <Input
              className="w-28 rounded-r-none border-r-0 bg-muted"
              value={countryCode}
              readOnly
              aria-label="Indicatif"
            />
            <FormField
              control={form.control}
              name="phone"
              rules={{
                required: "Le numéro est requis",
                validate: (value) => {
                  if (!operator) return "Choisissez un opérateur"
                  if (operator === "mtn" && !/^06\d{7}$/.test(value)) {
                    return "MTN: format 06XXXXXXX (9 chiffres)"
                  }
                  if (operator === "airtel" && !/^05\d{7}$/.test(value)) {
                    return "Airtel: format 05XXXXXXX (9 chiffres)"
                  }
                  return true
                },
              }}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      className="rounded-l-none"
                      placeholder={operator === "airtel" ? "05XXXXXXX" : "06XXXXXXX"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Validation..." : "Valider"}
          </Button>
        </div>
      </form>
      {/* Modal de confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer le paiement Mobile Money"
        description={
          <div className="text-sm">
            <p className="mb-1">Opérateur: <b>{operator === "airtel" ? "Airtel Money" : operator === "mtn" ? "MTN MoMo" : "-"}</b></p>
            <p>Numéro: <b>{countryCode} {form.getValues("phone")}</b></p>
          </div>
        }
        confirmText="Valider"
        cancelText="Annuler"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          const fullPhone = `${countryCode} ${form.getValues("phone")}`
          setSubmitting(true)
          try {
            onValidate?.({ phone: fullPhone })
          } finally {
            setSubmitting(false)
            setConfirmOpen(false)
          }
        }}
      />
    </Form>
  )
}


