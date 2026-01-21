'use client'

import { useEffect, useCallback } from 'react'
import { useCameraPresets, CameraPreset } from '@/hooks/use-camera-presets'

// Global event for camera preset selection
const CAMERA_PRESET_EVENT = 'camera-preset-select'
// Global event for focusing on a position (e.g., annotation)
const CAMERA_FOCUS_EVENT = 'camera-focus-position'

/**
 * Dispatch event to select a camera preset (called from outside Canvas)
 */
export function selectCameraPreset(preset: CameraPreset) {
  window.dispatchEvent(new CustomEvent(CAMERA_PRESET_EVENT, { detail: preset }))
}

/**
 * Dispatch event to focus camera on a position (called from outside Canvas)
 */
export function focusCameraOnPosition(position: [number, number, number]) {
  window.dispatchEvent(new CustomEvent(CAMERA_FOCUS_EVENT, { detail: position }))
}

/**
 * Component that listens for camera preset events and applies them
 * Must be rendered inside the Canvas
 */
export function CameraPresetController() {
  const { goToPreset, focusOnPosition } = useCameraPresets()

  const handlePresetSelect = useCallback(
    (event: CustomEvent<CameraPreset>) => {
      goToPreset(event.detail, true)
    },
    [goToPreset]
  )

  const handleFocusPosition = useCallback(
    (event: CustomEvent<[number, number, number]>) => {
      focusOnPosition(event.detail, true)
    },
    [focusOnPosition]
  )

  useEffect(() => {
    window.addEventListener(CAMERA_PRESET_EVENT, handlePresetSelect as EventListener)
    window.addEventListener(CAMERA_FOCUS_EVENT, handleFocusPosition as EventListener)
    return () => {
      window.removeEventListener(CAMERA_PRESET_EVENT, handlePresetSelect as EventListener)
      window.removeEventListener(CAMERA_FOCUS_EVENT, handleFocusPosition as EventListener)
    }
  }, [handlePresetSelect, handleFocusPosition])

  return null
}
