import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-react'
import { PendingBill } from '../types/dashboard.types'

interface PendingBillTableProps {
  bills: PendingBill[]
  onLineClick : (id : number)=>void
}

const formatDate = (value: string) =>new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

export function PendingBillsTable({ bills, onLineClick }: PendingBillTableProps) {
  


  
  return (
    <Card className="border border-gray-100 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Devis en attente de validation</p>
          <p className="text-xs text-gray-500">Suivez les devis à traiter rapidement</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#af3338]/10 px-3 py-1 text-xs font-medium text-[#af3338]">
          <CreditCard className="h-4 w-4" />
          {bills.length} en attente
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        {bills.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 p-8 text-center text-sm text-gray-500">
            Aucun paiement en attente
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">N° dossier</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">EQP</th>
                  <th className="px-4 py-3">Reçu le</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {bills.map((bill) => {
                  return (
                    <tr key={bill.id} className="transition hover:bg-gray-50/70" onClick={()=>onLineClick(bill.id)}>
                      <td className="px-4 py-3 font-medium text-gray-900">{bill.numeroDossier}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {bill.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-gray-100 text-gray-700" variant="secondary">
                          {bill.EquipementFacturation.length}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-gray-100 text-gray-700" variant="secondary">
                          {formatDate(bill.dateCreation)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button>Refuser</Button>
                        <Button>Valider</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
// components/dashboard/PendingPaymentsTable.tsx