'use client'

import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Search, SortAsc, SortDesc, X } from 'lucide-react'
import type { AssetFilter } from '@/types/assets'

interface SearchFilterBarProps {
  filter: AssetFilter
  onFilterChange: (filter: Partial<AssetFilter>) => void
  totalCount: number
  filteredCount: number
}

export function SearchFilterBar({ filter, onFilterChange, totalCount, filteredCount }: SearchFilterBarProps) {
  const theme = useThemeClasses()

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          placeholder="Search assets..."
          value={filter.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className={cn(
            'w-full pl-10 pr-10 py-2 text-sm rounded-lg',
            'bg-black/30 border border-white/10',
            'text-white placeholder:text-white/40',
            'focus:outline-none focus:ring-2 focus:ring-blue-400/50'
          )}
        />
        {filter.searchQuery && (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className={cn('text-xs', theme.textSecondary)}>Sort by:</span>

        <select
          value={filter.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs rounded-lg',
            'bg-black/30 border border-white/10',
            'text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50'
          )}
        >
          <option value="name">Name</option>
          <option value="date">Upload Date</option>
          <option value="size">File Size</option>
        </select>

        <button
          onClick={() => onFilterChange({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' })}
          className={cn(
            'p-2 rounded-lg transition-colors',
            'bg-black/30 hover:bg-white/10'
          )}
          title={filter.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {filter.sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4 text-white/70" />
          ) : (
            <SortDesc className="w-4 h-4 text-white/70" />
          )}
        </button>
      </div>

      {/* Results Count */}
      <div className={cn('text-xs text-center py-1', theme.textSecondary)}>
        Showing {filteredCount} of {totalCount} assets
      </div>
    </div>
  )
}
