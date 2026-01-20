'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Model } from './Model'
import { Lighting } from './Lighting'
import { Environment } from './Environment'
import { DropZone } from '../upload/DropZone'
import { AnimationControls } from '../animation/AnimationControls'
import { RightSidebar } from '../panels/RightSidebar'
import { LoadingOverlay } from '../ui/LoadingOverlay'
import { ActionToolbar } from '../panels/ActionToolbar'
import { AssetsPanel } from '../assets/AssetsPanel'
import { ComparisonScene } from '../comparison/ComparisonScene'
import { ComparisonControls } from '../comparison/ComparisonControls'
import { ExportFormatMenu } from '../export/ExportFormatMenu'
import { ExportModal } from '../export/ExportModal'
import { useViewerStore } from '@/lib/store/viewer-store'
import { environmentPresets } from '@/types/environment'
import { useDefaultModel } from '@/hooks/use-default-model'
import { usePersistentStorage } from '@/hooks/use-persistent-storage'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useURLParams } from '@/hooks/use-url-params'
import { ExternalLoadModal } from '../upload/ExternalLoadModal'
import { ScreenshotModal } from '../screenshot/ScreenshotModal'
import { RecordingModal } from '../recording/RecordingModal'
import { EmbedCodeModal } from '../embed/EmbedCodeModal'

export default function Scene() {
  const environmentPreset = useViewerStore((state) => state.environmentPreset)
  const comparisonEnabled = useViewerStore((state) => state.comparisonMode.enabled)
  const config = environmentPresets[environmentPreset]

  // Load default model on first render
  useDefaultModel()

  // Load persisted files from IndexedDB
  usePersistentStorage()

  // Global keyboard shortcuts
  useKeyboardShortcuts()

  // Handle URL query params for external file loading
  const {
    pendingExternalFile,
    isLoadingExternal,
    externalLoadError,
    isCorsBlocked,
    confirmExternalLoad,
    retryWithProxy,
    cancelExternalLoad,
    clearError,
  } = useURLParams()

  // Render comparison mode if enabled
  if (comparisonEnabled) {
    return (
      <>
        <ComparisonScene />

        {/* Shared UI Components */}
        <RightSidebar />
        <AnimationControls />
        <DropZone />
        <LoadingOverlay />
        <ActionToolbar />
        <AssetsPanel />
        <ComparisonControls />
        <ExportFormatMenu />
        <ExportModal />
        <ScreenshotModal />
        <RecordingModal />
        <EmbedCodeModal />

        {/* External URL Load Modal */}
        <ExternalLoadModal
          fileInfo={pendingExternalFile}
          isLoading={isLoadingExternal}
          error={externalLoadError}
          isCorsBlocked={isCorsBlocked}
          onConfirm={confirmExternalLoad}
          onRetryWithProxy={retryWithProxy}
          onCancel={cancelExternalLoad}
          onClearError={clearError}
        />
      </>
    )
  }

  // Normal single-view mode
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [5, 3, 8], fov: 50 }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        {/* Environment (background, fog, etc.) */}
        <Environment />

        {/* Lighting System */}
        <Lighting />

        {/* Ground Grid (conditional based on environment) */}
        {config.showGrid && (
          <Grid
            infiniteGrid
            cellSize={0.3}
            sectionSize={2}
            fadeDistance={30}
            fadeStrength={1}
          />
        )}

        {/* 3D Model */}
        <Model />

        {/* Camera Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Animation Controls */}
      <AnimationControls />

      {/* File Upload */}
      <DropZone />

      {/* Loading Overlay */}
      <LoadingOverlay />

      {/* Action Toolbar (Assets, Comparison, Settings) */}
      <ActionToolbar />

      {/* Assets Panel */}
      <AssetsPanel />

      {/* Comparison Controls Panel */}
      <ComparisonControls />

      {/* Export Menu & Modal */}
      <ExportFormatMenu />
      <ExportModal />

      {/* Screenshot Modal */}
      <ScreenshotModal />

      {/* Recording Modal */}
      <RecordingModal />

      {/* Embed Code Modal */}
      <EmbedCodeModal />

      {/* External URL Load Modal */}
      <ExternalLoadModal
        fileInfo={pendingExternalFile}
        isLoading={isLoadingExternal}
        error={externalLoadError}
        isCorsBlocked={isCorsBlocked}
        onConfirm={confirmExternalLoad}
        onRetryWithProxy={retryWithProxy}
        onCancel={cancelExternalLoad}
        onClearError={clearError}
      />
    </div>
  )
}
