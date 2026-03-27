import type { Metadata } from 'next'
import SubmitPageClient from './submit-client'

export const metadata: Metadata = {
  title: 'Submit - Ram Charan Fan Community',
  description: 'Share your fan creations with our community',
}

export default function SubmitPage() {
  return <SubmitPageClient />
}
