'use client'

import { useState } from 'react'
import { useViewerStore, type CustomCameraPreset } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { X, Camera, RotateCcw, Plus, Trash2, Star } from 'lucide-react'
import { CAMERA_PRESETS, CameraPreset } from '@/hooks/use-camera-presets'

interface CameraPresetsPanelProps {
  onSelectPreset: (preset: CameraPreset) => void
  onGetCurrentCamera?: () => { position: [number, number, number]; target: [number, number, number] } | null
}

/**
 * Panel for selecting camera preset views with custom preset support
 */
export function CameraPresetsPanel({ onSelectPreset, onGetCurrentCamera }: CameraPresetsPanelProps) {
  const theme = useThemeClasses()
  const cameraPresetsOpen = useViewerStore((state) => state.cameraPresetsOpen)
  const toggleCameraPresets = useViewerStore((state) => state.toggleCameraPresets)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const customCameraPresets = useViewerStore((state) => state.customCameraPresets)
  const addCustomCameraPreset = useViewerStore((state) => state.addCustomCameraPreset)
  const removeCustomCameraPreset = useViewerStore((state) => state.removeCustomCameraPreset)

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')

  if (!cameraPresetsOpen || !currentCharacter) return null

  const handleSaveCurrentView = () => {
    if (!newPresetName.trim()) return

    // Get current camera position from the controller
    // For now, we'll use a default position if onGetCurrentCamera is not provided
    const cameraData = onGetCurrentCamera?.() || {
      position: [5, 3, 8] as [number, number, number],
      target: [0, 1, 0] as [number, number, number],
    }

    const preset: CustomCameraPreset = {
      id: `custom-${Date.now()}`,
      name: newPresetName.trim(),
      position: cameraData.position,
      target: cameraData.target,
      createdAt: Date.now(),
    }

    addCustomCameraPreset(preset)
    setNewPresetName('')
    setIsAddingNew(false)
  }

  const handleSelectCustomPreset = (preset: CustomCameraPreset) => {
    onSelectPreset({
      id: preset.id,
      name: preset.name,
      position: preset.position,
      target: preset.target,
      icon: '★',
    })
  }

  return (
    <div
      className={cn(
        'fixed bottom-24 left-4 z-30',
        'p-4 rounded-xl border border-white/10',
        'w-72',
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

      {/* Default Preset Grid */}
      <div className="mb-4">
        <p className={cn('text-xs mb-2', theme.textMuted)}>Standard Views</p>
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
      </div>

      {/* Custom Presets */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className={cn('text-xs', theme.textMuted)}>Custom Views</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className={cn(
              'p-1 rounded transition-colors',
              'hover:bg-white/10',
              theme.textSecondary
            )}
            title="Save current view"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Add New Preset Form */}
        {isAddingNew && (
          <div className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCurrentView()}
              placeholder="Preset name..."
              autoFocus
              className={cn(
                'w-full px-2 py-1 rounded text-xs',
                'bg-white/5 border border-white/10 text-white',
                'placeholder-white/40',
                'focus:outline-none focus:border-white/30'
              )}
            />
            <div className="flex gap-1 mt-2">
              <button
                onClick={handleSaveCurrentView}
                disabled={!newPresetName.trim()}
                className={cn(
                  'flex-1 py-1 rounded text-xs',
                  'bg-blue-500/20 text-blue-300',
                  newPresetName.trim() ? 'hover:bg-blue-500/30' : 'opacity-50'
                )}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false)
                  setNewPresetName('')
                }}
                className={cn(
                  'flex-1 py-1 rounded text-xs',
                  'bg-white/10 hover:bg-white/20',
                  theme.textSecondary
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Custom Preset List */}
        {customCameraPresets.length > 0 ? (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {customCameraPresets.map((preset) => (
              <div
                key={preset.id}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-lg',
                  'bg-white/5 hover:bg-white/10 transition-colors',
                  'border border-white/10 hover:border-white/20'
                )}
              >
                <Star className={cn('w-3 h-3 text-yellow-400')} />
                <button
                  onClick={() => handleSelectCustomPreset(preset)}
                  className={cn('flex-1 text-left text-xs', theme.textPrimary)}
                >
                  {preset.name}
                </button>
                <button
                  onClick={() => removeCustomCameraPreset(preset.id)}
                  className={cn(
                    'p-1 rounded transition-colors',
                    'hover:bg-red-500/20 text-red-400'
                  )}
                  title="Delete preset"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          !isAddingNew && (
            <p className={cn('text-xs text-center py-2', theme.textMuted)}>
              No custom views saved
            </p>
          )
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onSelectPreset(CAMERA_PRESETS[6])} // Iso Front as default
        className={cn(
          'w-full px-3 py-2 rounded-lg',
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
