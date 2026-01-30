'use client'

import { useState, useMemo } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Code, X, Copy, Check, ExternalLink } from 'lucide-react'

interface EmbedOptions {
  width: string
  height: string
  autoplay: boolean
  hideUI: boolean
  loop: boolean
  bgColor: string
  responsive: boolean
}

export function EmbedCodeModal() {
  const theme = useThemeClasses()
  const embedModalOpen = useViewerStore((state) => state.embedModalOpen)
  const setEmbedModalOpen = useViewerStore((state) => state.setEmbedModalOpen)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)

  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<EmbedOptions>({
    width: '800',
    height: '600',
    autoplay: false,
    hideUI: false,
    loop: true,
    bgColor: '000000',
    responsive: true,
  })

  const embedUrl = useMemo(() => {
    if (!currentCharacter) return ''

    // For now, we'll use a placeholder since models need to be hosted
    // In production, this would be a URL to the model
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const params = new URLSearchParams()

    // Note: In a real implementation, the model URL would be stored/hosted
    // For local models, users would need to host them somewhere
    params.set('model', 'YOUR_MODEL_URL')

    if (options.autoplay) params.set('autoplay', 'true')
    if (options.hideUI) params.set('hideUI', 'true')
    if (!options.loop) params.set('loop', 'false')
    if (options.bgColor !== '000000') params.set('bg', options.bgColor)

    return `${baseUrl}/embed?${params.toString()}`
  }, [currentCharacter, options])

  const embedCode = useMemo(() => {
    if (options.responsive) {
      return `<div style="position: relative; width: 100%; padding-bottom: ${(parseInt(options.height) / parseInt(options.width) * 100).toFixed(1)}%; overflow: hidden;">
  <iframe
    src="${embedUrl}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    allow="autoplay; fullscreen; xr-spatial-tracking"
    allowfullscreen
  ></iframe>
</div>`
    }

    return `<iframe
  src="${embedUrl}"
  width="${options.width}"
  height="${options.height}"
  style="border: 0;"
  allow="autoplay; fullscreen; xr-spatial-tracking"
  allowfullscreen
></iframe>`
  }, [embedUrl, options])

  if (!embedModalOpen) return null

  const handleClose = () => setEmbedModalOpen(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = embedCode
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePreview = () => {
    window.open(embedUrl, '_blank')
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
          'w-full max-w-2xl max-h-[90vh] overflow-y-auto',
          'p-6 rounded-xl border border-white/10',
          theme.glassPanelDark
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Code className={cn('w-5 h-5', theme.textPrimary)} />
            <h2 className={cn('text-xl font-semibold', theme.textPrimary)}>
              Embed Code
            </h2>
          </div>
          <button
            onClick={handleClose}
            className={cn('p-2 rounded-full transition-colors', theme.hoverSubtle)}
          >
            <X className={cn('w-5 h-5', theme.textSecondary)} />
          </button>
        </div>

        {/* Info */}
        <div className="mb-6 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className={cn('text-sm', theme.textSecondary)}>
            To embed your model, you need to host the GLB file somewhere accessible (like a CDN or file hosting service) and replace <code className="bg-white/10 px-1 rounded">YOUR_MODEL_URL</code> with the actual URL.
          </p>
        </div>

        {/* Size Options */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
              Width (px)
            </label>
            <input
              type="number"
              value={options.width}
              onChange={(e) => setOptions({ ...options, width: e.target.value })}
              disabled={options.responsive}
              className={cn(
                'w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5',
                'text-white placeholder-white/40',
                'focus:outline-none focus:border-blue-500',
                options.responsive && 'opacity-50'
              )}
            />
          </div>
          <div>
            <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
              Height (px)
            </label>
            <input
              type="number"
              value={options.height}
              onChange={(e) => setOptions({ ...options, height: e.target.value })}
              disabled={options.responsive}
              className={cn(
                'w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5',
                'text-white placeholder-white/40',
                'focus:outline-none focus:border-blue-500',
                options.responsive && 'opacity-50'
              )}
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <span className={cn('text-sm', theme.textMuted)}>#</span>
            <input
              type="text"
              value={options.bgColor}
              onChange={(e) => setOptions({ ...options, bgColor: e.target.value.replace('#', '') })}
              maxLength={6}
              placeholder="000000"
              className={cn(
                'w-24 px-3 py-2 rounded-lg border border-white/10 bg-white/5',
                'text-white placeholder-white/40 font-mono',
                'focus:outline-none focus:border-blue-500'
              )}
            />
            <div
              className="w-8 h-8 rounded border border-white/20"
              style={{ backgroundColor: `#${options.bgColor}` }}
            />
          </div>
        </div>

        {/* Toggle Options */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.responsive}
              onChange={(e) => setOptions({ ...options, responsive: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <div>
              <span className={cn('text-sm', theme.textPrimary)}>Responsive</span>
              <p className={cn('text-xs', theme.textMuted)}>Scales to container width</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.autoplay}
              onChange={(e) => setOptions({ ...options, autoplay: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <div>
              <span className={cn('text-sm', theme.textPrimary)}>Autoplay animation</span>
              <p className={cn('text-xs', theme.textMuted)}>Start playing when loaded</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.loop}
              onChange={(e) => setOptions({ ...options, loop: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <div>
              <span className={cn('text-sm', theme.textPrimary)}>Loop animation</span>
              <p className={cn('text-xs', theme.textMuted)}>Repeat animation continuously</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.hideUI}
              onChange={(e) => setOptions({ ...options, hideUI: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
            />
            <div>
              <span className={cn('text-sm', theme.textPrimary)}>Hide controls</span>
              <p className={cn('text-xs', theme.textMuted)}>Remove play button and watermark</p>
            </div>
          </label>
        </div>

        {/* Code Preview */}
        <div className="mb-6">
          <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
            Embed Code
          </label>
          <div className="relative">
            <pre
              className={cn(
                'p-4 rounded-lg border border-white/10 bg-black/30',
                'text-xs text-white/80 font-mono overflow-x-auto'
              )}
            >
              {embedCode}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePreview}
            className={cn(
              'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
              'border border-white/10',
              theme.textSecondary,
              theme.hoverSubtle
            )}
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </button>

          <div className="flex gap-3">
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
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
                'bg-blue-600 hover:bg-blue-500 text-white'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
