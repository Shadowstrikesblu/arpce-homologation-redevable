// Types de base ESSENTIELS
export type TypeCle = number;
export type TypeCode = string;
export type TypeLibelle = string;
export type TypeDate = string;

// Interfaces UNIQUEMENT nécessaires pour la page projets
export interface Dossier {
  id: TypeCle;
  idClient: TypeCle;
  idStatut: TypeCle;
  idModeReglement: TypeCle;
  dateOuverture: TypeDate;
  numero: TypeCode;
  libelle: TypeLibelle;

  // Relations SEULEMENT pour l'affichage
  statut?: Statut;
  modeReglement?: ModeReglement;
  demandes?: Demande[];
}

export interface Statut {
  id: TypeCle;
  code: TypeCode;
  libelle: TypeLibelle;
}

export interface ModeReglement {
  id: TypeCle;
  code: TypeCode;
  libelle: TypeLibelle;
  mobileBanking: number;
}

export interface Demande {
  id: TypeCle;
  idDossier: TypeCle;
  idCategorie: TypeCle | null;
  equipement: TypeLibelle;
  quantiteEquipements: number;
  contactNom: string;
  contactEmail: string;
}

export interface Inscription 
  {
  raisonSociale: string
  email: string,
  password: string,
  contactNom: string,
  contactTelephone: string
}
