export type EnvironmentPreset = 'studio' | 'void' | 'sunset' | 'stage'

export interface EnvironmentConfig {
  name: string
  description: string
  background: {
    type: 'color' | 'gradient'
    color?: string
    topColor?: string
    bottomColor?: string
  }
  showGrid: boolean
  theme: 'dark' | 'light' // Añadimos tema para los componentes UI
  fog?: {
    enabled: boolean
    color: string
    near: number
    far: number
  }
}

export const environmentPresets: Record<EnvironmentPreset, EnvironmentConfig> = {
  studio: {
    name: 'Studio',
    description: 'Classic studio setup with grid',
    background: {
      type: 'gradient',
      topColor: '#1a1a2e',
      bottomColor: '#0f0f1e',
    },
    showGrid: true,
    theme: 'dark',
  },
  void: {
    name: 'Void',
    description: 'Infinite dark void, no distractions',
    background: {
      type: 'color',
      color: '#000000',
    },
    showGrid: false,
    theme: 'dark',
  },
  sunset: {
    name: 'Sunset',
    description: 'Warm gradient background',
    background: {
      type: 'gradient',
      topColor: '#ff6b6b',
      bottomColor: '#4ecdc4',
    },
    showGrid: false,
    theme: 'dark',
    fog: {
      enabled: true,
      color: '#ff6b6b',
      near: 10,
      far: 50,
    },
  },
  stage: {
    name: 'Stage',
    description: 'Dark stage with subtle grid',
    background: {
      type: 'color',
      color: '#0a0a0a',
    },
    showGrid: true,
    theme: 'dark',
  },
}
