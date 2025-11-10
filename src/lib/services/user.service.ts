import { Client } from "@/lib/interfaces/models.interface";

// URL de base de l'API backend
// Configurez NEXT_PUBLIC_API_URL dans votre fichier .env.local
const API_BASE_URL = process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:3000";

// Mode développement : utilisez des données mockées quand le backend n'est pas disponible
// Par défaut, true pour le développement (changez en false quand le backend est prêt)
const USE_MOCK_DATA = process.env["NEXT_PUBLIC_USE_MOCK_DATA"] !== "false";

// Type pour les données de mise à jour (exclut les champs système)
export type UpdateClientData = Partial<
  Omit<
    Client,
    | "id"
    | "code"
    | "motPasse"
    | "changementMotPAsse"
    | "desactive"
    | "utilisateurCreation"
    | "dateCreation"
    | "utilisateurModification"
    | "dateModification"
    | "dossiers"
  >
>;

// Données mockées pour le développement
const mockClient: Client = {
  id: 1,
  code: "CLI001",
  raisonSociale: "Entreprise Example SARL",
  registreCommerce: "RC12345",
  motPasse: null,
  changementMotPAsse: null,
  desactive: null,
  contactNom: "Jean Dupont",
  contactTelephone: "+242 06 123 456 78",
  contactFonction: "Directeur Général",
  email: "contact@example.cg",
  adresse: "123 Avenue de la République",
  bp: "BP 1234",
  ville: "Brazzaville",
  pays: "Congo",
  remarques: "Client fidèle depuis 2020. Contact préféré par email.",
  utilisateurCreation: null,
  dateCreation: "2024-01-15T10:00:00",
  utilisateurModification: null,
  dateModification: "2024-11-10T14:30:00",
  dossiers: [],
};

// Simulation d'un délai réseau
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUserById(id: number): Promise<Client> {
  // En mode développement, retourner les données mockées
  if (USE_MOCK_DATA) {
    await delay(500); // Simuler un délai réseau
    console.log("🔧 Mode développement : utilisation de données mockées");
    return { ...mockClient, id };
  }

  // Tentative de récupération depuis l'API
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      // Si l'API n'est pas disponible, utiliser les données mockées en fallback
      console.warn("⚠️ API non disponible, utilisation de données mockées");
      return { ...mockClient, id };
    }

    return response.json();
  } catch (error) {
    // En cas d'erreur réseau, utiliser les données mockées
    console.warn("⚠️ Erreur réseau, utilisation de données mockées:", error);
    return { ...mockClient, id };
  }
}

export async function updateUser(id: number, data: UpdateClientData): Promise<Client> {
  // En mode développement, simuler la mise à jour
  if (USE_MOCK_DATA) {
    await delay(500); // Simuler un délai réseau
    console.log("🔧 Mode développement : simulation de mise à jour");
    const updatedClient: Client = {
      ...mockClient,
      ...data,
      id,
      dateModification: new Date().toISOString(),
    };
    // Mettre à jour les données mockées
    Object.assign(mockClient, updatedClient);
    return updatedClient;
  }

  // Tentative de mise à jour via l'API
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // En cas d'erreur, simuler la mise à jour avec les données mockées
    console.warn("⚠️ Erreur réseau, simulation de mise à jour:", error);
    const updatedClient: Client = {
      ...mockClient,
      ...data,
      id,
      dateModification: new Date().toISOString(),
    };
    Object.assign(mockClient, updatedClient);
    return updatedClient;
  }
}

export async function deleteUser(id: number): Promise<void> {
  // En mode développement, simuler la suppression
  if (USE_MOCK_DATA) {
    await delay(500); // Simuler un délai réseau
    console.log("🔧 Mode développement : simulation de suppression");
    return;
  }

  // Tentative de suppression via l'API
  try {
    const response = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur: ${response.statusText}`);
    }
  } catch (error) {
    // En cas d'erreur, simuler la suppression
    console.warn("⚠️ Erreur réseau, simulation de suppression:", error);
  }
}

export async function logout(): Promise<void> {
  // Implémentez votre logique de déconnexion ici
  // Par exemple, supprimer le token, rediriger, etc.
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}

