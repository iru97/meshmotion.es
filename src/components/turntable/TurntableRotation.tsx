'use client'

import { useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useViewerStore } from '@/lib/store/viewer-store'

/**
 * Component that handles turntable rotation inside the Canvas
 * Must be rendered as a child of Canvas
 *
 * Rotates the model around Y axis instead of the camera
 * Supports pause on hover/interaction
 */
export function TurntableRotation() {
  const turntableEnabled = useViewerStore((state) => state.turntableEnabled)
  const turntableSpeed = useViewerStore((state) => state.turntableSpeed)
  const turntablePausedByInteraction = useViewerStore((state) => state.turntablePausedByInteraction)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const setTurntablePausedByInteraction = useViewerStore((state) => state.setTurntablePausedByInteraction)

  const { gl } = useThree()

  // Handle mouse enter/leave for pause on hover
  const handleMouseEnter = useCallback(() => {
    if (turntableEnabled) {
      setTurntablePausedByInteraction(true)
    }
  }, [turntableEnabled, setTurntablePausedByInteraction])

  const handleMouseLeave = useCallback(() => {
    setTurntablePausedByInteraction(false)
  }, [setTurntablePausedByInteraction])

  // Setup event listeners for pause on hover
  useEffect(() => {
    const canvas = gl.domElement
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [gl.domElement, handleMouseEnter, handleMouseLeave])

  // Reset pause state when turntable is disabled
  useEffect(() => {
    if (!turntableEnabled) {
      setTurntablePausedByInteraction(false)
    }
  }, [turntableEnabled, setTurntablePausedByInteraction])

  useFrame((_, delta) => {
    // Don't rotate if turntable is disabled, paused by interaction, or no model
    if (!turntableEnabled || turntablePausedByInteraction || !currentCharacter?.scene) return

    // Rotate the model around Y axis
    const rotationSpeed = turntableSpeed * 0.5
    currentCharacter.scene.rotation.y += delta * rotationSpeed
  })

  return null
}
