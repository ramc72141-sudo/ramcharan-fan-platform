'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function GlobalMouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 w-96 h-96 rounded-full z-0"
      animate={{
        x: position.x - 200,
        y: position.y - 200,
      }}
      transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
      style={{
        background:
          'radial-gradient(circle, rgba(255,115,0,0.15) 0%, rgba(255,115,0,0.08) 40%, transparent 70%)',
        filter: 'blur(80px)',
      }}
    />
  )
}