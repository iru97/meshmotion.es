'use client'

import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ConversionProgress as ConversionProgressType } from '@/types/conversion'

interface ConversionProgressProps {
  progress: ConversionProgressType
  fileName: string
}

/**
 * Conversion progress indicator
 * Shows current stage and progress of format conversion
 */
export function ConversionProgress({ progress, fileName }: ConversionProgressProps) {
  const theme = useThemeClasses()

  const stageLabels: Record<ConversionProgressType['stage'], string> = {
    'loading-wasm': 'Loading conversion engine...',
    'parsing': 'Parsing file...',
    'converting': 'Converting to GLB...',
    'optimizing': 'Optimizing...',
    'complete': 'Conversion complete',
  }

  return (
    <div
      className={cn(
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
        'w-full max-w-md p-6 rounded-xl border border-white/10',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className={cn('w-5 h-5 animate-spin', theme.iconPrimary)} />
        <div className="flex-1">
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>Converting File</h3>
          <p className={cn('text-xs', theme.textSecondary)}>{fileName}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      {/* Stage Info */}
      <div className="flex items-center justify-between">
        <p className={cn('text-xs', theme.textSecondary)}>
          {progress.message || stageLabels[progress.stage]}
        </p>
        <span className={cn('text-xs font-medium', theme.textPrimary)}>{progress.progress}%</span>
      </div>
    </div>
  )
}
