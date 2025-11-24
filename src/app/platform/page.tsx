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
import SystemLoader from '@/lib/components/loader'
import { useToast } from '@/context/toastModal'
import { TextRessource } from '@/lib/ressources/alert.ressource'
import { PendingBillsTable } from '@/lib/components/pendingBills'



export default function DashboardPage() {
  const router = useRouter()

// STATES
const [stats, setStats] = useState<DashboardStats | null>({
  total: 0,
  success: 0,
  failed: 0,
  inProgress: 0,
  pendingPayments: 0
})
const [recentDemands, setRecentDemands] = useState<RecentDemand[]>([])
const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
const [loading, setLoading] = useState(true)
const toast = useToast()

// FETCH DES DONNÉES DU DASHBOARD
useEffect(() => {
  const loadDashboardData = async () => {
    try {
      const statsData = await dashboardStats.getStats()
      setStats(statsData)
      

      const recent = await dashboardStats.getRecentDemand()
      setRecentDemands(recent || [])

      // const payments = await dashboardStats.getPendingPayments("1")
      // setPendingPayments(payments || [])

    } catch (error) {
      console.error("Erreur Dashboard:", error)
      toast.error(TextRessource.dashboard.error_loading.desc, TextRessource.dashboard.error_loading.title)

    } finally {
      setLoading(false)
    }
  }

  loadDashboardData()
}, [])



  // 📌 LOADING UI (optionnel)
  if (loading || !stats) {
    return <SystemLoader/>
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

        <PendingBillsTable 
          bills={[]} 
          onLineClick={(id)=>{}} 
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
