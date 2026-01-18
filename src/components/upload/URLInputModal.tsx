'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Link2, Download, AlertTriangle, X, Loader2 } from 'lucide-react'
import { useGLTFLoader } from '@/hooks/use-gltf-loader'

interface URLInputModalProps {
  open: boolean
  onClose: () => void
}

const SUPPORTED_EXTENSIONS = ['glb', 'gltf', 'fbx', 'obj', 'dae', 'stl', 'ply', '3ds']

function parseAndValidateURL(input: string): { valid: boolean; url?: string; fileName?: string; domain?: string; extension?: string; error?: string } {
  const trimmed = input.trim()

  if (!trimmed) {
    return { valid: false, error: 'Please enter a URL' }
  }

  try {
    const urlObj = new URL(trimmed)
    const pathname = urlObj.pathname
    const fileName = pathname.split('/').pop() || 'model'
    const extension = fileName.split('.').pop()?.toLowerCase() || ''

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `Unsupported format ".${extension}". Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`
      }
    }

    return {
      valid: true,
      url: trimmed,
      fileName,
      domain: urlObj.hostname,
      extension,
    }
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }
}

export function URLInputModal({ open, onClose }: URLInputModalProps) {
  const { loadGLBFile } = useGLTFLoader()

  const [urlInput, setUrlInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    if (isLoading) return
    setUrlInput('')
    setError(null)
    onClose()
  }, [isLoading, onClose])

  const handleLoad = useCallback(async () => {
    const validation = parseAndValidateURL(urlInput)

    if (!validation.valid) {
      setError(validation.error || 'Invalid URL')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(validation.url!, { mode: 'cors' })

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      const mimeType = blob.type || 'model/gltf-binary'
      const file = new File([blob], validation.fileName!, { type: mimeType })

      let result = await loadGLBFile(file)

      // If file has both mesh and animations, auto-select "both"
      if (result.success && result.needsSelection) {
        result = await loadGLBFile(file, 'both')
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to load model')
      }

      // Success - close modal
      setUrlInput('')
      setError(null)
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load file'

      if (err instanceof TypeError && message.includes('fetch')) {
        setError(`CORS error: The server doesn't allow cross-origin requests. Try downloading the file manually.`)
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [urlInput, loadGLBFile, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLoad()
    }
  }, [handleLoad, isLoading])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-lg glass-panel-dark p-0 overflow-hidden !bg-transparent border-white/10 [&>button]:hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Link2 className="w-5 h-5 text-blue-400" />
              </div>
              <DialogTitle className="text-white text-xl font-semibold">
                Load from URL
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/60 text-sm">
              Enter a direct link to a 3D model file
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm text-white/70">Model URL</label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value)
                setError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com/model.glb"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50"
              autoFocus
            />
          </div>

          {/* Supported formats hint */}
          <div className="text-xs text-white/40">
            Supported formats: {SUPPORTED_EXTENSIONS.map(ext => `.${ext}`).join(', ')}
          </div>

          {/* Warning notice */}
          <div className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-200/80">
              The file will be downloaded and saved to your browser storage. Only load from trusted sources.
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="flex gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="text-xs text-red-200/80">{error}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            disabled={isLoading || !urlInput.trim()}
            className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500/80 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Load Model
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
