// data/help-content.ts

import { HelpType } from "@/context/helpContext";

export const HELP_CONTENT: Record<HelpType, { title: string; content: React.ReactNode }> = {
  upload: {
    title: "Aide - Téléversement de fichiers",
    content: (
      <div className="space-y-4">
        <p className="font-semibold text-sm">Comment téléverser vos fichiers :</p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Cliquez dans la zone pour sélectionner des fichiers</li>
          <li>Glissez-déposez vos fichiers directement</li>
          <li>Utilisez Ctrl+V pour coller une image</li>
          <li>Formats acceptés : PDF, JPG, PNG, DOCX</li>
          <li>Taille maximale : 10 Mo par fichier</li>
        </ul>
      </div>
    ),
  },
  homologation: {
    title: "Aide - Dossier d'homologation",
    content: (
      <div className="space-y-4">
        <p className="font-semibold text-sm">Processus d&apos;homologation :</p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Rassemblez tous les documents techniques requis</li>
          <li>Vérifiez la conformité aux normes en vigueur</li>
          <li>Assurez-vous que les spécifications sont complètes</li>
          <li>Joignez les certificats de conformité</li>
        </ul>
      </div>
    ),
  },

    mail: {
        title: "Aide - Courrier de demande d'homologation",
        content: (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 text-sm mb-2">
                Nature du document
            </p>
            <p className="text-blue-800 text-sm">
                Ce courrier est la lettre formelle de demande d&apos;homologation adressée 
                au Directeur Général de l&apos;ARPCE (Autorité de Régulation des Postes et Télécommunications du Congo).
            </p>
            </div>

            <div>
            <p className="font-semibold text-sm mb-3">Objectif de ce courrier :</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                <span className="font-medium">Demande officielle :</span> Introduire formellement 
                la demande d&apos;homologation auprès de l&apos;autorité réglementaire
                </li>
                <li>
                <span className="font-medium">Cadre légal :</span> Respecter les procédures 
                administratives de l&apos;ARPCE Congo
                </li>
                <li>
                <span className="font-medium">Engagement :</span> Manifester l&apos;engagement 
                du redevable à se conformer à la réglementation
                </li>
                <li>
                <span className="font-medium">Référence :</span> Servir de pièce maîtresse 
                pour le suivi du dossier administratif
                </li>
            </ul>
            </div>

            <div>
            <p className="font-semibold text-sm mb-3">Contenu requis dans le courrier :</p>
            <ul className="list-disc list-inside space-y-2 text-sm">
                <li>En-tête avec coordonnées complètes de l&apos;entreprise</li>
                <li>Destinataire : &quot;Monsieur le Directeur Général de l&apos;ARPCE&quot;</li>
                <li>Objet clair : &quot;Demande d&apos;homologation d&apos;équipement télécom&quot;</li>
                <li>Référence à la réglementation congolaise applicable</li>
                <li>Description précise de l&apos;équipement à homologuer</li>
                <li>Engagement de conformité aux normes techniques</li>
                <li>Liste des pièces jointes au dossier</li>
                <li>Signature du représentant légal de l&apos;entreprise</li>
            </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-semibold text-amber-900 text-sm mb-2">
                Important à savoir
            </p>
            <ul className="list-disc list-inside space-y-2 text-amber-800 text-sm">
                <li>Il doit être signé par le représentant légal ou une personne dûment habilitée</li>
                <li>Conservez une copie certifiée conforme pour vos archives</li>
                <li>Le courrier doit être daté et paraphé sur chaque page</li>
            </ul>
            </div>
        </div>
        ),
    },
  
  fiche_technique: {
    title: "Aide - Fiche technique de l'équipement",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="font-semibold text-blue-900 text-sm mb-2">
            Document technique essentiel
          </p>
          <p className="text-blue-800 text-sm">
            La fiche technique est le document de référence qui décrit précisément 
            les caractéristiques techniques et les performances de l&apos;équipement 
            soumis à homologation.
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm mb-3">Pourquoi cette fiche est obligatoire :</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <span className="font-medium">Vérification technique :</span> Permet à l&apos;ARPCE 
              de contrôler la conformité aux normes techniques congolaises
            </li>
            <li>
              <span className="font-medium">Évaluation sécurité :</span> Vérifie que l&apos;équipement 
              respecte les exigences de sécurité électrique et électromagnétique
            </li>
            <li>
              <span className="font-medium">Compatibilité réseau :</span> Assure que l&apos;équipement 
              n&apos;interfère pas avec les réseaux télécoms existants
            </li>
            <li>
              <span className="font-medium">Traçabilité :</span> Document de référence pour 
              le suivi et le contrôle du parc d&apos;équipements
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-sm mb-3">Informations techniques requises :</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-xs text-gray-600">IDENTIFICATION</p>
                <ul className="mt-1 space-y-1">
                  <li>• Marque et modèle exact</li>
                  <li>• Numéro de série/type</li>
                  <li>• Fabricant et pays d&apos;origine</li>
                  <li>• Version du logiciel/firmware</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-xs text-gray-600">INTERFACES ET CONNECTIVITÉ</p>
                <ul className="mt-1 space-y-1">
                  <li>• Ports et connecteurs</li>
                  <li>• Protocoles supportés</li>
                  <li>• Débit de données</li>
                  <li>• Compatibilité réseaux</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-xs text-gray-600">SÉCURITÉ ET ENVIRONNEMENT</p>
                <ul className="mt-1 space-y-1">
                  <li>• Alimentation électrique</li>
                  <li>• Température fonctionnement</li>
                  <li>• Normes sécurité respectées</li>
                  <li>• DIMensions et poids</li>
                </ul>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="font-semibold text-amber-900 text-sm mb-2">
            Points de vigilance
          </p>
          <ul className="list-disc list-inside space-y-2 text-amber-800 text-sm">
            <li>Toutes les spécifications doivent être vérifiables et cohérentes</li>
            <li>Les unités de mesure doivent être conformes au système international</li>
            <li>Les valeurs limites doivent respecter la réglementation congolaise</li>
            <li>Le document doit être daté et porter une référence version</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="font-semibold text-green-900 text-sm mb-2">
            Bonnes pratiques
          </p>
          <ul className="list-disc list-inside space-y-2 text-green-800 text-sm">
            <li>Utiliser le modèle de fiche technique fourni par l&apos;ARPCE si disponible</li>
            <li>Faire certifier la fiche par le fabricant ou un laboratoire accrédité</li>
            <li>Inclure les logos et marquages CE/FCC le cas échéant</li>
            <li>Fournir une traduction française si le document original est en autre langue</li>
          </ul>
        </div>
      </div>
    ),
  },

  equipement: {
    title: "Aide - Équipements à homologuer",
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-secondary text-sm mb-2">
            Classification des équipements
          </p>
          <p className="text-secondary text-sm">
            Les équipements soumis à homologation sont classés selon leur type, 
            leur technologie et leur domaine d&apos;utilisation dans le réseau télécom.
          </p>

        </div>
      </div>
    ),
  },
}