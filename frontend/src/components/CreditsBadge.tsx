'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

export function Creditsbage() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div
            className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-3 text-white px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
            style={{
                backgroundColor: '#7C3AED',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
            }}
        >
            <span className="text-sm font-semibold">
                ✨ 100 Free Credits
            </span>
            <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss"
            >
                <X size={14} />
            </button>
        </div>
    )
}
