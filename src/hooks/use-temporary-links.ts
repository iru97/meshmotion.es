'use client'

import { useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { TemporaryLink as DBTemporaryLink } from '@/lib/supabase/types'
import type {
  TemporaryLink,
  TemporaryLinksState,
  CreateLinkRequest,
  LinkExpiry,
  ViewerLinkSettings,
} from '@/types/cloud'

const STORAGE_BUCKET = 'temporary-models'

// Convert expiry option to actual date
function getExpiryDate(expiry: LinkExpiry): string | null {
  const now = new Date()
  switch (expiry) {
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString()
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    case '30d':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    case 'never':
      return null
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
  }
}

// Generate a random short code
function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Convert DB record to TemporaryLink interface
function dbToTemporaryLink(
  record: DBTemporaryLink,
  signedUrl: string | null,
  modelName: string,
  modelSize: number,
  settings: ViewerLinkSettings
): TemporaryLink {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const shortUrl = `${baseUrl}/v/${record.short_code}`

  return {
    id: record.id,
    shortCode: record.short_code,
    fullUrl: signedUrl || '',
    shortUrl,
    modelName,
    modelSize,
    viewerSettings: settings,
    createdAt: record.created_at,
    expiresAt: record.expires_at,
    expiry: getExpiryFromDate(record.expires_at),
    viewCount: record.view_count,
    isActive: !record.expires_at || new Date(record.expires_at) > new Date(),
  }
}

// Get expiry option from date
function getExpiryFromDate(expiresAt: string | null): LinkExpiry {
  if (!expiresAt) return 'never'
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (diff <= 60 * 60 * 1000) return '1h'
  if (diff <= 24 * 60 * 60 * 1000) return '24h'
  if (diff <= 7 * 24 * 60 * 60 * 1000) return '7d'
  return '30d'
}

/**
 * Hook for temporary link storage with Supabase
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
   * Check if temporary links are available
   */
  const isAvailable = isSupabaseConfigured

  /**
   * Create a temporary shareable link for a model
   */
  const createLink = useCallback(
    async (
      userId: string,
      request: CreateLinkRequest
    ): Promise<TemporaryLink | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      setState((s) => ({ ...s, isUploading: true, uploadProgress: 0, error: null }))

      try {
        // Generate unique file path and short code
        const shortCode = generateShortCode()
        const fileExt = request.modelName.split('.').pop() || 'glb'
        const filePath = `${userId}/${shortCode}.${fileExt}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, request.modelFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        setState((s) => ({ ...s, uploadProgress: 50 }))

        // Calculate expiry
        const expiresAt = getExpiryDate(request.expiry)

        // Create temporary link record
        const { data: linkRecord, error: dbError } = await (supabase
          .from('temporary_links') as any)
          .insert({
            user_id: userId,
            model_id: shortCode, // Using short code as model reference
            short_code: shortCode,
            expires_at: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 year for 'never'
            max_views: null,
            view_count: 0,
          })
          .select()
          .single()

        if (dbError) throw dbError

        setState((s) => ({ ...s, uploadProgress: 75 }))

        // Get signed URL for the file
        const expirySeconds = expiresAt
          ? Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
          : 365 * 24 * 60 * 60 // 1 year for 'never'

        const { data: urlData, error: urlError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(filePath, expirySeconds)

        if (urlError) throw urlError

        setState((s) => ({ ...s, uploadProgress: 100, isUploading: false }))

        const link = dbToTemporaryLink(
          linkRecord,
          urlData.signedUrl,
          request.modelName,
          request.modelFile instanceof File ? request.modelFile.size : 0,
          request.settings
        )

        // Add to local state
        setState((s) => ({ ...s, links: [link, ...s.links] }))

        return link
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create link'
        setState((s) => ({ ...s, error: message, isUploading: false, uploadProgress: 0 }))
        return null
      }
    },
    []
  )

  /**
   * Get a link by short code
   */
  const getLink = useCallback(
    async (shortCode: string): Promise<TemporaryLink | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        // Get link record
        const { data: linkRecord, error: dbError } = await (supabase
          .from('temporary_links') as any)
          .select('*')
          .eq('short_code', shortCode)
          .single()

        if (dbError) throw dbError

        // Check if expired
        if (linkRecord.expires_at && new Date(linkRecord.expires_at) < new Date()) {
          setState((s) => ({ ...s, isLoading: false, error: 'Link has expired' }))
          return null
        }

        // Increment view count
        await (supabase.from('temporary_links') as any)
          .update({ view_count: linkRecord.view_count + 1 })
          .eq('id', linkRecord.id)

        // Get signed URL
        const filePath = `${linkRecord.user_id}/${shortCode}.glb`
        const expirySeconds = linkRecord.expires_at
          ? Math.floor((new Date(linkRecord.expires_at).getTime() - Date.now()) / 1000)
          : 365 * 24 * 60 * 60

        const { data: urlData } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(filePath, Math.min(expirySeconds, 3600)) // Max 1 hour for viewing

        setState((s) => ({ ...s, isLoading: false }))

        return dbToTemporaryLink(
          linkRecord,
          urlData?.signedUrl || null,
          'Model',
          0,
          {
            autoplay: false,
            hideUI: false,
            backgroundColor: '#1a1a2e',
          }
        )
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get link'
        setState((s) => ({ ...s, error: message, isLoading: false }))
        return null
      }
    },
    []
  )

  /**
   * Delete a temporary link
   */
  const deleteLink = useCallback(
    async (userId: string, linkId: string, shortCode: string): Promise<boolean> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return false
      }

      try {
        // Delete from storage
        const filePath = `${userId}/${shortCode}.glb`
        await supabase.storage.from(STORAGE_BUCKET).remove([filePath])

        // Delete record
        const { error: dbError } = await (supabase
          .from('temporary_links') as any)
          .delete()
          .eq('id', linkId)

        if (dbError) throw dbError

        // Remove from local state
        setState((s) => ({
          ...s,
          links: s.links.filter((l) => l.id !== linkId),
        }))

        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete link'
        setState((s) => ({ ...s, error: message }))
        return false
      }
    },
    []
  )

  /**
   * List user's links
   */
  const listMyLinks = useCallback(
    async (userId: string): Promise<TemporaryLink[]> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return []
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        const { data: records, error: dbError } = await (supabase
          .from('temporary_links') as any)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (dbError) throw dbError

        const links: TemporaryLink[] = (records || []).map((record: DBTemporaryLink) =>
          dbToTemporaryLink(record, null, 'Model', 0, {
            autoplay: false,
            hideUI: false,
            backgroundColor: '#1a1a2e',
          })
        )

        setState((s) => ({ ...s, links, isLoading: false }))
        return links
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to list links'
        setState((s) => ({ ...s, error: message, isLoading: false }))
        return []
      }
    },
    []
  )

  /**
   * Extend link expiry
   */
  const extendExpiry = useCallback(
    async (linkId: string, newExpiry: LinkExpiry): Promise<TemporaryLink | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      try {
        const expiresAt = getExpiryDate(newExpiry)

        const { data: record, error: dbError } = await (supabase
          .from('temporary_links') as any)
          .update({ expires_at: expiresAt })
          .eq('id', linkId)
          .select()
          .single()

        if (dbError) throw dbError

        const link = dbToTemporaryLink(record, null, 'Model', 0, {
          autoplay: false,
          hideUI: false,
          backgroundColor: '#1a1a2e',
        })

        // Update local state
        setState((s) => ({
          ...s,
          links: s.links.map((l) => (l.id === linkId ? link : l)),
        }))

        return link
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to extend expiry'
        setState((s) => ({ ...s, error: message }))
        return null
      }
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
