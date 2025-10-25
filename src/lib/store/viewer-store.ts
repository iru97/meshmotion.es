import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type * as THREE from 'three'
import type { GLTFModel, AnimationClipWithMetadata } from '@/types/viewer'
import type { LightingPreset, MaterialPreset } from '@/types/viewer'
import type { EnvironmentPreset } from '@/types/environment'

interface ViewerState {
  // Models
  currentCharacter: GLTFModel | null
  currentAnimation: THREE.AnimationClip | null
  uploadedCharacters: GLTFModel[]
  uploadedAnimations: AnimationClipWithMetadata[] // Changed to use metadata
  isLoadingModel: boolean

  // Playback
  isPlaying: boolean
  playbackSpeed: number
  loop: boolean
  currentTime: number
  duration: number

  // Rendering
  lightingPreset: LightingPreset
  materialPreset: MaterialPreset
  environmentPreset: EnvironmentPreset
  showWireframe: boolean
  showSkeleton: boolean

  // UI
  showLeftSidebar: boolean
  showRightSidebar: boolean
  showTimeline: boolean

  // Actions
  setCharacter: (model: GLTFModel | null) => void
  setAnimation: (clip: THREE.AnimationClip | null) => void
  addUploadedCharacter: (model: GLTFModel) => void
  addUploadedAnimation: (animData: AnimationClipWithMetadata) => void
  setIsLoadingModel: (loading: boolean) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  setSpeed: (speed: number) => void
  setLoop: (loop: boolean) => void
  setCurrentTime: (time: number) => void
  setLightingPreset: (preset: LightingPreset) => void
  setMaterialPreset: (preset: MaterialPreset) => void
  setEnvironmentPreset: (preset: EnvironmentPreset) => void
  toggleWireframe: () => void
  toggleSkeleton: () => void
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
  toggleTimeline: () => void
}

export const useViewerStore = create<ViewerState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        currentCharacter: null,
        currentAnimation: null,
        uploadedCharacters: [],
        uploadedAnimations: [],
        isLoadingModel: false,
        isPlaying: false,
        playbackSpeed: 1,
        loop: true,
        currentTime: 0,
        duration: 0,
        lightingPreset: 'studio',
        materialPreset: 'textured',
        environmentPreset: 'studio',
        showWireframe: false,
        showSkeleton: false,
        showLeftSidebar: true,
        showRightSidebar: true,
        showTimeline: true,

        // Actions
        setCharacter: (model) => set({ currentCharacter: model }),
        setAnimation: (clip) =>
          set({
            currentAnimation: clip,
            duration: clip?.duration || 0,
            currentTime: 0,
          }),
        addUploadedCharacter: (model) =>
          set((state) => ({
            uploadedCharacters: [...state.uploadedCharacters, model],
          })),
        addUploadedAnimation: (animData) =>
          set((state) => ({
            uploadedAnimations: [...state.uploadedAnimations, animData],
          })),
        setIsLoadingModel: (loading) => set({ isLoadingModel: loading }),
        play: () => set({ isPlaying: true }),
        pause: () => set({ isPlaying: false }),
        togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
        setSpeed: (speed) => set({ playbackSpeed: speed }),
        setLoop: (loop) => set({ loop }),
        setCurrentTime: (time) => set({ currentTime: time }),
        setLightingPreset: (preset) => set({ lightingPreset: preset }),
        setMaterialPreset: (preset) => set({ materialPreset: preset }),
        setEnvironmentPreset: (preset) => set({ environmentPreset: preset }),
        toggleWireframe: () =>
          set((state) => ({ showWireframe: !state.showWireframe })),
        toggleSkeleton: () =>
          set((state) => ({ showSkeleton: !state.showSkeleton })),
        toggleLeftSidebar: () =>
          set((state) => ({ showLeftSidebar: !state.showLeftSidebar })),
        toggleRightSidebar: () =>
          set((state) => ({ showRightSidebar: !state.showRightSidebar })),
        toggleTimeline: () =>
          set((state) => ({ showTimeline: !state.showTimeline })),
      }),
      {
        name: 'viewer-storage',
        partialize: (state) => ({
          playbackSpeed: state.playbackSpeed,
          loop: state.loop,
          lightingPreset: state.lightingPreset,
          materialPreset: state.materialPreset,
          environmentPreset: state.environmentPreset,
          showLeftSidebar: state.showLeftSidebar,
          showRightSidebar: state.showRightSidebar,
          showTimeline: state.showTimeline,
        }),
      }
    ),
    { name: 'ViewerStore' }
  )
)
