import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, ArrowRight, Smartphone } from 'lucide-react'

interface PaymentCardProps {
  dossier: {
    montantTotal?: number
    taxe?: number
    statutPaiement?: 'en_attente' | 'paye' | 'echec' | 'partiel'
  }
  onPaymentClick: () => void
  className?: string
}

export function PaymentCard({ dossier, onPaymentClick, className = '' }: PaymentCardProps) {
  // Calcul des montants
  const montantTTC = dossier.montantTotal || 0


  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant)
  }



  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Paiement
            </CardTitle>
            <CardDescription>
              Procédez au règlement de votre dossier
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Montants */}
        <div className="space-y-3">

          {/* Séparateur */}
          <div className="border-t border-gray-200 my-2"></div>

          {/* Total TTC */}
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-semibold">Total à payer</span>
            <span className="text-xl font-bold text-primary">
              {formatMontant(montantTTC)}
            </span>
          </div>
        </div>

        {/* Bouton de paiement */}
        <Button
          onClick={onPaymentClick}
          className="w-full bg-primary hover:bg-primary text-white font-semibold py-3"
          disabled={dossier.statutPaiement === 'paye'}
        >
          {dossier.statutPaiement === 'paye' ? (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Paiement effectué
            </>
          ) : (
            <>
              Procéder au paiement
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}