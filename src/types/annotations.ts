import type { ExportOptions } from './conversion'

/**
 * 3D Annotation/Hotspot types for model documentation
 */

export interface Annotation {
  id: string
  /** Position in 3D world space */
  position: [number, number, number]
  /** Normal vector at the annotation point (for orientation) */
  normal?: [number, number, number]
  /** Short label displayed on the hotspot */
  label: string
  /** Extended description shown on hover/click */
  description?: string
  /** Optional link URL */
  linkUrl?: string
  /** Display style */
  style: AnnotationStyle
  /** Whether annotation is visible */
  visible: boolean
  /** Created timestamp */
  createdAt: number
}

export interface AnnotationStyle {
  /** Background color (hex) */
  color: string
  /** Icon to display (emoji or icon name) */
  icon?: string
  /** Size multiplier */
  scale: number
}

export const DEFAULT_ANNOTATION_STYLE: AnnotationStyle = {
  color: '#3b82f6', // blue-500
  scale: 1,
}

export interface AnnotationsState {
  /** List of annotations for current model */
  annotations: Annotation[]
  /** Currently selected annotation ID */
  selectedAnnotationId: string | null
  /** Is annotation mode active (for placing new annotations) */
  isPlacementMode: boolean
  /** Show all annotations */
  showAnnotations: boolean
  /** Annotations panel open */
  annotationsPanelOpen: boolean
}

export const DEFAULT_ANNOTATIONS_STATE: AnnotationsState = {
  annotations: [],
  selectedAnnotationId: null,
  isPlacementMode: false,
  showAnnotations: true,
  annotationsPanelOpen: false,
}

/**
 * Measurement types for distance/angle tools
 */

export interface Measurement {
  id: string
  type: 'distance' | 'angle'
  /** Start point in 3D world space */
  startPoint: [number, number, number]
  /** End point in 3D world space */
  endPoint: [number, number, number]
  /** Third point for angle measurements */
  midPoint?: [number, number, number]
  /** Calculated value (distance in units or angle in degrees) */
  value: number
  /** Display unit */
  unit: MeasurementUnit
  /** Label/name for the measurement */
  label?: string
  /** Is visible */
  visible: boolean
  /** Created timestamp */
  createdAt: number
}

export type MeasurementUnit = 'm' | 'cm' | 'mm' | 'in' | 'ft'

export interface MeasurementsState {
  /** List of measurements for current model */
  measurements: Measurement[]
  /** Currently selected measurement ID */
  selectedMeasurementId: string | null
  /** Is measurement mode active */
  isMeasurementMode: boolean
  /** Current measurement type being placed */
  measurementType: 'distance' | 'angle'
  /** Show all measurements */
  showMeasurements: boolean
  /** Measurements panel open */
  measurementsPanelOpen: boolean
  /** Default unit */
  defaultUnit: MeasurementUnit
}

export const DEFAULT_MEASUREMENTS_STATE: MeasurementsState = {
  measurements: [],
  selectedMeasurementId: null,
  isMeasurementMode: false,
  measurementType: 'distance',
  showMeasurements: true,
  measurementsPanelOpen: false,
  defaultUnit: 'm',
}

/**
 * Export preset types
 */

export interface ExportPreset {
  id: string
  name: string
  format: string
  options: ExportOptions
  createdAt: number
}

export interface ExportPresetsState {
  presets: ExportPreset[]
  selectedPresetId: string | null
  exportPresetsPanelOpen: boolean
}

export const DEFAULT_EXPORT_PRESETS_STATE: ExportPresetsState = {
  presets: [],
  selectedPresetId: null,
  exportPresetsPanelOpen: false,
}
