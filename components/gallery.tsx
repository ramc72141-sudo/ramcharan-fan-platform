'use client'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, MessageCircle } from 'lucide-react'

const getYoutubeId = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : ""
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MotionDiv = motion.div as any
const MotionSection = motion.section as any
const getFingerprint = (): string => {
  if (typeof window === 'undefined') return ''
  let fp = localStorage.getItem('rc_fp')
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('rc_fp', fp)
  }
  return fp
}

const ADMIN_PASSWORD = 'akhil@1005'

function CommentMenu({
  onEdit,
  onDelete,
  password,
}: {
  onEdit: () => void
  onDelete: () => void
  password: string
}) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [verified, setVerified] = useState(false)

  const verify = () => {
    if (input === password || input === ADMIN_PASSWORD) {
      setVerified(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          setVerified(false)
          setInput('')
          setError(false)
        }}
        className="text-white/40 hover:text-orange-400 transition px-1 text-lg leading-none"
      >
        ⋮
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-6 z-20 bg-[#0f0f0f] border border-orange-500/20 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(210,120,45,0.12)] min-w-[160px]">
            {!verified ? (
              <div className="p-2 space-y-2">
                <input
                  type="password"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && verify()}
                  placeholder="Enter password"
                  className="w-full p-2 bg-black border border-orange-500/20 text-white text-sm rounded focus:outline-none focus:border-orange-500/60 placeholder-white/20"
                />
                {error && <p className="text-red-400 text-xs">Wrong password</p>}
                <button
                  onClick={verify}
                  className="w-full py-1.5 bg-orange-500 text-black text-sm font-bold rounded hover:bg-orange-400 transition"
                >
                  Verify
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { onEdit(); setOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-orange-500/10 hover:text-orange-400 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => { onDelete(); setOpen(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

interface GalleryItem {
  id: string
  title: string
  creator: string
  category: string
  content_type: 'image' | 'video'
  content_url: string
  external_video: boolean
  likes: number
  comments: number
}

export default function Gallery({
  category,
}: {
  category?: string
}) {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [filter, setFilter] = useState(category ? category : 'ALL')
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [likedItems, setLikedItems] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('likedItems') || '[]')
    }
    return []
  })
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentPassword, setCommentPassword] = useState('')
const [commentHandle, setCommentHandle] = useState('')  // ← ADD
  const [likeAnimId, setLikeAnimId] = useState<string | null>(null)

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!selected) return
    const loadComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('submission_id', selected.id)
        .order('created_at', { ascending: false })
      setComments(data || [])
    }
    loadComments()
  }, [selected])

  useEffect(() => {
    const fetchGallery = async () => {
      let query = supabase
        .from('submissions')
        .select(`
          id,
          title,
          creator_name,
          description,
          category,
          content_url,
          content_type,
          likes,
          external_video,
          comments:comments(count)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Gallery fetch error:', error)
        return
      }

      setItems(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          creator: item.creator_name,
          category: item.category,
          content_url: item.content_url,
          content_type: item.content_type,
          external_video: item.external_video ?? false,
          likes: item.likes ?? 0,
          comments: item.comments?.[0]?.count ?? 0,
        }))
      )
    }
    fetchGallery()
  }, [category])

  const categories = [
    'ALL',
    'offline-pics',
    'pic-edits',
    'video-edits',
    'celebrations',
    'others',
  ]

  const visible =
    filter === 'ALL'
      ? items
      : items.filter((i) => i.category === filter)

  const deleteComment = async (id: string) => {
    await supabase.from('comments').delete().eq('id', id)
    setComments((prev) => prev.filter((c) => c.id !== id))
    setSelected((prev) => prev ? { ...prev, comments: prev.comments - 1 } : prev)
    setItems((prev) =>
      prev.map((i) => i.id === selected?.id ? { ...i, comments: i.comments - 1 } : i)
    )
  }

  const updateComment = async (id: string) => {
    const { data } = await supabase
      .from('comments')
      .update({ content: editText })
      .eq('id', id)
      .select()

    if (data) {
      setComments((prev) =>
        prev.map((c) => (c.id === id ? data[0] : c))
      )
      setEditingId(null)
    }
  }

  return (
    <MotionSection className="relative min-h-screen bg-[#050505] overflow-hidden py-20 sm:py-32">

      {/* ===== CINEMATIC BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(224,130,50,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_50%_100%,rgba(200,55,55,0.04),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_50%_at_0%_50%,rgba(224,130,50,0.03),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_50%_at_100%_50%,rgba(200,55,55,0.03),transparent)]" />

        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_50%_25%_at_50%_0%,rgba(210,120,45,0.06),transparent)]"
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 40% 22% at 50% 15%, rgba(210,120,45,0.09), transparent)',
          }}
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(210,120,45,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(210,120,45,0.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent" />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.82) 100%)',
          }}
        />
      </div>

      {/* ===== HEADER ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center mb-14 sm:mb-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-600/25 bg-orange-600/10 mb-6 sm:mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] tracking-[0.4em] uppercase text-orange-400/90 font-medium">
            Fan Creations
          </span>
        </motion.div>

        {/* Cinematic title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative inline-block"
        >
          <motion.div
            className="absolute inset-0 blur-[50px] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(210,120,45,0.35) 0%, rgba(200,60,60,0.18) 55%, transparent 80%)',
            }}
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.03, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.h1
            className="relative font-black tracking-tight leading-none select-none"
            style={{
              fontSize: isMobile ? '2.6rem' : undefined,
              background: 'linear-gradient(160deg, #f5ede0 0%, #e8c170 22%, #d97c38 58%, #c0402e 88%, #8b1a1a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            // Use Tailwind for desktop, inline for mobile
            {...(!isMobile && { className: "relative text-5xl sm:text-8xl font-black tracking-tight leading-none select-none" })}
            animate={{
              filter: [
                'drop-shadow(0 0 18px rgba(210,120,45,0.45)) drop-shadow(0 0 40px rgba(200,60,60,0.15))',
                'drop-shadow(0 0 28px rgba(210,120,45,0.65)) drop-shadow(0 0 60px rgba(200,60,60,0.25))',
                'drop-shadow(0 0 15px rgba(210,120,45,0.35)) drop-shadow(0 0 35px rgba(200,60,60,0.12))',
                'drop-shadow(0 0 32px rgba(210,120,45,0.70)) drop-shadow(0 0 65px rgba(200,60,60,0.28))',
                'drop-shadow(0 0 18px rgba(210,120,45,0.45)) drop-shadow(0 0 40px rgba(200,60,60,0.15))',
              ],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          >
            FEATURED CREATIONS
          </motion.h1>
        </motion.div>

        <motion.p
          className="text-white/28 text-sm tracking-[0.28em] uppercase mt-5 sm:mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          By the fans, for the fans
        </motion.p>

        <motion.div
          className="mx-auto mt-6 sm:mt-7 h-px w-48 bg-gradient-to-r from-transparent via-orange-600/60 to-transparent"
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

{/* ===== TRENDING NOW SECTION ===== */}
<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-14 sm:mb-20">

  {/* Header */}
  <div className="flex items-center gap-3 mb-6">
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="text-xl"
    >
      🔥
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
        Trending Now
      </h2>
      <p className="text-[10px] tracking-[0.3em] uppercase mt-0.5" style={{ color: 'rgba(200,120,30,0.45)' }}>
        Top 5 most liked creations
      </p>
    </div>
    {/* Divider line */}
    <div className="flex-1 h-px ml-2" style={{ background: 'linear-gradient(90deg, rgba(200,100,15,0.35), transparent)' }} />
  </div>

  {/* Horizontal scroll row */}
  <div
    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
  >
    {[...items]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5)
      .map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileHover={!isMobile ? { y: -6, scale: 1.02 } : {}}
          onClick={() => setSelected(item)}
          className="flex-shrink-0 cursor-pointer group relative"
          style={{ width: isMobile ? '220px' : '260px' }}
        >
          {/* Rank badge */}
          <div
            className="absolute top-3 left-3 z-20 flex items-center justify-center font-black rounded-full"
            style={{
              width: '28px',
              height: '28px',
              fontSize: '11px',
              background: i === 0
                ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                : i === 1
                ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)'
                : i === 2
                ? 'linear-gradient(135deg, #CD7F32, #A0522D)'
                : 'rgba(30,20,10,0.85)',
              color: i < 3 ? '#000' : 'rgba(220,150,50,0.9)',
              border: i < 3 ? 'none' : '1px solid rgba(200,100,15,0.3)',
              boxShadow: i === 0
                ? '0 0 12px rgba(255,200,0,0.5)'
                : i === 1
                ? '0 0 10px rgba(192,192,192,0.4)'
                : i === 2
                ? '0 0 10px rgba(205,127,50,0.4)'
                : 'none',
            }}
          >
            #{i + 1}
          </div>

          {/* Card */}
          <div
            className="relative rounded-xl overflow-hidden border transition-all duration-300"
            style={{
              border: i === 0
                ? '1px solid rgba(255,200,0,0.3)'
                : '1px solid rgba(200,100,15,0.15)',
              background: '#0c0c0c',
              boxShadow: i === 0
                ? '0 0 20px rgba(255,180,0,0.12)'
                : '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            {/* Media */}
            <div className="relative overflow-hidden" style={{ height: isMobile ? '140px' : '160px' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
              {item.content_type === 'video' && item.external_video ? (
                <div className="relative w-full h-full">
                  <img
                    src={`https://img.youtube.com/vi/${getYoutubeId(item.content_url)}/hqdefault.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(255,0,0,0.88)', boxShadow: '0 0 16px rgba(255,0,0,0.4)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="white">
                        <path d="M6 4l12 6-12 6V4z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={item.content_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}

              {/* Likes badge bottom-right of image */}
              <div
                className="absolute bottom-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.75)',
                  border: '1px solid rgba(200,60,60,0.3)',
                  fontSize: '11px',
                  color: 'rgba(255,100,100,0.9)',
                }}
              >
                ❤️ {item.likes}
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <p
                className="font-bold truncate mb-0.5"
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}
              >
                {item.title}
              </p>
              <p
                className="text-[10px] uppercase tracking-[0.18em] truncate"
                style={{ color: 'rgba(200,120,40,0.6)' }}
              >
                {item.creator}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
  </div>

  {/* Bottom separator */}
  <div className="mt-6 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,100,15,0.2), transparent)' }} />
</div>

      {/* ===== FILTERS — scrollable on mobile ===== */}
      <div className="relative z-10 mb-12 sm:mb-16 px-4 sm:px-6">
        <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-200 border ${
                filter === cat
                  ? 'border-orange-600/45 bg-orange-600/12 text-orange-400 shadow-[0_0_10px_rgba(210,120,45,0.15)]'
                  : 'border-white/[0.05] bg-white/[0.02] text-white/35 hover:border-orange-600/20 hover:text-orange-400/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ===== GRID — 1 col mobile, 2 col tablet, 3 col desktop ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {visible.map((item, i) => (
          <MotionDiv
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
            onClick={() => setSelected(item)}
            className="cursor-pointer group relative"
          >
            {/* Card glow on hover */}
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-b from-orange-600/0 to-red-700/0 group-hover:from-orange-600/20 group-hover:to-red-700/12 transition-all duration-300 blur-sm" />

            <div className="relative border border-white/[0.06] group-hover:border-orange-600/25 bg-[#0c0c0c] rounded-xl overflow-hidden transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)] group-hover:shadow-[0_6px_32px_rgba(210,120,45,0.10)]">

              {/* Top edge */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-600/0 group-hover:via-orange-600/30 to-transparent transition-all duration-300" />

              {/* Media — shorter on mobile */}
              <div className={`overflow-hidden relative ${isMobile ? 'h-48' : 'h-60'}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                {item.content_type === 'video' && item.external_video ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`https://img.youtube.com/vi/${getYoutubeId(item.content_url)}/maxresdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                      onError={(e) => {
                        // fallback to hqdefault if maxres not available
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYoutubeId(item.content_url)}/hqdefault.jpg`
                      }}
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                        style={{
                          background: 'rgba(255,0,0,0.88)',
                          boxShadow: '0 0 20px rgba(255,0,0,0.45), 0 2px 12px rgba(0,0,0,0.6)',
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                          <path d="M6 4l12 6-12 6V4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : item.content_type === 'video' ? (
                  <video
                    src={item.content_url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    controls
                  />
                ) : (
                  <img
                    src={item.content_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                  />
                )}
              </div>

              {/* Card content */}
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-orange-100 transition-colors duration-200 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.2em] text-orange-600/60 mb-3 sm:mb-4 font-medium">
                  {item.creator}
                </p>

                <div className="flex gap-5 text-white/50 text-sm relative z-10">
                  <motion.button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setLikeAnimId(item.id)
                      setTimeout(() => setLikeAnimId(null), 600)
                      const alreadyLiked = likedItems.includes(item.id)
                      const newLikes = alreadyLiked ? item.likes - 1 : item.likes + 1
                      const { error } = await supabase
  .from('submissions')
  .update({ likes: newLikes })
  .eq('id', item.id)
if (!error) {
  if (alreadyLiked) {
    await supabase.from('likes').delete().eq('submission_id', item.id).eq('fingerprint', getFingerprint())
  } else {
    await supabase.from('likes').insert([{ submission_id: item.id, fingerprint: getFingerprint() }])
  }
  setItems((prev) =>
    prev.map((i) =>
      i.id === item.id ? { ...i, likes: newLikes } : i
    )
  )
  setLikedItems((prev) => {
    const updated = alreadyLiked
      ? prev.filter((id) => id !== item.id)
      : [...prev, item.id]
    localStorage.setItem('likedItems', JSON.stringify(updated))
    return updated
  })
}
                    }}
                    whileTap={{ scale: 1.4 }}
                    className="flex items-center gap-1.5 cursor-pointer relative z-10 transition-colors duration-200"
                    style={{ pointerEvents: 'all' }}
                  >
                    <Heart
                      size={15}
                      className={`transition-all duration-200 ${
                        likedItems.includes(item.id)
                          ? 'text-red-500 fill-red-500 drop-shadow-[0_0_5px_rgba(200,60,60,0.7)]'
                          : 'text-white/50 hover:text-red-400'
                      } ${likeAnimId === item.id ? 'scale-125' : ''}`}
                    />
                    <span className={likedItems.includes(item.id) ? 'text-red-400' : ''}>
                      {item.likes}
                    </span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected(item)
                    }}
                    className="flex items-center gap-1.5 cursor-pointer hover:text-orange-400 transition-colors duration-200"
                  >
                    <MessageCircle size={15} /> {item.comments}
                  </button>
                </div>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      <AnimatePresence>
        {selected && (
          <MotionDiv
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-0 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelected(null); setShowCommentBox(false) }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95" />

            {/* Spotlight */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_50%_40%,rgba(210,120,45,0.05),transparent)] pointer-events-none" />

            <MotionDiv
              onClick={(e: any) => e.stopPropagation()}
              initial={isMobile
                ? { y: '100%', opacity: 0 }
                : { scale: 0.92, opacity: 0, y: 20 }
              }
              animate={isMobile
                ? { y: 0, opacity: 1 }
                : { scale: 1, opacity: 1, y: 0 }
              }
              exit={isMobile
                ? { y: '100%', opacity: 0 }
                : { scale: 0.95, opacity: 0 }
              }
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`relative w-full overflow-y-auto ${
                isMobile
                  ? 'max-h-[92vh] rounded-t-2xl'
                  : 'max-w-2xl max-h-[90vh] rounded-2xl'
              }`}
            >
              {/* Modal glow border */}
              <div className={`absolute -inset-[1px] bg-gradient-to-b from-orange-600/15 via-transparent to-red-700/08 pointer-events-none ${isMobile ? 'rounded-t-2xl' : 'rounded-2xl'}`} />

              <div className={`relative bg-[#0a0a0a] border border-orange-600/12 overflow-hidden shadow-[0_0_40px_rgba(210,120,45,0.07)] ${isMobile ? 'rounded-t-2xl' : 'rounded-2xl'}`}>

                {/* Mobile drag handle */}
                {isMobile && (
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                  </div>
                )}

                {/* Top edge light */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent" />

                {/* Close button */}
                <button
                  onClick={() => { setSelected(null); setShowCommentBox(false) }}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/50 hover:text-orange-400 hover:border-orange-600/30 transition-all duration-200"
                >
                  <X size={15} />
                </button>

                {/* Media — shorter on mobile */}
                <div className={`overflow-hidden relative ${isMobile ? 'h-52' : 'h-72'}`}>
                  <div className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 18%, transparent 45%), linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%)',
                    }}
                  />
                  {/* Always-visible close button over video */}
                  <button
                    onClick={() => { setSelected(null); setShowCommentBox(false) }}
                    className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      background: 'rgba(0,0,0,0.75)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    <X size={16} />
                  </button>
                  {selected.content_type === 'video' && selected.external_video ? (
                    <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(selected.content_url)}?autoplay=1&modestbranding=1&rel=0`}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        style={{ border: 'none' }}
                      />
                    </div>
                  ) : selected.content_type === 'video' ? (
                    <video
                      src={selected.content_url}
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <img
                      src={selected.content_url}
                      alt={selected.title}
                      className="w-full h-full object-contain block"
                    />
                  )}
                </div>

                <div className="p-5 sm:p-7 space-y-4 sm:space-y-5">

                  {/* Title & Creator */}
                  <div>
                    <h2
                      className="font-extrabold tracking-wide mb-1"
                      style={{
                        fontSize: isMobile ? '1.35rem' : '1.5rem',
                        background: 'linear-gradient(135deg, #f5ede0 0%, #d97c38 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {selected.title}
                    </h2>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-orange-600/70 font-medium">
                      {selected.creator}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-600/15 to-transparent" />

                  {/* Like + Comment icons */}
                  <div className="flex gap-6 text-white/55">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 1.3 }}
                      onClick={async (e) => {
                        e.stopPropagation()
                        setLikeAnimId(selected.id)
                        setTimeout(() => setLikeAnimId(null), 600)
                        const alreadyLiked = likedItems.includes(selected.id)
                        const newLikes = alreadyLiked ? selected.likes - 1 : selected.likes + 1
                        const { error } = await supabase
  .from('submissions')
  .update({ likes: newLikes })
  .eq('id', selected.id)
if (!error) {
  if (alreadyLiked) {
    await supabase.from('likes').delete().eq('submission_id', selected.id).eq('fingerprint', getFingerprint())
  } else {
    await supabase.from('likes').insert([{ submission_id: selected.id, fingerprint: getFingerprint() }])
  }
  setItems((prev) =>
    prev.map((i) => i.id === selected.id ? { ...i, likes: newLikes } : i)
  )
  setSelected((prev) => prev ? { ...prev, likes: newLikes } : prev)
  setLikedItems((prev) => {
    const updated = alreadyLiked
      ? prev.filter((id) => id !== selected.id)
      : [...prev, selected.id]
    localStorage.setItem('likedItems', JSON.stringify(updated))
    return updated
  })
}
                      }}
                      className="flex items-center gap-2 transition-colors duration-200"
                    >
                      <Heart
                        size={18}
                        className={`transition-all duration-200 ${
                          likedItems.includes(selected.id)
                            ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(200,60,60,0.75)]'
                            : 'hover:text-red-400'
                        }`}
                      />
                      <span className={likedItems.includes(selected.id) ? 'text-red-400' : ''}>
                        {selected.likes}
                      </span>
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setShowCommentBox((v) => !v)}
                      className={`flex items-center gap-2 transition-colors duration-200 ${
                        showCommentBox ? 'text-orange-400' : 'hover:text-orange-400'
                      }`}
                    >
                      <MessageCircle size={18} />
                      {selected.comments}
                    </button>
                  </div>

                  {/* Comments list */}
                  {comments.length > 0 && (
                    <div className="space-y-2">
                      {comments.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 bg-white/[0.025] border border-orange-600/[0.07] rounded-xl relative"
                        >
                          <div className="absolute top-2 right-2">
                            <CommentMenu
                              onEdit={() => { setEditingId(c.id); setEditText(c.content) }}
                              onDelete={() => deleteComment(c.id)}
                              password={c.author_password || ''}
                            />
                          </div>

                          <p className="text-[11px] text-orange-500/70 mb-1 font-medium uppercase tracking-wide">{c.author_name}</p>

                          {editingId === c.id ? (
                            <div className="flex gap-2 mt-1">
                              <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 p-2 bg-black border border-orange-600/20 text-white rounded-lg focus:outline-none focus:border-orange-500/45 text-sm"
                              />
                              <button
                                onClick={() => updateComment(c.id)}
                                className="px-3 bg-orange-500 text-black rounded-lg font-bold hover:bg-orange-400 transition text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-white/70 pr-8">{c.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment input */}
                  <AnimatePresence>
                    {showCommentBox && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <input
  type="text"
  value={commentHandle}
  onChange={(e) => setCommentHandle(e.target.value)}
  placeholder="Your Twitter handle e.g. @akhil"
  className="w-full p-3 bg-black border border-orange-600/12 text-white rounded-xl focus:outline-none focus:border-orange-500/35 placeholder-white/18 text-sm"
style={{ fontSize: '16px' }}
/>
<input
  type="password"
  value={commentPassword}
  onChange={(e) => setCommentPassword(e.target.value)}
  placeholder="Set a password (to edit/delete later)"
  className="w-full p-3 bg-black border border-orange-600/12 text-white rounded-xl focus:outline-none focus:border-orange-500/35 placeholder-white/18 text-sm"
style={{ fontSize: '16px' }}
/>
                        <div className="flex gap-2">
                          <input
                            id="comment-box"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter' && newComment.trim()) {
                               if (!commentHandle.trim()) {
  alert('Please enter your Twitter handle')
  return
}
if (!commentPassword.trim()) {
  alert('Please set a password so you can edit/delete later')
  return
}
                                const { data } = await supabase
                                  .from('comments')
                                  .insert([{
                                    submission_id: selected.id,
                                    author_name: commentHandle.startsWith('@') ? commentHandle : `@${commentHandle}`,
                                    content: newComment,
                                    author_password: commentPassword,
                                  }])
                                  .select()
                                if (data) {
                                  setComments((prev) => [data[0], ...prev])
                                  setNewComment('')
setCommentPassword('')
setCommentHandle('')
                                  setSelected((prev) => prev ? { ...prev, comments: prev.comments + 1 } : prev)
                                }
                              }
                            }}
                            placeholder="Write a comment..."
                            className="flex-1 p-3 bg-black border border-orange-600/12 text-white rounded-xl focus:outline-none focus:border-orange-500/35 placeholder-white/18 text-sm"
                          />
                          <button
                            onClick={async () => {
                              if (!newComment.trim()) return
                             if (!commentHandle.trim()) {
  alert('Please enter your Twitter handle')
  return
}
if (!commentPassword.trim()) {
  alert('Please set a password so you can edit/delete later')
  return
}
                              const { data } = await supabase
                                .from('comments')
                                .insert([{
                                  submission_id: selected.id,
                                  author_name: commentHandle.startsWith('@') ? commentHandle : `@${commentHandle}`,
                                  content: newComment,
                                  author_password: commentPassword,
                                }])
                                .select()
                              if (data) {
                                setComments((prev) => [data[0], ...prev])
                                setNewComment('')
setCommentPassword('')
setCommentHandle('')
                                setSelected((prev) => prev ? { ...prev, comments: prev.comments + 1 } : prev)
                              }
                            }}
                            className="px-4 sm:px-5 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-xl font-bold hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-[0_0_12px_rgba(210,120,45,0.22)] text-sm"
                          >
                            Send
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Bottom edge */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-600/12 to-transparent" />
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

    </MotionSection>
  )
}