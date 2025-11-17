// components/attestation/AttestationCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  FileText, 
  Eye,
  Clock
} from 'lucide-react'
import { Attestation, BinaryData } from '../interfaces/models.interface'


interface AttestationCardProps {
  attestation: Attestation
  onDownload: (attestation: Attestation) => void
  onView?: (attestation: Attestation) => void
  className?: string
}

export function AttestationCard({ 
  attestation, 
  onDownload, 
  onView, 
  className = '' 
}: AttestationCardProps) {

  const getStatut = (): 'valide' | 'expire' | 'bientot_expire' => {
    const now = new Date()
    const expiration = new Date(attestation.dateExpiration)
    
    if (expiration < now) return 'expire'
    
    // Si expiration dans moins de 30 jours
    const trenteJours = 30 * 24 * 60 * 60 * 1000
    if (expiration.getTime() - now.getTime() < trenteJours) return 'bientot_expire'
    
    return 'valide'
  }

  const getStatusConfig = (statut: ReturnType<typeof getStatut>) => {
    switch (statut) {
      case 'valide':
        return { 
          label: 'Valide', 
          color: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'bientot_expire':
        return { 
          label: 'Bientôt expiré', 
          color: 'bg-amber-100 text-amber-800 border-amber-200'
        }
      case 'expire':
        return { 
          label: 'Expiré', 
          color: 'bg-red-100 text-red-800 border-red-200'
        }
      default:
        return { 
          label: 'Inconnu', 
          color: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const getTypeFichier = (extension: string) => {
    const types: { [key: string]: string } = {
      'pdf': 'PDF',
      'doc': 'DOC',
      'docx': 'DOCX',
      'jpg': 'JPG',
      'png': 'PNG'
    }
    return types[extension.toLowerCase()] || extension.toUpperCase()
  }

  const getTailleFichier = (donnees: BinaryData | null) => {
    if (!donnees) return 'Non disponible'
    
    // Calcul approximatif de la taille
    const taille = 0
    if (taille < 1024) return `${taille} B`
    if (taille < 1024 * 1024) return `${(taille / 1024).toFixed(1)} KB`
    return `${(taille / (1024 * 1024)).toFixed(1)} MB`
  }

  const statut = getStatut()
  const statusConfig = getStatusConfig(statut)
  const typeFichier = getTypeFichier(attestation.extension)
  const tailleFichier = getTailleFichier(attestation.donnees)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isDownloadable = attestation.donnees !== null

  // Générer le numéro d'attestation basé sur l'ID
  const numeroAttestation = `ATT-${attestation.id.toString().padStart(6, '0')}`

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#af3338] p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {numeroAttestation}
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>Attestation d'homologation</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {typeFichier} • {tailleFichier}
                </span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>Attestation {typeFichier}</span>
            {statut === 'bientot_expire' && (
              <span className="flex items-center gap-1 text-amber-600">
                <Clock className="h-3 w-3" />
                Expire bientôt
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(attestation)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Visualiser
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={() => onDownload(attestation)}
              disabled={!isDownloadable}
              className="flex items-center gap-2 bg-[#af3338] hover:bg-[#9a2d32]"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </Button>
          </div>
        </div>

        {!isDownloadable && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            Le fichier de cette attestation n'est pas disponible pour le moment
          </div>
        )}

        {statut === 'expire' && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
            Cette attestation a expiré le {formatDate(attestation.dateExpiration)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}