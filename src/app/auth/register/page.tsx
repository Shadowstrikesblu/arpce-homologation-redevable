"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, RegisterInt } from '@/lib/endpoints/auth'; 
import { Eye, EyeOff, Loader2, Building, Mail, Lock, User, Phone } from 'lucide-react';

interface InscriptionForm extends RegisterInt {
  confirmPassword: string;
  acceptConditions: boolean;
}

interface InscriptionErrors {
  raisonSociale?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  contactNom?: string;
  contactTelephone?: string;
  acceptConditions?: string;
  general?: string;
}

export default function InscriptionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<InscriptionForm>({
    raisonSociale: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNom: '',
    contactTelephone: '',
    acceptConditions: false,
  });
  const [errors, setErrors] = useState<InscriptionErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name as keyof InscriptionErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: InscriptionErrors = {};

    // Validation raison sociale
    if (!formData.raisonSociale.trim()) {
      newErrors.raisonSociale = 'La raison sociale est obligatoire';
    } else if (formData.raisonSociale.trim().length < 2) {
      newErrors.raisonSociale = 'La raison sociale doit contenir au moins 2 caractères';
    }

    // Validation email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation nom contact
    if (!formData.contactNom.trim()) {
      newErrors.contactNom = 'Le nom du contact est obligatoire';
    } else if (formData.contactNom.trim().length < 2) {
      newErrors.contactNom = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation téléphone
if (!formData.contactTelephone.trim()) {
  newErrors.contactTelephone = 'Le téléphone est obligatoire';
} else {
  const cleanedPhone = formData.contactTelephone.replace(/[^\d+]/g, '');
  
  const digitCount = cleanedPhone.replace(/[^0-9]/g, '').length;
  
  if (digitCount < 9) {
    newErrors.contactTelephone = 'Le numéro de téléphone doit contenir au moins 9 chiffres';
  }
}

    // Validation conditions
    if (!formData.acceptConditions) {
      newErrors.acceptConditions = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData: RegisterInt = {
        raisonSociale: formData.raisonSociale.trim(),
        email: formData.email.trim(),
        password: formData.password,
        contactNom: formData.contactNom.trim(),
        contactTelephone: formData.contactTelephone.trim(),
      };

      const result = await auth.register(apiData);

      router.push('/auth/login?message=inscription-reussie');
      
    } catch (error: any) {

      console.error('Erreur lors de l\'inscription:', error);
      
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.message?.includes('Network Error')) {
        setErrors({ general: 'Erreur de connexion. Vérifiez votre internet.' });
      } else {
        setErrors({ general: 'Une erreur est survenue lors de l\'inscription' });
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
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
            <h1 className="text-3xl font-bold text-gray-900">Créer votre compte</h1>
            <p className="text-gray-600">Inscrivez-vous pour accéder à votre portail d'homologation</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label htmlFor="raisonSociale" className="text-sm font-medium text-gray-700">
                Raison Sociale *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="raisonSociale"
                  name="raisonSociale"
                  type="text"
                  required
                  value={formData.raisonSociale}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="pl-10"
                  placeholder="Entrez la raison sociale de votre entreprise"
                />
              </div>
              {errors.raisonSociale && (
                <p className="text-sm text-red-600">{errors.raisonSociale}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="pl-10"
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="pl-10 pr-10"
                  placeholder="Minimum 6 caractères"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="pl-10 pr-10"
                  placeholder="Répétez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contactNom" className="text-sm font-medium text-gray-700">
                Nom *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="contactNom"
                  name="contactNom"
                  type="text"
                  required
                  value={formData.contactNom}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="pl-10"
                  placeholder="Nom et prénom de la personne à contacter"
                />
              </div>
              {errors.contactNom && (
                <p className="text-sm text-red-600">{errors.contactNom}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contactTelephone" className="text-sm font-medium text-gray-700">
                Numéro de téléphone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="contactTelephone"
                  name="contactTelephone"
                  type="tel"
                  required
                  value={formData.contactTelephone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="pl-10"
                  placeholder="01 23 45 67 89"
                />
              </div>
              {errors.contactTelephone && (
                <p className="text-sm text-red-600">{errors.contactTelephone}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                id="acceptConditions"
                name="acceptConditions"
                type="checkbox"
                checked={formData.acceptConditions}
                onChange={handleChange}
                disabled={isSubmitting}
                className="h-4 w-4 mt-1 text-[#af3338] focus:ring-[#af3338] border-gray-300 rounded"
              />
              <label htmlFor="acceptConditions" className="text-sm text-gray-700">
                J'accepte les{' '}
                <Link href="/conditions-utilisation" className="text-[#af3338] hover:text-[#8f2a2e] transition-colors">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/politique-confidentialite" className="text-[#af3338] hover:text-[#8f2a2e] transition-colors">
                  politique de confidentialité
                </Link>{' '}
                *
              </label>
            </div>
            {errors.acceptConditions && (
              <p className="text-sm text-red-600">{errors.acceptConditions}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-[#af3338] to-[#c9454a] hover:from-[#8f2a2e] hover:to-[#b9353a] text-white font-medium py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-[#af3338] hover:text-[#8f2a2e] transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-center text-xs text-gray-400">
            © 2024 Portail d'homologation - Redevable. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}