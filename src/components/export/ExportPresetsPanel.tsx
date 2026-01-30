'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import {
  X,
  Save,
  Trash2,
  FileDown,
  Plus,
  Check,
  Bookmark,
} from 'lucide-react'
import type { ExportPreset } from '@/types/annotations'
import type { ExportFormat, ExportOptions } from '@/types/conversion'

const FORMAT_LABELS: Record<string, string> = {
  glb: 'GLB (Binary)',
  gltf: 'GLTF',
  obj: 'OBJ',
  stl: 'STL',
  ply: 'PLY',
  fbx: 'FBX',
  dae: 'COLLADA',
  usdz: 'USDZ',
}

const FORMAT_OPTIONS: { value: ExportFormat; label: string }[] = [
  { value: 'glb', label: 'GLB (Binary)' },
  { value: 'gltf', label: 'GLTF' },
  { value: 'obj', label: 'OBJ' },
  { value: 'stl', label: 'STL' },
  { value: 'ply', label: 'PLY' },
]

/**
 * Panel for managing export presets (saved export configurations)
 */
export function ExportPresetsPanel() {
  const theme = useThemeClasses()

  const exportPresetsPanelOpen = useViewerStore((state) => state.exportPresetsPanelOpen)
  const toggleExportPresetsPanel = useViewerStore((state) => state.toggleExportPresetsPanel)
  const exportPresets = useViewerStore((state) => state.exportPresets)
  const addExportPreset = useViewerStore((state) => state.addExportPreset)
  const removeExportPreset = useViewerStore((state) => state.removeExportPreset)
  const setSelectedExportFormat = useViewerStore((state) => state.setSelectedExportFormat)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  const [isCreating, setIsCreating] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [newPresetFormat, setNewPresetFormat] = useState<ExportFormat>('glb')
  const [newPresetOptions, setNewPresetOptions] = useState<ExportOptions>({
    includeAnimations: true,
    includeMaterials: true,
    includeTextures: true,
    coordinateSystem: 'y-up',
    binary: true,
    compress: false,
    fileName: '',
  })

  if (!exportPresetsPanelOpen || !currentCharacter) return null

  const handleCreatePreset = () => {
    if (!newPresetName.trim()) return

    const preset: ExportPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      format: newPresetFormat,
      options: newPresetOptions,
      createdAt: Date.now(),
    }

    addExportPreset(preset)
    setIsCreating(false)
    setNewPresetName('')
    setNewPresetFormat('glb')
    setNewPresetOptions({
      includeAnimations: true,
      includeMaterials: true,
      includeTextures: true,
      coordinateSystem: 'y-up',
      binary: true,
      compress: false,
      fileName: '',
    })
  }

  const handleUsePreset = (preset: ExportPreset) => {
    // Open the export modal with the preset's format
    // The options will be applied in the modal
    setSelectedExportFormat(preset.format as ExportFormat)
  }

  return (
    <div
      className={cn(
        'fixed bottom-24 right-4 z-30',
        'p-4 rounded-xl border border-white/10',
        'w-80 max-h-[450px] overflow-hidden flex flex-col',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark className={cn('w-4 h-4', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Export Presets
          </h3>
          <span className={cn('text-xs px-1.5 py-0.5 rounded bg-white/10', theme.textMuted)}>
            {exportPresets.length}
          </span>
        </div>
        <button
          onClick={toggleExportPresetsPanel}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-4 h-4', theme.textSecondary)} />
        </button>
      </div>

      {/* Create New Preset */}
      {isCreating ? (
        <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10 space-y-3">
          <input
            type="text"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            placeholder="Preset name..."
            className={cn(
              'w-full px-3 py-2 rounded text-sm',
              'bg-white/10 border border-white/20',
              'text-white placeholder-white/40',
              'focus:outline-none focus:border-blue-500'
            )}
            autoFocus
          />

          <div>
            <label className={cn('block text-xs mb-1', theme.textMuted)}>Format</label>
            <select
              value={newPresetFormat}
              onChange={(e) => setNewPresetFormat(e.target.value as ExportFormat)}
              className={cn(
                'w-full px-2 py-1.5 rounded text-xs',
                'bg-white/10 border border-white/20',
                'text-white',
                'focus:outline-none focus:border-blue-500'
              )}
            >
              {FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-gray-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newPresetOptions.includeAnimations}
                onChange={(e) =>
                  setNewPresetOptions({ ...newPresetOptions, includeAnimations: e.target.checked })
                }
                className="w-3 h-3 rounded"
              />
              <span className={cn('text-xs', theme.textSecondary)}>Include Animations</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newPresetOptions.includeMaterials}
                onChange={(e) =>
                  setNewPresetOptions({ ...newPresetOptions, includeMaterials: e.target.checked })
                }
                className="w-3 h-3 rounded"
              />
              <span className={cn('text-xs', theme.textSecondary)}>Include Materials</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newPresetOptions.includeTextures}
                onChange={(e) =>
                  setNewPresetOptions({ ...newPresetOptions, includeTextures: e.target.checked })
                }
                className="w-3 h-3 rounded"
              />
              <span className={cn('text-xs', theme.textSecondary)}>Include Textures</span>
            </label>
          </div>

          <div>
            <label className={cn('block text-xs mb-1', theme.textMuted)}>Coordinate System</label>
            <select
              value={newPresetOptions.coordinateSystem}
              onChange={(e) =>
                setNewPresetOptions({
                  ...newPresetOptions,
                  coordinateSystem: e.target.value as 'y-up' | 'z-up',
                })
              }
              className={cn(
                'w-full px-2 py-1.5 rounded text-xs',
                'bg-white/10 border border-white/20',
                'text-white',
                'focus:outline-none focus:border-blue-500'
              )}
            >
              <option value="y-up" className="bg-gray-900">Y-Up (Blender, glTF)</option>
              <option value="z-up" className="bg-gray-900">Z-Up (3ds Max)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCreatePreset}
              disabled={!newPresetName.trim()}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs',
                'bg-blue-600 text-white hover:bg-blue-500',
                !newPresetName.trim() && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Check className="w-3 h-3" />
              Save
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className={cn(
                'flex-1 px-3 py-1.5 rounded text-xs',
                'bg-white/10 hover:bg-white/20',
                theme.textSecondary
              )}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className={cn(
            'w-full flex items-center justify-center gap-2 mb-3 px-3 py-2 rounded-lg text-xs',
            'bg-white/10 hover:bg-white/20 transition-colors',
            theme.textSecondary
          )}
        >
          <Plus className="w-3 h-3" />
          Create Preset
        </button>
      )}

      {/* Presets List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {exportPresets.length === 0 ? (
          <div className={cn('text-center py-6', theme.textMuted)}>
            <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No presets saved</p>
            <p className="text-xs opacity-75">Create one to save export settings</p>
          </div>
        ) : (
          exportPresets.map((preset) => (
            <div
              key={preset.id}
              className={cn(
                'p-3 rounded-lg bg-white/5 border border-white/10',
                'hover:bg-white/10 transition-colors'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={cn('text-sm font-medium', theme.textPrimary)}>
                    {preset.name}
                  </p>
                  <p className={cn('text-xs', theme.textMuted)}>
                    {FORMAT_LABELS[preset.format] || preset.format.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => removeExportPreset(preset.id)}
                  className="p-1 rounded transition-colors hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Options preview */}
              <div className="flex flex-wrap gap-1 mb-2">
                {preset.options.includeAnimations && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-300">
                    Animations
                  </span>
                )}
                {preset.options.includeMaterials && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-green-500/20 text-green-300">
                    Materials
                  </span>
                )}
                {preset.options.includeTextures && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-purple-500/20 text-purple-300">
                    Textures
                  </span>
                )}
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-white/60">
                  {preset.options.coordinateSystem === 'y-up' ? 'Y-Up' : 'Z-Up'}
                </span>
              </div>

              <button
                onClick={() => handleUsePreset(preset)}
                className={cn(
                  'w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs',
                  'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors'
                )}
              >
                <FileDown className="w-3 h-3" />
                Use Preset
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
