'use client'

import { useEffect } from 'react'
import { useFullscreen } from '@/hooks/use-fullscreen'

/**
 * Controller component that manages fullscreen UI visibility
 * Adds/removes CSS classes on the body element to control UI visibility
 */
export function FullscreenUIController() {
  const { isFullscreen, uiVisible, autoHideEnabled } = useFullscreen()

  useEffect(() => {
    const body = document.body

    // Add fullscreen class
    if (isFullscreen) {
      body.classList.add('is-fullscreen')
    } else {
      body.classList.remove('is-fullscreen')
    }

    // Add UI hidden class when in fullscreen and UI should be hidden
    if (isFullscreen && autoHideEnabled && !uiVisible) {
      body.classList.add('fullscreen-ui-hidden')
    } else {
      body.classList.remove('fullscreen-ui-hidden')
    }

    return () => {
      body.classList.remove('is-fullscreen', 'fullscreen-ui-hidden')
    }
  }, [isFullscreen, uiVisible, autoHideEnabled])

  return null
}
