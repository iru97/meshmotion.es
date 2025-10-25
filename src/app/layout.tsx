import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '3D Next Viewer - Advanced GLB Animation Viewer',
  description:
    'Professional 3D model viewer with animation retargeting, studio lighting, and timeline editing',
  keywords: ['3D viewer', 'GLB', 'animation', 'Mixamo', 'Three.js'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
