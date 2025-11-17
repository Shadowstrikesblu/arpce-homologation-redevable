// context/help-context.tsx
"use client"

import * as React from "react"

export type HelpType = "upload" | "homologation" | "documents" | "validation" | "mail" | "fiche_technique" | "equipement" | "payment" |string

interface HelpContextType {
  currentHelp: HelpType | null
  setHelp: (helpType: HelpType | null) => void
  closeHelp: () => void
}

const HelpContext = React.createContext<HelpContextType | undefined>(undefined)

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [currentHelp, setCurrentHelp] = React.useState<HelpType | null>(null)

  const setHelp = (helpType: HelpType | null) => {
    setCurrentHelp(helpType)
  }

  const closeHelp = () => {
    setCurrentHelp(null)
  }

  return (
    <HelpContext.Provider value={{ currentHelp, setHelp, closeHelp }}>
      {children}
    </HelpContext.Provider>
  )
}

export function useHelp() {
  const context = React.useContext(HelpContext)
  if (context === undefined) {
    throw new Error("useHelp must be used within a HelpProvider")
  }
  return context
}