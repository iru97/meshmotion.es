'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Logo } from '@/components/branding/Logo'

// Dynamic import to prevent SSR issues with Three.js
const ViewerScene = dynamic(
  () => import('@/components/viewer/Scene'),
  { ssr: false }
)

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Logo />
      {/* Suspense boundary required for useSearchParams in child components */}
      <Suspense fallback={null}>
        <ViewerScene />
      </Suspense>
    </main>
  )
}
