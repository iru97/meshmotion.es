"use client";

import { useViewerStore } from "@/lib/store/viewer-store";
import { useThemeClasses } from "@/hooks/use-theme-classes";
import { cn } from "@/lib/utils";
import { Play, Pause, RotateCcw, Repeat } from "lucide-react";

/**
 * Global playback controls for comparison mode
 * Shows at the bottom when sync playback is enabled
 */
export function ComparisonPlayback() {
  const theme = useThemeClasses();

  const comparisonMode = useViewerStore((state) => state.comparisonMode);
  const toggleView1Playback = useViewerStore(
    (state) => state.toggleView1Playback
  );
  const toggleView2Playback = useViewerStore(
    (state) => state.toggleView2Playback
  );

  const { view1, view2, syncPlayback } = comparisonMode;

  // Don't show if no animations loaded
  if (!view1.animation && !view2.animation) return null;

  const handlePlayPause = () => {
    if (syncPlayback) {
      // Toggle both when synced
      toggleView1Playback();
      toggleView2Playback();
    } else {
      // Toggle view 1 when not synced (main control)
      toggleView1Playback();
    }
  };

  const handleReset = () => {
    useViewerStore.getState().setView1Time(0);
    useViewerStore.getState().setView2Time(0);
  };

  const toggleLoop = () => {
    // Toggle loop for both views (would need to add this action to store)
    // For now, this is a placeholder
  };

  // Determine playing state
  const isPlaying = syncPlayback
    ? view1.isPlaying || view2.isPlaying
    : view1.isPlaying;

  const loop = view1.loop; // Assuming both views share loop setting

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-30",
        "px-6 py-3 rounded-full",
        theme.glassPanelDark,
        "border border-white/10",
        "flex items-center gap-4"
      )}
    >
      {/* Sync indicator */}
      {syncPlayback && (
        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className={cn("text-xs", theme.textSecondary)}>Synced</span>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={handleReset}
        className={cn(
          "p-2 rounded-lg transition-colors",
          "hover:bg-white/10 active:scale-95"
        )}
        title="Reset to start"
      >
        <RotateCcw className={cn("w-5 h-5", theme.iconPrimary)} />
      </button>

      {/* Play/Pause */}
      <button
        onClick={handlePlayPause}
        disabled={!view1.animation && !view2.animation}
        className={cn(
          "p-3 rounded-full transition-all",
          "bg-blue-500/20 hover:bg-blue-500/30 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 text-blue-300" />
        ) : (
          <Play className="w-6 h-6 text-blue-300" />
        )}
      </button>

      {/* Loop */}
      <button
        onClick={toggleLoop}
        className={cn(
          "p-2 rounded-lg transition-colors",
          loop ? "bg-white/10 text-white" : "text-white/50",
          "hover:bg-white/10 active:scale-95"
        )}
        title={loop ? "Loop enabled" : "Loop disabled"}
      >
        {loop ? (
          <Repeat className="w-5 h-5" />
        ) : (
          <Repeat className="w-5 h-5 opacity-50" />
        )}
      </button>

      {/* View status indicators */}
      {!syncPlayback && (
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={cn("text-xs", theme.textSecondary)}>
                View 1:
              </span>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  view1.isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-500"
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs", theme.textSecondary)}>
                View 2:
              </span>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  view2.isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-500"
                )}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
