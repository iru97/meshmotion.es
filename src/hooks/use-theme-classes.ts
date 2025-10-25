import { useViewerStore } from '@/lib/store/viewer-store'
import { environmentPresets } from '@/types/environment'

/**
 * Hook to get theme-aware CSS classes based on current environment
 */
export function useThemeClasses() {
  const environmentPreset = useViewerStore((state) => state.environmentPreset)
  const config = environmentPresets[environmentPreset]
  const isLight = config.theme === 'light'

  return {
    isLight,
    isDark: !isLight,
    // Glass panel classes - always dark glass effect
    glassPanel: 'glass-panel',
    glassPanelDark: 'glass-panel-dark',
    // Text colors - always white
    textPrimary: 'text-white',
    textSecondary: 'text-white/70',
    textMuted: 'text-white/50',
    textTertiary: 'text-white/40',
    // Icon colors - always white
    iconPrimary: 'text-white',
    iconSecondary: 'text-white/70',
    // Hover effects - always white
    hover: 'hover:bg-white/20',
    hoverSubtle: 'hover:bg-white/10',
    // Borders - always white
    border: 'border-white/10',
    borderLight: 'border-white/5',
    // Separators - always white
    separator: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
  }
}
