'use client'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const getYoutubeId = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : ''
}



interface FanStat {
  creator: string
  totalLikes: number
  totalComments: number
  totalScore: number
  submissionCount: number
  bestThumbnail: string
  contentType: string
  externalVideo: boolean
  bestContentUrl: string
  bestLikes?: number 
}

const rankStyle = (i: number) => {
  if (i === 0) return {
    badge: 'linear-gradient(135deg, #FFD700, #FFA500)',
    badgeColor: '#000',
    glow: 'rgba(255,200,0,0.15)',
    border: 'rgba(255,200,0,0.3)',
    shadow: '0 0 24px rgba(255,180,0,0.12)',
  }
  if (i === 1) return {
    badge: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)',
    badgeColor: '#000',
    glow: 'rgba(192,192,192,0.1)',
    border: 'rgba(192,192,192,0.25)',
    shadow: '0 0 18px rgba(180,180,180,0.08)',
  }
  if (i === 2) return {
    badge: 'linear-gradient(135deg, #CD7F32, #A0522D)',
    badgeColor: '#000',
    glow: 'rgba(205,127,50,0.1)',
    border: 'rgba(205,127,50,0.25)',
    shadow: '0 0 16px rgba(180,100,40,0.08)',
  }
  return {
    badge: 'rgba(30,20,10,0.85)',
    badgeColor: 'rgba(220,150,50,0.9)',
    glow: 'transparent',
    border: 'rgba(200,100,15,0.15)',
    shadow: '0 4px 20px rgba(0,0,0,0.5)',
  }
}

function LeaderboardRow({
  title,
  icon,
  subtitle,
  fans,
  isMobile,
  onSelect,
}: {
  title: string
  icon: string
  subtitle: string
  fans: FanStat[]
  isMobile: boolean
  onSelect: (fan: FanStat) => void
}) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">

      {/* Row header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xl"
        >
          {icon}
        </motion.div>
        <div>
          <h2
            className="font-black tracking-[0.12em] uppercase leading-none"
            style={{
              fontSize: isMobile ? '1rem' : '1.1rem',
              background: 'linear-gradient(135deg, #ffffff 0%, #e8a040 50%, #c06010 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h2>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-0.5" style={{ color: 'rgba(200,120,30,0.45)' }}>
            {subtitle}
          </p>
        </div>
        <div className="flex-1 h-px ml-2" style={{ background: 'linear-gradient(90deg, rgba(200,100,15,0.35), transparent)' }} />
      </div>

      {/* Horizontal scroll */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {fans.slice(0, 5).map((fan, i) => {
          const rs = rankStyle(i)
          const thumb = fan.contentType === 'video' && fan.externalVideo
            ? `https://img.youtube.com/vi/${getYoutubeId(fan.bestContentUrl)}/hqdefault.jpg`
            : fan.bestThumbnail

          return (
            <motion.div
              key={fan.creator}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={!isMobile ? { y: -6, scale: 1.02 } : {}}
              onClick={() => onSelect(fan)}
              className="flex-shrink-0 cursor-pointer group relative"
              style={{ width: isMobile ? '200px' : '240px' }}
            >
              {/* Rank badge */}
<div
  className="absolute top-3 left-3 z-20 flex items-center justify-center font-black rounded-full"
  style={{
    width: '28px', height: '28px', fontSize: '11px',
    background: rs.badge,
    color: rs.badgeColor,
    boxShadow: i < 3 ? `0 0 12px ${rs.glow}` : 'none',
    border: i >= 3 ? `1px solid ${rs.border}` : 'none',
  }}
>
  #{i + 1}
</div>

{/* 👑 #1 Fan Badge */}
{i === 0 && (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full"
    style={{
      background: 'linear-gradient(135deg, rgba(255,200,0,0.15), rgba(255,140,0,0.1))',
      border: '1px solid rgba(255,200,0,0.35)',
      boxShadow: '0 0 10px rgba(255,180,0,0.2)',
    }}
  >
    <span style={{ fontSize: '10px' }}>👑</span>
    <span
      className="font-black uppercase"
      style={{
        fontSize: '8px',
        letterSpacing: '0.12em',
        color: 'rgba(255,210,0,0.9)',
      }}
    >
      #1 Fan
    </span>
  </motion.div>
)}

              {/* Card */}
              <div
                className="relative rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  border: `1px solid ${rs.border}`,
                  background: '#0c0c0c',
                  boxShadow: rs.shadow,
                }}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden" style={{ height: isMobile ? '130px' : '150px' }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={fan.creator}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(200,100,15,0.08)' }}>
                      <span className="text-3xl">🎨</span>
                    </div>
                  )}

                  {/* Top glow for #1 */}
                  {i === 0 && (
                    <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,200,0,0.08) 0%, transparent 60%)' }} />
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p
                    className="font-black truncate mb-2 tracking-wide"
                    style={{ fontSize: '13px', color: 'rgba(255,255,255,0.92)' }}
                  >
                    {fan.creator ? (fan.creator.startsWith('@') ? fan.creator : `@${fan.creator}`) : 'Unknown'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(255,100,100,0.8)' }}>
                        <Heart size={11} className="fill-red-400 text-red-400" />
                        {fan.totalLikes}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: 'rgba(200,120,40,0.8)' }}>
                        <MessageCircle size={11} />
                        {fan.totalComments}
                      </span>
                    </div>
                    <span
                      className="text-[10px] tracking-wide"
                      style={{ color: 'rgba(200,120,30,0.45)' }}
                    >
                      {fan.submissionCount} posts
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom separator */}
      <div className="mt-4 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,100,15,0.2), transparent)' }} />
    </div>
  )
}

