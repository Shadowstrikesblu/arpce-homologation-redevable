"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileMoneyForm } from "./mobile-money-form"
import { PaiementUpload } from "./paiement-upload"

type Mode = "mobile_money" | "bank"

type ModePaiementProps = {
  defaultMode?: Mode
  onMobileMoneyValidate?: (payload: { phone: string }) => void
  onUpload?: (mode: "bank", files: File[]) => void
}

export function ModePaiement({
  defaultMode = "mobile_money",
  onMobileMoneyValidate,
  onUpload,
}: ModePaiementProps) {
  const [current, setCurrent] = React.useState<Mode>(defaultMode)

  return (
    <Card>

      <CardHeader>
        <CardTitle className="text-base">Mode de règlement</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        
        <Tabs value={current} onValueChange={(v) => setCurrent(v as Mode)} className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="mobile_money">Mobile Money</TabsTrigger>
            <TabsTrigger value="bank">Virement / Dépôt bancaire</TabsTrigger>
          </TabsList>

          <TabsContent value="mobile_money" className="space-y-2">
            <MobileMoneyForm onValidate={(val) => onMobileMoneyValidate?.(val)} />
          </TabsContent>

          <TabsContent value="bank" className="space-y-2">
            <PaiementUpload
              title="Justificatif de virement ou dépôt bancaire"
              multiple={false}
              maxSizeMb={10}
              accept=".pdf,.jpg,.jpeg,.png"
              onFiles={(files) => onUpload?.("bank", files)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


