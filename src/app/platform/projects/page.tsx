"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import SystemLoader from "@/lib/components/loader";
import { pathsUtils } from "@/lib/utils/path.util";
import { Pagination } from "@/lib/components/pagination";
import { dossiers, ListeDossiersParams, DossierListItem } from "@/lib/endpoints/dossiers";
import { HumanDate } from "@/lib/utils/date.util";


type SortOption = "date_desc" | "date_asc" | "numero_asc";

const PageProjets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date_desc");
  const [dossiersData, setDossiersData] = useState<DossierListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const itemsPerPage = 10;

  // Fonction pour charger les dossiers
  const fetchDossiers = async (page: number, recherche?: string, trierPar?: string, ordre?: string) => {
    try {

      setLoading(true);
      setError(null);

      const params: ListeDossiersParams = {
        Page: page,
        TaillePage: itemsPerPage,
        Recherche: recherche || undefined,
        TrierPar: trierPar,
        Ordre: ordre,
      };

      const response = await dossiers.liste(params);
    
      setDossiersData(response.dossiers);
      setTotalPages(response.totalPage);
      setTotalItems(response.dossiers.length); 
      
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement des dossiers"
      );
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trierPar = getTrierPar(sortOption);
    const ordre = getOrdre(sortOption);
    
    fetchDossiers(currentPage, search, trierPar, ordre);
    
  }, [currentPage, search, sortOption]);

  const getTrierPar = (sortOption: SortOption): string => {
    switch (sortOption) {
      case "date_desc":
      case "date_asc":
        return "DateOuverture";
      case "numero_asc":
        return "Numero";
      default:
        return "DateOuverture";
    }
  };

  const getOrdre = (sortOption: SortOption): string => {
    switch (sortOption) {
      case "date_desc":
        return "desc";
      case "date_asc":
        return "asc";
      case "numero_asc":
        return "asc";
      default:
        return "desc";
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (loading && dossiersData.length === 0) {
    return <SystemLoader />;
  }

  return (
    <div className="space-y-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <Card className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Recherche
            </label>
            <Input
              placeholder="Rechercher par n° de dossier, libellé ou équipement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-full md:w-64">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Trier par
            </label>
            <Select
              value={sortOption}
              onValueChange={(value: SortOption) => setSortOption(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un tri" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date d'ouverture (plus récent)</SelectItem>
                <SelectItem value="date_asc">Date d'ouverture (plus ancien)</SelectItem>
                <SelectItem value="numero_asc">Numéro de dossier (A → Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="mt-4 p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-white uppercase text-xs font-semibold">
                    N° Dossier
                  </TableHead>
                  <TableHead className="text-white uppercase text-xs font-semibold">
                    Libellé
                  </TableHead>
                  <TableHead className="text-white uppercase text-xs font-semibold">
                    Date
                  </TableHead>
                  <TableHead className="text-white uppercase text-xs font-semibold">
                    Statut
                  </TableHead>
                  <TableHead className="text-white uppercase text-xs font-semibold">
                    Équipement
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dossiersData.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-sm text-gray-500">
                      {search ? "Aucun dossier ne correspond à votre recherche." : "Aucun dossier trouvé."}
                    </TableCell>
                  </TableRow>
                )}

                {dossiersData.map((dossier) => (
                  <TableRow
                    key={dossier.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(pathsUtils.projects + dossier.id)}
                  >
                    <TableCell className="font-semibold text-[#af3338]">
                      {dossier.numero}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {dossier.libelle}
                    </TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap">
                      {HumanDate.format(dossier.dateOuverture)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span
                        className={[
                          "inline-flex px-3 py-1 text-xs font-medium rounded-full border",
                          dossier.statut?.code === "VALIDE" || dossier.statut?.libelle?.toUpperCase().includes("VALIDE")
                            ? "bg-green-100 text-green-800 border-green-200"
                            : dossier.statut?.code === "REJETE" || dossier.statut?.libelle?.toUpperCase().includes("REJETE")
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-blue-100 text-blue-800 border-blue-200",
                        ].join(" ")}
                      >
                        {dossier.statut?.libelle}
                      </span>
                    </TableCell>

                    <TableCell className="font-semibold text-[#8ba755] whitespace-nowrap">
                      {projet.demandes?.[0]?.quantiteEquipements}
                    </TableCell>
                  </TableRow>
                ))}

                {loading && dossiersData.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#af3338]"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="border-t px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-xs text-gray-500">
                Affichage de{" "}
                <span className="font-medium">
                  {dossiersData.length === 0 ? 0 : indexOfFirstItem}
                </span>{" "}
                à{" "}
                <span className="font-medium">
                  {indexOfLastItem}
                </span>{" "}
                sur{" "}
                <span className="font-medium">
                  {totalItems}
                </span>{" "}
                dossier(s)
              </p>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PageProjets;