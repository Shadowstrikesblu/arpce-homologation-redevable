"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la plateforme (qui est protégée par UserProvider)
    router.replace('/platform')
  }, [router])

  return null
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