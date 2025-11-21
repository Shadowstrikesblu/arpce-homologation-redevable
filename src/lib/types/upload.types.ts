import { HelpType } from "@/context/helpContext"

export interface FileUploaderProps{
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  className?: string
  title : string
  type : HelpType
  file ? : File
}