'use client'

import { useState } from 'react'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useCloudStorage } from '@/hooks/use-cloud-storage'
import { cn } from '@/lib/utils'
import {
  X,
  Cloud,
  HardDrive,
  FolderOpen,
  Upload,
  Download,
  Search,
  ChevronRight,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react'
import type { CloudProvider } from '@/types/cloud'

// Provider icons (simplified representations)
const providerIcons: Record<CloudProvider | 'local', React.ReactNode> = {
  'google-drive': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 19.5h6.5L12 14l3.5 5.5H22L12 2zm0 5.5l5 8.5H7l5-8.5z" />
    </svg>
  ),
  dropbox: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2L0 6l6 4-6 4 6 4 6-4-6-4 6-4-6-4zm12 0l-6 4 6 4-6 4 6 4 6-4-6-4 6-4-6-4zM6 14l6 4 6-4-6-4-6 4z" />
    </svg>
  ),
  onedrive: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.5 18.5c-2.5 0-4.5-2-4.5-4.5 0-1.5.7-2.8 1.8-3.7C8.2 8.4 9.5 7 11.5 7c1.2 0 2.2.5 3 1.2.7-.4 1.5-.7 2.5-.7 2.5 0 4.5 2 4.5 4.5 0 .4 0 .7-.1 1 1.2.7 2.1 2 2.1 3.5 0 2.2-1.8 4-4 4H10.5z" />
    </svg>
  ),
  local: <HardDrive className="w-5 h-5" />,
}

interface CloudStoragePanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Cloud Storage panel for connecting and browsing cloud providers
 * Phase 4 feature - requires backend integration
 */
export function CloudStoragePanel({ isOpen, onClose }: CloudStoragePanelProps) {
  const theme = useThemeClasses()
  const {
    providers,
    currentProvider,
    files,
    isLoading,
    error,
    searchQuery,
    isAvailable,
    connect,
    disconnect,
    setCurrentProvider,
    setSearchQuery,
    clearError,
  } = useCloudStorage()

  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null)

  if (!isOpen) return null

  const handleConnect = async (provider: CloudProvider) => {
    setSelectedProvider(provider)
    await connect(provider)
    setSelectedProvider(null)
  }

  return (
    <div
      className={cn(
        'fixed top-20 left-4 z-40',
        'w-80 max-h-[500px] overflow-hidden flex flex-col',
        'rounded-xl border border-white/10',
        theme.glassPanelDark
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Cloud className={cn('w-5 h-5', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Cloud Storage
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

      {/* Provider Selection */}
      <div className="p-4 space-y-2">
        <p className={cn('text-xs mb-2', theme.textMuted)}>Connect a provider:</p>

        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() =>
              provider.connected
                ? setCurrentProvider(provider.id)
                : handleConnect(provider.id)
            }
            disabled={isLoading || selectedProvider !== null}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-lg',
              'border border-white/10 transition-all',
              provider.connected
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-white/5 hover:bg-white/10',
              (isLoading || selectedProvider !== null) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className={cn('flex-shrink-0', theme.textPrimary)}>
              {providerIcons[provider.id]}
            </div>
            <div className="flex-1 text-left">
              <p className={cn('text-sm font-medium', theme.textPrimary)}>
                {provider.name}
              </p>
              {provider.connected && provider.email && (
                <p className={cn('text-xs', theme.textMuted)}>{provider.email}</p>
              )}
            </div>
            <div className="flex-shrink-0">
              {selectedProvider === provider.id ? (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              ) : provider.connected ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <ChevronRight className={cn('w-4 h-4', theme.textMuted)} />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Search (when connected) */}
      {currentProvider && (
        <div className="px-4 pb-2">
          <div className="relative">
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
              placeholder="Search files..."
              className={cn(
                'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
                'bg-white/5 border border-white/10',
                'placeholder-white/40 text-white',
                'focus:outline-none focus:border-white/30'
              )}
            />
          </div>
        </div>
      )}

      {/* File List (placeholder) */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {currentProvider ? (
          files.length > 0 ? (
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded',
                    'hover:bg-white/5 cursor-pointer transition-colors'
                  )}
                >
                  <FolderOpen className={cn('w-4 h-4', theme.textMuted)} />
                  <span className={cn('text-sm truncate', theme.textPrimary)}>
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn('text-center py-8', theme.textMuted)}>
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No files found</p>
              <p className="text-xs opacity-75">Connect to browse your files</p>
            </div>
          )
        ) : (
          <div className={cn('text-center py-8', theme.textMuted)}>
            <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Select a provider</p>
            <p className="text-xs opacity-75">to browse and import models</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <button
          disabled={!isAvailable}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs',
            'bg-blue-500/20 text-blue-300 transition-colors',
            isAvailable ? 'hover:bg-blue-500/30' : 'opacity-50 cursor-not-allowed'
          )}
        >
          <Upload className="w-3 h-3" />
          Upload
        </button>
        <button
          disabled={!isAvailable}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs',
            'bg-white/10 transition-colors',
            theme.textSecondary,
            isAvailable ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
          )}
        >
          <Download className="w-3 h-3" />
          Import
        </button>
      </div>
    </div>
  )
}
