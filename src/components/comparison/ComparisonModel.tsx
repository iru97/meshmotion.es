'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { useViewerStore } from '@/lib/store/viewer-store'
import { applyMaterialPreset, cloneWithOriginalMaterials } from '@/lib/three/material-presets'
import type { GLTFModel } from '@/types/viewer'

interface ComparisonModelProps {
  model: GLTFModel | null
  animation: THREE.AnimationClip | null
  isPlaying: boolean
  currentTime: number
  playbackSpeed: number
  loop: boolean
  onTimeUpdate?: (time: number) => void
}

export function ComparisonModel({
  model,
  animation,
  isPlaying,
  currentTime,
  playbackSpeed,
  loop,
  onTimeUpdate,
}: ComparisonModelProps) {
  const group = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const actionRef = useRef<THREE.AnimationAction | null>(null)
  const lastTimeRef = useRef(0)
  const lastDebugLogRef = useRef(0)

  // Get material preset from global store
  const materialPreset = useViewerStore((state) => state.materialPreset)

  // Clone the scene using SkeletonUtils to preserve bone structure for animations
  const clonedScene = useMemo(() => {
    if (!model) {
      return null
    }


    // Use SkeletonUtils.clone instead of scene.clone for animated models
    const cloned = SkeletonUtils.clone(model.scene) as THREE.Group

    // CRITICAL: Clone the ORIGINAL materials from the source model's WeakMap
    // This ensures we clone textured materials, not whatever preset is currently applied
    cloneWithOriginalMaterials(model.scene, cloned)

    return cloned
  }, [model])

  // Setup animation mixer when cloned scene is ready
  useEffect(() => {

    if (!clonedScene) {
      mixerRef.current = null
      actionRef.current = null
      return
    }

    // Create mixer on the CLONED scene
    const mixer = new THREE.AnimationMixer(clonedScene)
    mixerRef.current = mixer

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
      actionRef.current = null
    }
  }, [clonedScene])

  // Setup animation action when animation changes
  useEffect(() => {

    if (!animation || !mixerRef.current) {
      actionRef.current = null
      return
    }

    const mixer = mixerRef.current
    mixer.stopAllAction()

    // Create action from the animation clip
    const action = mixer.clipAction(animation)
    if (!action) {
      console.error('[ComparisonModel] Failed to create action for animation:', animation.name)
      return
    }


    // Configure action
    action.reset()
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
    action.clampWhenFinished = true
    action.timeScale = playbackSpeed
    action.time = currentTime
    action.play()

    if (!isPlaying) {
      action.paused = true
    }


    actionRef.current = action

    return () => {
      action.stop()
      actionRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, mixerRef.current])

  // Update playback state
  useEffect(() => {

    if (!actionRef.current) {
      console.warn('[ComparisonModel] No action ref, cannot update playback state')
      return
    }

    if (isPlaying) {
      actionRef.current.paused = false
    } else {
      actionRef.current.paused = true
    }
  }, [isPlaying])

  // Update playback speed
  useEffect(() => {
    if (!actionRef.current) return
    actionRef.current.timeScale = playbackSpeed
  }, [playbackSpeed])

  // Update loop mode
  useEffect(() => {
    if (!actionRef.current) return
    actionRef.current.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
  }, [loop])

  // Sync time from external source
  useEffect(() => {
    if (!actionRef.current) return
    if (Math.abs(actionRef.current.time - currentTime) > 0.1) {
      actionRef.current.time = currentTime
    }
  }, [currentTime])

  // Apply material preset and enable shadows
  useEffect(() => {
    if (!clonedScene) return

    applyMaterialPreset(clonedScene, materialPreset)

    // Enable shadows on all meshes
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [clonedScene, materialPreset])

  // Update animation on each frame
  useFrame((_, delta) => {
    // Update mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta)

      // Debug: log when mixer updates (throttled)
      if (actionRef.current && isPlaying) {
        const now = Date.now()
        if (!lastDebugLogRef.current || now - lastDebugLogRef.current > 1000) {
          lastDebugLogRef.current = now
        }
      }
    }

    if (!actionRef.current || !animation || !onTimeUpdate) return

    const currentActionTime = actionRef.current.time
    const animDuration = animation.duration || 0

    // Smart loop logic: handle end of animation
    if (currentActionTime >= animDuration) {
      if (loop) {
        // Loop enabled: restart from beginning
        actionRef.current.time = 0
        onTimeUpdate(0)
        lastTimeRef.current = 0
      } else {
        // Loop disabled: clamp at end and pause
        actionRef.current.time = animDuration
        actionRef.current.paused = true
        onTimeUpdate(animDuration)
        lastTimeRef.current = animDuration
      }
      return
    }

    // Report time updates (throttled to avoid excessive state updates)
    if (isPlaying && Math.abs(currentActionTime - lastTimeRef.current) > 0.033) {
      onTimeUpdate(currentActionTime)
      lastTimeRef.current = currentActionTime
    }
  })

  if (!clonedScene) return null

  return <primitive ref={group} object={clonedScene} />
}
