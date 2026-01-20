'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to prevent SSR issues with Three.js
const EmbedScene = dynamic(
  () => import('@/components/embed/EmbedScene'),
  { ssr: false }
)

export default function EmbedPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <Suspense fallback={
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
        </div>
      }>
        <EmbedScene />
      </Suspense>
    </main>
  )
}
