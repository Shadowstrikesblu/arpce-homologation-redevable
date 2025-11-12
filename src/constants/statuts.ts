// Interface pour typer nos statuts
export interface Statut {
  id: number;
  code: string;
  libelle: string;
  type: 'EN_COURS' | 'TERMINE_SUCCESS' | 'ECHEC';
  couleur: string;
}

export const STATUTS = {
  ATTENTE_INSTRUCTION: {
    id: 1,
    code: "ATTENTE_INSTRUCTION",
    libelle: "En attente d'instruction",
    type: "EN_COURS",
    couleur: "orange"
  },
  EN_COURS_INSTRUCTION: {
    id: 2,
    code: "EN_COURS_INSTRUCTION",
    libelle: "En cours d'instruction",
    type: "EN_COURS",
    couleur: "blue"
  },
  EN_ATTENTE_APPROBATION: {
    id: 3,
    code: "EN_ATTENTE_APPROBATION",
    libelle: "En attente d'approbation",
    type: "EN_COURS",
    couleur: "yellow"
  },
  EN_ATTENTE_PAIEMENT: {
    id: 4,
    code: "EN_ATTENTE_PAIEMENT",
    libelle: "En attente de paiement",
    type: "EN_COURS",
    couleur: "yellow"
  },
  REALISEE: {
    id: 5,
    code: "REALISEE",
    libelle: "Réalisée",
    type: "TERMINE_SUCCESS",
    couleur: "green"
  },
  EQUIPEMENT_POINTS_HOMOLOGATION: {
    id: 6,
    code: "EQUIPEMENT_POINTS_HOMOLOGATION",
    libelle: "Équipement aux points d'homologation",
    type: "EN_COURS",
    couleur: "blue"
  },
  PAIEMENT_EFFECTUE: {
    id: 7,
    code: "PAIEMENT_EFFECTUE",
    libelle: "Paiement effectué",
    type: "EN_COURS",
    couleur: "green"
  },
  ATTESTATION_DISPONIBLE: {
    id: 8,
    code: "ATTESTATION_DISPONIBLE",
    libelle: "Attestation d'homologation disponible",
    type: "TERMINE_SUCCESS",
    couleur: "green"
  },
  ANNULEE: {
    id: 9,
    code: "ANNULEE",
    libelle: "Annulée",
    type: "ECHEC",
    couleur: "red"
  }
} as const;

// Helper functions
export const getStatutByCode = (code: string): Statut => {
  const statut = Object.values(STATUTS).find(s => s.code === code);
  return statut || STATUTS.ATTENTE_INSTRUCTION;
};

export const getStatutById = (id: number): Statut => {
  return Object.values(STATUTS).find(statut => statut.id === id) || STATUTS.ATTENTE_INSTRUCTION;
};

export const getStatutsByType = (type: 'EN_COURS' | 'TERMINE_SUCCESS' | 'ECHEC'): Statut[] => {
  return Object.values(STATUTS).filter(statut => statut.type === type);
};

// Types exports
export type StatutCode = keyof typeof STATUTS;
export type StatutType = Statut['type'];