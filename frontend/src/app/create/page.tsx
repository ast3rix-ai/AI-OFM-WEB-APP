'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ImageGenerator, ProtectedRoute } from '@/components'
import { useAppStore } from '@/store/useAppStore'

export default function CreatePage() {
    const { user } = useAppStore()

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-white/5">
                    <div className="flex items-center px-4 h-14">
                        <Link href="/" className="p-2 -ml-2 text-zinc-400 hover:text-white">
                            <ChevronLeft size={24} />
                        </Link>
                        <h1 className="flex-1 text-center text-lg font-semibold">Create</h1>
                        <div className="w-10" /> {/* Spacer for centering */}
                    </div>
                </header>

                {/* Credits Bar */}
                <div className="px-4 py-3 bg-surface border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">Available Credits</span>
                        <span className="text-sm font-semibold text-accent">
                            {user?.credit_balance || 0} credits
                        </span>
                    </div>
                </div>

                {/* Generator */}
                <div className="flex-1 py-4">
                    <ImageGenerator />
                </div>
            </div>
        </ProtectedRoute>
    )
}
