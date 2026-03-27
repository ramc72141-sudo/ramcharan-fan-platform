'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ramLetters = ['R', 'A', 'M']
const charanLetters = ['C', 'H', 'A', 'R', 'A', 'N']
const subtitle = 'MEGA POWER STAR ★'

const massEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]
const snapEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

const STONE_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='rust'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='6' seed='5'/%3E%3CfeColorMatrix type='matrix' values='0.6 0.3 0 0 0.3 0.2 0.1 0 0 0.1 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23rust)'/%3E%3C/svg%3E")`

export default function Preloader({ onComplete }: { onComplete?: () => void }) {

 const starAppear     = 0.0
  const subtitleStart  = 2.2
  const subtitleDelay  = 0.08
  const subtitleLen    = subtitle.length * subtitleDelay

  const ramStart       = subtitleStart + subtitleLen + 0.7
  const ramDelay       = 0.18

  const charanStart    = ramStart + ramLetters.length * ramDelay + 0.85
  const charanDelay    = 0.13

  const underlineStart = charanStart + charanLetters.length * charanDelay + 0.9

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])


  // ── Auto-dismiss exactly when full animation completes ──
  useEffect(() => {
    // underlineStart + underline duration + exit fade
    const totalMs = (underlineStart + 2.0 + 1.2) * 1000
    const timer = setTimeout(() => {
      onComplete?.()
    }, totalMs)
    return () => clearTimeout(timer)
  }, [])
  // ── Cinematic timing blueprint ──────────────────────────────
  // 1. Star fades in:        0.0 – 0.8s
  // 2. Pause:                0.8 – 2.2s  (let star settle)
  // 3. Subtitle letters:     2.2s+
  // 4. RAM letters:          after subtitle
  // 5. CHARAN letters:       after RAM + pause
  // 6. Underline:            after CHARAN

 

  // ── Responsive sizing ─────────────────────────────────────
  const starSize      = isMobile ? 320 : 660
  const starHeight    = isMobile ? 360 : 750
  const titleSize     = isMobile ? 'clamp(48px, 17vw, 145px)' : 'clamp(80px, 13vw, 145px)'
  const subtitleSize  = isMobile ? 'clamp(8px, 2.5vw, 16px)' : 'clamp(12px, 1.6vw, 16px)'
  const particleCount = isMobile ? 12 : 25

  // ── Styles ──────────────────────────────────────────────────
  const heroLetterStyle = {
    fontFamily: "'Cinzel', serif",
    letterSpacing: isMobile ? '0.03em' : '0.05em',
    WebkitTextStroke: isMobile ? '1.5px #c8892a' : '2px #c8892a',
    backgroundImage: `
      ${STONE_TEXTURE},
      linear-gradient(175deg,
        #ffda8a 0%,
        #c8892a 25%,
        #7a4510 50%,
        #c8892a 75%,
        #ffda8a 100%
      )
    `,
    backgroundBlendMode: 'multiply' as const,
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
    backgroundSize: '200px 200px, 100% 100%',
    filter: `
      drop-shadow(0px 0px 1px rgba(220,150,50,0.9))
      drop-shadow(${isMobile ? '2px 4px' : '3px 5px'} 0px rgba(0,0,0,1))
      drop-shadow(-1px -1px 0px rgba(0,0,0,0.8))
      drop-shadow(0px 0px ${isMobile ? '14px' : '22px'} rgba(180,100,20,0.38))
      drop-shadow(0px 0px ${isMobile ? '28px' : '45px'} rgba(150,70,10,0.2))
    `,
    position: 'relative' as const,
  }

  // Subtitle — softer, less dominant
  const subtitleStyle = {
    fontFamily: "'Cinzel', serif",
    fontWeight: 400,
    letterSpacing: isMobile ? '0.28em' : '0.5em',
    WebkitTextStroke: '0.4px #b07820',
    background: 'linear-gradient(180deg, #c8943a 0%, #9a6418 55%, #7a4a12 100%)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text' as const,
    filter: 'drop-shadow(0px 0px 4px rgba(180,110,20,0.45)) drop-shadow(0px 1px 2px rgba(0,0,0,0.95))',
    opacity: 0.82,
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
style={{ height: '100dvh' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap');

        .ember {
          position: absolute;
          border-radius: 50%;
          animation: float-up linear infinite;
          will-change: transform, opacity;
        }

        @keyframes float-up {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.85; }
          40%  { opacity: 0.5; }
          100% { transform: translateY(-90vh) translateX(var(--drift)) scale(0.05); opacity: 0; }
        }

        .smoke {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(28,22,18,0.45) 0%, transparent 70%);
          animation: drift ease-in-out infinite alternate;
          will-change: transform, opacity;
        }

        @keyframes drift {
          0%   { transform: translateX(0) translateY(0) scale(1); opacity: 0.18; }
          100% { transform: translateX(50px) translateY(-25px) scale(1.4); opacity: 0.35; }
        }

        .star-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-star 2.2s ease-out forwards;
        }

        @keyframes draw-star {
          to { stroke-dashoffset: 0; }
        }

        /* Desktop glow pulse */
        .star-glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
          will-change: filter;
        }

        @keyframes glow-pulse {
          0%, 100% {
            filter:
              drop-shadow(0 0 4px rgba(210,130,25,0.55))
              drop-shadow(0 0 12px rgba(170,85,10,0.28));
          }
          50% {
            filter:
              drop-shadow(0 0 8px rgba(240,160,40,0.65))
              drop-shadow(0 0 22px rgba(200,110,15,0.45))
              drop-shadow(0 0 42px rgba(160,75,8,0.22));
          }
        }

        /* Mobile — lighter glow so GPU doesn't drop frames */
        @media (max-width: 640px) {
          .star-glow-pulse {
            animation: glow-pulse-mobile 4s ease-in-out infinite;
          }
          @keyframes glow-pulse-mobile {
            0%, 100% {
              filter:
                drop-shadow(0 0 3px rgba(210,130,25,0.5))
                drop-shadow(0 0 9px rgba(170,85,10,0.25));
            }
            50% {
              filter:
                drop-shadow(0 0 6px rgba(240,160,40,0.6))
                drop-shadow(0 0 16px rgba(200,110,15,0.4));
            }
          }
        }
      `}</style>

      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#080604]" />

        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(180,120,40,0.12) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Smoke layers — full on desktop, reduced on mobile */}
        <div className="smoke" style={{ width: isMobile ? '350px' : '700px', height: isMobile ? '180px' : '350px', top: '-5%', left: '-20%', animationDuration: '11s' }} />
        {!isMobile && (
          <>
            <div className="smoke" style={{ width: '600px', height: '300px', top: '0%', right: '-15%', animationDuration: '14s', animationDelay: '-5s' }} />
            <div className="smoke" style={{ width: '800px', height: '250px', bottom: '0%', left: '10%', animationDuration: '17s', animationDelay: '-9s' }} />
          </>
        )}
        {isMobile && (
          <div className="smoke" style={{ width: '350px', height: '150px', bottom: '0%', left: '10%', animationDuration: '17s', animationDelay: '-9s' }} />
        )}

        {/* Ember particles — 25 desktop / 12 mobile */}
        {[...Array(particleCount)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${3 + i * (97 / particleCount)}%`,
              bottom: `${2 + (i % 6) * 5}%`,
              animationDuration: `${3 + (i % 6)}s`,
              animationDelay: `${-(i * 0.45)}s`,
              width: i % 5 === 0 ? '5px' : i % 3 === 0 ? '3px' : '2px',
              height: i % 5 === 0 ? '5px' : i % 3 === 0 ? '3px' : '2px',
              background: i % 3 === 0
                ? 'radial-gradient(circle, #ff8c00, #ff4500)'
                : i % 2 === 0
                ? 'radial-gradient(circle, #ff6a00, #ff2200)'
                : 'radial-gradient(circle, #ffaa00, #ff6600)',
              boxShadow: i % 3 === 0
                ? '0 0 5px 2px rgba(255,100,0,0.6)'
                : '0 0 3px 1px rgba(255,80,0,0.4)',
              '--drift': `${i % 2 === 0 ? '+' : '-'}${10 + (i % 3) * 8}px`,
            } as any}
          />
        ))}

        {/* Center warm glow — reduced */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 55% 50% at 50% 52%, rgba(140,70,8,0.18) 0%, rgba(90,40,4,0.07) 50%, transparent 75%)',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.92) 100%)',
          }}
        />

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* ===== STAR — appears first ===== */}
      <div className="absolute z-10 flex items-center justify-center">
        <motion.svg
          viewBox="0 0 300 340"
          width={starSize}
          height={starHeight}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: starAppear,
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="star-glow-pulse"
          style={{ willChange: 'transform, opacity' }}
        >
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur1" />
              <feGaussianBlur stdDeviation="5" result="blur2" />
              <feGaussianBlur stdDeviation="10" result="blur3" />
              <feMerge>
                <feMergeNode in="blur3" />
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer glow fill */}
          <polygon
            points="150,18 174,90 252,90 190,134 214,206 150,164 86,206 110,134 48,90 126,90"
            fill="rgba(140,70,8,0.09)"
          />

          {/* Star body — double stroke */}
          <polygon
            points="150,18 174,90 252,90 190,134 214,206 150,164 86,206 110,134 48,90 126,90"
            fill="none"
            stroke="rgba(150,80,12,0.35)"
            strokeWidth="5"
          />
          <polygon
            points="150,18 174,90 252,90 190,134 214,206 150,164 86,206 110,134 48,90 126,90"
            fill="none"
            stroke="#d89428"
            strokeWidth="1.8"
            className="star-path"
            style={{ animationDelay: '0.2s' }}
            filter="url(#neonGlow)"
          />

          {/* Inner star lines */}
          <polygon
            points="150,40 168,90 232,90 184,122 202,172 150,142 98,172 116,122 68,90 132,90"
            fill="none"
            stroke="#b87018"
            strokeWidth="0.8"
            opacity="0.45"
            className="star-path"
            style={{ animationDelay: '0.8s' }}
          />

          {/* Top arrow left */}
          <path
            d="M140,20 L132,52 L146,48 L138,80"
            fill="none"
            stroke="#d89428"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="star-path"
            style={{ animationDelay: '1.2s' }}
            filter="url(#softGlow)"
          />
          {/* Top arrow right */}
          <path
            d="M160,20 L168,52 L154,48 L162,80"
            fill="none"
            stroke="#d89428"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="star-path"
            style={{ animationDelay: '1.3s' }}
            filter="url(#softGlow)"
          />

          {/* Bottom arrow outer */}
          <path
            d="M140,210 L132,242 L150,258 L168,242 L160,210"
            fill="none"
            stroke="#d89428"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="star-path"
            style={{ animationDelay: '1.4s' }}
            filter="url(#softGlow)"
          />
          {/* Bottom arrow inner */}
          <path
            d="M144,230 L138,252 L150,264 L162,252 L156,230"
            fill="none"
            stroke="#b87018"
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="star-path"
            style={{ animationDelay: '1.5s' }}
          />

          {/* Corner accent dots */}
          {([
            [150, 18], [252, 90], [214, 206], [86, 206], [48, 90],
          ] as [number, number][]).map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="3"
              fill="#d89428"
              filter="url(#softGlow)"
              opacity="0.75"
            />
          ))}
        </motion.svg>
      </div>

      {/* ===== TITLE CARD — appears after star settles ===== */}
      <div
        className="relative z-20 text-center px-4 w-full"
        style={{ marginTop: isMobile ? '25px' : '60px' }}
      >

        {/* SUBTITLE — subtle, secondary */}
        <div className="mb-2 flex justify-center flex-wrap gap-0">
          {subtitle.split('').map((char, i) => (
            <motion.span
              key={i}
              style={{
                ...subtitleStyle,
                fontSize: subtitleSize,
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.92, y: 0 }}
              transition={{
                delay: subtitleStart + i * subtitleDelay,
                duration: 0.5,
                ease: massEase,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* MAIN TITLE */}
        <div
          className="flex justify-center items-center flex-wrap"
          style={{ gap: isMobile ? '0px' : '4px' }}
        >

          {/* RAM */}
          {ramLetters.map((char, i) => (
            <motion.span
              key={`ram-${i}`}
              style={{
                ...heroLetterStyle,
                fontSize: titleSize,
                lineHeight: 1,
                fontWeight: 900,
              }}
              initial={{ opacity: 0, y: 55, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: ramStart + i * ramDelay,
                duration: 0.75,
                ease: snapEase,
              }}
            >
              {char}
            </motion.span>
          ))}

          {/* Space */}
          <motion.span
            style={{
              ...heroLetterStyle,
              fontSize: titleSize,
              lineHeight: 1,
              fontWeight: 900,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: charanStart - 0.1, duration: 0.01 }}
          >
            {'\u00A0'}
          </motion.span>

          {/* CHARAN */}
          {charanLetters.map((char, i) => (
            <motion.span
              key={`charan-${i}`}
              style={{
                ...heroLetterStyle,
                fontSize: titleSize,
                lineHeight: 1,
                fontWeight: 900,
              }}
              initial={{ opacity: 0, y: 42, scale: 0.82 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: charanStart + i * charanDelay,
                duration: 0.58,
                ease: snapEase,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* UNDERLINE — last to appear */}
        <motion.div
          className="mt-4 mx-auto"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            delay: underlineStart,
            duration: 2.0,
            ease: 'easeInOut',
          }}
          style={{
            height: '2px',
            width: isMobile ? '85%' : '60%',
            transformOrigin: 'center',
            background:
              'linear-gradient(90deg, transparent, #8a5510 15%, #b87820 35%, #e8c050 50%, #b87820 65%, #8a5510 85%, transparent)',
            boxShadow:
              '0 0 8px rgba(200,130,30,0.6), 0 0 20px rgba(160,85,15,0.35)',
          }}
        />
      </div>
    </motion.div>
  )
}