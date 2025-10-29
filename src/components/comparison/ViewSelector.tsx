'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import type { GLTFModel } from '@/types/viewer'
import type * as THREE from 'three'

interface ViewSelectorProps {
  viewNumber: 1 | 2
  currentCharacter: GLTFModel | null
  currentAnimation: THREE.AnimationClip | null
}

export function ViewSelector({ viewNumber, currentCharacter, currentAnimation }: ViewSelectorProps) {
  const theme = useThemeClasses()

  const uploadedCharacters = useViewerStore((state) => state.uploadedCharacters)
  const uploadedAnimations = useViewerStore((state) => state.uploadedAnimations)

  const setView1Character = useViewerStore((state) => state.setView1Character)
  const setView2Character = useViewerStore((state) => state.setView2Character)
  const setView1Animation = useViewerStore((state) => state.setView1Animation)
  const setView2Animation = useViewerStore((state) => state.setView2Animation)

  const setCharacter = viewNumber === 1 ? setView1Character : setView2Character
  const setAnimation = viewNumber === 1 ? setView1Animation : setView2Animation

  return (
    <div className="space-y-3">
      {/* Character Selector */}
      <div>
        <label className={cn('block text-xs mb-1', theme.textSecondary)}>
          Character
        </label>
        <select
          value={currentCharacter?.id || ''}
          onChange={(e) => {
            const char = uploadedCharacters.find((c) => c.id === e.target.value)
            setCharacter(char || null)
          }}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg',
            'bg-black/30 border border-white/10',
            'text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50'
          )}
        >
          <option value="">None</option>
          {uploadedCharacters.map((char) => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>
      </div>

      {/* Animation Selector */}
      <div>
        <label className={cn('block text-xs mb-1', theme.textSecondary)}>
          Animation
        </label>
        <select
          value={currentAnimation?.name || ''}
          onChange={(e) => {
            const anim = uploadedAnimations.find((a) => a.clip.name === e.target.value)
            setAnimation(anim?.clip || null)
          }}
          disabled={!currentCharacter}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg',
            'bg-black/30 border border-white/10',
            'text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50',
            !currentCharacter && 'opacity-50 cursor-not-allowed'
          )}
        >
          <option value="">None</option>
          {uploadedAnimations.map((anim) => (
            <option key={anim.id} value={anim.clip.name}>
              {anim.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
