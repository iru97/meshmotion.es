import { useMemo } from 'react'
import * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

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
 * Extract statistics from a GLTF model
 */
export function extractModelStats(gltf: GLTF | null): ModelStats | null {
  if (!gltf?.scene) return null

  let vertices = 0
  let triangles = 0
  let meshes = 0
  const materialsSet = new Set<THREE.Material>()
  const texturesSet = new Set<THREE.Texture>()
  let bones = 0

  gltf.scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      meshes++

      const geometry = object.geometry
      if (geometry) {
        // Count vertices
        if (geometry.attributes.position) {
          vertices += geometry.attributes.position.count
        }

        // Count triangles
        if (geometry.index) {
          triangles += geometry.index.count / 3
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

          // Collect textures from material
          if (mat instanceof THREE.MeshStandardMaterial) {
            if (mat.map) texturesSet.add(mat.map)
            if (mat.normalMap) texturesSet.add(mat.normalMap)
            if (mat.roughnessMap) texturesSet.add(mat.roughnessMap)
            if (mat.metalnessMap) texturesSet.add(mat.metalnessMap)
            if (mat.aoMap) texturesSet.add(mat.aoMap)
            if (mat.emissiveMap) texturesSet.add(mat.emissiveMap)
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

  return {
    vertices,
    triangles: Math.floor(triangles),
    meshes,
    materials: materialsSet.size,
    textures: texturesSet.size,
    bones,
    animations: gltf.animations?.length ?? 0,
    boundingBox: {
      width: size.x,
      height: size.y,
      depth: size.z,
    },
  }
}

/**
 * Hook to get model statistics
 */
export function useModelStats(gltf: GLTF | null): ModelStats | null {
  return useMemo(() => extractModelStats(gltf), [gltf])
}
