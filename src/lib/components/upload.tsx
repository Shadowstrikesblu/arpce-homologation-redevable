"use client"

import * as React from "react"
import { Upload, ClipboardPaste, MousePointerClick } from "lucide-react"

import { cn } from "@/lib/utils"
import { HelpButton } from "./help-button"
import { useHelp } from "@/context/helpContext"
import { FileUploaderProps } from "../types/upload.types"

export function FileUploader({
  onFiles,
  accept,
  multiple = false,
  maxSizeMb,
  className,
  title,
  type,
  file
}: FileUploaderProps) {

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [fileCount, setFileCount] = React.useState(file ? 1 : 0)
  const [lastFileName, setLastFileName] = React.useState<string | null>(file?.name ?? null)
  const { setHelp } = useHelp()


  const handleFiles = React.useCallback(
    (fileList: FileList | null) => {

      if (!fileList || fileList.length > 1) return;

      setError(null)
      const files = Array.from(fileList)

      const filtered = files.filter((file) => {
        if (!maxSizeMb) return true

        const maxBytes = maxSizeMb * 1024 * 1024

        if (file.size > maxBytes) {
          setError(
            `Le fichier "${file.name}" dépasse la taille maximale de ${maxSizeMb} Mo.`
          )
          return false
        }
        setLastFileName(file.name)

        return true
      })

      if(!multiple && fileCount == 1){
        onFiles(filtered)
        setFileCount(1)
        return;
      }


      if (filtered.length > 0) {
        onFiles(filtered)
        setFileCount((prev) => prev + filtered.length)
        return;
      }
    },
    [onFiles, maxSizeMb, multiple, fileCount]
  )

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
    event.target.value = ""
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    handleFiles(event.dataTransfer.files)
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const onPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const files = event.clipboardData.files
    if (files && files.length >= 1) {
      handleFiles(files)
    }
  }

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  // Gestion spécifique du clic sur la zone principale (sans le bouton help)
  const onContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Vérifier si le clic vient du HelpButton ou de ses enfants
    const isHelpButtonClick = (event.target as Element).closest('.help-button-container, [data-help-button]')
    
    if (!isHelpButtonClick) {
      openFileDialog()
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        tabIndex={0}
        onClick={onContainerClick} // Utiliser la nouvelle fonction
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onPaste={onPaste}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center cursor-pointer transition z-30",
          "bg-background/40 hover:bg-muted",
          isDragging && "border-primary bg-primary/5",
        )}
      >
        <div className="flex w-full justify-between items-center z-30">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Upload className="h-4 w-4" />
            <span>{title}</span>
          </div>

          {/* Ajouter une classe ou data-attribute pour identifier le bouton help */}
          <div className="help-button-container" data-help-button>
            <HelpButton onClick={()=>setHelp(type)}/>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MousePointerClick className="h-3 w-3" />
            Click upload
          </span>
          <span className="inline-flex items-center gap-1">
            <ClipboardPaste className="h-3 w-3" />
            Ctrl+V pour coller
          </span>
        </div>

        {accept && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Types acceptés : <span className="font-medium">{accept} ({maxSizeMb} Mo)</span>
          </p>
        )}

        {fileCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {lastFileName} uploadé
            {fileCount > 1 ? "s" : ""}.
          </p>
        )}
      </div>

      <input
        aria-label="file"
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={onInputChange}
      />

      {error && (
        <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-2 py-1">
          {error}
        </p>
      )}
    </div>
  )
}