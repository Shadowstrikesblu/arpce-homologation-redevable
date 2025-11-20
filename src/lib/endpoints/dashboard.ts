import axiosClient from "../utils/axiosBase";

export interface DashboardStatsInt {
  total: number;
  success: number;
  failed: number;
  inProgress: number;
  pendingPayments: number;
}

export interface StatutInt {
  id: string;
  code: string;
  libelle: string;
}

export interface DemandeInt {
  id: string;
  idDossier: string;
  numeroDemande: string;
  equipement: string;
  modele: string;
  marque: string;
}

export interface RecentFileInt {
  id: string;
  idClient: string;
  idStatut: string;
  idModeReglement: string;
  dateOuverture: string;
  numero: string;
  libelle: string;
  statut: StatutInt;
  demandes: DemandeInt[];
}

export interface PendingPaymentsInt {
  id: string;
  numeroDemande: string | null; 
  montant: number;
  dateEcheance: string;
  modeReglementLibelle: string;
}

export const dashboardStats = {
  getFile: async (): Promise<DashboardStatsInt> => {
    const { data } = await axiosClient.get("/api/dossiers/apercu");
    return data;
  },

  getRecentFile: async (): Promise<RecentFileInt> => {
    const { data } = await axiosClient.get("/api/dossiers/recents");
    return data;
  },

  getPendingPayments: async (dossierId: number): Promise<PendingPaymentsInt> => {
    const { data } = await axiosClient.get(`/api/dossiers/${dossierId}/paiement-en-attente`);
    return data;
  },
};
