import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Eye } from 'lucide-react'
import { RecentDemand } from '../types/dashboard.types'
import { HumanDate } from '../utils/date.util'
import { pathsUtils } from '../utils/path.util'
import { useRouter } from 'next/navigation'

interface RecentDemandsTableProps {
  demands: RecentDemand[]
  onViewMore: () => void
  onViewDetails: (id: string) => void
}

const statusStyles: Record<string, { label: string; className: string }> = {
  success: { label: 'Validé', className: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Rejeté', className: 'bg-rose-100 text-rose-700' },
  inProgress: { label: 'En cours', className: 'bg-amber-100 text-amber-700' },
  pending: { label: 'En attente', className: 'bg-blue-100 text-blue-700' },
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

export function RecentDemandsTable({ demands, onViewMore, onViewDetails }: RecentDemandsTableProps) {
  
  const router = useRouter()
  
  return (
    <Card className="border border-gray-100 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Dossiers récents</p>
          <p className="text-xs text-gray-500">Les dernières demandes enregistrées</p>
        </div>
        <Button variant="ghost" size="sm" className="text-[#8ba755] hover:text-[#738c47]" onClick={onViewMore}>
          Voir tout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {demands.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 p-8 text-center text-sm text-gray-500">
            Aucun dossier récent
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50/80 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">N° dossier</th>
                  <th className="px-4 py-3">Équipement</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {demands.map((demand) => {
                  const status =
                    statusStyles[demand.statut as keyof typeof statusStyles] ?? statusStyles['pending']!
                  return (
                    <tr key={demand.id} className="transition hover:bg-gray-50/70" onClick={()=>router.push(pathsUtils.projects + demand.id)}>
                      <td className="px-4 py-3 font-medium text-gray-900">{demand.numero}</td>
                      <td className="px-4 py-3 text-gray-700">{demand.demandes.length}</td>
                      <td className="px-4 py-3">
                        <Badge className={status.className} variant="secondary">
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{HumanDate.format(demand.dateOuverture)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => onViewDetails(demand.id.toString())}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
// components/dashboard/RecentDemandsTable.tsx