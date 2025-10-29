import { useState, useCallback } from 'react'
import { detectFileFormat, validateFile, supportsWebAssembly } from '@/lib/conversion/format-detector'
import { convertToGLB } from '@/lib/conversion/assimp-converter'
import type {
  ConversionOptions,
  ConversionProgress,
  ConversionResult,
  FormatDetectionResult,
} from '@/types/conversion'

interface UseFormatConverterReturn {
  // State
  isConverting: boolean
  progress: ConversionProgress | null
  error: string | null

  // Actions
  detectFormat: (file: File) => Promise<FormatDetectionResult>
  convertFile: (file: File, options?: ConversionOptions) => Promise<ConversionResult>
  reset: () => void
}

/**
 * Hook for converting 3D file formats to GLB
 * Handles format detection, validation, and conversion using assimpjs
 */
export function useFormatConverter(): UseFormatConverterReturn {
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState<ConversionProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * Detect the format of a file
   */
  const detectFormat = useCallback(async (file: File): Promise<FormatDetectionResult> => {
    try {
      setError(null)

      // Validate file first
      const validation = validateFile(file)
      if (!validation.valid) {
        return {
          format: null,
          needsConversion: false,
          canConvert: false,
          error: validation.error,
        }
      }

      // Detect format
      const result = await detectFileFormat(file)

      if (result.needsConversion && !supportsWebAssembly()) {
        return {
          ...result,
          canConvert: false,
          error:
            'Your browser does not support WebAssembly, which is required for file conversion. Please use a modern browser or upload GLB files directly.',
        }
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during format detection'
      setError(errorMessage)
      return {
        format: null,
        needsConversion: false,
        canConvert: false,
        error: errorMessage,
      }
    }
  }, [])

  /**
   * Convert a file to GLB format
   */
  const convertFile = useCallback(
    async (file: File, options?: ConversionOptions): Promise<ConversionResult> => {
      try {
        setIsConverting(true)
        setError(null)
        setProgress({
          stage: 'loading-wasm',
          progress: 0,
          message: 'Preparing conversion...',
        })

        // Validate file
        const validation = validateFile(file)
        if (!validation.valid) {
          throw new Error(validation.error)
        }

        // Check WebAssembly support
        if (!supportsWebAssembly()) {
          throw new Error(
            'Your browser does not support WebAssembly. Please use a modern browser or upload GLB files directly.'
          )
        }

        // Detect format
        const detection = await detectFileFormat(file)

        if (!detection.canConvert) {
          throw new Error(detection.error || 'This file format cannot be converted')
        }

        if (!detection.needsConversion) {
          // File is already GLB/GLTF, no conversion needed
          const arrayBuffer = await file.arrayBuffer()
          return {
            success: true,
            data: arrayBuffer,
            warnings: ['File is already in GLB/GLTF format, no conversion needed'],
          }
        }

        // Convert the file
        const result = await convertToGLB(file, options, (progressUpdate) => {
          setProgress(progressUpdate)
        })

        if (!result.success) {
          throw new Error(result.error || 'Conversion failed')
        }

        setProgress({
          stage: 'complete',
          progress: 100,
          message: 'Conversion successful',
        })

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown conversion error'
        setError(errorMessage)

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsConverting(false)
      }
    },
    []
  )

  /**
   * Reset converter state
   */
  const reset = useCallback(() => {
    setIsConverting(false)
    setProgress(null)
    setError(null)
  }, [])

  return {
    isConverting,
    progress,
    error,
    detectFormat,
    convertFile,
    reset,
  }
}
