export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'empty';

  const lengthOk = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const criteriaCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;

  if (!lengthOk || criteriaCount <= 1) return 'weak';
  if (lengthOk && (criteriaCount === 2 || criteriaCount === 3)) return 'medium';
  if (lengthOk && criteriaCount === 4) return 'strong';

  return 'weak';
};

export const getPasswordStrengthConfig = (strength: PasswordStrength) => {
  switch (strength) {
    case 'weak':
      return {
        label: 'Mot de passe faible',
        barClass: 'w-1/3 bg-red-500',
        textClass: 'text-red-600',
      };
    case 'medium':
      return {
        label: 'Mot de passe moyen',
        barClass: 'w-2/3 bg-yellow-400',
        textClass: 'text-yellow-600',
      };
    case 'strong':
      return {
        label: 'Mot de passe fort',
        barClass: 'w-full bg-green-500',
        textClass: 'text-green-600',
      };
    default:
      return {
        label: '',
        barClass: 'w-0',
        textClass: 'text-gray-500',
      };
  }
};
