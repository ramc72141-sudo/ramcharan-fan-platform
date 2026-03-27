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

  // Desktop: all centered
  // Mobile: per-image focal point so full subject is visible
  // Values tuned from your screenshots:
  // rc-1 (police/fire) – subject is left-center → show left portion
  // rc-2 (RRR horse)   – subject is right side → shift right
  // rc-3 (sunglasses)  – giant face, zoom out more + center
  // rc-4 (green horse) – subject is center-top → show top
  const mobilePositions = [
    '30% center',   // rc-1: shift left to show the face
    '75% center',   // rc-2: shift right to show rider on horse
    'center 25%',   // rc-3: show upper face with sunglasses
    'center 20%',   // rc-4: show upper body on horse
  ]

  // On mobile, zoom out more so the full subject fits in portrait viewport
  const mobileScales = [1.0, 1.0, 0.95, 1.0]

  const [index, setIndex] = useState(0)
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
            // On mobile: don't zoom in — use scale 1 so full image is visible
            // On desktop: keep cinematic zoom
            scale: isMobile ? mobileScales[index] : 1.18,
          }}
          transition={{
            opacity: { duration: 2.2, ease: 'easeInOut' },
            scale: { duration: 6.5, ease: 'easeInOut' },
          }}
          style={{
            backgroundImage: `url(${heroImages[index]})`,
            // KEY FIX: on mobile use 'contain' so full image is always visible
            // with black bars rather than cropping the subject
            backgroundSize: isMobile ? 'cover' : 'cover',
            backgroundPosition: isMobile ? mobilePositions[index] : 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform, opacity',
            filter: 'brightness(1.15) contrast(1.2) saturate(1.1)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
        <div className="absolute inset-0 mix-blend-overlay" style={{ background: 'rgba(120,40,8,0.08)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/5 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
          }}
        />
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
      {/*
        On mobile: position content in the LOWER 40% of screen so the image
        shows above it — just like desktop where subject fills upper area
        and text/buttons sit in the middle-lower region.
        We use absolute positioning on mobile for precise placement.
      */}
      {isMobile ? (
        // ── MOBILE LAYOUT: content pinned to lower portion ──
        <div
          className="absolute z-10 w-full text-center"
          style={{ bottom: '80px', left: 0, right: 0, padding: '0 20px' }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
            }}
          >
            {/* TOP LINE */}
            <motion.p
              className="uppercase"
              style={{ fontSize: '9px', color: 'rgba(196,101,26,0.85)', fontWeight: '700', letterSpacing: '0.55em', marginBottom: '6px' }}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7 }}
            >
              Mega Power Star
            </motion.p>

            {/* TITLE */}
            <motion.h1
              className="text-white leading-none"
              style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2.8rem, 16vw, 3.8rem)', letterSpacing: '0.08em', marginBottom: '2px' }}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.9 }}
            >
              RAM <br />
              <span style={{ color: '#C4651A', filter: 'drop-shadow(0 0 20px rgba(160,60,8,0.8))', fontFamily: 'var(--font-bebas)' }}>
                CHARAN
              </span>
              <motion.div
                className="mx-auto"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 1.0 }}
                style={{
                  height: '2px', width: '70%', transformOrigin: 'center', marginTop: '6px',
                  background: 'linear-gradient(90deg, transparent, #6B1A02 15%, #A33A08 40%, #C4651A 50%, #A33A08 60%, #6B1A02 85%, transparent)',
                  boxShadow: '0 0 12px rgba(163,58,8,0.7)',
                }}
              />
            </motion.h1>

            {/* TAGLINE */}
            <motion.p
              style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(220,180,140,0.7)', fontWeight: '600', lineHeight: '1.8', marginTop: '8px', marginBottom: '16px' }}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7 }}
            >
              Rage · Fire · Mass · Cinema
            </motion.p>

            {/* CTA BUTTONS */}
            <motion.div
              className="flex flex-row justify-center"
              style={{ gap: '10px' }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.6 }}
            >
              <motion.button
                onClick={() => router.push('/gallery')}
                style={{
                  background: 'linear-gradient(135deg, #C4651A 0%, #A33A08 60%, #8B2500 100%)',
                  color: '#f5e6d8', boxShadow: '0 0 20px rgba(139,37,0,0.6)',
                  border: '1px solid rgba(180,70,15,0.4)',
                  padding: '11px 22px', fontSize: '11px', fontWeight: 'bold',
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                }}
                whileTap={{ scale: 0.97 }}
              >
                Enter Gallery →
              </motion.button>
              <motion.button
                onClick={() => router.push('/submit')}
                style={{
                  border: '2px solid #A33A08', color: '#f5e6d8',
                  background: 'rgba(139,37,0,0.25)',
                  boxShadow: '0 0 15px rgba(139,37,0,0.35)',
                  padding: '11px 22px', fontSize: '11px', fontWeight: 'bold',
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                }}
                whileTap={{ scale: 0.97 }}
              >
                Submit Creation
              </motion.button>
            </motion.div>

            {/* DOTS */}
            <motion.div
              className="flex justify-center gap-2"
              style={{ marginTop: '14px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {heroImages.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="rounded-full"
                  style={{
                    height: '6px',
                    background: i === index ? 'linear-gradient(90deg, #6B1A02, #A33A08)' : 'rgba(255,255,255,0.25)',
                    boxShadow: i === index ? '0 0 8px rgba(139,58,15,0.7)' : 'none',
                  }}
                  animate={{ width: i === index ? 20 : 6 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      ) : (
        // ── DESKTOP LAYOUT: original centered layout ──
        <motion.div
          className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.25, delayChildren: 0.4 } },
          }}
        >
          <motion.p
            className="tracking-[0.55em] uppercase mb-6"
            style={{ fontSize: '11px', color: 'rgba(196,101,26,0.75)', fontWeight: '700', letterSpacing: '0.55em' }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Mega Power Star
          </motion.p>

          <motion.h1
            className="text-white leading-none mb-6"
            style={{ fontFamily: 'var(--font-bebas)', fontSize: '8rem', letterSpacing: '0.08em' }}
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            RAM <br />
            <span style={{ color: '#C4651A', filter: 'drop-shadow(0 0 25px rgba(160,60,8,0.8))', fontFamily: 'var(--font-bebas)' }}>CHARAN</span>
            <motion.div
              className="mx-auto mt-2"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.2, ease: 'easeInOut' }}
              style={{
                height: '2px', width: '60%', transformOrigin: 'center',
                background: 'linear-gradient(90deg, transparent, #6B1A02 15%, #A33A08 40%, #C4651A 50%, #A33A08 60%, #6B1A02 85%, transparent)',
                boxShadow: '0 0 12px rgba(163,58,8,0.7), 0 0 28px rgba(100,30,5,0.5)', display: 'block',
              }}
            />
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto mb-12"
            style={{ fontSize: '15px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(220,180,140,0.65)', fontWeight: '600', lineHeight: '1.8' }}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Rage · Fire · Mass · Cinema
          </motion.p>

          <motion.div
            className="flex flex-row justify-center gap-4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              onClick={() => router.push('/gallery')}
              className="px-10 py-4 font-bold uppercase tracking-wider text-base"
              style={{ background: 'linear-gradient(135deg, #C4651A 0%, #A33A08 60%, #8B2500 100%)', color: '#f5e6d8', boxShadow: '0 0 25px rgba(139,37,0,0.6)', border: '1px solid rgba(180,70,15,0.4)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Enter Gallery →
            </motion.button>
            <motion.button
              onClick={() => router.push('/submit')}
              className="px-10 py-4 uppercase tracking-wider text-base font-bold"
              style={{ border: '2px solid #A33A08', color: '#f5e6d8', background: 'rgba(139,37,0,0.25)', boxShadow: '0 0 18px rgba(139,37,0,0.35), inset 0 0 12px rgba(139,37,0,0.15)' }}
              whileHover={{ scale: 1.05, background: 'rgba(139,37,0,0.45)', boxShadow: '0 0 28px rgba(163,58,8,0.55)' }}
              whileTap={{ scale: 0.97 }}
            >
              Submit Creation
            </motion.button>
          </motion.div>

          <motion.div
            className="flex justify-center gap-2 mt-16"
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
                  height: '7px',
                  background: i === index ? 'linear-gradient(90deg, #6B1A02, #A33A08)' : 'rgba(255,255,255,0.25)',
                  boxShadow: i === index ? '0 0 8px rgba(139,58,15,0.7)' : 'none',
                }}
                animate={{ width: i === index ? 24 : 7 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ bottom: '20px' }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[9px] tracking-[0.4em] uppercase text-white/30">Scroll</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3 L9 15 M9 15 L4 10 M9 15 L14 10" stroke="rgba(163,58,8,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* SCROLL indicator for mobile */}
      {isMobile && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ bottom: '14px' }}
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[8px] tracking-[0.4em] uppercase text-white/30">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3 L9 15 M9 15 L4 10 M9 15 L14 10" stroke="rgba(163,58,8,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </section>
  )
}