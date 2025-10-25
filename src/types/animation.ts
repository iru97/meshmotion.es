import type * as THREE from 'three'

export interface AnimationState {
  currentClip: THREE.AnimationClip | null
  isPlaying: boolean
  loop: boolean
  speed: number
  currentTime: number
  duration: number
}

export interface SkeletonCompatibility {
  compatible: boolean
  confidence: number
  warnings: string[]
  missingBones: string[]
  extraBones: string[]
}

export interface TimelineState {
  playhead: number
  loopStart: number
  loopEnd: number
  tracks: AnimationTrack[]
}

export interface AnimationTrack {
  id: string
  name: string
  clip: THREE.AnimationClip
  start: number
  end: number
}
