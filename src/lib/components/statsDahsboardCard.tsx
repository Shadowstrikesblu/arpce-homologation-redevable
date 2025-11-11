// components/dashboard/StatsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react'
import { DashboardStats } from '../types/dashboard.types'

interface StatsCardsProps {
  stats: DashboardStats
  onViewAll?: (filter?: string) => void
}

export function StatsCards({ stats, onViewAll }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total des demandes',
      value: stats.total,
      icon: FileText,
      color: 'border-l-[#af3338]',
      valueColor: 'text-[#af3338]',
      onClick: () => onViewAll?.('all')
    },
    {
      title: 'Demandes validées',
      value: stats.success,
      icon: CheckCircle,
      color: 'border-l-[#8ba755]',
      valueColor: 'text-[#8ba755]',
      subtitle: `${Math.round((stats.success / stats.total) * 100)}% de réussite`,
      onClick: () => onViewAll?.('success')
    },
    {
      title: 'En cours',
      value: stats.inProgress,
      icon: Clock,
      color: 'border-l-amber-500',
      valueColor: 'text-amber-600',
      badge: 'En traitement',
      onClick: () => onViewAll?.('inProgress')
    },
    {
      title: 'Demandes rejetées',
      value: stats.failed,
      icon: XCircle,
      color: 'border-l-red-500',
      valueColor: 'text-red-600',
      subtitle: `${Math.round((stats.failed / stats.total) * 100)}% d'échec`,
      onClick: () => onViewAll?.('failed')
    },
    {
      title: 'Paiements en attente',
      value: stats.pendingPayments,
      icon: CreditCard,
      color: 'border-l-blue-500',
      valueColor: 'text-blue-600',
      badge: 'En attente',
      onClick: () => onViewAll?.('payments')
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index}
          className={`bg-white border-l-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer ${card.color}`}
          onClick={card.onClick}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <card.icon className="h-4 w-4 mr-2" />
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className={`text-3xl font-bold ${card.valueColor}`}>
                {card.value}
              </p>
              {card.badge && (
                <Badge variant="secondary" className={
                  card.title.includes('En cours') ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {card.badge}
                </Badge>
              )}
            </div>
            {card.subtitle && (
              <p className="text-sm text-gray-600 mt-2">
                {card.subtitle}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}