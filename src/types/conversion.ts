/**
 * Format Conversion Types
 * Defines types for the 3D format conversion system
 */

export type ImportFormat = 'glb' | 'gltf' | 'fbx' | 'obj' | 'dae' | 'stl' | 'ply' | '3ds'
export type ExportFormat = 'glb' | 'gltf' | 'obj' | 'stl' | 'ply'

export type FormatAvailability = 'full' | 'partial' | 'server-only' | 'unavailable'

export interface FormatInfo {
  id: string
  name: string
  extension: string
  icon: string
  supportsAnimations: boolean
  supportsMaterials: boolean
  supportsTextures: boolean
  availability: FormatAvailability
  dataLoss?: string[]
  description: string
}

export interface ConversionOptions {
  preserveAnimations: boolean
  preserveMaterials: boolean
  preserveTextures: boolean
  targetCoordinateSystem: 'y-up' | 'z-up'
  optimizeGeometry: boolean
  compressionLevel?: 'lossless' | 'high' | 'medium' | 'low'
}

export interface ExportOptions {
  includeAnimations: boolean
  includeMaterials: boolean
  includeTextures: boolean
  coordinateSystem: 'y-up' | 'z-up'
  binary: boolean
  compress: boolean
  fileName: string
}

export interface FormatDetectionResult {
  format: ImportFormat | null
  needsConversion: boolean
  canConvert: boolean
  error?: string
}

export interface ConversionResult {
  success: boolean
  data?: ArrayBuffer | Blob
  warnings?: string[]
  error?: string
  fileName?: string
}

export interface ConversionProgress {
  stage: 'loading-wasm' | 'parsing' | 'converting' | 'optimizing' | 'complete'
  progress: number
  message: string
}

export interface ExportFormatConfig {
  formats: FormatInfo[]
  getFormatInfo: (format: ExportFormat) => FormatInfo | undefined
}
