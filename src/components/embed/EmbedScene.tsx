'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, useGLTF } from '@react-three/drei'
import { useSearchParams } from 'next/navigation'
import { Lighting } from '../viewer/Lighting'
import { Environment } from '../viewer/Environment'
import { useViewerStore } from '@/lib/store/viewer-store'
import { environmentPresets } from '@/types/environment'
import { Play, Pause, RotateCcw, Maximize } from 'lucide-react'
import { cn } from '@/lib/utils'
import * as THREE from 'three'

interface EmbedConfig {
  modelUrl: string | null
  autoplay: boolean
  hideUI: boolean
  bgColor: string
  loop: boolean
}

function EmbedModel({ url }: { url: string }) {
  const { scene, animations } = useGLTF(url)
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null)
  const [action, setAction] = useState<THREE.AnimationAction | null>(null)
  const isPlaying = useViewerStore((state) => state.isPlaying)
  const loop = useViewerStore((state) => state.loop)

  useEffect(() => {
    if (scene && animations.length > 0) {
      const newMixer = new THREE.AnimationMixer(scene)
      const newAction = newMixer.clipAction(animations[0])
      newAction.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
      setMixer(newMixer)
      setAction(newAction)

      return () => {
        newMixer.stopAllAction()
      }
    }
  }, [scene, animations, loop])

  useEffect(() => {
    if (action) {
      if (isPlaying) {
        action.play()
      } else {
        action.paused = true
      }
    }
  }, [isPlaying, action])

  useEffect(() => {
    if (!mixer) return

    let animationId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const delta = clock.getDelta()
      mixer.update(delta)
      animationId = requestAnimationFrame(animate)
    }

    if (isPlaying) {
      animate()
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [mixer, isPlaying])

  // Center and scale model
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim

      scene.position.sub(center)
      scene.scale.setScalar(scale)
    }
  }, [scene])

  return <primitive object={scene} />
}

function EmbedControls({ hideUI, hasAnimation }: { hideUI: boolean; hasAnimation: boolean }) {
  const isPlaying = useViewerStore((state) => state.isPlaying)
  const togglePlay = useViewerStore((state) => state.togglePlay)

  if (hideUI) return null

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
      {hasAnimation && (
        <button
          onClick={togglePlay}
          className={cn(
            'p-2 rounded-full transition-all',
            'bg-black/50 hover:bg-black/70 backdrop-blur-sm',
            'border border-white/10'
          )}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>
      )}
      <button
        onClick={handleFullscreen}
        className={cn(
          'p-2 rounded-full transition-all',
          'bg-black/50 hover:bg-black/70 backdrop-blur-sm',
          'border border-white/10'
        )}
        title="Fullscreen"
      >
        <Maximize className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}

function EmbedWatermark({ hideUI }: { hideUI: boolean }) {
  if (hideUI) return null

  return (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'absolute bottom-4 right-4 z-10',
        'px-2 py-1 rounded text-xs',
        'bg-black/50 hover:bg-black/70 backdrop-blur-sm',
        'border border-white/10 text-white/70 hover:text-white',
        'transition-all'
      )}
    >
      MeshMotion
    </a>
  )
}

export default function EmbedScene() {
  const searchParams = useSearchParams()
  const [config, setConfig] = useState<EmbedConfig>({
    modelUrl: null,
    autoplay: false,
    hideUI: false,
    bgColor: '000000',
    loop: true,
  })
  const [hasAnimation, setHasAnimation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const environmentPreset = useViewerStore((state) => state.environmentPreset)
  const envConfig = environmentPresets[environmentPreset]
  const setIsPlaying = useViewerStore((state) => state.play)
  const setLoop = useViewerStore((state) => state.setLoop)

  // Parse URL parameters
  useEffect(() => {
    const modelUrl = searchParams.get('model') || searchParams.get('url')
    const autoplay = searchParams.get('autoplay') === 'true'
    const hideUI = searchParams.get('hideUI') === 'true'
    const bgColor = searchParams.get('bg') || '000000'
    const loop = searchParams.get('loop') !== 'false'

    setConfig({ modelUrl, autoplay, hideUI, bgColor, loop })
    setLoop(loop)

    if (autoplay) {
      setIsPlaying()
    }
  }, [searchParams, setIsPlaying, setLoop])

  // Check if model has animations
  useEffect(() => {
    if (config.modelUrl) {
      fetch(config.modelUrl, { method: 'HEAD' })
        .then(() => {
          // We'll check for animations after the model loads
          setHasAnimation(true) // Assume true, will be updated
        })
        .catch(() => {
          setError('Failed to load model')
        })
    }
  }, [config.modelUrl])

  if (!config.modelUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white/50 text-sm">
        <div className="text-center p-4">
          <p>No model specified</p>
          <p className="text-xs mt-2 text-white/30">
            Add ?model=URL to embed a 3D model
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full text-red-400 text-sm">
        <div className="text-center p-4">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 flex items-center gap-1 text-white/50 hover:text-white text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  const bgStyle = config.bgColor ? { backgroundColor: `#${config.bgColor}` } : {}

  return (
    <div className="w-full h-full" style={bgStyle}>
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
        <Environment />
        <Lighting />

        {envConfig.showGrid && (
          <Grid
            infiniteGrid
            cellSize={0.3}
            sectionSize={2}
            fadeDistance={30}
            fadeStrength={1}
          />
        )}

        <EmbedModel url={config.modelUrl} />

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={50}
        />
      </Canvas>

      <EmbedControls hideUI={config.hideUI} hasAnimation={hasAnimation} />
      <EmbedWatermark hideUI={config.hideUI} />
    </div>
  )
}
