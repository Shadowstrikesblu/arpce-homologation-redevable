import axiosClient from "../utils/axiosBase";

export interface ApercuDossiers {
  total: number;
  success: number;
  failed: number;
  inProgress: number;
  pendingPayments: number;
}

export interface PaiementEnAttente {
  id: string;
  numeroDemande: string;
  montant: number;
  dateEcheance: string;
  modeReglementLibelle: string;
}

export interface Statut {
  id: string;
  code: string;
  libelle: string;
}

export interface Demande {
  id: string;
  idDossier: string;
  numeroDemande: string;
  equipement: string;
  modele?: string;
  marque?: string;
}

export interface DossierRecent {
  id: string;
  idClient: string;
  idStatut: string;
  idModeReglement: string;
  dateOuverture: string;
  numero: string;
  libelle: string;
  statut: Statut;
  demandes: Demande[];
}

export interface DossierListItem {
  id: string;
  dateOuverture: string;
  numero: string;
  libelle: string;
  statut: Statut;
}

export interface ListeDossiersParams {
  Page?: number;
  TaillePage?: number;
  Recherche?: string;
  TrierPar?: string;
  Ordre?: string;
}

export interface ListeDossiersResponse {
  page: number;
  totalPage: number;
  recherche: string;
  dossiers: DossierListItem[];
}

export interface CreerDossierInput {
  Libelle: string;
  CourrierFile: File;
}

export interface CreerDossierResponse {
  dossierId: string;
}

export interface ModeReglement {
  id: string;
  code: string;
  libelle: string;
}

export interface Devis {
  id: string;
  date: string;
  montantEtude: number;
  montantHomologation: number;
  montantControle: number;
  paiementOk: number;
}

export interface Commentaire {
  id: string;
  dateCommentaire: string;
  commentaireTexte: string;
  nomInstructeur: string;
}

export interface Document {
  id: string;
  nom: string;
  type: number;
  extension: string;
  filePath: string;
}

export interface Attestation {
  id: string;
  dateDelivrance: string;
  dateExpiration: string;
}

export interface DossierDetail {
  id: string;
  dateOuverture: string;
  numero: string;
  libelle: string;
  statut: Statut;
  modeReglement: ModeReglement;
  demandes: Demande[];
  devis: Devis[];
  commentaires: Commentaire[];
  documents: Document[];
  attestations: Attestation[];
}

export interface AjouterEquipementInput {
  IdDossier: string;
  Equipement: string;
  Modele?: string;
  Marque?: string;
  Fabricant?: string;
  Description?: string;
  QuantiteEquipements?: number;
  ContactNom?: string;
  ContactEmail?: string;
  ContactTelephone?: string;
  ContactFonction?: string;
  TypeURL_FicheTechnique?: File;
}

export const dossiers = {
  
  apercu: async (): Promise<ApercuDossiers> => {
    const { data } = await axiosClient.get("/api/dossiers/apercu");
    return data;
  },

  
  paiementEnAttente: async (dossierId: string): Promise<PaiementEnAttente> => {
    const { data } = await axiosClient.get(`/api/dossiers/${dossierId}/paiement-en-attente`);
    return data;
  },

  
  recents: async (): Promise<DossierRecent[]> => {
    const { data } = await axiosClient.get("/api/dossiers/recents");
    return data;
  },

  
  liste: async (params?: ListeDossiersParams): Promise<ListeDossiersResponse> => {
    const { data } = await axiosClient.get("/api/dossiers", { params });
    return data;
  },

  creer: async (input: CreerDossierInput): Promise<CreerDossierResponse> => {
    const formData = new FormData();
    formData.append("Libelle", input.Libelle);
    formData.append("CourrierFile", input.CourrierFile, input.CourrierFile.name);

    const { data } = await axiosClient.post("/api/dossiers", formData);

    return data;

  },

  
  detail: async (dossierId: string): Promise<DossierDetail> => {
    const { data } = await axiosClient.get(`/api/dossiers/${dossierId}`);
    return data;
  },

  ajouterEquipement: async (
    dossierId: string,
    input: AjouterEquipementInput
  ): Promise<boolean> => {
    
    const formData = new FormData();
    formData.append("IdDossier", input.IdDossier);
    formData.append("Equipement", input.Equipement);
    
    if (input.Modele) formData.append("Modele", input.Modele);
    if (input.Marque) formData.append("Marque", input.Marque);
    if (input.Fabricant) formData.append("Fabricant", input.Fabricant);
    if (input.Description) formData.append("Description", input.Description);
    if (input.QuantiteEquipements !== undefined) {
      formData.append("QuantiteEquipements", input.QuantiteEquipements.toString());
    }
    if (input.ContactNom) formData.append("ContactNom", input.ContactNom);
    if (input.ContactEmail) formData.append("ContactEmail", input.ContactEmail);
    if (input.ContactTelephone) formData.append("ContactTelephone", input.ContactTelephone);
    if (input.ContactFonction) formData.append("ContactFonction", input.ContactFonction);
    if (input.TypeURL_FicheTechnique) {
      formData.append("TypeURL_FicheTechnique", input.TypeURL_FicheTechnique);
    }

    const { data } = await axiosClient.post(`/api/dossiers/${dossierId}/equipements`, formData);
    return data;
  },
};

