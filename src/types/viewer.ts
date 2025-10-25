import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

export interface GLTFModel {
  id: string
  name: string
  url: string
  file?: File
  gltf: GLTF
  scene: THREE.Group
  animations: THREE.AnimationClip[]
  skeleton?: THREE.Skeleton
  metadata: ModelMetadata
}

export interface ModelMetadata {
  vertices: number
  triangles: number
  materials: number
  textures: string[]
  bones: string[]
  size: number
}

export type LightingPreset = 'studio' | 'soft' | 'dramatic' | 'outdoor' | 'custom'

export type MaterialPreset = 'textured' | 'clay' | 'wireframe' | 'xray' | 'pbr'

export type ModelType = 'character' | 'animation' | 'static'

export interface AnimationClipWithMetadata {
  id: string
  clip: THREE.AnimationClip
  name: string
  characterId?: string // ID of the character this animation is associated with
  boneNames: string[] // Bone names this animation targets
  duration: number
  tracks: number
}
