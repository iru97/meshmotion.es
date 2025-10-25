'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CharacterSelector() {
  const currentCharacter = useViewerStore((state) => state.currentCharacter)
  const uploadedCharacters = useViewerStore((state) => state.uploadedCharacters)
  const setCharacter = useViewerStore((state) => state.setCharacter)
  const setAnimation = useViewerStore((state) => state.setAnimation)

  if (uploadedCharacters.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm font-medium">Character</label>
        <div className="bg-white/5 border border-white/10 rounded-md px-3 py-2">
          <span className="text-white/50 text-sm">No characters loaded</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium">Character</label>
      <Select
        value={currentCharacter?.id || ''}
        onValueChange={(id) => {
          const character = uploadedCharacters.find((c) => c.id === id)
          if (character) {
            setCharacter(character)
            // Auto-select first animation from the new character
            if (character.animations.length > 0) {
              setAnimation(character.animations[0])
            } else {
              setAnimation(null)
            }
          }
        }}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue>
            {currentCharacter?.name || 'Select a character'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          {uploadedCharacters.map((character) => (
            <SelectItem key={character.id} value={character.id} className="text-white focus:bg-white/10 focus:text-white">
              {character.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
