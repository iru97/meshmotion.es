import { useState, useCallback } from 'react'
import type {
  CloudProvider,
  CloudProviderConfig,
  CloudFile,
  CloudStorageState,
  DEFAULT_CLOUD_STORAGE_STATE,
} from '@/types/cloud'

/**
 * Hook for cloud storage integration
 * Currently returns mock data - will connect to real API when backend is ready
 */
export function useCloudStorage() {
  const [state, setState] = useState<CloudStorageState>({
    providers: [
      { id: 'google-drive', name: 'Google Drive', icon: 'google', connected: false },
      { id: 'dropbox', name: 'Dropbox', icon: 'dropbox', connected: false },
      { id: 'onedrive', name: 'OneDrive', icon: 'microsoft', connected: false },
    ],
    currentProvider: null,
    currentFolder: null,
    files: [],
    isLoading: false,
    error: null,
    searchQuery: '',
  })

  /**
   * Connect to a cloud provider
   * TODO: Implement OAuth flow when backend is ready
   */
  const connect = useCallback(async (provider: CloudProvider): Promise<boolean> => {
    setState((s) => ({ ...s, isLoading: true, error: null }))

    // Mock: Show not available message
    setState((s) => ({
      ...s,
      isLoading: false,
      error: `Cloud storage integration requires backend. Coming soon!`,
    }))

    return false
  }, [])

  /**
   * Disconnect from a cloud provider
   */
  const disconnect = useCallback(async (provider: CloudProvider): Promise<void> => {
    setState((s) => ({
      ...s,
      providers: s.providers.map((p) =>
        p.id === provider ? { ...p, connected: false, email: undefined, quota: undefined } : p
      ),
      currentProvider: s.currentProvider === provider ? null : s.currentProvider,
      files: s.currentProvider === provider ? [] : s.files,
    }))
  }, [])

  /**
   * List files in a folder
   */
  const listFiles = useCallback(
    async (provider: CloudProvider, folderId?: string): Promise<CloudFile[]> => {
      setState((s) => ({ ...s, isLoading: true, error: null }))

      // Mock: Return empty array with message
      setState((s) => ({
        ...s,
        isLoading: false,
        files: [],
        error: 'Connect to a cloud provider to browse files',
      }))

      return []
    },
    []
  )

  /**
   * Upload a file to cloud storage
   */
  const uploadFile = useCallback(
    async (provider: CloudProvider, file: File, folderId?: string): Promise<CloudFile | null> => {
      setState((s) => ({ ...s, isLoading: true, error: null }))

      setState((s) => ({
        ...s,
        isLoading: false,
        error: 'Cloud upload requires backend integration. Coming soon!',
      }))

      return null
    },
    []
  )

  /**
   * Download a file from cloud storage
   */
  const downloadFile = useCallback(
    async (provider: CloudProvider, fileId: string): Promise<Blob | null> => {
      setState((s) => ({ ...s, isLoading: true, error: null }))

      setState((s) => ({
        ...s,
        isLoading: false,
        error: 'Cloud download requires backend integration. Coming soon!',
      }))

      return null
    },
    []
  )

  /**
   * Set current provider
   */
  const setCurrentProvider = useCallback((provider: CloudProvider | null) => {
    setState((s) => ({ ...s, currentProvider: provider }))
  }, [])

  /**
   * Set search query
   */
  const setSearchQuery = useCallback((query: string) => {
    setState((s) => ({ ...s, searchQuery: query }))
  }, [])

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }))
  }, [])

  /**
   * Check if cloud features are available
   */
  const isAvailable = false // Will be true when backend is ready

  return {
    ...state,
    isAvailable,
    connect,
    disconnect,
    listFiles,
    uploadFile,
    downloadFile,
    setCurrentProvider,
    setSearchQuery,
    clearError,
  }
}
