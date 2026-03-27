'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Hero() {
  const router = useRouter()

  const heroImages = [
    '/hero/rc-1.jpg',
    '/hero/rc-2.jpg',
    '/hero/rc-3.jpg',
    '/hero/rc-4.jpeg',
  ]

  const [index, setIndex] = useState(0)

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroImages.length)
    }, 6500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black">

      {/* ================= SLIDESHOW ================= */}
      <div className="absolute inset-0 z-0">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: 1,
            // Reduce scale on mobile — less GPU work, still cinematic
            scale: isMobile ? 1.03 : 1.18,
          }}
          transition={{
            opacity: { duration: 2.2, ease: 'easeInOut' },
            scale: { duration: 6.5, ease: 'easeInOut' },
          }}
          style={{
            backgroundImage: `url(${heroImages[index]})`,
            backgroundSize: 'cover',
            // Center on desktop, top on mobile so face is visible
            backgroundPosition: isMobile ? 'center top' : 'center',
            willChange: 'transform, opacity',
            filter: 'brightness(1.15) contrast(1.2) saturate(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'rgba(120,40,8,0.08)' }} />

        {/* Darkness */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />

        {/* Left side contrast — makes face pop */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/5 to-transparent" />

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
          }}
        />

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.25,
              delayChildren: 0.4,
            },
          },
        }}
      >
        {/* TOP LINE */}
        <motion.p
          className="tracking-[0.55em] uppercase mb-3 sm:mb-6"
          style={{
            fontSize: isMobile ? '10px' : '11px',
            color: 'rgba(196,101,26,0.75)',
            fontWeight: '700',
            letterSpacing: '0.55em',
          }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Mega Power Star
        </motion.p>

        {/* TITLE */}
        <motion.h1
          className="text-white leading-none mb-3 sm:mb-6"
style={{
  fontFamily: 'var(--font-bebas)',
  fontSize: isMobile ? 'clamp(2.4rem, 10vw, 3.2rem)' : '8rem',
  letterSpacing: '0.08em',
}}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          RAM <br />
          <span style={{ color: '#C4651A', filter: 'drop-shadow(0 0 25px rgba(160,60,8,0.8))', fontFamily: 'var(--font-bebas)' }}>CHARAN</span>
          {/* Orange glow underline */}
          <motion.div
            className="mx-auto mt-2"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.2, ease: 'easeInOut' }}
            style={{
              height: '2px',
              width: isMobile ? '75%' : '60%',
              transformOrigin: 'center',
              background: 'linear-gradient(90deg, transparent, #6B1A02 15%, #A33A08 40%, #C4651A 50%, #A33A08 60%, #6B1A02 85%, transparent)',
              boxShadow: '0 0 12px rgba(163,58,8,0.7), 0 0 28px rgba(100,30,5,0.5)',
              display: 'block',
            }}
          />
        </motion.h1>

        {/* TAGLINE */}
        <motion.p
          className="max-w-2xl mx-auto mb-6 sm:mb-12 px-2 sm:px-0"
          style={{
            fontSize: isMobile ? '13px' : '15px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(220,180,140,0.65)',
            fontWeight: '600',
            lineHeight: '1.8',
          }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Rage · Fire · Mass · Cinema
        </motion.p>

        {/* CTA — stacked on mobile, side by side on desktop */}
        <motion.div
          className="flex flex-row justify-center gap-3 sm:gap-4 px-2 sm:px-0"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            onClick={() => router.push('/gallery')}
            className="px-5 sm:px-10 py-3 sm:py-4 font-bold uppercase tracking-wider text-xs sm:text-base"
            style={{ background: 'linear-gradient(135deg, #C4651A 0%, #A33A08 60%, #8B2500 100%)', color: '#f5e6d8', boxShadow: '0 0 25px rgba(139,37,0,0.6)', border: '1px solid rgba(180,70,15,0.4)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Enter Gallery →
          </motion.button>

          <motion.button
            onClick={() => router.push('/submit')}
            className="px-5 sm:px-10 py-3 sm:py-4 uppercase tracking-wider text-xs sm:text-base font-bold"
            style={{
              border: '2px solid #A33A08',
              color: '#f5e6d8',
              background: 'rgba(139,37,0,0.25)',
              boxShadow: '0 0 18px rgba(139,37,0,0.35), inset 0 0 12px rgba(139,37,0,0.15)',
            }}
            whileHover={{
              scale: 1.05,
              background: 'rgba(139,37,0,0.45)',
              boxShadow: '0 0 28px rgba(163,58,8,0.55)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            Submit Creation
          </motion.button>
        </motion.div>

{/* Slide indicator dots */}
        <motion.div
          className="flex justify-center gap-2 mt-6 sm:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {heroImages.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === index ? (isMobile ? '20px' : '24px') : (isMobile ? '6px' : '7px'),
                height: isMobile ? '6px' : '7px',
                background: i === index
                  ? 'linear-gradient(90deg, #6B1A02, #A33A08)'
                  : 'rgba(255,255,255,0.25)',
                boxShadow: i === index ? '0 0 8px rgba(139,58,15,0.7)' : 'none',
              }}
              animate={{
                width: i === index ? (isMobile ? 20 : 24) : (isMobile ? 6 : 7),
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>

       {/* SCROLL indicator — animated arrow */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ bottom: isMobile ? '12px' : '20px' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[9px] tracking-[0.4em] uppercase text-white/30">Scroll</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 3 L9 15 M9 15 L4 10 M9 15 L14 10"
              stroke="rgba(163,58,8,0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}