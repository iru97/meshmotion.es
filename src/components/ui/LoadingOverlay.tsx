'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { Loader2 } from 'lucide-react'

export function LoadingOverlay() {
  const isLoadingModel = useViewerStore((state) => state.isLoadingModel)

  if (!isLoadingModel) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel-dark p-8 flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
        <p className="text-white text-lg font-medium">Loading model...</p>
        <p className="text-white/70 text-sm">Analyzing and preparing 3D asset</p>
      </div>
    </div>
  )
}
