import { useState, useCallback, useRef } from 'react'
import { downloadFile } from '@/lib/conversion/three-exporters'

export type VideoFormat = 'webm' | 'gif'
export type VideoDuration = '3s' | '5s' | '10s' | 'full' | 'custom'
export type VideoQuality = 'social' | 'high'

export interface VideoRecordingOptions {
  format: VideoFormat
  duration: VideoDuration
  customDuration?: number
  quality: VideoQuality
  turntable: boolean
  filename?: string
}

interface UseVideoRecorderReturn {
  isRecording: boolean
  progress: number
  error: string | null
  startRecording: (options: VideoRecordingOptions) => Promise<void>
  stopRecording: () => void
  reset: () => void
}

const DURATION_VALUES: Record<VideoDuration, number> = {
  '3s': 3,
  '5s': 5,
  '10s': 10,
  'full': 0, // Will use animation duration
  'custom': 0,
}

const QUALITY_SETTINGS: Record<VideoQuality, { fps: number; bitrate: number }> = {
  social: { fps: 30, bitrate: 2500000 },
  high: { fps: 60, bitrate: 8000000 },
}

/**
 * Hook for recording video/GIF from the 3D canvas
 */
export function useVideoRecorder(): UseVideoRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const durationRef = useRef<number>(0)

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    setIsRecording(false)
    setProgress(0)
  }, [])

  const startRecording = useCallback(async (options: VideoRecordingOptions): Promise<void> => {
    try {
      setIsRecording(true)
      setError(null)
      setProgress(0)
      chunksRef.current = []

      const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
      if (!canvas) {
        throw new Error('No canvas found. Make sure a 3D model is loaded.')
      }

      const qualitySettings = QUALITY_SETTINGS[options.quality]
      let targetDuration = DURATION_VALUES[options.duration]

      if (options.duration === 'custom' && options.customDuration) {
        targetDuration = options.customDuration
      }

      // For 'full' duration, we'll record until manually stopped or a max of 30s
      if (options.duration === 'full') {
        targetDuration = 30
      }

      durationRef.current = targetDuration * 1000 // Convert to ms

      if (options.format === 'gif') {
        // GIF recording using gif.js
        await recordGif(canvas, options, targetDuration, qualitySettings.fps)
      } else {
        // WebM recording using MediaRecorder
        await recordWebM(canvas, options, targetDuration, qualitySettings)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Recording failed'
      setError(errorMessage)
      setIsRecording(false)
      setProgress(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const recordWebM = async (
    canvas: HTMLCanvasElement,
    options: VideoRecordingOptions,
    duration: number,
    qualitySettings: { fps: number; bitrate: number }
  ) => {
    const stream = canvas.captureStream(qualitySettings.fps)

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm'

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: qualitySettings.bitrate,
    })

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      const filename = options.filename || `meshmotion-${timestamp}.webm`
      downloadFile(blob, filename)
      setIsRecording(false)
      setProgress(100)
    }

    mediaRecorderRef.current.start(100) // Collect data every 100ms
    startTimeRef.current = performance.now()

    // Progress tracking
    const trackProgress = () => {
      const elapsed = performance.now() - startTimeRef.current
      const currentProgress = Math.min((elapsed / durationRef.current) * 100, 100)
      setProgress(currentProgress)

      if (elapsed < durationRef.current) {
        animationFrameRef.current = requestAnimationFrame(trackProgress)
      } else {
        stopRecording()
      }
    }

    animationFrameRef.current = requestAnimationFrame(trackProgress)
  }

  const recordGif = async (
    canvas: HTMLCanvasElement,
    options: VideoRecordingOptions,
    duration: number,
    fps: number
  ) => {
    // Dynamic import of gif.js
    const GIF = (await import('gif.js')).default

    const gif = new GIF({
      workers: 2,
      quality: options.quality === 'high' ? 5 : 10,
      width: canvas.width,
      height: canvas.height,
      workerScript: '/gif.worker.js',
    })

    const frameInterval = 1000 / fps
    const totalFrames = Math.ceil((duration * 1000) / frameInterval)
    let frameCount = 0

    startTimeRef.current = performance.now()

    const captureFrame = () => {
      if (frameCount >= totalFrames) {
        gif.render()
        return
      }

      gif.addFrame(canvas, { delay: frameInterval, copy: true })
      frameCount++

      const currentProgress = (frameCount / totalFrames) * 80 // Reserve 20% for rendering
      setProgress(currentProgress)

      animationFrameRef.current = requestAnimationFrame(captureFrame)
    }

    gif.on('finished', (blob: Blob) => {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      const filename = options.filename || `meshmotion-${timestamp}.gif`
      downloadFile(blob, filename)
      setIsRecording(false)
      setProgress(100)
    })

    gif.on('progress', (p: number) => {
      setProgress(80 + p * 20) // 80-100% during render
    })

    captureFrame()
  }

  const reset = useCallback(() => {
    stopRecording()
    setError(null)
    setProgress(0)
  }, [stopRecording])

  return {
    isRecording,
    progress,
    error,
    startRecording,
    stopRecording,
    reset,
  }
}
