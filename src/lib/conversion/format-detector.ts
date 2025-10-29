import type { ImportFormat, FormatDetectionResult } from '@/types/conversion'
import { extensionToFormat } from './format-config'

/**
 * Detect the format of a 3D file
 */
export async function detectFileFormat(file: File): Promise<FormatDetectionResult> {
  // Get file extension
  const extension = getFileExtension(file.name)
  const format = extensionToFormat[extension] as ImportFormat | undefined

  if (!format) {
    return {
      format: null,
      needsConversion: false,
      canConvert: false,
      error: `Unsupported file format: ${extension}`,
    }
  }

  // Check if file is already GLB (no conversion needed)
  if (format === 'glb' || format === 'gltf') {
    return {
      format,
      needsConversion: false,
      canConvert: true,
    }
  }

  // Check if format can be converted
  const convertibleFormats: ImportFormat[] = ['fbx', 'obj', 'dae', 'stl', 'ply', '3ds']
  const canConvert = convertibleFormats.includes(format)

  return {
    format,
    needsConversion: true,
    canConvert,
    error: canConvert ? undefined : `Cannot convert ${extension} files`,
  }
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.')
  if (parts.length < 2) return ''
  return '.' + parts[parts.length - 1]
}

/**
 * Validate file before processing
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: 50MB`,
    }
  }

  // Check if file has an extension
  const extension = getFileExtension(file.name)
  if (!extension) {
    return {
      valid: false,
      error: 'File has no extension',
    }
  }

  // Check if extension is supported
  if (!extensionToFormat[extension]) {
    return {
      valid: false,
      error: `Unsupported file extension: ${extension}`,
    }
  }

  return { valid: true }
}

/**
 * Get format display name
 */
export function getFormatName(format: ImportFormat): string {
  const names: Record<ImportFormat, string> = {
    glb: 'GLB (Binary glTF)',
    gltf: 'glTF (GL Transmission Format)',
    fbx: 'FBX (Autodesk)',
    obj: 'Wavefront OBJ',
    dae: 'Collada (DAE)',
    stl: 'STL (Stereolithography)',
    ply: 'PLY (Polygon File Format)',
    '3ds': '3DS (3ds Max)',
  }
  return names[format] || format.toUpperCase()
}

/**
 * Check if browser supports WebAssembly (required for assimpjs)
 */
export function supportsWebAssembly(): boolean {
  try {
    if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
      // Test with a minimal WASM module
      const wasmModule = new WebAssembly.Module(
        Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
      )
      return wasmModule instanceof WebAssembly.Module
    }
  } catch (e) {
    return false
  }
  return false
}
