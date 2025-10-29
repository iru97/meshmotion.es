'use client'

import { useCallback, useRef, useState, useEffect, ChangeEvent } from 'react'
import { useFileDrop } from '@/hooks/use-file-drop'
import { useGLTFLoader, UploadOption } from '@/hooks/use-gltf-loader'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UploadOptionsDialog } from './UploadOptionsDialog'
import { ConversionProgress } from './ConversionProgress'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useViewerStore } from '@/lib/store/viewer-store'

export function DropZone() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { loadGLBFile, conversionProgress } = useGLTFLoader()
  const theme = useThemeClasses()
  const showRightSidebar = useViewerStore((state) => state.showRightSidebar)

  const [pendingFile, setPendingFile] = useState<{ file: File; analysis: any } | null>(null)
  const [showOptionsDialog, setShowOptionsDialog] = useState(false)
  const [currentFileName, setCurrentFileName] = useState<string>('')

  const handleFiles = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        setCurrentFileName(file.name)
        const result = await loadGLBFile(file)

        console.log('Upload result:', result)

        if (!result.success) {
          if (result.error) {
            alert(result.error)
          }
          setCurrentFileName('')
          continue
        }

        // If needs selection, show modal
        if (result.needsSelection && result.analysis) {
          console.log('Showing upload options dialog')
          setPendingFile({ file, analysis: result.analysis })
          setShowOptionsDialog(true)
        }

        setCurrentFileName('')
      }
    },
    [loadGLBFile]
  )

  const handleOptionSelect = useCallback(
    async (option: UploadOption) => {
      if (!pendingFile) return

      setShowOptionsDialog(false)

      // Load with selected option
      const result = await loadGLBFile(pendingFile.file, option)

      if (!result.success && result.error) {
        alert(result.error)
      }

      setPendingFile(null)
    },
    [pendingFile, loadGLBFile]
  )

  const handleCancel = useCallback(() => {
    setShowOptionsDialog(false)
    setPendingFile(null)
  }, [])

  const { isDragging, dragHandlers } = useFileDrop(handleFiles)

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFiles(Array.from(files))
      }
    },
    [handleFiles]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Listen for upload events from ActionToolbar
  useEffect(() => {
    const handleUploadEvent = (e: CustomEvent) => {
      if (e.detail?.files) {
        handleFiles(e.detail.files)
      }
    }

    window.addEventListener('glb-file-upload', handleUploadEvent as EventListener)
    return () => {
      window.removeEventListener('glb-file-upload', handleUploadEvent as EventListener)
    }
  }, [handleFiles])

  return (
    <>
      <div
        {...dragHandlers}
        onClick={handleClick}
        className={cn(
          'fixed inset-0 z-50 pointer-events-none transition-opacity duration-200',
          isDragging ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="glass-panel-dark p-12 flex flex-col items-center gap-4 pointer-events-none">
            <Upload className="w-16 h-16 text-white" />
            <p className="text-white text-xl font-medium">Drop GLB file here</p>
            <p className="text-white/70 text-sm">Supports .glb and .gltf files up to 50MB</p>
          </div>
        </div>
      </div>

      {/* Hidden file input for drag-drop zone click */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload Options Dialog */}
      {pendingFile && (
        <UploadOptionsDialog
          open={showOptionsDialog}
          fileName={pendingFile.file.name}
          hasAnimations={pendingFile.analysis.metadata.animations > 0}
          animationCount={pendingFile.analysis.metadata.animations}
          onSelect={handleOptionSelect}
          onCancel={handleCancel}
        />
      )}

      {/* Conversion Progress */}
      {conversionProgress && currentFileName && (
        <ConversionProgress progress={conversionProgress} fileName={currentFileName} />
      )}
    </>
  )
}
