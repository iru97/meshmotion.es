'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { formatDistance } from '@/hooks/use-measurements'
import {
  X,
  Trash2,
  Eye,
  EyeOff,
  Ruler,
  MousePointer,
} from 'lucide-react'
import type { MeasurementUnit } from '@/types/annotations'

const UNIT_OPTIONS: { value: MeasurementUnit; label: string }[] = [
  { value: 'm', label: 'Meters' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'mm', label: 'Millimeters' },
  { value: 'in', label: 'Inches' },
  { value: 'ft', label: 'Feet' },
]

/**
 * Panel for managing measurements on the 3D model
 */
export function MeasurementsPanel() {
  const theme = useThemeClasses()

  const measurementsPanelOpen = useViewerStore((state) => state.measurementsPanelOpen)
  const toggleMeasurementsPanel = useViewerStore((state) => state.toggleMeasurementsPanel)
  const measurements = useViewerStore((state) => state.measurements)
  const selectedMeasurementId = useViewerStore((state) => state.selectedMeasurementId)
  const setSelectedMeasurement = useViewerStore((state) => state.setSelectedMeasurement)
  const isMeasurementMode = useViewerStore((state) => state.isMeasurementMode)
  const toggleMeasurementMode = useViewerStore((state) => state.toggleMeasurementMode)
  const showMeasurements = useViewerStore((state) => state.showMeasurements)
  const toggleShowMeasurements = useViewerStore((state) => state.toggleShowMeasurements)
  const measurementUnit = useViewerStore((state) => state.measurementUnit)
  const setMeasurementUnit = useViewerStore((state) => state.setMeasurementUnit)
  const removeMeasurement = useViewerStore((state) => state.removeMeasurement)
  const clearMeasurements = useViewerStore((state) => state.clearMeasurements)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  if (!measurementsPanelOpen || !currentCharacter) return null

  return (
    <div
      className={cn(
        'fixed bottom-24 right-4 z-30',
        'p-4 rounded-xl border border-white/10',
        'w-80 max-h-96 overflow-hidden flex flex-col',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ruler className={cn('w-4 h-4', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Measurements
          </h3>
          <span className={cn('text-xs px-1.5 py-0.5 rounded bg-white/10', theme.textMuted)}>
            {measurements.length}
          </span>
        </div>
        <button
          onClick={toggleMeasurementsPanel}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-4 h-4', theme.textSecondary)} />
        </button>
      </div>

      {/* Unit Selector */}
      <div className="mb-3 pb-3 border-b border-white/10">
        <label className={cn('block text-xs mb-1.5', theme.textMuted)}>Unit</label>
        <select
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value as MeasurementUnit)}
          className={cn(
            'w-full px-2 py-1.5 rounded text-xs',
            'bg-white/10 border border-white/20',
            'text-white',
            'focus:outline-none focus:border-blue-500'
          )}
        >
          {UNIT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-900">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
        <button
          onClick={toggleMeasurementMode}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors',
            isMeasurementMode
              ? 'bg-green-600 text-white'
              : cn('bg-white/10', theme.textSecondary, 'hover:bg-white/20')
          )}
        >
          {isMeasurementMode ? (
            <>
              <MousePointer className="w-3 h-3" />
              Click Points
            </>
          ) : (
            <>
              <Ruler className="w-3 h-3" />
              Measure
            </>
          )}
        </button>

        <button
          onClick={toggleShowMeasurements}
          className={cn(
            'p-1.5 rounded transition-colors',
            'bg-white/10 hover:bg-white/20',
            theme.textSecondary
          )}
          title={showMeasurements ? 'Hide all' : 'Show all'}
        >
          {showMeasurements ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>

        {measurements.length > 0 && (
          <button
            onClick={clearMeasurements}
            className={cn(
              'p-1.5 rounded transition-colors ml-auto',
              'bg-white/10 hover:bg-red-500/20 text-red-400'
            )}
            title="Clear all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Measurement Mode Info */}
      {isMeasurementMode && (
        <div className="mb-3 p-2 rounded bg-green-500/10 border border-green-500/20">
          <p className={cn('text-xs', theme.textSecondary)}>
            Click two points on the model to measure the distance between them.
          </p>
        </div>
      )}

      {/* Measurements List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {measurements.length === 0 ? (
          <div className={cn('text-center py-6', theme.textMuted)}>
            <Ruler className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No measurements yet</p>
            <p className="text-xs opacity-75">Click &quot;Measure&quot; to start</p>
          </div>
        ) : (
          measurements.map((measurement) => (
            <div
              key={measurement.id}
              className={cn(
                'p-2 rounded-lg transition-colors cursor-pointer',
                'border',
                selectedMeasurementId === measurement.id
                  ? 'bg-white/15 border-green-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              )}
              onClick={() => setSelectedMeasurement(measurement.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className={cn('text-sm font-mono', theme.textPrimary)}>
                    {formatDistance(measurement.value, measurementUnit)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeMeasurement(measurement.id)
                  }}
                  className="p-1 rounded transition-colors hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              {measurement.label && (
                <p className={cn('text-xs mt-1 pl-4', theme.textMuted)}>
                  {measurement.label}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
