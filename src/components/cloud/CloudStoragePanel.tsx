'use client'

import { useState, useRef, useEffect } from 'react'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { useCloudStorage } from '@/hooks/use-cloud-storage'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  X,
  Cloud,
  FolderOpen,
  Upload,
  Download,
  Search,
  AlertCircle,
  Loader2,
  Trash2,
  FileBox,
  LogIn,
  User,
} from 'lucide-react'

interface CloudStoragePanelProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * Cloud Storage panel for managing models in Supabase Storage
 * Requires Supabase configuration (environment variables)
 */
export function CloudStoragePanel({ isOpen, onClose }: CloudStoragePanelProps) {
  const theme = useThemeClasses()
  const { user, isLoading: authLoading, isConfigured: authConfigured } = useAuth()
  const {
    files,
    isLoading,
    error,
    uploadProgress,
    isAvailable,
    listFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    clearError,
  } = useCloudStorage()

  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load files when user is authenticated
  useEffect(() => {
    if (user && isAvailable) {
      listFiles(user.id)
    }
  }, [user, isAvailable, listFiles])

  if (!isOpen) return null

  // Filter files by search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    await uploadFile(user.id, file, {
      name: file.name.replace(/\.[^/.]+$/, ''),
    })
    setIsUploading(false)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = async (filePath: string, fileName: string) => {
    const blob = await downloadFile(filePath)
    if (blob) {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleDelete = async (modelId: string, filePath: string) => {
    if (confirm('Are you sure you want to delete this model?')) {
      await deleteFile(modelId, filePath)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
              Not Configured
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

      {/* Not Configured State */}
      {!isAvailable && (
        <div className={cn('p-6 text-center', theme.textMuted)}>
          <Cloud className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium mb-2">Supabase Not Configured</p>
          <p className="text-xs opacity-75">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
            environment variables to enable cloud storage.
          </p>
        </div>
      )}

      {/* Auth Loading State */}
      {isAvailable && authLoading && (
        <div className={cn('p-6 text-center', theme.textMuted)}>
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin opacity-50" />
          <p className="text-xs">Loading authentication...</p>
        </div>
      )}

      {/* Not Authenticated State */}
      {isAvailable && !authLoading && !user && (
        <div className={cn('p-6 text-center', theme.textMuted)}>
          <LogIn className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium mb-2">Sign In Required</p>
          <p className="text-xs opacity-75 mb-4">
            Sign in to access your cloud storage and manage models.
          </p>
          <p className="text-[10px] opacity-50">
            Authentication UI coming soon
          </p>
        </div>
      )}

      {/* Authenticated Content */}
      {isAvailable && !authLoading && user && (
        <>
          {/* User Info */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
            <User className={cn('w-4 h-4', theme.textMuted)} />
            <span className={cn('text-xs truncate', theme.textSecondary)}>
              {user.email}
            </span>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
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
                placeholder="Search models..."
                className={cn(
                  'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
                  'bg-white/5 border border-white/10',
                  'placeholder-white/40 text-white',
                  'focus:outline-none focus:border-white/30'
                )}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && uploadProgress > 0 && (
            <div className="mx-4 mb-2">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className={cn('text-[10px] mt-1 text-center', theme.textMuted)}>
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* File List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {isLoading ? (
              <div className={cn('text-center py-8', theme.textMuted)}>
                <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin opacity-50" />
                <p className="text-xs">Loading models...</p>
              </div>
            ) : filteredFiles.length > 0 ? (
              <div className="space-y-1">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded',
                      'bg-white/5 hover:bg-white/10 transition-colors group'
                    )}
                  >
                    <FileBox className={cn('w-4 h-4 flex-shrink-0', theme.textMuted)} />
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm truncate', theme.textPrimary)}>
                        {file.name}
                      </p>
                      <p className={cn('text-[10px]', theme.textMuted)}>
                        {formatFileSize(file.size)}
                        {file.isPublic && ' • Public'}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(file.path, file.name)}
                        className={cn(
                          'p-1 rounded hover:bg-white/10 transition-colors',
                          theme.textMuted
                        )}
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id, file.path)}
                        className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={cn('text-center py-8', theme.textMuted)}>
                <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No models found</p>
                <p className="text-xs opacity-75">
                  {searchQuery ? 'Try a different search' : 'Upload a model to get started'}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-white/10">
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,.fbx,.obj,.stl"
              onChange={handleUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm',
                'bg-blue-500/20 text-blue-300 transition-colors',
                isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/30'
              )}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload Model'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
