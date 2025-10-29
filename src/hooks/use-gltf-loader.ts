import { useCallback, useState } from 'react'
import * as THREE from 'three'
import { useViewerStore } from '@/lib/store/viewer-store'
import { analyzeGLB, validateGLBFile } from '@/lib/utils/glb-analyzer'
import { normalizeModel } from '@/lib/three/model-utils'
import { generateId } from '@/lib/utils'
import { GLTFLoader } from 'three-stdlib'
import type { GLTFModel, AnimationClipWithMetadata } from '@/types/viewer'
import { indexedDBStorage } from '@/lib/storage/indexed-db'
import { useFormatConverter } from './use-format-converter'
import type { ConversionProgress } from '@/types/conversion'

export type UploadOption = 'mesh' | 'animations' | 'both'

export function useGLTFLoader() {
  const addUploadedCharacter = useViewerStore((state) => state.addUploadedCharacter)
  const addUploadedAnimation = useViewerStore((state) => state.addUploadedAnimation)
  const setCharacter = useViewerStore((state) => state.setCharacter)
  const setAnimation = useViewerStore((state) => state.setAnimation)
  const setIsLoadingModel = useViewerStore((state) => state.setIsLoadingModel)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  // Format conversion hook
  const { detectFormat, convertFile } = useFormatConverter()
  const [conversionProgress, setConversionProgress] = useState<ConversionProgress | null>(null)

  const loadGLBFile = useCallback(
    async (
      file: File,
      uploadOption?: UploadOption,
      skipPersist = false // New parameter to skip saving to IndexedDB
    ): Promise<{ success: boolean; error?: string; model?: GLTFModel; needsSelection?: boolean; analysis?: any; conversionProgress?: ConversionProgress | null }> => {
      // Set loading state
      setIsLoadingModel(true)

      try {
        // Detect file format
        const detection = await detectFormat(file)

        // If conversion is needed, convert to GLB first
        let fileToLoad = file
        if (detection.needsConversion) {
          if (!detection.canConvert) {
            setIsLoadingModel(false)
            return { success: false, error: detection.error || 'Cannot convert this file format' }
          }

          console.log(`[GLTF Loader] Converting ${detection.format} to GLB...`)

          // Convert file to GLB
          const conversionResult = await convertFile(file, {
            preserveAnimations: true,
            preserveMaterials: true,
            preserveTextures: true,
            targetCoordinateSystem: 'y-up',
            optimizeGeometry: false,
          })

          if (!conversionResult.success || !conversionResult.data) {
            setIsLoadingModel(false)
            return { success: false, error: conversionResult.error || 'Conversion failed' }
          }

          // Create a new File object from the converted data
          const glbBlob = conversionResult.data instanceof Blob
            ? conversionResult.data
            : new Blob([conversionResult.data], { type: 'model/gltf-binary' })

          fileToLoad = new File([glbBlob], file.name.replace(/\.\w+$/, '.glb'), {
            type: 'model/gltf-binary',
          })

          console.log('[GLTF Loader] Conversion successful, loading GLB...')
        }

        // Validate file
        const validation = validateGLBFile(fileToLoad)
        if (!validation.valid) {
          return { success: false, error: validation.error }
        }

        // Analyze file structure (use the converted file if conversion happened)
        const analysis = await analyzeGLB(fileToLoad)

        // Check if user needs to choose import option
        const hasMesh = analysis.metadata.vertices > 0
        const hasAnimations = (analysis.metadata.animations ?? 0) > 0

        // If has both and no option selected yet, return and ask user
        if (!uploadOption && hasMesh && hasAnimations) {
          setIsLoadingModel(false)
          return {
            success: true,
            needsSelection: true,
            analysis,
          }
        }

        // Load the actual GLTF (use converted file if conversion happened)
        const loader = new GLTFLoader()
        const url = URL.createObjectURL(fileToLoad)

        const gltf = await loader.loadAsync(url)

        // Normalize model size and position (auto-scaling)
        normalizeModel(gltf.scene)

        // Determine what to import based on uploadOption or file type
        const shouldImportMesh = uploadOption === 'mesh' || uploadOption === 'both' || (!uploadOption && (analysis.type === 'character' || analysis.type === 'static'))
        const shouldImportAnimations = uploadOption === 'animations' || uploadOption === 'both' || (!uploadOption && analysis.type === 'animation')

        // Create model object - only include animations if we're importing them with the mesh
        const model: GLTFModel = {
          id: generateId(),
          name: file.name, // Keep original filename for display
          url,
          file: fileToLoad, // Use converted file if conversion happened
          gltf,
          scene: gltf.scene,
          animations: (uploadOption === 'mesh') ? [] : gltf.animations, // Empty if mesh-only
          skeleton: analysis.skeletonInfo ? extractSkeleton(gltf.scene) : undefined,
          metadata: {
            ...analysis.metadata,
            bones: analysis.skeletonInfo?.bones || [],
            size: file.size,
          },
        }

        // Import mesh if requested
        if (shouldImportMesh) {
          addUploadedCharacter(model)
          setCharacter(model)
        }

        // Import animations if requested
        if (shouldImportAnimations && gltf.animations.length > 0) {
          // Filter out invalid animations
          const validAnimations = gltf.animations.filter(
            (clip) => clip.duration > 0 && clip.tracks && clip.tracks.length > 0
          )

          if (validAnimations.length === 0) {
            console.warn('No valid animations found in file')
          } else {
            validAnimations.forEach((clip) => {
              const animData: AnimationClipWithMetadata = {
                id: generateId(),
                clip,
                name: clip.name || 'Unnamed Animation',
                characterId: currentCharacter?.id, // Associate with current character
                boneNames: extractBoneNamesFromClip(clip),
                duration: clip.duration,
                tracks: clip.tracks.length,
              }
              addUploadedAnimation(animData)
            })
            // Only auto-apply first animation if we have a character loaded
            if (currentCharacter || shouldImportMesh) {
              setAnimation(validAnimations[0])
            }
          }
        }

        // Save to IndexedDB for persistence (unless skipPersist is true)
        if (!skipPersist) {
          try {
            const blob = await file.arrayBuffer().then(buffer => new Blob([buffer], { type: 'model/gltf-binary' }))
            const fileType = uploadOption || (shouldImportMesh ? 'mesh' : 'animations')

            await indexedDBStorage.saveFile({
              id: model.id,
              name: file.name,
              blob,
              uploadedAt: Date.now(),
              type: fileType,
              // For animations, save which character they're associated with
              characterId: fileType === 'animations' ? currentCharacter?.id : undefined,

              // Enhanced metadata (Task 1.5)
              tags: [],
              lastModified: Date.now(),
              size: file.size,
              originalName: file.name,

              // 3D metadata from analysis
              vertices: analysis.metadata.vertices,
              triangles: analysis.metadata.triangles,
              bones: analysis.skeletonInfo?.bones || [],
              animations: analysis.metadata.animations,
            })
          } catch (err) {
            console.error('Failed to save file to IndexedDB:', err)
            // Don't fail the upload if storage fails
          }
        }

        // Clean up object URL after a delay to ensure it's loaded
        setTimeout(() => URL.revokeObjectURL(url), 1000)

        return { success: true, model }
      } catch (error) {
        console.error('Error loading GLB file:', error)
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to load GLB file',
        }
      } finally {
        // Always clear loading state
        setIsLoadingModel(false)
      }
    },
    [addUploadedCharacter, addUploadedAnimation, setCharacter, setAnimation, setIsLoadingModel, currentCharacter, detectFormat, convertFile]
  )

  return {
    loadGLBFile,
    conversionProgress,
  }
}

/**
 * Extract skeleton from scene
 */
function extractSkeleton(scene: THREE.Group): THREE.Skeleton | undefined {
  let skeleton: THREE.Skeleton | undefined

  scene.traverse((child) => {
    if (child instanceof THREE.SkinnedMesh && child.skeleton) {
      skeleton = child.skeleton
    }
  })

  return skeleton
}

/**
 * Extract bone names targeted by an animation clip
 */
function extractBoneNamesFromClip(clip: THREE.AnimationClip): string[] {
  const boneNames = new Set<string>()

  clip.tracks.forEach((track) => {
    // Track names format: "boneName.property" (e.g., "Hips.position")
    const boneName = track.name.split('.')[0]
    boneNames.add(boneName)
  })

  return Array.from(boneNames)
}