export default function LeaderboardPage() {
  const [fans, setFans] = useState<FanStat[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [selectedFan, setSelectedFan] = useState<FanStat | null>(null)
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all')
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
  setLoading(true)
  setFetchError(false)
  setFans([])
  const fetchLeaderboard = async () => {
  const { data: submissions, error: subError } = await supabase
    .from('submissions')
    .select(`
      id,
      creator_name,
      email,
      likes,
      content_url,
      content_type,
      external_video,
      comments:comments(count)
    `)
    .eq('status', 'approved')

  if (subError || !submissions) { setFetchError(true); setLoading(false); return }

  let likesQuery = supabase
    .from('likes')
    .select('submission_id, created_at')

  if (timeFilter === 'week') {
    likesQuery = likesQuery.gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  }
  if (timeFilter === 'month') {
    likesQuery = likesQuery.gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  }

  const { data: likesData } = await likesQuery

  const likesCountMap: Record<string, number> = {}
  if (timeFilter !== 'all' && likesData) {
    for (const like of likesData) {
      likesCountMap[like.submission_id] = (likesCountMap[like.submission_id] || 0) + 1
    }
  }

  const map: Record<string, FanStat> = {}
  for (const item of submissions) {
    const name = item.email || item.creator_name || 'Unknown'
    const commentCount = item.comments?.[0]?.count ?? 0
    const itemLikes = timeFilter === 'all'
      ? (item.likes ?? 0)
      : (likesCountMap[item.id] ?? 0)

    if (timeFilter !== 'all' && itemLikes === 0) continue

    if (!map[name]) {
      map[name] = {
        creator: name,
        totalLikes: 0,
        totalComments: 0,
        totalScore: 0,
        submissionCount: 0,
        bestThumbnail: item.content_url,
        contentType: item.content_type,
        externalVideo: item.external_video ?? false,
        bestContentUrl: item.content_url,
        bestLikes: itemLikes,
      }
    }
    map[name].totalLikes += itemLikes
    map[name].totalComments += commentCount
    map[name].totalScore += itemLikes + commentCount
    map[name].submissionCount += 1

    if (itemLikes > (map[name].bestLikes ?? 0)) {
      map[name].bestLikes = itemLikes
      map[name].bestThumbnail = item.content_url
      map[name].contentType = item.content_type
      map[name].externalVideo = item.external_video ?? false
      map[name].bestContentUrl = item.content_url
    }
  }

  setFans(Object.values(map))
  setLoading(false)
}
    fetchLeaderboard()
  }, [timeFilter])

  const byLikes    = [...fans].sort((a, b) => b.totalLikes - a.totalLikes || b.totalScore - a.totalScore)
