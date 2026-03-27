'use client'

import React from "react"

import { motion } from 'framer-motion'
import { pageVariants } from '@/lib/animations'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function PageTransition({
  children,
  className = '',
}: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}
