'use client'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const titleLetters = 'TRACK SUBMISSION'.split('')

export default function CheckStatus() {
  const router = useRouter()
  const [trackingId, setTrackingId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (result?.status === 'approved') {
      confetti({
        particleCount: isMobile ? 80 : 150,
        spread: isMobile ? 70 : 100,
        origin: { y: 0.6 },
        shapes: ['star'],
        colors: ['#FFD700', '#FFA500', '#FFFFFF'],
      })
    }
  }, [result])

  useEffect(() => {
    if (result?.status === 'approved') {
      const timer = setTimeout(() => router.push('/gallery'), 4000)
      return () => clearTimeout(timer)
    }
  }, [result, router])

  const handleCheck = async () => {
    setError('')
    setResult(null)
    setLoading(true)
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('tracking_id', trackingId)
      .single()
    if (error || !data) {
      setError('Submission not found. Please check your Tracking ID.')
    } else {
      setResult(data)
    }
    setLoading(false)
  }

  // ── Deterministic ember positions — evenly spread ──
  const emberPositions = [
    { top: 4,  left: 3  }, { top: 12, left: 15 }, { top: 22, left: 5  },
    { top: 35, left: 25 }, { top: 48, left: 8  }, { top: 58, left: 38 },
    { top: 70, left: 18 }, { top: 82, left: 48 }, { top: 92, left: 28 },
    { top: 8,  left: 55 }, { top: 18, left: 68 }, { top: 30, left: 78 },
    { top: 42, left: 88 }, { top: 55, left: 62 }, { top: 65, left: 92 },
    { top: 75, left: 72 }, { top: 85, left: 85 }, { top: 95, left: 58 },
    { top: 15, left: 42 }, { top: 28, left: 52 }, { top: 40, left: 32 },
    { top: 52, left: 18 }, { top: 62, left: 45 }, { top: 72, left: 32 },
    { top: 88, left: 12 }, { top: 5,  left: 82 }, { top: 25, left: 95 },
    { top: 45, left: 72 }, { top: 68, left: 58 }, { top: 90, left: 42 },
  ]

  // Mobile uses fewer particles
  const particleCount = isMobile ? 14 : 30
  const activePositions = emberPositions.slice(0, particleCount)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-[#060504]">

      {/* ===== BACK TO HOME ===== */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-200"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(200,100,15,0.25)',
            color: 'rgba(200,130,40,0.6)',
            backdropFilter: 'blur(8px)',
          }}
          onMouseEnter={(ev) => {
            (ev.currentTarget as HTMLElement).style.color = 'rgba(234,124,16,0.9)'
            ;(ev.currentTarget as HTMLElement).style.border = '1px solid rgba(200,100,15,0.5)'
            ;(ev.currentTarget as HTMLElement).style.background = 'rgba(180,80,10,0.15)'
          }}
          onMouseLeave={(ev) => {
            (ev.currentTarget as HTMLElement).style.color = 'rgba(200,130,40,0.6)'
            ;(ev.currentTarget as HTMLElement).style.border = '1px solid rgba(200,100,15,0.25)'
            ;(ev.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.5)'
          }}
        >
          ← Home
        </Link>
      </div>

      <style suppressHydrationWarning>{`
        @keyframes scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(800%); opacity: 0; }
        }
        .scan-line {
          animation: scan 4s ease-in-out infinite;
          animation-delay: 2s;
        }
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.18; }
          50%       { transform: scale(1.06); opacity: 0.32; }
        }
        .ring-pulse { animation: ring-pulse 4s ease-in-out infinite; }

        @keyframes ring-pulse-2 {
          0%, 100% { transform: scale(1);   opacity: 0.10; }
          50%       { transform: scale(1.10); opacity: 0.20; }
        }
        .ring-pulse-2 { animation: ring-pulse-2 5s ease-in-out infinite; animation-delay: 1s; }

        .track-input::placeholder { color: rgba(200,120,30,0.28); }

        /* Mobile — lighter ring pulse */
        @media (max-width: 640px) {
          @keyframes ring-pulse-mobile {
            0%, 100% { transform: scale(1);    opacity: 0.12; }
            50%       { transform: scale(1.04); opacity: 0.22; }
          }
          .ring-pulse { animation: ring-pulse-mobile 4s ease-in-out infinite; }

          @keyframes ring-pulse-2-mobile {
            0%, 100% { transform: scale(1);    opacity: 0.06; }
            50%       { transform: scale(1.07); opacity: 0.14; }
          }
          .ring-pulse-2 { animation: ring-pulse-2-mobile 5s ease-in-out infinite; animation-delay: 1s; }
        }
      `}</style>

      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(160,70,8,0.22) 0%, rgba(100,40,5,0.08) 50%, transparent 75%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 30% at 50% 0%, rgba(180,80,10,0.12) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(200,120,30,0.2) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 opacity-[0.055]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' /%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.9) 100%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-700/20 to-transparent" />
      </div>

      {/* ===== EMBER PARTICLES — deterministic, mobile reduced ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {activePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 5 === 0 ? 5 : i % 3 === 0 ? 3.5 : 2.5,
              height: i % 5 === 0 ? 5 : i % 3 === 0 ? 3.5 : 2.5,
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
              y: [0, -(55 + (i % 4) * 20), 0],
              x: [0, i % 2 === 0 ? 12 : -10, 0],
              opacity: [0.1, 0.9, 0.1],
              scale: [1, 1.5, 0.3],
            }}
            transition={{
              duration: 3.5 + (i % 5) * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: (i * 0.3) % 4,
            }}
          />
        ))}
      </div>

      {/* ===== PULSING RING GLOW — smaller on mobile ===== */}
      <div
        className="absolute z-0 flex items-center justify-center pointer-events-none"
        style={{
          width: isMobile ? '360px' : '700px',
          height: isMobile ? '520px' : '400px',
        }}
      >
        <div className="ring-pulse absolute w-full h-full rounded-2xl" style={{ border: '1px solid rgba(200,110,15,0.35)', boxShadow: '0 0 40px rgba(180,80,10,0.2)' }} />
        <div
          className="ring-pulse-2 absolute rounded-2xl"
          style={{
            width: isMobile ? '400px' : '760px',
            height: isMobile ? '570px' : '460px',
            border: '1px solid rgba(200,110,15,0.15)',
            boxShadow: '0 0 60px rgba(160,70,8,0.12)',
          }}
        />
      </div>

      {/* ===== MAIN CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl"
      >
        {/* Outer glow */}
        <div className="absolute -inset-[1px] rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(160deg, rgba(200,100,15,0.14) 0%, transparent 50%, rgba(180,70,8,0.10) 100%)' }} />

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            padding: isMobile ? '24px 20px' : '40px',
            background: '#080604',
            border: '1px solid rgba(200,110,15,0.16)',
            boxShadow: '0 0 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(180,80,10,0.07) inset, 0 0 90px rgba(130,55,5,0.09) inset',
          }}
        >
          {/* Top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/28 to-transparent" />

          {/* ===== SCANNING LINE ===== */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div
              className="scan-line absolute left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(234,124,16,0.0) 10%, rgba(234,124,16,0.35) 40%, rgba(255,180,60,0.55) 50%, rgba(234,124,16,0.35) 60%, rgba(234,124,16,0.0) 90%, transparent 100%)',
                boxShadow: '0 0 12px 4px rgba(200,100,15,0.25)',
              }}
            />
          </div>

          {/* ===== CORNER BRACKETS ===== */}
          <div className="absolute top-3 left-3 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
            <div className="absolute top-0 left-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
          </div>
          <div className="absolute top-3 right-3 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
            <div className="absolute top-0 right-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
          </div>
          <div className="absolute bottom-3 left-3 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
            <div className="absolute bottom-0 left-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
          </div>
          <div className="absolute bottom-3 right-3 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
            <div className="absolute bottom-0 right-0 h-full w-[1.5px]" style={{ background: 'rgba(234,124,16,0.55)' }} />
          </div>

          {/* ===== TITLE ===== */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.p
              className="text-[10px] tracking-[0.45em] uppercase mb-3 font-medium"
              style={{ color: 'rgba(200,120,30,0.45)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Fan Submission Portal
            </motion.p>

            {/* Animated letter-by-letter title */}
            <div className="flex justify-center flex-wrap">
              {titleLetters.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.4 + i * 0.045,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    fontSize: isMobile ? '1.25rem' : '1.65rem',
                    fontWeight: 900,
                    background: 'linear-gradient(170deg, #ffffff 0%, #e8a040 55%, #c06010 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: char === ' ' ? 'transparent' : undefined,
                    backgroundClip: 'text',
                    filter: char !== ' ' ? 'drop-shadow(0 0 14px rgba(200,100,15,0.35))' : 'none',
                    letterSpacing: '0.09em',
                    width: char === ' ' ? '0.5rem' : 'auto',
                    display: 'inline-block',
                    willChange: 'transform, opacity',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">

            {/* Input */}
            <div>
              <motion.p
                className="text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold"
                style={{ color: 'rgba(200,120,30,0.5)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Enter Tracking Code
              </motion.p>
              <motion.input
                type="text"
                placeholder="e.g. FAN-ABC123"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="track-input w-full rounded-xl text-[13px] tracking-[0.08em] transition-all duration-200 outline-none"
                style={{
                  padding: isMobile ? '12px 16px' : '16px 20px',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(200,110,15,0.18)',
                  color: 'rgba(255,255,255,0.82)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.4) inset',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid rgba(234,124,16,0.55)'
                  e.target.style.boxShadow = '0 0 0 3px rgba(180,80,10,0.1), 0 2px 12px rgba(0,0,0,0.4) inset'
                  e.target.style.background = 'rgba(180,80,10,0.05)'
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(200,110,15,0.18)'
                  e.target.style.boxShadow = '0 2px 12px rgba(0,0,0,0.4) inset'
                  e.target.style.background = 'rgba(255,255,255,0.025)'
                }}
              />
            </div>

            {/* Button */}
            <motion.button
              onClick={handleCheck}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold tracking-[0.3em] uppercase transition-all duration-200 disabled:opacity-40"
              style={{
                fontSize: isMobile ? '11px' : '12px',
                letterSpacing: isMobile ? '0.2em' : '0.3em',
                background: loading
                  ? 'rgba(180,80,10,0.4)'
                  : 'linear-gradient(135deg, #ea7c10 0%, #c45208 55%, #9a3a05 100%)',
                color: '#fff8f0',
                border: '1px solid rgba(234,124,16,0.28)',
                boxShadow: loading ? 'none' : '0 0 22px rgba(200,100,15,0.32), 0 2px 0 rgba(0,0,0,0.5) inset',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={!loading ? {
                scale: 1.012,
                y: -2,
                boxShadow: '0 0 38px rgba(220,120,20,0.55), 0 2px 0 rgba(0,0,0,0.5) inset',
              } : {}}
              whileTap={!loading ? { scale: 0.988, y: 0 } : {}}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-orange-200/40 border-t-orange-200 rounded-full mx-auto"
                />
              ) : (
                'Check Status'
              )}
            </motion.button>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-[12px] tracking-wide"
                style={{ color: 'rgba(240,100,80,0.85)' }}
              >
                {error}
              </motion.p>
            )}

            {/* ===== RESULT ===== */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88, rotateX: 12 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="relative mt-4"
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="rounded-full animate-pulse"
                    style={{
                      width: isMobile ? '280px' : '420px',
                      height: isMobile ? '280px' : '420px',
                      background: result.status === 'approved'
                        ? 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)'
                        : result.status === 'rejected'
                        ? 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)'
                        : 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)',
                    }}
                  />
                </div>

                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.55 }}
                  className="relative rounded-2xl text-center space-y-4 sm:space-y-6 overflow-hidden"
                  style={{
                    padding: isMobile ? '24px 20px' : '32px',
                    background: '#070503',
                    border: result.status === 'approved'
                      ? '1px solid rgba(34,197,94,0.2)'
                      : result.status === 'rejected'
                      ? '1px solid rgba(239,68,68,0.2)'
                      : '1px solid rgba(234,179,8,0.2)',
                    boxShadow: result.status === 'approved'
                      ? '0 0 30px rgba(34,197,94,0.07)'
                      : result.status === 'rejected'
                      ? '0 0 30px rgba(239,68,68,0.07)'
                      : '0 0 30px rgba(234,179,8,0.07)',
                  }}
                >
                  {/* Result corner brackets */}
                  {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-4 h-4 pointer-events-none`}>
                      <div className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} w-full h-[1px]`}
                        style={{ background: result.status === 'approved' ? 'rgba(34,197,94,0.4)' : result.status === 'rejected' ? 'rgba(239,68,68,0.4)' : 'rgba(234,179,8,0.4)' }} />
                      <div className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} h-full w-[1px]`}
                        style={{ background: result.status === 'approved' ? 'rgba(34,197,94,0.4)' : result.status === 'rejected' ? 'rgba(239,68,68,0.4)' : 'rgba(234,179,8,0.4)' }} />
                    </div>
                  ))}

                  <p className="text-[9.5px] tracking-[0.45em] uppercase font-semibold"
                    style={{ color: 'rgba(200,120,30,0.4)' }}>
                    Submission Status
                  </p>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="flex justify-center"
                  >
                    {result.status === 'approved' && (
                      <CheckCircle
                        style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64 }}
                        className="text-green-400 drop-shadow-[0_0_25px_rgba(34,197,94,0.6)]"
                      />
                    )}
                    {result.status === 'rejected' && (
                      <XCircle
                        style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64 }}
                        className="text-red-400 drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]"
                      />
                    )}
                    {result.status === 'pending' && (
                      <Clock
                        style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64 }}
                        className="text-yellow-400 animate-spin-slow drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]"
                      />
                    )}
                  </motion.div>

                  <motion.h2
                    key={result.status}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0, rotate: result.status === 'rejected' ? [0, -3, 3, -3, 3, 0] : 0 }}
                    transition={{ duration: 0.55 }}
                    className={`font-black tracking-[0.2em] uppercase ${
                      result.status === 'approved' ? 'text-green-400'
                        : result.status === 'rejected' ? 'text-red-400'
                        : 'text-yellow-400'
                    }`}
                    style={{
                      fontSize: isMobile ? '1.35rem' : '1.5rem',
                      filter: result.status === 'approved'
                        ? 'drop-shadow(0 0 12px rgba(34,197,94,0.4))'
                        : result.status === 'rejected'
                        ? 'drop-shadow(0 0 12px rgba(239,68,68,0.4))'
                        : 'drop-shadow(0 0 12px rgba(234,179,8,0.4))',
                    }}
                  >
                    {result.status.toUpperCase()}
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    {result.status === 'approved' && (
                      <p className="text-green-300/80 text-[12px] tracking-wide leading-relaxed">
                        🎉 Congratulations! Your masterpiece is now featured in the gallery.
                      </p>
                    )}

                    {result.status === 'pending' && (
                      <>
                        <p className="text-yellow-300/80 text-[12px] tracking-wide leading-relaxed">
                          ⏳ Your submission is under review. Our team is evaluating it carefully.
                        </p>
                        <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(234,179,8,0.1)' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '70%' }}
                            transition={{ duration: 2 }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #ca8a04, #eab308)', boxShadow: '0 0 8px rgba(234,179,8,0.5)' }}
                          />
                        </div>
                        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(234,179,8,0.5)' }}>
                          Review in progress...
                        </p>
                      </>
                    )}

                    {result.status === 'rejected' && (
                      <div className="rounded-xl p-4 text-left" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
                        <p className="text-red-300/80 text-[12px] tracking-wide mb-2">
                          ❌ Unfortunately, your submission was not approved.
                        </p>
                        <p className="text-[11px]" style={{ color: 'rgba(240,100,80,0.7)' }}>
                          <span className="font-bold tracking-wide">Reason: </span>
                          {result.rejection_reason || 'No reason provided.'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Card bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-800/15 to-transparent" />
        </div>
      </motion.div>
    </div>
  )
}