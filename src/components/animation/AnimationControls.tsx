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
  const comparisonEnabled = useViewerStore((state) => state.comparisonMode.enabled)
  const comparisonMode = useViewerStore((state) => state.comparisonMode)

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

  const toggleView1Playback = useViewerStore((state) => state.toggleView1Playback)
  const toggleView2Playback = useViewerStore((state) => state.toggleView2Playback)
  const setView1Time = useViewerStore((state) => state.setView1Time)
  const setView2Time = useViewerStore((state) => state.setView2Time)
  const setView1Loop = useViewerStore((state) => state.setView1Loop)
  const setView2Loop = useViewerStore((state) => state.setView2Loop)
  const setView1Speed = useViewerStore((state) => state.setView1Speed)
  const setView2Speed = useViewerStore((state) => state.setView2Speed)

  // Comparison mode logic
  if (comparisonEnabled) {
    const view1 = comparisonMode?.view1
    const view2 = comparisonMode?.view2
    const syncPlayback = comparisonMode?.syncPlayback ?? true
    const layout = comparisonMode?.layout ?? 'vertical'

    const hasAnimation = view1?.animation || view2?.animation

    if (!hasAnimation) return null

    // Synced mode - single timeline controlling both views
    if (syncPlayback) {
      const handlePlayPause = () => {
        toggleView1Playback()
        toggleView2Playback()
      }

      const handleTimeChange = (value: number) => {
        setView1Time(value)
        setView2Time(value)
      }

      const handleLoopToggle = () => {
        const newLoop = !view1.loop
        setView1Loop(newLoop)
        setView2Loop(newLoop)
      }

      const handleSpeedChange = (speed: number) => {
        setView1Speed(speed)
        setView2Speed(speed)
      }

      const playing = view1?.isPlaying || view2?.isPlaying
      const time = view1?.currentTime ?? 0
      const maxDuration = Math.max(view1?.animation?.duration || 0, view2?.animation?.duration || 0)
      const loopEnabled = view1?.loop ?? true
      const speed = view1?.playbackSpeed ?? 1

      return (
        <div className="fixed bottom-20 left-0 right-0 z-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            {/* Timeline Container */}
            <div className="glass-panel-dark px-6 py-3 rounded-full flex items-center gap-4">
              <span className="text-white text-xs font-mono min-w-[50px]">
                {formatTime(time)}
              </span>
              <Slider
                value={[time]}
                min={0}
                max={maxDuration}
                step={0.01}
                onValueChange={([value]) => handleTimeChange(value)}
                className="flex-1"
              />
              <span className="text-white text-xs font-mono min-w-[50px] text-right">
                {formatTime(maxDuration)}
              </span>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left Side - Action Buttons */}
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="glass-panel-dark p-3 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95"
                >
                  {playing ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Loop */}
                <button
                  onClick={handleLoopToggle}
                  className={cn(
                    'glass-panel-dark p-3 rounded-full transition-all duration-200 active:scale-95',
                    loopEnabled ? 'bg-white/20 hover:bg-white/30' : 'hover:bg-white/20'
                  )}
                >
                  <Repeat className="w-4 h-4 text-white" />
                </button>

                {/* Speed Control Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="glass-panel-dark px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-mono">{speed.toFixed(2)}x</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="glass-panel-dark border-white/10 z-[60]">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speedOption) => (
                      <DropdownMenuItem
                        key={speedOption}
                        onClick={() => handleSpeedChange(speedOption)}
                        className={cn(
                          'text-white text-xs cursor-pointer hover:bg-white/10',
                          speed === speedOption && 'bg-white/20'
                        )}
                      >
                        {speedOption.toFixed(2)}x
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right Side - Synced Indicator */}
              <div className="glass-panel-dark px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-xs">Synced</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Non-synced mode - individual timelines for each view
    const isVertical = layout === 'vertical'

    return (
      <>
        {/* View 1 Timeline */}
        {view1?.animation && (
          <div
            className={cn(
              "fixed z-20",
              isVertical
                ? "bottom-20 left-0 right-1/2 px-6"
                : "bottom-[calc(50%+5rem)] left-0 right-0 px-6 pointer-events-none"
            )}
          >
            <div className={cn(
              "flex flex-col gap-3 pointer-events-auto",
              isVertical ? "max-w-full" : "max-w-7xl mx-auto"
            )}>
              {/* Timeline Container */}
              <div className="glass-panel-dark px-6 py-3 rounded-full flex items-center gap-4">
                <span className="text-white text-xs font-mono min-w-[50px]">
                  {formatTime(view1.currentTime)}
                </span>
                <Slider
                  value={[view1.currentTime]}
                  min={0}
                  max={view1.animation.duration}
                  step={0.01}
                  onValueChange={([value]) => setView1Time(value)}
                  className="flex-1"
                />
                <span className="text-white text-xs font-mono min-w-[50px] text-right">
                  {formatTime(view1.animation.duration)}
                </span>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                {/* Left Side - Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={toggleView1Playback}
                    className="glass-panel-dark p-3 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95"
                  >
                    {view1.isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>

                  {/* Loop */}
                  <button
                    onClick={() => setView1Loop(!view1.loop)}
                    className={cn(
                      'glass-panel-dark p-3 rounded-full transition-all duration-200 active:scale-95',
                      view1.loop ? 'bg-white/20 hover:bg-white/30' : 'hover:bg-white/20'
                    )}
                  >
                    <Repeat className="w-4 h-4 text-white" />
                  </button>

                  {/* Speed Control Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="glass-panel-dark px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-mono">{view1.playbackSpeed.toFixed(2)}x</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="glass-panel-dark border-white/10 z-[60]">
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                        <DropdownMenuItem
                          key={speed}
                          onClick={() => setView1Speed(speed)}
                          className={cn(
                            'text-white text-xs cursor-pointer hover:bg-white/10',
                            view1.playbackSpeed === speed && 'bg-white/20'
                          )}
                        >
                          {speed.toFixed(2)}x
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Right Side - View Label */}
                <div className="glass-panel-dark px-4 py-2 rounded-full">
                  <span className="text-white/70 text-xs">View 1</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 2 Timeline */}
        {view2?.animation && (
          <div
            className={cn(
              "fixed z-20",
              isVertical
                ? "bottom-20 left-1/2 right-0 px-6"
                : "bottom-20 left-0 right-0 px-6 pointer-events-none"
            )}
          >
            <div className={cn(
              "flex flex-col gap-3 pointer-events-auto",
              isVertical ? "max-w-full" : "max-w-7xl mx-auto"
            )}>
              {/* Timeline Container */}
              <div className="glass-panel-dark px-6 py-3 rounded-full flex items-center gap-4">
                <span className="text-white text-xs font-mono min-w-[50px]">
                  {formatTime(view2.currentTime)}
                </span>
                <Slider
                  value={[view2.currentTime]}
                  min={0}
                  max={view2.animation.duration}
                  step={0.01}
                  onValueChange={([value]) => setView2Time(value)}
                  className="flex-1"
                />
                <span className="text-white text-xs font-mono min-w-[50px] text-right">
                  {formatTime(view2.animation.duration)}
                </span>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                {/* Left Side - Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={toggleView2Playback}
                    className="glass-panel-dark p-3 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95"
                  >
                    {view2.isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white" />
                    )}
                  </button>

                  {/* Loop */}
                  <button
                    onClick={() => setView2Loop(!view2.loop)}
                    className={cn(
                      'glass-panel-dark p-3 rounded-full transition-all duration-200 active:scale-95',
                      view2.loop ? 'bg-white/20 hover:bg-white/30' : 'hover:bg-white/20'
                    )}
                  >
                    <Repeat className="w-4 h-4 text-white" />
                  </button>

                  {/* Speed Control Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="glass-panel-dark px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-200 active:scale-95 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-white" />
                        <span className="text-white text-xs font-mono">{view2.playbackSpeed.toFixed(2)}x</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="glass-panel-dark border-white/10 z-[60]">
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                        <DropdownMenuItem
                          key={speed}
                          onClick={() => setView2Speed(speed)}
                          className={cn(
                            'text-white text-xs cursor-pointer hover:bg-white/10',
                            view2.playbackSpeed === speed && 'bg-white/20'
                          )}
                        >
                          {speed.toFixed(2)}x
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Right Side - View Label */}
                <div className="glass-panel-dark px-4 py-2 rounded-full">
                  <span className="text-white/70 text-xs">View 2</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Normal mode - Don't show controls if no animation or animation is invalid
  if (!currentAnimation || !currentAnimation.duration || currentAnimation.duration <= 0 || !currentAnimation.tracks || currentAnimation.tracks.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-20 px-6">
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
