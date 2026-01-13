'use client'

import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'

interface GenerationCardProps {
    imageUrl: string | null
    isPaid: boolean
    status: 'pending' | 'completed' | 'failed'
    prompt?: string
    onClick?: () => void
}

/**
 * GenerationCard - Freemium image card with blur trap for free users
 * 
 * States:
 * - Pending: Skeleton pulse animation
 * - Completed + Paid: Full image visible
 * - Completed + Free: Blurred image with lock overlay (THE TRAP)
 * - Failed: Error state
 */
export function GenerationCard({
    imageUrl,
    isPaid,
    status,
    prompt = '',
    onClick,
}: GenerationCardProps) {
    const router = useRouter()

    // Handle unlock click - redirect to pricing
    const handleUnlockClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push('/pricing')
    }

    // ========================================
    // LOADING STATE - Skeleton pulse
    // ========================================
    if (status === 'pending') {
        return (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900">
                {/* Animated skeleton */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-pulse" />

                {/* Loading indicator */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 size={32} className="text-pink-500 animate-spin mb-3" />
                    <span className="text-xs text-zinc-500 font-medium">Creating magic...</span>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
        )
    }

    // ========================================
    // FAILED STATE
    // ========================================
    if (status === 'failed') {
        return (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-red-500/20">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                        <span className="text-2xl">😢</span>
                    </div>
                    <span className="text-sm text-zinc-400 text-center">Generation failed</span>
                    <span className="text-xs text-zinc-600 mt-1">Credit refunded</span>
                </div>
            </div>
        )
    }

    // ========================================
    // COMPLETED STATE
    // ========================================
    return (
        <div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 cursor-pointer card-hover"
            onClick={onClick}
        >
            {/* Base Image */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={prompt || 'Generated image'}
                    className={`w-full h-full object-cover transition-all duration-500 ${!isPaid ? 'blur-xl scale-110' : ''
                        }`}
                    loading="lazy"
                />
            )}

            {/* ========================================
          THE FREEMIUM TRAP - Blur overlay for free users
          ======================================== */}
            {!isPaid && (
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center"
                    onClick={handleUnlockClick}
                >
                    {/* Lock Button - Pink accent */}
                    <button
                        className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-400 transition-all duration-200 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30 hover:scale-110 active:scale-95"
                        onClick={handleUnlockClick}
                    >
                        <Lock size={28} className="text-white" />
                    </button>

                    {/* Unlock Text */}
                    <span className="text-sm font-semibold text-white mb-1">
                        Unlock Full Image
                    </span>
                    <span className="text-xs text-zinc-400 text-center px-4">
                        High-Res & NSFW Access
                    </span>

                    {/* CTA Hint */}
                    <div className="mt-4 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                        <span className="text-xs text-white font-medium">
                            Tap to Upgrade 🔥
                        </span>
                    </div>
                </div>
            )}

            {/* Paid user - subtle gradient overlay for depth */}
            {isPaid && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            )}
        </div>
    )
}
