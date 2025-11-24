import axiosClient from "@/lib/utils/axiosBase";
import {
  DashboardStats,
  RecentDemand,
  PendingPayment,
} from "@/lib/types/dashboard.types";

export const dashboardStats = {
  // Aperçu général du dashboard
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await axiosClient.get("/api/dossiers/apercu");
    return data;
  },

  // Dernières demandes
  getRecentDemand: async (): Promise<RecentDemand[]> => {
    const { data } = await axiosClient.get("/api/dossiers/recents");
    console.log(data)
    // si l'API renvoie un objet unique, on le met dans un tableau
    return Array.isArray(data) ? data : [data];
  },

  // Paiements en attente d’un dossier
  getPendingPayments: async (dossierId: string): Promise<PendingPayment[]> => {
    const { data } = await axiosClient.get(
      `/api/dossiers/${dossierId}/paiement-en-attente`
    ); // singulier
    return data;
  },
};
