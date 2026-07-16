'use client'

import { useAppStore, Generation } from '@/store/useAppStore'
import { BlurOverlay } from './BlurOverlay'
import { Loader2, AlertCircle, ImageIcon, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface GenerationsFeedProps {
    generations?: Generation[]
}

/**
 * GenerationsFeed - Pinterest-style masonry grid of generations
 */
export function GenerationsFeed({ generations: propGenerations }: GenerationsFeedProps) {
    const { generations: storeGenerations, user } = useAppStore()

    const generations = propGenerations || storeGenerations
    const isSubscribed = user?.subscription_tier !== 'free'

    if (generations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4">
                    <ImageIcon size={28} className="text-zinc-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No generations yet</h3>
                <p className="text-sm text-zinc-500 mb-6">
                    Create your first AI-generated image to see it here
                </p>
                <Link
                    href="/create"
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm hover:from-pink-400 hover:to-rose-400 transition-all shadow-lg shadow-pink-500/25 active:scale-[0.98]"
                >
                    <Sparkles size={16} />
                    Create New Image
                </Link>
            </div>
        )
    }

    return (
        <div className="columns-2 gap-3 p-4">
            {generations.map((generation) => (
                <GenerationCard
                    key={generation.id}
                    generation={generation}
                    isSubscribed={isSubscribed}
                />
            ))}
        </div>
    )
}

interface GenerationCardProps {
    generation: Generation
    isSubscribed: boolean
}

function GenerationCard({ generation, isSubscribed }: GenerationCardProps) {
    const { status, image_url, prompt } = generation

    // Pending state
    if (status === 'pending') {
        return (
            <div className="mb-3 break-inside-avoid">
                <div className="aspect-square rounded-xl bg-surface border border-zinc-800 flex flex-col items-center justify-center">
                    <Loader2 size={32} className="text-accent animate-spin mb-3" />
                    <span className="text-xs text-zinc-500 text-center px-4">
                        Generating...
                    </span>
                </div>
            </div>
        )
    }

    // Failed state
    if (status === 'failed') {
        return (
            <div className="mb-3 break-inside-avoid">
                <div className="aspect-square rounded-xl bg-surface border border-red-500/20 flex flex-col items-center justify-center">
                    <AlertCircle size={32} className="text-red-500 mb-3" />
                    <span className="text-xs text-red-400 text-center px-4">
                        Generation failed
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1">
                        Credit refunded
                    </span>
                </div>
            </div>
        )
    }

    // Completed state
    if (status === 'completed' && image_url) {
        return (
            <div className="mb-3 break-inside-avoid">
                <BlurOverlay
                    imageUrl={image_url}
                    isSubscribed={isSubscribed}
                    alt={prompt}
                    className="aspect-auto min-h-[150px]"
                />
                {isSubscribed && (
                    <p className="mt-2 text-xs text-zinc-500 line-clamp-2 px-1">
                        {prompt}
                    </p>
                )}
            </div>
        )
    }

    return null
}
