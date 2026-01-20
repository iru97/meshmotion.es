'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useViewerStore } from '@/lib/store/viewer-store'
import * as THREE from 'three'

/**
 * Component that handles turntable rotation inside the Canvas
 * Must be rendered as a child of Canvas
 */
export function TurntableRotation() {
  const turntableEnabled = useViewerStore((state) => state.turntableEnabled)
  const turntableSpeed = useViewerStore((state) => state.turntableSpeed)
  const { camera } = useThree()

  // Track the pivot point (center of rotation)
  const pivotRef = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((_, delta) => {
    if (!turntableEnabled) return

    // Get current camera position
    const position = camera.position.clone()

    // Calculate position relative to pivot
    const relativePos = position.sub(pivotRef.current)

    // Rotate around Y axis
    const rotationSpeed = turntableSpeed * 0.5
    const angle = delta * rotationSpeed
    const axis = new THREE.Vector3(0, 1, 0)
    relativePos.applyAxisAngle(axis, angle)

    // Update camera position
    camera.position.copy(relativePos.add(pivotRef.current))

    // Make camera look at pivot point
    camera.lookAt(pivotRef.current)
  })

  return null
}
