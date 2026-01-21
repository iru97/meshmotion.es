import { useState, useCallback } from 'react'
import type {
  TemporaryLink,
  TemporaryLinksState,
  CreateLinkRequest,
  LinkExpiry,
} from '@/types/cloud'

/**
 * Hook for temporary link storage
 * Currently returns mock data - will connect to real API when backend is ready
 */
export function useTemporaryLinks() {
  const [state, setState] = useState<TemporaryLinksState>({
    links: [],
    isUploading: false,
    uploadProgress: 0,
    isLoading: false,
    error: null,
  })

  /**
   * Create a temporary shareable link for a model
   * TODO: Implement when backend CDN is ready
   */
  const createLink = useCallback(
    async (request: CreateLinkRequest): Promise<TemporaryLink | null> => {
      setState((s) => ({ ...s, isUploading: true, uploadProgress: 0, error: null }))

      // Simulate progress
      const progressInterval = setInterval(() => {
        setState((s) => ({
          ...s,
          uploadProgress: Math.min(s.uploadProgress + 10, 90),
        }))
      }, 200)

      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      clearInterval(progressInterval)

      setState((s) => ({
        ...s,
        isUploading: false,
        uploadProgress: 0,
        error: 'Temporary link storage requires backend CDN. Coming soon!',
      }))

      return null
    },
    []
  )

  /**
   * Get a link by short code
   */
  const getLink = useCallback(async (shortCode: string): Promise<TemporaryLink | null> => {
    setState((s) => ({ ...s, isLoading: true, error: null }))

    setState((s) => ({
      ...s,
      isLoading: false,
      error: 'Link retrieval requires backend. Coming soon!',
    }))

    return null
  }, [])

  /**
   * Delete a temporary link
   */
  const deleteLink = useCallback(async (id: string): Promise<boolean> => {
    setState((s) => ({
      ...s,
      links: s.links.filter((l) => l.id !== id),
    }))
    return true
  }, [])

  /**
   * List user's links
   */
  const listMyLinks = useCallback(async (): Promise<TemporaryLink[]> => {
    setState((s) => ({ ...s, isLoading: true, error: null }))

    setState((s) => ({
      ...s,
      isLoading: false,
      links: [],
    }))

    return []
  }, [])

  /**
   * Extend link expiry
   */
  const extendExpiry = useCallback(
    async (id: string, newExpiry: LinkExpiry): Promise<TemporaryLink | null> => {
      setState((s) => ({
        ...s,
        error: 'Link management requires backend. Coming soon!',
      }))
      return null
    },
    []
  )

  /**
   * Generate a preview URL for current settings (client-side only)
   * This creates a URL with query params that encode viewer state
   */
  const generatePreviewUrl = useCallback(
    (settings: CreateLinkRequest['settings']): string => {
      const params = new URLSearchParams()

      if (settings.autoplay) params.set('autoplay', '1')
      if (settings.hideUI) params.set('hideUI', '1')
      if (settings.backgroundColor) params.set('bg', settings.backgroundColor.replace('#', ''))
      if (settings.cameraPosition) params.set('cam', settings.cameraPosition.join(','))
      if (settings.animationName) params.set('anim', settings.animationName)
      if (settings.lightingPreset) params.set('light', settings.lightingPreset)
      if (settings.environmentPreset) params.set('env', settings.environmentPreset)

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      return `${baseUrl}/embed?${params.toString()}`
    },
    []
  )

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }))
  }, [])

  /**
   * Check if temporary links are available
   */
  const isAvailable = false // Will be true when backend is ready

  return {
    ...state,
    isAvailable,
    createLink,
    getLink,
    deleteLink,
    listMyLinks,
    extendExpiry,
    generatePreviewUrl,
    clearError,
  }
}
