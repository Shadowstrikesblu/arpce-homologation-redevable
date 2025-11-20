"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inscription } from '@/types/types';

interface InscriptionForm extends Inscription {
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
  };

  const validateForm = (): boolean => {
    const newErrors: InscriptionErrors = {};

    if (!formData.raisonSociale.trim()) {
      newErrors.raisonSociale = 'La raison sociale est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.contactNom.trim()) {
      newErrors.contactNom = 'Le nom du contact est obligatoire';
    }

    if (!formData.contactTelephone.trim()) {
      newErrors.contactTelephone = 'Le téléphone est obligatoire';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.contactTelephone)) {
      newErrors.contactTelephone = 'Le numéro de téléphone n\'est pas valide';
    }

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
      const apiData: Inscription = {
        raisonSociale: formData.raisonSociale,
        email: formData.email,
        password: formData.password,
        contactNom: formData.contactNom,
        contactTelephone: formData.contactTelephone,
      };

      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        router.push('/platform?message=inscription-reussie');
      } else {
        const errorData = await response.json();
        alert(`Erreur: ${errorData.message || 'Une erreur est survenue'}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">


      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inscrivez-vous pour accéder à votre plateform d'homologation
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="raisonSociale" className="block text-sm font-medium text-gray-700">
                Raison Sociale *
              </label>
              <div className="mt-1">
                <input
                  id="raisonSociale"
                  name="raisonSociale"
                  type="text"
                  required
                  value={formData.raisonSociale}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.raisonSociale ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Entrez la raison sociale de votre entreprise"
                />
                {errors.raisonSociale && (
                  <p className="mt-1 text-sm text-red-600">{errors.raisonSociale}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse Email *
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe *
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Minimum 6 caractères"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe *
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Répétez votre mot de passe"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contactNom" className="block text-sm font-medium text-gray-700">
                Nom  *
              </label>
              <div className="mt-1">
                <input
                  id="contactNom"
                  name="contactNom"
                  type="text"
                  required
                  value={formData.contactNom}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.contactNom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nom et prénom de la personne à contacter"
                />
                {errors.contactNom && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNom}</p>
                )}
              </div>
            </div>

            {/* Téléphone du contact */}
            <div>
              <label htmlFor="contactTelephone" className="block text-sm font-medium text-gray-700">
                Numéro de téléphone *
              </label>
              <div className="mt-1">
                <input
                  id="contactTelephone"
                  name="contactTelephone"
                  type="tel"
                  required
                  value={formData.contactTelephone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.contactTelephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.contactTelephone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactTelephone}</p>
                )}
              </div>
            </div>

            {/* Conditions d'utilisation */}
            <div className="flex items-center">
              <input
                id="acceptConditions"
                name="acceptConditions"
                type="checkbox"
                checked={formData.acceptConditions}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptConditions" className="ml-2 block text-sm text-gray-900">
                J'accepte les{' '}
                <a href="/conditions-utilisation" className="text-blue-600 hover:text-blue-500">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/politique-confidentialite" className="text-blue-600 hover:text-blue-500">
                  politique de confidentialité
                </a>{' '}
                *
              </label>
            </div>
            {errors.acceptConditions && (
              <p className="text-sm text-red-600">{errors.acceptConditions}</p>
            )}

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </div>

            {/* Lien vers connexion */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte?{' '}
                <a href="/connexion" className="font-medium text-blue-600 hover:text-blue-500">
                  Se connecter
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}