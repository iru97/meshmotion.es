'use client'

import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  assetCount: number
  assetNames: string[]
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ isOpen, assetCount, assetNames, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const theme = useThemeClasses()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative w-full max-w-md mx-4 p-6 rounded-xl',
          theme.glassPanelDark,
          'border border-white/10'
        )}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h3 className={cn('text-lg font-semibold text-center mb-2', theme.textPrimary)}>
          Delete {assetCount} {assetCount === 1 ? 'Asset' : 'Assets'}?
        </h3>

        {/* Message */}
        <p className={cn('text-sm text-center mb-4', theme.textSecondary)}>
          This action cannot be undone. The following {assetCount === 1 ? 'asset' : 'assets'} will be permanently deleted:
        </p>

        {/* Asset List */}
        <div className="max-h-40 overflow-y-auto mb-6 space-y-1">
          {assetNames.map((name, i) => (
            <div
              key={i}
              className={cn(
                'px-3 py-2 rounded text-sm',
                'bg-white/5',
                theme.textPrimary
              )}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className={cn(
              'flex-1 px-4 py-2 rounded-lg transition-colors',
              'bg-white/10 hover:bg-white/20',
              theme.textPrimary
            )}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'flex-1 px-4 py-2 rounded-lg transition-colors',
              'bg-red-500/80 hover:bg-red-500',
              'text-white font-medium'
            )}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
