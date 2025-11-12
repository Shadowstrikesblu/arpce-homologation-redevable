import { Dossier } from "../interfaces/models.interface";
import { STATUTS_HOMOLOGATION } from "../interfaces/models.interface";

export const projetsMock: Dossier[] = [
  // Dossier 1
  {
    id: 1,
    idClient: 1,
    idStatut: 1, 
    idModeReglement: 1,
    dateOuverture: "2024-06-01",
    numero: "HOM-2024-050",
    libelle: "Homologation smartphones Oppo Reno 11",
    statut: STATUTS_HOMOLOGATION.ATTENTE_INSTRUCTION,
    modeReglement: {
      id: 1,
      code: "MOBILE",
      libelle: "Mobile Money",
      mobileBanking: 1,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 1,
        idDossier: 1,
        idCategorie: null,
        idMotifRejet: null,
        idProposition: null,
        numeroDemande: "DEM-2024-050-01",
        equipement: "Smartphone Oppo Reno 11",
        modele: "Reno 11 Pro 5G",
        marque: "Oppo",
        fabricant: "Oppo Electronics",
        type: "Smartphone 5G",
        description: "Nouvelle gamme de smartphones Oppo Reno 11 pour le marché local.",
        quantiteEquipements: 600,
        contactNom: "Thomas Leroy",
        contactEmail: "t.leroy@oppo-import.com",
      },
    ]
  },

  // Dossier 2
  {
    id: 2,
    idClient: 2,
    idStatut: 2, // ATTENTE_CATEGORISATION
    idModeReglement: 2,
    dateOuverture: "2024-05-28",
    numero: "HOM-2024-048",
    libelle: "Homologation switches réseau Dell",
    statut: STATUTS_HOMOLOGATION.ATTENTE_CATEGORISATION,
    modeReglement: {
      id: 2,
      code: "VIREMENT",
      libelle: "Virement bancaire",
      mobileBanking: 0,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 2,
        idDossier: 2,
        idCategorie: null,
        idMotifRejet: null,
        idProposition: null,
        numeroDemande: "DEM-2024-048-01",
        equipement: "Switch réseau Dell",
        modele: "PowerSwitch N3200",
        marque: "Dell",
        fabricant: "Dell Technologies",
        type: "Switch réseau managé",
        description: "Switches réseau pour infrastructures d'entreprise et data centers.",
        quantiteEquipements: 150,
        contactNom: "Sarah Koné",
        contactEmail: "s.kone@dell-partner.com",
      },
    ],
    commentaires: [
      {
        id: 1,
        idDossier: 2,
        dateCommentaire: "2024-05-30",
        commentaire: "Dossier technique complet, étude de catégorisation en cours",
        nomInstructeur: "DRSCE Analyse"
      }
    ]
  },

  // Dossier 3
  {
    id: 3,
    idClient: 1,
    idStatut: 3, // EN_COURS_INSTRUCTION
    idModeReglement: 1,
    dateOuverture: "2024-01-15",
    numero: "HOM-2024-001",
    libelle: "Homologation smartphones Samsung Galaxy S24",
    statut: STATUTS_HOMOLOGATION.EN_COURS_INSTRUCTION,
    modeReglement: {
      id: 1,
      code: "MOBILE",
      libelle: "Mobile Money",
      mobileBanking: 1,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 3,
        idDossier: 3,
        idCategorie: 3,
        idMotifRejet: null,
        idProposition: 1,
        numeroDemande: "DEM-2024-001-01",
        equipement: "Smartphone Samsung Galaxy S24",
        modele: "Galaxy S24 Ultra",
        marque: "Samsung",
        fabricant: "Samsung Electronics",
        type: "Smartphone 5G",
        description: "Demande d'homologation pour la gamme de smartphones Samsung Galaxy S24, compatibles 5G.",
        quantiteEquipements: 500,
        contactNom: "Jean Dupont",
        contactEmail: "j.dupont@entreprise.com",
      },
    ],
    commentaires: [
      {
        id: 2,
        idDossier: 3,
        dateCommentaire: "2024-01-16",
        commentaire: "Dossier complet reçu, analyse technique en cours",
        nomInstructeur: "DRSCE Technique"
      }
    ]
  },

  // Dossier 4
  {
    id: 4,
    idClient: 3,
    idStatut: 3, // EN_COURS_INSTRUCTION
    idModeReglement: 3,
    dateOuverture: "2024-04-20",
    numero: "HOM-2024-035",
    libelle: "Homologation caméras de surveillance Hikvision",
    statut: STATUTS_HOMOLOGATION.EN_COURS_INSTRUCTION,
    modeReglement: {
      id: 3,
      code: "CHEQUE",
      libelle: "Chèque bancaire",
      mobileBanking: 0,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 4,
        idDossier: 4,
        idCategorie: 4,
        idMotifRejet: null,
        idProposition: 2,
        numeroDemande: "DEM-2024-035-01",
        equipement: "Caméra IP Hikvision",
        modele: "DS-2CD2143G0-I",
        marque: "Hikvision",
        fabricant: "Hikvision Digital Technology",
        type: "Caméra de surveillance IP",
        description: "Caméras de surveillance pour usage professionnel et résidentiel.",
        quantiteEquipements: 800,
        contactNom: "Mohamed Diallo",
        contactEmail: "m.diallo@security-solutions.com",
      },
    ],
    commentaires: [
      {
        id: 3,
        idDossier: 4,
        dateCommentaire: "2024-04-25",
        commentaire: "Vérification des protocoles de sécurité réseau en cours",
        nomInstructeur: "DRSCE Sécurité"
      }
    ]
  },

  // Dossier 5
  {
    id: 5,
    idClient: 2,
    idStatut: 4, // ATTENTE_PAIEMENT
    idModeReglement: 2,
    dateOuverture: "2024-03-18",
    numero: "HOM-2024-011",
    libelle: "Homologation smartphones Xiaomi Redmi Note 13",
    statut: STATUTS_HOMOLOGATION.ATTENTE_PAIEMENT,
    modeReglement: {
      id: 2,
      code: "VIREMENT",
      libelle: "Virement bancaire",
      mobileBanking: 0,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 5,
        idDossier: 5,
        idCategorie: 3,
        idMotifRejet: null,
        idProposition: 3,
        numeroDemande: "DEM-2024-011-01",
        equipement: "Xiaomi Redmi Note 13",
        modele: "Redmi Note 13 Pro",
        marque: "Xiaomi",
        fabricant: "Xiaomi Corporation",
        type: "Smartphone 5G",
        description: "Demande d'homologation pour la gamme Redmi Note 13 destinée au marché grand public.",
        quantiteEquipements: 800,
        contactNom: "Luc Moreau",
        contactEmail: "luc.moreau@telecom-import.com",
      },
    ],
    devis: [
      {
        id: 1,
        idDossier: 5,
        date: "2024-03-20",
        montantEtude: 120000,
        montantHomologation: 450000,
        montantControle: 80000,
        paiementOk: 0,
        paiementMobileID: null
      }
    ]
  },

  // Dossier 6
  {
    id: 6,
    idClient: 4,
    idStatut: 4, 
    idModeReglement: 1,
    dateOuverture: "2024-05-05",
    numero: "HOM-2024-042",
    libelle: "Homologation tablettes Lenovo Tab Extreme",
    statut: STATUTS_HOMOLOGATION.ATTENTE_PAIEMENT,
    modeReglement: {
      id: 1,
      code: "MOBILE",
      libelle: "Mobile Money",
      mobileBanking: 1,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 6,
        idDossier: 6,
        idCategorie: 3,
        idMotifRejet: null,
        idProposition: 4,
        numeroDemande: "DEM-2024-042-01",
        equipement: "Tablette Lenovo Tab Extreme",
        modele: "Tab Extreme 14.5",
        marque: "Lenovo",
        fabricant: "Lenovo Group",
        type: "Tablette Android",
        description: "Tablettes haut de gamme pour usage professionnel et créatif.",
        quantiteEquipements: 350,
        contactNom: "Claire Dubois",
        contactEmail: "c.dubois@lenovo-distrib.com",
      },
    ],
    devis: [
      {
        id: 2,
        idDossier: 6,
        date: "2024-05-08",
        montantEtude: 95000,
        montantHomologation: 285000,
        montantControle: 47500,
        paiementOk: 0,
        paiementMobileID: null
      }
    ]
  },

  // Dossier 7
  {
    id: 7,
    idClient: 3,
    idStatut: 7, 
    idModeReglement: 2,
    dateOuverture: "2024-04-15",
    numero: "HOM-2024-018",
    libelle: "Homologation équipements Wi-Fi outdoor",
    statut: STATUTS_HOMOLOGATION.NON_HOMOLOGABLE,
    modeReglement: {
      id: 2,
      code: "VIREMENT",
      libelle: "Virement bancaire",
      mobileBanking: 0,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 7,
        idDossier: 7,
        idCategorie: null,
        idMotifRejet: null,
        idProposition: null,
        numeroDemande: "DEM-2024-018-01",
        equipement: "Point d'accès Wi-Fi outdoor",
        modele: "OUT-AP-300",
        marque: "SkyWave",
        fabricant: "SkyWave Tech",
        type: "Point d'accès extérieur",
        description: "Équipement ne répondant pas aux critères techniques d'homologation.",
        quantiteEquipements: 700,
        contactNom: "Hassan Benali",
        contactEmail: "h.benali@skywave.com",
      },
    ],
    commentaires: [
      {
        id: 4,
        idDossier: 7,
        dateCommentaire: "2024-04-25",
        commentaire: "Équipement ne répond pas aux spécifications techniques requises - en attente de signature DG pour lettre de non-homologation",
        nomInstructeur: "DRSCE Technique"
      }
    ]
  },

  // Dossier 8
  {
    id: 8,
    idClient: 5,
    idStatut: 7, 
    idModeReglement: 1,
    dateOuverture: "2024-03-10",
    numero: "HOM-2024-022",
    libelle: "Homologation drones de livraison autonomes",
    statut: STATUTS_HOMOLOGATION.NON_HOMOLOGABLE,
    modeReglement: {
      id: 1,
      code: "MOBILE",
      libelle: "Mobile Money",
      mobileBanking: 1,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 8,
        idDossier: 8,
        idCategorie: null,
        idMotifRejet: null,
        idProposition: null,
        numeroDemande: "DEM-2024-022-01",
        equipement: "Drone de livraison autonome",
        modele: "DeliverBot X5",
        marque: "AeroLogistics",
        fabricant: "AeroLogistics Inc.",
        type: "Drone autonome",
        description: "Drones de livraison ne respectant pas la réglementation aérienne en vigueur.",
        quantiteEquipements: 50,
        contactNom: "David Martinez",
        contactEmail: "d.martinez@aerologistics.com",
      },
    ],
    commentaires: [
      {
        id: 5,
        idDossier: 8,
        dateCommentaire: "2024-03-20",
        commentaire: "Équipement non conforme à la réglementation aérienne - transmission à la DG pour signature de la lettre de non-homologation",
        nomInstructeur: "DRSCE Réglementation"
      }
    ]
  },

  // Dossier 9
  {
    id: 9,
    idClient: 1,
    idStatut: 6, 
    idModeReglement: 1,
    dateOuverture: "2024-02-10",
    numero: "HOM-2024-002",
    libelle: "Homologation tablettes iPad Pro",
    statut: STATUTS_HOMOLOGATION.REJETE,
    modeReglement: {
      id: 1,
      code: "MOBILE",
      libelle: "Mobile Money",
      mobileBanking: 1,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 9,
        idDossier: 9,
        idCategorie: null,
        idMotifRejet: 1,
        idProposition: null,
        numeroDemande: "DEM-2024-002-01",
        equipement: 'Tablette iPad Pro 12.9"',
        modele: 'iPad Pro 12.9" (6e génération)',
        marque: "Apple",
        fabricant: "Apple Inc.",
        type: "Tablette tactile",
        description: "Équipement non conforme aux normes de rayonnement en vigueur.",
        quantiteEquipements: 250,
        contactNom: "Pierre Martin",
        contactEmail: "p.martin@entreprise.com",
      },
    ],
    commentaires: [
      {
        id: 6,
        idDossier: 9,
        dateCommentaire: "2024-02-20",
        commentaire: "Équipement non conforme aux normes de sécurité électromagnétique - dossier rejeté",
        nomInstructeur: "DRSCE Contrôle"
      }
    ]
  },

  // Dossier 10
  {
    id: 10,
    idClient: 6,
    idStatut: 6,
    idModeReglement: 2,
    dateOuverture: "2024-01-08",
    numero: "HOM-2024-005",
    libelle: "Homologation antennes 5G non conformes",
    statut: STATUTS_HOMOLOGATION.REJETE,
    modeReglement: {
      id: 2,
      code: "VIREMENT",
      libelle: "Virement bancaire",
      mobileBanking: 0,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 10,
        idDossier: 10,
        idCategorie: null,
        idMotifRejet: 2,
        idProposition: null,
        numeroDemande: "DEM-2024-005-01",
        equipement: "Antenne 5G macro",
        modele: "5G-MACRO-64T64R",
        marque: "TelecomTech",
        fabricant: "TelecomTech Global",
        type: "Antenne 5G",
        description: "Antennes 5G dépassant les limites de puissance autorisées.",
        quantiteEquipements: 100,
        contactNom: "Laura Schmidt",
        contactEmail: "l.schmidt@telecomtech.com",
      },
    ],
    commentaires: [
      {
        id: 7,
        idDossier: 10,
        dateCommentaire: "2024-01-15",
        commentaire: "Dépassement des limites de puissance d'émission - rejet définitif",
        nomInstructeur: "DRSCE Conformité"
      }
    ]
  },

  // Dossier 11
  {
    id: 11,
    idClient: 1,
    idStatut: 5,
    idModeReglement: 2,
    dateOuverture: "2023-11-20",
    numero: "HOM-2023-045",
    libelle: "Homologation routeurs Cisco série 8000",
    statut: STATUTS_HOMOLOGATION.VALIDE,
    modeReglement: {
      id: 2,
      code: "VIREMENT",
      libelle: "Virement bancaire",
      mobileBanking: 0,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 11,
        idDossier: 11,
        idCategorie: 2,
        idMotifRejet: null,
        idProposition: 5,
        numeroDemande: "DEM-2023-045-01",
        equipement: "Routeur Cisco 8000",
        modele: "Cisco 8800 Series",
        marque: "Cisco",
        fabricant: "Cisco Systems",
        type: "Routeur cœur de réseau",
        description: "Homologation des routeurs Cisco série 8000 destinés à des infrastructures opérateurs.",
        quantiteEquipements: 100,
        contactNom: "Marie Lambert",
        contactEmail: "m.lambert@entreprise.com",
      },
    ],
    devis: [
      {
        id: 3,
        idDossier: 11,
        date: "2023-11-25",
        montantEtude: 150000,
        montantHomologation: 300000,
        montantControle: 50000,
        paiementOk: 1,
        paiementMobileID: null
      }
    ],
    attestations: [
      {
        id: 1,
        idDemande: 11,
        dateDelivrance: "2023-12-15",
        dateExpiration: "2025-12-15",
        donnees: null,
        extension: "pdf"
      }
    ]
  },

  // Dossier 12
  {
    id: 12,
    idClient: 3,
    idStatut: 5,
    idModeReglement: 1,
    dateOuverture: "2023-09-10",
    numero: "HOM-2023-030",
    libelle: "Homologation équipements IoT industriels Bosch",
    statut: STATUTS_HOMOLOGATION.VALIDE,
    modeReglement: {
      id: 1,
      code: "MOBILE",
      libelle: "Mobile Money",
      mobileBanking: 1,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 12,
        idDossier: 12,
        idCategorie: 4,
        idMotifRejet: null,
        idProposition: 6,
        numeroDemande: "DEM-2023-030-01",
        equipement: "Capteurs IoT industriels Bosch",
        modele: "XDK110",
        marque: "Bosch",
        fabricant: "Bosch Connected Devices",
        type: "Capteur IoT multi-usage",
        description: "Homologation d'une gamme de capteurs IoT pour applications industrielles.",
        quantiteEquipements: 1500,
        contactNom: "Sophie Bernard",
        contactEmail: "s.bernard@bosch.com",
      },
    ],
    devis: [
      {
        id: 4,
        idDossier: 12,
        date: "2023-09-15",
        montantEtude: 180000,
        montantHomologation: 600000,
        montantControle: 120000,
        paiementOk: 1,
        paiementMobileID: "MM123456789"
      }
    ],
    attestations: [
      {
        id: 2,
        idDemande: 12,
        dateDelivrance: "2023-10-05",
        dateExpiration: "2025-10-05",
        donnees: null,
        extension: "pdf"
      }
    ]
  },

  // Dossier 13
  {
    id: 13,
    idClient: 7,
    idStatut: 5,
    idModeReglement: 3,
    dateOuverture: "2024-02-28",
    numero: "HOM-2024-028",
    libelle: "Homologation téléphones fixes IP Yealink",
    statut: STATUTS_HOMOLOGATION.VALIDE,
    modeReglement: {
      id: 3,
      code: "CHEQUE",
      libelle: "Chèque bancaire",
      mobileBanking: 0,
      remarques: null,
      utilisateurCreation: null,
      dateCreation: null,
      utilisateurModification: null,
      dateModification: null
    },
    demandes: [
      {
        id: 13,
        idDossier: 13,
        idCategorie: 1,
        idMotifRejet: null,
        idProposition: 7,
        numeroDemande: "DEM-2024-028-01",
        equipement: "Téléphone IP Yealink",
        modele: "T46U",
        marque: "Yealink",
        fabricant: "Yealink Network Technology",
        type: "Téléphone IP",
        description: "Homologation pour une gamme de téléphones IP professionnels Yealink.",
        quantiteEquipements: 350,
        contactNom: "Thierry Kamdem",
        contactEmail: "t.kamdem@yealink.com",
      },
    ],
    devis: [
      {
        id: 5,
        idDossier: 13,
        date: "2024-03-05",
        montantEtude: 105000,
        montantHomologation: 245000,
        montantControle: 52500,
        paiementOk: 1,
        paiementMobileID: null
      }
    ],
    attestations: [
      {
        id: 3,
        idDemande: 13,
        dateDelivrance: "2024-03-20",
        dateExpiration: "2026-03-20",
        donnees: null,
        extension: "pdf"
      }
    ]
  }
];

export default projetsMock;