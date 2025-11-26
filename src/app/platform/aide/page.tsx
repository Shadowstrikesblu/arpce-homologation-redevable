"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

type FAQItem = {
  id: string
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "Comment créer un compte ?",
    answer:
      "Rendez-vous dans la section Inscription, remplissez vos informations personnelles puis validez. Vous recevrez un email de confirmation.",
  },
  {
    id: "2",
    question: "Puis-je modifier mes informations personnelles ?",
    answer:
      "Oui, toutes vos informations sont modifiables depuis votre tableau de bord dans la section Profil.",
  },
  {
    id: "3",
    question: "Que faire en cas de problème de connexion ?",
    answer:
      "Vérifiez votre mot de passe puis utilisez l’option Mot de passe oublié si nécessaire. Si le problème persiste, contactez le support.",
  },
  {
    id: "4",
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Vos données sont cryptées et stockées de manière sécurisée conformément aux normes en vigueur.",
  },
  {
    id: "5",
    question: "Comment contacter l’assistance ?",
    answer:
      "Vous pouvez contacter notre support via le formulaire de contact ou par email 24h/24.",
  },
  {
    id: "6",
    question: "Puis-je supprimer mon compte ?",
    answer:
      "Oui, la suppression du compte est possible depuis les paramètres du profil.",
  },
   
]

export default function AidePage() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  //  2 colonnes
  const mid = Math.ceil(faqData.length / 2)
  const left = faqData.slice(0, mid)
  const right = faqData.slice(mid)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="max-w-5xl w-full space-y-6">
        
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Centre d’aide</h1>
          <p className="text-gray-600 text-sm">Guides pratiques & FAQ</p>
        </div>

        {/* 2 COLONNES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* COLONNE GAUCHE */}
          <div className="bg-white shadow-md rounded-xl p-5 divide-y">
            {left.map((item) => {
              const isOpen = openId === item.id

              return (
                <div key={item.id} className="py-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-gray-800 font-medium text-sm">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronDown className="text-gray-500 h-4 w-4" />
                    ) : (
                      <ChevronRight className="text-gray-500 h-4 w-4" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-2 text-gray-600 text-xs leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* COLONNE DROITE */}
          <div className="bg-white shadow-md rounded-xl p-5 divide-y">
            {right.map((item) => {
              const isOpen = openId === item.id

              return (
                <div key={item.id} className="py-3">
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-gray-800 font-medium text-sm">
                      {item.question}
                    </span>

                    {isOpen ? (
                      <ChevronDown className="text-gray-500 h-4 w-4" />
                    ) : (
                      <ChevronRight className="text-gray-500 h-4 w-4" />
                    )}
                  </button>

                  {isOpen && (
                    <p className="mt-2 text-gray-600 text-xs leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}
