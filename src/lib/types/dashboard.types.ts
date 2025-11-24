import { TypeCle } from "../interfaces/models.interface";

export interface DashboardStats {
  total: number;
  success: number;
  failed: number;
  inProgress: number;
  pendingPayments: number;
}

export interface RecentDemand {
  id: TypeCle;
  numero: string;
  demandes: string;
  statut: any
  dateOuverture: string;
  
}

export interface PendingPayment {
  id: TypeCle;
  numeroDossier: string;
  montant: number;
  dateEcheance: string;
  modeReglement: string;
}


export interface PendingBill {
  id: TypeCle;
  numeroDossier: string;
  montant: number;
  EquipementFacturation: [];
  dateCreation: string;

}