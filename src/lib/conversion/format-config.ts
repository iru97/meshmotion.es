import type { ExportFormat, FormatInfo, ExportFormatConfig } from '@/types/conversion'

/**
 * Export Format Configuration
 * Defines supported export formats and their capabilities
 */
export const exportFormats: FormatInfo[] = [
  {
    id: 'gltf',
    name: 'glTF',
    extension: '.gltf',
    icon: 'FileJson',
    supportsAnimations: true,
    supportsMaterials: true,
    supportsTextures: true,
    availability: 'full',
    description: 'GL Transmission Format (JSON + separate assets)',
  },
  {
    id: 'glb',
    name: 'GLB',
    extension: '.glb',
    icon: 'Package',
    supportsAnimations: true,
    supportsMaterials: true,
    supportsTextures: true,
    availability: 'full',
    description: 'Binary glTF (single file)',
  },
  {
    id: 'obj',
    name: 'Wavefront OBJ',
    extension: '.obj',
    icon: 'Box',
    supportsAnimations: false,
    supportsMaterials: true,
    supportsTextures: true,
    availability: 'partial',
    dataLoss: ['Animations', 'Skeleton/Rigging'],
    description: 'Simple geometry format (+ .mtl for materials)',
  },
  {
    id: 'stl',
    name: 'STL',
    extension: '.stl',
    icon: 'Printer',
    supportsAnimations: false,
    supportsMaterials: false,
    supportsTextures: false,
    availability: 'partial',
    dataLoss: ['Animations', 'Materials', 'Textures', 'Skeleton'],
    description: 'Stereolithography (3D printing)',
  },
  {
    id: 'ply',
    name: 'PLY',
    extension: '.ply',
    icon: 'Hexagon',
    supportsAnimations: false,
    supportsMaterials: false,
    supportsTextures: false,
    availability: 'partial',
    dataLoss: ['Animations', 'Materials', 'Textures', 'Skeleton'],
    description: 'Polygon File Format (point clouds, vertex colors)',
  },
]

/**
 * Import Format MIME Types
 */
export const importMimeTypes: Record<string, string[]> = {
  glb: ['model/gltf-binary'],
  gltf: ['model/gltf+json', 'application/json'],
  fbx: ['application/octet-stream'],
  obj: ['model/obj', 'text/plain'],
  dae: ['model/vnd.collada+xml', 'application/xml'],
  stl: ['model/stl', 'application/sla'],
  ply: ['application/ply', 'text/plain'],
  '3ds': ['application/x-3ds'],
}

/**
 * File extension to format mapping
 */
export const extensionToFormat: Record<string, string> = {
  '.glb': 'glb',
  '.gltf': 'gltf',
  '.fbx': 'fbx',
  '.obj': 'obj',
  '.dae': 'dae',
  '.stl': 'stl',
  '.ply': 'ply',
  '.3ds': '3ds',
}

/**
 * Get format information for an export format
 */
export function getExportFormatInfo(format: ExportFormat): FormatInfo | undefined {
  return exportFormats.find((f) => f.id === format)
}

/**
 * Get all available export formats
 */
export function getAvailableExportFormats(): FormatInfo[] {
  return exportFormats.filter((f) => f.availability !== 'unavailable')
}

/**
 * Check if a format supports a specific feature
 */
export function formatSupports(
  format: ExportFormat,
  feature: 'animations' | 'materials' | 'textures'
): boolean {
  const info = getExportFormatInfo(format)
  if (!info) return false

  switch (feature) {
    case 'animations':
      return info.supportsAnimations
    case 'materials':
      return info.supportsMaterials
    case 'textures':
      return info.supportsTextures
    default:
      return false
  }
}

/**
 * Get data loss warnings for a format
 */
export function getDataLossWarnings(format: ExportFormat): string[] {
  const info = getExportFormatInfo(format)
  return info?.dataLoss || []
}

/**
 * Export format configuration
 */
export const exportFormatConfig: ExportFormatConfig = {
  formats: exportFormats,
  getFormatInfo: getExportFormatInfo,
}
