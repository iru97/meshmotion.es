'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { CharacterSelector } from '../animation/CharacterSelector'
import { AnimationSelector } from '../animation/AnimationSelector'
import { EnvironmentSettings } from '../settings/EnvironmentSettings'
import { LightingSettings } from '../settings/LightingSettings'
import { MaterialSettings } from '../settings/MaterialSettings'
import { Settings2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'

export function RightSidebar() {
  const showRightSidebar = useViewerStore((state) => state.showRightSidebar)
  const toggleRightSidebar = useViewerStore((state) => state.toggleRightSidebar)
  const theme = useThemeClasses()

  if (!showRightSidebar) {
    // Show toggle button when sidebar is hidden
    return (
      <button
        onClick={toggleRightSidebar}
        className={cn(
          'fixed top-4 right-4 z-40 p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover
        )}
        title="Settings"
      >
        <Settings2 className={cn('w-5 h-5', theme.iconPrimary)} />
      </button>
    )
  }

  return (
    <div className={cn('fixed top-4 right-4 bottom-52 z-40 w-80 flex flex-col overflow-hidden', theme.glassPanel)}>
      {/* Header */}
      <div className={cn('px-6 pt-6 pb-4 border-b', theme.border)}>
        <div className="flex items-center justify-between">
          <h2 className={cn('text-lg font-semibold flex items-center gap-2', theme.textPrimary)}>
            <Settings2 className="w-5 h-5" />
            Settings
          </h2>
          <button
            onClick={toggleRightSidebar}
            className={cn('p-2 rounded-full transition-colors', theme.hoverSubtle)}
          >
            <X className={cn('w-4 h-4', theme.textSecondary)} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Model Selection */}
        <div className="space-y-3">
          <h3 className={cn('text-xs font-semibold uppercase tracking-wider opacity-60', theme.textPrimary)}>Model & Animation</h3>
          <div className="space-y-3">
            <CharacterSelector />
            <AnimationSelector />
          </div>
        </div>

        <div className={cn('h-px', theme.separator)} />

        {/* Visual Settings */}
        <div className="space-y-3">
          <h3 className={cn('text-xs font-semibold uppercase tracking-wider opacity-60', theme.textPrimary)}>Visual Settings</h3>
          <div className="space-y-3">
            <EnvironmentSettings />
            <LightingSettings />
            <MaterialSettings />
          </div>
        </div>

        <div className={cn('h-px', theme.separator)} />

        {/* Model Info */}
        <ModelInfo />
      </div>
    </div>
  )
}

function ModelInfo() {
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const currentAnimation = useViewerStore((state) => state.currentAnimation)
  const theme = useThemeClasses()

  if (!currentCharacter) {
    return (
      <div className="space-y-2">
        <h3 className={cn('text-xs font-semibold uppercase tracking-wider opacity-60', theme.textPrimary)}>Model Info</h3>
        <p className={cn('text-xs', theme.textTertiary)}>No model loaded</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className={cn('text-xs font-semibold uppercase tracking-wider opacity-60', theme.textPrimary)}>Model Info</h3>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className={theme.textMuted}>Vertices</span>
            <span className={cn('font-medium', theme.textPrimary)}>{currentCharacter.metadata.vertices.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className={theme.textMuted}>Triangles</span>
            <span className={cn('font-medium', theme.textPrimary)}>{currentCharacter.metadata.triangles.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className={theme.textMuted}>Materials</span>
            <span className={cn('font-medium', theme.textPrimary)}>{currentCharacter.metadata.materials}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className={theme.textMuted}>Bones</span>
            <span className={cn('font-medium', theme.textPrimary)}>{currentCharacter.metadata.bones.length || 'None'}</span>
          </div>
        </div>
      </div>

      {currentAnimation && (
        <div className="space-y-3">
          <h3 className={cn('text-xs font-semibold uppercase tracking-wider opacity-60', theme.textPrimary)}>Animation Info</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={theme.textMuted}>Duration</span>
              <span className={cn('font-medium', theme.textPrimary)}>{currentAnimation.duration.toFixed(2)}s</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className={theme.textMuted}>Tracks</span>
              <span className={cn('font-medium', theme.textPrimary)}>{currentAnimation.tracks.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
