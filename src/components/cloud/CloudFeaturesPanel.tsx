'use client'

import { useState } from 'react'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import {
  X,
  Cloud,
  Link2,
  Users,
  Grid3X3,
  ChevronRight,
  Sparkles,
  Server,
  Lock,
  Zap,
} from 'lucide-react'
import { CloudStoragePanel } from './CloudStoragePanel'
import { TemporaryLinksPanel } from './TemporaryLinksPanel'
import { CollaborativePanel } from './CollaborativePanel'
import { GalleryPanel } from './GalleryPanel'

type FeaturePanel = 'none' | 'cloud' | 'links' | 'collab' | 'gallery'

interface CloudFeaturesPanelProps {
  isOpen: boolean
  onClose: () => void
}

const FEATURES = [
  {
    id: 'cloud' as const,
    name: 'Cloud Storage',
    description: 'Connect Google Drive, Dropbox, or OneDrive',
    icon: Cloud,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'links' as const,
    name: 'Temporary Links',
    description: 'Create shareable links with expiration',
    icon: Link2,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
  },
  {
    id: 'collab' as const,
    name: 'Collaborative View',
    description: 'View models together in real-time',
    icon: Users,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'gallery' as const,
    name: 'Community Gallery',
    description: 'Browse and share models publicly',
    icon: Grid3X3,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
]

/**
 * Main panel for accessing Phase 4 cloud features
 */
export function CloudFeaturesPanel({ isOpen, onClose }: CloudFeaturesPanelProps) {
  const theme = useThemeClasses()
  const [activePanel, setActivePanel] = useState<FeaturePanel>('none')

  if (!isOpen) return null

  // Show sub-panel if one is selected
  if (activePanel !== 'none') {
    return (
      <>
        {activePanel === 'cloud' && (
          <CloudStoragePanel
            isOpen={true}
            onClose={() => setActivePanel('none')}
          />
        )}
        {activePanel === 'links' && (
          <TemporaryLinksPanel
            isOpen={true}
            onClose={() => setActivePanel('none')}
          />
        )}
        {activePanel === 'collab' && (
          <CollaborativePanel
            isOpen={true}
            onClose={() => setActivePanel('none')}
          />
        )}
        {activePanel === 'gallery' && (
          <GalleryPanel
            isOpen={true}
            onClose={() => setActivePanel('none')}
          />
        )}
      </>
    )
  }

  return (
    <div
      className={cn(
        'fixed top-20 left-4 z-40',
        'w-80 overflow-hidden',
        'rounded-xl border border-white/10',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className={cn('w-5 h-5 text-yellow-400')} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Cloud Features
          </h3>
          <span className="px-1.5 py-0.5 text-[10px] rounded bg-yellow-500/20 text-yellow-300">
            Phase 4
          </span>
        </div>
        <button
          onClick={onClose}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-4 h-4', theme.textSecondary)} />
        </button>
      </div>

      {/* Backend Required Notice */}
      <div className="mx-4 mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-start gap-2">
          <Server className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-yellow-300">
              Backend Required
            </p>
            <p className="text-xs text-yellow-200/80 mt-1">
              These features need server infrastructure. The UI is ready -
              connect your backend to enable them.
            </p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="p-4 space-y-2">
        {FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActivePanel(feature.id)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg',
              'border transition-all',
              feature.bgColor,
              feature.borderColor,
              'hover:bg-opacity-20'
            )}
          >
            <div className={cn('p-2 rounded-lg bg-white/10')}>
              <feature.icon className={cn('w-5 h-5', feature.color)} />
            </div>
            <div className="flex-1 text-left">
              <p className={cn('text-sm font-medium', theme.textPrimary)}>
                {feature.name}
              </p>
              <p className={cn('text-xs', theme.textMuted)}>
                {feature.description}
              </p>
            </div>
            <ChevronRight className={cn('w-4 h-4', theme.textMuted)} />
          </button>
        ))}
      </div>

      {/* Benefits */}
      <div className="p-4 border-t border-white/10">
        <p className={cn('text-xs font-medium mb-2', theme.textMuted)}>
          When backend is connected:
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-3 h-3 text-green-400" />
            <span className={cn('text-xs', theme.textSecondary)}>
              Secure cloud storage access
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-3 h-3 text-blue-400" />
            <span className={cn('text-xs', theme.textSecondary)}>
              Shareable links with CDN hosting
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className={cn('text-xs', theme.textSecondary)}>
              Real-time collaboration via WebSocket
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-purple-400" />
            <span className={cn('text-xs', theme.textSecondary)}>
              Community profiles and galleries
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
