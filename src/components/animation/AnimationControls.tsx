'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { Play, Pause, Repeat, Gauge } from 'lucide-react'
import { formatTime, cn } from '@/lib/utils'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AnimationControls() {
  const isPlaying = useViewerStore((state) => state.isPlaying)
  const playbackSpeed = useViewerStore((state) => state.playbackSpeed)
  const loop = useViewerStore((state) => state.loop)
  const currentTime = useViewerStore((state) => state.currentTime)
  const duration = useViewerStore((state) => state.duration)
  const currentAnimation = useViewerStore((state) => state.currentAnimation)
  const theme = useThemeClasses()

  const togglePlay = useViewerStore((state) => state.togglePlay)
  const setSpeed = useViewerStore((state) => state.setSpeed)
  const setLoop = useViewerStore((state) => state.setLoop)
  const setCurrentTime = useViewerStore((state) => state.setCurrentTime)

  // Don't show controls if no animation or animation is invalid
  if (!currentAnimation || !currentAnimation.duration || currentAnimation.duration <= 0 || !currentAnimation.tracks || currentAnimation.tracks.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-40 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Timeline Container */}
        <div className="glass-panel-dark px-6 py-3 rounded-full flex items-center gap-4">
          <span className="text-white text-xs font-mono min-w-[50px]">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.01}
            onValueChange={([value]) => setCurrentTime(value)}
            className="flex-1"
          />
          <span className="text-white text-xs font-mono min-w-[50px] text-right">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left Side - Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="glass-panel-dark p-3 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Loop */}
            <button
              onClick={() => setLoop(!loop)}
              className={cn(
                'glass-panel-dark p-3 rounded-full transition-all duration-200 active:scale-95',
                loop ? 'bg-white/20 hover:bg-white/30' : 'hover:bg-white/20'
              )}
            >
              <Repeat className="w-4 h-4 text-white" />
            </button>

            {/* Speed Control Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="glass-panel-dark px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-mono">{playbackSpeed.toFixed(2)}x</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="glass-panel-dark border-white/10">
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => setSpeed(speed)}
                    className={cn(
                      'text-white text-xs cursor-pointer hover:bg-white/10',
                      playbackSpeed === speed && 'bg-white/20'
                    )}
                  >
                    {speed.toFixed(2)}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side - Animation Name */}
          <div className="glass-panel-dark px-4 py-2 rounded-full">
            <span className="text-white/70 text-xs">
              {currentAnimation.name || 'Unnamed Animation'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
