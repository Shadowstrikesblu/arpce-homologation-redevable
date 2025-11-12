export type TypeCle = number;                 // typeCle : clé numérique
export type TypeCode = string;                // typeCode : code texte
export type TypeLibelle = string;             // typeLibelle : texte long
export type TypeLibelleCourt = string;        // typeLibelleCourt : texte court
export type TypeNomsComplet = string;         // typeNomsComplet : nom + prénoms
export type TypeNoms = string;                // typeNoms : nom/fonction
export type TypePrenoms = string;             // typePrenoms
export type TypeRemarques = string;           // typeRemarques : texte long
export type TypeMotPasse = string;            // mot de passe (hash ou autre)
export type TypeURL = string;                 // email / url
export type TypeAdresse = string;             // adresse postale
export type TypeTelephone = string;           // numéro de téléphone
export type TypeDate = string;                // yyyy-mm-dd (ou Date si tu préfères)
export type TypeDateHeure = string;           // yyyy-mm-ddThh:mm:ss
export type TypeDateHeureLong = string;       // idem, précision plus grande si besoin
export type TypeIndex = number;               // petit entier (0/1/2/3…)
export type TypeNombre = number;              // nombre générique
export type TypeMontant = number;             // montant monétaire
export type TypeVraiFaux = boolean;           // bit / bool
export type BinaryData = string;              // varbinary(max) encodé en base64, à adapter

// ========================
//  TYPES POUR LES STATUTS
// ========================

export interface Statut {
  id: TypeCle;
  code: TypeCode;
  libelle: TypeLibelle;
  type: 'EN_COURS' | 'TERMINE_SUCCESS' | 'ECHEC';
  couleur: string;
}

// ========================
//  CONSTANTES DES STATUTS
// ========================

export const STATUTS_HOMOLOGATION = {
  // ========== EN COURS ==========
  ATTENTE_INSTRUCTION: {
    id: 1,
    code: "ATTENTE_INSTRUCTION",
    libelle: "En attente d'instruction",
    type: "EN_COURS" as const,
    couleur: "orange"
  },
  ATTENTE_CATEGORISATION: {
    id: 2,
    code: "ATTENTE_CATEGORISATION",
    libelle: "En attente de catégorisation",
    type: "EN_COURS" as const,
    couleur: "purple"
  },
  EN_COURS_INSTRUCTION: {
    id: 3,
    code: "EN_COURS_INSTRUCTION",
    libelle: "En cours d'instruction",
    type: "EN_COURS" as const,
    couleur: "blue"
  },
  ATTENTE_PAIEMENT: {
    id: 4,
    code: "ATTENTE_PAIEMENT",
    libelle: "En attente de paiement",
    type: "EN_COURS" as const,
    couleur: "yellow"
  },

  // ========== TERMINÉ/SUCCÈS ==========
  VALIDE: {
    id: 5,
    code: "VALIDE",
    libelle: "Validé - Certificat délivré",
    type: "TERMINE_SUCCESS" as const,
    couleur: "green"
  },

  // ========== ÉCHEC ==========
  REJETE: {
    id: 6,
    code: "REJETE",
    libelle: "Rejeté - Non conforme",
    type: "ECHEC" as const,
    couleur: "red"
  },
  NON_HOMOLOGABLE: {
    id: 7,
    code: "NON_HOMOLOGABLE",
    libelle: "Équipement non homologable",
    type: "ECHEC" as const,
    couleur: "red"
  }
} as const;

// Helper functions pour les statuts
export const getStatutByCode = (code: string): Statut => {
  return Object.values(STATUTS_HOMOLOGATION).find(statut => statut.code === code) || STATUTS_HOMOLOGATION.ATTENTE_INSTRUCTION;
};

export const getStatutById = (id: number): Statut => {
  return Object.values(STATUTS_HOMOLOGATION).find(statut => statut.id === id) || STATUTS_HOMOLOGATION.ATTENTE_INSTRUCTION;
};

export const getStatutsByType = (type: 'EN_COURS' | 'TERMINE_SUCCESS' | 'ECHEC'): Statut[] => {
  return Object.values(STATUTS_HOMOLOGATION).filter(statut => statut.type === type);
};

