'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/navigation'
import Gallery from '@/components/gallery'
import Footer from '@/components/footer'
import ScrollProgress from '@/components/scroll-progress'
import PageTransition from '@/components/page-transition'

export default function GalleryPageClient({
  category,
}: {
  category?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-background"
    >
      <ScrollProgress />
      <Navigation />
      <PageTransition>
        {/* ================= HERO STYLE GALLERY HEADER ================= */}
<section className="relative pt-32 pb-24 overflow-hidden bg-black">

  {/* Cinematic Orange Glow */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[400px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent blur-[140px]" />
  </div>

  {/* Subtle radial light */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,115,0,0.08),transparent_60%)]" />

  <div className="relative max-w-7xl mx-auto px-6 text-center">

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >

      {/* Main Title */}
      <h1 className="text-6xl md:text-7xl font-bold tracking-[0.35em] text-orange-500 drop-shadow-[0_0_30px_rgba(255,115,0,0.5)]">
        GALLERY
      </h1>

      {/* Subtitle */}
      <p className="mt-8 text-white/50 text-sm tracking-[0.25em] uppercase">
        Community Fan Creations
      </p>

      <p className="mt-4 text-white/40 max-w-2xl mx-auto text-base leading-relaxed">
        Explore approved fan creations curated from our passionate community.
      </p>

    </motion.div>

  </div>
</section>
        <Gallery category={category} />
        <Footer />
      </PageTransition>
    </motion.div>
  )
}
