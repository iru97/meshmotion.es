import type { LightingPreset } from '@/types/viewer'

export interface LightConfig {
  type: 'ambient' | 'directional' | 'hemisphere' | 'point' | 'spot'
  intensity: number
  position?: [number, number, number]
  color?: string
  skyColor?: string
  groundColor?: string
  castShadow?: boolean
}

export interface LightingPresetConfig {
  name: string
  description: string
  lights: LightConfig[]
}

export const lightingPresets: Record<LightingPreset, LightingPresetConfig> = {
  studio: {
    name: 'Studio',
    description: 'Three-point lighting setup for professional look',
    lights: [
      {
        type: 'ambient',
        intensity: 0.3,
        color: '#ffffff',
      },
      {
        type: 'directional',
        intensity: 1.5,
        position: [5, 5, 5],
        color: '#ffffff',
        castShadow: true,
      },
      {
        type: 'directional',
        intensity: 0.5,
        position: [-5, 3, -5],
        color: '#ffffff',
      },
      {
        type: 'directional',
        intensity: 0.8,
        position: [0, 5, -5],
        color: '#ffffff',
      },
    ],
  },
  soft: {
    name: 'Soft',
    description: 'Low contrast ambient lighting',
    lights: [
      {
        type: 'hemisphere',
        intensity: 0.6,
        skyColor: '#ffffff',
        groundColor: '#999999',
      },
      {
        type: 'ambient',
        intensity: 0.5,
        color: '#ffffff',
      },
    ],
  },
  dramatic: {
    name: 'Dramatic',
    description: 'High contrast with strong shadows',
    lights: [
      {
        type: 'ambient',
        intensity: 0.1,
        color: '#ffffff',
      },
      {
        type: 'directional',
        intensity: 2.0,
        position: [3, 8, 3],
        color: '#ffffff',
        castShadow: true,
      },
    ],
  },
  outdoor: {
    name: 'Outdoor',
    description: 'Natural daylight simulation',
    lights: [
      {
        type: 'hemisphere',
        intensity: 0.5,
        skyColor: '#87CEEB',
        groundColor: '#8B7355',
      },
      {
        type: 'directional',
        intensity: 1.2,
        position: [5, 10, 5],
        color: '#FFF8DC',
        castShadow: true,
      },
    ],
  },
  custom: {
    name: 'Custom',
    description: 'User-defined lighting setup',
    lights: [
      {
        type: 'ambient',
        intensity: 0.5,
        color: '#ffffff',
      },
      {
        type: 'directional',
        intensity: 1.0,
        position: [5, 5, 5],
        color: '#ffffff',
        castShadow: true,
      },
    ],
  },
}
