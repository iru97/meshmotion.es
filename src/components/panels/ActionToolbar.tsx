'use client'

import { useRef, useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { Upload, FolderOpen, Split, Settings, Download, Link2, Camera, Video, Code, Share2, RotateCw, Crosshair, Maximize, Minimize, View, MapPin, Ruler, BarChart3, Bookmark, Cloud } from 'lucide-react'
import { cn } from '@/lib/utils'
import { URLInputModal } from '../upload/URLInputModal'
import { useFullscreen } from '@/hooks/use-fullscreen'
import { useARSupport } from '@/hooks/use-ar-support'

/**
 * Top-right action toolbar with Upload, Assets, Comparison, and Settings buttons
 */
export function ActionToolbar() {
  const theme = useThemeClasses()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showURLModal, setShowURLModal] = useState(false)

  const showRightSidebar = useViewerStore((state) => state.showRightSidebar)
  const assetPanelOpen = useViewerStore((state) => state.assetPanelOpen)
  const comparisonPanelOpen = useViewerStore((state) => state.comparisonPanelOpen)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const exportMenuOpen = useViewerStore((state) => state.exportMenuOpen)

  const toggleRightSidebar = useViewerStore((state) => state.toggleRightSidebar)
  const toggleAssetPanel = useViewerStore((state) => state.toggleAssetPanel)
  const toggleComparisonPanel = useViewerStore((state) => state.toggleComparisonPanel)
  const toggleExportMenu = useViewerStore((state) => state.toggleExportMenu)
  const toggleScreenshotModal = useViewerStore((state) => state.toggleScreenshotModal)
  const toggleRecordingModal = useViewerStore((state) => state.toggleRecordingModal)
  const toggleEmbedModal = useViewerStore((state) => state.toggleEmbedModal)
  const toggleShareModal = useViewerStore((state) => state.toggleShareModal)
  const turntableEnabled = useViewerStore((state) => state.turntableEnabled)
  const toggleTurntable = useViewerStore((state) => state.toggleTurntable)
  const cameraPresetsOpen = useViewerStore((state) => state.cameraPresetsOpen)
  const toggleCameraPresets = useViewerStore((state) => state.toggleCameraPresets)
  const minimalUIMode = useViewerStore((state) => state.minimalUIMode)
  const annotationsPanelOpen = useViewerStore((state) => state.annotationsPanelOpen)
  const toggleAnnotationsPanel = useViewerStore((state) => state.toggleAnnotationsPanel)
  const measurementsPanelOpen = useViewerStore((state) => state.measurementsPanelOpen)
  const toggleMeasurementsPanel = useViewerStore((state) => state.toggleMeasurementsPanel)
  const showStatsOverlay = useViewerStore((state) => state.showStatsOverlay)
  const toggleStatsOverlay = useViewerStore((state) => state.toggleStatsOverlay)
  const exportPresetsPanelOpen = useViewerStore((state) => state.exportPresetsPanelOpen)
  const toggleExportPresetsPanel = useViewerStore((state) => state.toggleExportPresetsPanel)
  const cloudFeaturesPanelOpen = useViewerStore((state) => state.cloudFeaturesPanelOpen)
  const toggleCloudFeaturesPanel = useViewerStore((state) => state.toggleCloudFeaturesPanel)

  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
  const { isSupported: arSupported, launchAR, isChecking: arChecking } = useARSupport()

  // Hide toolbar when RightSidebar is open or in minimal UI mode
  if (showRightSidebar) return null

  // In minimal UI mode, show only fullscreen toggle
  if (minimalUIMode) {
    return (
      <div className="fixed top-4 right-4 z-30 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
        <button
          onClick={toggleFullscreen}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover
          )}
          title="Exit Fullscreen (F)"
        >
          <Minimize className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      </div>
    )
  }

  // Hide toolbar when RightSidebar is open
  if (showRightSidebar) return null

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Trigger the same event that DropZone uses
      const event = new CustomEvent('glb-file-upload', { detail: { files: Array.from(files) } })
      window.dispatchEvent(event)
      // Reset input
      e.target.value = ''
    }
  }

  return (
    <div className="fixed top-4 right-4 z-30 flex items-center gap-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.fbx,.obj,.dae,.stl,.ply,.3ds"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Assets Panel Button - Always visible */}
      <button
        onClick={toggleAssetPanel}
        className={cn(
          'p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover,
          assetPanelOpen && 'bg-white/20'
        )}
        title="Manage Assets"
      >
        <FolderOpen className={cn('w-5 h-5', theme.iconPrimary)} />
      </button>

      {/* Comparison Panel Button - Always visible */}
      <button
        onClick={toggleComparisonPanel}
        className={cn(
          'p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover,
          comparisonPanelOpen && 'bg-white/20'
        )}
        title="Comparison Settings"
      >
        <Split className={cn('w-5 h-5', theme.iconPrimary)} />
      </button>

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        className={cn(
          'p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover
        )}
        title="Upload GLB File"
      >
        <Upload className={cn('w-5 h-5', theme.iconPrimary)} />
      </button>

      {/* Load from URL Button */}
      <button
        onClick={() => setShowURLModal(true)}
        className={cn(
          'p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover
        )}
        title="Load from URL"
      >
        <Link2 className={cn('w-5 h-5', theme.iconPrimary)} />
      </button>

      {/* Export Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleExportMenu}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover,
            exportMenuOpen && 'bg-white/20'
          )}
          title="Export Model"
        >
          <Download className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Export Presets Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleExportPresetsPanel}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover,
            exportPresetsPanelOpen && 'bg-white/20'
          )}
          title="Export Presets"
        >
          <Bookmark className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Turntable Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleTurntable}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover,
            turntableEnabled && 'bg-blue-600'
          )}
          title={turntableEnabled ? 'Stop Turntable (T)' : 'Start Turntable (T)'}
        >
          <RotateCw className={cn('w-5 h-5', turntableEnabled ? 'text-white' : theme.iconPrimary)} />
        </button>
      )}

      {/* Camera Presets Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleCameraPresets}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover,
            cameraPresetsOpen && 'bg-white/20'
          )}
          title="Camera Views (V)"
        >
          <Crosshair className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Annotations Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleAnnotationsPanel}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover,
            annotationsPanelOpen && 'bg-white/20'
          )}
          title="Annotations"
        >
          <MapPin className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Measurements Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleMeasurementsPanel}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover,
            measurementsPanelOpen && 'bg-white/20'
          )}
          title="Measurements"
        >
          <Ruler className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Stats Overlay Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleStatsOverlay}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover,
            showStatsOverlay && 'bg-white/20'
          )}
          title="Model Stats (I)"
        >
          <BarChart3 className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Screenshot Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleScreenshotModal}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover
          )}
          title="Take Screenshot (P)"
        >
          <Camera className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Recording Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleRecordingModal}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover
          )}
          title="Record Video (R)"
        >
          <Video className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Embed Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleEmbedModal}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover
          )}
          title="Get Embed Code"
        >
          <Code className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Share Button - Only visible when model is loaded */}
      {currentCharacter && (
        <button
          onClick={toggleShareModal}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover
          )}
          title="Share Model (Shift+S)"
        >
          <Share2 className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* AR Button - Only visible when model is loaded and AR is supported */}
      {currentCharacter && arSupported && !arChecking && (
        <button
          onClick={() => {
            const modelUrl = currentCharacter.url
            if (modelUrl) {
              launchAR(modelUrl, currentCharacter.name)
            }
          }}
          className={cn(
            'p-3 transition-all duration-200 active:scale-95 rounded-full',
            theme.glassPanelDark,
            theme.hover
          )}
          title="View in AR"
        >
          <View className={cn('w-5 h-5', theme.iconPrimary)} />
        </button>
      )}

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className={cn(
          'p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover
        )}
        title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
      >
        {isFullscreen ? (
          <Minimize className={cn('w-5 h-5', theme.iconPrimary)} />
        ) : (
          <Maximize className={cn('w-5 h-5', theme.iconPrimary)} />
        )}
      </button>

      {/* Cloud Features Button (Phase 4) */}
      <button
        onClick={toggleCloudFeaturesPanel}
        className={cn(
          'p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover,
          cloudFeaturesPanelOpen && 'bg-white/20'
        )}
        title="Cloud Features"
      >
        <Cloud className={cn('w-5 h-5', theme.iconPrimary)} />
      </button>

      {/* Settings Button - Toggle sidebar */}
      <button
        onClick={toggleRightSidebar}
        className={cn(
          'p-3 transition-all duration-200 active:scale-95 rounded-full',
          theme.glassPanelDark,
          theme.hover,
          showRightSidebar && 'bg-white/20'
        )}
        title="Settings"
      >
        <Settings className={cn('w-5 h-5', theme.iconPrimary)} />
      </button>

      {/* URL Input Modal */}
      <URLInputModal
        open={showURLModal}
        onClose={() => setShowURLModal(false)}
      />
    </div>
  )
}
