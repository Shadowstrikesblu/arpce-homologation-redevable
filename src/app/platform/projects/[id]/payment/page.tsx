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
  Landmark,
  CheckCircle2,
  Loader,
  AlertTriangle
} from "lucide-react"
import { useRouter } from "next/navigation"

const MOBILE_MONEY_FEE_RATE = 0.015

const formatCfa = (value: number) =>
  `${new Intl.NumberFormat("fr-FR").format(Math.round(value))} FCFA`

const sanitizeRib = (value: string) => value.replace(/\s+/g, "").toUpperCase()

const RIB_ARPCE = {
  titulaire: process.env["NEXT_PUBLIC_ARPCE_RIB_TITULAIRE"] ?? "Autorité de Régulation des Communications Électroniques et des Postes",
  banque: process.env["NEXT_PUBLIC_ARPCE_RIB_BANQUE"] ?? "Banque de l'ARPCE",
  numero: process.env["NEXT_PUBLIC_ARPCE_RIB_NUMERO"] ?? "XXXXXXXXXXXXXX",
  agence: process.env["NEXT_PUBLIC_ARPCE_RIB_AGENCE"] ?? "Agence principale",
  swift: process.env["NEXT_PUBLIC_ARPCE_RIB_SWIFT"] ?? "SWIFTCGCG",
}

const RIB_BANQUE = {
  banque: process.env["NEXT_PUBLIC_BANQUE_PARTENAIRE"] ?? "Banque partenaire",
  adresse: process.env["NEXT_PUBLIC_BANQUE_PARTENAIRE_ADRESSE"] ?? "Adresse non renseignée",
  contact: process.env["NEXT_PUBLIC_BANQUE_PARTENAIRE_CONTACT"] ?? "+242 XX XX XX XX",
}

// Types
type PaymentMode = "mobile_money" | "depot" | "virement"

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
    fees: number
    totalWithFees: number
  }
  depot?: {
    files: File[]
  }
  virement?: {
    files: File[]
    rib: string
    sameBank: boolean
  }
}

