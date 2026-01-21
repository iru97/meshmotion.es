'use client'

import { useState, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useViewerStore } from '@/lib/store/viewer-store'
import { cn } from '@/lib/utils'
import type { Annotation } from '@/types/annotations'

interface AnnotationMarkerProps {
  annotation: Annotation
}

/**
 * 3D Annotation marker/hotspot component
 * Renders a clickable marker in 3D space with an optional popup
 */
export function AnnotationMarker({ annotation }: AnnotationMarkerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const markerRef = useRef<HTMLDivElement>(null)

  const selectedAnnotationId = useViewerStore((state) => state.selectedAnnotationId)
  const setSelectedAnnotation = useViewerStore((state) => state.setSelectedAnnotation)
  const showAnnotations = useViewerStore((state) => state.showAnnotations)

  const isSelected = selectedAnnotationId === annotation.id

  if (!annotation.visible || !showAnnotations) return null

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedAnnotation(isSelected ? null : annotation.id)
    setShowPopup(!showPopup)
  }

  return (
    <Html
      position={annotation.position}
      center
      distanceFactor={10}
      occlude
      style={{
        transition: 'opacity 0.2s',
        pointerEvents: 'auto',
      }}
    >
      <div
        ref={markerRef}
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Marker Dot */}
        <button
          onClick={handleClick}
          className={cn(
            'relative flex items-center justify-center',
            'w-8 h-8 rounded-full',
            'transition-all duration-200',
            'border-2 border-white shadow-lg',
            isSelected || isHovered ? 'scale-125' : 'scale-100'
          )}
          style={{ backgroundColor: annotation.style.color }}
        >
          {/* Pulse animation ring */}
          <span
            className={cn(
              'absolute inset-0 rounded-full animate-ping',
              'opacity-30'
            )}
            style={{ backgroundColor: annotation.style.color }}
          />

          {/* Icon or number */}
          <span className="text-white text-xs font-bold z-10">
            {annotation.style.icon || annotation.label.charAt(0).toUpperCase()}
          </span>
        </button>

        {/* Label (always visible when hovered or selected) */}
        {(isHovered || isSelected) && !showPopup && (
          <div
            className={cn(
              'absolute left-full ml-2 top-1/2 -translate-y-1/2',
              'px-2 py-1 rounded',
              'bg-black/80 backdrop-blur-sm',
              'text-white text-xs whitespace-nowrap',
              'border border-white/20'
            )}
          >
            {annotation.label}
          </div>
        )}

        {/* Popup (when clicked) */}
        {showPopup && (
          <div
            className={cn(
              'absolute left-full ml-3 top-1/2 -translate-y-1/2',
              'p-3 rounded-lg',
              'bg-black/90 backdrop-blur-md',
              'text-white text-sm',
              'border border-white/20',
              'min-w-48 max-w-72',
              'shadow-xl'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{annotation.label}</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPopup(false)
                }}
                className="text-white/60 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            {annotation.description && (
              <p className="text-white/80 text-xs mb-2">
                {annotation.description}
              </p>
            )}

            {/* Link */}
            {annotation.linkUrl && (
              <a
                href={annotation.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs underline"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more →
              </a>
            )}

            {/* Position info */}
            <div className="mt-2 pt-2 border-t border-white/10 text-white/50 text-xs font-mono">
              {annotation.position.map((v) => v.toFixed(2)).join(', ')}
            </div>
          </div>
        )}
      </div>
    </Html>
  )
}

/**
 * Component that renders all annotations for the current model
 */
export function AnnotationMarkers() {
  const annotations = useViewerStore((state) => state.annotations)
  const showAnnotations = useViewerStore((state) => state.showAnnotations)

  if (!showAnnotations) return null

  return (
    <>
      {annotations.map((annotation) => (
        <AnnotationMarker key={annotation.id} annotation={annotation} />
      ))}
    </>
  )
}
