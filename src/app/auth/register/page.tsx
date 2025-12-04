"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, RegisterInt } from '@/lib/endpoints/auth';
import {
  Eye,
  EyeOff,
  Loader2,
  Building,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  User2,
  MapPin
} from 'lucide-react';
import { pathsUtils } from '@/lib/utils/path.util';
import Script from 'next/script';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CONGO_VILLES } from '@/lib/ressources/city';
import { getPasswordStrength, getPasswordStrengthConfig } from '@/lib/utils/password';

interface InscriptionForm extends RegisterInt {
  confirmPassword: string;
  acceptConditions: boolean;
  autreVille?: string;
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
  typeClient?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  autreVille?: string;
}

export default function InscriptionPage() {
  const SITE_KEY = process.env["NEXT_PUBLIC_RECAPTCHA_SITE_KEY"];
  const router = useRouter();

  const [formData, setFormData] = useState<InscriptionForm>({
    raisonSociale: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNom: '',
    contactTelephone: '',
    acceptConditions: false,
    typeClient: 'entreprise',
    adresse: '',
    ville: '',
    pays: 'CG',
    captchaToken: '',
    autreVille: '',
  });

  const [errors, setErrors] = useState<InscriptionErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEntreprise = formData.typeClient === 'entreprise';

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

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthConfig = getPasswordStrengthConfig(passwordStrength);

  const handleSelectChange = (name: keyof InscriptionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof InscriptionErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: InscriptionErrors = {};

    if (!formData.typeClient) {
      newErrors.typeClient = 'Veuillez sélectionner un type de compte';
    }

    if (!formData.raisonSociale.trim()) {
      newErrors.raisonSociale = isEntreprise
        ? 'La raison sociale est obligatoire'
        : 'Le nom / raison sociale est obligatoire';
    } else if (formData.raisonSociale.trim().length < 2) {
      newErrors.raisonSociale = 'Doit contenir au moins 2 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L’email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L’email n’est pas valide';
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else {
      const strength = getPasswordStrength(formData.password);
      if (strength !== 'strong') {
        newErrors.password =
          'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.';
      }
    }


    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.contactNom.trim()) {
      newErrors.contactNom = 'Le nom du contact est obligatoire';
    } else if (formData.contactNom.trim().length < 2) {
      newErrors.contactNom = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.contactTelephone.trim()) {
      newErrors.contactTelephone = 'Le téléphone est obligatoire';
    } else {
      const cleanedPhone = formData.contactTelephone.replace(/[^\d+]/g, '');
      const digitCount = cleanedPhone.replace(/[^0-9]/g, '').length;
      if (digitCount < 9) {
        newErrors.contactTelephone = 'Le numéro doit contenir au moins 9 chiffres';
      }
    }

    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L’adresse est obligatoire';
    }

    if (!formData.ville) {
      newErrors.ville = 'La ville est obligatoire';
    } else if (formData.ville === 'autre' && !formData.autreVille?.trim()) {
      newErrors.autreVille = 'Veuillez préciser votre ville';
    }

    if (!formData.pays) {
      newErrors.pays = 'Le pays est obligatoire';
    }

    if (!formData.acceptConditions) {
      newErrors.acceptConditions = 'Vous devez accepter les conditions d’utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!window.grecaptcha || !SITE_KEY) {
      setErrors(prev => ({
        ...prev,
        general: 'Le service de vérification (reCAPTCHA) est indisponible. Veuillez réessayer plus tard.',
      }));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      
      const captchaToken = await window.grecaptcha.execute(SITE_KEY, {
        action: "register",
      });

      const villeFinale =
        formData.ville === 'autre' && formData.autreVille?.trim()
          ? formData.autreVille.trim()
          : formData.ville;

      const apiData: RegisterInt = {
        raisonSociale: formData.raisonSociale.trim(),
        email: formData.email.trim(),
        password: formData.password,
        contactNom: formData.contactNom.trim(),
        contactTelephone: formData.contactTelephone.trim(),
        captchaToken: captchaToken,
        typeClient: formData.typeClient,
        adresse: formData.adresse.trim(),
        ville: villeFinale,
        pays: formData.pays,
      };

      await auth.register(apiData);
      router.push(pathsUtils.otp + '?message=inscription-reussie');

    } catch (error: any) {

      setErrors(prev => ({
        ...prev,
        general:
          error?.response?.data?.message ||
          "Une erreur est survenue lors de l’inscription. Veuillez réessayer.",
      }));
      console.log(error)

    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <>
      <script
        src={`https://www.google.com/recaptcha/enterprise.js?render=${SITE_KEY}`}
        async
        defer
      ></script>
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo_arpce.png"
                  alt="Logo ARPCE"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Créer votre compte
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">
                    Accédez à votre portail d’homologation en quelques étapes.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-60">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Type de compte *
                </label>
                <Select
                  value={formData.typeClient}
                  disabled={isSubmitting}
                  onValueChange={(value) =>
                    handleSelectChange('typeClient', value as InscriptionForm["typeClient"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entreprise">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>Entreprise</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="particulier">
                      <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4 text-gray-500" />
                        <span>Particulier</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.typeClient && (
                  <p className="text-xs text-red-600 mt-1">{errors.typeClient}</p>
                )}
              </div>
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1 : Identité / structure */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Informations sur le compte
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="raisonSociale"
                      className="text-sm font-medium text-gray-700"
                    >
                      {isEntreprise
                        ? "Raison sociale de l’entreprise *"
                        : "Nom / Raison sociale *"}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="raisonSociale"
                        name="raisonSociale"
                        type="text"
                        required
                        value={formData.raisonSociale}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="pl-10"
                        placeholder={
                          isEntreprise
                            ? "Nom légal de votre entreprise"
                            : "Votre nom complet ou raison sociale"
                        }
                      />
                    </div>
                    {errors.raisonSociale && (
                      <p className="text-xs text-red-600">
                        {errors.raisonSociale}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Adresse email de connexion *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                        placeholder="exemple@domaine.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                        placeholder="8+ caractères, maj, min, chiffre, symbole"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Jauge */}
                    <div className="mt-1">
                      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrengthConfig.barClass}`}
                        />
                      </div>
                      {passwordStrength !== 'empty' && (
                        <p className={`mt-1 text-xs ${passwordStrengthConfig.textClass}`}>
                          {passwordStrengthConfig.label} – le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.
                        </p>
                      )}
                    </div>

                    {errors.password && (
                      <p className="text-xs text-red-600">{errors.password}</p>
                    )}
                  </div>


                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirmation du mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                        placeholder="Répétez le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                      <p className="text-xs text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2 : Contact référent */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Personne à contacter
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="contactNom"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nom et prénom du contact *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="contactNom"
                        name="contactNom"
                        type="text"
                        required
                        value={formData.contactNom}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="pl-10"
                        placeholder="Nom et prénom du référent"
                      />
                    </div>
                    {errors.contactNom && (
                      <p className="text-xs text-red-600">{errors.contactNom}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contactTelephone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Numéro de téléphone du contact *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="contactTelephone"
                        name="contactTelephone"
                        type="tel"
                        required
                        value={formData.contactTelephone}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="pl-10"
                        placeholder="+242 06 000 00 00"
                      />
                    </div>
                    {errors.contactTelephone && (
                      <p className="text-xs text-red-600">
                        {errors.contactTelephone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3 : Coordonnées */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                  Coordonnées
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label
                      htmlFor="adresse"
                      className="text-sm font-medium text-gray-700"
                    >
                      Adresse postale complète *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="adresse"
                        name="adresse"
                        type="text"
                        required
                        value={formData.adresse}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="pl-10"
                        placeholder="Rue, numéro, quartier..."
                      />
                    </div>
                    {errors.adresse && (
                      <p className="text-xs text-red-600">{errors.adresse}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ville" className="text-sm font-medium text-gray-700">
                      Ville *
                    </label>
                    <Select
                      value={formData.ville}
                      disabled={isSubmitting}
                      onValueChange={(value) => handleSelectChange('ville', value)}
                    >
                      <SelectTrigger id="ville" className="w-full">
                        <SelectValue placeholder="Sélectionner votre ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONGO_VILLES.map((ville) => (
                          <SelectItem key={ville.value} value={ville.value}>
                            {ville.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ville && (
                      <p className="text-xs text-red-600">{errors.ville}</p>
                    )}

                    {formData.ville === "autre" && (
                      <div className="mt-2 space-y-1">
                        <label
                          htmlFor="autreVille"
                          className="text-xs font-medium text-gray-600"
                        >
                          Précisez votre ville *
                        </label>
                        <Input
                          id="autreVille"
                          name="autreVille"
                          placeholder="Votre ville"
                          value={formData.autreVille}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        {errors.autreVille && (
                          <p className="text-xs text-red-600">
                            {errors.autreVille}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pays" className="text-sm font-medium text-gray-700">
                      Pays *
                    </label>
                    <Select
                      value={formData.pays}
                      disabled={isSubmitting}
                      onValueChange={(value) => handleSelectChange('pays', value)}
                    >
                      <SelectTrigger id="pays" className="w-full">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <SelectValue placeholder="Sélectionner le pays" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CG">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🇨🇬</span>
                            <span>République du Congo</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.pays && (
                      <p className="text-xs text-red-600">{errors.pays}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Input
                    id="acceptConditions"
                    name="acceptConditions"
                    type="checkbox"
                    checked={formData.acceptConditions}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 mt-1 text-[#af3338] focus:ring-[#af3338] border-gray-300 bg-primary rounded-full"
                  />
                  <label
                    htmlFor="acceptConditions"
                    className="text-sm text-gray-700"
                  >
                    J’accepte les{' '}
                    <Link
                      href="/conditions-utilisation"
                      className="text-secondary hover:text-seconday/30"
                    >
                      conditions d’utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link
                      href="/politique-confidentialite"
                      className="text-secondary hover:text-seconday/30"
                    >
                      politique de confidentialité
                    </Link>{' '}
                    *
                  </label>
                </div>
                {errors.acceptConditions && (
                  <p className="text-xs text-red-600">
                    {errors.acceptConditions}
                  </p>
                )}
              </div>

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
                  className="font-medium text-[#af3338] hover:text-[#8f2a2e]"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Portail d'homologation - Redevable. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
