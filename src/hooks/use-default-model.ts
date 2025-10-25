import { useEffect, useRef } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useGLTFLoader, type UploadOption } from './use-gltf-loader'

/**
 * Hook to load a default model on first load
 */
export function useDefaultModel() {
  const { loadGLBFile } = useGLTFLoader()
  const uploadedCharacters = useViewerStore((state) => state.uploadedCharacters)
  const hasLoadedDefault = useRef(false)

  useEffect(() => {
    // Wait a bit to allow persisted files to load first
    const timer = setTimeout(() => {
      // Only load default model if:
      // 1. No characters have been uploaded yet (including from persistence)
      // 2. We haven't already loaded the default
      if (uploadedCharacters.length === 0 && !hasLoadedDefault.current) {
        hasLoadedDefault.current = true

        // Load the default xbot character model (mesh only, no animations)
        fetch('/models/mixamo/characters/xbot.glb')
          .then((response) => response.blob())
          .then((blob) => {
            const file = new File([blob], 'xbot.glb', { type: 'model/gltf-binary' })
            // Force 'mesh' only to avoid loading broken animations
            // skipPersist=true to avoid saving default model to IndexedDB
            return loadGLBFile(file, 'mesh', true)
          })
          .catch((error) => {
            console.error('Error loading default model:', error)
          })
      }
    }, 1000) // Wait 1 second for persisted files to load

    return () => clearTimeout(timer)
  }, [uploadedCharacters.length, loadGLBFile])
}
