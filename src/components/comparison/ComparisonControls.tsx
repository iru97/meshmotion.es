'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Link, Unlink, Columns2, Rows2 } from 'lucide-react'
import { ViewSelector } from './ViewSelector'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'

export function ComparisonControls() {
  const theme = useThemeClasses()
  const [isMobile, setIsMobile] = useState(false)

  const comparisonMode = useViewerStore((state) => state.comparisonMode)
  const comparisonPanelOpen = useViewerStore((state) => state.comparisonPanelOpen)
  const showRightSidebar = useViewerStore((state) => state.showRightSidebar)
  const toggleComparisonMode = useViewerStore((state) => state.toggleComparisonMode)
  const toggleSyncPlayback = useViewerStore((state) => state.toggleSyncPlayback)
  const toggleSyncCamera = useViewerStore((state) => state.toggleSyncCamera)
  const setComparisonLayout = useViewerStore((state) => state.setComparisonLayout)

  const { view1, view2, syncPlayback, syncCamera, layout, enabled } = comparisonMode

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Force horizontal layout on mobile
  useEffect(() => {
    if (isMobile && layout === 'vertical') {
      setComparisonLayout('horizontal')
    }
  }, [isMobile, layout, setComparisonLayout])

  // Hide when RightSidebar is open or panel is closed
  if (showRightSidebar || !comparisonPanelOpen) return null

  return (
    <div
      className={cn(
        'fixed right-4 top-20 z-40 w-[320px] p-4 rounded-xl',
        theme.glassPanelDark,
        'border border-white/10'
      )}
    >
      <h3 className={cn('text-sm font-semibold mb-4', theme.textPrimary)}>
        Comparison Mode
      </h3>

      {/* Enable/Disable Comparison Mode Switch */}
      <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <Label htmlFor="comparison-mode" className={cn('text-sm', theme.textPrimary)}>
            Enable Comparison
          </Label>
          <Switch
            id="comparison-mode"
            checked={enabled}
            onCheckedChange={toggleComparisonMode}
          />
        </div>
      </div>

      {/* Layout Switcher */}
      <div className="mb-4">
        <label className={cn('block text-xs mb-2', theme.textSecondary)}>
          Layout {isMobile && <span className="text-white/50">(Horizontal only on mobile)</span>}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setComparisonLayout('vertical')}
            disabled={isMobile}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors',
              isMobile && 'opacity-50 cursor-not-allowed',
              layout === 'vertical'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            )}
          >
            <Columns2 className="w-4 h-4" />
            Vertical
          </button>
          <button
            onClick={() => setComparisonLayout('horizontal')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors',
              layout === 'horizontal'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            )}
          >
            <Rows2 className="w-4 h-4" />
            Horizontal
          </button>
        </div>
      </div>

      {/* Sync Options */}
      <div className="mb-4 space-y-2">
        <label className={cn('block text-xs mb-2', theme.textSecondary)}>
          Synchronization
        </label>

        <button
          onClick={toggleSyncPlayback}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
            syncPlayback
              ? 'bg-green-500/20 text-green-300'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          )}
        >
          <span className="text-sm">Sync Playback</span>
          {syncPlayback ? (
            <Link className="w-4 h-4" />
          ) : (
            <Unlink className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={toggleSyncCamera}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
            syncCamera
              ? 'bg-green-500/20 text-green-300'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          )}
        >
          <span className="text-sm">Sync Camera</span>
          {syncCamera ? (
            <Link className="w-4 h-4" />
          ) : (
            <Unlink className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* View 1 */}
      <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
        <h4 className={cn('text-sm font-medium mb-3', theme.textPrimary)}>
          View 1
        </h4>
        <ViewSelector
          viewNumber={1}
          currentCharacter={view1.character}
          currentAnimation={view1.animation}
        />
      </div>

      {/* View 2 */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <h4 className={cn('text-sm font-medium mb-3', theme.textPrimary)}>
          View 2
        </h4>
        <ViewSelector
          viewNumber={2}
          currentCharacter={view2.character}
          currentAnimation={view2.animation}
        />
      </div>
    </div>
  )
}
