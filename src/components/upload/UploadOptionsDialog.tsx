'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileBox, Clapperboard, Package, X } from 'lucide-react'

export type UploadOption = 'mesh' | 'animations' | 'both'

interface UploadOptionsDialogProps {
  open: boolean
  fileName: string
  hasAnimations: boolean
  animationCount: number
  onSelect: (option: UploadOption) => void
  onCancel: () => void
}

export function UploadOptionsDialog({
  open,
  fileName,
  hasAnimations,
  animationCount,
  onSelect,
  onCancel,
}: UploadOptionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-lg glass-panel-dark p-0 overflow-hidden !bg-transparent border-white/10 [&>button]:hidden">
        {/* Header with close button */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          <DialogHeader className="space-y-2">
            <DialogTitle className="text-white text-xl font-semibold">Import Options</DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              This file contains both mesh and {animationCount} animation{animationCount > 1 ? 's' : ''}.
              Choose what to import:
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 px-6 py-6">
          <button
            className="group relative overflow-hidden rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] bg-white/5 hover:bg-white/10 border border-white/10"
            onClick={() => onSelect('mesh')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <FileBox className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">Mesh Only</div>
                <div className="text-xs text-white/60">
                  Import the 3D model without animations
                </div>
              </div>
            </div>
          </button>

          <button
            className="group relative overflow-hidden rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] bg-white/5 hover:bg-white/10 border border-white/10"
            onClick={() => onSelect('animations')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Clapperboard className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">Animations Only</div>
                <div className="text-xs text-white/60">
                  Import {animationCount} animation{animationCount > 1 ? 's' : ''} for current character
                </div>
              </div>
            </div>
          </button>

          <button
            className="group relative overflow-hidden rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] bg-white/5 hover:bg-white/10 border border-white/10"
            onClick={() => onSelect('both')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">Complete Package</div>
                <div className="text-xs text-white/60">
                  Import mesh and animations together
                </div>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
