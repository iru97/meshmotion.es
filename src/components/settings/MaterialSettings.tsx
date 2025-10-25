'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { materialPresets } from '@/lib/three/material-presets'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Palette } from 'lucide-react'
import type { MaterialPreset } from '@/types/viewer'

export function MaterialSettings() {
  const materialPreset = useViewerStore((state) => state.materialPreset)
  const setMaterialPreset = useViewerStore((state) => state.setMaterialPreset)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Material Preset
      </label>
      <Select
        value={materialPreset}
        onValueChange={(value) => setMaterialPreset(value as MaterialPreset)}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue>
            {materialPresets[materialPreset]?.name || 'Select material'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          {Object.entries(materialPresets).map(([key, preset]) => (
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
