'use client'

import { motion } from 'framer-motion'
import { BarChart, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  })

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('status')
      if (error) { console.error(error); return }
      setStats({
        total: data.length,
        pending: data.filter((s) => s.status === 'pending').length,
        approved: data.filter((s) => s.status === 'approved').length,
        rejected: data.filter((s) => s.status === 'rejected').length,
      })
    }
    fetchStats()
  }, [])

  const cards = [
    {
      label: 'Total Submissions',
      value: stats.total,
      icon: BarChart,
      accent: 'rgba(234,124,16',
      border: 'rgba(234,124,16,0.22)',
      glow: 'rgba(234,124,16,0.12)',
      iconBg: 'linear-gradient(135deg, #ea7c10, #c45208)',
      valueColor: '#ea8c18',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      accent: 'rgba(234,179,8',
      border: 'rgba(234,179,8,0.22)',
      glow: 'rgba(234,179,8,0.10)',
      iconBg: 'linear-gradient(135deg, #eab308, #ca8a04)',
      valueColor: '#eab308',
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      accent: 'rgba(34,197,94',
      border: 'rgba(34,197,94,0.22)',
      glow: 'rgba(34,197,94,0.10)',
      iconBg: 'linear-gradient(135deg, #22c55e, #16a34a)',
      valueColor: '#22c55e',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: AlertCircle,
      accent: 'rgba(239,68,68',
      border: 'rgba(239,68,68,0.22)',
      glow: 'rgba(239,68,68,0.10)',
      iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
      valueColor: '#ef4444',
    },
  ]

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {cards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            className="relative rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(155deg, #0e0b07 0%, #090705 100%)',
              border: `1px solid ${stat.border}`,
              boxShadow: `0 0 30px ${stat.glow}, 0 0 0 1px rgba(0,0,0,0.5) inset`,
              padding: isMobile ? '16px 14px' : '24px',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={!isMobile ? { scale: 1.03, y: -3 } : {}}
          >
            {/* Top edge glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${stat.border}, transparent)` }}
            />

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: stat.border }} />
              <div className="absolute top-0 left-0 h-full w-[1px]" style={{ background: stat.border }} />
            </div>
            <div className="absolute top-2 right-2 w-3 h-3 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-[1px]" style={{ background: stat.border }} />
              <div className="absolute top-0 right-0 h-full w-[1px]" style={{ background: stat.border }} />
            </div>

            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <span
                className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase leading-tight"
                style={{ color: 'rgba(200,160,80,0.55)' }}
              >
                {stat.label}
              </span>
              <motion.div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ml-2"
                style={{ background: stat.iconBg, boxShadow: `0 0 12px ${stat.glow}` }}
                whileHover={{ rotate: 8 }}
              >
                <Icon className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            <p
              className="font-black leading-none"
              style={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                color: stat.valueColor,
                filter: `drop-shadow(0 0 10px ${stat.glow})`,
              }}
            >
              {stat.value}
            </p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}