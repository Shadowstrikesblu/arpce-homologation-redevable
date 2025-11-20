// components/global-help-provider.tsx
"use client"

import { HelpProvider as ContextHelpProvider } from "@/context/helpContext"
import { HelpModal } from "./help.modal"

export function GlobalHelpProvider({ children }: { children: React.ReactNode }) {
  return (
    <ContextHelpProvider>
      {children}
      <HelpModal />
    </ContextHelpProvider>
  )
}