// components/dashboard/RecentDemandsTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Eye, FileText } from 'lucide-react'
import { RecentDemand } from '../types/dashboard.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RecentDemandsTableProps {
  demands: RecentDemand[]
  onViewMore: () => void
  onViewDetails: (id: string) => void
}

export function RecentDemandsTable({ demands, onViewMore, onViewDetails }: RecentDemandsTableProps) {
  const getStatusBadge = (statut: string) => {
    const variants = {
      success: { label: 'Validé', color: 'bg-green-100 text-green-800' },
      failed: { label: 'Rejeté', color: 'bg-red-100 text-red-800' },
      inProgress: { label: 'En cours', color: 'bg-amber-100 text-amber-800' },
      pending: { label: 'En attente', color: 'bg-blue-100 text-blue-800' }
    }
    
    const variant = variants[statut as keyof typeof variants] || variants.pending
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-3 text-[#af3338]" />
            Demandes récentes
          </div>
          <Button variant="ghost" onClick={onViewMore} className="text-[#8ba755] hover:text-[#7a9648]">
            Voir plus
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Demande</TableHead>
              <TableHead>Équipement</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demands.map((demand) => (
              <TableRow key={demand.id}>
                <TableCell className="font-medium">{demand.numeroDemande}</TableCell>
                <TableCell>{demand.equipement}</TableCell>
                <TableCell>{demand.contactNom}</TableCell>
                <TableCell>{getStatusBadge(demand.statut)}</TableCell>
                <TableCell>{new Date(demand.dateCreation).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(demand.id.toString())}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {demands.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune demande récente
          </div>
        )}
      </CardContent>
    </Card>
  )
}