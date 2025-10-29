import type * as THREE from 'three'
import type { GLTFModel } from './viewer'

/**
 * State for a single view in comparison mode
 */
export interface ViewState {
  character: GLTFModel | null
  animation: THREE.AnimationClip | null
  isPlaying: boolean
  currentTime: number
  playbackSpeed: number
  loop: boolean
}

/**
 * Layout options for comparison mode
 */
export type ComparisonLayout = 'vertical' | 'horizontal' | 'overlay'

/**
 * Complete comparison mode state
 */
export interface ComparisonState {
  enabled: boolean
  layout: ComparisonLayout
  syncPlayback: boolean
  syncCamera: boolean
  view1: ViewState
  view2: ViewState
}

/**
 * Default view state
 */
export const DEFAULT_VIEW_STATE: ViewState = {
  character: null,
  animation: null,
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,
  loop: true,
}

/**
 * Default comparison state
 */
export const DEFAULT_COMPARISON_STATE: ComparisonState = {
  enabled: false,
  layout: 'vertical',
  syncPlayback: true,
  syncCamera: false,
  view1: DEFAULT_VIEW_STATE,
  view2: DEFAULT_VIEW_STATE,
}
