"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService, LoginCredentials } from "@/lib/services/auth.service";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    motPasse: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Gère la soumission du formulaire de connexion
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation basique
      if (!formData.email || !formData.motPasse) {
        setError("Veuillez remplir tous les champs");
        setLoading(false);
        return;
      }

      // Appel du service d'authentification
      await authService.login(formData);

      // Redirection vers le dashboard après connexion réussie
      router.push("/platform");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère les changements dans les champs du formulaire
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur modifie un champ
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* En-tête avec logo */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo arpce.png"
                alt="Logo ARPCE"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
            <p className="text-gray-600">Accédez à votre portail d'homologation</p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="motPasse" className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="motPasse"
                  name="motPasse"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.motPasse}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Lien mot de passe oublié */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#af3338] hover:text-[#8f2a2e] transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de connexion */}
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-[#af3338] to-[#c9454a] hover:from-[#8f2a2e] hover:to-[#b9353a] text-white font-medium py-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          {/* Lien d'inscription */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Vous n&apos;avez pas de compte ?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-[#af3338] hover:text-[#8f2a2e] transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <p className="text-center text-xs text-gray-400">
            © 2024 Portail d&apos;homologation - Redevable. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}

