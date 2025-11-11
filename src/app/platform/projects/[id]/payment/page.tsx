"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/lib/components/confirm-dialog"
import { FileUploader } from "@/lib/components/upload"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle2,
  ArrowLeft,
  Loader
} from "lucide-react"
import { useRouter } from "next/navigation"

// Types
type PaymentMode = "mobile_money" | "bank"

type MobileMoneyFormValues = {
  phone: string
}

type PaiementUploadProps = {
  title: string
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  onFiles?: (files: File[]) => void
}

type PaymentData = {
  mode: PaymentMode
  mobileMoney?: {
    phone: string
    operator: "mtn" | "airtel"
  }
  bankTransfer?: {
    files: File[]
  }
}

// Composant PaiementUpload
function PaiementUpload({
  title,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  maxSizeMb = 10,
  onFiles,
}: PaiementUploadProps) {
  const handleFiles = React.useCallback(
    (files: File[]) => {
      onFiles?.(files)
    },
    [onFiles]
  )

  return (
    <div className="space-y-2">
      <FileUploader
        title={title}
        accept={accept}
        multiple={multiple}
        maxSizeMb={maxSizeMb}
        onFiles={handleFiles}
      />
    </div>
  )
}

// Composant MobileMoneyForm
function MobileMoneyForm({ 
  onValidate, 
  defaultPhone 
}: { 
  onValidate?: (values: MobileMoneyFormValues) => void 
  defaultPhone?: string 
}) {
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

// Composant principal EcranPaiement
interface EcranPaiementProps {
  montant: number
  reference: string
  description?: string
  onPaiementSubmit: (data: PaymentData) => void
  loading?: boolean
  defaultMode?: PaymentMode
}

export default function ScreenPaiement({
  montant,
  reference,
  description = "Paiement pour demande d'homologation",
  onPaiementSubmit,
  loading = false,
  defaultMode = "mobile_money"
}: EcranPaiementProps) {
  const router = useRouter()
  const [currentMode, setCurrentMode] = React.useState<PaymentMode>(defaultMode)
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])

  const handleMobileMoneyValidate = (values: MobileMoneyFormValues) => {
    const operator = values.phone.includes("05") ? "airtel" : "mtn" as "mtn" | "airtel"
    
    onPaiementSubmit({
      mode: "mobile_money",
      mobileMoney: {
        phone: values.phone,
        operator
      }
    })
  }

  const handleBankUpload = (files: File[]) => {
    setUploadedFiles(files)
    onPaiementSubmit({
      mode: "bank",
      bankTransfer: {
        files
      }
    })
  }

  const handleFinaliserPaiement = () => {
    if (currentMode === "mobile_money") {
      // Le paiement mobile money est déjà soumis via la validation du formulaire
      return
    }
    
    if (currentMode === "bank" && uploadedFiles.length > 0) {
      onPaiementSubmit({
        mode: "bank",
        bankTransfer: {
          files: uploadedFiles
        }
      })
    }
  }

  const isBankReady = currentMode === "bank" && uploadedFiles.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finaliser le paiement</h1>
            <p className="text-gray-600 mt-1">Choisissez votre mode de règlement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Mode de paiement */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#af3338]" />
                  Mode de règlement
                </CardTitle>
                <CardDescription>
                  Sélectionnez votre méthode de paiement préférée
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs value={currentMode} onValueChange={(v) => setCurrentMode(v as PaymentMode)} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="mobile_money" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </TabsTrigger>
                    <TabsTrigger value="bank" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Virement bancaire
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="mobile_money" className="space-y-4">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
                      <h3 className="font-semibold text-zinc-900 mb-2">Paiement par Mobile Money</h3>
                      <p className="text-zinc-700 text-sm">
                        Sélectionnez votre opérateur et saisissez votre numéro. 
                        Vous recevrez une demande de paiement sur votre téléphone.
                      </p>
                    </div>
                    <MobileMoneyForm onValidate={handleMobileMoneyValidate} />
                  </TabsContent>

                  <TabsContent value="bank" className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Virement ou dépôt bancaire</h3>
                      <p className="text-green-700 text-sm">
                        Effectuez le virement puis uploadez votre justificatif. 
                        Votre demande sera traitée après vérification.
                      </p>
                    </div>
                    <PaiementUpload
                      title="Justificatif de virement ou dépôt bancaire"
                      multiple={false}
                      maxSizeMb={10}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onFiles={handleBankUpload}
                    />
                    
                    {isBankReady && (
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleFinaliserPaiement}
                          disabled={loading}
                          className="bg-[#af3338] hover:bg-[#9a2d32]"
                        >
                          {loading ? (
                            <Loader className="mr-2 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                          )}
                          Finaliser le dépôt
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale - Récapitulatif */}
          <div className="space-y-6">
            {/* Récapitulatif de la commande */}
            <Card>
              <CardHeader className="bg-primary border-b">
                <CardTitle className="text-lg text-white">Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Montant à payer</span>
                    <span className="text-2xl font-bold text-[#af3338]">
                      {montant?.toLocaleString() ?? 200000} FCFA
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Référence</span>
                      <Badge variant="secondary">{reference}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description</span>
                      <span className="text-right">{description}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Support */}
            <Card>
              <CardHeader className="bg-secondary border-b">
                <CardTitle className="text-lg text-white">Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-3">
                  En cas de difficulté avec le paiement, contactez notre support.
                </p>
                <Button variant="outline" className="w-full">
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}