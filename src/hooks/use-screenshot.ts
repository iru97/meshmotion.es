import { useState, useCallback } from 'react'
import { downloadFile } from '@/lib/conversion/three-exporters'

export type ScreenshotFormat = 'png' | 'jpeg'
export type ScreenshotResolution = '1x' | '2x' | '4x'

export interface ScreenshotOptions {
  format: ScreenshotFormat
  resolution: ScreenshotResolution
  transparentBackground: boolean
  filename?: string
  hideUI?: boolean
}

interface UseScreenshotReturn {
  isCapturing: boolean
  error: string | null
  takeScreenshot: (options: ScreenshotOptions) => Promise<void>
  reset: () => void
}

const RESOLUTION_MULTIPLIERS: Record<ScreenshotResolution, number> = {
  '1x': 1,
  '2x': 2,
  '4x': 4,
}

/**
 * Hook for capturing screenshots from the 3D canvas
 * Requires Canvas to have preserveDrawingBuffer: true
 */
export function useScreenshot(): UseScreenshotReturn {
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const takeScreenshot = useCallback(async (options: ScreenshotOptions): Promise<void> => {
    // Store hidden elements to restore later
    const hiddenElements: { element: HTMLElement; originalDisplay: string }[] = []

    const hideUIElements = () => {
      if (!options.hideUI) return

      // UI selectors to hide during screenshot
      const uiSelectors = [
        '.canvas-container > div:not(canvas)', // All overlays in canvas container
        '[class*="fixed"]', // Fixed positioned elements (modals, toolbars)
      ]

      // Find the canvas container
      const canvasContainer = document.querySelector('.canvas-container')
      if (canvasContainer) {
        // Hide all direct children except canvas
        canvasContainer.querySelectorAll(':scope > *:not(canvas)').forEach((el) => {
          if (el instanceof HTMLElement && el.style.display !== 'none') {
            hiddenElements.push({ element: el, originalDisplay: el.style.display })
            el.style.display = 'none'
          }
        })
      }

      // Hide fixed UI elements (but not the screenshot modal backdrop/modal itself)
      document.querySelectorAll('[class*="fixed"]').forEach((el) => {
        if (el instanceof HTMLElement &&
            el.style.display !== 'none' &&
            !el.closest('[data-screenshot-modal]')) {
          hiddenElements.push({ element: el, originalDisplay: el.style.display })
          el.style.display = 'none'
        }
      })
    }

    const restoreUIElements = () => {
      hiddenElements.forEach(({ element, originalDisplay }) => {
        element.style.display = originalDisplay
      })
    }

    try {
      setIsCapturing(true)
      setError(null)

      // Hide UI if requested
      hideUIElements()

      // Small delay to ensure UI is hidden before capture
      if (options.hideUI) {
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      // Find the WebGL canvas
      const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
      if (!canvas) {
        restoreUIElements()
        throw new Error('No canvas found. Make sure a 3D model is loaded.')
      }

      const multiplier = RESOLUTION_MULTIPLIERS[options.resolution]
      const mimeType = options.format === 'png' ? 'image/png' : 'image/jpeg'
      const quality = options.format === 'jpeg' ? 0.95 : undefined

      // For higher resolutions, we need to create a larger canvas
      if (multiplier > 1) {
        // Create an offscreen canvas with higher resolution
        const offscreen = document.createElement('canvas')
        const targetWidth = canvas.width * multiplier
        const targetHeight = canvas.height * multiplier
        offscreen.width = targetWidth
        offscreen.height = targetHeight

        const ctx = offscreen.getContext('2d')
        if (!ctx) {
          throw new Error('Could not create 2D context for screenshot')
        }

        // Handle transparent background
        if (options.transparentBackground && options.format === 'png') {
          ctx.clearRect(0, 0, targetWidth, targetHeight)
        } else {
          // Fill with background color if not transparent
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, targetWidth, targetHeight)
        }

        // Scale and draw the WebGL canvas
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight)

        // Convert to blob and download
        offscreen.toBlob(
          (blob) => {
            restoreUIElements()
            if (blob) {
              const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
              const filename = options.filename || `meshmotion-${timestamp}.${options.format}`
              downloadFile(blob, filename)
            } else {
              setError('Failed to create screenshot blob')
            }
            setIsCapturing(false)
          },
          mimeType,
          quality
        )
      } else {
        // 1x resolution - capture directly from canvas
        canvas.toBlob(
          (blob) => {
            restoreUIElements()
            if (blob) {
              const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
              const filename = options.filename || `meshmotion-${timestamp}.${options.format}`
              downloadFile(blob, filename)
            } else {
              setError('Failed to create screenshot blob')
            }
            setIsCapturing(false)
          },
          mimeType,
          quality
        )
      }
    } catch (err) {
      restoreUIElements()
      const errorMessage = err instanceof Error ? err.message : 'Screenshot failed'
      setError(errorMessage)
      setIsCapturing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsCapturing(false)
    setError(null)
  }, [])

  return {
    isCapturing,
    error,
    takeScreenshot,
    reset,
  }
}
