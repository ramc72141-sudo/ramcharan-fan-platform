'use client'

import React from "react"
import { useState, useEffect, memo } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const titleLetters = 'ADMIN LOGIN'.split('')

// ── Mobile-aware EmberParticles ──────────────────────────────
const emberPositions = [
  { top: 5,  left: 4  }, { top: 12, left: 22 }, { top: 22, left: 8  },
  { top: 35, left: 38 }, { top: 48, left: 14 }, { top: 58, left: 55 },
  { top: 70, left: 28 }, { top: 82, left: 48 }, { top: 92, left: 18 },
  { top: 8,  left: 68 }, { top: 18, left: 82 }, { top: 30, left: 92 },
  { top: 42, left: 72 }, { top: 55, left: 62 }, { top: 65, left: 88 },
  { top: 75, left: 45 }, { top: 85, left: 78 }, { top: 95, left: 58 },
  { top: 15, left: 32 }, { top: 28, left: 52 }, { top: 40, left: 18 },
  { top: 52, left: 28 }, { top: 62, left: 42 }, { top: 72, left: 12 },
  { top: 88, left: 32 }, { top: 5,  left: 85 }, { top: 25, left: 95 },
  { top: 45, left: 75 },
]

const EmberParticles = memo(function EmberParticles({ isMobile }: { isMobile: boolean }) {
  const count = isMobile ? 14 : 28
  const positions = emberPositions.slice(0, count)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 5 === 0 ? (isMobile ? 4 : 5) : i % 3 === 0 ? 3.5 : 2.5,
            height: i % 5 === 0 ? (isMobile ? 4 : 5) : i % 3 === 0 ? 3.5 : 2.5,
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            background: i % 4 === 0
              ? 'radial-gradient(circle, #ff8c00, #ff4500)'
              : i % 3 === 0
              ? 'radial-gradient(circle, #ffaa00, #ea7c10)'
              : i % 2 === 0
              ? 'radial-gradient(circle, #fb923c, #c45208)'
              : 'radial-gradient(circle, #fcd34d, #d97706)',
            boxShadow: i % 4 === 0
              ? '0 0 8px 3px rgba(255,120,0,0.7)'
              : i % 3 === 0
              ? '0 0 6px 2px rgba(255,160,0,0.6)'
              : '0 0 4px 1px rgba(234,124,16,0.5)',
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -(50 + (i % 4) * 18), 0],
            x: [0, i % 2 === 0 ? 10 : -9, 0],
            opacity: [0.1, isMobile ? 0.7 : 0.85, 0.1],
            scale: [1, 1.4, 0.3],
          }}
          transition={{
            duration: 3.5 + (i % 5) * 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (i * 0.28) % 4,
          }}
        />
      ))}
    </div>
  )
})

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    // Only track mouse on desktop — pointless on mobile and wastes battery
    if (isMobile) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        window.location.href = '/admin'
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#030302]">

      <style suppressHydrationWarning>{`
        .admin-input::placeholder { color: rgba(200,130,40,0.22) !important; }
        .admin-input { color: rgba(255,255,255,0.88); }

        @keyframes scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(900%); opacity: 0; }
        }
        .scan-line { animation: scan 5s ease-in-out infinite; animation-delay: 1.5s; }

        @keyframes ring-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.16; }
          50%       { transform: scale(1.05); opacity: 0.28; }
        }
        .ring-pulse { animation: ring-pulse 4s ease-in-out infinite; }

        @keyframes ring-pulse-2 {
          0%, 100% { transform: scale(1);    opacity: 0.08; }
          50%       { transform: scale(1.09); opacity: 0.18; }
        }
        .ring-pulse-2 { animation: ring-pulse-2 5.5s ease-in-out infinite; animation-delay: 1s; }

        /* Mobile — lighter ring animations */
        @media (max-width: 640px) {
          @keyframes ring-pulse-mobile {
            0%, 100% { transform: scale(1);    opacity: 0.10; }
            50%       { transform: scale(1.03); opacity: 0.18; }
          }
          .ring-pulse { animation: ring-pulse-mobile 4s ease-in-out infinite; }

          @keyframes ring-pulse-2-mobile {
            0%, 100% { transform: scale(1);    opacity: 0.05; }
            50%       { transform: scale(1.06); opacity: 0.12; }
          }
          .ring-pulse-2 { animation: ring-pulse-2-mobile 5.5s ease-in-out infinite; animation-delay: 1s; }
        }
      `}</style>

      {/* ===== CINEMATIC BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(180,80,10,0.18) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, rgba(200,120,30,0.18) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' /%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.92) 100%)' }} />

        {/* Mouse follow glow — desktop only */}
        {!isMobile && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(180,80,10,0.12) 0%, rgba(140,60,8,0.06) 40%, transparent 70%)',
              left: mousePos.x - 250,
              top: mousePos.y - 250,
            }}
          />
        )}

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/55 to-transparent" />
      </div>

      {/* ===== EMBER PARTICLES — mobile aware ===== */}
      <EmberParticles isMobile={isMobile} />

      {/* Dark halo behind card — smaller on mobile */}
      <div
        className="absolute z-0 pointer-events-none rounded-2xl"
        style={{
          width: isMobile ? '360px' : '580px',
          height: isMobile ? '620px' : '560px',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)',
          boxShadow: '0 0 80px 40px rgba(0,0,0,0.7)',
        }}
      />

      {/* ===== PULSING RINGS — smaller on mobile ===== */}
      <div
        className="absolute z-0 flex items-center justify-center pointer-events-none"
        style={{
          width: isMobile ? '340px' : '560px',
          height: isMobile ? '580px' : '520px',
        }}
      >
        <div className="ring-pulse absolute w-full h-full rounded-2xl" style={{ border: '1px solid rgba(200,110,15,0.32)', boxShadow: '0 0 35px rgba(180,80,10,0.18)' }} />
        <div
          className="ring-pulse-2 absolute rounded-2xl"
          style={{
            width: isMobile ? '380px' : '620px',
            height: isMobile ? '630px' : '580px',
            border: '1px solid rgba(200,110,15,0.14)',
            boxShadow: '0 0 55px rgba(160,70,8,0.10)',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >

        {/* ===== HEADER ===== */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-block mb-4 sm:mb-5">
            <motion.div
              className="font-black tracking-[0.3em]"
              style={{
                fontSize: isMobile ? '1.75rem' : '1.875rem',
                background: 'linear-gradient(160deg, #fbbf60 0%, #ea7c10 50%, #c45a08 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 12px rgba(234,124,16,0.6)) drop-shadow(0 0 30px rgba(180,80,10,0.3))',
              }}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.2 }}
            >
              RC
            </motion.div>
          </Link>

          {/* Letter-by-letter title */}
          <div className="flex justify-center flex-wrap mb-2">
            {titleLetters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 18, scale: 0.82 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.3 + i * 0.055,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-black"
                style={{
                  fontSize: isMobile ? '1.4rem' : '1.75rem',
                  background: 'linear-gradient(170deg, #ffffff 0%, #e8a040 60%, #c06010 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: char === ' ' ? 'transparent' : undefined,
                  backgroundClip: 'text',
                  filter: char !== ' ' ? 'drop-shadow(0 0 16px rgba(200,100,15,0.38))' : 'none',
                  letterSpacing: '0.12em',
                  display: 'inline-block',
                  width: char === ' ' ? '0.6rem' : 'auto',
                  willChange: 'transform, opacity',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="text-[11px] tracking-[0.35em] uppercase font-medium"
            style={{ color: 'rgba(200,130,40,0.52)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            Restricted Access · Authorized Only
          </motion.p>
        </div>

        {/* ===== FORM CARD ===== */}
        <motion.form
          className="relative rounded-xl overflow-hidden"
          style={{
            padding: isMobile ? '24px 20px' : '32px',
            background: '#0a0805',
            border: '1px solid rgba(210,125,22,0.28)',
            boxShadow: '0 0 50px rgba(0,0,0,0.85), 0 0 0 1px rgba(210,125,22,0.14) inset, 0 0 70px rgba(150,65,8,0.12) inset, 0 0 20px rgba(180,85,10,0.08)',
          }}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Card top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/55 to-transparent" />

          {/* ===== SCANNING LINE ===== */}
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <div
              className="scan-line absolute left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(234,124,16,0.0) 8%, rgba(234,124,16,0.55) 35%, rgba(255,190,70,0.85) 50%, rgba(234,124,16,0.55) 65%, rgba(234,124,16,0.0) 92%, transparent 100%)',
                boxShadow: '0 0 14px 4px rgba(210,108,14,0.45)',
              }}
            />
          </div>

          {/* ===== CORNER BRACKETS ===== */}
          <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
            <div className="absolute top-0 left-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
          </div>
          <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
            <div className="absolute top-0 right-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
          </div>
          <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
            <div className="absolute bottom-0 left-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
          </div>
          <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
            <div className="absolute bottom-0 right-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.72)' }} />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              className="mb-5 p-4 rounded-lg text-sm tracking-wide"
              style={{ background: 'rgba(180,40,20,0.12)', border: '1px solid rgba(220,60,30,0.25)', color: '#f87060' }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Email */}
          <motion.div
            className="mb-4 sm:mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <label className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(200,130,40,0.7)' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ramcharan.com"
              className="admin-input w-full rounded-lg text-[13px] tracking-wide transition-all duration-200 outline-none"
              style={{
                padding: isMobile ? '11px 14px' : '12px 16px',
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(200,120,20,0.28)',
                boxShadow: '0 3px 12px rgba(0,0,0,0.7) inset, 0 1px 0 rgba(200,110,15,0.06)',
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid rgba(234,124,16,0.58)'
                e.target.style.boxShadow = '0 0 0 3px rgba(180,80,10,0.12), 0 3px 12px rgba(0,0,0,0.7) inset'
                e.target.style.background = 'rgba(180,80,10,0.07)'
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid rgba(200,120,20,0.28)'
                e.target.style.boxShadow = '0 3px 12px rgba(0,0,0,0.7) inset, 0 1px 0 rgba(200,110,15,0.06)'
                e.target.style.background = 'rgba(0,0,0,0.35)'
              }}
            />
          </motion.div>

          {/* Password */}
          <motion.div
            className="mb-6 sm:mb-7"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <label className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(200,130,40,0.7)' }}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="admin-input w-full pr-12 rounded-lg text-[13px] tracking-[0.15em] transition-all duration-200 outline-none"
                style={{
                  padding: isMobile ? '11px 14px' : '12px 16px',
                  paddingRight: '48px',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(200,120,20,0.28)',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.7) inset, 0 1px 0 rgba(200,110,15,0.06)',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(234,124,16,0.58)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(180,80,10,0.12), 0 3px 12px rgba(0,0,0,0.7) inset'
                  e.target.style.background = 'rgba(180,80,10,0.07)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(200,120,20,0.28)'
                  e.target.style.boxShadow = '0 3px 12px rgba(0,0,0,0.7) inset, 0 1px 0 rgba(200,110,15,0.06)'
                  e.target.style.background = 'rgba(0,0,0,0.35)'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                style={{ color: 'rgba(200,130,40,0.5)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(234,124,16,0.9)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(200,130,40,0.5)')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-[13px] rounded-lg font-bold uppercase transition-all duration-200 disabled:opacity-40"
            style={{
              fontSize: isMobile ? '11px' : '12px',
              letterSpacing: isMobile ? '0.2em' : '0.3em',
              background: isLoading
                ? 'rgba(180,80,10,0.4)'
                : 'linear-gradient(135deg, #ea7c10 0%, #c45208 60%, #9a3a05 100%)',
              color: '#fff8f0',
              boxShadow: isLoading ? 'none' : '0 0 20px rgba(200,100,15,0.35), 0 2px 0 rgba(0,0,0,0.5) inset',
              border: '1px solid rgba(234,124,16,0.3)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={!isLoading ? {
              scale: 1.015,
              y: -2,
              boxShadow: '0 0 32px rgba(220,120,20,0.52), 0 2px 0 rgba(0,0,0,0.5) inset',
            } : {}}
            whileTap={!isLoading ? { scale: 0.985, y: 0 } : {}}
          >
            {isLoading ? 'Verifying...' : 'Enter System'}
          </motion.button>

          {/* Divider */}
          <div className="my-5 sm:my-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(200,120,20,0.1)' }} />
            <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: 'rgba(200,130,40,0.35)' }}>
              Protected Area
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(200,120,20,0.1)' }} />
          </div>

          {/* Back Link */}
          <Link
            href="/"
            className="block text-center text-[11px] tracking-[0.2em] uppercase transition-colors duration-200"
            style={{ color: 'rgba(200,130,40,0.4)' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(234,124,16,0.8)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(200,130,40,0.4)')}
          >
            ← Back to Home
          </Link>

          {/* Card bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/25 to-transparent" />
        </motion.form>

        {/* ===== SECURITY NOTICE ===== */}
        <motion.div
          className="mt-4 sm:mt-5 p-4 rounded-xl text-center"
          style={{ background: 'rgba(180,80,10,0.05)', border: '1px solid rgba(180,80,10,0.12)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: 'rgba(200,120,30,0.38)' }}>
            <Lock className="w-3 h-3 inline mr-1.5 opacity-60" />
            Secure admin area — do not share your credentials
          </p>
        </motion.div>

      </motion.div>
    </div>
  )
}