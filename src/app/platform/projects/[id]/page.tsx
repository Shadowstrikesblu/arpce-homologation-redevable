"use client";

import { Dossier } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import { use, useMemo } from "react";
import projetsMock from "@/lib/mock/dossier.mock";
import { ArrowLeft, Download, FileText, CreditCard } from "lucide-react";
import { AttestationCard } from "@/lib/components/attestationCard";
import { PaymentCard } from "@/lib/components/payment/paymentCard";
import { pathsUtils } from "@/lib/utils/path.util";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR");
};

const getStatutBadgeClasses = (code?: string) => {
  switch (code) {
    case "REALISEE":
    case "ATTESTATION_DISPONIBLE":
      return "bg-green-100 text-green-800 border border-green-200";
    case "ANNULEE":
      return "bg-red-100 text-red-800 border border-red-200";
    case "EN_COURS_INSTRUCTION":
    case "ATTENTE_INSTRUCTION":
    case "EN_ATTENTE_APPROBATION":
    case "EQUIPEMENT_POINTS_HOMOLOGATION":
    case "PAIEMENT_EFFECTUE":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "EN_ATTENTE_PAIEMENT":
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

interface Props {
  params: Promise<{ id: string }>
}

const DossierDetails = ({params} : Props ) => {
  
  const router = useRouter()
  const { id } = use(params)

  const dossier = useMemo(
    () => projetsMock.find((prev) => prev.id === Number(id)),
    [params]
  );

  if(!dossier) return;

  const statutCode = dossier.statut?.code;
  const statutLibelle = dossier.statut?.libelle ?? "Statut inconnu";

  const hasDemandes = (dossier.demandes?.length ?? 0) > 0;
  const hasAttestations = (dossier.attestations?.length ?? 0) > 0;

  // Conditions basées sur les NOUVEAUX statuts
  const isRealisee = statutCode === "REALISEE";
  const isAttestationDisponible = statutCode === "ATTESTATION_DISPONIBLE";
  const isAnnulee = statutCode === "ANNULEE";
  const isEnAttentePaiement = statutCode === "EN_ATTENTE_PAIEMENT";
  const isEnCoursInstruction = statutCode === "EN_COURS_INSTRUCTION";
  const isAttenteInstruction = statutCode === "ATTENTE_INSTRUCTION";
  const isEnAttenteApprovation = statutCode === "EN_ATTENTE_APPROBATION";
  const isEquipementPointsHomologation = statutCode === "EQUIPEMENT_POINTS_HOMOLOGATION";
  const isPaiementEffectue = statutCode === "PAIEMENT_EFFECTUE";

  // Statuts qui affichent la page normale sans sections spéciales
  const isStatutNormal = isEnCoursInstruction || isAttenteInstruction || 
                        isEnAttenteApprovation || isEquipementPointsHomologation || 
                        isPaiementEffectue;

  // CORRECTION : Les attestations sont maintenant au niveau du DOSSIER
  const premiereAttestation = dossier.attestations?.[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header + action */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center justify-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Dossier n°</p>
              <h1 className="text-3xl font-bold text-primary">
                {dossier.numero}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Ouvert le{" "}
                <span className="font-medium">
                  {formatDate(dossier.dateOuverture)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge
              className={
                "text-xs px-3 py-1 rounded-full " +
                getStatutBadgeClasses(statutCode)
              }
            >
              {statutLibelle}
            </Badge>
            
            {/* Boutons conditionnels selon le statut */}
            {isEnAttentePaiement && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => router.push(pathsUtils.projects + id + "/payment")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Procéder au paiement
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger la facture
                </Button>
              </div>
            )}

            {(isRealisee || isAttestationDisponible) && premiereAttestation && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le certificat
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Libellé principal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Libellé du dossier</CardTitle>
            <CardDescription>
              Description courte de l&apos;objet de la demande.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">{dossier.libelle}</p>
          </CardContent>
        </Card>

        {isEnAttentePaiement && (
          <PaymentCard 
            dossier={dossier} 
            onPaymentClick={() => router.push(pathsUtils.projects + id + "/payment")}
          />
        )}

        {(isRealisee || isAttestationDisponible) && premiereAttestation && (
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Certificat d'homologation
              </CardTitle>
              <CardDescription>
                Votre certificat d'homologation est disponible au téléchargement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Date d'émission</p>
                  <p className="text-lg font-semibold">
                    {formatDate(premiereAttestation.dateDelivrance)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Date d'expiration</p>
                  <p className="text-lg font-semibold">
                    {formatDate(premiereAttestation.dateExpiration)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Format</p>
                  <p className="text-lg font-semibold uppercase">
                    {premiereAttestation.extension}
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Important :</strong> Votre certificat est valable jusqu'au {formatDate(premiereAttestation.dateExpiration)}. 
                  Pensez à renouveler votre homologation avant cette date.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {(isRealisee || isAttestationDisponible) && (
          <Alert className="border-green-200 bg-green-50">
            <AlertTitle>
              {isRealisee ? "Dossier réalisé" : "Attestation disponible"}
            </AlertTitle>
            <AlertDescription>
              {isRealisee 
                ? "Ce dossier est réalisé. Les attestations associées sont disponibles ci-dessous."
                : "Votre attestation d'homologation est disponible. Vous pouvez la télécharger ci-dessous."
              }
            </AlertDescription>
          </Alert>
        )}

        {isAnnulee && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTitle>Dossier annulé</AlertTitle>
            <AlertDescription>
              Ce dossier a été annulé. Les détails sont disponibles dans l'onglet Equipements.
            </AlertDescription>
          </Alert>
        )}

        {isEnAttentePaiement && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTitle>Paiement en attente</AlertTitle>
            <AlertDescription>
              Votre dossier est en attente de paiement. Veuillez procéder au règlement pour finaliser votre demande d'homologation.
            </AlertDescription>
          </Alert>
        )}

        {isStatutNormal && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTitle>Dossier en cours de traitement</AlertTitle>
            <AlertDescription>
              Votre dossier est actuellement en cours de traitement par
              l&apos;administration. Vous serez notifié des prochaines étapes.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs principales */}
        <Tabs defaultValue="dossier" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dossier">Informations dossier</TabsTrigger>
            <TabsTrigger value="demandes">Equipements</TabsTrigger>
            {(isRealisee || isAttestationDisponible) && hasAttestations && (
              <TabsTrigger value="attestations">Attestations</TabsTrigger>
            )}
          </TabsList>

          {/* Onglet informations dossier */}
          <TabsContent value="dossier">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    Informations générales
                  </CardTitle>
                  <CardDescription>
                    Données de base du dossier d&apos;homologation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Numéro dossier</span>
                    <span className="font-medium">{dossier.numero}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date d&apos;ouverture</span>
                    <span className="font-medium">
                      {formatDate(dossier.dateOuverture)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Client</span>
                    <span className="font-medium">
                      #{dossier.idClient}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Statut</span>
                    <span className="font-medium">{statutLibelle}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Synthèse</CardTitle>
                  <CardDescription>
                    Vue rapide sur les demandes, devis et documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nombre de demandes</span>
                    <span className="font-medium">
                      {dossier.demandes?.length ?? 0}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nombre de devis</span>
                    <span className="font-medium">
                      {dossier.devis?.length ?? 0}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nombre de documents</span>
                    <span className="font-medium">
                      {dossier.documents?.length ?? 0}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nombre d'attestations</span>
                    <span className="font-medium">
                      {dossier.attestations?.length ?? 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet demandes */}
          <TabsContent value="demandes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Equipements</CardTitle>
                <CardDescription>
                  Liste des équipements associés à ce dossier.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasDemandes && (
                  <p className="text-sm text-gray-500">
                    Aucun équipement n&apos;est associé à ce dossier.
                  </p>
                )}

                {dossier.demandes?.map((demande) => (
                  <div
                    key={demande.id}
                    className="border rounded-lg p-4 bg-white space-y-4"
                  >
                    <div className="flex flex-wrap justify-between gap-2">
                      <div>
                        <p className="text-xs text-gray-500">
                          Demande n° {demande.numeroDemande ?? demande.id}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {demande.equipement ?? "Équipement non renseigné"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {demande.marque && (
                            <>
                              Marque :{" "}
                              <span className="font-medium">
                                {demande.marque}
                              </span>
                              {" · "}
                            </>
                          )}
                          {demande.modele && (
                            <>
                              Modèle :{" "}
                              <span className="font-medium">
                                {demande.modele}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>
                          Quantité :{" "}
                          <span className="font-semibold text-gray-800">
                            {demande.quantiteEquipements ?? "-"}
                          </span>
                        </p>
                        {demande.contactNom && (
                          <p className="mt-1">
                            Contact :{" "}
                            <span className="font-medium">
                              {demande.contactNom}
                            </span>
                          </p>
                        )}
                        {demande.contactEmail && (
                          <p className="mt-0.5">
                            <span className="font-mono">
                              {demande.contactEmail}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {demande.description && (
                      <>
                        <Separator />
                        <div className="text-xs text-gray-600">
                          <span className="font-semibold">
                            Description :
                          </span>{" "}
                          {demande.description}
                        </div>
                      </>
                    )}

                    {/* Affichage conditionnel ANNULEE : Motif */}
                    {isAnnulee && demande.motifRejet && (
                      <>
                        <Separator />
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                          <span className="font-semibold">
                            Motif d'annulation :
                          </span>{" "}
                          {demande.motifRejet.libelle ?? demande.motifRejet.toString()}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {(isRealisee || isAttestationDisponible) && hasAttestations && (
            <TabsContent value="attestations">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Attestations d'homologation</CardTitle>
                  <CardDescription>
                    Liste des attestations délivrées pour ce dossier.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">ID</TableHead>
                        <TableHead className="text-xs">Demande associée</TableHead>
                        <TableHead className="text-xs">Date de délivrance</TableHead>
                        <TableHead className="text-xs">Date d'expiration</TableHead>
                        <TableHead className="text-xs">Format</TableHead>
                        <TableHead className="text-xs text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dossier.attestations?.map((attestation) => (
                        <TableRow key={attestation.id}>
                          <TableCell className="text-xs">
                            {attestation.id}
                          </TableCell>
                          <TableCell className="text-xs">
                            Demande #{attestation.idDemande}
                          </TableCell>
                          <TableCell className="text-xs">
                            {formatDate(attestation.dateDelivrance)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {formatDate(attestation.dateExpiration)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {attestation.extension}
                          </TableCell>
                          <TableCell className="text-xs text-right">
                            <Button size="sm" variant="outline">
                              <Download className="w-3 h-3 mr-1" />
                              Télécharger
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DossierDetails;