"use client"

import * as React from "react"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

  const onSubmit = async (values: MobileMoneyFormValues) => {
    setSubmitting(true)
    try {
      onValidate?.(values)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="phone"
          rules={{
            required: "Le numéro est requis",
            pattern: {
              value: /^\+242\s?0\d{8}$/,
              message: "Format attendu: +242 0XXXXXXXX",
            },
          }}
          render={({ field }) => (
            
            <FormItem>
              <FormLabel>Numéro de téléphone (Mobile Money)</FormLabel>
                <FormControl>
                  <Input placeholder="+242 066000000" {...field} />
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Validation..." : "Valider"}
          </Button>
        </div>
      </form>
    </Form>
  )
}


