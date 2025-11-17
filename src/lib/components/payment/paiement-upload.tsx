"use client"

import * as React from "react"
import { FileUploader } from "@/lib/components/upload"

type PaiementUploadProps = {
  title: string
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  onFiles?: (files: File[]) => void
}

export function PaiementUpload({
  title,
  accept = ".pdf",
  multiple = false,
  maxSizeMb = 3,
  onFiles,
}: PaiementUploadProps) {
  const handleFiles = React.useCallback(
    (files: File[]) => {
      onFiles?.(files)
    },
    [onFiles]
  )

  return (
    <div className="space-y-2">
      <FileUploader
        title={title}
        accept={accept}
        multiple={multiple}
        maxSizeMb={maxSizeMb}
        onFiles={handleFiles}
        type="payment"
      />
    </div>
  )
}


