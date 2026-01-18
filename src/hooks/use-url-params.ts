'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGLTFLoader } from './use-gltf-loader'
import { fetchWithCorsDetection, fetchViaProxy } from '@/lib/utils/cors-fetch'

interface ExternalFileInfo {
  url: string
  fileName: string
  domain: string
  extension: string
}

interface UseURLParamsReturn {
  /** Pending external file to load (requires user consent) */
  pendingExternalFile: ExternalFileInfo | null
  /** Loading state while fetching external file */
  isLoadingExternal: boolean
  /** Error message if external load failed */
  externalLoadError: string | null
  /** Whether the current error is due to CORS blocking */
  isCorsBlocked: boolean
  /** Confirm and load the external file */
  confirmExternalLoad: () => Promise<void>
  /** Retry with CORS proxy */
  retryWithProxy: () => Promise<void>
  /** Cancel the external load */
  cancelExternalLoad: () => void
  /** Clear any error state */
  clearError: () => void
}

/**
 * Supported 3D file extensions
 */
const SUPPORTED_EXTENSIONS = ['glb', 'gltf', 'fbx', 'obj', 'dae', 'stl', 'ply', '3ds']

/**
 * Extract file info from URL
 */
function parseFileURL(url: string): ExternalFileInfo | null {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const fileName = pathname.split('/').pop() || 'model'
    const extension = fileName.split('.').pop()?.toLowerCase() || ''

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      return null
    }

    return {
      url,
      fileName,
      domain: urlObj.hostname,
      extension,
    }
  } catch {
    return null
  }
}

/**
 * Hook to handle URL query params for loading external 3D files
 *
 * Usage: ?file=https://example.com/model.glb
 *
 * Shows consent modal before downloading external resources.
 * Once downloaded, file is saved to IndexedDB like any other upload.
 */
export function useURLParams(): UseURLParamsReturn {
  const searchParams = useSearchParams()
  const { loadGLBFile } = useGLTFLoader()

  const [pendingExternalFile, setPendingExternalFile] = useState<ExternalFileInfo | null>(null)
  const [isLoadingExternal, setIsLoadingExternal] = useState(false)
  const [externalLoadError, setExternalLoadError] = useState<string | null>(null)
  const [isCorsBlocked, setIsCorsBlocked] = useState(false)

  // Track if we've already processed this URL to avoid re-triggering
  const processedURLRef = useRef<string | null>(null)

  // Parse URL params on mount
  useEffect(() => {
    const fileParam = searchParams.get('file')

    // Skip if no param or already processed this exact URL
    if (!fileParam || processedURLRef.current === fileParam) {
      return
    }

    // Parse and validate the URL
    const fileInfo = parseFileURL(fileParam)

    if (fileInfo) {
      setPendingExternalFile(fileInfo)
      processedURLRef.current = fileParam
    } else if (fileParam) {
      // Invalid URL or unsupported format
      setExternalLoadError(
        `Invalid file URL or unsupported format. Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`
      )
      processedURLRef.current = fileParam
    }
  }, [searchParams])

  /**
   * Load file from blob (shared logic for direct and proxy fetch)
   */
  const loadFromBlob = useCallback(async (blob: Blob, fileName: string): Promise<{ success: boolean; error?: string }> => {
    const mimeType = blob.type || 'model/gltf-binary'
    const file = new File([blob], fileName, { type: mimeType })

    let result = await loadGLBFile(file)

    // If file has both mesh and animations, auto-select "both"
    if (result.success && result.needsSelection) {
      result = await loadGLBFile(file, 'both')
    }

    return result
  }, [loadGLBFile])

  /**
   * Confirm and load the external file
   */
  const confirmExternalLoad = useCallback(async () => {
    if (!pendingExternalFile) return

    setIsLoadingExternal(true)
    setExternalLoadError(null)
    setIsCorsBlocked(false)

    try {
      // Try direct fetch first
      const fetchResult = await fetchWithCorsDetection(pendingExternalFile.url)

      if (!fetchResult.success) {
        if (fetchResult.corsBlocked) {
          // CORS blocked - offer proxy option
          setIsCorsBlocked(true)
          setExternalLoadError(
            `The server at ${pendingExternalFile.domain} blocks cross-origin requests (CORS). You can try loading through a proxy server.`
          )
          return
        }
        throw new Error(fetchResult.error || 'Failed to fetch file')
      }

      // Load the file
      const loadResult = await loadFromBlob(fetchResult.blob!, pendingExternalFile.fileName)

      if (!loadResult.success) {
        throw new Error(loadResult.error || 'Failed to load model')
      }

      // Clear pending state on success
      setPendingExternalFile(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load external file'
      setExternalLoadError(message)
    } finally {
      setIsLoadingExternal(false)
    }
  }, [pendingExternalFile, loadFromBlob])

  /**
   * Retry loading through CORS proxy
   */
  const retryWithProxy = useCallback(async () => {
    if (!pendingExternalFile) return

    setIsLoadingExternal(true)
    setExternalLoadError(null)
    setIsCorsBlocked(false)

    try {
      const fetchResult = await fetchViaProxy(pendingExternalFile.url)

      if (!fetchResult.success) {
        throw new Error(fetchResult.error || 'Proxy fetch failed')
      }

      // Load the file
      const loadResult = await loadFromBlob(fetchResult.blob!, pendingExternalFile.fileName)

      if (!loadResult.success) {
        throw new Error(loadResult.error || 'Failed to load model')
      }

      // Clear pending state on success
      setPendingExternalFile(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load through proxy'
      setExternalLoadError(message)
    } finally {
      setIsLoadingExternal(false)
    }
  }, [pendingExternalFile, loadFromBlob])

  /**
   * Cancel the external load
   */
  const cancelExternalLoad = useCallback(() => {
    setPendingExternalFile(null)
    setExternalLoadError(null)
    setIsCorsBlocked(false)
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setExternalLoadError(null)
    setIsCorsBlocked(false)
  }, [])

  return {
    pendingExternalFile,
    isLoadingExternal,
    externalLoadError,
    isCorsBlocked,
    confirmExternalLoad,
    retryWithProxy,
    cancelExternalLoad,
    clearError,
  }
}
