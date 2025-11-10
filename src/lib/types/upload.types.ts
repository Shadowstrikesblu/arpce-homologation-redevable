type FileUploaderProps = {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
  className?: string
  title : string
}