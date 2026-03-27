import React from "react"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Ram Charan Fan Community',
  description: 'Moderation and content management dashboard',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
