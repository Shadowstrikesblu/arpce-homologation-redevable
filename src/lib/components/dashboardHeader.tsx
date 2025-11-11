// components/dashboard/DashboardHeader.tsx
"use client"

import { Button } from '@/components/ui/button'
import { Plus, Bell, User, UserCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { pathsUtils } from '../utils/path.util'

export function DashboardHeader() {
  const router = useRouter()

  return (
    <div className="bg-linear-to-r from-[#af3338] to-[#c9454a] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-white/80 mt-1">Bienvenue sur votre portail d'homologation</p>
          </div>
          
          <div className="flex items-center space-x-4">


            <Button
              onClick={() => router.push(pathsUtils.request_form)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle demande
            </Button>


            <Button
              onClick={()=>router.push(pathsUtils.profil)}
              variant="ghost"
                size={"icon-lg"}
              className="text-white hover:bg-white/20"
            >
              <UserCircle2 className='w-10'/>
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  )
}