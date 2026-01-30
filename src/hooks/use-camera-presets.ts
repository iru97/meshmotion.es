import { useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export interface CameraPreset {
  id: string
  name: string
  position: [number, number, number]
  target: [number, number, number]
  icon: string
}

/**
 * Default camera presets for common viewing angles
 */
export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'front',
    name: 'Front',
    position: [0, 1.5, 8],
    target: [0, 1, 0],
    icon: '▣',
  },
  {
    id: 'back',
    name: 'Back',
    position: [0, 1.5, -8],
    target: [0, 1, 0],
    icon: '▢',
  },
  {
    id: 'left',
    name: 'Left',
    position: [-8, 1.5, 0],
    target: [0, 1, 0],
    icon: '◧',
  },
  {
    id: 'right',
    name: 'Right',
    position: [8, 1.5, 0],
    target: [0, 1, 0],
    icon: '◨',
  },
  {
    id: 'top',
    name: 'Top',
    position: [0, 10, 0.01],
    target: [0, 0, 0],
    icon: '△',
  },
  {
    id: 'bottom',
    name: 'Bottom',
    position: [0, -10, 0.01],
    target: [0, 0, 0],
    icon: '▽',
  },
  {
    id: 'iso-front',
    name: 'Iso Front',
    position: [5, 3, 8],
    target: [0, 1, 0],
    icon: '◰',
  },
  {
    id: 'iso-back',
    name: 'Iso Back',
    position: [-5, 3, -8],
    target: [0, 1, 0],
    icon: '◳',
  },
]

/**
 * Hook for managing camera presets
 */
export function useCameraPresets() {
  const { camera, controls } = useThree()

  /**
   * Animate camera to a preset position
   */
  const goToPreset = useCallback(
    (preset: CameraPreset, animate = true) => {
      const targetPosition = new THREE.Vector3(...preset.position)
      const targetLookAt = new THREE.Vector3(...preset.target)

      if (animate) {
        // Simple linear interpolation animation
        const startPosition = camera.position.clone()
        const duration = 500 // ms
        const startTime = Date.now()

        const animateCamera = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3)

          camera.position.lerpVectors(startPosition, targetPosition, eased)
          camera.lookAt(targetLookAt)

          // Update orbit controls target if available
          if (controls && 'target' in controls) {
            const orbitControls = controls as any
            orbitControls.target.copy(targetLookAt)
            orbitControls.update()
          }

          if (progress < 1) {
            requestAnimationFrame(animateCamera)
          }
        }

        animateCamera()
      } else {
        camera.position.copy(targetPosition)
        camera.lookAt(targetLookAt)

        if (controls && 'target' in controls) {
          const orbitControls = controls as any
          orbitControls.target.copy(targetLookAt)
          orbitControls.update()
        }
      }
    },
    [camera, controls]
  )

  /**
   * Get the current camera position as a custom preset
   */
  const getCurrentAsPreset = useCallback((): CameraPreset => {
    const target = controls && 'target' in controls
      ? (controls as any).target.clone()
      : new THREE.Vector3(0, 0, 0)

    return {
      id: 'custom',
      name: 'Current View',
      position: [camera.position.x, camera.position.y, camera.position.z],
      target: [target.x, target.y, target.z],
      icon: '◉',
    }
  }, [camera, controls])

  /**
   * Focus camera on a specific position with a good viewing distance
   */
  const focusOnPosition = useCallback(
    (position: [number, number, number], animate = true) => {
      const targetPoint = new THREE.Vector3(...position)

      // Calculate camera position - offset from the target point
      // Position camera at a distance looking towards the point
      const currentDirection = camera.position.clone().sub(targetPoint).normalize()
      const distance = 3 // Distance from the annotation
      const cameraPos = targetPoint.clone().add(currentDirection.multiplyScalar(distance))

      // Ensure camera doesn't go below ground
      if (cameraPos.y < 0.5) {
        cameraPos.y = 0.5
      }

      if (animate) {
        const startPosition = camera.position.clone()
        const startTarget = controls && 'target' in controls
          ? (controls as any).target.clone()
          : new THREE.Vector3(0, 0, 0)
        const duration = 500 // ms
        const startTime = Date.now()

        const animateCamera = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3)

          camera.position.lerpVectors(startPosition, cameraPos, eased)

          // Update orbit controls target if available
          if (controls && 'target' in controls) {
            const orbitControls = controls as any
            orbitControls.target.lerpVectors(startTarget, targetPoint, eased)
            orbitControls.update()
          }

          if (progress < 1) {
            requestAnimationFrame(animateCamera)
          }
        }

        animateCamera()
      } else {
        camera.position.copy(cameraPos)
        camera.lookAt(targetPoint)

        if (controls && 'target' in controls) {
          const orbitControls = controls as any
          orbitControls.target.copy(targetPoint)
          orbitControls.update()
        }
      }
    },
    [camera, controls]
  )

  return {
    presets: CAMERA_PRESETS,
    goToPreset,
    getCurrentAsPreset,
    focusOnPosition,
  }
}
