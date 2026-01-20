'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useScreenshot, type ScreenshotFormat, type ScreenshotResolution } from '@/hooks/use-screenshot'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Camera, X, Download } from 'lucide-react'

const RESOLUTION_OPTIONS: { value: ScreenshotResolution; label: string; description: string }[] = [
  { value: '1x', label: '1x', description: 'Current viewport size' },
  { value: '2x', label: '2x', description: 'Double resolution' },
  { value: '4x', label: '4x', description: 'Quadruple resolution' },
]

const FORMAT_OPTIONS: { value: ScreenshotFormat; label: string; description: string }[] = [
  { value: 'png', label: 'PNG', description: 'Lossless, supports transparency' },
  { value: 'jpeg', label: 'JPEG', description: 'Smaller file size' },
]

export function ScreenshotModal() {
  const theme = useThemeClasses()
  const screenshotModalOpen = useViewerStore((state) => state.screenshotModalOpen)
  const setScreenshotModalOpen = useViewerStore((state) => state.setScreenshotModalOpen)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  const { takeScreenshot, isCapturing, error } = useScreenshot()

  const [format, setFormat] = useState<ScreenshotFormat>('png')
  const [resolution, setResolution] = useState<ScreenshotResolution>('2x')
  const [transparentBackground, setTransparentBackground] = useState(false)
  const [filename, setFilename] = useState('')

  if (!screenshotModalOpen) return null

  const handleClose = () => setScreenshotModalOpen(false)

  const handleCapture = async () => {
    const customFilename = filename.trim() || undefined
    await takeScreenshot({
      format,
      resolution,
      transparentBackground: transparentBackground && format === 'png',
      filename: customFilename,
    })
    handleClose()
  }

  const defaultFilename = currentCharacter?.name.replace(/\.(glb|gltf)$/i, '') || 'meshmotion'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-md max-h-[90vh] overflow-y-auto',
          'p-6 rounded-xl border border-white/10',
          theme.glassPanelDark
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Camera className={cn('w-5 h-5', theme.textPrimary)} />
            <h2 className={cn('text-xl font-semibold', theme.textPrimary)}>
              Take Screenshot
            </h2>
          </div>
          <button
            onClick={handleClose}
            className={cn('p-2 rounded-full transition-colors', theme.hoverSubtle)}
          >
            <X className={cn('w-5 h-5', theme.textSecondary)} />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-3', theme.textSecondary)}>
            Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FORMAT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormat(option.value)}
                className={cn(
                  'p-3 rounded-lg border transition-all text-left',
                  format === option.value
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <div className={cn('font-medium', theme.textPrimary)}>{option.label}</div>
                <div className={cn('text-xs mt-1', theme.textMuted)}>{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Selection */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-3', theme.textSecondary)}>
            Resolution
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RESOLUTION_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setResolution(option.value)}
                className={cn(
                  'p-3 rounded-lg border transition-all text-center',
                  resolution === option.value
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <div className={cn('font-medium', theme.textPrimary)}>{option.label}</div>
                <div className={cn('text-xs mt-1', theme.textMuted)}>{option.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Transparent Background (PNG only) */}
        {format === 'png' && (
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={transparentBackground}
                onChange={(e) => setTransparentBackground(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span className={cn('text-sm', theme.textPrimary)}>Transparent background</span>
            </label>
          </div>
        )}

        {/* Filename */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
            Filename (optional)
          </label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder={defaultFilename}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5',
              'text-white placeholder-white/40',
              'focus:outline-none focus:border-blue-500'
            )}
          />
          <p className={cn('text-xs mt-1', theme.textMuted)}>
            Will save as: {filename.trim() || defaultFilename}.{format}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className={cn(
              'px-4 py-2 rounded-lg border border-white/10 transition-colors',
              theme.textSecondary,
              theme.hoverSubtle
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className={cn(
              'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
              'bg-blue-600 hover:bg-blue-500 text-white',
              isCapturing && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Download className="w-4 h-4" />
            {isCapturing ? 'Capturing...' : 'Capture'}
          </button>
        </div>
      </div>
    </>
  )
}
