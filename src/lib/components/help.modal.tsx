// components/help-modal.tsx
"use client"


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useHelp } from "@/context/helpContext"
import { HELP_CONTENT } from "../utils/help"

export function HelpModal() {
  const { currentHelp, closeHelp } = useHelp()
  
  if (!currentHelp) return null

  const helpContent = HELP_CONTENT[currentHelp]

  if (!helpContent) {
    console.warn(`Aucun contenu d'aide trouvé pour : ${currentHelp}`)
    return null
  }

  return (
    <Dialog open={!!currentHelp} onOpenChange={(open) => !open && closeHelp()}>
      <DialogContent className="md:max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold">
            {helpContent.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {helpContent.content}
        </div>
      </DialogContent>
    </Dialog>
  )
}