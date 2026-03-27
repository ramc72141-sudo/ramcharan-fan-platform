'use client'

import { motion } from 'framer-motion'
import { Instagram, Twitter, Facebook } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/alwaysramcharan/', label: 'Instagram' },
  { icon: Twitter, href: 'https://x.com/AlwaysRamCharan', label: 'Twitter' },
  { icon: Facebook, href: 'https://www.facebook.com/AlwaysRamCharan/', label: 'Facebook' },
]

  return (
    <footer className="relative bg-black border-t border-orange-500/10 overflow-hidden">

      {/* Cinematic Background Light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center"
      >

        <p className="text-sm text-white/40 max-w-xl mx-auto leading-relaxed mb-6 sm:mb-10 px-2 sm:px-0">
          This is a fan-made website. Not affiliated with official promotions.
        </p>

        <p className="text-sm text-white/50 mt-4 mb-8 sm:mb-12 px-2 sm:px-0">
          Made with ❤️ as a tribute to Ram Charan and his incredible cinematic journey.
        </p>

        <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">
          FOLLOW ME
        </p>

        {/* Developer Section */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center space-y-3">

          <p className="text-white/30 text-xs tracking-[0.4em] uppercase">
            Developed By
          </p>

          <div className="flex flex-col items-center group">

            {/* Finger Animation */}
            <motion.div
              initial={{ y: -4 }}
              animate={{ y: [-4, 6, -4] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="text-lg"
            >
              👇
            </motion.div>

            {/* Developer Name */}
            <a
              href="https://x.com/Akhilll569953"
              target="_blank"
              className="text-lg font-medium text-orange-500 hover:text-orange-400 transition"
            >
              Akhil
            </a>

            {/* Animated Underline */}
            <div className="w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-500" />

          </div>
        </div>

        {/* Light Divider */}
        <div className="mt-10 sm:mt-12 mb-8 sm:mb-10 h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

        {/* Social Icons — larger tap targets on mobile */}
        <div className="flex justify-center gap-4 sm:gap-6 mb-8 sm:mb-10">
          {socialLinks.map((social) => {
            const Icon = social.icon
            return (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                className="rounded-full backdrop-blur-md border border-orange-500/20 flex items-center justify-center text-white/50 hover:text-orange-500 hover:border-orange-500 transition"
                style={{
                  width: isMobile ? '48px' : '48px',
                  height: isMobile ? '48px' : '48px',
                  minWidth: isMobile ? '48px' : '48px',
                }}
                whileHover={!isMobile ? { scale: 1.15, y: -6 } : {}}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            )
          })}
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/30 tracking-wide px-2 sm:px-0">
          © {currentYear} Ram Charan Fan Community · Crafted with passion.
        </p>

      </motion.div>
    </footer>
  )
}