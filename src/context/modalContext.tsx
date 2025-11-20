// contexts/modal-context.tsx
"use client"

import { GenericModal } from "@/lib/components/genericModal"
import * as React from "react"

export type ModalType = "success" | "error" | "warning" | "info"
export type ModalBehavior = "alert" | "confirm"

interface ModalData {
  title: string
  message: string
  type: ModalType
  behavior: ModalBehavior
  onConfirm?: () => void
  onDeny?: () => void
  confirmText?: string
  denyText?: string
}

interface ModalContextType {
  showModal: (data: Omit<ModalData, "behavior"> & { behavior?: ModalBehavior }) => void
  hideModal: () => void
}

const ModalContext = React.createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalData, setModalData] = React.useState<ModalData | null>(null)

  const showModal = (data: Omit<ModalData, "behavior"> & { behavior?: ModalBehavior }) => {
    setModalData({
      behavior: "alert",
      confirmText: "OK",
      denyText: "Annuler",
      ...data
    })
  }

  const hideModal = () => {
    setModalData(null)
  }

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalData && (
        <GenericModal
          {...modalData}
          onClose={hideModal}
        />
      )}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = React.useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}