'use client'

import { Lock } from 'lucide-react'

interface BlurOverlayProps {
    imageUrl: string
    isSubscribed: boolean
    alt?: string
    className?: string
}

/**
 * BlurOverlay component
 * Shows blurred image with lock icon for non-subscribed users
 */
export function BlurOverlay({
    imageUrl,
    isSubscribed,
    alt = 'Generated image',
    className = ''
}: BlurOverlayProps) {
    return (
        <div className={`relative overflow-hidden rounded-xl ${className}`}>
            {/* Base Image */}
            <img
                src={imageUrl}
                alt={alt}
                className={`w-full h-full object-cover transition-all duration-300 ${!isSubscribed ? 'blur-xl scale-105' : ''
                    }`}
            />

            {/* Blur Overlay for non-subscribed users */}
            {!isSubscribed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xl">
                    {/* Lock Icon */}
                    <div className="w-16 h-16 rounded-full bg-surface/80 flex items-center justify-center mb-3 border border-white/10">
                        <Lock size={28} className="text-accent" />
                    </div>

                    {/* Unlock Text */}
                    <span className="text-sm font-semibold text-white">Unlock</span>
                    <span className="text-xs text-zinc-400 mt-1">Subscribe to view</span>
                </div>
            )}
        </div>
    )
}
