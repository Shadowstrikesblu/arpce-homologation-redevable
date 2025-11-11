// components/dashboard/PendingPaymentsTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, ArrowRight } from 'lucide-react'
import { PendingPayment } from '../types/dashboard.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PendingPaymentsTableProps {
  payments: PendingPayment[]
  onProcessPayment: (id: string) => void
}

export function PendingPaymentsTable({ payments, onProcessPayment }: PendingPaymentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-[#af3338]" />
            Paiements en attente
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Dossier</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Mode de règlement</TableHead>
              <TableHead>Date d'échéance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.numeroDossier}</TableCell>
                <TableCell>{payment.client}</TableCell>
                <TableCell>{payment.montant.toLocaleString()} €</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {payment.modeReglement}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    new Date(payment.dateEcheance) < new Date() 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }>
                    {new Date(payment.dateEcheance).toLocaleDateString()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => onProcessPayment(payment.id.toString())}
                  >
                    Traiter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {payments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun paiement en attente
          </div>
        )}
      </CardContent>
    </Card>
  )
}