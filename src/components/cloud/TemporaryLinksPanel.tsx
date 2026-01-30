'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useTemporaryLinks } from '@/hooks/use-temporary-links'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  X,
  Link2,
  Clock,
  Copy,
  Trash2,
  ExternalLink,
  QrCode,
  AlertCircle,
  Loader2,
  Plus,
  Eye,
  Lock,
} from 'lucide-react'
import type { LinkExpiry, ViewerLinkSettings } from '@/types/cloud'

const EXPIRY_OPTIONS: { value: LinkExpiry; label: string }[] = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: 'never', label: 'Never' },
]

interface TemporaryLinksPanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Panel for creating and managing temporary shareable links
 * Phase 4 feature - requires backend CDN
 */
export function TemporaryLinksPanel({ isOpen, onClose }: TemporaryLinksPanelProps) {
  const theme = useThemeClasses()
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const { user } = useAuth()

  const {
    links,
    isUploading,
    uploadProgress,
    isLoading,
    error,
    isAvailable,
    createLink,
    deleteLink,
    generatePreviewUrl,
    clearError,
  } = useTemporaryLinks()

  const [isCreating, setIsCreating] = useState(false)
  const [expiry, setExpiry] = useState<LinkExpiry>('24h')
  const [password, setPassword] = useState('')
  const [settings, setSettings] = useState<ViewerLinkSettings>({
    autoplay: false,
    hideUI: false,
    backgroundColor: '#000000',
  })

  if (!isOpen) return null

  const handleCreate = async () => {
    if (!currentCharacter || !user) return

    // For now, show the preview URL that would be generated
    const previewUrl = generatePreviewUrl(settings)
    console.log('Preview URL:', previewUrl)

    await createLink(user.id, {
      modelFile: new Blob(), // Would be the actual model
      modelName: currentCharacter.name,
      expiry,
      settings,
      password: password || undefined,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
          <Link2 className={cn('w-5 h-5', theme.textPrimary)} />
          <h3 className={cn('text-sm font-semibold', theme.textPrimary)}>
            Temporary Links
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

      {/* Create New Link */}
      {isCreating ? (
        <div className="p-4 space-y-3 border-b border-white/10">
          <p className={cn('text-xs font-medium', theme.textPrimary)}>
            Create Link for: {currentCharacter?.name || 'No model loaded'}
          </p>

          {/* Expiry Selection */}
          <div>
            <label className={cn('block text-xs mb-1', theme.textMuted)}>
              Link Expiry
            </label>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value as LinkExpiry)}
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm',
                'bg-white/5 border border-white/10 text-white',
                'focus:outline-none focus:border-white/30'
              )}
            >
              {EXPIRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-gray-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password Protection */}
          <div>
            <label className={cn('block text-xs mb-1', theme.textMuted)}>
              Password (optional)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty for no password"
              className={cn(
                'w-full px-3 py-2 rounded-lg text-sm',
                'bg-white/5 border border-white/10 text-white',
                'placeholder-white/40',
                'focus:outline-none focus:border-white/30'
              )}
            />
          </div>

          {/* Settings */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoplay}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, autoplay: e.target.checked }))
                }
                className="w-3 h-3 rounded"
              />
              <span className={cn('text-xs', theme.textSecondary)}>
                Autoplay animation
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hideUI}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, hideUI: e.target.checked }))
                }
                className="w-3 h-3 rounded"
              />
              <span className={cn('text-xs', theme.textSecondary)}>
                Hide UI controls
              </span>
            </label>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-1">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className={cn('text-xs text-center', theme.textMuted)}>
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!currentCharacter || isUploading}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs',
                'bg-blue-500/20 text-blue-300',
                currentCharacter && !isUploading
                  ? 'hover:bg-blue-500/30'
                  : 'opacity-50 cursor-not-allowed'
              )}
            >
              {isUploading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Link2 className="w-3 h-3" />
              )}
              Create Link
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className={cn(
                'px-4 py-2 rounded-lg text-xs',
                'bg-white/10 hover:bg-white/20',
                theme.textSecondary
              )}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <button
            onClick={() => setIsCreating(true)}
            disabled={!currentCharacter}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs',
              'bg-white/10 transition-colors',
              theme.textSecondary,
              currentCharacter ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
            )}
          >
            <Plus className="w-3 h-3" />
            Create New Link
          </button>
        </div>
      )}

      {/* Links List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {links.length > 0 ? (
          <div className="space-y-2">
            {links.map((link) => (
              <div
                key={link.id}
                className={cn(
                  'p-3 rounded-lg bg-white/5 border border-white/10',
                  !link.isActive && 'opacity-50'
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className={cn('text-sm font-medium', theme.textPrimary)}>
                      {link.modelName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className={cn('w-3 h-3', theme.textMuted)} />
                      <span className={cn('text-xs', theme.textMuted)}>
                        Expires: {link.expiresAt || 'Never'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => user && deleteLink(user.id, link.id, link.shortCode)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <Eye className={cn('w-3 h-3', theme.textMuted)} />
                  <span className={cn('text-xs', theme.textMuted)}>
                    {link.viewCount} views
                  </span>
                  {link.password && (
                    <>
                      <Lock className={cn('w-3 h-3 ml-2', theme.textMuted)} />
                      <span className={cn('text-xs', theme.textMuted)}>
                        Protected
                      </span>
                    </>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(link.shortUrl)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs',
                      'bg-white/10 hover:bg-white/20',
                      theme.textSecondary
                    )}
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                  <button
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs',
                      'bg-white/10 hover:bg-white/20',
                      theme.textSecondary
                    )}
                  >
                    <QrCode className="w-3 h-3" />
                    QR
                  </button>
                  <button
                    onClick={() => window.open(link.shortUrl, '_blank')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs',
                      'bg-white/10 hover:bg-white/20',
                      theme.textSecondary
                    )}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('text-center py-8', theme.textMuted)}>
            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No links created</p>
            <p className="text-xs opacity-75">
              Create a link to share your model
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