// Types pour les codes et types de statuts
export type CodeStatut = keyof typeof STATUTS_HOMOLOGATION;
export type TypeStatut = 'EN_COURS' | 'TERMINE_SUCCESS' | 'ECHEC';

/**
 * ========================
 *  ADMINISTRATION
 * ========================
 */

/**
 * Table : adminAccess
 * Droits génériques par application / page
 */
export interface AdminAccess {
  id: TypeCle;
  application: TypeLibelle;
  groupe: TypeLibelle;
  libelle: TypeLibelle;
  page: TypeLibelle | null;
  /**
   * E = édition, I = impression, V = visualisation,
   * T = traitement, P = personnalisé
   */
  type: TypeCode;
  inactif: TypeVraiFaux | null;
  ajouter: TypeVraiFaux | null;
  valider: TypeVraiFaux | null;
  supprimer: TypeVraiFaux | null;
  imprimer: TypeVraiFaux | null;

  // Relations (logiques)
  profilsAcces?: AdminProfilsAcces[]; // via adminProfilsAcces.idAccess
}

/**
 * Table : adminConnexions
 * Journal des connexions
 */
export interface AdminConnexion {
  utilisateur: TypeNomsComplet;
  dateConnexion: TypeDateHeure;
  ip: TypeLibelleCourt | null;
}

/**
 * Table : adminEvenementsTypes
 * Types d'événements du journal
 */
export interface AdminEvenementType {
  id: TypeCle;
  libelle: TypeLibelle;

  // Relations
  journaux?: AdminJournal[]; // via adminJournal.idEvenementType
}

/**
 * Table : adminJournal
 * Journal des événements
 */
export interface AdminJournal {
  id: TypeCle;
  idEvenementType: TypeCle;
  application: string;          // nvarchar(120)
  adresseIP: TypeLibelle;
  utilisateur: TypeLibelle;
  dateEvenement: TypeDateHeureLong;
  page: TypeLibelle;
  libelle: string | null;       // typeLibelleLong, supposé string

  // Relations
  evenementType?: AdminEvenementType;
}

/**
 * Table : adminOptions
 * Options globales (journalisation, LDAP, réplication, etc.)
 */
export interface AdminOptions {
  journalActivation: TypeIndex | null;
  eventConnexion: TypeIndex | null;
  eventOuverturePage: TypeIndex | null;
  eventChangementMotPasse: TypeIndex | null;
  eventModificationDonnees: TypeIndex | null;
  eventSuppressionDonnees: TypeIndex | null;
  eventImpression: TypeIndex | null;
  eventValidation: TypeIndex | null;
  journalLimitation: TypeIndex | null;
  journalTypeLimitation: TypeIndex | null;
  journalDureeLimitation: TypeNombre | null;
  /**
   * 0 = jours, 1 = semaines, 2 = mois
   */
  journalTypeDureeLimitation: TypeIndex | null;
  journalTailleLimitation: TypeNombre | null;
  LDAPAuthentificationActivation: TypeIndex | null;
  LDAPAuthentificationNomDomaine: TypeLibelleCourt | null;
  LDAPCreationAutoActivation: TypeIndex | null;
  LDAPCreationAutoNomServeur: TypeLibelleCourt | null;
  LDAPCreationAutoCompte: TypeLibelleCourt | null;
  LDAPCreationAutoPassword: TypeLibelleCourt | null;
  replicationActivation: TypeIndex | null;
  replicationNomServeur: TypeLibelleCourt | null;
  replicationCompte: TypeLibelleCourt | null;
  replicationPassword: TypeLibelleCourt | null;
}

/**
 * Table : adminProfils
 * Profils (rôles) d'accès
 */
export interface AdminProfil {
  id: TypeCle;
  code: TypeCode | null;
  libelle: TypeLibelle;
  remarques: TypeRemarques | null;
  utilisateurCreation: TypeNomsComplet | null;
  dateCreation: TypeDateHeure | null;
  utilisateurModification: TypeNomsComplet | null;
  dateModification: TypeDateHeure | null;

  // Relations
  acces?: AdminProfilsAcces[];
  utilisateursLDAP?: AdminProfilsUtilisateursLDAP[];
  utilisateurs?: AdminUtilisateur[]; // via adminUtilisateurs.idProfil
}