// Composant PaiementUpload
function PaiementUpload({
  title,
  accept = ".pdf",
  multiple = false,
  maxSizeMb = 3,
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
        type="upload"
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
  const [depositFiles, setDepositFiles] = React.useState<File[]>([])
  const [transferFiles, setTransferFiles] = React.useState<File[]>([])
  const [userRib, setUserRib] = React.useState("")

  const mobileFees = React.useMemo(() => {
    if (!montant) return 0
    return montant * MOBILE_MONEY_FEE_RATE
  }, [montant])

  const totalWithFees = (montant ?? 0) + mobileFees

  const handleMobileMoneyValidate = (values: MobileMoneyFormValues) => {
    const operator = values.phone.includes("05") ? "airtel" : "mtn" as "mtn" | "airtel"
    
    onPaiementSubmit({
      mode: "mobile_money",
      mobileMoney: {
        phone: values.phone,
        operator,
        fees: mobileFees,
        totalWithFees
      }
    })
  }

  const handleDepositUpload = (files: File[]) => {
    setDepositFiles(files)
  }

  const handleTransferUpload = (files: File[]) => {
    setTransferFiles(files)
  }

  const handleFinaliserPaiement = () => {
    if (currentMode === "mobile_money") {
      // Le paiement mobile money est déjà soumis via la validation du formulaire
      return
    }
    
    if (currentMode === "depot" && depositFiles.length > 0) {
      onPaiementSubmit({
        mode: "depot",
        depot: {
          files: depositFiles
        }
      })
      return
    }

    if (currentMode === "virement" && transferFiles.length > 0) {
      onPaiementSubmit({
        mode: "virement",
        virement: {
          files: transferFiles,
          rib: userRib,
          sameBank: sanitizeRib(userRib) !== "" && sanitizeRib(userRib) === sanitizeRib(RIB_ARPCE.numero)
        }
      })
    }
  }

  const isDepositReady = currentMode === "depot" && depositFiles.length > 0
  const isTransferReady = currentMode === "virement" && transferFiles.length > 0 && sanitizeRib(userRib).length >= 10
  const isDifferentBank =
    sanitizeRib(userRib).length >= 10 &&
    sanitizeRib(userRib) !== sanitizeRib(RIB_ARPCE.numero)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
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
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="mobile_money" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </TabsTrigger>
                    <TabsTrigger value="depot" className="flex items-center gap-2">
                      <Landmark className="h-4 w-4" />
                      Dépôt bancaire
                    </TabsTrigger>
                    <TabsTrigger value="virement" className="flex items-center gap-2">
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
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                      <div className="flex items-center justify-between">
                        <p>Frais de transaction ({(MOBILE_MONEY_FEE_RATE * 100).toFixed(1)}%)</p>
                        <p className="font-semibold">{formatCfa(mobileFees)}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-gray-900">
                        <p>Total débité</p>
                        <p className="font-semibold">{formatCfa(totalWithFees)}</p>
                      </div>
                    </div>
                    <MobileMoneyForm onValidate={handleMobileMoneyValidate} />
                  </TabsContent>

                  <TabsContent value="depot" className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-green-900">Dépôt bancaire (frais 0 FCFA)</h3>
                      <p className="text-green-700 text-sm">
                        Présentez-vous à la banque partenaire et effectuez un dépôt direct sur le compte de l&apos;ARPCE. 
                        Enregistrez ensuite le bordereau signé pour finaliser la procédure.
                      </p>
                      <div className="rounded-lg bg-white p-4 shadow-sm border border-green-100 space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Coordonnées bancaires ARPCE</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium text-gray-800">Titulaire :</span> {RIB_ARPCE.titulaire}</p>
                          <p><span className="font-medium text-gray-800">Banque :</span> {RIB_ARPCE.banque}</p>
                          <p><span className="font-medium text-gray-800">N° RIB :</span> {RIB_ARPCE.numero}</p>
                          <p><span className="font-medium text-gray-800">Agence :</span> {RIB_ARPCE.agence}</p>
                          <p><span className="font-medium text-gray-800">Code SWIFT :</span> {RIB_ARPCE.swift}</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm border border-green-100 space-y-1">
                        <p className="text-sm font-semibold text-gray-700">Informations banque partenaire</p>
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Banque :</span> {RIB_BANQUE.banque}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Adresse :</span> {RIB_BANQUE.adresse}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Contact :</span> {RIB_BANQUE.contact}</p>
                      </div>
                    </div>
                    <PaiementUpload
                      title="Bordereau de dépôt signé"
                      multiple={false}
                      maxSizeMb={10}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onFiles={handleDepositUpload}
                    />

                    {isDepositReady && (
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

                  <TabsContent value="virement" className="space-y-4">
                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-2">
                      <h3 className="font-semibold text-sky-900">Virement bancaire</h3>
                      <p className="text-sky-700 text-sm">
                        Indiquez le RIB du compte émetteur. Si votre banque est différente de celle de l&apos;ARPCE, des frais interbancaires peuvent s&apos;appliquer.
                      </p>
                      <div className="rounded-lg bg-white p-4 shadow-sm border border-sky-100">
                        <p className="text-sm font-semibold text-gray-700 mb-2">RIB de référence ARPCE</p>
                        <p className="text-sm text-gray-600">{RIB_ARPCE.numero}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        RIB du redevable (compte émetteur)
                      </label>
                      <Input
                        placeholder="Ex : 10015 00100 12345678901 09"
                        value={userRib}
                        onChange={(event) => setUserRib(event.target.value)}
                      />
                      {isDifferentBank && (
                        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                          <AlertTriangle className="h-4 w-4 mt-0.5" />
                          <p>
                            Votre RIB est différent de celui de l&apos;ARPCE. 
                            Des frais supplémentaires pourront être appliqués par votre banque pour ce virement.
                          </p>
                        </div>
                      )}
                    </div>

                    <PaiementUpload
                      title="Justificatif de virement (ordre, capture, PDF)"
                      multiple={false}
                      maxSizeMb={10}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onFiles={handleTransferUpload}
                    />

                    {isTransferReady && (
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
                          Finaliser le virement
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