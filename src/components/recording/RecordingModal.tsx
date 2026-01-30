'use client'

import { useState } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { useVideoRecorder, type VideoFormat, type VideoDuration, type VideoQuality } from '@/hooks/use-video-recorder'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { Video, X, Circle, Square } from 'lucide-react'

const FORMAT_OPTIONS: { value: VideoFormat; label: string; description: string }[] = [
  { value: 'webm', label: 'WebM', description: 'Best quality, smaller size' },
  { value: 'gif', label: 'GIF', description: 'Universal, easy to share' },
]

const DURATION_OPTIONS: { value: VideoDuration; label: string }[] = [
  { value: '3s', label: '3 seconds' },
  { value: '5s', label: '5 seconds' },
  { value: '10s', label: '10 seconds' },
  { value: 'full', label: 'Full animation' },
]

const QUALITY_OPTIONS: { value: VideoQuality; label: string; description: string }[] = [
  { value: 'social', label: 'Social', description: '30fps, optimized for sharing' },
  { value: 'high', label: 'High', description: '60fps, best quality' },
]

export function RecordingModal() {
  const theme = useThemeClasses()
  const recordingModalOpen = useViewerStore((state) => state.recordingModalOpen)
  const setRecordingModalOpen = useViewerStore((state) => state.setRecordingModalOpen)
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const duration = useViewerStore((state) => state.duration)

  const { startRecording, stopRecording, isRecording, progress, error } = useVideoRecorder()

  const [format, setFormat] = useState<VideoFormat>('webm')
  const [videoDuration, setVideoDuration] = useState<VideoDuration>('5s')
  const [quality, setQuality] = useState<VideoQuality>('social')
  const [turntable, setTurntable] = useState(false)
  const [hideUI, setHideUI] = useState(true)
  const [filename, setFilename] = useState('')

  if (!recordingModalOpen) return null

  const handleClose = () => {
    if (isRecording) {
      stopRecording()
    }
    setRecordingModalOpen(false)
  }

  const handleRecord = async () => {
    await startRecording({
      format,
      duration: videoDuration,
      quality,
      turntable,
      hideUI,
      filename: filename.trim() || undefined,
    })
  }

  const handleStop = () => {
    stopRecording()
  }

  const defaultFilename = currentCharacter?.name.replace(/\.(glb|gltf)$/i, '') || 'meshmotion'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={!isRecording ? handleClose : undefined}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-md max-h-[90vh] overflow-y-auto',
          'p-6 rounded-xl border border-white/10',
          theme.glassPanelDark
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Video className={cn('w-5 h-5', theme.textPrimary)} />
            <h2 className={cn('text-xl font-semibold', theme.textPrimary)}>
              Record Video
            </h2>
          </div>
          {!isRecording && (
            <button
              onClick={handleClose}
              className={cn('p-2 rounded-full transition-colors', theme.hoverSubtle)}
            >
              <X className={cn('w-5 h-5', theme.textSecondary)} />
            </button>
          )}
        </div>

        {/* Recording Progress */}
        {isRecording && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3 text-red-500 animate-pulse fill-red-500" />
                <span className={cn('text-sm font-medium', theme.textPrimary)}>Recording...</span>
              </div>
              <span className={cn('text-sm', theme.textSecondary)}>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Format Selection */}
        {!isRecording && (
          <>
            <div className="mb-6">
              <label className={cn('block text-sm font-medium mb-3', theme.textSecondary)}>
                Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FORMAT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormat(option.value)}
                    className={cn(
                      'p-3 rounded-lg border transition-all text-left',
                      format === option.value
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className={cn('font-medium', theme.textPrimary)}>{option.label}</div>
                    <div className={cn('text-xs mt-1', theme.textMuted)}>{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div className="mb-6">
              <label className={cn('block text-sm font-medium mb-3', theme.textSecondary)}>
                Duration
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setVideoDuration(option.value)}
                    disabled={option.value === 'full' && !duration}
                    className={cn(
                      'p-3 rounded-lg border transition-all text-center',
                      videoDuration === option.value
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-white/10 hover:border-white/20',
                      option.value === 'full' && !duration && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn('font-medium', theme.textPrimary)}>{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Selection */}
            <div className="mb-6">
              <label className={cn('block text-sm font-medium mb-3', theme.textSecondary)}>
                Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUALITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQuality(option.value)}
                    className={cn(
                      'p-3 rounded-lg border transition-all text-left',
                      quality === option.value
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className={cn('font-medium', theme.textPrimary)}>{option.label}</div>
                    <div className={cn('text-xs mt-1', theme.textMuted)}>{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="mb-6 space-y-3">
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Options
              </label>

              {/* Hide UI */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideUI}
                  onChange={(e) => setHideUI(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                />
                <div>
                  <span className={cn('text-sm', theme.textPrimary)}>Hide UI elements</span>
                  <p className={cn('text-xs', theme.textMuted)}>Record only the 3D scene</p>
                </div>
              </label>

              {/* Turntable Option */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={turntable}
                  onChange={(e) => setTurntable(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-red-500 focus:ring-red-500 focus:ring-offset-0"
                />
                <div>
                  <span className={cn('text-sm', theme.textPrimary)}>Turntable rotation</span>
                  <p className={cn('text-xs', theme.textMuted)}>Auto-rotate model during recording</p>
                </div>
              </label>
            </div>

            {/* Filename */}
            <div className="mb-6">
              <label className={cn('block text-sm font-medium mb-2', theme.textSecondary)}>
                Filename (optional)
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder={defaultFilename}
                className={cn(
                  'w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5',
                  'text-white placeholder-white/40',
                  'focus:outline-none focus:border-red-500'
                )}
              />
              <p className={cn('text-xs mt-1', theme.textMuted)}>
                Will save as: {filename.trim() || defaultFilename}.{format}
              </p>
            </div>
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {!isRecording ? (
            <>
              <button
                onClick={handleClose}
                className={cn(
                  'px-4 py-2 rounded-lg border border-white/10 transition-colors',
                  theme.textSecondary,
                  theme.hoverSubtle
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleRecord}
                className={cn(
                  'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
                  'bg-red-600 hover:bg-red-500 text-white'
                )}
              >
                <Circle className="w-4 h-4 fill-current" />
                Start Recording
              </button>
            </>
          ) : (
            <button
              onClick={handleStop}
              className={cn(
                'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors',
                'bg-white/20 hover:bg-white/30 text-white'
              )}
            >
              <Square className="w-4 h-4 fill-current" />
              Stop Recording
            </button>
          )}
        </div>
      </div>
    </>
  )
}
