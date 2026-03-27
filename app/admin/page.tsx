'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react'
import AdminNavigation from '@/components/admin/admin-navigation'
import AdminStats from '@/components/admin/admin-stats'
import ModerationQueue from '@/components/admin/moderation-queue'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminDashboard() {
  const [refreshStats, setRefreshStats] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'queue' | 'approved' | 'rejected'>('queue')

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!data.session) {
          window.location.href = '/admin/login'
        } else {
          setIsAuthenticated(true)
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#030302' }}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-8 h-8 rounded-full border-2 border-t-transparent"
            style={{ borderColor: 'rgba(234,124,16,0.5)', borderTopColor: '#ea7c10' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          />
          <p
            className="text-[11px] tracking-[0.35em] uppercase font-medium"
            style={{ color: 'rgba(200,120,30,0.5)' }}
          >
            Verifying Access...
          </p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen" style={{ background: '#030302' }}>

      <style suppressHydrationWarning>{`
        .admin-bg-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' /%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
      `}</style>

      {/* Cinematic background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(170,75,8,0.14) 0%, transparent 65%)' }} className="absolute inset-0" />
        <div style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.88) 100%)' }} className="absolute inset-0" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(180,100,20,0.2) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>
      <div className="admin-bg-grain" />

      <AdminNavigation onLogout={handleLogout} />

      <main className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Header ── */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1
              className="font-black tracking-tight mb-2"
              style={{
                fontSize: isMobile ? '1.8rem' : '2.5rem',
                background: 'linear-gradient(170deg, #ffffff 0%, #f0c060 45%, #c87018 80%, #9a4008 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 18px rgba(190,95,12,0.28))',
              }}
            >
              Moderation Dashboard
            </h1>
            <p
              className="text-[12px] sm:text-[13px] tracking-[0.12em]"
              style={{ color: 'rgba(200,160,80,0.45)' }}
            >
              Manage and review community submissions
            </p>
            {/* Underline */}
            <div className="mt-4 h-px w-32 bg-gradient-to-r from-transparent via-orange-600/45 to-transparent" />
          </motion.div>

          {/* ── Stats ── */}
          <AdminStats key={refreshStats} />

          {/* ── Tabs ── */}
          <motion.div
            className="mt-8 mb-6 flex gap-1 sm:gap-2 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Tab underline base */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'rgba(200,110,15,0.15)' }}
            />

            {(['queue', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-4 sm:px-6 py-3 text-[11px] sm:text-sm font-semibold tracking-[0.18em] uppercase transition-all duration-200 capitalize"
                style={{
                  color: activeTab === tab
                    ? '#ea7c10'
                    : 'rgba(200,160,80,0.4)',
                  borderBottom: activeTab === tab
                    ? '2px solid #ea7c10'
                    : '2px solid transparent',
                  background: activeTab === tab
                    ? 'rgba(200,100,15,0.06)'
                    : 'transparent',
                  borderRadius: '8px 8px 0 0',
                }}
              >
                {tab === 'queue' ? 'Queue' : tab === 'approved' ? 'Approved' : 'Rejected'}
                {/* Active glow dot */}
                {activeTab === tab && (
                  <span
                    className="ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle"
                    style={{
                      background: '#ea7c10',
                      boxShadow: '0 0 6px rgba(234,124,16,0.8)',
                    }}
                  />
                )}
              </button>
            ))}
          </motion.div>

          {/* ── Content ── */}
          <ModerationQueue
            tab={activeTab}
            onDataChange={() => setRefreshStats(prev => prev + 1)}
          />

        </div>
      </main>
    </div>
  )
}