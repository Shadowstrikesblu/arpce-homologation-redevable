// components/dashboard/StatsCards.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react'
import { DashboardStats } from '../types/dashboard.types'

interface StatsCardsProps {
  stats: DashboardStats
  onViewAll?: (filter?: string) => void
}

type CardConfig = {
  title: string
  value: number | string
  icon: typeof FileText
  accent: {
    bg: string
    text: string
  }
  subtitle?: string
  badge?: string
  onClick?: () => void
}

export function StatsCards({ stats, onViewAll }: StatsCardsProps) {
  const cards: CardConfig[] = [
    {
      title: 'Total des demandes',
      value: stats.total,
      icon: FileText,
      accent: { bg: 'bg-[#af3338]/10', text: 'text-[#af3338]' },
      onClick: () => onViewAll?.('all')
    },
    {
      title: 'En cours',
      value: stats.inProgress,
      icon: Clock,
      accent: { bg: 'bg-amber-100', text: 'text-amber-600' },
      badge: 'En traitement',
      onClick: () => onViewAll?.('inProgress')
    },
    {
      title: 'Demandes validées',
      value: `${stats.success}/${stats.total}`,
      icon: CheckCircle,
      accent: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
      subtitle:
        stats.total > 0
          ? `${stats.success} réussite${stats.success > 1 ? "s" : ""} sur ${stats.total} demande${stats.total > 1 ? "s" : ""}`
          : "Aucune demande enregistrée",
      onClick: () => onViewAll?.('success')
    },
    {
      title: 'Demandes rejetées',
      value: `${stats.failed}/${stats.total}`,
      icon: XCircle,
      accent: { bg: 'bg-rose-100', text: 'text-rose-600' },
      subtitle:
        stats.total > 0
          ? `${stats.failed} rejet${stats.failed > 1 ? "s" : ""} sur ${stats.total} demande${stats.total > 1 ? "s" : ""}`
          : "Aucune demande enregistrée",
      onClick: () => onViewAll?.('failed')
    },
    {
      title: 'Paiements en attente',
      value: stats.pendingPayments,
      icon: CreditCard,
      accent: { bg: 'bg-sky-100', text: 'text-sky-600' },
      badge: 'À traiter',
      onClick: () => onViewAll?.('payments')
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="group cursor-pointer border border-gray-100 bg-white/90 backdrop-blur-sm shadow-sm transition hover:shadow-md"
          onClick={card.onClick}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {card.title}
              </p>
              <p
                className={`${typeof card.value === "string" ? "text-2xl" : "text-3xl"} font-semibold text-gray-900`}
              >
                {card.value}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${card.accent.bg}`}>
              <card.icon className={`h-5 w-5 ${card.accent.text}`} />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {card.badge && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                {card.badge}
              </Badge>
            )}
            {card.subtitle && (
              <p className="text-sm text-gray-500">
                {card.subtitle}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}