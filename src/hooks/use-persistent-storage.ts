import { useEffect, useRef } from 'react'
import { indexedDBStorage } from '@/lib/storage/indexed-db'
import { useGLTFLoader } from './use-gltf-loader'

/**
 * Hook to load persisted files from IndexedDB on app start
 */
export function usePersistentStorage() {
  const { loadGLBFile } = useGLTFLoader()
  const hasLoaded = useRef(false)

  useEffect(() => {
    // Only load once on mount
    if (hasLoaded.current) return
    hasLoaded.current = true

    const loadPersistedFiles = async () => {
      try {
        const files = await indexedDBStorage.getAllFiles()

        if (files.length === 0) {
          return
        }

        // Separate meshes and animations
        const meshFiles = files.filter(f => f.type === 'mesh' || f.type === 'both')
        const animationFiles = files.filter(f => f.type === 'animations')

        // Load meshes first
        for (const storedFile of meshFiles) {
          try {
            const file = new File([storedFile.blob], storedFile.name, {
              type: 'model/gltf-binary',
            })

            // skipPersist=true to avoid re-saving already persisted files
            await loadGLBFile(file, storedFile.type, true)
          } catch (err) {
            console.error(`Failed to load persisted mesh ${storedFile.name}:`, err)
          }
        }

        // Then load animations
        for (const storedFile of animationFiles) {
          try {
            const file = new File([storedFile.blob], storedFile.name, {
              type: 'model/gltf-binary',
            })

            // skipPersist=true to avoid re-saving already persisted files
            await loadGLBFile(file, storedFile.type, true)
          } catch (err) {
            console.error(`Failed to load persisted animations ${storedFile.name}:`, err)
          }
        }
      } catch (err) {
        console.error('Error loading persisted files:', err)
      }
    }

    // Load after a small delay to let the app initialize
    setTimeout(loadPersistedFiles, 500)
  }, [loadGLBFile])
}
