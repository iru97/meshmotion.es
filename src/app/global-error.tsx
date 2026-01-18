'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Something went wrong!</h2>
            <p className="text-white/70 mb-4">{error.message || 'An unexpected error occurred'}</p>
            <button
              onClick={reset}
              className="w-full px-4 py-3 rounded-lg bg-blue-500/80 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
