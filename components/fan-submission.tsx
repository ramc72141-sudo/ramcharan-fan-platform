'use client'

import React from "react"
import { sha256 } from 'js-sha256'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function FanSubmission() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: 'offline-pics',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [showSteps, setShowSteps] = useState(false)

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  const generateFileHash = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer()
    return sha256(arrayBuffer)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setFilePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTrackingId(null)

    try {
      let contentUrl = ''
      let contentType = 'image'
      let externalVideo = false
      let fileHash: string | null = null

      if (formData.category === 'video-edits' || formData.category === 'celebrations') {
        if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
          setToast({ type: 'error', message: '❌ Please provide a valid YouTube link.' })
          setIsSubmitting(false)
          return
        }
        contentUrl = youtubeUrl
        contentType = 'video'
        externalVideo = true
      } else {
        if (!selectedFile) throw new Error('No image selected')
        const file = selectedFile
        const MAX_SIZE = 20 * 1024 * 1024
        if (file.size > MAX_SIZE) {
          setToast({ type: 'error', message: '❌ Image must be under 20MB.' })
          setIsSubmitting(false)
          return
        }
        fileHash = await generateFileHash(file)
        const { data: existing } = await supabase
          .from('submissions')
          .select('id')
          .eq('file_hash', fileHash)
          .maybeSingle()
        if (existing) {
          setToast({ type: 'error', message: '⚠️ This image was already uploaded.' })
          setIsSubmitting(false)
          return
        }
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('fan-submissions')
          .upload(fileName, file, { contentType: file.type })
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage
          .from('fan-submissions')
          .getPublicUrl(fileName)
        contentUrl = publicUrl
      }

      const newTrackingId = 'FAN-' + Math.random().toString(36).substring(2, 8).toUpperCase()

      const { error: insertError } = await supabase.from('submissions').insert([{
        creator_name: formData.name,
        email: formData.email,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        content_url: contentUrl,
        content_type: contentType,
        external_video: externalVideo,
        status: 'pending',
        tracking_id: newTrackingId,
        rejection_reason: null,
        likes: 0,
        file_hash: fileHash,
        created_at: new Date(),
      }])

      if (insertError) throw insertError

      setTrackingId(newTrackingId)
      setTimeout(() => setToast(null), 4000)
      setFormData({ name: '', email: '', title: '', description: '', category: 'offline-pics' })
      setFilePreview(null)
      setSelectedFile(null)

    } catch (error) {
      console.error("FULL ERROR:", error)
      setToast({ type: 'error', message: '❌ Something went wrong. Please try again.' })
      setTimeout(() => setToast(null), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: 'offline-pics', label: 'Offline Pics' },
    { value: 'pic-edits', label: 'Pic Edits' },
    { value: 'video-edits', label: 'Video Edits' },
    { value: 'celebrations', label: 'Celebrations' },
    { value: 'others', label: 'Others' },
  ]

  const inputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(200,120,20,0.25)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.6) inset, 0 1px 0 rgba(200,110,15,0.05)',
    color: 'rgba(255,255,255,0.88)',
    borderRadius: '8px',
    outline: 'none',
    width: '100%',
    padding: isMobile ? '10px 14px' : '12px 16px',
    fontSize: isMobile ? '14px' : '13px',
    letterSpacing: '0.02em',
    transition: 'all 0.2s',
  }

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.border = '1px solid rgba(234,124,16,0.58)'
    e.target.style.boxShadow = '0 0 0 2px rgba(180,80,10,0.12), 0 2px 10px rgba(0,0,0,0.6) inset'
    e.target.style.background = 'rgba(180,80,10,0.06)'
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.target.style.border = '1px solid rgba(200,120,20,0.25)'
    e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.6) inset, 0 1px 0 rgba(200,110,15,0.05)'
    e.target.style.background = 'rgba(0,0,0,0.4)'
  }

  // Deterministic ember positions — evenly spread for both mobile and desktop
  const emberPositions = [
    { top: 5,  left: 4  }, { top: 18, left: 22 }, { top: 32, left: 8  },
    { top: 48, left: 38 }, { top: 62, left: 14 }, { top: 75, left: 55 },
    { top: 88, left: 28 }, { top: 12, left: 68 }, { top: 28, left: 82 },
    { top: 45, left: 92 }, { top: 58, left: 72 }, { top: 72, left: 88 },
    { top: 85, left: 48 }, { top: 95, left: 78 },
  ]

  return (
    <section
      id="submit"
      className="py-16 sm:py-28 relative overflow-hidden text-white bg-[#050403]"
    >

      <style suppressHydrationWarning>{`
        .submit-input::placeholder { color: rgba(180,110,30,0.3) !important; }
        .submit-select option { background: #0e0b07; color: rgba(255,255,255,0.88); }

        @keyframes scan-form {
          0%   { top: 4%; opacity: 0; }
          8%   { opacity: 0.7; }
          92%  { opacity: 0.7; }
          100% { top: 97%; opacity: 0; }
        }
        .form-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          animation: scan-form 9s ease-in-out infinite;
          animation-delay: 2s;
          pointer-events: none;
          filter: blur(0.8px);
          will-change: top, opacity;
        }

        @keyframes btn-glow-pulse {
          0%, 100% {
            box-shadow:
              0 0 22px rgba(210,105,12,0.42),
              0 0 45px rgba(180,80,8,0.18),
              0 2px 0 rgba(0,0,0,0.55) inset;
          }
          50% {
            box-shadow:
              0 0 35px rgba(230,120,14,0.65),
              0 0 70px rgba(200,90,8,0.35),
              0 2px 0 rgba(0,0,0,0.55) inset;
          }
        }
        .btn-glow-pulse {
          animation: btn-glow-pulse 9s ease-in-out infinite;
          animation-delay: 2s;
        }

        /* Mobile — lighter glow on button so GPU doesn't drop frames */
        @media (max-width: 640px) {
          @keyframes btn-glow-pulse-mobile {
            0%, 100% {
              box-shadow:
                0 0 16px rgba(210,105,12,0.38),
                0 0 30px rgba(180,80,8,0.15),
                0 2px 0 rgba(0,0,0,0.55) inset;
            }
            50% {
              box-shadow:
                0 0 25px rgba(230,120,14,0.55),
                0 0 50px rgba(200,90,8,0.28),
                0 2px 0 rgba(0,0,0,0.55) inset;
            }
          }
          .btn-glow-pulse {
            animation: btn-glow-pulse-mobile 9s ease-in-out infinite;
            animation-delay: 2s;
          }
        }
      `}</style>

      {/* ===== CINEMATIC BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(170,75,8,0.16) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 40% 25% at 0% 100%, rgba(140,60,6,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 40% 25% at 100% 100%, rgba(140,60,6,0.08) 0%, transparent 60%)' }} />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' /%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(180,100,20,0.2) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.85) 100%)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-700/22 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ===== SECTION HEADER ===== */}
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="text-[11px] tracking-[0.45em] uppercase font-medium mb-4"
            style={{ color: 'rgba(200,120,30,0.55)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Fan Creations
          </motion.p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-5">
            <span
              style={{
                background: 'linear-gradient(170deg, #ffffff 0%, #f0c060 45%, #c87018 80%, #9a4008 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 18px rgba(190,95,12,0.32))',
              }}
            >
              Share Your Masterpiece
            </span>
          </h2>

          <p
            className="text-[13px] sm:text-[14px] max-w-2xl mx-auto leading-relaxed px-2"
            style={{ color: 'rgba(200,180,150,0.45)' }}
          >
            Submit your fan creations and have them featured in our exclusive gallery.
            All submissions go through a careful moderation process.
          </p>

          <div className="mx-auto mt-7 h-px w-40 bg-gradient-to-r from-transparent via-orange-600/50 to-transparent" />
        </motion.div>

        {/* ===== MAIN FORM CARD ===== */}
        <motion.form
          className="relative rounded-2xl overflow-hidden"
          style={{
            padding: isMobile ? '24px 20px' : undefined,
            background: 'linear-gradient(155deg, #0e0b07 0%, #090705 55%, #0c0906 100%)',
            border: '1px solid rgba(200,115,18,0.22)',
            boxShadow: [
              '0 0 60px rgba(0,0,0,0.9)',
              '0 0 0 1px rgba(200,115,18,0.10) inset',
              '0 0 80px rgba(140,60,6,0.10) inset',
              '0 0 25px rgba(170,80,8,0.07)',
            ].join(', '),
          }}
          // Desktop uses Tailwind padding, mobile uses inline style above
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Tailwind padding for sm and above */}
          <div className={isMobile ? 'hidden' : 'absolute inset-0 p-10 md:p-14 pointer-events-none'} />
          <div className={isMobile ? '' : 'p-10 md:p-14'}>

          {/* Card top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/35 to-transparent" />

          {/* ===== SCANNING LINE ===== */}
          <div
            className="form-scan-line"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(200,95,10,0.0) 5%, rgba(200,95,10,0.12) 25%, rgba(200,95,10,0.18) 40%, rgba(240,150,40,0.28) 50%, rgba(200,95,10,0.18) 60%, rgba(200,95,10,0.12) 75%, rgba(200,95,10,0.0) 95%, transparent 100%)',
              boxShadow: '0 0 12px 4px rgba(180,85,8,0.10), 0 0 4px 1px rgba(220,120,20,0.12)',
              maskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.4) 80%, transparent 100%)',
            }}
          />

          {/* ===== EMBER PARTICLES — deterministic, evenly spread ===== */}
          {emberPositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: i % 5 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
                height: i % 5 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
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
                  ? '0 0 6px 2px rgba(255,120,0,0.6)'
                  : '0 0 4px 1px rgba(234,124,16,0.45)',
                zIndex: 0,
                willChange: 'transform, opacity',
              }}
              animate={{
                y: [0, -(40 + (i % 4) * 15), 0],
                x: [0, i % 2 === 0 ? 8 : -7, 0],
                opacity: [0.08, 0.7, 0.08],
                scale: [1, 1.3, 0.2],
              }}
              transition={{
                duration: 4 + (i % 5) * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: (i * 0.35) % 4,
              }}
            />
          ))}

          {/* Card bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-900/15 to-transparent" />

          {/* Corner brackets — top-left */}
          <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
            <div className="absolute top-0 left-0 h-full w-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
          </div>
          {/* Corner brackets — top-right */}
          <div className="absolute top-4 right-4 w-5 h-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
            <div className="absolute top-0 right-0 h-full w-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
          </div>
          {/* Corner brackets — bottom-left */}
          <div className="absolute bottom-4 left-4 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
            <div className="absolute bottom-0 left-0 h-full w-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
          </div>
          {/* Corner brackets — bottom-right */}
          <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
            <div className="absolute bottom-0 right-0 h-full w-[1.5px]" style={{ background: 'rgba(220,115,16,0.55)' }} />
          </div>

          {/* ===== NAME + EMAIL ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5 sm:mb-6">
            <div>
              <label
                className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2"
                style={{ color: 'rgba(200,130,40,0.72)' }}
              >
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your name"
                className="submit-input"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div>
              <label
                className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2"
                style={{ color: 'rgba(200,130,40,0.72)' }}
              >
                Twitter / X Handle *
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="@yourhandle"
                className="submit-input"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </div>

          {/* ===== TITLE ===== */}
          <div className="mb-5 sm:mb-6">
            <label
              className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: 'rgba(200,130,40,0.72)' }}
            >
              Artwork Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Give your work a title"
              className="submit-input"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* ===== CATEGORY ===== */}
          <div className="mb-5 sm:mb-6">
            <label
              className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: 'rgba(200,130,40,0.72)' }}
            >
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="submit-select"
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* ===== DESCRIPTION ===== */}
          <div className="mb-5 sm:mb-6">
            <label
              className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2"
              style={{ color: 'rgba(200,130,40,0.72)' }}
            >
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={isMobile ? 4 : 6}
              placeholder="Tell us about your work..."
              className="submit-input"
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {/* ===== YOUTUBE LINK ===== */}
          {(formData.category === 'video-edits' || formData.category === 'celebrations') && (
            <motion.div
              className="mb-5 sm:mb-6"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label
                className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2"
                style={{ color: 'rgba(200,130,40,0.72)' }}
              >
                YouTube Video Link *
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                required
                placeholder="https://youtube.com/watch?v=..."
                className="submit-input"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <p
                onClick={() => setShowSteps(true)}
                className="text-[11px] mt-2 cursor-pointer transition tracking-wide"
                style={{ color: 'rgba(200,120,30,0.6)' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(234,124,16,0.9)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(200,120,30,0.6)')}
              >
                How to upload your video? (Click here)
              </p>
            </motion.div>
          )}

          {/* ===== IMAGE UPLOAD ===== */}
          {formData.category !== 'video-edits' && formData.category !== 'celebrations' && (
            <div className="mb-6 sm:mb-8">
              <label
                className="block text-[10.5px] font-semibold tracking-[0.2em] uppercase mb-2"
                style={{ color: 'rgba(200,130,40,0.72)' }}
              >
                Upload Image *
              </label>
              <div
                className="relative text-center cursor-pointer transition-all duration-200"
                style={{
                  padding: isMobile ? '24px 16px' : '32px',
                  background: 'rgba(0,0,0,0.45)',
                  border: '1.5px dashed rgba(200,115,18,0.28)',
                  borderRadius: '10px',
                  boxShadow: '0 3px 14px rgba(0,0,0,0.6) inset',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.border = '1.5px dashed rgba(220,120,18,0.52)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(160,70,8,0.06)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.border = '1.5px dashed rgba(200,115,18,0.28)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.45)'
                }}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                  <Upload
                    className="w-7 h-7 transition-colors duration-200"
                    style={{ color: 'rgba(200,115,18,0.65)' }}
                  />
                  <div>
                    {selectedFile ? (
                      <>
                        <p className="text-[13px] font-semibold" style={{ color: 'rgba(220,130,25,0.9)' }}>
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(180,130,60,0.5)' }}>
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[13px]" style={{ color: 'rgba(220,180,120,0.55)' }}>
                          {isMobile ? 'Tap to upload' : 'Drag and drop or click to upload'}
                        </p>
                        <p className="text-[11px] mt-1" style={{ color: 'rgba(180,130,60,0.4)' }}>
                          Images only · Max 20MB
                        </p>
                      </>
                    )}
                  </div>
                  {filePreview && (
                    <img
                      src={filePreview}
                      className="mt-4 max-h-60 mx-auto object-contain rounded-lg"
                      style={{ border: '1px solid rgba(200,115,18,0.2)' }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== SUBMIT BUTTON ===== */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl font-bold uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-glow-pulse"
            style={{
              fontSize: isMobile ? '11px' : '12px',
              letterSpacing: isMobile ? '0.18em' : '0.28em',
              background: isSubmitting
                ? 'rgba(160,70,8,0.4)'
                : 'linear-gradient(135deg, #f08318 0%, #d05510 30%, #b04808 60%, #8a3204 85%, #a03c06 100%)',
              color: '#fff2e0',
              border: '1px solid rgba(225,118,16,0.32)',
              boxShadow: isSubmitting
                ? 'none'
                : [
                  '0 0 22px rgba(210,105,12,0.42)',
                  '0 0 45px rgba(180,80,8,0.18)',
                  '0 2px 0 rgba(0,0,0,0.55) inset',
                  '0 -1px 0 rgba(255,160,50,0.08) inset',
                ].join(', '),
            }}
            whileHover={!isSubmitting ? {
              scale: 1.012,
              y: -2,
              boxShadow: '0 0 32px rgba(225,115,14,0.58), 0 0 60px rgba(190,85,8,0.22), 0 2px 0 rgba(0,0,0,0.55) inset',
            } : {}}
            whileTap={!isSubmitting ? { scale: 0.988, y: 0 } : {}}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Artwork'}
          </motion.button>

          <p
            className="text-[10.5px] text-center mt-4 tracking-wide"
            style={{ color: 'rgba(180,130,60,0.38)' }}
          >
            All submissions are reviewed before publishing. Our team will approve your work shortly.
          </p>

          {/* ===== SUCCESS TRACKING PANEL ===== */}
          {trackingId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 sm:mt-10 relative rounded-2xl text-center overflow-hidden"
              style={{
                padding: isMobile ? '24px 20px' : '32px',
                background: 'linear-gradient(155deg, #0c0904 0%, #080603 100%)',
                border: '1px solid rgba(180,100,15,0.25)',
                boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(180,100,15,0.10) inset',
              }}
            >
              {/* Top edge */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent" />

              {/* Corner brackets */}
              {(['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const).map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4 pointer-events-none`}>
                  <div
                    className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} w-full h-[1.5px]`}
                    style={{ background: 'rgba(200,115,16,0.45)' }}
                  />
                  <div
                    className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} h-full w-[1.5px]`}
                    style={{ background: 'rgba(200,115,16,0.45)' }}
                  />
                </div>
              ))}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-4xl mb-4"
              >
                🎉
              </motion.div>

              <p
                className="text-[10.5px] tracking-[0.35em] uppercase font-semibold mb-3"
                style={{ color: 'rgba(180,100,15,0.55)' }}
              >
                Submission Received
              </p>

              <p
                className="font-black text-lg mb-1"
                style={{
                  color: 'rgba(80,220,120,0.9)',
                  letterSpacing: '0.05em',
                  filter: 'drop-shadow(0 0 8px rgba(60,200,100,0.4))',
                }}
              >
                ✅ System Confirmed
              </p>

              <div className="my-4 h-px bg-gradient-to-r from-transparent via-orange-800/20 to-transparent" />

              <p
                className="text-[12px] tracking-wide mb-1"
                style={{ color: 'rgba(200,160,80,0.5)' }}
              >
                Your Tracking ID
              </p>

              <p
                className="font-black tracking-[0.18em] mb-6"
                style={{
                  fontSize: isMobile ? '1.35rem' : '1.5rem',
                  color: '#ea8c18',
                  filter: 'drop-shadow(0 0 12px rgba(200,120,18,0.55))',
                }}
              >
                {trackingId}
              </p>

              <a
                href={`/check-status?id=${trackingId}`}
                className="inline-block rounded-lg font-bold tracking-[0.22em] uppercase transition-all duration-200"
                style={{
                  padding: isMobile ? '10px 20px' : '12px 32px',
                  fontSize: isMobile ? '10.5px' : '11.5px',
                  background: 'linear-gradient(135deg, #d97210 0%, #b04808 60%, #8a3204 100%)',
                  color: '#fff2e0',
                  border: '1px solid rgba(220,115,16,0.3)',
                  boxShadow: '0 0 18px rgba(200,100,12,0.35)',
                }}
              >
                Check Status →
              </a>

            </motion.div>
          )}

          </div>{/* end desktop padding wrapper */}
        </motion.form>
      </div>

      {/* ===== TOAST ===== */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed z-[200]"
          style={{
            bottom: isMobile ? '16px' : '32px',
            right: isMobile ? '12px' : '32px',
            left: isMobile ? '12px' : 'auto',
          }}
        >
          <div
            className="px-5 py-4 text-[11px] sm:text-[11.5px] tracking-[0.15em] sm:tracking-[0.18em] uppercase font-bold"
            style={{
              background: 'rgba(6,4,2,0.95)',
              backdropFilter: 'blur(8px)',
              border: toast.type === 'success'
                ? '1px solid rgba(200,115,18,0.4)'
                : '1px solid rgba(220,60,30,0.4)',
              color: toast.type === 'success'
                ? 'rgba(220,130,25,0.95)'
                : 'rgba(240,100,80,0.95)',
              boxShadow: toast.type === 'success'
                ? '0 0 20px rgba(180,90,12,0.25)'
                : '0 0 20px rgba(200,50,25,0.2)',
              borderRadius: '10px',
            }}
          >
            {toast.message}
          </div>
        </motion.div>
      )}

      {/* ===== HOW TO UPLOAD MODAL ===== */}
      {showSteps && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[300] flex items-center justify-center px-4 sm:px-6"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowSteps(false)}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full relative rounded-2xl overflow-hidden"
            style={{
              padding: isMobile ? '24px 20px' : '32px',
              background: 'linear-gradient(155deg, #0e0b07 0%, #090705 100%)',
              border: '1px solid rgba(200,115,18,0.22)',
              boxShadow: '0 0 50px rgba(0,0,0,0.9), 0 0 0 1px rgba(200,115,18,0.08) inset',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-600/30 to-transparent" />

            <h3
              className="font-black mb-6 text-center tracking-[0.1em] uppercase"
              style={{
                fontSize: isMobile ? '16px' : '20px',
                background: 'linear-gradient(170deg, #ffffff 0%, #e8a040 55%, #c06010 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              How to Upload Your Video
            </h3>

            <div className="space-y-4">
              {[
                'Upload your video to YouTube.',
                'Set visibility to Unlisted.',
                'After upload, click Share.',
                'Copy the video link.',
                'Paste the link in the form and submit.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(200,100,15,0.2)',
                      color: 'rgba(220,125,20,0.85)',
                      border: '1px solid rgba(200,100,15,0.3)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: 'rgba(220,190,130,0.65)' }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSteps(false)}
              className="mt-8 w-full py-3 rounded-lg font-bold tracking-[0.25em] uppercase transition-all duration-200"
              style={{
                fontSize: isMobile ? '11px' : '11.5px',
                background: 'linear-gradient(135deg, #d97210 0%, #b04808 60%, #8a3204 100%)',
                color: '#fff2e0',
                border: '1px solid rgba(220,115,16,0.3)',
                boxShadow: '0 0 16px rgba(200,100,12,0.32)',
              }}
            >
              Got It
            </button>

          </motion.div>
        </motion.div>
      )}

    </section>
  )
}