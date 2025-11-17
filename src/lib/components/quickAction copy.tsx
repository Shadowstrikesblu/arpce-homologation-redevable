// components/dashboard/QuickActions.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  FileText, 
  Download, 
  Upload, 
  History, 
  BarChart3,
  Settings,
  HelpCircle,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { pathsUtils } from '../utils/path.util'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  href?: string
  onClick?: () => void
  badge?: string
}

export function QuickActions() {
  const router = useRouter()

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Nouvelle demande',
      description: 'Soumettre une nouvelle demande d\'homologation',
      icon: Plus,
      color: 'text-white',
      bgColor: 'bg-[#af3338] hover:bg-[#9a2d32]',
      onClick: () => router.push(pathsUtils.request_form)
    },
    {
      id: '2',
      title: 'Mes dossiers',
      description: 'Consulter l\'historique de mes demandes',
      icon: FileText,
      color: 'text-[#8ba755]',
      bgColor: 'bg-[#8ba755]/10 hover:bg-[#8ba755]/20',
      onClick: () => router.push(pathsUtils.projects),
      badge: '3 en cours'
    },
  ]

  const supportActions: QuickAction[] = [
    {
      id: 'support-1',
      title: 'Centre d\'aide',
      description: 'Documentation et guides',
      icon: HelpCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      onClick: () => router.push('/aide')
    },
    {
      id: 'support-2',
      title: 'Paramètres',
      description: 'Configurer vos préférences',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      onClick: () => router.push('/parametres')
    }
  ]

  const ActionCard = ({ action }: { action: QuickAction }) => (
    <Card 
      className="bg-white hover:shadow-lg transition-all duration-200 border border-gray-200 cursor-pointer group"
      onClick={action.onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${action.bgColor} group-hover:rotate-12 transition-transform duration-200`}>
              <action.icon className={`h-6 w-6 ${action.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-800 text-lg">{action.title}</h3>
                {action.badge && (
                  <Badge variant="secondary" className={
                    action.title.includes('en cours') ? 'bg-amber-100 text-amber-800' :
                    action.title.includes('nouveaux') ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {action.badge}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {action.id === '1' ? (
              <Plus className="h-5 w-5 text-[#af3338]" />
            ) : action.id === '2' ? (
              <FileText className="h-5 w-5 text-[#8ba755]" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Clock className="h-6 w-6 mr-3 text-[#af3338]" />
          Actions rapides
        </h2>
      </div>

      {/* Grille principale des actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>

      {/* Actions de support */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Support & Paramètres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportActions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      </div>

      {/* Bannière d'information */}
      <Card className="mt-8 bg-gradient-to-r from-[#af3338] to-[#c9454a] text-white">
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
              onClick={() => router.push('/support')}
            >
              Contacter le support
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}