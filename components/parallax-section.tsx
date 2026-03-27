'use client'

import React from "react"

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ParallaxSectionProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export default function ParallaxSection({
  children,
  offset = 50,
  className = '',
}: ParallaxSectionProps) {
  const [scrollY, setScrollY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: scrollY * 0.5,
      }}
    >
      {children}
    </motion.div>
  )
}