const byComments = [...fans].sort((a, b) => b.totalComments - a.totalComments || b.totalScore - a.totalScore)
const byOverall  = [...fans].sort((a, b) => b.totalScore - a.totalScore || b.totalLikes - a.totalLikes)

  return (
    <div className="min-h-screen bg-[#050403] text-white relative overflow-hidden">

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

    

      {/* ===== CINEMATIC BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(170,75,8,0.14) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.85) 100%)' }} />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'linear-gradient(rgba(210,120,45,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(210,120,45,0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent" />
      </div>

      {/* ===== HEADER ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-32 mb-14 sm:mb-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-600/25 bg-orange-600/10 mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] tracking-[0.4em] uppercase text-orange-400/90 font-medium">
            Hall of Fame
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-black tracking-tight leading-none mb-5"
          style={{
            fontSize: isMobile ? 'clamp(1.8rem, 8vw, 2.6rem)' : '6rem',
            background: 'linear-gradient(160deg, #f5ede0 0%, #e8c170 22%, #d97c38 58%, #c0402e 88%, #8b1a1a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          LEADERBOARD
        </motion.h1>

        <motion.p
          className="text-sm tracking-[0.28em] uppercase"
          style={{ color: 'rgba(200,180,150,0.35)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Top fans · {timeFilter === 'week' ? 'This Week' : timeFilter === 'month' ? 'This Month' : 'All Time'}
        </motion.p>

        <motion.div
          className="mx-auto mt-6 h-px w-48 bg-gradient-to-r from-transparent via-orange-600/60 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        />
        <motion.div
          className="mx-auto mt-1 h-px w-24 bg-gradient-to-r from-transparent via-red-700/30 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        />
      </div>

      {/* ===== TIME FILTER TOGGLE ===== */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 0.5 }}
  className="flex justify-center gap-1.5 mt-8 px-4 flex-wrap"
>
  {[
    { key: 'week', label: '🔥 This Week' },
    { key: 'month', label: '📅 This Month' },
    { key: 'all', label: '🏆 All Time' },
  ].map((opt) => (
    <button
      key={opt.key}
      onClick={() => setTimeFilter(opt.key as 'week' | 'month' | 'all')}
      className="px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-200 border"
      style={{
        border: timeFilter === opt.key
          ? '1px solid rgba(200,100,15,0.5)'
          : '1px solid rgba(255,255,255,0.06)',
        background: timeFilter === opt.key
          ? 'rgba(200,100,15,0.15)'
          : 'rgba(255,255,255,0.02)',
        color: timeFilter === opt.key
          ? 'rgba(230,140,40,0.95)'
          : 'rgba(255,255,255,0.3)',
        boxShadow: timeFilter === opt.key
          ? '0 0 12px rgba(200,100,15,0.15)'
          : 'none',
      }}
    >
      {opt.label}
    </button>
  ))}
