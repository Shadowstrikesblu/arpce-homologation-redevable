// components/dashboard/DashboardHeader.tsx
"use client"

import { Button } from '@/components/ui/button'
import { Plus, Bell, User, UserCircle2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
    onActionClick : () => void
    actionTitle : string
    title : string
    desc : string
}

export function ScreenHeader({ 
  onActionClick, 
  actionTitle,
  title,
  desc
}: HeaderProps) {

    const router = useRouter()

  return (
    <div className="bg-linear-to-r from-[#af3338] to-[#c9454a] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
            <div className='flex items-center justify-start gap-4'>

                <Button onClick={()=>router.back()}>
                    <ArrowLeft/>
                </Button>

                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-white/80 mt-1">{desc}</p>
                </div>

            </div>
          
          <div className="flex items-center space-x-4">


            <Button
              onClick={onActionClick}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 font-semibold"
            >
              <Plus className="h-5 w-5 mr-2" />
              {actionTitle}
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  )
}