/**
 * Table : adminProfilsAcces
 * Droits par profil et par entrée d'adminAccess
 */
export interface AdminProfilsAcces {
  idProfil: TypeCle;
  idAccess: TypeCle;
  ajouter: TypeVraiFaux | null;
  valider: TypeVraiFaux | null;
  supprimer: TypeVraiFaux | null;
  imprimer: TypeVraiFaux | null;

  // Relations
  profil?: AdminProfil;
  access?: AdminAccess;
}

/**
 * Table : adminProfilsUtilisateursLDAP
 * Association entre utilisateur LDAP et profil
 */
export interface AdminProfilsUtilisateursLDAP {
  utilisateur: TypeLibelle;
  idProfil: TypeCle;

  // Relations
  profil?: AdminProfil;
}

/**
 * Table : adminReporting
 * Déclarations de rapports
 */
export interface AdminReporting {
  id: TypeCle;
  application: TypeLibelle | null;
  code: TypeCode;
  libelle: TypeLibelle;
  inactif: TypeVraiFaux | null;
}

/**
 * Table : adminUtilisateurs
 * Utilisateurs de l'application (back-office)
 */
export interface AdminUtilisateur {
  id: TypeCle;
  idUtilisateurType: TypeCle;
  idProfil: TypeCle | null;
  compte: TypeNoms;
  nom: TypeNoms;
  prenoms: TypePrenoms | null;
  motPasse: TypeMotPasse | null;
  changementMotPasse: TypeIndex | null;
  desactive: TypeIndex | null;
  remarques: TypeRemarques | null;
  derniereConnexion: TypeDateHeure | null;
  utilisateurCreation: TypeNomsComplet | null;
  dateCreation: TypeDateHeure | null;
  utilisateurModification: TypeNomsComplet | null;
  dateModification: TypeDateHeure | null;

  // Relations
  profil?: AdminProfil;
  typeUtilisateur?: AdminUtilisateurType;
}

/**
 * Table : adminUtilisateurTypes
 * Types d'utilisateurs (0,1,2,3…)
 */
export interface AdminUtilisateurType {
  id: TypeCle;
  libelle: TypeLibelle;

  // Relations
  utilisateurs?: AdminUtilisateur[];
}

/**
 * ========================
 *  DONNÉES MÉTIER
 * ========================
 */

/**
 * Table : categoriesEquipements
 */
export interface CategorieEquipement {
  id: TypeCle;
  code: TypeCode;
  libelle: TypeLibelle;
  tarifEtude: TypeMontant | null;
  tarifHomologation: TypeMontant | null;
  tarifHomologationParLot: TypeIndex | null;
  tarifHomologationQuantiteParLot: TypeNombre | null;
  tarifControle: TypeMontant | null;
  remarques: TypeRemarques | null;
  utilisateurCreation: TypeNomsComplet | null;
  dateCreation: TypeDateHeure | null;
  utilisateurModification: TypeNomsComplet | null;
  dateModification: TypeDateHeure | null;

  // Relations
  demandes?: Demande[];
}

/**
 * Table : clients
 */
export interface Client {
  id: TypeCle;
  code: TypeCode;
  raisonSociale: TypeLibelle;
  registreCommerce: TypeLibelleCourt | null;
  motPasse: TypeMotPasse | null;
  changementMotPAsse: TypeIndex | null;
  desactive: TypeIndex | null;
  contactNom: TypeNomsComplet | null;
  contactTelephone: TypeTelephone | null;
  contactFonction: TypeNoms | null;
  email: TypeURL | null;
  adresse: TypeAdresse | null;
  bp: TypeLibelleCourt | null;
  ville: TypeLibelleCourt | null;
  pays: TypeLibelleCourt | null;
  remarques: TypeRemarques | null;
  utilisateurCreation: TypeNomsComplet | null;
  dateCreation: TypeDateHeure | null;
  utilisateurModification: TypeNomsComplet | null;
  dateModification: TypeDateHeure | null;

  // Relations
  dossiers?: Dossier[];
}

/**
 * Table : modesReglements
 */
