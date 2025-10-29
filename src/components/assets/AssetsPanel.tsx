'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { X, FolderOpen, Film } from 'lucide-react'
import { CharactersTab } from './CharactersTab'
import { AnimationsTab } from './AnimationsTab'
import { StorageQuota } from './StorageQuota'

type TabType = 'characters' | 'animations'

export function AssetsPanel() {
  const theme = useThemeClasses()
  const assetPanelOpen = useViewerStore((state) => state.assetPanelOpen)
  const toggleAssetPanel = useViewerStore((state) => state.toggleAssetPanel)
  const clearAssetSelection = useViewerStore((state) => state.clearAssetSelection)

  const [activeTab, setActiveTab] = useState<TabType>('characters')

  if (!assetPanelOpen) return null

  const handleClose = () => {
    toggleAssetPanel()
    clearAssetSelection()
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    clearAssetSelection() // Clear selection when switching tabs
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50',
          'w-full md:w-[400px]',
          'flex flex-col',
          theme.glassPanelDark,
          'border-r-0 md:border-r border-white/10',
          'shadow-2xl'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className={cn('text-lg font-semibold', theme.textPrimary)}>
            Asset Library
          </h2>
          <button
            onClick={handleClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              'hover:bg-white/10'
            )}
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/10">
          <button
            onClick={() => handleTabChange('characters')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors',
              activeTab === 'characters'
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            )}
          >
            <FolderOpen className="w-4 h-4" />
            Characters
          </button>
          <button
            onClick={() => handleTabChange('animations')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors',
              activeTab === 'animations'
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            )}
          >
            <Film className="w-4 h-4" />
            Animations
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden p-4">
          {activeTab === 'characters' ? <CharactersTab /> : <AnimationsTab />}
        </div>

        {/* Footer - Storage Quota */}
        <div className="p-4 border-t border-white/10">
          <StorageQuota />
        </div>
      </div>
    </>
  )
}
