// validateExtendDemande.ts

import { extendDemande } from "../types/extendedDossier.type"


export function validateExtendDemande(data: extendDemande) {
  const errors: Record<string, string> = {}

  const checkRequired = (field: keyof extendDemande, label: string) => {
    if (!data[field] || data[field].toString().trim() === "") {
      errors[field] = `${label} est obligatoire`
    }
  }

  checkRequired("equipement", "L'équipement")
  checkRequired("modele", "Le modèle")
  checkRequired("marque", "La marque")
  checkRequired("fabricant", "Le fabricant")
  checkRequired("type", "Le type d'équipement")
  checkRequired("description", "La description")
  checkRequired("quantiteEquipements", "La quantité d'équipements")

  // Quantité doit être un nombre > 0
  if (data.quantiteEquipements) {
    const qty = Number(data.quantiteEquipements)
    if (isNaN(qty) || qty <= 0) {
      errors["quantiteEquipements"] = "La quantité doit être un nombre positif"
    }
  }

  // Fiche technique obligatoire
  if (!data.fiche_technique || !(data.fiche_technique instanceof File)) {
    errors["fiche_technique"] = "La fiche technique (PDF) est obligatoire"
  } else {
    // Optionnel : validation de la taille
    const maxSizeMb = 3
    if (data.fiche_technique.size / 1024 / 1024 > maxSizeMb) {
      errors["fiche_technique"] = `La fiche technique ne doit pas dépasser ${maxSizeMb} Mo`
    }

    // Optionnel : validation du type MIME
    if (!data.fiche_technique.type.includes("pdf")) {
      errors["fiche_technique"] = "La fiche technique doit être un PDF"
    }
  }

  // Si aucune erreur → OK
  if (Object.keys(errors).length === 0) {
    return { valid: true, errors: {} }
  }

  // Sinon → erreurs
  return { valid: false, errors }
}
