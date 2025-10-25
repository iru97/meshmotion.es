'use client'

import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations } from '@react-three/drei'
import { useViewerStore } from '@/lib/store/viewer-store'
import { applyMaterialPreset } from '@/lib/three/material-presets'
import * as THREE from 'three'

export function Model() {
  const groupRef = useRef<THREE.Group>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const actionRef = useRef<THREE.AnimationAction | null>(null)

  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const currentAnimation = useViewerStore((state) => state.currentAnimation)
  const isPlaying = useViewerStore((state) => state.isPlaying)
  const playbackSpeed = useViewerStore((state) => state.playbackSpeed)
  const loop = useViewerStore((state) => state.loop)
  const materialPreset = useViewerStore((state) => state.materialPreset)
  const currentTime = useViewerStore((state) => state.currentTime)
  const setCurrentTime = useViewerStore((state) => state.setCurrentTime)

  // Setup animation mixer
  useEffect(() => {
    if (!currentCharacter) return

    // Create mixer on the character's scene, not the wrapper group
    const mixer = new THREE.AnimationMixer(currentCharacter.scene)
    mixerRef.current = mixer

    return () => {
      mixer.stopAllAction()
      mixerRef.current = null
      actionRef.current = null
    }
  }, [currentCharacter])

  // Setup animation action when animation changes
  useEffect(() => {
    if (!currentAnimation || !mixerRef.current) return

    mixerRef.current.stopAllAction()

    const action = mixerRef.current.clipAction(currentAnimation)
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
    action.timeScale = playbackSpeed
    action.reset()
    action.play()
    action.paused = !isPlaying

    actionRef.current = action

    return () => {
      action.stop()
      actionRef.current = null
    }
  }, [currentAnimation])

  // Update loop setting
  useEffect(() => {
    if (!actionRef.current) return
    actionRef.current.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity)
  }, [loop])

  // Update playback speed
  useEffect(() => {
    if (!actionRef.current) return
    actionRef.current.timeScale = playbackSpeed
  }, [playbackSpeed])

  // Handle play/pause without resetting
  useEffect(() => {
    if (!actionRef.current) return
    actionRef.current.paused = !isPlaying
  }, [isPlaying])

  // Sync duration to store when animation changes
  useEffect(() => {
    if (!currentAnimation) return

    const duration = currentAnimation.duration
    const currentStoreDuration = useViewerStore.getState().duration

    // Only update if different to avoid unnecessary re-renders
    if (duration !== currentStoreDuration) {
      useViewerStore.setState({ duration })
    }
  }, [currentAnimation])

  // Handle manual timeline scrubbing (bidirectional sync)
  useEffect(() => {
    if (!actionRef.current) return

    // Check if currentTime was changed externally (by user scrubbing)
    const actionTime = actionRef.current.time

    // If there's a significant difference, update the action time
    if (Math.abs(actionTime - currentTime) > 0.1) {
      actionRef.current.time = currentTime
    }
  }, [currentTime])

  // Apply material preset and enable shadows
  useEffect(() => {
    if (!currentCharacter) return

    applyMaterialPreset(currentCharacter.scene, materialPreset)

    // Enable shadows on all meshes
    currentCharacter.scene.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [currentCharacter, materialPreset])

  // Update mixer on each frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta)

      // Update current time in store
      if (actionRef.current) {
        setCurrentTime(actionRef.current.time)
      }
    }
  })

  if (!currentCharacter) {
    return null
  }

  return (
    <group ref={groupRef}>
      <primitive object={currentCharacter.scene} />
    </group>
  )
}
