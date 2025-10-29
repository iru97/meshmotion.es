'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useViewerStore } from '@/lib/store/viewer-store'
import { Lighting } from '../viewer/Lighting'
import { Environment } from '../viewer/Environment'
import { ComparisonModel } from './ComparisonModel'
import { environmentPresets } from '@/types/environment'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'

export function ComparisonScene() {
  const comparisonMode = useViewerStore((state) => state.comparisonMode)
  const environmentPreset = useViewerStore((state) => state.environmentPreset)
  const setView1Time = useViewerStore((state) => state.setView1Time)
  const setView2Time = useViewerStore((state) => state.setView2Time)

  const controls1Ref = useRef<OrbitControlsType>(null)
  const controls2Ref = useRef<OrbitControlsType>(null)
  const [controlsReady, setControlsReady] = useState(false)

  const config = environmentPresets[environmentPreset]

  // Safe destructuring with proper defaults
  const view1 = comparisonMode?.view1 ?? {
    character: null,
    animation: null,
    isPlaying: false,
    currentTime: 0,
    playbackSpeed: 1,
    loop: true,
  }
  const view2 = comparisonMode?.view2 ?? {
    character: null,
    animation: null,
    isPlaying: false,
    currentTime: 0,
    playbackSpeed: 1,
    loop: true,
  }
  const layout = comparisonMode?.layout ?? 'vertical'
  const syncPlayback = comparisonMode?.syncPlayback ?? true
  const syncCamera = comparisonMode?.syncCamera ?? false

  // Debug logs
    character: view1.character?.name,
    animation: view1.animation?.name,
    isPlaying: view1.isPlaying,
  })
    character: view2.character?.name,
    animation: view2.animation?.name,
    isPlaying: view2.isPlaying,
  })

  // Determine if both views are playing (when sync enabled)
  const bothPlaying = syncPlayback && (view1?.isPlaying || view2?.isPlaying)

  // Check when controls are ready
  useEffect(() => {
    if (controls1Ref.current && controls2Ref.current && !controlsReady) {
      setControlsReady(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlsReady])

  // Additional check with delay for cases where refs mount asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      if (controls1Ref.current && controls2Ref.current && !controlsReady) {
        setControlsReady(true)
      }
    }, 200)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlsReady])

  // Sync camera controls bidirectionally
  useEffect(() => {

    if (!syncCamera || !controlsReady) return

    // Wait for both controls to be ready
    if (!controls1Ref.current || !controls2Ref.current) {
      return
    }

    const controls1 = controls1Ref.current
    const controls2 = controls2Ref.current
    let isSyncing = false


    const handleChange1 = () => {
      if (!controls1 || !controls2 || isSyncing) return
      isSyncing = true
      // Sync from view1 to view2
      controls2.object.position.copy(controls1.object.position)
      controls2.target.copy(controls1.target)
      controls2.update()
      isSyncing = false
    }

    const handleChange2 = () => {
      if (!controls1 || !controls2 || isSyncing) return
      isSyncing = true
      // Sync from view2 to view1
      controls1.object.position.copy(controls2.object.position)
      controls1.target.copy(controls2.target)
      controls1.update()
      isSyncing = false
    }

    controls1.addEventListener('change', handleChange1)
    controls2.addEventListener('change', handleChange2)

    return () => {
      controls1.removeEventListener('change', handleChange1)
      controls2.removeEventListener('change', handleChange2)
    }
  }, [syncCamera, controlsReady])

  // Layout classes
  const isVertical = layout === 'vertical'
  const containerClass = isVertical
    ? 'grid grid-cols-2 h-full'
    : 'grid grid-rows-2 h-full'

  return (
    <div className="canvas-container">
      <div className={containerClass}>
        {/* View 1 */}
        <div className="relative border-r border-white/10">
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
            <Environment />
            <Lighting />

            {config.showGrid && (
              <Grid
                infiniteGrid
                cellSize={0.3}
                sectionSize={2}
                fadeDistance={30}
                fadeStrength={1}
              />
            )}

            <ComparisonModel
              model={view1.character}
              animation={view1.animation}
              isPlaying={syncPlayback ? bothPlaying : view1.isPlaying}
              currentTime={view1.currentTime}
              playbackSpeed={view1.playbackSpeed}
              loop={view1.loop}
              onTimeUpdate={setView1Time}
            />

            <OrbitControls
              ref={controls1Ref}
              makeDefault
              enableDamping
              dampingFactor={0.05}
              minDistance={2}
              maxDistance={20}
              maxPolarAngle={Math.PI / 2}
              onUpdate={() => {
                if (controls1Ref.current && controls2Ref.current && !controlsReady) {
                  setControlsReady(true)
                }
              }}
            />
          </Canvas>

          {/* View Label */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-xs">
            View 1
          </div>
        </div>

        {/* View 2 */}
        <div className="relative">
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
            <Environment />
            <Lighting />

            {config.showGrid && (
              <Grid
                infiniteGrid
                cellSize={0.3}
                sectionSize={2}
                fadeDistance={30}
                fadeStrength={1}
              />
            )}

            <ComparisonModel
              model={view2.character}
              animation={view2.animation}
              isPlaying={syncPlayback ? bothPlaying : view2.isPlaying}
              currentTime={view2.currentTime}
              playbackSpeed={view2.playbackSpeed}
              loop={view2.loop}
              onTimeUpdate={setView2Time}
            />

            <OrbitControls
              ref={controls2Ref}
              makeDefault
              enableDamping
              dampingFactor={0.05}
              minDistance={2}
              maxDistance={20}
              maxPolarAngle={Math.PI / 2}
              onUpdate={() => {
                if (controls1Ref.current && controls2Ref.current && !controlsReady) {
                  setControlsReady(true)
                }
              }}
            />
          </Canvas>

          {/* View Label */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-xs">
            View 2
          </div>
        </div>
      </div>
    </div>
  )
}
