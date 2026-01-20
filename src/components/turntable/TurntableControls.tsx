'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { RotateCw, Pause } from 'lucide-react'
import { TURNTABLE_SPEED_PRESETS, TurntableSpeedPreset } from '@/hooks/use-turntable'

/**
 * Turntable mode controls - toggle and speed adjustment
 */
export function TurntableControls() {
  const theme = useThemeClasses()
  const turntableEnabled = useViewerStore((state) => state.turntableEnabled)
  const turntableSpeed = useViewerStore((state) => state.turntableSpeed)
  const toggleTurntable = useViewerStore((state) => state.toggleTurntable)
  const setTurntableSpeed = useViewerStore((state) => state.setTurntableSpeed)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  // Don't show if no model loaded
  if (!currentCharacter) return null

  const handleSpeedChange = (preset: TurntableSpeedPreset) => {
    setTurntableSpeed(TURNTABLE_SPEED_PRESETS[preset])
  }

  const getCurrentSpeedPreset = (): TurntableSpeedPreset | null => {
    for (const [key, value] of Object.entries(TURNTABLE_SPEED_PRESETS)) {
      if (value === turntableSpeed) return key as TurntableSpeedPreset
    }
    return null
  }

  const currentPreset = getCurrentSpeedPreset()

  return (
    <div className="flex items-center gap-2">
      {/* Turntable Toggle Button */}
      <button
        onClick={toggleTurntable}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          turntableEnabled
            ? 'bg-blue-600 text-white'
            : cn(theme.glassPanelDark, theme.hover)
        )}
        title={turntableEnabled ? 'Stop Turntable (T)' : 'Start Turntable (T)'}
      >
        {turntableEnabled ? (
          <Pause className="w-4 h-4" />
        ) : (
          <RotateCw className="w-4 h-4" />
        )}
      </button>

      {/* Speed Controls - Only show when enabled */}
      {turntableEnabled && (
        <div className="flex items-center gap-1">
          {(Object.keys(TURNTABLE_SPEED_PRESETS) as TurntableSpeedPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => handleSpeedChange(preset)}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                currentPreset === preset
                  ? 'bg-blue-600 text-white'
                  : cn('bg-white/10', theme.textSecondary, 'hover:bg-white/20')
              )}
              title={`${preset} speed`}
            >
              {preset === 'slow' && '0.25x'}
              {preset === 'normal' && '0.5x'}
              {preset === 'fast' && '1x'}
              {preset === 'veryFast' && '2x'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
