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
import { useViewerStore } from '@/lib/store/viewer-store'
import { environmentPresets } from '@/types/environment'
import { useDefaultModel } from '@/hooks/use-default-model'
import { usePersistentStorage } from '@/hooks/use-persistent-storage'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

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
          alpha: false,
          powerPreference: 'high-performance',
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
    </div>
  )
}
