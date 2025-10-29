'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useAssetManagement } from '@/hooks/use-asset-management'
import { useGLTFLoader } from '@/hooks/use-gltf-loader'
import { AssetCard } from './AssetCard'
import { SearchFilterBar } from './SearchFilterBar'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Trash2, CheckSquare, Square } from 'lucide-react'
import type { StoredFile } from '@/lib/storage/indexed-db'

export function CharactersTab() {
  const theme = useThemeClasses()
  const { loadGLBFile } = useGLTFLoader()

  const {
    characters,
    allAssets,
    filter,
    updateFilter,
    renameAsset,
    deleteAsset,
    deleteMultiple,
  } = useAssetManagement()

  const selectedAssets = useViewerStore((state) => state.selectedAssets)
  const toggleAssetSelection = useViewerStore((state) => state.toggleAssetSelection)
  const setSelectedAssets = useViewerStore((state) => state.setSelectedAssets)
  const clearAssetSelection = useViewerStore((state) => state.clearAssetSelection)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assetsToDelete, setAssetsToDelete] = useState<string[]>([])

  const totalCharacters = allAssets.filter((a) => a.type === 'mesh' || a.type === 'both').length

  const handleLoadAsset = async (asset: StoredFile) => {
    const file = new File([asset.blob], asset.name, { type: 'model/gltf-binary' })
    await loadGLBFile(file, 'mesh', true) // skipPersist = true (already in IndexedDB)
  }

  const handleDeleteSingle = (id: string) => {
    setAssetsToDelete([id])
    setDeleteDialogOpen(true)
  }

  const handleDeleteMultiple = () => {
    if (selectedAssets.length === 0) return
    setAssetsToDelete(selectedAssets)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (assetsToDelete.length === 1) {
      await deleteAsset(assetsToDelete[0])
    } else {
      await deleteMultiple(assetsToDelete)
    }
    setDeleteDialogOpen(false)
    setAssetsToDelete([])
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
    setAssetsToDelete([])
  }

  const toggleSelectAll = () => {
    if (selectedAssets.length === characters.length) {
      clearAssetSelection()
    } else {
      setSelectedAssets(characters.map((c) => c.id))
    }
  }

  const allSelected = characters.length > 0 && selectedAssets.length === characters.length

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter */}
      <div className="mb-4">
        <SearchFilterBar
          filter={filter}
          onFilterChange={updateFilter}
          totalCount={totalCharacters}
          filteredCount={characters.length}
        />
      </div>

      {/* Bulk Actions Bar */}
      {selectedAssets.length > 0 && (
        <div
          className={cn(
            'flex items-center justify-between p-3 mb-4 rounded-lg',
            'bg-blue-500/10 border border-blue-400/30'
          )}
        >
          <span className={cn('text-sm', theme.textPrimary)}>
            {selectedAssets.length} selected
          </span>
          <button
            onClick={handleDeleteMultiple}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
              'bg-red-500/20 hover:bg-red-500/30 text-red-400'
            )}
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Select All */}
      {characters.length > 0 && (
        <div className="flex items-center gap-2 mb-3 px-1">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Select All
          </button>
        </div>
      )}

      {/* Asset Grid */}
      <div className="flex-1 overflow-y-auto pr-2">
        {characters.length === 0 ? (
          <div className={cn('text-center py-12', theme.textSecondary)}>
            <p className="text-sm">No characters found</p>
            <p className="text-xs mt-2">Upload a GLB file with mesh data</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {characters.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                isSelected={selectedAssets.includes(asset.id)}
                onSelect={toggleAssetSelection}
                onDelete={handleDeleteSingle}
                onRename={renameAsset}
                onLoad={handleLoadAsset}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        assetCount={assetsToDelete.length}
        assetNames={assetsToDelete.map((id) => {
          const asset = allAssets.find((a) => a.id === id)
          return asset?.customName || asset?.name || 'Unknown'
        })}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
