export const HumanDate = {
  /**
   * Date -> string normale : 06 février 2025
   */
  format(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  },

  /**
   * Date + heure : 06 février 2025 à 14:22
   */
  datetime(date: Date | string) {
    const d = new Date(date);
    return (
      d.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }) +
      " à " +
      d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  },

  /**
   * Format court : 06/02/2025
   */
  short(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR");
  },

  /**
   * Humain : il y a 3 jours / dans 2 heures
   */
  fromNow(date: Date | string) {
    const d = new Date(date);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / 1000;

    const sec = Math.abs(diff);
    const min = sec / 60;
    const hour = min / 60;
    const day = hour / 24;

    const prefix = diff < 0 ? "il y a" : "dans";

    if (sec < 60) return `${prefix} quelques secondes`;
    if (min < 60) return `${prefix} ${Math.floor(min)} minute(s)`;
    if (hour < 24) return `${prefix} ${Math.floor(hour)} heure(s)`;
    if (day < 30) return `${prefix} ${Math.floor(day)} jour(s)`;

    // Mois et années
    const month = day / 30;
    if (month < 12) return `${prefix} ${Math.floor(month)} mois`;

    const year = month / 12;
    return `${prefix} ${Math.floor(year)} an(s)`;
  },

  /**
   * Vérifie si c’est aujourd’hui
   */
  isToday(date: Date | string) {
    const d = new Date(date);
    const n = new Date();
    return (
      d.getDate() === n.getDate() &&
      d.getMonth() === n.getMonth() &&
      d.getFullYear() === n.getFullYear()
    );
  },
};
