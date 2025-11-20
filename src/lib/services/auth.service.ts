import axios from 'axios';

// URL de base de l'API backend
const API_BASE_URL = process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:3000";

// Mode développement : utilisez des données mockées quand le backend n'est pas disponible
const USE_MOCK_DATA = process.env["NEXT_PUBLIC_USE_MOCK_DATA"] !== "false";

// Interface pour les données de connexion
export interface LoginCredentials {
  email: string;
  motPasse: string;
}

// Interface pour la réponse de connexion
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    raisonSociale?: string;
    [key: string]: any;
  };
}

// Instance axios configurée
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Simulation d'un délai réseau
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Service d'authentification
 * Gère la connexion et la déconnexion des utilisateurs
 */
export const authService = {
  /**
   * Connecte un utilisateur avec email et mot de passe
   * @param credentials - Email et mot de passe de l'utilisateur
   * @returns Promise avec le token et les données utilisateur
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // En mode développement, accepter n'importe quelle connexion
    if (USE_MOCK_DATA) {
      await delay(500); // Simuler un délai réseau
      console.log("🔧 Mode développement : connexion mockée acceptée");
      
      // Créer une réponse mockée
      const mockResponse: LoginResponse = {
        token: `mock_token_${Date.now()}`,
        user: {
          id: 1,
          email: credentials.email,
          raisonSociale: "Utilisateur de test",
        },
      };
      
      // Stocker le token et les données utilisateur
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
      }
      
      return mockResponse;
    }

    // Tentative de connexion via l'API
    try {
      const response = await authApi.post<LoginResponse>('/auth/login', credentials);
      
      // Stocker le token et les données utilisateur
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Gérer les erreurs HTTP
        if (error.response) {
          throw new Error(
            error.response.data?.message || 
            'Erreur lors de la connexion. Vérifiez vos identifiants.'
          );
        } else if (error.request) {
          // Si l'API n'est pas disponible, utiliser les données mockées en fallback
          console.warn("⚠️ API non disponible, utilisation de données mockées");
          const mockResponse: LoginResponse = {
            token: `mock_token_${Date.now()}`,
            user: {
              id: 1,
              email: credentials.email,
              raisonSociale: "Utilisateur de test",
            },
          };
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', mockResponse.token);
            localStorage.setItem('user', JSON.stringify(mockResponse.user));
          }
          
          return mockResponse;
        }
      }
      throw new Error('Une erreur inattendue s\'est produite lors de la connexion.');
    }
  },

  /**
   * Déconnecte l'utilisateur
   * Supprime le token et les données utilisateur du localStorage
   */
  async logout(): Promise<void> {
    try {
      // Appeler l'endpoint de déconnexion si nécessaire
      await authApi.post('/auth/logout');
    } catch (error) {
      // Même en cas d'erreur, on nettoie le localStorage
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer le localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns true si un token existe dans le localStorage
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  /**
   * Récupère le token d'authentification
   * @returns Le token ou null si non trouvé
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
};

