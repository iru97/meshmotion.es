import { useCallback, useEffect } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'

/**
 * Hook for managing fullscreen mode
 */
export function useFullscreen() {
  const isFullscreen = useViewerStore((state) => state.isFullscreen)
  const toggleFullscreen = useViewerStore((state) => state.toggleFullscreen)
  const setMinimalUIMode = useViewerStore((state) => state.setMinimalUIMode)

  /**
   * Enter fullscreen mode
   */
  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen()
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen()
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error)
    }
  }, [])

  /**
   * Exit fullscreen mode
   */
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error)
    }
  }, [])

  /**
   * Toggle fullscreen mode
   */
  const toggle = useCallback(async () => {
    const isCurrentlyFullscreen = !!document.fullscreenElement

    if (isCurrentlyFullscreen) {
      await exitFullscreen()
    } else {
      await enterFullscreen()
    }
  }, [enterFullscreen, exitFullscreen])

  // Listen for fullscreen changes (from browser or user pressing Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement
      const storeIsFullscreen = useViewerStore.getState().isFullscreen

      // Sync store state with actual fullscreen state
      if (isNowFullscreen !== storeIsFullscreen) {
        toggleFullscreen()
      }

      // Enable minimal UI in fullscreen
      setMinimalUIMode(isNowFullscreen)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [toggleFullscreen, setMinimalUIMode])

  return {
    isFullscreen,
    toggle,
    enterFullscreen,
    exitFullscreen,
  }
}
