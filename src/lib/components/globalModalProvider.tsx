// components/global-modal-provider.tsx
"use client"

import { ModalProvider } from "@/context/modalContext"


export function GlobalModalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      {children}
    </ModalProvider>
  )
}