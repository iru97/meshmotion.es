import { useState, useCallback } from 'react'
import { exportModel, downloadFile } from '@/lib/conversion/three-exporters'
import { getExportFormatInfo, getDataLossWarnings } from '@/lib/conversion/format-config'
import type { ExportFormat, ExportOptions, ConversionResult, FormatInfo } from '@/types/conversion'
import type { GLTFModel } from '@/types/viewer'

interface UseFormatExporterReturn {
  // State
  isExporting: boolean
  error: string | null

  // Actions
  exportFile: (model: GLTFModel, format: ExportFormat, options: ExportOptions) => Promise<ConversionResult>
  exportAndDownload: (model: GLTFModel, format: ExportFormat, options: ExportOptions) => Promise<void>
  getFormatInfo: (format: ExportFormat) => FormatInfo | undefined
  getWarnings: (format: ExportFormat) => string[]
  reset: () => void
}

/**
 * Hook for exporting GLB models to various formats
 * Handles format validation, export, and download
 */
export function useFormatExporter(): UseFormatExporterReturn {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Export a model to the specified format
   */
  const exportFile = useCallback(
    async (
      model: GLTFModel,
      format: ExportFormat,
      options: ExportOptions
    ): Promise<ConversionResult> => {
      try {
        setIsExporting(true)
        setError(null)

        // Validate model
        if (!model || !model.scene) {
          throw new Error('No model loaded')
        }

        // Get format info
        const formatInfo = getExportFormatInfo(format)
        if (!formatInfo) {
          throw new Error(`Unknown export format: ${format}`)
        }

        if (formatInfo.availability === 'unavailable') {
          throw new Error(`Export to ${formatInfo.name} is not available`)
        }

        if (formatInfo.availability === 'server-only') {
          throw new Error(`Export to ${formatInfo.name} requires server-side processing`)
        }

        // Export the model
        const result = await exportModel(model, format, options)

        if (!result.success) {
          throw new Error(result.error || 'Export failed')
        }

        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown export error'
        setError(errorMessage)

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setIsExporting(false)
      }
    },
    []
  )

  /**
   * Export a model and trigger download
   */
  const exportAndDownload = useCallback(
    async (model: GLTFModel, format: ExportFormat, options: ExportOptions): Promise<void> => {
      const result = await exportFile(model, format, options)

      if (result.success && result.data) {
        const blob = result.data instanceof Blob ? result.data : new Blob([result.data])
        const fileName = result.fileName || options.fileName || `model.${format}`

        downloadFile(blob, fileName)
      } else {
        throw new Error(result.error || 'Export failed')
      }
    },
    [exportFile]
  )

  /**
   * Get format information
   */
  const getFormatInfo = useCallback((format: ExportFormat): FormatInfo | undefined => {
    return getExportFormatInfo(format)
  }, [])

  /**
   * Get data loss warnings for a format
   */
  const getWarnings = useCallback((format: ExportFormat): string[] => {
    return getDataLossWarnings(format)
  }, [])

  /**
   * Reset exporter state
   */
  const reset = useCallback(() => {
    setIsExporting(false)
    setError(null)
  }, [])

  return {
    isExporting,
    error,
    exportFile,
    exportAndDownload,
    getFormatInfo,
    getWarnings,
    reset,
  }
}
