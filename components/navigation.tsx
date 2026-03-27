'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const MotionNav = motion.nav as any
const MotionDiv = motion.div as any

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Submit', href: '/submit' },
  { label: 'Check Status', href: '/check-status' },
  { label: 'Admin', href: '/admin' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)

  return (
    <MotionNav
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* ===== CINEMATIC STRIP ===== */}
      <div className="relative bg-black/50 backdrop-blur-md border-b border-white/5">
        
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* ===== LEFT : RC INSIGNIA ===== */}
          <Link href="/" className="group">
            <span className="text-sm tracking-[0.45em] font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
              RAM CHARAN
            </span>
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative text-[11px] uppercase tracking-[0.35em] text-white/70 hover:text-orange-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ===== MOBILE BUTTON ===== */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {open && (
          <MotionDiv
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="md:hidden bg-black/95 border-b border-white/10"
          >
            <div className="px-6 py-6 space-y-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-sm uppercase tracking-[0.35em] text-white/70 hover:text-orange-500"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionNav>
  )
}