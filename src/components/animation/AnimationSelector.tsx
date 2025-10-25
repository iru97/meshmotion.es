'use client'

import * as THREE from 'three'
import { useViewerStore } from '@/lib/store/viewer-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Normalize bone name by removing numeric suffixes like _1, _2, etc.
 * Examples: "mixamorigHips_1" -> "mixamorigHips", "Hips_2" -> "Hips"
 */
function normalizeBoneName(boneName: string): string {
  return boneName.replace(/_\d+$/, '')
}

export function AnimationSelector() {
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const currentAnimation = useViewerStore((state) => state.currentAnimation)
  const uploadedAnimations = useViewerStore((state) => state.uploadedAnimations)
  const setAnimation = useViewerStore((state) => state.setAnimation)

  // Get all available animations (from current character + uploaded compatible ones)
  const characterAnimations = currentCharacter?.animations || []
  const characterBones = currentCharacter?.metadata.bones || []

  // Deduplicate animations by uuid and filter for compatibility
  const animationMap = new Map<string, THREE.AnimationClip>()

  // Add character's built-in animations first (always compatible)
  characterAnimations.forEach((anim) => animationMap.set(anim.uuid, anim))

  // Add uploaded animations if compatible with current character
  uploadedAnimations.forEach((animData) => {
    if (!animationMap.has(animData.clip.uuid)) {
      // Check compatibility:
      // 1. If no character loaded, don't show external animations
      if (!currentCharacter) {
        return
      }

      // 2. If associated with this character, always show
      const isAssociatedWithCurrentChar = animData.characterId === currentCharacter?.id

      // 3. If has bones, check if compatible with current character's skeleton
      // Normalize bone names to handle variations like "Hips" vs "Hips_1"
      const normalizedCharacterBones = characterBones.map(normalizeBoneName)
      const normalizedAnimBones = animData.boneNames.map(normalizeBoneName)

      const hasCompatibleBones = normalizedAnimBones.length > 0
        ? normalizedAnimBones.some(bone => normalizedCharacterBones.includes(bone))
        : false

      // 4. If no characterId (from persistence), but has compatible bones, show it
      const isPersisted = !animData.characterId && hasCompatibleBones

      if (isAssociatedWithCurrentChar || hasCompatibleBones || isPersisted) {
        animationMap.set(animData.clip.uuid, animData.clip)
      }
    }
  })

  const allAnimations = Array.from(animationMap.values())

  if (allAnimations.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm font-medium">Animation</label>
        <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2">
          <span className="text-white/50 text-sm">No animations available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">Animation</label>
      <Select
        value={currentAnimation?.uuid || 'none'}
        onValueChange={(uuid) => {
          if (uuid === 'none') {
            setAnimation(null)
          } else {
            const animation = allAnimations.find((a) => a.uuid === uuid)
            if (animation) {
              setAnimation(animation)
            }
          }
        }}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue>
            {currentAnimation?.name || 'No animation'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          <SelectItem value="none" className="text-white/70 focus:bg-white/10 focus:text-white">
            No animation
          </SelectItem>
          {allAnimations.map((animation, index) => (
            <SelectItem key={animation.uuid} value={animation.uuid} className="text-white focus:bg-white/10 focus:text-white">
              {animation.name || `Animation ${index + 1}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
