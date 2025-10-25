'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { lightingPresets } from '@/lib/three/lighting-presets'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Lightbulb } from 'lucide-react'
import type { LightingPreset } from '@/types/viewer'

export function LightingSettings() {
  const lightingPreset = useViewerStore((state) => state.lightingPreset)
  const setLightingPreset = useViewerStore((state) => state.setLightingPreset)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium flex items-center gap-2">
        <Lightbulb className="w-4 h-4" />
        Lighting Preset
      </label>
      <Select
        value={lightingPreset}
        onValueChange={(value) => setLightingPreset(value as LightingPreset)}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue>
            {lightingPresets[lightingPreset]?.name || 'Select lighting'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          {Object.entries(lightingPresets).map(([key, preset]) => (
            <SelectItem key={key} value={key} className="text-white focus:bg-white/10 focus:text-white">
              <div className="flex flex-col">
                <span className="font-medium">{preset.name}</span>
                <span className="text-xs text-white/50">
                  {preset.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
