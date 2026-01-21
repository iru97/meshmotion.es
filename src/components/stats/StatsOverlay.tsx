'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import {
  extractModelStats,
  formatNumber,
  formatDimension,
} from '@/hooks/use-model-stats'
import {
  X,
  Box,
  Triangle,
  Layers,
  Palette,
  Image,
  Bone,
  Play,
  Maximize2,
  BarChart3,
} from 'lucide-react'
import { useMemo } from 'react'

/**
 * Overlay panel displaying model statistics
 */
export function StatsOverlay() {
  const theme = useThemeClasses()

  const showStatsOverlay = useViewerStore((state) => state.showStatsOverlay)
  const toggleStatsOverlay = useViewerStore((state) => state.toggleStatsOverlay)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  // Extract stats from the current model
  const stats = useMemo(() => {
    if (!currentCharacter?.gltf) return null
    return extractModelStats(currentCharacter.gltf)
  }, [currentCharacter?.gltf])

  if (!showStatsOverlay || !currentCharacter || !stats) return null

  const statItems = [
    {
      icon: Triangle,
      label: 'Vertices',
      value: formatNumber(stats.vertices),
      color: 'text-blue-400',
    },
    {
      icon: Box,
      label: 'Triangles',
      value: formatNumber(stats.triangles),
      color: 'text-green-400',
    },
    {
      icon: Layers,
      label: 'Meshes',
      value: stats.meshes.toString(),
      color: 'text-purple-400',
    },
    {
      icon: Palette,
      label: 'Materials',
      value: stats.materials.toString(),
      color: 'text-orange-400',
    },
    {
      icon: Image,
      label: 'Textures',
      value: stats.textures.toString(),
      color: 'text-pink-400',
    },
    {
      icon: Bone,
      label: 'Bones',
      value: stats.bones.toString(),
      color: 'text-yellow-400',
      show: stats.bones > 0,
    },
    {
      icon: Play,
      label: 'Animations',
      value: stats.animations.toString(),
      color: 'text-cyan-400',
      show: stats.animations > 0,
    },
  ]

  return (
    <div
      className={cn(
        'fixed top-20 left-4 z-30',
        'p-3 rounded-xl border border-white/10',
        'w-56',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className={cn('w-4 h-4', theme.textPrimary)} />
          <h3 className={cn('text-xs font-semibold', theme.textPrimary)}>
            Model Stats
          </h3>
        </div>
        <button
          onClick={toggleStatsOverlay}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-3 h-3', theme.textSecondary)} />
        </button>
      </div>

      {/* Model Name */}
      <div className="mb-3 pb-2 border-b border-white/10">
        <p className={cn('text-xs truncate', theme.textMuted)}>
          {currentCharacter.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="space-y-1.5">
        {statItems
          .filter((item) => item.show !== false)
          .map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <item.icon className={cn('w-3 h-3', item.color)} />
                <span className={cn('text-xs', theme.textMuted)}>
                  {item.label}
                </span>
              </div>
              <span className={cn('text-xs font-mono', theme.textPrimary)}>
                {item.value}
              </span>
            </div>
          ))}
      </div>

      {/* Dimensions */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Maximize2 className={cn('w-3 h-3', theme.textSecondary)} />
          <span className={cn('text-xs', theme.textMuted)}>Dimensions</span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="bg-white/5 rounded px-1 py-0.5">
            <p className={cn('text-[10px]', theme.textMuted)}>W</p>
            <p className={cn('text-xs font-mono', theme.textPrimary)}>
              {formatDimension(stats.boundingBox.width)}
            </p>
          </div>
          <div className="bg-white/5 rounded px-1 py-0.5">
            <p className={cn('text-[10px]', theme.textMuted)}>H</p>
            <p className={cn('text-xs font-mono', theme.textPrimary)}>
              {formatDimension(stats.boundingBox.height)}
            </p>
          </div>
          <div className="bg-white/5 rounded px-1 py-0.5">
            <p className={cn('text-[10px]', theme.textMuted)}>D</p>
            <p className={cn('text-xs font-mono', theme.textPrimary)}>
              {formatDimension(stats.boundingBox.depth)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
