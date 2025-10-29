import * as THREE from 'three'

/**
 * Auto-scale and center a model to fit within a reasonable view
 * Target size: ~3 units (so model fits in [-1.5, 1.5] range approximately)
 */
export function normalizeModel(scene: THREE.Group | THREE.Object3D): void {
  // Calculate bounding box
  const box = new THREE.Box3().setFromObject(scene)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  // Get the largest dimension
  const maxDim = Math.max(size.x, size.y, size.z)

  // Target size is 3 units (model will be approximately 3 units tall/wide)
  const targetSize = 3
  const scale = maxDim > 0 ? targetSize / maxDim : 1

  // Reset position and scale
  scene.position.set(0, 0, 0)
  scene.scale.setScalar(scale)

  // Center the model
  // After scaling, recalculate the box
  const scaledBox = new THREE.Box3().setFromObject(scene)
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3())

  // Move model so its center is at origin, but keep it on the ground (y = 0)
  scene.position.x = -scaledCenter.x
  scene.position.z = -scaledCenter.z

  // Position bottom of model at y = 0
  scene.position.y = -scaledBox.min.y

}

/**
 * Get model bounding box info
 */
export function getModelInfo(scene: THREE.Group | THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(scene)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  return {
    boundingBox: box,
    size,
    center,
    maxDimension: Math.max(size.x, size.y, size.z),
  }
}
