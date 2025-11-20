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
import projetsMock from "@/lib/mock/dossier.mock";
import { useRouter } from "next/navigation";
import SystemLoader from "@/lib/components/loader";
import { pathsUtils } from "@/lib/utils/path.util";
import { Pagination } from "@/lib/components/pagination";

type SortOption = "date_desc" | "date_asc" | "numero_asc";


const PageProjets = () => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date_desc");
  const router = useRouter()
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulation d'appel API
        await new Promise((resolve) => setTimeout(resolve, 800));
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement des dossiers"
        );
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Réinitialiser la page quand on change le filtre / tri
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOption]);

  const filteredAndSortedProjets = useMemo(() => {
    const lower = search.toLowerCase().trim();

    const filtered = projetsMock.filter((p) => {
      if (!lower) return true;

      const equipement = p.demandes?.[0]?.equipement ?? "";
      return (
        p.numero.toLowerCase().includes(lower) ||
        p.libelle.toLowerCase().includes(lower) ||
        equipement.toLowerCase().includes(lower)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "date_desc" || sortOption === "date_asc") {
        const da = new Date(a.dateOuverture).getTime();
        const db = new Date(b.dateOuverture).getTime();
        return sortOption === "date_desc" ? db - da : da - db;
      }

      // numero_asc
      return a.numero.localeCompare(b.numero, "fr");
    });

    return sorted;
  }, [search, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedProjets.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjets = filteredAndSortedProjets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  if (loading) {
    return <SystemLoader/>
  }

  if (error) {

  }

  return (
    <div className="space-y-8">

      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* Barre de filtres : recherche + tri */}
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
                <SelectItem value="date_desc">Date d&apos;ouverture (plus récent)</SelectItem>
                <SelectItem value="date_asc">Date d&apos;ouverture (plus ancien)</SelectItem>
                <SelectItem value="numero_asc">Numéro de dossier (A → Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table des dossiers */}
        <Card className="mt-4 p-5">
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
                    Quantité
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProjets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-sm text-gray-500">
                      Aucun dossier ne correspond à votre recherche.
                    </TableCell>
                  </TableRow>
                )}

                {currentProjets.map((projet) => (
                  <TableRow
                    key={projet.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(pathsUtils.projects + projet.id)}
                  >
                    <TableCell className="font-semibold text-[#af3338]">
                      {projet.numero}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {projet.libelle}
                    </TableCell>
                    <TableCell className="text-gray-600 whitespace-nowrap">
                      {new Date(projet.dateOuverture).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span
                        className={[
                          "inline-flex px-3 py-1 text-xs font-medium rounded-full border",
                          projet.statut?.code === "VALIDE"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : projet.statut?.code === "REJETE"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-blue-100 text-blue-800 border-blue-200",
                        ].join(" ")}
                      >
                        {projet.statut?.libelle}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-[#8ba755] whitespace-nowrap">
                      {projet.demandes?.[0]?.quantiteEquipements}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <p className="text-xs text-gray-500">
                Affichage de{" "}
                <span className="font-medium">
                  {filteredAndSortedProjets.length === 0
                    ? 0
                    : indexOfFirstItem + 1}
                </span>{" "}
                à{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredAndSortedProjets.length)}
                </span>{" "}
                sur{" "}
                <span className="font-medium">
                  {filteredAndSortedProjets.length}
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
