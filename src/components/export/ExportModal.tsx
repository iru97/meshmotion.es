'use client'

import { useState, useEffect } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useFormatExporter } from '@/hooks/use-format-exporter'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { AlertTriangle, Download, X } from 'lucide-react'
import type { ExportFormat, ExportOptions } from '@/types/conversion'
import type { GLTFModel } from '@/types/viewer'

/**
 * Export modal with format-specific options
 * Allows users to configure export settings and download the file
 */
export function ExportModal() {
  const theme = useThemeClasses()
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const currentAnimation = useViewerStore((state) => state.currentAnimation)
  const uploadedCharacters = useViewerStore((state) => state.uploadedCharacters)
  const uploadedAnimations = useViewerStore((state) => state.uploadedAnimations)
  const selectedExportFormat = useViewerStore((state) => state.selectedExportFormat)
  const setSelectedExportFormat = useViewerStore((state) => state.setSelectedExportFormat)

  const format = selectedExportFormat as ExportFormat
  const isOpen = selectedExportFormat !== null
  const onClose = () => setSelectedExportFormat(null)

  const { exportAndDownload, getFormatInfo, getWarnings, isExporting, error } = useFormatExporter()

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('')
  const [selectedAnimationIds, setSelectedAnimationIds] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const [options, setOptions] = useState<ExportOptions>({
    includeAnimations: true,
    includeMaterials: true,
    includeTextures: true,
    coordinateSystem: 'y-up',
    binary: true,
    compress: false,
    fileName: '',
  })

  const formatInfo = getFormatInfo(format)
  const warnings = getWarnings(format)

  // Reset options when format changes
  useEffect(() => {
    if (formatInfo) {
      setOptions({
        includeAnimations: formatInfo.supportsAnimations,
        includeMaterials: formatInfo.supportsMaterials,
        includeTextures: formatInfo.supportsTextures,
        coordinateSystem: 'y-up',
        binary: true,
        compress: false,
        fileName: '',
      })

      // Set default character selection
      if (currentCharacter) {
        setSelectedCharacterId(currentCharacter.id)
      } else if (uploadedCharacters.length > 0) {
        setSelectedCharacterId(uploadedCharacters[0].id)
      }

      // Set default animation selection
      if (currentAnimation && formatInfo.supportsAnimations) {
        setSelectedAnimationIds([currentAnimation.name])
      }

      // Set default filename
      const defaultName = currentCharacter?.name.replace(/\.(glb|gltf)$/i, '') || 'model'
      setFileName(defaultName)
    }
  }, [format, formatInfo, currentCharacter, currentAnimation, uploadedCharacters])

  if (!isOpen || !formatInfo) return null

  // Get selected character
  const selectedCharacter = uploadedCharacters.find((c) => c.id === selectedCharacterId) || currentCharacter

  const handleExport = async () => {
    if (!selectedCharacter) return

    try {
      // Filter animations based on selection
      let animationsToExport = selectedCharacter.animations

      if (formatInfo.supportsAnimations && selectedAnimationIds.length > 0) {
        // Only include selected animations
        animationsToExport = uploadedAnimations
          .filter((anim) => selectedAnimationIds.includes(anim.name))
          .map((anim) => anim.clip)
      }

      // Create a modified model with selected animations
      const modelToExport: GLTFModel = {
        ...selectedCharacter,
        animations: options.includeAnimations ? animationsToExport : [],
      }

      const exportOptions: ExportOptions = {
        ...options,
        fileName: `${fileName}${formatInfo.extension}`,
      }

      await exportAndDownload(modelToExport, format, exportOptions)

      // Close modal
      onClose()
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-2xl max-h-[90vh] overflow-y-auto',
          'p-6 rounded-xl border border-white/10',
          theme.glassPanelDark
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={cn('text-xl font-semibold', theme.textPrimary)}>Export to {formatInfo.name}</h2>
            <p className={cn('text-sm mt-1', theme.textSecondary)}>{formatInfo.description}</p>
          </div>
          <button
            onClick={onClose}
            className={cn('p-2 rounded-full transition-colors', theme.hoverSubtle)}
          >
            <X className={cn('w-5 h-5', theme.textSecondary)} />
          </button>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-300 mb-2">Data Loss Warning</h3>
                <p className="text-sm text-yellow-200/90 mb-2">
                  Exporting to {formatInfo.name} will lose the following:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-200/90">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Character Selection */}
        <div className="mb-4">
          <label className={cn('block text-sm font-medium mb-2', theme.textPrimary)}>
            Character to Export
          </label>
          {uploadedCharacters.length > 0 ? (
            <select
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
              className={cn(
                'w-full px-4 py-2 rounded-lg border border-white/10',
                'bg-white/5 text-white',
                'focus:outline-none focus:border-white/30'
              )}
            >
              {currentCharacter && (
                <option value={currentCharacter.id}>{currentCharacter.name} (current)</option>
              )}
              {uploadedCharacters
                .filter((c) => c.id !== currentCharacter?.id)
                .map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name}
                  </option>
                ))}
            </select>
          ) : (
            <div className={cn('px-4 py-2 rounded-lg bg-white/5 border border-white/10', theme.textSecondary)}>
              {currentCharacter?.name || 'No character loaded'}
            </div>
          )}
        </div>

        {/* Animation Selection */}
        {formatInfo.supportsAnimations && uploadedAnimations.length > 0 && (
          <div className="mb-4">
            <label className={cn('block text-sm font-medium mb-2', theme.textPrimary)}>
              Animations to Include ({selectedAnimationIds.length} selected)
            </label>
            <select
              multiple
              value={selectedAnimationIds}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value)
                setSelectedAnimationIds(selected)
              }}
              className={cn(
                'w-full px-4 py-2 rounded-lg border border-white/10',
                'bg-white/5 text-white',
                'focus:outline-none focus:border-white/30',
                'min-h-[120px]'
              )}
            >
              {uploadedAnimations.map((anim) => (
                <option key={anim.name} value={anim.name}>
                  {anim.name}{currentAnimation?.name === anim.name && ' (current)'}
                </option>
              ))}
            </select>
            <p className={cn('text-xs mt-1', theme.textTertiary)}>
              Hold Ctrl/Cmd to select multiple animations
            </p>
          </div>
        )}

        {/* Export Options */}
        <div className="space-y-4 mb-6">
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>Export Options</h3>

          {/* Animations (simple toggle if no animations uploaded) */}
          {formatInfo.supportsAnimations && uploadedAnimations.length === 0 && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeAnimations}
                onChange={(e) => setOptions({ ...options, includeAnimations: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/10"
              />
              <span className={theme.textSecondary}>
                Include Animations {currentAnimation ? `(${currentAnimation.name})` : '(none loaded)'}
              </span>
            </label>
          )}

          {/* Materials */}
          {formatInfo.supportsMaterials && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeMaterials}
                onChange={(e) => setOptions({ ...options, includeMaterials: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/10"
                disabled={!formatInfo.supportsMaterials}
              />
              <span className={cn(theme.textSecondary, !formatInfo.supportsMaterials && 'opacity-50')}>
                Include Materials
              </span>
            </label>
          )}

          {/* Textures */}
          {formatInfo.supportsTextures && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeTextures}
                onChange={(e) => setOptions({ ...options, includeTextures: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/10"
                disabled={!formatInfo.supportsTextures}
              />
              <span className={cn(theme.textSecondary, !formatInfo.supportsTextures && 'opacity-50')}>
                Include Textures
              </span>
            </label>
          )}

          {/* Coordinate System */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', theme.textPrimary)}>
              Coordinate System
            </label>
            <select
              value={options.coordinateSystem}
              onChange={(e) =>
                setOptions({ ...options, coordinateSystem: e.target.value as 'y-up' | 'z-up' })
              }
              className={cn(
                'w-full px-4 py-2 rounded-lg border border-white/10',
                'bg-white/5 text-white',
                'focus:outline-none focus:border-white/30'
              )}
            >
              <option value="y-up">Y-Up (Blender, glTF)</option>
              <option value="z-up">Z-Up (3ds Max)</option>
            </select>
          </div>

          {/* Binary option for STL/PLY */}
          {(format === 'stl' || format === 'ply') && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.binary}
                onChange={(e) => setOptions({ ...options, binary: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/10"
              />
              <span className={theme.textSecondary}>Binary format (recommended for smaller file size)</span>
            </label>
          )}
        </div>

        {/* File Name */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-2', theme.textPrimary)}>File Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className={cn(
                'flex-1 px-4 py-2 rounded-lg border border-white/10',
                'bg-white/5 text-white',
                'focus:outline-none focus:border-white/30'
              )}
              placeholder="model"
            />
            <div className={cn('px-4 py-2 rounded-lg bg-white/5 border border-white/10', theme.textSecondary)}>
              {formatInfo.extension}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className={cn(
              'px-6 py-2 rounded-lg transition-colors',
              'bg-white/5 hover:bg-white/10',
              theme.textSecondary,
              isExporting && 'opacity-50 cursor-not-allowed'
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || !fileName}
            className={cn(
              'px-6 py-2 rounded-lg transition-colors',
              'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300',
              'flex items-center gap-2',
              (isExporting || !fileName) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : `Export ${formatInfo.name}`}
          </button>
        </div>
      </div>
    </>
  )
}
