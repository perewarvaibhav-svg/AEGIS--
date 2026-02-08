import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Aegis Sentinel - Disaster Mission Control',
  description: 'ML-Based Disaster Risk Prediction & Monitoring System with real-time satellite intelligence',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${_inter.variable} ${_jetbrains.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background">{children}</body>
    </html>
  )
}
