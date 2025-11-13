// app/dashboard/page.tsx
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardStats, PendingPayment, RecentDemand } from '@/lib/types/dashboard.types'
import { DashboardHeader } from '@/lib/components/dashboardHeader'
import { StatsCards } from '@/lib/components/statsDahsboardCard'
import { PendingPaymentsTable } from '@/lib/components/pendingPayment'
import { RecentDemandsTable } from '@/lib/components/recentRequest'
import { QuickActions, SupportAndHelpSection } from '@/lib/components/quickAction'
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
]

export default function DashboardPage() {
  const router = useRouter()
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
    <div>

      <main className="space-y-10">
        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Aperçu des demandes
            </h2>
            <StatsCards stats={stats} onViewAll={handleViewAllDemands} />
          </div>
        </section>

        <QuickActions />

          <RecentDemandsTable
            demands={recentDemands}
            onViewMore={() => router.push(pathsUtils.projects)}
            onViewDetails={handleViewDemandDetails}
          />
          
          <PendingPaymentsTable payments={pendingPayments} onProcessPayment={handleProcessPayment} />

        <SupportAndHelpSection />
      </main>
    </div>
  )
}