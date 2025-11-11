"use client"

import * as React from "react"
import { Upload, ClipboardPaste, MousePointerClick } from "lucide-react"

import { cn } from "@/lib/utils"
import { HelpButton } from "./help-button"


export function FileUploader({
  onFiles,
  accept,
  multiple = true,
  maxSizeMb,
  className,
  title,
}: FileUploaderProps) {

  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [fileCount, setFileCount] = React.useState(0)

  const handleFiles = React.useCallback(
    (fileList: FileList | null) => {

      if(!multiple && fileCount >= 1) return setError("vous ne pouvez televerser qu'une lettre")
      if (!fileList || fileList.length === 0) return

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

        return true
      })

      if (filtered.length > 0) {

        onFiles(filtered)

        setFileCount((prev) => prev + filtered.length)
      }

    },
    [onFiles, maxSizeMb]
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

    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn("space-y-2", className)}>

      <div
        tabIndex={0}
        onClick={openFileDialog}
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
        <div className="flex w-full justify-between items-center z-50">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Upload className="h-4 w-4" />
            <span>{title}</span>
          </div>

          <HelpButton/>
        </div>

        {/* <p className="text-xs text-muted-foreground">
          Glissez-déposez vos fichiers ici, ou{" "}
          <span className="font-medium">cliquez</span> pour parcourir
        </p> */}

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
            Types acceptés : <span className="font-medium">{accept}</span>
          </p>
        )}

        {maxSizeMb && (
          <p className="text-[11px] text-muted-foreground">
            Taille max : <span className="font-medium">{maxSizeMb} Mo</span> par
            fichier
          </p>
        )}

        {fileCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {fileCount} fichier{fileCount > 1 ? "s" : ""} uploadé
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