</motion.div>

      {/* ===== LOADING ===== */}
      {loading ? (
  <div className="flex justify-center py-20">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="w-8 h-8 border-2 border-orange-200/20 border-t-orange-400 rounded-full"
    />
  </div>
) : fetchError ? (
  <div className="text-center py-20">
    <p className="text-2xl mb-3">⚠️</p>
    <p className="font-bold tracking-[0.2em] uppercase text-[13px]" style={{ color: 'rgba(240,100,80,0.8)' }}>
      Failed to load leaderboard
    </p>
    <p className="text-[11px] mt-2 tracking-wide" style={{ color: 'rgba(200,150,100,0.4)' }}>
      Please try refreshing the page
    </p>
  </div>
) : fans.length === 0 ? (
  <div className="text-center py-20">
    <p className="text-2xl mb-3">🔥</p>
    <p className="font-bold tracking-[0.2em] uppercase text-[13px]" style={{ color: 'rgba(200,120,30,0.7)' }}>
      {timeFilter === 'week'
        ? 'No fans this week yet'
        : timeFilter === 'month'
        ? 'No fans this month yet'
        : 'No fan creations yet'}
    </p>
    <p className="text-[11px] mt-2 tracking-wide" style={{ color: 'rgba(200,150,100,0.4)' }}>
      {timeFilter === 'all'
        ? 'Be the first to submit your masterpiece'
        : 'Submit this week and claim the top spot 🏆'}
    </p>
  </div>
) : (
        <>
          <LeaderboardRow
            title="Top by Likes"
            icon="🔥"
            subtitle="Most liked fan creations"
            fans={byLikes}
            isMobile={isMobile}
            onSelect={setSelectedFan}
          />
          <LeaderboardRow
            title="Top by Comments"
            icon="💬"
            subtitle="Most discussed fan creations"
            fans={byComments}
            isMobile={isMobile}
            onSelect={setSelectedFan}
          />
          <LeaderboardRow
            title="Top Overall"
            icon="⚡"
            subtitle="Likes + comments combined"
            fans={byOverall}
            isMobile={isMobile}
            onSelect={setSelectedFan}
          />
        </>
      )}

      {/* ===== FAN DETAIL MODAL ===== */}
      {selectedFan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[100] flex px-4 ${isMobile ? 'items-end' : 'items-center justify-center'}`}
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setSelectedFan(null)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full overflow-hidden ${isMobile ? 'max-h-[92vh] rounded-t-2xl' : 'max-w-sm rounded-2xl'}`}
            style={{
              background: '#0a0804',
              border: '1px solid rgba(200,115,18,0.22)',
              boxShadow: '0 0 60px rgba(0,0,0,0.9)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/35 to-transparent" />

            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              {selectedFan.bestThumbnail ? (
                <img src={
                  selectedFan.contentType === 'video' && selectedFan.externalVideo
                    ? `https://img.youtube.com/vi/${getYoutubeId(selectedFan.bestContentUrl)}/hqdefault.jpg`
                    : selectedFan.bestThumbnail
                } alt={selectedFan.creator} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: 'rgba(200,100,15,0.08)' }}>🎨</div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: 'rgba(200,120,30,0.5)' }}>Twitter / X</p>
                <h3 className="font-black text-xl tracking-wide" style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #e8a040 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {selectedFan.creator ? (selectedFan.creator.startsWith('@') ? selectedFan.creator : `@${selectedFan.creator}`) : 'Unknown'}
                </h3>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-orange-600/15 to-transparent" />

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Likes', value: selectedFan.totalLikes, icon: '❤️' },
                  { label: 'Comments', value: selectedFan.totalComments, icon: '💬' },
                  { label: 'Posts', value: selectedFan.submissionCount, icon: '🎨' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center rounded-xl py-3" style={{ background: 'rgba(200,100,15,0.06)', border: '1px solid rgba(200,100,15,0.12)' }}>
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className="font-black text-base" style={{ color: 'rgba(255,255,255,0.9)' }}>{stat.value}</div>
                    <div className="text-[9px] uppercase tracking-wide mt-0.5" style={{ color: 'rgba(200,120,30,0.5)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
  <button
    onClick={() => {
      if (!selectedFan) return
      const rank = byOverall.findIndex(f => f.creator === selectedFan.creator) + 1
      const text = `🔥 I'm ranked #${rank} on the Ram Charan Fan Leaderboard!

Can you beat me? 👀

#RamCharan #RCBirthday #Peddi
👇
ramcharan.fans`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
    }}
    className="flex-1 py-3 rounded-xl font-bold tracking-[0.15em] uppercase text-[11px] transition-all duration-200"
    style={{
      background: 'rgba(29,161,242,0.15)',
      color: 'rgba(29,161,242,0.9)',
      border: '1px solid rgba(29,161,242,0.3)',
    }}
  >
    🐦 Share
  </button>
  <button
    onClick={() => setSelectedFan(null)}
    className="flex-1 py-3 rounded-xl font-bold tracking-[0.2em] uppercase text-[11px] transition-all duration-200"
    style={{
      background: 'linear-gradient(135deg, #d97210 0%, #b04808 60%, #8a3204 100%)',
      color: '#fff2e0',
      border: '1px solid rgba(220,115,16,0.3)',
      boxShadow: '0 0 16px rgba(200,100,12,0.32)',
    }}
  >
    Close
  </button>
</div>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  )
}