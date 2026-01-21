import { useCallback, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useViewerStore } from '@/lib/store/viewer-store'
import type { Measurement, MeasurementUnit } from '@/types/annotations'

/**
 * Unit conversion factors (to meters)
 */
const UNIT_FACTORS: Record<MeasurementUnit, number> = {
  m: 1,
  cm: 100,
  mm: 1000,
  in: 39.3701,
  ft: 3.28084,
}

/**
 * Convert distance from meters to specified unit
 */
export function convertDistance(meters: number, unit: MeasurementUnit): number {
  return meters * UNIT_FACTORS[unit]
}

/**
 * Format distance with unit
 */
export function formatDistance(meters: number, unit: MeasurementUnit): string {
  const value = convertDistance(meters, unit)
  const decimals = unit === 'mm' ? 0 : 2
  return `${value.toFixed(decimals)} ${unit}`
}

/**
 * Hook for measuring distances on 3D models
 */
export function useMeasurements() {
  const { camera, scene, raycaster, pointer } = useThree()
  const isMeasurementMode = useViewerStore((state) => state.isMeasurementMode)
  const measurementType = useViewerStore((state) => state.measurementType)
  const measurementUnit = useViewerStore((state) => state.measurementUnit)
  const addMeasurement = useViewerStore((state) => state.addMeasurement)

  // Temporary point for measurement in progress
  const [tempStartPoint, setTempStartPoint] = useState<[number, number, number] | null>(null)
  const lastClickTime = useRef(0)

  /**
   * Raycast to find intersection point on the model
   */
  const getIntersectionPoint = useCallback(() => {
    raycaster.setFromCamera(pointer, camera)

    const meshes: THREE.Mesh[] = []
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        meshes.push(object)
      }
    })

    const intersects = raycaster.intersectObjects(meshes, true)

    if (intersects.length > 0) {
      const hit = intersects[0]
      return hit.point.toArray() as [number, number, number]
    }

    return null
  }, [camera, scene, raycaster, pointer])

  /**
   * Calculate distance between two points
   */
  const calculateDistance = useCallback(
    (start: [number, number, number], end: [number, number, number]): number => {
      const startVec = new THREE.Vector3(...start)
      const endVec = new THREE.Vector3(...end)
      return startVec.distanceTo(endVec)
    },
    []
  )

  /**
   * Handle click for measurement placement
   */
  const handleMeasurementClick = useCallback(() => {
    if (!isMeasurementMode) return

    // Debounce clicks
    const now = Date.now()
    if (now - lastClickTime.current < 200) return
    lastClickTime.current = now

    const point = getIntersectionPoint()
    if (!point) return

    if (measurementType === 'distance') {
      if (!tempStartPoint) {
        // First click - set start point
        setTempStartPoint(point)
      } else {
        // Second click - complete measurement
        const distance = calculateDistance(tempStartPoint, point)

        const newMeasurement: Measurement = {
          id: `measurement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'distance',
          startPoint: tempStartPoint,
          endPoint: point,
          value: distance,
          unit: measurementUnit,
          visible: true,
          createdAt: Date.now(),
        }

        addMeasurement(newMeasurement)
        useViewerStore.getState().setSelectedMeasurement(newMeasurement.id)
        setTempStartPoint(null)
      }
    }
  }, [
    isMeasurementMode,
    measurementType,
    measurementUnit,
    tempStartPoint,
    getIntersectionPoint,
    calculateDistance,
    addMeasurement,
  ])

  /**
   * Cancel current measurement
   */
  const cancelMeasurement = useCallback(() => {
    setTempStartPoint(null)
  }, [])

  return {
    isMeasurementMode,
    tempStartPoint,
    handleMeasurementClick,
    cancelMeasurement,
    getIntersectionPoint,
    calculateDistance,
  }
}

/**
 * Generate a unique measurement ID
 */
export function generateMeasurementId(): string {
  return `measurement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
