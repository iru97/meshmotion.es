import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type * as THREE from 'three'
import type { GLTFModel, AnimationClipWithMetadata } from '@/types/viewer'
import type { LightingPreset, MaterialPreset } from '@/types/viewer'
import type { EnvironmentPreset } from '@/types/environment'
import type { ComparisonState, ComparisonLayout } from '@/types/comparison'
import type { AssetFilter } from '@/types/assets'
import { DEFAULT_COMPARISON_STATE, DEFAULT_VIEW_STATE } from '@/types/comparison'
import { DEFAULT_ASSET_FILTER } from '@/types/assets'

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

  // Comparison Mode
  comparisonMode: ComparisonState
  comparisonPanelOpen: boolean

  // Asset Management
  assetPanelOpen: boolean
  selectedAssets: string[]
  assetFilter: AssetFilter

  // Export
  exportMenuOpen: boolean
  selectedExportFormat: string | null

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

  // Comparison Mode Actions
  toggleComparisonMode: () => void
  toggleComparisonPanel: () => void
  setComparisonLayout: (layout: ComparisonLayout) => void
  toggleSyncPlayback: () => void
  toggleSyncCamera: () => void
  setView1Character: (model: GLTFModel | null) => void
  setView1Animation: (clip: THREE.AnimationClip | null) => void
  setView2Character: (model: GLTFModel | null) => void
  setView2Animation: (clip: THREE.AnimationClip | null) => void
  toggleView1Playback: () => void
  toggleView2Playback: () => void
  setView1Time: (time: number) => void
  setView2Time: (time: number) => void
  setView1Loop: (loop: boolean) => void
  setView2Loop: (loop: boolean) => void
  setView1Speed: (speed: number) => void
  setView2Speed: (speed: number) => void

  // Asset Management Actions
  toggleAssetPanel: () => void
  setSelectedAssets: (ids: string[]) => void
  toggleAssetSelection: (id: string) => void
  clearAssetSelection: () => void
  updateAssetFilter: (filter: Partial<AssetFilter>) => void

  // Export Actions
  toggleExportMenu: () => void
  setSelectedExportFormat: (format: string | null) => void
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

        // Comparison Mode
        comparisonMode: DEFAULT_COMPARISON_STATE,
        comparisonPanelOpen: false,

        // Asset Management
        assetPanelOpen: false,
        selectedAssets: [],
        assetFilter: DEFAULT_ASSET_FILTER,

        // Export
        exportMenuOpen: false,
        selectedExportFormat: null,

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

        // Comparison Mode Actions
        toggleComparisonMode: () =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              enabled: !state.comparisonMode.enabled,
            },
          })),
        toggleComparisonPanel: () =>
          set((state) => ({ comparisonPanelOpen: !state.comparisonPanelOpen })),
        setComparisonLayout: (layout) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              layout,
            },
          })),
        toggleSyncPlayback: () =>
          set((state) => {
            const newSyncPlayback = !state.comparisonMode.syncPlayback

            // If enabling sync, synchronize view2 time to view1 time
            if (newSyncPlayback) {
              return {
                comparisonMode: {
                  ...state.comparisonMode,
                  syncPlayback: true,
                  view2: {
                    ...state.comparisonMode.view2,
                    currentTime: state.comparisonMode.view1.currentTime,
                  },
                },
              }
            }

            // If disabling sync, just toggle
            return {
              comparisonMode: {
                ...state.comparisonMode,
                syncPlayback: false,
              },
            }
          }),
        toggleSyncCamera: () =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              syncCamera: !state.comparisonMode.syncCamera,
            },
          })),
        setView1Character: (model) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view1: {
                ...state.comparisonMode.view1,
                character: model,
              },
            },
          })),
        setView1Animation: (clip) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view1: {
                ...state.comparisonMode.view1,
                animation: clip,
                currentTime: 0,
              },
            },
          })),
        setView2Character: (model) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view2: {
                ...state.comparisonMode.view2,
                character: model,
              },
            },
          })),
        setView2Animation: (clip) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view2: {
                ...state.comparisonMode.view2,
                animation: clip,
                // If sync is enabled, use view1's current time, otherwise reset to 0
                currentTime: state.comparisonMode.syncPlayback
                  ? state.comparisonMode.view1.currentTime
                  : 0,
              },
            },
          })),
        toggleView1Playback: () =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view1: {
                ...state.comparisonMode.view1,
                isPlaying: !state.comparisonMode.view1.isPlaying,
              },
            },
          })),
        toggleView2Playback: () =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view2: {
                ...state.comparisonMode.view2,
                isPlaying: !state.comparisonMode.view2.isPlaying,
              },
            },
          })),
        setView1Time: (time) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view1: {
                ...state.comparisonMode.view1,
                currentTime: time,
              },
            },
          })),
        setView2Time: (time) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view2: {
                ...state.comparisonMode.view2,
                currentTime: time,
              },
            },
          })),
        setView1Loop: (loop) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view1: {
                ...state.comparisonMode.view1,
                loop,
              },
            },
          })),
        setView2Loop: (loop) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view2: {
                ...state.comparisonMode.view2,
                loop,
              },
            },
          })),
        setView1Speed: (speed) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view1: {
                ...state.comparisonMode.view1,
                playbackSpeed: speed,
              },
            },
          })),
        setView2Speed: (speed) =>
          set((state) => ({
            comparisonMode: {
              ...state.comparisonMode,
              view2: {
                ...state.comparisonMode.view2,
                playbackSpeed: speed,
              },
            },
          })),

        // Asset Management Actions
        toggleAssetPanel: () =>
          set((state) => ({ assetPanelOpen: !state.assetPanelOpen })),
        setSelectedAssets: (ids) => set({ selectedAssets: ids }),
        toggleAssetSelection: (id) =>
          set((state) => ({
            selectedAssets: state.selectedAssets.includes(id)
              ? state.selectedAssets.filter((i) => i !== id)
              : [...state.selectedAssets, id],
          })),
        clearAssetSelection: () => set({ selectedAssets: [] }),
        updateAssetFilter: (filter) =>
          set((state) => ({
            assetFilter: {
              ...state.assetFilter,
              ...filter,
            },
          })),

        // Export Actions
        toggleExportMenu: () =>
          set((state) => ({ exportMenuOpen: !state.exportMenuOpen })),
        setSelectedExportFormat: (format) => set({ selectedExportFormat: format }),
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
          // Comparison Mode (persist layout and sync preferences)
          comparisonMode: {
            layout: state.comparisonMode.layout,
            syncPlayback: state.comparisonMode.syncPlayback,
            syncCamera: state.comparisonMode.syncCamera,
          },
          // Asset Management (persist filter preferences)
          assetFilter: state.assetFilter,
        }),
        merge: (persistedState: any, currentState: ViewerState) => ({
          ...currentState,
          ...persistedState,
          // Merge comparisonMode with defaults to ensure view1/view2 exist
          comparisonMode: {
            ...DEFAULT_COMPARISON_STATE,
            ...(persistedState?.comparisonMode || {}),
          },
          // Merge assetFilter with defaults
          assetFilter: {
            ...DEFAULT_ASSET_FILTER,
            ...(persistedState?.assetFilter || {}),
          },
        }),
      }
    ),
    { name: 'ViewerStore' }
  )
)
