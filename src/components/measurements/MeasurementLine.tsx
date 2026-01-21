'use client'

import { useMemo } from 'react'
import { Line, Html } from '@react-three/drei'
import { useViewerStore } from '@/lib/store/viewer-store'
import { cn } from '@/lib/utils'
import { formatDistance } from '@/hooks/use-measurements'
import type { Measurement } from '@/types/annotations'
import * as THREE from 'three'

interface MeasurementLineProps {
  measurement: Measurement
}

/**
 * 3D measurement line with distance label
 */
export function MeasurementLine({ measurement }: MeasurementLineProps) {
  const selectedMeasurementId = useViewerStore((state) => state.selectedMeasurementId)
  const setSelectedMeasurement = useViewerStore((state) => state.setSelectedMeasurement)
  const showMeasurements = useViewerStore((state) => state.showMeasurements)

  const isSelected = selectedMeasurementId === measurement.id

  // Calculate midpoint for label placement
  const midpoint = useMemo(() => {
    const start = new THREE.Vector3(...measurement.startPoint)
    const end = new THREE.Vector3(...measurement.endPoint)
    return start.add(end).divideScalar(2).toArray() as [number, number, number]
  }, [measurement.startPoint, measurement.endPoint])

  if (!measurement.visible || !showMeasurements) return null

  const handleClick = () => {
    setSelectedMeasurement(isSelected ? null : measurement.id)
  }

  return (
    <group>
      {/* Measurement Line */}
      <Line
        points={[measurement.startPoint, measurement.endPoint]}
        color={isSelected ? '#3b82f6' : '#22c55e'}
        lineWidth={isSelected ? 3 : 2}
        onClick={handleClick}
      />

      {/* Start Point Marker */}
      <mesh position={measurement.startPoint} onClick={handleClick}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#3b82f6' : '#22c55e'} />
      </mesh>

      {/* End Point Marker */}
      <mesh position={measurement.endPoint} onClick={handleClick}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#3b82f6' : '#22c55e'} />
      </mesh>

      {/* Distance Label */}
      <Html
        position={midpoint}
        center
        distanceFactor={10}
        style={{ pointerEvents: 'auto' }}
      >
        <div
          onClick={handleClick}
          className={cn(
            'px-2 py-1 rounded cursor-pointer',
            'text-xs font-mono whitespace-nowrap',
            'transition-all duration-200',
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-black/80 text-green-400 hover:bg-black/90'
          )}
        >
          {formatDistance(measurement.value, measurement.unit)}
          {measurement.label && (
            <span className="ml-1 opacity-75">({measurement.label})</span>
          )}
        </div>
      </Html>
    </group>
  )
}

/**
 * Component that renders all measurements for the current model
 */
export function MeasurementLines() {
  const measurements = useViewerStore((state) => state.measurements)
  const showMeasurements = useViewerStore((state) => state.showMeasurements)

  if (!showMeasurements) return null

  return (
    <>
      {measurements.map((measurement) => (
        <MeasurementLine key={measurement.id} measurement={measurement} />
      ))}
    </>
  )
}

/**
 * Temporary measurement line while placing
 */
interface TempMeasurementLineProps {
  startPoint: [number, number, number]
  endPoint: [number, number, number] | null
}

export function TempMeasurementLine({ startPoint, endPoint }: TempMeasurementLineProps) {
  if (!endPoint) {
    // Just show start point marker
    return (
      <mesh position={startPoint}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    )
  }

  return (
    <group>
      <Line
        points={[startPoint, endPoint]}
        color="#f59e0b"
        lineWidth={2}
        dashed
        dashSize={0.05}
        gapSize={0.03}
      />
      <mesh position={startPoint}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={endPoint}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  )
}
