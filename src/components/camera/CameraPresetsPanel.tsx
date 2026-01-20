'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { X, Camera, RotateCcw } from 'lucide-react'
import { CAMERA_PRESETS, CameraPreset } from '@/hooks/use-camera-presets'

interface CameraPresetsPanelProps {
  onSelectPreset: (preset: CameraPreset) => void
}

/**
 * Panel for selecting camera preset views
 */
export function CameraPresetsPanel({ onSelectPreset }: CameraPresetsPanelProps) {
  const theme = useThemeClasses()
  const cameraPresetsOpen = useViewerStore((state) => state.cameraPresetsOpen)
  const toggleCameraPresets = useViewerStore((state) => state.toggleCameraPresets)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  if (!cameraPresetsOpen || !currentCharacter) return null

  return (
    <div
      className={cn(
        'fixed bottom-24 left-4 z-30',
        'p-4 rounded-xl border border-white/10',
        'w-64',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className={cn('w-4 h-4', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Camera Views
          </h3>
        </div>
        <button
          onClick={toggleCameraPresets}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-4 h-4', theme.textSecondary)} />
        </button>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-4 gap-2">
        {CAMERA_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className={cn(
              'flex flex-col items-center justify-center',
              'p-2 rounded-lg transition-all duration-200',
              'bg-white/5 hover:bg-white/15',
              'border border-white/10 hover:border-white/20'
            )}
            title={preset.name}
          >
            <span className="text-lg mb-1">{preset.icon}</span>
            <span className={cn('text-xs', theme.textMuted)}>
              {preset.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onSelectPreset(CAMERA_PRESETS[6])} // Iso Front as default
        className={cn(
          'w-full mt-3 px-3 py-2 rounded-lg',
          'flex items-center justify-center gap-2',
          'bg-white/5 hover:bg-white/10 transition-colors',
          'border border-white/10',
          theme.textSecondary
        )}
      >
        <RotateCcw className="w-3 h-3" />
        <span className="text-xs">Reset View</span>
      </button>
    </div>
  )
}
