// app/dashboard/page.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardStats, PendingPayment, RecentDemand } from '@/lib/types/dashboard.types'
import { DashboardHeader } from '@/lib/components/dashboardHeader'
import { StatsCards } from '@/lib/components/statsDahsboardCard'
import { PendingPaymentsTable } from '@/lib/components/pendingPayment'
import { RecentDemandsTable } from '@/lib/components/recentRequest'
import { QuickActions } from '@/lib/components/quickAction'
import { pathsUtils } from '@/lib/utils/path.util'


// Données mockées
const mockStats: DashboardStats = {
  total: 24,
  success: 18,
  failed: 3,
  inProgress: 3,
  pendingPayments: 5
}

const mockRecentDemands: RecentDemand[] = [
  {
    id: 1,
    numeroDemande: 'HOM-2024-001',
    equipement: 'Serveur HP ProLiant',
    statut: 'success',
    dateCreation: '2024-01-15',
  },
  // ... autres données
]

const mockPendingPayments: PendingPayment[] = [
  {
    id: 1,
    numeroDossier: 'DOS-2024-001',
    montant: 2500,
    dateEcheance: '2024-02-01',
    modeReglement: 'Virement',
  },
  // ... autres données
]

export default function DashboardPage() {
  const router = useRouter()
  // const [activeSection, setActiveSection] = useState<'main' | 'notifications' | 'profile'>('main')
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [recentDemands, setRecentDemands] = useState<RecentDemand[]>(mockRecentDemands)
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>(mockPendingPayments)

  const handleViewAllDemands = (filter?: string) => {
    router.push(`/platform${filter ? `?filter=${filter}` : ''}`)
  }

  const handleViewDemandDetails = (id: string) => {
    router.push(pathsUtils.projects + id)
  }

  const handleProcessPayment = (id: string) => {
    router.push(`/paiements/${id}`)
  }



  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cartes de statistiques */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Aperçu des demandes</h2>
          <StatsCards stats={stats} onViewAll={handleViewAllDemands} />
        </section>

        {/* Actions rapides */}
        <QuickActions />

        <PendingPaymentsTable
          payments={pendingPayments}
          onProcessPayment={handleProcessPayment}
        />

        <RecentDemandsTable
          demands={recentDemands}
          onViewMore={()=>router.push(pathsUtils.projects)}
          onViewDetails={handleViewDemandDetails}
        />
      </div>
    </div>
  )
}