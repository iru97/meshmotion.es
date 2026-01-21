import { useMemo } from 'react'
import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

export interface TextureInfo {
  name: string
  type: string
  width: number
  height: number
  format: string
  size: number // estimated bytes
}

export interface ModelStats {
  vertices: number
  triangles: number
  meshes: number
  materials: number
  textures: number
  bones: number
  animations: number
  boundingBox: {
    width: number
    height: number
    depth: number
  }
  fileSize?: number
  // Extended stats
  textureDetails: TextureInfo[]
  totalTextureMemory: number
  estimatedMemory: number // Total estimated GPU memory usage
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toLocaleString()
}

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Format dimension in meters to appropriate unit
 */
export function formatDimension(meters: number): string {
  if (meters >= 1) {
    return `${meters.toFixed(2)}m`
  }
  if (meters >= 0.01) {
    return `${(meters * 100).toFixed(1)}cm`
  }
  return `${(meters * 1000).toFixed(1)}mm`
}

/**
 * Get texture type name from material property
 */
function getTextureTypeName(texture: THREE.Texture, mat: THREE.MeshStandardMaterial): string {
  if (texture === mat.map) return 'Diffuse'
  if (texture === mat.normalMap) return 'Normal'
  if (texture === mat.roughnessMap) return 'Roughness'
  if (texture === mat.metalnessMap) return 'Metalness'
  if (texture === mat.aoMap) return 'AO'
  if (texture === mat.emissiveMap) return 'Emissive'
  return 'Other'
}

/**
 * Estimate texture memory size in bytes
 * Format: RGB = 3 bytes/pixel, RGBA = 4 bytes/pixel
 * GPU typically stores with mipmaps (~1.33x base size)
 */
function estimateTextureMemory(texture: THREE.Texture): number {
  const image = texture.image
  if (!image) return 0

  const width = image.width || 0
  const height = image.height || 0
  const bytesPerPixel = 4 // Assume RGBA
  const baseSize = width * height * bytesPerPixel
  const withMipmaps = baseSize * 1.33 // Mipmaps add ~33%

  return Math.ceil(withMipmaps)
}

/**
 * Extract statistics from a GLTF model
 */
export function extractModelStats(gltf: GLTF | null): ModelStats | null {
  if (!gltf?.scene) return null

  let vertices = 0
  let triangles = 0
  let meshes = 0
  let geometryMemory = 0
  const materialsSet = new Set<THREE.Material>()
  const texturesMap = new Map<THREE.Texture, { type: string; mat: THREE.MeshStandardMaterial }>()
  let bones = 0

  gltf.scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      meshes++

      const geometry = object.geometry
      if (geometry) {
        // Count vertices
        if (geometry.attributes.position) {
          vertices += geometry.attributes.position.count

          // Estimate geometry memory (position + normal + uv = ~32 bytes per vertex)
          geometryMemory += geometry.attributes.position.count * 32
        }

        // Count triangles and add index buffer memory
        if (geometry.index) {
          triangles += geometry.index.count / 3
          geometryMemory += geometry.index.count * 4 // 4 bytes per index
        } else if (geometry.attributes.position) {
          triangles += geometry.attributes.position.count / 3
        }
      }

      // Collect materials
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      materials.forEach((mat) => {
        if (mat) {
          materialsSet.add(mat)

          // Collect textures from material with type info
          if (mat instanceof THREE.MeshStandardMaterial) {
            const addTexture = (tex: THREE.Texture | null) => {
              if (tex && !texturesMap.has(tex)) {
                texturesMap.set(tex, { type: getTextureTypeName(tex, mat), mat })
              }
            }
            addTexture(mat.map)
            addTexture(mat.normalMap)
            addTexture(mat.roughnessMap)
            addTexture(mat.metalnessMap)
            addTexture(mat.aoMap)
            addTexture(mat.emissiveMap)
          }
        }
      })
    }

    if (object instanceof THREE.SkinnedMesh && object.skeleton) {
      bones += object.skeleton.bones.length
    }
  })

  // Calculate bounding box
  const boundingBox = new THREE.Box3().setFromObject(gltf.scene)
  const size = new THREE.Vector3()
  boundingBox.getSize(size)

  // Build texture details
  const textureDetails: TextureInfo[] = []
  let totalTextureMemory = 0

  texturesMap.forEach((info, texture) => {
    const image = texture.image
    const width = image?.width || 0
    const height = image?.height || 0
    const memSize = estimateTextureMemory(texture)
    totalTextureMemory += memSize

    textureDetails.push({
      name: texture.name || `Texture ${textureDetails.length + 1}`,
      type: info.type,
      width,
      height,
      format: texture.format === THREE.RGBAFormat ? 'RGBA' : 'RGB',
      size: memSize,
    })
  })

  // Sort by size descending
  textureDetails.sort((a, b) => b.size - a.size)

  // Total estimated GPU memory
  const estimatedMemory = geometryMemory + totalTextureMemory

  return {
    vertices,
    triangles: Math.floor(triangles),
    meshes,
    materials: materialsSet.size,
    textures: texturesMap.size,
    bones,
    animations: gltf.animations?.length ?? 0,
    boundingBox: {
      width: size.x,
      height: size.y,
      depth: size.z,
    },
    textureDetails,
    totalTextureMemory,
    estimatedMemory,
  }
}

/**
 * Hook to get model statistics
 */
export function useModelStats(gltf: GLTF | null): ModelStats | null {
  return useMemo(() => extractModelStats(gltf), [gltf])
}
