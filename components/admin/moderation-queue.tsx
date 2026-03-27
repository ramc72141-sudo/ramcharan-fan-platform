'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Eye, MoreVertical } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Submission {
  id: string
  title: string
  creator_name: string
  description: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  email: string
  content_url: string
  content_type: 'image' | 'video'
}

interface ModerationQueueProps {
  tab: 'queue' | 'approved' | 'rejected'
  onDataChange?: () => void
}

export default function ModerationQueue({ tab, onDataChange }: ModerationQueueProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  // ── Mobile detection ──────────────────────────────
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpenId(null)
    }
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const loadSubmissions = async () => {
    setIsLoading(true)
    const statusFilter =
      tab === 'queue'
        ? 'pending'
        : tab === 'approved'
        ? 'approved'
        : 'rejected'

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', statusFilter)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    } else {
      setSubmissions(data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadSubmissions()
  }, [tab])

  const handleStatusChange = async (
    id: string,
    newStatus: 'pending' | 'approved' | 'rejected'
  ) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setMenuOpenId(null)
      await loadSubmissions()
      onDataChange?.()
    } else {
      console.error(error)
    }
  }

  const handleApprove = async (id: string) => {
    await handleStatusChange(id, 'approved')
  }

  const submitRejection = async () => {
    if (!rejectTarget) return
    const { error } = await supabase
      .from('submissions')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
      })
      .eq('id', rejectTarget)

    if (!error) {
      setRejectTarget(null)
      setRejectionReason('')
      await loadSubmissions()
      onDataChange?.()
    } else {
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id)

    if (!error) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id))
      setMenuOpenId(null)
      setDeleteTarget(null)
      onDataChange?.()
    } else {
      console.error(error)
    }
  }

  const filteredSubmissions = submissions

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading submissions...</p>
      </div>
    )
  }

  if (filteredSubmissions.length === 0) {
    return (
      <motion.div
        className="text-center py-12 bg-card border border-accent/20 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-foreground/60">No {tab} submissions</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {filteredSubmissions.map((submission, index) => (
        <motion.div
          key={submission.id}
          className="bg-card border border-accent/20 rounded-lg p-4 sm:p-6 hover:border-accent transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={!isMobile ? { scale: 1.01 } : {}}
        >
          {/* ── Layout: stacked on mobile, side by side on desktop ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            {/* Left Side - Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 truncate">
                {submission.title}
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-foreground/60">
                <span>By {submission.creator_name}</span>
                <span className="hidden sm:inline">•</span>
                <span className="capitalize">{submission.category}</span>
                <span className="hidden sm:inline">•</span>
                <span>{new Date(submission.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-foreground/40 mt-2 truncate">{submission.email}</p>
              <p className="text-sm text-foreground/60 mt-2 line-clamp-2 sm:line-clamp-none">
                {submission.description}
              </p>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-2 sm:gap-3 sm:ml-4">
              {tab === 'queue' && (
                <>
                  <motion.button
                    onClick={() => handleApprove(submission.id)}
                    className="p-2 sm:p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Approve"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setRejectTarget(submission.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Reject"
                  >
                    <XCircle className="w-5 h-5" />
                  </motion.button>
                </>
              )}

              <motion.button
                onClick={() => setSelectedSubmission(submission)}
                className="p-2 rounded-lg hover:bg-accent/10 text-foreground/60 hover:text-accent transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="View Details"
              >
                <Eye className="w-5 h-5" />
              </motion.button>

              <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  onClick={() =>
                    setMenuOpenId(menuOpenId === submission.id ? null : submission.id)
                  }
                  className="p-2 rounded-lg hover:bg-accent/10 text-foreground/60 hover:text-accent transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="More Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </motion.button>

                {menuOpenId === submission.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-accent/20 rounded-lg shadow-lg z-50">

                    {submission.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusChange(submission.id, 'approved')}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-green-500/10 text-green-500"
                      >
                        Approve
                      </button>
                    )}

                    {submission.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusChange(submission.id, 'rejected')}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-500"
                      >
                        Reject
                      </button>
                    )}

                    {submission.status !== 'pending' && (
                      <button
                        onClick={() => handleStatusChange(submission.id, 'pending')}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-yellow-500/10 text-yellow-500"
                      >
                        Move to Pending
                      </button>
                    )}

                    <div className="border-t border-accent/10 my-1" />

                    <button
                      onClick={() => {
                        setDeleteTarget(submission.id)
                        setMenuOpenId(null)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-600"
                    >
                      Delete Submission
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex gap-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-light tracking-wider capitalize ${
                submission.status === 'approved'
                  ? 'bg-green-500/10 text-green-500'
                  : submission.status === 'rejected'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}
            >
              {submission.status}
            </span>
          </div>
        </motion.div>
      ))}

      {/* ===== VIEW DETAILS MODAL ===== */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/90 flex items-end sm:items-center justify-center z-[100] px-0 sm:px-4">
          <motion.div
            initial={isMobile ? { y: '100%', opacity: 0 } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-accent/20 w-full max-w-2xl relative rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto"
            style={{ padding: isMobile ? '24px 20px' : '32px' }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            )}

            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 text-foreground/60 hover:text-accent text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 pr-8">
              {selectedSubmission.title}
            </h2>

            <p className="text-sm text-foreground/60 mb-2">
              By {selectedSubmission.creator_name}
            </p>

            <p className="text-sm text-foreground/60 mb-4 sm:mb-6 truncate">
              {selectedSubmission.email}
            </p>

            <p className="text-sm text-foreground/70 mb-4 sm:mb-6">
              {selectedSubmission.description}
            </p>

            <div className="mb-4 sm:mb-6">
              {selectedSubmission.content_type === 'image' ? (
                <img
                  src={selectedSubmission.content_url}
                  className="w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
                />
              ) : selectedSubmission.content_url.includes('youtube.com') || selectedSubmission.content_url.includes('youtu.be') ? (
                // ── YouTube video ──
                <div className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      (() => {
                        const match = selectedSubmission.content_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
                        return match ? match[1] : ''
                      })()
                    }?modestbranding=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    style={{ border: 'none' }}
                  />
                </div>
              ) : (
                <video
                  src={selectedSubmission.content_url}
                  controls
                  className="w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
                />
              )}
            </div>

            <p className="text-xs text-foreground/40">
              Submitted on {new Date(selectedSubmission.created_at).toLocaleString()}
            </p>
          </motion.div>
        </div>
      )}

      {/* ===== REJECT MODAL ===== */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-[200] px-0 sm:px-4">
          <motion.div
            initial={isMobile ? { y: '100%', opacity: 0 } : { scale: 0.9, opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-accent/20 w-full max-w-md rounded-t-2xl sm:rounded-2xl"
            style={{ padding: isMobile ? '24px 20px' : '32px' }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            )}

            <h2 className="text-xl font-bold mb-4 text-foreground">
              Reject Submission
            </h2>

            <textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full mb-6 px-4 py-3 bg-background border border-accent/20 rounded-lg text-foreground focus:outline-none focus:border-accent"
              rows={4}
            />

            <div className="flex justify-end gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setRejectTarget(null)
                  setRejectionReason('')
                }}
                className="px-4 py-2 rounded-lg border border-accent/20 text-foreground/60 hover:text-foreground text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                Confirm Reject
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-[200] px-0 sm:px-4">
          <motion.div
            initial={isMobile ? { y: '100%', opacity: 0 } : { scale: 0.9, opacity: 0 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="bg-card border border-accent/20 w-full max-w-md rounded-t-2xl sm:rounded-2xl"
            style={{ padding: isMobile ? '24px 20px' : '32px' }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
            )}

            <h2 className="text-xl font-bold mb-4 text-foreground">
              Delete Submission?
            </h2>

            <p className="text-sm text-foreground/60 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-accent/20 text-foreground/60 hover:text-foreground text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  )
}