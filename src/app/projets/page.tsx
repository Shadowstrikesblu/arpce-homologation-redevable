"use client"

import { useState, useEffect } from 'react';
import { Dossier, TypeCle } from '@/types/types';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const projetsMock: Dossier[] = [
  {
    id: 1,
    idClient: 1,
    idStatut: 2,
    idModeReglement: 1,
    dateOuverture: '2024-01-15',
    numero: 'HOM-2024-001',
    libelle: 'Homologation smartphones Samsung Galaxy S24',
    statut: { id: 2, code: 'EN_COURS', libelle: 'En cours d\'instruction' },
    modeReglement: { id: 1, code: 'MOBILE', libelle: 'Mobile Money', mobileBanking: 1 },
    demandes: [
      {
        id: 1,
        idDossier: 1,
        idCategorie: 3,
        equipement: 'Smartphone Samsung Galaxy S24',
        quantiteEquipements: 500,
        contactNom: 'Jean Dupont',
        contactEmail: 'j.dupont@entreprise.com'
      }
    ]
  },
  {
    id: 2,
    idClient: 1,
    idStatut: 4,
    idModeReglement: 2,
    dateOuverture: '2023-11-20',
    numero: 'HOM-2023-045',
    libelle: 'Homologation routeurs Cisco série 8000',
    statut: { id: 4, code: 'VALIDE', libelle: 'Validé - Certificat délivré' },
    modeReglement: { id: 2, code: 'VIREMENT', libelle: 'Virement bancaire', mobileBanking: 0 },
    demandes: [
      {
        id: 2,
        idDossier: 2,
        idCategorie: 2,
        equipement: 'Routeur Cisco 8000',
        quantiteEquipements: 100,
        contactNom: 'Marie Lambert',
        contactEmail: 'm.lambert@entreprise.com'
      }
    ]
  },
  {
    id: 3,
    idClient: 1,
    idStatut: 3,
    idModeReglement: 1,
    dateOuverture: '2024-02-10',
    numero: 'HOM-2024-002',
    libelle: 'Homologation tablettes iPad Pro',
    statut: { id: 3, code: 'REJETE', libelle: 'Rejeté' },
    modeReglement: { id: 1, code: 'MOBILE', libelle: 'Mobile Money', mobileBanking: 1 },
    demandes: [
      {
        id: 3,
        idDossier: 3,
        idCategorie: 3,
        equipement: 'Tablette iPad Pro 12.9"',
        quantiteEquipements: 250,
        contactNom: 'Pierre Martin',
        contactEmail: 'p.martin@entreprise.com'
      }
    ]
  }
];

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-[#af3338] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
      >
        Précédent
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-lg transition-colors duration-200 ${
            currentPage === page 
              ? 'bg-[#af3338] text-white border-[#af3338]' 
              : 'border-gray-300 hover:bg-[#8ba755] hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-[#af3338] hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
      >
        Suivant
      </button>
    </div>
  );
};

const PageProjets = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des projets");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjets = projetsMock.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projetsMock.length / itemsPerPage);

  const handleProjetClick = (projetId: TypeCle) => {
    console.log('Navigation vers le projet:', projetId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#af3338] border-t-transparent mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-[#af3338] mb-6 font-semibold text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#af3338] hover:bg-[#8f2a2e] text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-[#af3338] mb-2">Mes demandes d'homologation</h1>
          <div className="w-20 h-1 bg-[#8ba755] rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#af3338] hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total des dossiers</h3>
            <p className="text-3xl font-bold text-[#af3338]">{projetsMock.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-[#8ba755] hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Dossiers validés</h3>
            <p className="text-3xl font-bold text-[#8ba755]">
              {projetsMock.filter(p => p.statut?.code === 'VALIDE').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-gray-400 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">En cours</h3>
            <p className="text-3xl font-bold text-gray-600">
              {projetsMock.filter(p => p.statut?.code === 'EN_COURS').length}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 mt-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#8ba755]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  N° Dossier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Libellé
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Équipement
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Quantité
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProjets.map((projet) => (
                <tr 
                  key={projet.id}
                  onClick={() => handleProjetClick(projet.id)}
                  className="hover:bg-[#f8f9fa] cursor-pointer transition-colors duration-150 group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#af3338] group-hover:text-[#8ba755] transition-colors">
                      {projet.numero}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {projet.libelle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {projet.demandes?.[0]?.equipement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(projet.dateOuverture).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      projet.statut?.code === 'VALIDE' 
                        ? 'bg-green-100 text-green-800 border border-green-200' :
                      projet.statut?.code === 'REJETE' 
                        ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {projet.statut?.libelle}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#8ba755]">
                      {projet.demandes?.[0]?.quantiteEquipements} unités
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageProjets;