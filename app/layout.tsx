import React from 'react'
import GlobalMouseGlow from '@/components/GlobalMouseGlow'
import type { Metadata } from 'next'
import { Playfair_Display, Inter, Bebas_Neue } from 'next/font/google'
import './globals.css'

/* ================= FONTS ================= */

// Cinematic serif for headings
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

// Clean modern font for body text
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

/* ================= METADATA ================= */

export const metadata: Metadata = {
  title: 'Ram Charan - Official Fan Community',
  description:
    'Celebrate the cinematic genius of Ram Charan with exclusive content, fan gallery, and community engagement',
  generator: 'v0.app',
}

/* ✅ MOVE themeColor HERE */
export const viewport = {
  themeColor: '#000000',
}

/* ================= ROOT LAYOUT ================= */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${bebas.variable} antialiased bg-black text-white`}>
  <GlobalMouseGlow />
  {children}
</body>
    </html>
  )
}
