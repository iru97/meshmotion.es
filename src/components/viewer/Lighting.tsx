'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { lightingPresets } from '@/lib/three/lighting-presets'
import type { LightConfig } from '@/lib/three/lighting-presets'

export function Lighting() {
  const lightingPreset = useViewerStore((state) => state.lightingPreset)
  const preset = lightingPresets[lightingPreset]

  return (
    <>
      {preset.lights.map((light, index) => (
        <LightComponent key={`${lightingPreset}-${index}`} config={light} />
      ))}
    </>
  )
}

function LightComponent({ config }: { config: LightConfig }) {
  switch (config.type) {
    case 'ambient':
      return <ambientLight intensity={config.intensity} color={config.color} />

    case 'directional':
      return (
        <directionalLight
          intensity={config.intensity}
          position={config.position}
          color={config.color}
          castShadow={config.castShadow}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
      )

    case 'hemisphere':
      return (
        <hemisphereLight
          intensity={config.intensity}
          color={config.skyColor}
          groundColor={config.groundColor}
        />
      )

    case 'point':
      return (
        <pointLight
          intensity={config.intensity}
          position={config.position}
          color={config.color}
          castShadow={config.castShadow}
        />
      )

    case 'spot':
      return (
        <spotLight
          intensity={config.intensity}
          position={config.position}
          color={config.color}
          castShadow={config.castShadow}
        />
      )

    default:
      return null
  }
}
