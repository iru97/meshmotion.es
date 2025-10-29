'use client'

import { useEffect, useState } from 'react'
import { useAssetManagement } from '@/hooks/use-asset-management'
import { useThemeClasses } from '@/hooks/use-theme-classes'
import { cn } from '@/lib/utils'
import { HardDrive } from 'lucide-react'

export function StorageQuota() {
  const theme = useThemeClasses()
  const { getQuota } = useAssetManagement()
  const [quota, setQuota] = useState({ used: 0, available: 0, percentage: 0 })

  useEffect(() => {
    const loadQuota = async () => {
      const data = await getQuota()
      setQuota(data)
    }
    loadQuota()

    // Refresh every 30 seconds
    const interval = setInterval(loadQuota, 30000)
    return () => clearInterval(interval)
  }, [getQuota])

  const usedMB = (quota.used / (1024 * 1024)).toFixed(2)
  const availableMB = (quota.available / (1024 * 1024)).toFixed(2)
  const percentage = Math.min(quota.percentage, 100)

  return (
    <div className={cn('p-4 rounded-lg', theme.glassPanelDark)}>
      <div className="flex items-center gap-2 mb-3">
        <HardDrive className="w-4 h-4 text-white/70" />
        <span className={cn('text-sm font-medium', theme.textPrimary)}>
          Storage Usage
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-black/30 rounded-full overflow-hidden mb-2">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-all duration-300',
            percentage < 70 && 'bg-green-500',
            percentage >= 70 && percentage < 90 && 'bg-yellow-500',
            percentage >= 90 && 'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className={cn('flex justify-between text-xs', theme.textSecondary)}>
        <span>{usedMB} MB used</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      {quota.available > 0 && (
        <div className={cn('text-xs text-center mt-1', theme.textSecondary)}>
          {availableMB} MB available
        </div>
      )}
    </div>
  )
}
