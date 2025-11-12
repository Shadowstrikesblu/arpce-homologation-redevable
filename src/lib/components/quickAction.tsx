// components/dashboard/QuickActions.tsx
"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Settings, HelpCircle, LifeBuoy, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { pathsUtils } from '../utils/path.util'

type Action = {
  id: string
  title: string
  description: string
  icon: typeof Plus
  onClick: () => void
  accent: string
}

const baseCardClasses =
"flex w-full cursor-pointer items-center gap-4 rounded-xl border border-gray-100 bg-white/90 p-5 text-left shadow-sm transition hover:border-gray-200 hover:shadow-md"

export function QuickActions() {
  const router = useRouter()

  const actions: Action[] = [
    {
      id: 'new',
      title: 'Nouveau dossier',
      description: 'Soumettre un nouveau dossier d’homologation',
      icon: Plus,
      accent: 'bg-[#af3338]/10 text-[#af3338]',
      onClick: () => router.push(pathsUtils.request_form)
    },
    {
      id: 'list',
      title: 'Mes dossiers',
      description: 'Retrouver l’historique complet des demandes',
      icon: FileText,
      accent: 'bg-[#8ba755]/10 text-[#587335]',
      onClick: () => router.push(pathsUtils.projects)
    }
  ]

  return (
    <section className="space-y-4">
      <h2 className="flex items-center text-sm font-semibold uppercase tracking-wide text-gray-500">
        <Clock className="mr-2 h-4 w-4" />
        Actions rapides
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={baseCardClasses}
            type="button"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${action.accent}`}>
              <action.icon className="h-5 w-5" />
            </span>
            <span className="text-left">
              <p className="text-sm font-semibold text-gray-900">{action.title}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export function SupportAndHelpSection() {
  const router = useRouter()

  return (
    <section className="space-y-6 rounded-2xl bg-white/90 p-6 shadow-sm border border-gray-100">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => router.push('/aide')}
          className={baseCardClasses}
          type="button"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <HelpCircle className="h-5 w-5" />
          </span>
          <span className="text-left">
            <p className="text-sm font-semibold text-gray-900">Centre d’aide</p>
            <p className="text-xs text-gray-500">Guides pratiques et FAQ</p>
          </span>
        </button>

        <button
          onClick={() => router.push('/parametres')}
          className={baseCardClasses}
          type="button"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Settings className="h-5 w-5" />
          </span>
          <span className="text-left">
            <p className="text-sm font-semibold text-gray-900">Paramètres</p>
            <p className="text-xs text-gray-500">Gérer vos préférences</p>
          </span>
        </button>
      </div>

      <Card className="border border-dashed border-[#af3338]/30 bg-[#af3338]/5">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#af3338]">Besoin d’aide immédiate ?</p>
            <p className="text-sm text-[#af3338]/80">
              Notre équipe support est à votre écoute pour vous accompagner.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-[#af3338] text-[#af3338] hover:bg-[#af3338]/10"
            onClick={() => router.push('/support')}
          >
            <LifeBuoy className="mr-2 h-4 w-4" />
            Contacter le support
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}