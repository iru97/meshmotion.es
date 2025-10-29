/**
 * Three.js Exporters
 * Handles exporting GLB models to various formats using three.js exporters
 */

import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js'
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js'
import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter.js'
import type { ExportOptions, ExportFormat, ConversionResult } from '@/types/conversion'
import type { GLTFModel } from '@/types/viewer'

/**
 * Export a GLB model to GLTF format (JSON + separate assets)
 */
async function exportToGLTF(
  model: GLTFModel,
  options: ExportOptions
): Promise<ConversionResult> {
  try {
    const exporter = new GLTFExporter()

    const result = await new Promise<any>((resolve, reject) => {
      exporter.parse(
        model.scene,
        (gltf) => resolve(gltf),
        (error) => reject(error),
        {
          binary: false, // Export as JSON
          animations: options.includeAnimations ? model.animations : [],
          onlyVisible: true,
        }
      )
    })

    // Convert JSON to Blob
    const jsonString = JSON.stringify(result, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })

    return {
      success: true,
      data: blob,
      fileName: options.fileName || 'model.gltf',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'GLTF export failed',
    }
  }
}

/**
 * Export a GLB model to binary GLB format
 */
async function exportToGLB(
  model: GLTFModel,
  options: ExportOptions
): Promise<ConversionResult> {
  try {
    const exporter = new GLTFExporter()

    const result = await new Promise<ArrayBuffer>((resolve, reject) => {
      exporter.parse(
        model.scene,
        (gltf) => resolve(gltf as ArrayBuffer),
        (error) => reject(error),
        {
          binary: true, // Export as binary GLB
          animations: options.includeAnimations ? model.animations : [],
          onlyVisible: true,
        }
      )
    })

    const blob = new Blob([result], { type: 'model/gltf-binary' })

    return {
      success: true,
      data: blob,
      fileName: options.fileName || 'model.glb',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'GLB export failed',
    }
  }
}

/**
 * Export a GLB model to OBJ format (geometry only)
 */
async function exportToOBJ(
  model: GLTFModel,
  options: ExportOptions
): Promise<ConversionResult> {
  try {
    const exporter = new OBJExporter()

    // Export the scene to OBJ format
    const result = exporter.parse(model.scene)

    const blob = new Blob([result], { type: 'text/plain' })

    return {
      success: true,
      data: blob,
      fileName: options.fileName || 'model.obj',
      warnings: [
        'OBJ export does not include animations or skeleton',
        'Materials are exported to a separate .mtl file (not included)',
      ],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OBJ export failed',
    }
  }
}

/**
 * Export a GLB model to STL format (geometry only, for 3D printing)
 */
async function exportToSTL(
  model: GLTFModel,
  options: ExportOptions
): Promise<ConversionResult> {
  try {
    const exporter = new STLExporter()

    // Export as binary STL
    const result = exporter.parse(model.scene, { binary: options.binary !== false })

    // Convert result to Blob - STLExporter returns string or DataView
    const blob = new Blob(
      [result instanceof DataView ? new Uint8Array(result.buffer as ArrayBuffer) : result],
      {
        type: options.binary !== false ? 'application/octet-stream' : 'text/plain',
      }
    )

    return {
      success: true,
      data: blob,
      fileName: options.fileName || 'model.stl',
      warnings: [
        'STL export only includes geometry',
        'Animations, materials, and textures are not included',
        'Exported as ' + (options.binary !== false ? 'binary' : 'ASCII') + ' STL',
      ],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'STL export failed',
    }
  }
}

/**
 * Export a GLB model to PLY format (geometry + vertex colors)
 */
async function exportToPLY(
  model: GLTFModel,
  options: ExportOptions
): Promise<ConversionResult> {
  try {
    const exporter = new PLYExporter()

    // Export as binary PLY
    const result = exporter.parse(model.scene, () => {}, { binary: options.binary !== false })

    // Handle null result
    if (!result) {
      throw new Error('PLY export returned null')
    }

    // Convert result to Blob - PLYExporter returns string or ArrayBuffer
    const blob = new Blob(
      [typeof result === 'string' ? result : new Uint8Array(result as ArrayBuffer)],
      {
        type: options.binary !== false ? 'application/octet-stream' : 'text/plain',
      }
    )

    return {
      success: true,
      data: blob,
      fileName: options.fileName || 'model.ply',
      warnings: [
        'PLY export only includes geometry and vertex colors',
        'Animations, materials, and textures are not included',
        'Exported as ' + (options.binary !== false ? 'binary' : 'ASCII') + ' PLY',
      ],
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PLY export failed',
    }
  }
}

/**
 * Export a GLB model to the specified format
 */
export async function exportModel(
  model: GLTFModel,
  format: ExportFormat,
  options: ExportOptions
): Promise<ConversionResult> {
  switch (format) {
    case 'gltf':
      return exportToGLTF(model, options)
    case 'glb':
      return exportToGLB(model, options)
    case 'obj':
      return exportToOBJ(model, options)
    case 'stl':
      return exportToSTL(model, options)
    case 'ply':
      return exportToPLY(model, options)
    default:
      return {
        success: false,
        error: `Unsupported export format: ${format}`,
      }
  }
}

/**
 * Download a file blob
 */
export function downloadFile(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
