import { useCallback } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'

export interface ShareOptions {
  includeCamera?: boolean
  includeSettings?: boolean
  includeAnimation?: boolean
}

interface ShareUrlResult {
  url: string
  params: Record<string, string>
}

/**
 * Hook for generating and parsing shareable URLs
 */
export function useShareUrl() {
  /**
   * Generate a shareable URL with current viewer state
   */
  const generateShareUrl = useCallback((modelUrl: string, options: ShareOptions = {}): ShareUrlResult => {
    const {
      includeCamera = true,
      includeSettings = true,
      includeAnimation = true,
    } = options

    const state = useViewerStore.getState()
    const params: Record<string, string> = {}

    // Model URL is required
    params.model = modelUrl

    // Settings
    if (includeSettings) {
      if (state.lightingPreset !== 'studio') {
        params.lighting = state.lightingPreset
      }
      if (state.materialPreset !== 'textured') {
        params.material = state.materialPreset
      }
      if (state.environmentPreset !== 'studio') {
        params.env = state.environmentPreset
      }
      if (state.showWireframe) {
        params.wireframe = 'true'
      }
      if (state.showSkeleton) {
        params.skeleton = 'true'
      }
    }

    // Animation
    if (includeAnimation) {
      if (state.isPlaying) {
        params.autoplay = 'true'
      }
      if (state.playbackSpeed !== 1) {
        params.speed = state.playbackSpeed.toString()
      }
      if (!state.loop) {
        params.loop = 'false'
      }
      if (state.currentAnimation) {
        params.anim = state.currentAnimation.name
      }
    }

    // Build URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const searchParams = new URLSearchParams(params)
    const url = `${baseUrl}?${searchParams.toString()}`

    return { url, params }
  }, [])

  /**
   * Parse URL parameters and apply to viewer state
   */
  const applyUrlParams = useCallback((searchParams: URLSearchParams) => {
    const state = useViewerStore.getState()

    // Settings
    const lighting = searchParams.get('lighting')
    if (lighting) {
      state.setLightingPreset(lighting as Parameters<typeof state.setLightingPreset>[0])
    }

    const material = searchParams.get('material')
    if (material) {
      state.setMaterialPreset(material as Parameters<typeof state.setMaterialPreset>[0])
    }

    const env = searchParams.get('env')
    if (env) {
      state.setEnvironmentPreset(env as Parameters<typeof state.setEnvironmentPreset>[0])
    }

    if (searchParams.get('wireframe') === 'true' && !state.showWireframe) {
      state.toggleWireframe()
    }

    if (searchParams.get('skeleton') === 'true' && !state.showSkeleton) {
      state.toggleSkeleton()
    }

    // Animation
    if (searchParams.get('autoplay') === 'true') {
      state.play()
    }

    const speed = searchParams.get('speed')
    if (speed) {
      state.setSpeed(parseFloat(speed))
    }

    if (searchParams.get('loop') === 'false') {
      state.setLoop(false)
    }
  }, [])

  /**
   * Copy URL to clipboard
   */
  const copyToClipboard = useCallback(async (url: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        return true
      } catch {
        return false
      }
    }
  }, [])

  return {
    generateShareUrl,
    applyUrlParams,
    copyToClipboard,
  }
}
