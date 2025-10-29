'use client'

import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useViewerStore } from '@/lib/store/viewer-store'
import { cn } from '@/lib/utils'
import { Package, FileJson, Box, Printer, Hexagon, X } from 'lucide-react'
import type { ExportFormat, FormatInfo } from '@/types/conversion'

/**
 * Format badge grid for selecting export format
 * Shows available formats with icons and compatibility indicators
 */
export function ExportFormatMenu() {
  const theme = useThemeClasses()
  const exportMenuOpen = useViewerStore((state) => state.exportMenuOpen)
  const toggleExportMenu = useViewerStore((state) => state.toggleExportMenu)
  const setSelectedExportFormat = useViewerStore((state) => state.setSelectedExportFormat)

  if (!exportMenuOpen) return null

  const formats: (FormatInfo & { format: ExportFormat })[] = [
    {
      format: 'glb',
      id: 'glb',
      name: 'GLB',
      extension: '.glb',
      icon: 'Package',
      supportsAnimations: true,
      supportsMaterials: true,
      supportsTextures: true,
      availability: 'full',
      description: 'Binary glTF (single file)',
    },
    {
      format: 'gltf',
      id: 'gltf',
      name: 'glTF',
      extension: '.gltf',
      icon: 'FileJson',
      supportsAnimations: true,
      supportsMaterials: true,
      supportsTextures: true,
      availability: 'full',
      description: 'GL Transmission Format (JSON + assets)',
    },
    {
      format: 'obj',
      id: 'obj',
      name: 'OBJ',
      extension: '.obj',
      icon: 'Box',
      supportsAnimations: false,
      supportsMaterials: true,
      supportsTextures: true,
      availability: 'partial',
      dataLoss: ['Animations', 'Skeleton'],
      description: 'Wavefront OBJ (geometry only)',
    },
    {
      format: 'stl',
      id: 'stl',
      name: 'STL',
      extension: '.stl',
      icon: 'Printer',
      supportsAnimations: false,
      supportsMaterials: false,
      supportsTextures: false,
      availability: 'partial',
      dataLoss: ['Animations', 'Materials', 'Textures'],
      description: 'STL for 3D printing',
    },
    {
      format: 'ply',
      id: 'ply',
      name: 'PLY',
      extension: '.ply',
      icon: 'Hexagon',
      supportsAnimations: false,
      supportsMaterials: false,
      supportsTextures: false,
      availability: 'partial',
      dataLoss: ['Animations', 'Materials', 'Textures'],
      description: 'PLY point cloud format',
    },
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return Package
      case 'FileJson':
        return FileJson
      case 'Box':
        return Box
      case 'Printer':
        return Printer
      case 'Hexagon':
        return Hexagon
      default:
        return Package
    }
  }

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-40 w-80 flex flex-col overflow-hidden rounded-xl border border-white/10',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className={cn('px-6 pt-6 pb-4 border-b', theme.border)}>
        <div className="flex items-center justify-between">
          <h2 className={cn('text-lg font-semibold flex items-center gap-2', theme.textPrimary)}>
            <Package className="w-5 h-5" />
            Export Format
          </h2>
          <button
            onClick={toggleExportMenu}
            className={cn('p-2 rounded-full transition-colors', theme.hoverSubtle)}
          >
            <X className={cn('w-4 h-4', theme.textSecondary)} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col gap-2">
          {formats.map((format) => {
            const Icon = getIcon(format.icon)

            return (
              <button
                key={format.format}
                onClick={() => {
                  setSelectedExportFormat(format.format)
                  toggleExportMenu()
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                  'border border-white/10 hover:border-white/30',
                  'bg-white/5 hover:bg-white/10',
                  'active:scale-95'
                )}
              >
                <Icon className={cn('w-5 h-5', theme.iconPrimary)} />
                <span className={cn('text-sm font-medium', theme.textPrimary)}>{format.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
