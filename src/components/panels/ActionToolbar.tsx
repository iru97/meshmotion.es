'use client'

import { useRef } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { Upload, FolderOpen, Split, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Top-right action toolbar with Upload, Assets, Comparison, and Settings buttons
 */
export function ActionToolbar() {
  const theme = useThemeClasses()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showRightSidebar = useViewerStore((state) => state.showRightSidebar)
  const assetPanelOpen = useViewerStore((state) => state.assetPanelOpen)
  const comparisonPanelOpen = useViewerStore((state) => state.comparisonPanelOpen)

  const toggleRightSidebar = useViewerStore((state) => state.toggleRightSidebar)
  const toggleAssetPanel = useViewerStore((state) => state.toggleAssetPanel)
  const toggleComparisonPanel = useViewerStore((state) => state.toggleComparisonPanel)

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
        accept=".glb,.gltf"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

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
    </div>
  )
}
