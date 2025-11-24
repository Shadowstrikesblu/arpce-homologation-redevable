export const PriceFormatter = {
  /**
   * Format classique avec devise
   */
  format(value: number, currency: string = "XOF") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  },

  /**
   * Sans devise : juste un format propre
   */
  number(value: number) {
    return new Intl.NumberFormat("fr-FR").format(value);
  },

  /**
   * Formater comme "15 000" → utile pour affichage dans tableaux
   */
  spaced(value: number) {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  },

  /**
   * Style K / M
   * Exemple : 15000 → "15K"
   */
  compact(value: number) {
    return new Intl.NumberFormat("fr-FR", {
      notation: "compact",
      compactDisplay: "short"
    }).format(value);
  }
};
