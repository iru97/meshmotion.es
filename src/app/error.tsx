'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
      <div className="glass-panel-dark p-8 max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-white/70 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="glass-button w-full text-white"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
