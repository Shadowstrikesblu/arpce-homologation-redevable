// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardStats, PendingPayment, RecentDemand } from '@/lib/types/dashboard.types'
import { StatsCards } from '@/lib/components/statsDahsboardCard'
import { PendingPaymentsTable } from '@/lib/components/pendingPayment'
import { RecentDemandsTable } from '@/lib/components/recentRequest'
import { QuickActions, SupportAndHelpSection } from '@/lib/components/quickAction'
import { pathsUtils } from '@/lib/utils/path.util'
import { dashboardStats } from '@/lib/endpoints/dashboard'



export default function DashboardPage() {
  const router = useRouter()

// STATES
const [stats, setStats] = useState<DashboardStats | null>(null)
const [recentDemands, setRecentDemands] = useState<RecentDemand[]>([])
const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
const [loading, setLoading] = useState(true)

// FETCH DES DONNÉES DU DASHBOARD
useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const statsData = await dashboardStats.getStats()
      setStats(statsData)
      console.log(statsData);
      

      const recent = await dashboardStats.getRecentDemand()
      setRecentDemands(recent || [])

      const payments = await dashboardStats.getPendingPayments("1")
      setPendingPayments(payments || [])

    } catch (error) {
      console.error("Erreur Dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  loadDashboardData()
}, [])



  // 📌 LOADING UI (optionnel)
  if (loading || !stats) {
    return (
      <div className="p-5 text-center text-gray-500">
        Chargement du tableau de bord...
      </div>
    )
  }


  // HANDLERS
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

        {/* 🔹 STATISTIQUES */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Aperçu des demandes
            </h2>

            <StatsCards 
              stats={stats} 
              onViewAll={handleViewAllDemands} 
            />
          </div>
        </section>

        <QuickActions />

        {/* 🔹 DEMANDES RECENTES */}
        <RecentDemandsTable
          demands={recentDemands}
          onViewMore={() => router.push(pathsUtils.projects)}
          onViewDetails={handleViewDemandDetails}
        />

        {/* 🔹 PAIEMENTS EN ATTENTE */}
        <PendingPaymentsTable 
          payments={pendingPayments} 
          onProcessPayment={handleProcessPayment} 
        />

        <SupportAndHelpSection />
      </main>
    </div>
  )
}
