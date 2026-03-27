'use client'

import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

interface AdminNavigationProps {
  onLogout: () => void
}

export default function AdminNavigation({ onLogout }: AdminNavigationProps) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <style suppressHydrationWarning>{`
        .admin-nav-grain::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' /%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }
      `}</style>

      <div
        className="admin-nav-grain relative border-b"
        style={{
          background: 'rgba(3,2,1,0.85)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(200,110,15,0.14)',
          boxShadow: '0 1px 0 rgba(200,110,15,0.08), 0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top orange streak */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link href="/admin" className="group flex items-center gap-3">
              <motion.div
                className="text-xl font-black tracking-[0.35em]"
                style={{
                  background: 'linear-gradient(160deg, #fbbf60 0%, #ea7c10 50%, #c45a08 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 10px rgba(234,124,16,0.5))',
                }}
                whileHover={{ scale: 1.04 }}
              >
                RC ADMIN
              </motion.div>
              {/* Restricted badge */}
              <span
                className="hidden sm:inline-block text-[9px] tracking-[0.3em] uppercase px-2 py-0.5 rounded-full font-semibold"
                style={{
                  background: 'rgba(200,100,15,0.12)',
                  border: '1px solid rgba(200,100,15,0.25)',
                  color: 'rgba(200,120,30,0.7)',
                }}
              >
                Restricted
              </span>
            </Link>

            <motion.button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium tracking-[0.12em] uppercase transition-all duration-200"
              style={{
                color: 'rgba(200,130,40,0.6)',
                border: '1px solid rgba(200,110,15,0.15)',
                background: 'rgba(200,100,15,0.05)',
              }}
              whileHover={{
                scale: 1.04,
                color: 'rgba(234,124,16,0.95)',
              }}
              whileTap={{ scale: 0.96 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(234,124,16,0.35)'
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(200,100,15,0.10)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,110,15,0.15)'
                ;(e.currentTarget as HTMLElement).style.background = 'rgba(200,100,15,0.05)'
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>

          </div>
        </div>
      </div>
    </motion.nav>
  )
}