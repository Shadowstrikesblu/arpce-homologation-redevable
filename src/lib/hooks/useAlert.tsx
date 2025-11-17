// hooks/use-alert.ts

import { ModalType, useModal } from "@/context/modalContext"

export function useAlert() {
  const { showModal } = useModal()

  const success = (title: string, message: string) => {
    showModal({
      title,
      message,
      type: "success",
      behavior: "alert",
    })
  }

  const error = (title: string, message: string) => {
    showModal({
      title,
      message, 
      type: "error",
      behavior: "alert",
    })
  }

  const warning = (title: string, message: string) => {
    showModal({
      title,
      message,
      type: "warning", 
      behavior: "alert",
    })
  }

  const info = (title: string, message: string) => {
    showModal({
      title,
      message,
      type: "info",
      behavior: "alert",
    })
  }

  const confirm = (
    title: string, 
    message: string, 
    onConfirm: () => void,
    onDeny?: () => void,
    type: ModalType = "warning",
    confirmText?: string,
    denyText?: string
  ) => {
    showModal({
      title,
      message,
      type,
      behavior: "confirm",
      onConfirm,
      onDeny,
      confirmText,
      denyText,
    })
  }

  return {
    success,
    error, 
    warning,
    info,
    confirm,
  }
}