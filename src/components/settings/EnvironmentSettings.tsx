'use client'

import { useViewerStore } from '@/lib/store/viewer-store'
import { environmentPresets } from '@/types/environment'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'
import type { EnvironmentPreset } from '@/types/environment'

export function EnvironmentSettings() {
  const environmentPreset = useViewerStore((state) => state.environmentPreset)
  const setEnvironmentPreset = useViewerStore((state) => state.setEnvironmentPreset)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm font-medium flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Environment
      </label>
      <Select
        value={environmentPreset}
        onValueChange={(value) => setEnvironmentPreset(value as EnvironmentPreset)}
      >
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue>
            {environmentPresets[environmentPreset]?.name || 'Select environment'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-white/20">
          {Object.entries(environmentPresets).map(([key, preset]) => (
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
