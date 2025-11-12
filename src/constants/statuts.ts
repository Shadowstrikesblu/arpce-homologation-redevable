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
  ATTENTE_PAIEMENT: {
    id: 3,
    code: "ATTENTE_PAIEMENT",
    libelle: "En attente de paiement",
    type: "EN_COURS",
    couleur: "yellow"
  },
  VALIDE: {
    id: 4,
    code: "VALIDE",
    libelle: "Validé - Certificat délivré",
    type: "TERMINE_SUCCESS",
    couleur: "green"
  },
  REJETE: {
    id: 5,
    code: "REJETE",
    libelle: "Rejeté - Non conforme",
    type: "ECHEC",
    couleur: "red"
  },
  NON_HOMOLOGABLE: {
    id: 6,
    code: "NON_HOMOLOGABLE",
    libelle: "Équipement non homologable",
    type: "ECHEC",
    couleur: "red"
  },
  ATTENTE_CATEGORISATION: {
    id: 7,
    code: "ATTENTE_CATEGORISATION",
    libelle: "En attente de catégorisation",
    type: "EN_COURS",
    couleur: "purple"
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