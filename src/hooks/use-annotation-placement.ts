import { useCallback, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useViewerStore } from '@/lib/store/viewer-store'
import type { Annotation } from '@/types/annotations'
import { DEFAULT_ANNOTATION_STYLE } from '@/types/annotations'

/**
 * Hook for placing annotations on 3D models via raycasting
 */
export function useAnnotationPlacement() {
  const { camera, scene, raycaster, pointer } = useThree()
  const isPlacementMode = useViewerStore((state) => state.isAnnotationPlacementMode)
  const addAnnotation = useViewerStore((state) => state.addAnnotation)

  const lastClickTime = useRef(0)

  /**
   * Raycast to find intersection point on the model
   */
  const getIntersectionPoint = useCallback(
    (event: THREE.Event | { clientX: number; clientY: number }) => {
      // Update raycaster from mouse position
      raycaster.setFromCamera(pointer, camera)

      // Find all mesh objects in the scene
      const meshes: THREE.Mesh[] = []
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          meshes.push(object)
        }
      })

      // Raycast against meshes
      const intersects = raycaster.intersectObjects(meshes, true)

      if (intersects.length > 0) {
        const hit = intersects[0]
        return {
          point: hit.point.toArray() as [number, number, number],
          normal: hit.face?.normal
            ? hit.face.normal.toArray() as [number, number, number]
            : undefined,
        }
      }

      return null
    },
    [camera, scene, raycaster, pointer]
  )

  /**
   * Handle click to place annotation
   */
  const handlePlacementClick = useCallback(() => {
    if (!isPlacementMode) return

    // Debounce clicks
    const now = Date.now()
    if (now - lastClickTime.current < 200) return
    lastClickTime.current = now

    const intersection = getIntersectionPoint({} as any)
    if (!intersection) return

    // Create new annotation
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: intersection.point,
      normal: intersection.normal,
      label: `Point ${useViewerStore.getState().annotations.length + 1}`,
      description: '',
      style: { ...DEFAULT_ANNOTATION_STYLE },
      visible: true,
      createdAt: Date.now(),
    }

    addAnnotation(newAnnotation)

    // Select the new annotation
    useViewerStore.getState().setSelectedAnnotation(newAnnotation.id)
  }, [isPlacementMode, getIntersectionPoint, addAnnotation])

  return {
    isPlacementMode,
    handlePlacementClick,
    getIntersectionPoint,
  }
}

/**
 * Generate a unique annotation ID
 */
export function generateAnnotationId(): string {
  return `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
