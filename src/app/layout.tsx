import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const spaceGrotesk = localFont({
  src: '../../public/fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf',
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MeshMotion',
  description:
    'Professional 3D model viewer with animation retargeting, studio lighting, and timeline editing',
  keywords: ['3D viewer', 'GLB', 'animation', 'Mixamo', 'Three.js'],
  icons: {
    icon: '/meshmotion.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        {children}
      </body>
    </html>
  )
}
