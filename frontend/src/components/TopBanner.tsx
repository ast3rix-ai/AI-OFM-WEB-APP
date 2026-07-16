'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

const CONFIG = {
    messages: [
        '✨ Create AI influencers in seconds',
        '🎬 One photo → Viral reel',
        '💎 100 free credits',
    ],
    height: 28,
    fontSize: 12,
    intervalMs: 2500,
    transitionMs: 450,
}

const EASING = [0.22, 1, 0.36, 1] as const

export function TopBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
        if (prefersReducedMotion || isPaused || !isVisible) return
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CONFIG.messages.length)
        }, CONFIG.intervalMs)
        return () => clearInterval(timer)
    }, [isPaused, prefersReducedMotion, isVisible])

    const handleMouseEnter = useCallback(() => setIsPaused(true), [])
    const handleMouseLeave = useCallback(() => setIsPaused(false), [])

    if (!isVisible) return null

    const variants = {
        enter: { y: CONFIG.height, opacity: 0 },
        center: { y: 0, opacity: 1 },
        exit: { y: -CONFIG.height, opacity: 0 },
    }

    return (
        <div
            role="banner"
            aria-label="Announcements"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                height: CONFIG.height,
                background: 'linear-gradient(90deg, #FFF7FB 0%, #F5F0FF 100%)',
                borderBottom: '1px solid rgba(11, 11, 15, 0.08)',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 100,
            }}
        >
            {/* Screen reader text */}
            <span className="sr-only">{CONFIG.messages.join('. ')}</span>

            <div
                aria-hidden="true"
                style={{
                    height: CONFIG.height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    paddingLeft: 16,
                    paddingRight: 40,
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={currentIndex}
                        variants={prefersReducedMotion ? {} : variants}
                        initial={prefersReducedMotion ? {} : 'enter'}
                        animate="center"
                        exit={prefersReducedMotion ? {} : 'exit'}
                        transition={{
                            duration: prefersReducedMotion ? 0 : CONFIG.transitionMs / 1000,
                            ease: EASING,
                        }}
                        style={{
                            position: 'absolute',
                            fontSize: CONFIG.fontSize,
                            fontWeight: 500,
                            color: '#0B0B0F',
                            lineHeight: `${CONFIG.height}px`,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'calc(100% - 80px)',
                            textAlign: 'center',
                        }}
                    >
                        {CONFIG.messages[currentIndex]}
                    </motion.span>
                </AnimatePresence>
            </div>

            <button
                onClick={() => setIsVisible(false)}
                aria-label="Dismiss announcements"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all hover:bg-black/5"
                style={{ color: '#0B0B0F', opacity: 0.5 }}
            >
                <X size={14} strokeWidth={2} />
            </button>
        </div>
    )
}
