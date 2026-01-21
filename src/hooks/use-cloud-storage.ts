'use client'

import { useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Model } from '@/lib/supabase/types'

const STORAGE_BUCKET = 'models'

interface CloudFile {
  id: string
  name: string
  size: number
  type: 'model' | 'thumbnail'
  path: string
  url: string | null
  createdAt: string
  isPublic: boolean
}

interface CloudStorageState {
  files: CloudFile[]
  isLoading: boolean
  error: string | null
  uploadProgress: number
}

/**
 * Hook for cloud storage integration with Supabase
 */
export function useCloudStorage() {
  const [state, setState] = useState<CloudStorageState>({
    files: [],
    isLoading: false,
    error: null,
    uploadProgress: 0,
  })

  /**
   * Check if storage is available
   */
  const isAvailable = isSupabaseConfigured

  /**
   * List user's uploaded models
   */
  const listFiles = useCallback(async (userId: string): Promise<CloudFile[]> => {
    if (!supabase) {
      setState((s) => ({ ...s, error: 'Supabase not configured' }))
      return []
    }

    setState((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const { data: models, error } = await (supabase
        .from('models') as any)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const files: CloudFile[] = (models || []).map((model: Model) => ({
        id: model.id,
        name: model.name,
        size: model.file_size,
        type: 'model' as const,
        path: model.file_path,
        url: null, // Will be fetched on demand
        createdAt: model.created_at,
        isPublic: model.is_public,
      }))

      setState((s) => ({ ...s, files, isLoading: false }))
      return files
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to list files'
      setState((s) => ({ ...s, error: message, isLoading: false }))
      return []
    }
  }, [])

  /**
   * Upload a model file to Supabase Storage
   */
  const uploadFile = useCallback(
    async (
      userId: string,
      file: File,
      options: { name?: string; description?: string; isPublic?: boolean } = {}
    ): Promise<CloudFile | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      setState((s) => ({ ...s, isLoading: true, error: null, uploadProgress: 0 }))

      try {
        // Generate unique file path
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        setState((s) => ({ ...s, uploadProgress: 50 }))

        // Create model record
        const { data: model, error: dbError } = await (supabase
          .from('models') as any)
          .insert({
            user_id: userId,
            name: options.name || file.name.replace(/\.[^/.]+$/, ''),
            description: options.description || null,
            file_path: fileName,
            file_size: file.size,
            is_public: options.isPublic ?? false,
            tags: [],
          })
          .select()
          .single()

        if (dbError) throw dbError

        setState((s) => ({ ...s, uploadProgress: 100, isLoading: false }))

        const cloudFile: CloudFile = {
          id: model.id,
          name: model.name,
          size: model.file_size,
          type: 'model',
          path: model.file_path,
          url: null,
          createdAt: model.created_at,
          isPublic: model.is_public,
        }

        // Add to local state
        setState((s) => ({ ...s, files: [cloudFile, ...s.files] }))

        return cloudFile
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed'
        setState((s) => ({ ...s, error: message, isLoading: false, uploadProgress: 0 }))
        return null
      }
    },
    []
  )

  /**
   * Get download URL for a file
   */
  const getDownloadUrl = useCallback(
    async (filePath: string, expiresIn = 3600): Promise<string | null> => {
      if (!supabase) return null

      try {
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .createSignedUrl(filePath, expiresIn)

        if (error) throw error
        return data.signedUrl
      } catch (error) {
        console.error('Failed to get download URL:', error)
        return null
      }
    },
    []
  )

  /**
   * Download a file as Blob
   */
  const downloadFile = useCallback(
    async (filePath: string): Promise<Blob | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        const { data, error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .download(filePath)

        if (error) throw error

        setState((s) => ({ ...s, isLoading: false }))
        return data
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Download failed'
        setState((s) => ({ ...s, error: message, isLoading: false }))
        return null
      }
    },
    []
  )

  /**
   * Delete a model and its file
   */
  const deleteFile = useCallback(
    async (modelId: string, filePath: string): Promise<boolean> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return false
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([filePath])

        if (storageError) throw storageError

        // Delete model record
        const { error: dbError } = await (supabase
          .from('models') as any)
          .delete()
          .eq('id', modelId)

        if (dbError) throw dbError

        // Remove from local state
        setState((s) => ({
          ...s,
          files: s.files.filter((f) => f.id !== modelId),
          isLoading: false,
        }))

        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Delete failed'
        setState((s) => ({ ...s, error: message, isLoading: false }))
        return false
      }
    },
    []
  )

  /**
   * Update model metadata
   */
  const updateModel = useCallback(
    async (
      modelId: string,
      updates: { name?: string; description?: string; isPublic?: boolean; tags?: string[] }
    ): Promise<boolean> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return false
      }

      try {
        const { error } = await (supabase
          .from('models') as any)
          .update({
            name: updates.name,
            description: updates.description,
            is_public: updates.isPublic,
            tags: updates.tags,
            updated_at: new Date().toISOString(),
          })
          .eq('id', modelId)

        if (error) throw error

        // Update local state
        setState((s) => ({
          ...s,
          files: s.files.map((f) =>
            f.id === modelId
              ? { ...f, name: updates.name ?? f.name, isPublic: updates.isPublic ?? f.isPublic }
              : f
          ),
        }))

        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Update failed'
        setState((s) => ({ ...s, error: message }))
        return false
      }
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
    listFiles,
    uploadFile,
    downloadFile,
    getDownloadUrl,
    deleteFile,
    updateModel,
    clearError,
  }
}
