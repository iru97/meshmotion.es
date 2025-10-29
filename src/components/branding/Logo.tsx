'use client'

import Image from 'next/image'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { useViewerStore } from '@/lib/store/viewer-store'

/**
 * MeshMotion logo and branding component
 * Links to creator's website
 */
export function Logo() {
  const theme = useThemeClasses()
  const assetPanelOpen = useViewerStore((state) => state.assetPanelOpen)

  // Hide logo only when AssetsPanel is open (fullscreen on mobile)
  if (assetPanelOpen) return null

  return (
    <a
      href="https://iruhernandez.com"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed top-4 left-4 z-30 flex items-center gap-3 transition-all duration-200 active:scale-95',
        'p-3 md:px-4 md:py-2.5 rounded-full',
        theme.glassPanelDark,
        'hover:bg-white/15'
      )}
      title="Visit iruhernandez.com"
    >
      <Image
        src="/meshmotion.png"
        alt="MeshMotion Logo"
        width={32}
        height={32}
        className="w-5 h-5 md:w-8 md:h-8"
      />
      <span className={cn('hidden md:inline text-lg font-semibold', theme.textPrimary)}>
        MeshMotion
      </span>
    </a>
  )
}
