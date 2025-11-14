// components/generic-modal.tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import { ModalBehavior, ModalType } from "@/context/modalContext"

interface GenericModalProps {
  title: string
  message: string
  type: ModalType
  behavior: ModalBehavior
  onClose: () => void
  onConfirm?: () => void
  onDeny?: () => void
  confirmText?: string
  denyText?: string
}

const iconConfig = {
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  error: {
    icon: XCircle,
    color: "text-red-600", 
    bgColor: "bg-red-50",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
}

export function GenericModal({
  title,
  message,
  type,
  behavior,
  onClose,
  onConfirm,
  onDeny,
  confirmText = "OK",
  denyText = "Annuler",
}: GenericModalProps) {
  const { icon: Icon, color, bgColor } = iconConfig[type]

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  const handleDeny = () => {
    onDeny?.()
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
          <div className={`p-2 rounded-full ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <DialogTitle className="text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {message}
          </p>

          <div className="flex justify-end gap-2 pt-4">
            {behavior === "confirm" && (
              <Button
                variant="outline"
                onClick={handleDeny}
                size="sm"
              >
                {denyText}
              </Button>
            )}
            <Button
              onClick={behavior === "confirm" ? handleConfirm : onClose}
              size="sm"
              variant={type === "error" ? "destructive" : "default"}
            >
              {behavior === "confirm" ? confirmText : "OK"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}