import { Demande } from "../interfaces/models.interface"

export interface DemandeFormProps {
  initialValue: Demande
  onSubmitDemande: (demande: Demande) => void
  label?: string
  onFormChange?: (demande: Demande) => void
}
