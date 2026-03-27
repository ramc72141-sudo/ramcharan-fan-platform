'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/navigation'
import FanSubmission from '@/components/fan-submission'
import Footer from '@/components/footer'
import ScrollProgress from '@/components/scroll-progress'
import PageTransition from '@/components/page-transition'

export default function SubmitPageClient() {
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
        <FanSubmission />
        <Footer />
      </PageTransition>
    </motion.div>
  )
}
