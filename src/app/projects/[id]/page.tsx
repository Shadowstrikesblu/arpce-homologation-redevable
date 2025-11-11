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
import { ArrowLeft } from "lucide-react";


const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR");
};

const getStatutBadgeClasses = (code?: string) => {
  switch (code) {
    case "VALIDE":
      return "bg-green-100 text-green-800 border border-green-200";
    case "REJETE":
      return "bg-red-100 text-red-800 border border-red-200";
    case "EN_COURS":
      return "bg-blue-100 text-blue-800 border border-blue-200";
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

  const isValide = statutCode === "VALIDE";
  const isRejete = statutCode === "REJETE";
  const isEnCours = statutCode === "EN_COURS";

  const onBack = ()=>{
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header + action */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div>
              <ArrowLeft/>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Dossier n°</p>
              <h1 className="text-3xl font-bold text-[#af3338]">
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

        {/* Alerte selon le statut */}
        {isValide && (
          <Alert className="border-green-200 bg-green-50">
            <AlertTitle>Dossier validé</AlertTitle>
            <AlertDescription>
              Ce dossier est validé. Les attestations associées sont
              disponibles dans l&apos;onglet <b>Demandes &amp; attestations</b>.
            </AlertDescription>
          </Alert>
        )}

        {isRejete && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTitle>Dossier rejeté</AlertTitle>
            <AlertDescription>
              Ce dossier a été rejeté. Les motifs de rejet sont visibles dans
              l&apos;onglet <b>Demandes &amp; attestations</b>.
            </AlertDescription>
          </Alert>
        )}

        {isEnCours && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTitle>Dossier en cours d&apos;instruction</AlertTitle>
            <AlertDescription>
              Votre dossier est actuellement en cours de traitement par
              l&apos;administration.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs principales */}
        <Tabs defaultValue="dossier" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dossier">Informations dossier</TabsTrigger>
            <TabsTrigger value="demandes">Demandes &amp; attestations</TabsTrigger>
            <TabsTrigger value="reglement">Mode de règlement</TabsTrigger>
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
                      {/* Adapter selon ton interface Client */}
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
                    <span className="text-gray-500">Commentaires</span>
                    <span className="font-medium">
                      {dossier.commentaires?.length ?? 0}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet demandes & attestations */}
          <TabsContent value="demandes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demandes</CardTitle>
                <CardDescription>
                  Liste des demandes associées à ce dossier, avec les
                  informations d&apos;équipements et les attestations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!hasDemandes && (
                  <p className="text-sm text-gray-500">
                    Aucune demande n&apos;est associée à ce dossier.
                  </p>
                )}

                {dossier.demandes?.map((demande) => {
                  const hasAttestations =
                    (demande.attestations?.length ?? 0) > 0;

                  return (
                    <div
                      key={demande.id}
                      className="border rounded-lg p-4 bg-white space-y-4"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500">
                            Demande n°
                            {demande.numeroDemande ?? demande.id}
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

                      {/* Affichage conditionnel REJETÉ : Motif de rejet */}
                      {isRejete && demande.motifRejet && (
                        <>
                          <Separator />
                          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                            <span className="font-semibold">
                              Motif de rejet :
                            </span>{" "}
                            {/* adapter selon ton interface MotifRejet */}
                            {demande.motifRejet.libelle ??
                              demande.motifRejet.toString()}
                          </div>
                        </>
                      )}

                      {/* Affichage conditionnel VALIDE : Attestations */}
                      {isValide && hasAttestations && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">
                              Attestations délivrées
                            </p>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">
                                    ID
                                  </TableHead>
                                  <TableHead className="text-xs">
                                    Date de délivrance
                                  </TableHead>
                                  <TableHead className="text-xs">
                                    Date d&apos;expiration
                                  </TableHead>
                                  <TableHead className="text-xs">
                                    Format
                                  </TableHead>
                                  <TableHead className="text-xs text-right">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {demande.attestations?.map((attestation) => (
                                  <TableRow key={attestation.id}>
                                    <TableCell className="text-xs">
                                      {attestation.id}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      {formatDate(
                                        attestation.dateDelivrance
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      {formatDate(
                                        attestation.dateExpiration
                                      )}
                                    </TableCell>
                                    <TableCell className="text-xs">
                                      {attestation.extension}
                                    </TableCell>
                                    <TableCell className="text-xs text-right">
                                      {/* A brancher sur ton backend de téléchargement */}
                                      <Button
                                        size="sm"
                                        variant="outline"
                                      >
                                        Télécharger
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet mode de règlement */}
          <TabsContent value="reglement">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Mode de règlement
                </CardTitle>
                <CardDescription>
                  Informations sur le mode de paiement choisi pour ce dossier.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Code</span>
                  <span className="font-medium">
                    {dossier.modeReglement?.code ?? "-"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500">Libellé</span>
                  <span className="font-medium">
                    {dossier.modeReglement?.libelle ?? "-"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobile Banking</span>
                  <span className="font-medium">
                    {dossier.modeReglement?.mobileBanking === 1
                      ? "Oui"
                      : "Non"}
                  </span>
                </div>
                {dossier.modeReglement?.remarques && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-gray-500 text-sm">
                        Remarques
                      </span>
                      <p className="text-xs text-gray-700 mt-1">
                        {dossier.modeReglement.remarques}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default DossierDetails;
