import * as THREE from 'three'
import type { MaterialPreset } from '@/types/viewer'

export interface MaterialPresetConfig {
  name: string
  description: string
  apply: (object: THREE.Object3D) => void
  restore: (object: THREE.Object3D) => void
}

// Store original materials for restoration
const originalMaterials = new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>()

export const materialPresets: Record<MaterialPreset, MaterialPresetConfig> = {
  textured: {
    name: 'Textured',
    description: 'Original model materials and textures',
    apply: (object: THREE.Object3D) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
          const original = originalMaterials.get(child)
          if (original) {
            child.material = original
          }
        }
      })
    },
    restore: (object: THREE.Object3D) => {
      // Store originals
      object.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
          if (!originalMaterials.has(child)) {
            originalMaterials.set(child, child.material)
          }
        }
      })
    },
  },

  clay: {
    name: 'Clay',
    description: 'Uniform clay material for form study',
    apply: (object: THREE.Object3D) => {
      const clayMaterial = new THREE.MeshStandardMaterial({
        color: '#cccccc',
        roughness: 1,
        metalness: 0,
      })

      object.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
          // Store original if not stored
          if (!originalMaterials.has(child)) {
            originalMaterials.set(child, child.material)
          }
          child.material = clayMaterial
        }
      })
    },
    restore: (object: THREE.Object3D) => {}, // Handled by textured preset
  },

  wireframe: {
    name: 'Wireframe',
    description: 'Show topology and mesh structure',
    apply: (object: THREE.Object3D) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
          // Store original
          if (!originalMaterials.has(child)) {
            originalMaterials.set(child, child.material)
          }

          // Apply wireframe
          if (Array.isArray(child.material)) {
            child.material = child.material.map(
              (mat) =>
                new THREE.MeshBasicMaterial({
                  color: '#00ff00',
                  wireframe: true,
                })
            )
          } else {
            child.material = new THREE.MeshBasicMaterial({
              color: '#00ff00',
              wireframe: true,
            })
          }
        }
      })
    },
    restore: (object: THREE.Object3D) => {},
  },

  xray: {
    name: 'X-Ray',
    description: 'Transparent view to see skeleton',
    apply: (object: THREE.Object3D) => {
      const xrayMaterial = new THREE.MeshBasicMaterial({
        color: '#00ffff',
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      })

      object.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
          if (!originalMaterials.has(child)) {
            originalMaterials.set(child, child.material)
          }
          child.material = xrayMaterial
        }
      })
    },
    restore: (object: THREE.Object3D) => {},
  },

  pbr: {
    name: 'PBR',
    description: 'Physically-based rendering with metallic look',
    apply: (object: THREE.Object3D) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
          if (!originalMaterials.has(child)) {
            originalMaterials.set(child, child.material)
          }

          // Convert to PBR material
          const pbrMaterial = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 0.8,
            roughness: 0.2,
          })

          child.material = pbrMaterial
        }
      })
    },
    restore: (object: THREE.Object3D) => {},
  },
}

/**
 * Apply a material preset to an object
 */
export function applyMaterialPreset(
  object: THREE.Object3D,
  preset: MaterialPreset
) {
  const config = materialPresets[preset]

  // First, ensure we have originals stored
  materialPresets.textured.restore(object)

  // Then apply the preset
  config.apply(object)
}

/**
 * Get the original material for a mesh from the WeakMap
 * Used for cloning with original materials
 */
export function getOriginalMaterial(mesh: THREE.Mesh | THREE.SkinnedMesh): THREE.Material | THREE.Material[] | undefined {
  return originalMaterials.get(mesh)
}

/**
 * Clone an object's materials from another object's stored originals
 * This is useful for cloning models with their original textures
 */
export function cloneWithOriginalMaterials(
  source: THREE.Object3D,
  target: THREE.Object3D
) {
  const sourceMeshes: (THREE.Mesh | THREE.SkinnedMesh)[] = []
  const targetMeshes: (THREE.Mesh | THREE.SkinnedMesh)[] = []

  // Collect meshes from both objects in the same order
  source.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
      sourceMeshes.push(child)
    }
  })

  target.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
      targetMeshes.push(child)
    }
  })

  // Clone original materials from source to target
  for (let i = 0; i < Math.min(sourceMeshes.length, targetMeshes.length); i++) {
    const sourceMesh = sourceMeshes[i]
    const targetMesh = targetMeshes[i]

    const originalMaterial = originalMaterials.get(sourceMesh)

    if (originalMaterial) {
      // Clone the original material
      if (Array.isArray(originalMaterial)) {
        const clonedMaterials = originalMaterial.map((mat) => mat.clone())
        targetMesh.material = clonedMaterials
        originalMaterials.set(targetMesh, clonedMaterials)
      } else {
        const clonedMaterial = originalMaterial.clone()
        targetMesh.material = clonedMaterial
        originalMaterials.set(targetMesh, clonedMaterial)
      }
    } else {
      // If no original exists, store current as original
      originalMaterials.set(targetMesh, targetMesh.material)
    }
  }
}
