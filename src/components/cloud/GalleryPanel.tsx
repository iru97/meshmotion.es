'use client'

import { useState } from 'react'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useGallery } from '@/hooks/use-gallery'
import { cn } from '@/lib/utils'
import {
  X,
  Grid3X3,
  Search,
  Upload,
  Heart,
  Eye,
  Download,
  User,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  Filter,
  ChevronDown,
} from 'lucide-react'
import type { ModelCategory } from '@/types/cloud'

const CATEGORIES: { value: ModelCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'characters', label: 'Characters' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'nature', label: 'Nature' },
  { value: 'props', label: 'Props' },
  { value: 'weapons', label: 'Weapons' },
  { value: 'animals', label: 'Animals' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'other', label: 'Other' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'downloads', label: 'Most Downloaded' },
]

interface GalleryPanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Panel for browsing the community gallery
 * Phase 4 feature - requires backend API
 */
export function GalleryPanel({ isOpen, onClose }: GalleryPanelProps) {
  const theme = useThemeClasses()
  const {
    featuredModels,
    recentModels,
    popularModels,
    searchResults,
    isLoading,
    error,
    isAvailable,
    searchModels,
    clearSearch,
    clearError,
  } = useGallery()

  const [activeTab, setActiveTab] = useState<'featured' | 'recent' | 'popular' | 'search'>(
    'featured'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<ModelCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState('recent')

  if (!isOpen) return null

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setActiveTab('search')
    await searchModels(searchQuery, {
      category: category === 'all' ? undefined : category,
      sortBy: sortBy as 'recent' | 'popular' | 'views' | 'downloads',
    })
  }

  const models =
    activeTab === 'featured'
      ? featuredModels
      : activeTab === 'recent'
        ? recentModels
        : activeTab === 'popular'
          ? popularModels
          : searchResults

  return (
    <div
      className={cn(
        'fixed top-20 left-4 z-40',
        'w-96 max-h-[600px] overflow-hidden flex flex-col',
        'rounded-xl border border-white/10',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Grid3X3 className={cn('w-5 h-5', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Community Gallery
          </h3>
          {!isAvailable && (
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-yellow-500/20 text-yellow-300">
              Coming Soon
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className={cn('p-1 rounded transition-colors', theme.hoverSubtle)}
        >
          <X className={cn('w-4 h-4', theme.textSecondary)} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-300">{error}</p>
              <button
                onClick={clearError}
                className="text-[10px] text-yellow-400 hover:underline mt-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4',
                theme.textMuted
              )}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search models..."
              className={cn(
                'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
                'bg-white/5 border border-white/10 text-white',
                'placeholder-white/40',
                'focus:outline-none focus:border-white/30'
              )}
            />
          </div>
          <button
            onClick={handleSearch}
            className={cn(
              'px-4 py-2 rounded-lg',
              'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
            )}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ModelCategory | 'all')}
            className={cn(
              'flex-1 px-3 py-1.5 rounded-lg text-xs',
              'bg-white/5 border border-white/10 text-white',
              'focus:outline-none'
            )}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-gray-900">
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(
              'flex-1 px-3 py-1.5 rounded-lg text-xs',
              'bg-white/5 border border-white/10 text-white',
              'focus:outline-none'
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {[
          { id: 'featured', label: 'Featured', icon: Star },
          { id: 'recent', label: 'Recent', icon: Clock },
          { id: 'popular', label: 'Popular', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1 py-2 text-xs',
              'border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-300'
                : 'border-transparent text-white/60 hover:text-white/80'
            )}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Models Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {models.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {models.map((model) => (
              <div
                key={model.id}
                className={cn(
                  'rounded-lg overflow-hidden',
                  'bg-white/5 border border-white/10',
                  'hover:border-white/20 transition-colors cursor-pointer'
                )}
              >
                {/* Thumbnail */}
                <div className="aspect-square bg-white/5 relative">
                  {model.thumbnailUrl ? (
                    <img
                      src={model.thumbnailUrl}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid3X3 className={cn('w-8 h-8', theme.textMuted)} />
                    </div>
                  )}

                  {/* Stats Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 text-[10px] text-white/80">
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        {model.viewCount}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Heart className="w-3 h-3" />
                        {model.likeCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2">
                  <p
                    className={cn(
                      'text-xs font-medium truncate',
                      theme.textPrimary
                    )}
                  >
                    {model.name}
                  </p>
                  <p className={cn('text-[10px] truncate', theme.textMuted)}>
                    by {model.author?.displayName || 'Unknown'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('text-center py-12', theme.textMuted)}>
            <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No models yet</p>
            <p className="text-xs opacity-75 mt-1">
              {isAvailable
                ? 'Be the first to upload!'
                : 'Gallery will be available soon'}
            </p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="p-4 border-t border-white/10">
        <button
          disabled={!isAvailable}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs',
            'bg-blue-500/20 text-blue-300',
            isAvailable ? 'hover:bg-blue-500/30' : 'opacity-50 cursor-not-allowed'
          )}
        >
          <Upload className="w-4 h-4" />
          Upload Model
        </button>
      </div>
    </div>
  )
}