export interface ModeReglement {
  id: TypeCle;
  code: TypeCode;
  libelle: TypeLibelle;
  /** Indique si c'est un mode Mobile Banking */
  mobileBanking: TypeIndex;
  remarques: TypeRemarques | null;
  utilisateurCreation: TypeNomsComplet | null;
  dateCreation: TypeDateHeure | null;
  utilisateurModification: TypeNomsComplet | null;
  dateModification: TypeDateHeure | null;

  // Relations
  dossiers?: Dossier[];
}

/**
 * Table : dossiers
 */
export interface Dossier {
  id: TypeCle;
  idClient: TypeCle;
  idStatut: TypeCle;
  idModeReglement: TypeCle;
  dateOuverture: TypeDate;
  numero: TypeCode;
  libelle: TypeLibelle;

  // Relations
  client?: Client;
  statut?: Statut;
  modeReglement?: ModeReglement;
  demandes?: Demande[];
  devis?: Devis[];
  commentaires?: Commentaire[];
  documents?: DocumentDossier[];
  attestations?: Attestation[]; 
}

/**
 * Table : motifsRejets
 */
export interface MotifRejet {
  id: TypeCle;
  code: TypeCode;
  libelle: TypeLibelle;
  remarques: TypeRemarques | null;
  utilisateurCreation: TypeNomsComplet | null;
  dateCreation: TypeDateHeure | null;
  utilisateurModification: TypeNomsComplet | null;
  dateModification: TypeDateHeure | null;

  // Relations
  demandes?: Demande[];
}

/**
 * Table : propositions
 */
export interface Proposition {
  id: TypeCle;
  code: TypeCode;
  libelle: TypeLibelle;

  // Relations
  demandes?: Demande[];
}

/**
 * Table : demandes
 */
export interface Demande {
  id: TypeCle;
  idDossier: TypeCle;
  idCategorie: TypeCle | null;
  idMotifRejet: TypeCle | null;
  idProposition: TypeCle | null;
  numeroDemande: TypeCode | null;
  equipement: TypeLibelle | null;
  modele: TypeLibelle | null;
  marque: TypeLibelle | null;
  fabricant: TypeLibelle | null;
  type: TypeLibelle | null;
  description: TypeRemarques | null;
  quantiteEquipements: TypeNombre | null;
  contactNom: TypeNomsComplet | null;
  contactEmail: TypeURL | null;

  // Relations
  dossier?: Dossier;
  categorie?: CategorieEquipement | null;
  motifRejet?: MotifRejet | null;
  proposition?: Proposition | null;
  attestations?: Attestation[];
  documentsDemandes?: DocumentDemande[];
}

/**
 * Table : attestations
 */
export interface Attestation {
  id: TypeCle;
  idDemande: TypeCle;
  dateDelivrance: TypeDate;
  dateExpiration: TypeDate;
  donnees: BinaryData | null;
  extension: TypeCode;

  // Relations
  demande?: Demande;
}

/**
 * Table : devis
 */
export interface Devis {
  id: TypeCle;
  idDossier: TypeCle;
  date: TypeDate;
  montantEtude: TypeMontant;
  montantHomologation: TypeMontant | null;
  montantControle: TypeMontant | null;
  paiementOk: TypeIndex | null;
  paiementMobileID: TypeLibelleCourt | null;

  // Relations
  dossier?: Dossier;
}

/**
 * Table : commentaires
 */
export interface Commentaire {
  id: TypeCle;
  idDossier: TypeCle;
  dateCommentaire: TypeDate;
  commentaire: TypeRemarques | null;
  nomInstructeur: TypeNoms | null;

  // Relations
  dossier?: Dossier;
}

/**
 * Table : documentsDemandes
 */
export interface DocumentDemande {
  id: TypeCle;
  idDemande: TypeCle;
  nom: TypeNoms | null;
  donnees: BinaryData | null;
  extension: TypeCode;

  // Relations
  demande?: Demande;
}

/**
 * Table : documentsDossiers
 */
export interface DocumentDossier {
  id: TypeCle;
  idDossier: TypeCle;
  nom: TypeNoms | null;
  /**
   * 0 = courrier de demande
   * 1 = preuve de paiement
   */
  type: TypeIndex | null;
  donnees: BinaryData | null;
  extension: TypeCode;

  // Relations
  dossier?: Dossier;
}