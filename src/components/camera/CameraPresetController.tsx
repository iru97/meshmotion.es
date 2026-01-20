'use client'

import { useEffect, useCallback } from 'react'
import { useCameraPresets, CameraPreset } from '@/hooks/use-camera-presets'

// Global event for camera preset selection
const CAMERA_PRESET_EVENT = 'camera-preset-select'

/**
 * Dispatch event to select a camera preset (called from outside Canvas)
 */
export function selectCameraPreset(preset: CameraPreset) {
  window.dispatchEvent(new CustomEvent(CAMERA_PRESET_EVENT, { detail: preset }))
}

/**
 * Component that listens for camera preset events and applies them
 * Must be rendered inside the Canvas
 */
export function CameraPresetController() {
  const { goToPreset } = useCameraPresets()

  const handlePresetSelect = useCallback(
    (event: CustomEvent<CameraPreset>) => {
      goToPreset(event.detail, true)
    },
    [goToPreset]
  )

  useEffect(() => {
    window.addEventListener(CAMERA_PRESET_EVENT, handlePresetSelect as EventListener)
    return () => {
      window.removeEventListener(CAMERA_PRESET_EVENT, handlePresetSelect as EventListener)
    }
  }, [handlePresetSelect])

  return null
}
