'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import {
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Edit2,
  MapPin,
  MousePointer,
} from 'lucide-react'
import type { Annotation } from '@/types/annotations'

/**
 * Panel for managing annotations on the 3D model
 */
export function AnnotationsPanel() {
  const theme = useThemeClasses()

  const annotationsPanelOpen = useViewerStore((state) => state.annotationsPanelOpen)
  const toggleAnnotationsPanel = useViewerStore((state) => state.toggleAnnotationsPanel)
  const annotations = useViewerStore((state) => state.annotations)
  const selectedAnnotationId = useViewerStore((state) => state.selectedAnnotationId)
  const setSelectedAnnotation = useViewerStore((state) => state.setSelectedAnnotation)
  const isPlacementMode = useViewerStore((state) => state.isAnnotationPlacementMode)
  const togglePlacementMode = useViewerStore((state) => state.toggleAnnotationPlacementMode)
  const showAnnotations = useViewerStore((state) => state.showAnnotations)
  const toggleShowAnnotations = useViewerStore((state) => state.toggleShowAnnotations)
  const updateAnnotation = useViewerStore((state) => state.updateAnnotation)
  const removeAnnotation = useViewerStore((state) => state.removeAnnotation)
  const clearAnnotations = useViewerStore((state) => state.clearAnnotations)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editDescription, setEditDescription] = useState('')

  if (!annotationsPanelOpen || !currentCharacter) return null

  const handleStartEdit = (annotation: Annotation) => {
    setEditingId(annotation.id)
    setEditLabel(annotation.label)
    setEditDescription(annotation.description || '')
  }

  const handleSaveEdit = () => {
    if (editingId) {
      updateAnnotation(editingId, {
        label: editLabel,
        description: editDescription,
      })
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditLabel('')
    setEditDescription('')
  }

  return (
    <div
      className={cn(
        'fixed bottom-24 left-4 z-30',
        'p-4 rounded-xl border border-white/10',
        'w-80 max-h-96 overflow-hidden flex flex-col',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className={cn('w-4 h-4', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Annotations
          </h3>
          <span className={cn('text-xs px-1.5 py-0.5 rounded bg-white/10', theme.textMuted)}>
            {annotations.length}
          </span>
        </div>
        <button
          onClick={toggleAnnotationsPanel}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-4 h-4', theme.textSecondary)} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
        <button
          onClick={togglePlacementMode}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors',
            isPlacementMode
              ? 'bg-blue-600 text-white'
              : cn('bg-white/10', theme.textSecondary, 'hover:bg-white/20')
          )}
        >
          {isPlacementMode ? (
            <>
              <MousePointer className="w-3 h-3" />
              Click Model
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Add
            </>
          )}
        </button>

        <button
          onClick={toggleShowAnnotations}
          className={cn(
            'p-1.5 rounded transition-colors',
            'bg-white/10 hover:bg-white/20',
            theme.textSecondary
          )}
          title={showAnnotations ? 'Hide all' : 'Show all'}
        >
          {showAnnotations ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>

        {annotations.length > 0 && (
          <button
            onClick={clearAnnotations}
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

      {/* Placement Mode Info */}
      {isPlacementMode && (
        <div className="mb-3 p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <p className={cn('text-xs', theme.textSecondary)}>
            Click on the 3D model to place an annotation point.
          </p>
        </div>
      )}

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {annotations.length === 0 ? (
          <div className={cn('text-center py-6', theme.textMuted)}>
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No annotations yet</p>
            <p className="text-xs opacity-75">Click &quot;Add&quot; to place one</p>
          </div>
        ) : (
          annotations.map((annotation) => (
            <div
              key={annotation.id}
              className={cn(
                'p-2 rounded-lg transition-colors cursor-pointer',
                'border',
                selectedAnnotationId === annotation.id
                  ? 'bg-white/15 border-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              )}
              onClick={() => setSelectedAnnotation(annotation.id)}
            >
              {editingId === annotation.id ? (
                /* Edit Mode */
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className={cn(
                      'w-full px-2 py-1 rounded text-xs',
                      'bg-white/10 border border-white/20',
                      'text-white placeholder-white/40',
                      'focus:outline-none focus:border-blue-500'
                    )}
                    placeholder="Label"
                    autoFocus
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className={cn(
                      'w-full px-2 py-1 rounded text-xs resize-none',
                      'bg-white/10 border border-white/20',
                      'text-white placeholder-white/40',
                      'focus:outline-none focus:border-blue-500'
                    )}
                    placeholder="Description (optional)"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-2 py-1 rounded text-xs bg-blue-600 text-white hover:bg-blue-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className={cn(
                        'flex-1 px-2 py-1 rounded text-xs',
                        'bg-white/10 hover:bg-white/20',
                        theme.textSecondary
                      )}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-start gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: annotation.style.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-xs font-medium truncate', theme.textPrimary)}>
                      {annotation.label}
                    </p>
                    {annotation.description && (
                      <p className={cn('text-xs truncate', theme.textMuted)}>
                        {annotation.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartEdit(annotation)
                      }}
                      className={cn(
                        'p-1 rounded transition-colors',
                        'hover:bg-white/20',
                        theme.textMuted
                      )}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeAnnotation(annotation.id)
                      }}
                      className="p-1 rounded transition-colors hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
