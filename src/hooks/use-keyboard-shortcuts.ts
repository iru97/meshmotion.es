import { useEffect } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'

/**
 * Global keyboard shortcuts for the viewer
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const key = e.key.toLowerCase()
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey

      // Space - Toggle play/pause (normal mode)
      if (key === ' ' && !ctrl && !shift) {
        e.preventDefault()
        const comparisonEnabled = useViewerStore.getState().comparisonMode.enabled

        if (comparisonEnabled) {
          // In comparison mode, toggle both views if sync enabled
          const syncPlayback = useViewerStore.getState().comparisonMode.syncPlayback
          if (syncPlayback) {
            useViewerStore.getState().toggleView1Playback()
            useViewerStore.getState().toggleView2Playback()
          }
        } else {
          useViewerStore.getState().togglePlay()
        }
      }

      // A - Toggle Asset Panel
      if (key === 'a' && !ctrl && !shift) {
        e.preventDefault()
        useViewerStore.getState().toggleAssetPanel()
      }

      // C - Toggle Comparison Mode
      if (key === 'c' && !ctrl && !shift) {
        e.preventDefault()
        useViewerStore.getState().toggleComparisonMode()
      }

      // S - Toggle Settings Sidebar
      if (key === 's' && !ctrl && !shift) {
        e.preventDefault()
        useViewerStore.getState().toggleRightSidebar()
      }

      // T - Toggle Timeline
      if (key === 't' && !ctrl && !shift) {
        e.preventDefault()
        useViewerStore.getState().toggleTimeline()
      }

      // W - Toggle Wireframe
      if (key === 'w' && !ctrl && !shift) {
        e.preventDefault()
        useViewerStore.getState().toggleWireframe()
      }

      // K - Toggle Skeleton
      if (key === 'k' && !ctrl && !shift) {
        e.preventDefault()
        useViewerStore.getState().toggleSkeleton()
      }

      // 1-5 - Playback Speed Presets
      if (!ctrl && !shift && ['1', '2', '3', '4', '5'].includes(key)) {
        e.preventDefault()
        const speeds = { '1': 0.25, '2': 0.5, '3': 1, '4': 1.5, '5': 2 }
        useViewerStore.getState().setSpeed(speeds[key as keyof typeof speeds])
      }

      // Arrow Left - Rewind 1 second
      if (key === 'arrowleft' && !ctrl && !shift) {
        e.preventDefault()
        const currentTime = useViewerStore.getState().currentTime
        useViewerStore.getState().setCurrentTime(Math.max(0, currentTime - 1))
      }

      // Arrow Right - Forward 1 second
      if (key === 'arrowright' && !ctrl && !shift) {
        e.preventDefault()
        const currentTime = useViewerStore.getState().currentTime
        const duration = useViewerStore.getState().duration
        useViewerStore.getState().setCurrentTime(Math.min(duration, currentTime + 1))
      }

      // L - Toggle Loop
      if (key === 'l' && !ctrl && !shift) {
        e.preventDefault()
        const loop = useViewerStore.getState().loop
        useViewerStore.getState().setLoop(!loop)
      }

      // Esc - Close panels/dialogs
      if (key === 'escape') {
        e.preventDefault()
        const assetPanelOpen = useViewerStore.getState().assetPanelOpen
        const comparisonEnabled = useViewerStore.getState().comparisonMode.enabled

        if (assetPanelOpen) {
          useViewerStore.getState().toggleAssetPanel()
        } else if (comparisonEnabled) {
          useViewerStore.getState().toggleComparisonMode()
        }
      }

      // Comparison Mode Shortcuts (only when enabled)
      const comparisonEnabled = useViewerStore.getState().comparisonMode.enabled
      if (comparisonEnabled) {
        // H - Toggle Horizontal/Vertical layout
        if (key === 'h' && !ctrl && !shift) {
          e.preventDefault()
          const currentLayout = useViewerStore.getState().comparisonMode.layout
          const newLayout = currentLayout === 'vertical' ? 'horizontal' : 'vertical'
          useViewerStore.getState().setComparisonLayout(newLayout)
        }

        // P - Toggle Sync Playback
        if (key === 'p' && !ctrl && !shift) {
          e.preventDefault()
          useViewerStore.getState().toggleSyncPlayback()
        }

        // M - Toggle Sync Camera
        if (key === 'm' && !ctrl && !shift) {
          e.preventDefault()
          useViewerStore.getState().toggleSyncCamera()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
