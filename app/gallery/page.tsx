import type { Metadata } from 'next'
import GalleryPageClient from './gallery-client'

export const metadata: Metadata = {
  title: 'Gallery - Ram Charan Fan Community',
  description: 'Explore approved fan creations in our community gallery',
}

export default function GalleryPage() {
  return <GalleryPageClient />
}
