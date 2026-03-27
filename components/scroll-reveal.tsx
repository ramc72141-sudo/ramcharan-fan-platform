'use client'

import React from "react"

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { revealVariants } from '@/lib/animations'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.2,
    triggerOnce: true,
  })

  const getInitialVariant = () => {
    const offset = 40
    switch (direction) {
      case 'down':
        return { opacity: 0, y: -offset }
      case 'left':
        return { opacity: 0, x: -offset }
      case 'right':
        return { opacity: 0, x: offset }
      default:
        return { opacity: 0, y: offset }
    }
  }

  const getAnimateVariant = () => {
    switch (direction) {
      case 'down':
        return { opacity: 1, y: 0 }
      case 'left':
        return { opacity: 1, x: 0 }
      case 'right':
        return { opacity: 1, x: 0 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialVariant()}
      animate={isVisible ? getAnimateVariant() : getInitialVariant()}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}
