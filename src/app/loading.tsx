export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
      <div className="glass-panel-dark p-8 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-white text-sm">Loading 3D Viewer...</p>
      </div>
    </div>
  )
}
