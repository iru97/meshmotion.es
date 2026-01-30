'use client'

import { useState, useMemo } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useShareUrl } from '@/hooks/use-share-url'
import { cn } from '@/lib/utils'
import { Share2, X, Copy, Check, QrCode, Link2, Settings, Play, Info } from 'lucide-react'

interface ShareOptions {
  includeSettings: boolean
  includeAnimation: boolean
}

export function ShareModal() {
  const theme = useThemeClasses()
  const shareModalOpen = useViewerStore((state) => state.shareModalOpen)
  const setShareModalOpen = useViewerStore((state) => state.setShareModalOpen)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  const { generateShareUrl, copyToClipboard } = useShareUrl()

  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [options, setOptions] = useState<ShareOptions>({
    includeSettings: true,
    includeAnimation: true,
  })

  // Check if the model URL is a remote URL (not a blob)
  const isRemoteUrl = currentCharacter?.url?.startsWith('http')

  const shareResult = useMemo(() => {
    if (!currentCharacter) return null

    // For shareable URLs, we need the model URL
    // If the model was loaded from a remote URL, use that
    // Otherwise, show a placeholder
    const modelUrl = isRemoteUrl ? currentCharacter.url : 'YOUR_MODEL_URL'

    return generateShareUrl(modelUrl, {
      includeSettings: options.includeSettings,
      includeAnimation: options.includeAnimation,
    })
  }, [currentCharacter, generateShareUrl, options, isRemoteUrl])

  const qrCodeUrl = useMemo(() => {
    if (!shareResult?.url) return ''
    // Use a public QR code API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareResult.url)}`
  }, [shareResult?.url])

  if (!shareModalOpen) return null

  const handleClose = () => setShareModalOpen(false)

  const handleCopy = async () => {
    if (!shareResult?.url) return

    const success = await copyToClipboard(shareResult.url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-lg max-h-[90vh] overflow-y-auto',
          'p-6 rounded-xl border border-white/10',
          theme.glassPanelDark
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Share2 className={cn('w-5 h-5', theme.textPrimary)} />
            <h2 className={cn('text-xl font-semibold', theme.textPrimary)}>
              Share Model
            </h2>
          </div>
          <button
            onClick={handleClose}
            className={cn('p-2 rounded-full transition-colors', theme.hoverSubtle)}
          >
            <X className={cn('w-5 h-5', theme.textSecondary)} />
          </button>
        </div>

        {/* Info - Show if model wasn't loaded from URL */}
        {!isRemoteUrl && (
          <div className="mb-6 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className={cn('text-sm', theme.textSecondary)}>
                To share this model, you need to host the GLB file somewhere accessible and replace <code className="bg-white/10 px-1 rounded">YOUR_MODEL_URL</code> in the link with the actual URL.
              </p>
            </div>
          </div>
        )}

        {/* URL Preview */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
            Shareable Link
          </label>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/5',
                'text-sm text-white/80 font-mono truncate'
              )}
              title={shareResult?.url}
            >
              {shareResult?.url || 'No model loaded'}
            </div>
            <button
              onClick={handleCopy}
              disabled={!shareResult?.url}
              className={cn(
                'p-2 rounded-lg transition-colors',
                shareResult?.url
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              )}
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
          {copied && (
            <p className="mt-2 text-sm text-green-400">Link copied to clipboard!</p>
          )}
        </div>

        {/* Include Options */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-3', theme.textSecondary)}>
            Include in Link
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSettings}
                onChange={(e) => setOptions({ ...options, includeSettings: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex items-center gap-2">
                <Settings className={cn('w-4 h-4', theme.textMuted)} />
                <div>
                  <span className={cn('text-sm', theme.textPrimary)}>Viewer Settings</span>
                  <p className={cn('text-xs', theme.textMuted)}>Lighting, material, environment presets</p>
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeAnimation}
                onChange={(e) => setOptions({ ...options, includeAnimation: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
              />
              <div className="flex items-center gap-2">
                <Play className={cn('w-4 h-4', theme.textMuted)} />
                <div>
                  <span className={cn('text-sm', theme.textPrimary)}>Animation State</span>
                  <p className={cn('text-xs', theme.textMuted)}>Autoplay, speed, loop, selected animation</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Included Parameters */}
        {shareResult && Object.keys(shareResult.params).length > 1 && (
          <div className="mb-6">
            <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
              Included Parameters
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(shareResult.params).map(([key, value]) => (
                key !== 'model' && (
                  <span
                    key={key}
                    className={cn(
                      'px-2 py-1 rounded text-xs font-mono',
                      'bg-white/10 border border-white/10',
                      theme.textMuted
                    )}
                  >
                    {key}={value}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {/* QR Code Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowQR(!showQR)}
            className={cn(
              'flex items-center gap-2 text-sm transition-colors',
              theme.textSecondary,
              'hover:text-white'
            )}
          >
            <QrCode className="w-4 h-4" />
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </button>

          {showQR && shareResult?.url && (
            <div className="mt-4 flex justify-center">
              <div className="p-4 bg-white rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="block"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className={cn(
              'px-4 py-2 rounded-lg border border-white/10 transition-colors',
              theme.textSecondary,
              theme.hoverSubtle
            )}
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            disabled={!shareResult?.url}
            className={cn(
              'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
              shareResult?.url
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
