'use client'

import { useState, useEffect } from 'react'

const messages = [
    '⚡️ The most realistic AI',
    '⚡️ Create your dream girl',
    '⚡️ No technical skills needed',
]

export function TextCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % messages.length)
        }, 4000) // 4 seconds visible

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="h-10 bg-pink-100 flex items-center justify-center overflow-hidden relative z-50">
            {/* Inner sliding track */}
            <div
                className="flex flex-col items-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateY(-${currentIndex * 100}%)` }}
            >
                {messages.map((message, i) => (
                    <div
                        key={i}
                        className="h-10 flex items-center justify-center w-full shrink-0"
                    >
                        <span className="text-pink-950 text-xs md:text-sm font-semibold tracking-widest uppercase">
                            {message}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
