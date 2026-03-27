'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'

import Preloader from '@/components/preloader'
import Hero from '@/components/hero'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import ScrollProgress from '@/components/scroll-progress'
import PageTransition from '@/components/page-transition'

const MotionDiv = motion.div as any
const MotionA = motion.a as any

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K'
  return n.toString()
}

function useCountUp(value: number, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const startTime = performance.now()
    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return count
}

// ── Deterministic particle positions — no Math.random() in render ──
const particlePositions = [
  { top: 8,  left: 5,  w: 4, h: 4, dur: 7.2 },
  { top: 22, left: 18, w: 6, h: 6, dur: 9.5 },
  { top: 38, left: 8,  w: 3, h: 3, dur: 6.8 },
  { top: 55, left: 28, w: 5, h: 5, dur: 8.1 },
  { top: 72, left: 12, w: 4, h: 4, dur: 7.6 },
  { top: 85, left: 42, w: 3, h: 3, dur: 9.2 },
  { top: 15, left: 55, w: 6, h: 6, dur: 8.8 },
  { top: 32, left: 68, w: 4, h: 4, dur: 6.5 },
  { top: 48, left: 82, w: 5, h: 5, dur: 7.9 },
  { top: 65, left: 92, w: 3, h: 3, dur: 9.8 },
  { top: 78, left: 62, w: 4, h: 4, dur: 7.3 },
  { top: 92, left: 75, w: 6, h: 6, dur: 8.5 },
  { top: 5,  left: 38, w: 3, h: 3, dur: 6.9 },
  { top: 20, left: 48, w: 5, h: 5, dur: 9.1 },
  { top: 42, left: 35, w: 4, h: 4, dur: 7.7 },
  { top: 60, left: 52, w: 3, h: 3, dur: 8.3 },
  { top: 75, left: 22, w: 6, h: 6, dur: 6.6 },
  { top: 88, left: 88, w: 4, h: 4, dur: 9.4 },
  { top: 12, left: 78, w: 5, h: 5, dur: 7.1 },
  { top: 95, left: 32, w: 3, h: 3, dur: 8.7 },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const seen = sessionStorage.getItem('preloader-shown')
    if (seen) setIsLoading(false)
  }, [])
  const [stats, setStats] = useState({
    totalUploads: 0,
    visitCount: 0,
  })

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const uploadsCount = useCountUp(stats.totalUploads)
  const visitsCount = useCountUp(stats.visitCount)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ── Increment visit count ──
        await supabase.rpc('increment_visits')

        // ── Fetch visit count ──
        const { data: visitData } = await supabase
          .from('site_stats')
          .select('visit_count')
          .eq('id', 1)
          .single()
        const { count: uploadsCount, error: uploadsError } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved')
        if (uploadsError) throw uploadsError

        setStats({
          totalUploads: uploadsCount ?? 0,
          visitCount: visitData?.visit_count ?? 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  // Mobile: show fewer particles
  const visibleParticles = isMobile
    ? particlePositions.slice(0, 10)
    : particlePositions

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-background"
      suppressHydrationWarning
    >
      <AnimatePresence>
        {isLoading && (
          <Preloader onComplete={() => {
            sessionStorage.setItem('preloader-shown', 'true')
            setIsLoading(false)
          }} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <ScrollProgress />
          <Navigation />

          <PageTransition>
            <Hero />

            {/* ================= CINEMATIC STATS SECTION ================= */}
            <section className="relative py-20 sm:py-32 overflow-hidden bg-black">

              {/* Cinematic Orange Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[400px] blur-[140px]" style={{ background: 'radial-gradient(ellipse, rgba(139,37,0,0.18) 0%, transparent 70%)' }} />
              </div>

              {/* Floating Particles — deterministic, mobile reduced */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {visibleParticles.map((p, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      background: 'rgba(139,58,8,0.12)',
                      width: p.w,
                      height: p.h,
                      top: `${p.top}%`,
                      left: `${p.left}%`,
                      willChange: 'transform, opacity',
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: p.dur,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>

              <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                <MotionDiv
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  whileHover={!isMobile ? { y: -8 } : {}}
                  className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 sm:gap-16"
                >
                  {/* Approved Fan Creations */}
                  <div className="text-center md:text-right">
                    <motion.p
                      className="relative leading-none font-bold overflow-hidden"
                      style={{
                        color: '#C4651A',
                        fontSize: isMobile ? '72px' : '110px',
                      }}
                      animate={{
                        filter: [
                          'drop-shadow(0 0 20px rgba(139,58,8,0.4))',
                        'drop-shadow(0 0 45px rgba(139,58,8,0.7))',
                        'drop-shadow(0 0 20px rgba(139,58,8,0.4))',
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {formatCount(uploadsCount)}
                      <motion.span
                        className="absolute top-0 left-[-150%] w-[30%] h-full blur-sm"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(180,80,15,0.12), transparent)' }}
                        animate={{ left: ['-150%', '150%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.p>
                    <p className="mt-4 sm:mt-6 text-xs uppercase tracking-[0.45em] text-white/40">
                      Approved Fan Creations
                    </p>
                  </div>

                  {/* Divider — horizontal on mobile, vertical on desktop */}
                  <div className="flex justify-center">
                    <div
                     className="md:hidden w-24 h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(139,58,8,0.6), transparent)' }}
                    />
                    <div
                      className="hidden md:block w-px h-40"
                      style={{ background: 'linear-gradient(180deg, transparent, rgba(139,58,8,0.6), transparent)' }}
                    />
                  </div>

                  {/* Community Members */}
                  <div className="text-center md:text-left">
                    <motion.p
                      className="relative leading-none font-bold overflow-hidden"
                      style={{
                        color: '#C4651A',
                        fontSize: isMobile ? '72px' : '110px',
                      }}
                      animate={{
                        filter: [
                          'drop-shadow(0 0 20px rgba(139,58,8,0.4))',
                        'drop-shadow(0 0 45px rgba(139,58,8,0.7))',
                        'drop-shadow(0 0 20px rgba(139,58,8,0.4))',
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {formatCount(visitsCount)}
                      <motion.span
                        className="absolute top-0 left-[-150%] w-[30%] h-full blur-sm"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(180,80,15,0.12), transparent)' }}
                        animate={{ left: ['-150%', '150%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.p>
                    <p className="mt-4 sm:mt-6 text-xs uppercase tracking-[0.45em] text-white/40">
                      Total Visits
                    </p>
                  </div>
                </MotionDiv>
              </div>
            </section>
            {/* ========================================================== */}

            {/* Featured Notice */}
            <section className="py-14 sm:py-20 bg-background text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-foreground/60 text-base sm:text-lg mb-6">
                  Discover breathtaking fan art, edits and celebrations
                </p>
                <MotionA
                  href="/gallery"
                  className="inline-block px-8 sm:px-12 py-4 font-bold tracking-[0.15em] uppercase hover:scale-105 transition text-sm sm:text-base"
                  style={{ background: '#8B2500', color: '#f5e6d8', boxShadow: '0 0 25px rgba(139,37,0,0.55)', border: '1px solid rgba(180,70,15,0.4)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Full Gallery →
                </MotionA>
              </motion.div>
            </section>

            <Footer />
          </PageTransition>
        </>
      )}
    </MotionDiv>
  )
}