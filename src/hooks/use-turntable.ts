import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useViewerStore } from '@/lib/store/viewer-store'
import * as THREE from 'three'

/**
 * Hook for turntable rotation animation
 * Rotates the camera around the scene center when enabled
 */
export function useTurntable() {
  const turntableEnabled = useViewerStore((state) => state.turntableEnabled)
  const turntableSpeed = useViewerStore((state) => state.turntableSpeed)
  const { camera, controls } = useThree()

  // Track if user is interacting with controls
  const isInteracting = useRef(false)
  const lastInteractionTime = useRef(0)

  // Pause turntable on interaction, resume after delay
  const handleInteractionStart = useCallback(() => {
    isInteracting.current = true
  }, [])

  const handleInteractionEnd = useCallback(() => {
    isInteracting.current = false
    lastInteractionTime.current = Date.now()
  }, [])

  useFrame((_, delta) => {
    if (!turntableEnabled) return
    if (isInteracting.current) return

    // Resume after 1 second of no interaction
    const timeSinceInteraction = Date.now() - lastInteractionTime.current
    if (timeSinceInteraction < 1000) return

    // Rotate camera around Y axis
    const rotationSpeed = turntableSpeed * 0.5 // Base speed adjustment
    const angle = delta * rotationSpeed

    // Get current camera position relative to origin
    const position = camera.position.clone()

    // Rotate around Y axis
    const axis = new THREE.Vector3(0, 1, 0)
    position.applyAxisAngle(axis, angle)

    // Update camera position
    camera.position.copy(position)

    // Make camera look at center
    camera.lookAt(0, 0, 0)

    // Update orbit controls target if available
    if (controls && 'target' in controls) {
      (controls as any).update()
    }
  })

  return {
    handleInteractionStart,
    handleInteractionEnd,
  }
}

/**
 * Speed presets for turntable rotation
 */
export const TURNTABLE_SPEED_PRESETS = {
  slow: 0.25,
  normal: 0.5,
  fast: 1,
  veryFast: 2,
} as const

export type TurntableSpeedPreset = keyof typeof TURNTABLE_SPEED_PRESETS
