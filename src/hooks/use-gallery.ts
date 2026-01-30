'use client'

import { useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { Model, Profile } from '@/lib/supabase/types'
import type {
  GalleryState,
  GalleryModel,
  UserProfile,
  Collection,
  SearchFilters,
  UploadModelRequest,
  CreateCollectionRequest,
  Comment,
} from '@/types/cloud'

const STORAGE_BUCKET = 'models'

// Convert DB Model to GalleryModel
function modelToGalleryModel(model: Model, profile: Profile | null): GalleryModel {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return {
    id: model.id,
    name: model.name,
    description: model.description || undefined,
    thumbnailUrl: model.thumbnail_path || '/placeholder-model.png',
    modelUrl: '', // Will be populated with signed URL when needed
    authorId: model.user_id,
    author: profile
      ? profileToUserProfile(profile)
      : {
          id: model.user_id,
          username: 'unknown',
          displayName: 'Unknown User',
          socialLinks: {},
          isVerified: false,
          isPro: false,
          createdAt: model.created_at,
          stats: { totalModels: 0, totalViews: 0, totalLikes: 0, followers: 0, following: 0 },
        },
    tags: model.tags || [],
    category: 'other',
    license: 'personal',
    viewCount: model.view_count,
    likeCount: 0,
    commentCount: 0,
    downloadCount: 0,
    isPublic: model.is_public,
    isFeatured: false,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
    stats: {
      vertices: 0,
      triangles: 0,
      materials: 0,
      textures: 0,
      animations: 0,
      fileSize: model.file_size,
    },
  }
}

// Convert DB Profile to UserProfile
function profileToUserProfile(profile: Profile): UserProfile {
  return {
    id: profile.id,
    username: profile.username || 'user',
    displayName: profile.display_name || profile.username || 'User',
    bio: profile.bio || undefined,
    avatarUrl: profile.avatar_url || undefined,
    socialLinks: {},
    isVerified: false,
    isPro: false,
    createdAt: profile.created_at,
    stats: {
      totalModels: 0,
      totalViews: 0,
      totalLikes: 0,
      followers: 0,
      following: 0,
    },
  }
}

/**
 * Hook for gallery and profile features with Supabase
 */
export function useGallery() {
  const [state, setState] = useState<GalleryState>({
    featuredModels: [],
    recentModels: [],
    popularModels: [],
    searchResults: [],
    currentModel: null,
    currentProfile: null,
    myProfile: null,
    myModels: [],
    myCollections: [],
    isLoading: false,
    error: null,
  })

  /**
   * Check if gallery features are available
   */
  const isAvailable = isSupabaseConfigured

  // ============================================
  // Model Operations
  // ============================================

  /**
   * Get featured models (most viewed public models)
   */
  const getFeatured = useCallback(async (): Promise<GalleryModel[]> => {
    if (!supabase) {
      setState((s) => ({ ...s, error: 'Supabase not configured' }))
      return []
    }

    setState((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const { data: models, error } = await (supabase
        .from('models') as any)
        .select('*')
        .eq('is_public', true)
        .order('view_count', { ascending: false })
        .limit(10)

      if (error) throw error

      const galleryModels = (models || []).map((m: Model) => modelToGalleryModel(m, null))

      setState((s) => ({
        ...s,
        isLoading: false,
        featuredModels: galleryModels,
      }))

      return galleryModels
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get featured models'
      setState((s) => ({ ...s, isLoading: false, error: message }))
      return []
    }
  }, [])

  /**
   * Get recent models
   */
  const getRecent = useCallback(
    async (page = 1, limit = 20): Promise<GalleryModel[]> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return []
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        const offset = (page - 1) * limit

        const { data: models, error } = await (supabase
          .from('models') as any)
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) throw error

        const galleryModels = (models || []).map((m: Model) => modelToGalleryModel(m, null))

        setState((s) => ({
          ...s,
          isLoading: false,
          recentModels: page === 1 ? galleryModels : [...s.recentModels, ...galleryModels],
        }))

        return galleryModels
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get recent models'
        setState((s) => ({ ...s, isLoading: false, error: message }))
        return []
      }
    },
    []
  )

  /**
   * Get popular models
   */
  const getPopular = useCallback(
    async (timeRange: 'day' | 'week' | 'month' | 'all' = 'week'): Promise<GalleryModel[]> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return []
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        // Calculate date filter based on time range
        let dateFilter: string | null = null
        const now = new Date()
        switch (timeRange) {
          case 'day':
            dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
            break
          case 'week':
            dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
            break
          case 'month':
            dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
            break
        }

        let query = (supabase.from('models') as any)
          .select('*')
          .eq('is_public', true)
          .order('view_count', { ascending: false })
          .limit(20)

        if (dateFilter) {
          query = query.gte('created_at', dateFilter)
        }

        const { data: models, error } = await query

        if (error) throw error

        const galleryModels = (models || []).map((m: Model) => modelToGalleryModel(m, null))

        setState((s) => ({
          ...s,
          isLoading: false,
          popularModels: galleryModels,
        }))

        return galleryModels
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get popular models'
        setState((s) => ({ ...s, isLoading: false, error: message }))
        return []
      }
    },
    []
  )

  /**
   * Get a single model by ID
   */
  const getModel = useCallback(async (id: string): Promise<GalleryModel | null> => {
    if (!supabase) {
      setState((s) => ({ ...s, error: 'Supabase not configured' }))
      return null
    }

    setState((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const { data: model, error } = await (supabase
        .from('models') as any)
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      // Increment view count
      await (supabase.from('models') as any)
        .update({ view_count: model.view_count + 1 })
        .eq('id', id)

      // Get author profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', model.user_id)
        .single()

      const galleryModel = modelToGalleryModel(model, profile)

      // Get signed URL for the model file
      const { data: urlData } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(model.file_path, 3600)

      if (urlData) {
        galleryModel.modelUrl = urlData.signedUrl
      }

      setState((s) => ({
        ...s,
        isLoading: false,
        currentModel: galleryModel,
      }))

      return galleryModel
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get model'
      setState((s) => ({ ...s, isLoading: false, error: message }))
      return null
    }
  }, [])

  /**
   * Search models
   */
  const searchModels = useCallback(
    async (query: string, filters?: SearchFilters): Promise<GalleryModel[]> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return []
      }

      if (!query.trim()) {
        setState((s) => ({ ...s, searchResults: [], error: null }))
        return []
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        // Search by name or tags
        const { data: models, error } = await (supabase
          .from('models') as any)
          .select('*')
          .eq('is_public', true)
          .or(`name.ilike.%${query}%,tags.cs.{${query}}`)
          .order('view_count', { ascending: false })
          .limit(50)

        if (error) throw error

        const galleryModels = (models || []).map((m: Model) => modelToGalleryModel(m, null))

        setState((s) => ({
          ...s,
          isLoading: false,
          searchResults: galleryModels,
        }))

        return galleryModels
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Search failed'
        setState((s) => ({ ...s, isLoading: false, error: message }))
        return []
      }
    },
    []
  )

  /**
   * Upload a model to gallery
   */
  const uploadModel = useCallback(
    async (userId: string, data: UploadModelRequest): Promise<GalleryModel | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        // Generate unique file path
        const fileExt = data.file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, data.file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        // Create model record
        const { data: model, error: dbError } = await (supabase
          .from('models') as any)
          .insert({
            user_id: userId,
            name: data.name,
            description: data.description || null,
            file_path: fileName,
            file_size: data.file.size,
            is_public: data.isPublic,
            tags: data.tags,
          })
          .select()
          .single()

        if (dbError) throw dbError

        const galleryModel = modelToGalleryModel(model, null)

        setState((s) => ({
          ...s,
          isLoading: false,
          myModels: [galleryModel, ...s.myModels],
        }))

        return galleryModel
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Upload failed'
        setState((s) => ({ ...s, isLoading: false, error: message }))
        return null
      }
    },
    []
  )

  /**
   * Get user's own models
   */
  const getMyModels = useCallback(
    async (userId: string): Promise<GalleryModel[]> => {
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

        const galleryModels = (models || []).map((m: Model) => modelToGalleryModel(m, null))

        setState((s) => ({
          ...s,
          isLoading: false,
          myModels: galleryModels,
        }))

        return galleryModels
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get models'
        setState((s) => ({ ...s, isLoading: false, error: message }))
        return []
      }
    },
    []
  )

  /**
   * Like a model (placeholder - would need likes table)
   */
  const likeModel = useCallback(async (id: string): Promise<void> => {
    setState((s) => ({
      ...s,
      error: 'Likes feature requires additional database setup',
    }))
  }, [])

  /**
   * Unlike a model (placeholder)
   */
  const unlikeModel = useCallback(async (id: string): Promise<void> => {
    // Would update state when likes table available
  }, [])

  // ============================================
  // Profile Operations
  // ============================================

  /**
   * Get a user profile by username
   */
  const getProfile = useCallback(async (username: string): Promise<UserProfile | null> => {
    if (!supabase) {
      setState((s) => ({ ...s, error: 'Supabase not configured' }))
      return null
    }

    setState((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const { data: profile, error } = await (supabase
        .from('profiles') as any)
        .select('*')
        .eq('username', username)
        .single()

      if (error) throw error

      const userProfile = profileToUserProfile(profile)

      // Get model count
      const { count } = await (supabase
        .from('models') as any)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('is_public', true)

      userProfile.stats.totalModels = count || 0

      setState((s) => ({
        ...s,
        isLoading: false,
        currentProfile: userProfile,
      }))

      return userProfile
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get profile'
      setState((s) => ({ ...s, isLoading: false, error: message }))
      return null
    }
  }, [])

  /**
   * Get current user's profile
   */
  const getMyProfile = useCallback(
    async (userId: string): Promise<UserProfile | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      setState((s) => ({ ...s, isLoading: true, error: null }))

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error

        const userProfile = profileToUserProfile(profile)

        setState((s) => ({
          ...s,
          isLoading: false,
          myProfile: userProfile,
        }))

        return userProfile
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get profile'
        setState((s) => ({ ...s, isLoading: false, error: message }))
        return null
      }
    },
    []
  )

  /**
   * Update profile
   */
  const updateProfile = useCallback(
    async (userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> => {
      if (!supabase) {
        setState((s) => ({ ...s, error: 'Supabase not configured' }))
        return null
      }

      try {
        const { data: profile, error } = await (supabase
          .from('profiles') as any)
          .update({
            username: data.username,
            display_name: data.displayName,
            bio: data.bio,
            avatar_url: data.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single()

        if (error) throw error

        const userProfile = profileToUserProfile(profile)

        setState((s) => ({
          ...s,
          myProfile: userProfile,
        }))

        return userProfile
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update profile'
        setState((s) => ({ ...s, error: message }))
        return null
      }
    },
    []
  )

  /**
   * Follow a user (placeholder - would need follows table)
   */
  const followUser = useCallback(async (userId: string): Promise<void> => {
    setState((s) => ({
      ...s,
      error: 'Follow feature requires additional database setup',
    }))
  }, [])

  /**
   * Unfollow a user (placeholder)
   */
  const unfollowUser = useCallback(async (userId: string): Promise<void> => {
    // Would update state when follows table available
  }, [])

  // ============================================
  // Collection Operations (Placeholder)
  // ============================================

  const createCollection = useCallback(
    async (data: CreateCollectionRequest): Promise<Collection | null> => {
      setState((s) => ({
        ...s,
        error: 'Collections require additional database setup',
      }))
      return null
    },
    []
  )

  const addToCollection = useCallback(
    async (collectionId: string, modelId: string): Promise<void> => {
      setState((s) => ({
        ...s,
        error: 'Collections require additional database setup',
      }))
    },
    []
  )

  const removeFromCollection = useCallback(
    async (collectionId: string, modelId: string): Promise<void> => {
      // Placeholder
    },
    []
  )

  // ============================================
  // Comment Operations (Placeholder)
  // ============================================

  const getComments = useCallback(async (modelId: string): Promise<Comment[]> => {
    return []
  }, [])

  const addComment = useCallback(
    async (modelId: string, content: string): Promise<Comment | null> => {
      setState((s) => ({
        ...s,
        error: 'Comments require additional database setup',
      }))
      return null
    },
    []
  )

  // ============================================
  // Utilities
  // ============================================

  const clearSearch = useCallback(() => {
    setState((s) => ({ ...s, searchResults: [], error: null }))
  }, [])

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }))
  }, [])

  return {
    ...state,
    isAvailable,
    // Models
    getFeatured,
    getRecent,
    getPopular,
    getModel,
    searchModels,
    uploadModel,
    getMyModels,
    likeModel,
    unlikeModel,
    // Profiles
    getProfile,
    getMyProfile,
    updateProfile,
    followUser,
    unfollowUser,
    // Collections
    createCollection,
    addToCollection,
    removeFromCollection,
    // Comments
    getComments,
    addComment,
    // Utilities
    clearSearch,
    clearError,
  }
}
