// helpers/demande-empty.ts
import { BinaryData, Demande, DocumentDemande, TypeCle, TypeCode, TypeLibelle, TypeNombre, TypeNoms, TypeNomsComplet, TypeRemarques } from "../interfaces/models.interface"

export const createEmptyDemande = () => ({
  id: undefined as unknown as TypeCle,
  equipement: "" as unknown as TypeLibelle,
  modele: "" as unknown as TypeLibelle,
  marque: "" as unknown as TypeLibelle,
  fabricant: "" as unknown as TypeLibelle,
  type: "" as unknown as TypeLibelle,
  description: "" as unknown as TypeRemarques,
  quantiteEquipements: undefined as unknown as TypeNombre,

})



  export const fileToDocumentDemande = (
    file: File,
    prefixNom: string
  ): DocumentDemande =>{

    const extension = file.name.includes(".")
      ? (file.name.split(".").pop() as TypeCode)
      : ("" as TypeCode)

    return {
      id: crypto.randomUUID() as unknown as TypeCle,
      idDemande: null as unknown as TypeCle, // sera rempli côté back si besoin
      nom: `${prefixNom} - ${file.name}` as TypeNoms,
      donnees: file as unknown as BinaryData,
      extension,
      demande: undefined,
    }
  }
