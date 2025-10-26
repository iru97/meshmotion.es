import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import type { GLTF } from 'three-stdlib'
import type { ModelType } from '@/types/viewer'

export interface GLBAnalysis {
  type: ModelType
  hasMesh: boolean
  hasSkeleton: boolean
  hasAnimation: boolean
  skeletonInfo?: SkeletonInfo
  animations: AnimationInfo[]
  metadata: GLBMetadata
}

export interface SkeletonInfo {
  bones: string[]
  rootBone: string
  boneCount: number
}

export interface AnimationInfo {
  name: string
  duration: number
  tracks: number
}

export interface GLBMetadata {
  vertices: number
  triangles: number
  materials: number
  textures: string[]
  animations?: number
}

/**
 * Analyzes a GLB file and extracts metadata
 */
export async function analyzeGLB(file: File): Promise<GLBAnalysis> {
  const loader = new GLTFLoader()
  const url = URL.createObjectURL(file)

  try {
    const gltf = await loader.loadAsync(url)

    // Analyze structure
    const hasMesh = hasAnyMesh(gltf.scene)
    const hasSkeleton = hasSkinnedMesh(gltf.scene)
    const hasAnimation = gltf.animations.length > 0

    // Extract skeleton info if present
    const skeletonInfo = hasSkeleton ? extractSkeletonInfo(gltf.scene) : undefined

    // Extract animation info
    const animations: AnimationInfo[] = gltf.animations.map((clip) => ({
      name: clip.name || 'Unnamed Animation',
      duration: clip.duration,
      tracks: clip.tracks.length,
    }))

    // Extract metadata
    const metadata = {
      ...extractMetadata(gltf.scene),
      animations: gltf.animations.length,
    }

    // Determine type
    let type: ModelType
    if (hasMesh && hasSkeleton) {
      type = 'character'
    } else if (hasAnimation && !hasMesh) {
      type = 'animation'
    } else {
      type = 'static'
    }

    return {
      type,
      hasMesh,
      hasSkeleton,
      hasAnimation,
      skeletonInfo,
      animations,
      metadata,
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Check if scene has any meshes
 */
function hasAnyMesh(scene: THREE.Group): boolean {
  let found = false
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
      found = true
    }
  })
  return found
}

/**
 * Check if scene has skinned meshes (skeleton)
 */
function hasSkinnedMesh(scene: THREE.Group): boolean {
  let found = false
  scene.traverse((child) => {
    if (child instanceof THREE.SkinnedMesh) {
      found = true
    }
  })
  return found
}

/**
 * Extract skeleton information from scene
 */
function extractSkeletonInfo(scene: THREE.Group): SkeletonInfo | undefined {
  let skeleton: THREE.Skeleton | undefined

  // Find first skeleton
  scene.traverse((child) => {
    if (child instanceof THREE.SkinnedMesh && child.skeleton) {
      skeleton = child.skeleton
    }
  })

  if (!skeleton) return undefined

  const bones = skeleton.bones.map((bone) => bone.name)
  const rootBone = skeleton.bones[0]?.name || 'Root'
  const boneCount = skeleton.bones.length

  return {
    bones,
    rootBone,
    boneCount,
  }
}

/**
 * Extract metadata about geometry, materials, and textures
 */
function extractMetadata(scene: THREE.Group): GLBMetadata {
  let vertices = 0
  let triangles = 0
  const materials = new Set<string>()
  const textures = new Set<string>()

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
      const geometry = child.geometry

      // Count vertices and triangles
      if (geometry.attributes.position) {
        vertices += geometry.attributes.position.count
      }
      if (geometry.index) {
        triangles += geometry.index.count / 3
      }

      // Track materials
      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => materials.add(mat.uuid))
      } else {
        materials.add(child.material.uuid)
      }

      // Track textures
      const material = Array.isArray(child.material)
        ? child.material[0]
        : child.material

      if (material instanceof THREE.MeshStandardMaterial) {
        if (material.map) textures.add(material.map.uuid)
        if (material.normalMap) textures.add(material.normalMap.uuid)
        if (material.roughnessMap) textures.add(material.roughnessMap.uuid)
        if (material.metalnessMap) textures.add(material.metalnessMap.uuid)
      }
    }
  })

  return {
    vertices,
    triangles: Math.floor(triangles),
    materials: materials.size,
    textures: Array.from(textures),
  }
}

/**
 * Validate file before analysis
 */
export function validateGLBFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validExtensions = ['.glb', '.gltf']
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))

  if (!validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file type. Expected ${validExtensions.join(' or ')}, got ${extension}`,
    }
  }

  // Check file size (50MB max)
  const MAX_SIZE = 50 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is 50MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    }
  }

  return { valid: true }
}
