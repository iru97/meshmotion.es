'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useViewerStore } from '@/lib/store/viewer-store'
import { environmentPresets } from '@/types/environment'
import * as THREE from 'three'

export function Environment() {
  const { scene } = useThree()
  const environmentPreset = useViewerStore((state) => state.environmentPreset)
  const config = environmentPresets[environmentPreset]

  useEffect(() => {
    // Set background
    if (config.background.type === 'color') {
      scene.background = new THREE.Color(config.background.color)
    } else if (config.background.type === 'gradient') {
      // Create gradient background using color interpolation
      const topColor = new THREE.Color(config.background.topColor)
      const bottomColor = new THREE.Color(config.background.bottomColor)

      // Use a simple vertical gradient
      const canvas = document.createElement('canvas')
      canvas.width = 2
      canvas.height = 256
      const ctx = canvas.getContext('2d')!

      const gradient = ctx.createLinearGradient(0, 0, 0, 256)
      gradient.addColorStop(0, config.background.topColor!)
      gradient.addColorStop(1, config.background.bottomColor!)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 2, 256)

      const texture = new THREE.CanvasTexture(canvas)
      scene.background = texture
    }

    // Set fog
    if (config.fog?.enabled) {
      scene.fog = new THREE.Fog(
        config.fog.color,
        config.fog.near,
        config.fog.far
      )
    } else {
      scene.fog = null
    }

    return () => {
      if (scene.background instanceof THREE.Texture) {
        scene.background.dispose()
      }
    }
  }, [environmentPreset, scene, config])

  return null
}
