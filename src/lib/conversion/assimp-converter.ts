/**
 * Assimp.js Converter
 * Handles conversion from various 3D formats to GLB using assimpjs (WebAssembly)
 */

import type { ConversionOptions, ConversionProgress, ConversionResult } from '@/types/conversion'

// Lazy-loaded assimpjs instance
let assimpInstance: any = null

/**
 * Initialize assimpjs (loads WebAssembly module)
 * This is lazy-loaded to avoid bundling 5MB WASM in main bundle
 */
async function initAssimp(onProgress?: (progress: ConversionProgress) => void): Promise<any> {
  if (assimpInstance) {
    return assimpInstance
  }

  try {
    onProgress?.({
      stage: 'loading-wasm',
      progress: 0,
      message: 'Loading conversion engine...',
    })

    // Dynamically import assimpjs to enable code splitting
    const assimpjs = await import('assimpjs')

    onProgress?.({
      stage: 'loading-wasm',
      progress: 50,
      message: 'Initializing WebAssembly...',
    })

    // Initialize the library
    assimpInstance = await assimpjs.default()

    onProgress?.({
      stage: 'loading-wasm',
      progress: 100,
      message: 'Conversion engine ready',
    })

    return assimpInstance
  } catch (error) {
    console.error('[AssimpConverter] Failed to initialize assimpjs:', error)
    throw new Error('Failed to load 3D conversion engine. Your browser may not support WebAssembly.')
  }
}

/**
 * Convert a file to GLB format using assimpjs
 */
export async function convertToGLB(
  file: File,
  options: ConversionOptions = {
    preserveAnimations: true,
    preserveMaterials: true,
    preserveTextures: true,
    targetCoordinateSystem: 'y-up',
    optimizeGeometry: false,
  },
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConversionResult> {
  try {
    // Initialize assimpjs
    const assimp = await initAssimp(onProgress)

    onProgress?.({
      stage: 'parsing',
      progress: 0,
      message: `Reading ${file.name}...`,
    })

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer()

    onProgress?.({
      stage: 'parsing',
      progress: 50,
      message: 'Parsing 3D model...',
    })

    // Get file extension
    const extension = file.name.split('.').pop()?.toLowerCase() || ''

    onProgress?.({
      stage: 'converting',
      progress: 0,
      message: 'Converting to GLB format...',
    })

    // Convert using assimpjs
    // Note: assimpjs API may vary - this is based on typical usage
    const result = assimp.convertFileToGlb(
      fileBuffer,
      extension,
      {
        // Assimp processing flags
        CalcTangentSpace: true,
        Triangulate: true,
        JoinIdenticalVertices: true,
        SortByPType: true,
        // Preserve animations
        ...(options.preserveAnimations ? {} : { RemoveAnimations: true }),
        // Optimize geometry
        ...(options.optimizeGeometry
          ? {
              ImproveCacheLocality: true,
              OptimizeMeshes: true,
              OptimizeGraph: true,
            }
          : {}),
      }
    )

    if (!result || !result.buffer) {
      return {
        success: false,
        error: 'Conversion failed: No output generated',
      }
    }

    onProgress?.({
      stage: 'converting',
      progress: 100,
      message: 'Conversion complete',
    })

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Successfully converted to GLB',
    })

    // Return the GLB data
    return {
      success: true,
      data: result.buffer,
      warnings: result.warnings || [],
    }
  } catch (error) {
    console.error('[AssimpConverter] Conversion error:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown conversion error',
    }
  }
}

/**
 * Check if assimpjs is already loaded
 */
export function isAssimpLoaded(): boolean {
  return assimpInstance !== null
}

/**
 * Cleanup assimpjs instance (free memory)
 */
export function cleanupAssimp(): void {
  assimpInstance = null
}

/**
 * Get estimated conversion time based on file size
 */
export function getEstimatedConversionTime(fileSizeBytes: number): number {
  // Rough estimates based on file size (in seconds)
  const sizeMB = fileSizeBytes / (1024 * 1024)

  if (sizeMB < 1) return 1
  if (sizeMB < 5) return 3
  if (sizeMB < 10) return 5
  if (sizeMB < 20) return 8
  return 12
}
