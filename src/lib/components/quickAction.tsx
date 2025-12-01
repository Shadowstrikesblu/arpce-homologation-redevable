// components/dashboard/QuickActions.tsx
"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Settings, HelpCircle, Clock } from 'lucide-react'
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>

      <div className="grid gap-4 md:grid-cols-1">
        {/* <button
          onClick={() => router.push(pathsUtils.aide + '#faq')}
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
        </button> */}

        {/* <button
          onClick={() => router.push('/parametres')}
          className={baseCardClasses}
          type="button"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:rotate-12 transition-transform duration-200">
            <Settings className="h-5 w-5" />
          </span>
          <span className="text-left">
            <p className="text-sm font-semibold text-gray-900">Paramètres</p>
            <p className="text-xs text-gray-500">Gérer vos préférences</p>
          </span>
        </button> */}
      </div>

      <Card className="mt-8 bg-linear-to-r from-[#af3338] to-[#c9454a] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Besoin d&apos;aide rapide ?</h3>
              <p className="text-white/80 text-sm">
                Notre équipe de support est disponible pour vous accompagner dans vos démarches d&apos;homologation.
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white text-[#af3338] hover:bg-gray-100"
              onClick={() => router.push(pathsUtils.aide + '#contact')}
            >
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}