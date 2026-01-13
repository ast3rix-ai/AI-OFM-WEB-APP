'use client'

import { ChevronLeft, Filter } from 'lucide-react'
import Link from 'next/link'
import { GenerationsFeed } from '@/components'
import { useGenerationPolling } from '@/hooks/useGenerationPolling'

export default function GalleryPage() {
    // Poll for pending generations
    useGenerationPolling()

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center justify-between px-4 h-14">
                    <Link href="/" className="p-2 -ml-2 text-zinc-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-lg font-semibold">Gallery</h1>
                    <button className="p-2 -mr-2 text-zinc-400 hover:text-white">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            {/* Gallery Grid */}
            <div className="flex-1">
                <GenerationsFeed />
            </div>
        </div>
    )
}
