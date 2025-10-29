'use client'

import { useState } from 'react'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import type { StoredFile } from '@/lib/storage/indexed-db'

interface AssetCardProps {
  asset: StoredFile
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
  onLoad: (asset: StoredFile) => void
}

export function AssetCard({ asset, isSelected, onSelect, onDelete, onRename, onLoad }: AssetCardProps) {
  const theme = useThemeClasses()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(asset.customName || asset.name)

  const displayName = asset.customName || asset.name
  const fileSize = formatFileSize(asset.size || 0)
  const uploadDate = new Date(asset.uploadedAt).toLocaleDateString()

  const handleRename = () => {
    if (editName.trim() && editName !== displayName) {
      onRename(asset.id, editName.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(asset.customName || asset.name)
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg transition-all duration-200 cursor-pointer',
        theme.glassPanelDark,
        theme.hover,
        isSelected && 'ring-2 ring-blue-400/50 bg-white/10'
      )}
      onClick={() => !isEditing && onSelect(asset.id)}
    >
      {/* Header with checkbox and type badge */}
      <div className="flex items-start justify-between mb-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation()
            onSelect(asset.id)
          }}
          className="mt-1 w-4 h-4 rounded border-white/30"
          onClick={(e) => e.stopPropagation()}
        />
        <span
          className={cn(
            'px-2 py-1 text-xs rounded-full',
            asset.type === 'mesh' && 'bg-blue-500/20 text-blue-300',
            asset.type === 'animations' && 'bg-purple-500/20 text-purple-300',
            asset.type === 'both' && 'bg-green-500/20 text-green-300'
          )}
        >
          {asset.type === 'mesh' ? 'Character' : asset.type === 'animations' ? 'Animation' : 'Both'}
        </span>
      </div>

      {/* Name (editable) */}
      <div className="mb-2">
        {isEditing ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                if (e.key === 'Escape') handleCancel()
              }}
              className={cn(
                'flex-1 px-2 py-1 text-sm rounded border bg-black/30',
                'border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50'
              )}
              autoFocus
            />
            <button
              onClick={handleRename}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Check className="w-4 h-4 text-green-400" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        ) : (
          <h3 className={cn('text-sm font-medium truncate', theme.textPrimary)}>
            {displayName}
          </h3>
        )}
      </div>

      {/* Metadata */}
      <div className={cn('text-xs space-y-1 mb-3', theme.textSecondary)}>
        <div className="flex justify-between">
          <span>Size:</span>
          <span>{fileSize}</span>
        </div>
        <div className="flex justify-between">
          <span>Uploaded:</span>
          <span>{uploadDate}</span>
        </div>
        {asset.vertices !== undefined && (
          <div className="flex justify-between">
            <span>Vertices:</span>
            <span>{asset.vertices.toLocaleString()}</span>
          </div>
        )}
        {asset.animations !== undefined && asset.animations > 0 && (
          <div className="flex justify-between">
            <span>Animations:</span>
            <span>{asset.animations}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {asset.tags && asset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {asset.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                'bg-white/10 text-white/70'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLoad(asset)
          }}
          className={cn(
            'flex-1 px-3 py-1.5 text-xs rounded transition-colors',
            'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
          )}
        >
          Load
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          title="Rename"
        >
          <Edit2 className="w-4 h-4 text-white/70" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(asset.id)
          }}
          className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
