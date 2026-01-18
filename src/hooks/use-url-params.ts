'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGLTFLoader } from './use-gltf-loader'

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
  /** Confirm and load the external file */
  confirmExternalLoad: () => Promise<void>
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
   * Confirm and load the external file
   */
  const confirmExternalLoad = useCallback(async () => {
    if (!pendingExternalFile) return

    setIsLoadingExternal(true)
    setExternalLoadError(null)

    try {
      // Fetch the external file
      const response = await fetch(pendingExternalFile.url, {
        mode: 'cors',
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      // Get the blob
      const blob = await response.blob()

      // Determine MIME type
      const mimeType = blob.type || 'model/gltf-binary'

      // Create File object
      const file = new File([blob], pendingExternalFile.fileName, { type: mimeType })

      // Load through existing pipeline (will handle conversion, storage, etc.)
      const result = await loadGLBFile(file)

      if (!result.success) {
        throw new Error(result.error || 'Failed to load model')
      }

      // Clear pending state on success
      setPendingExternalFile(null)

      // Clear the URL param after successful load (optional, keeps URL clean)
      // We don't modify history to avoid issues, but the file is now in storage
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to load external file'

      // Check for CORS errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setExternalLoadError(
          `CORS error: The server at ${pendingExternalFile.domain} does not allow cross-origin requests. Try downloading the file manually.`
        )
      } else {
        setExternalLoadError(message)
      }
    } finally {
      setIsLoadingExternal(false)
    }
  }, [pendingExternalFile, loadGLBFile])

  /**
   * Cancel the external load
   */
  const cancelExternalLoad = useCallback(() => {
    setPendingExternalFile(null)
    setExternalLoadError(null)
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setExternalLoadError(null)
  }, [])

  return {
    pendingExternalFile,
    isLoadingExternal,
    externalLoadError,
    confirmExternalLoad,
    cancelExternalLoad,
    clearError,
  }
}
