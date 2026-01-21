import { useCallback, useEffect, useState, useRef } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'

const IDLE_TIMEOUT = 3000 // 3 seconds before hiding UI

/**
 * Hook for managing fullscreen mode with auto-hide functionality
 */
export function useFullscreen() {
  const isFullscreen = useViewerStore((state) => state.isFullscreen)
  const toggleFullscreen = useViewerStore((state) => state.toggleFullscreen)
  const setMinimalUIMode = useViewerStore((state) => state.setMinimalUIMode)

  // Auto-hide state
  const [autoHideEnabled, setAutoHideEnabled] = useState(true)
  const [uiVisible, setUiVisible] = useState(true)
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  /**
   * Reset idle timer - show UI and restart countdown
   */
  const resetIdleTimer = useCallback(() => {
    // Show UI
    setUiVisible(true)

    // Clear existing timeout
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
    }

    // Only start new timeout if in fullscreen and auto-hide is enabled
    const currentlyFullscreen = !!document.fullscreenElement
    if (currentlyFullscreen && autoHideEnabled) {
      idleTimeoutRef.current = setTimeout(() => {
        setUiVisible(false)
      }, IDLE_TIMEOUT)
    }
  }, [autoHideEnabled])

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

      // Reset UI visibility when entering/exiting fullscreen
      if (isNowFullscreen) {
        resetIdleTimer()
      } else {
        // Show UI when exiting fullscreen
        setUiVisible(true)
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current)
        }
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [toggleFullscreen, setMinimalUIMode, resetIdleTimer])

  // Listen for mouse movement and interaction to reset idle timer
  useEffect(() => {
    if (!isFullscreen || !autoHideEnabled) {
      // Ensure UI is visible when not in fullscreen or auto-hide disabled
      setUiVisible(true)
      return
    }

    const handleActivity = () => {
      resetIdleTimer()
    }

    // Listen for various user activities
    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('mousedown', handleActivity)
    document.addEventListener('keydown', handleActivity)
    document.addEventListener('touchstart', handleActivity)
    document.addEventListener('wheel', handleActivity)

    // Start initial idle timer
    resetIdleTimer()

    return () => {
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('mousedown', handleActivity)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('touchstart', handleActivity)
      document.removeEventListener('wheel', handleActivity)

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
    }
  }, [isFullscreen, autoHideEnabled, resetIdleTimer])

  return {
    isFullscreen,
    toggle,
    enterFullscreen,
    exitFullscreen,
    // Auto-hide features
    autoHideEnabled,
    setAutoHideEnabled,
    uiVisible,
    showUI: resetIdleTimer,
  }
}
