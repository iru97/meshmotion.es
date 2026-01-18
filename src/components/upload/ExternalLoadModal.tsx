'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Globe, Download, AlertTriangle, X, Loader2 } from 'lucide-react'

interface ExternalFileInfo {
  url: string
  fileName: string
  domain: string
  extension: string
}

interface ExternalLoadModalProps {
  /** The external file info to display */
  fileInfo: ExternalFileInfo | null
  /** Whether the file is currently being loaded */
  isLoading: boolean
  /** Error message to display */
  error: string | null
  /** Whether the error is due to CORS blocking */
  isCorsBlocked?: boolean
  /** Called when user confirms the load */
  onConfirm: () => void
  /** Called to retry with CORS proxy */
  onRetryWithProxy?: () => void
  /** Called when user cancels */
  onCancel: () => void
  /** Called to clear error and retry */
  onClearError: () => void
}

export function ExternalLoadModal({
  fileInfo,
  isLoading,
  error,
  isCorsBlocked,
  onConfirm,
  onRetryWithProxy,
  onCancel,
  onClearError,
}: ExternalLoadModalProps) {
  const isOpen = fileInfo !== null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-lg glass-panel-dark p-0 overflow-hidden !bg-transparent border-white/10 [&>button]:hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <DialogTitle className="text-white text-xl font-semibold">
                Load External Model
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/60 text-sm">
              A 3D model link was detected in the URL. Would you like to load it?
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {/* File info card */}
          {fileInfo && (
            <div className="rounded-xl p-4 bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 shrink-0">
                  <Download className="w-4 h-4 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">
                    {fileInfo.fileName}
                  </div>
                  <div className="text-xs text-white/50 mt-1 truncate">
                    {fileInfo.domain}
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-white/10 text-xs text-white/70 uppercase">
                  {fileInfo.extension}
                </div>
              </div>

              {/* Full URL (collapsible/truncated) */}
              <div className="text-xs text-white/40 break-all line-clamp-2">
                {fileInfo.url}
              </div>
            </div>
          )}

          {/* Warning notice */}
          <div className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-200/80">
              <p className="font-medium mb-1">External Resource</p>
              <p>
                This file will be downloaded from an external server and saved to your
                browser storage. Only load files from sources you trust.
              </p>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className={`flex gap-3 p-3 rounded-lg ${isCorsBlocked ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <AlertTriangle className={`w-4 h-4 ${isCorsBlocked ? 'text-orange-500' : 'text-red-500'} shrink-0 mt-0.5`} />
              <div className={`text-xs ${isCorsBlocked ? 'text-orange-200/80' : 'text-red-200/80'} flex-1`}>
                <p className="font-medium mb-1">{isCorsBlocked ? 'CORS Blocked' : 'Error Loading File'}</p>
                <p>{error}</p>
                {isCorsBlocked && (
                  <p className="mt-2 text-white/50">
                    Note: The proxy routes your request through a third-party server (corsproxy.io).
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          {isCorsBlocked && onRetryWithProxy ? (
            <button
              onClick={onRetryWithProxy}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading via Proxy...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Use Proxy
                </>
              )}
            </button>
          ) : (
            <button
              onClick={error ? onClearError : onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-500/80 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : error ? (
                'Dismiss'
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Load & Save
                </>
              )}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
