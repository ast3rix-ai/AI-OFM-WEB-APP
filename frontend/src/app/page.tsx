'use client'

import { useEffect } from 'react'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { GenerationsFeed } from '@/components'
import { useGenerationPolling } from '@/hooks/useGenerationPolling'

export default function HomePage() {
    const { user, generations, isAuthenticated, setUser } = useAppStore()

    // Poll for pending generations
    useGenerationPolling()

    // Mock user for demo (remove in production)
    useEffect(() => {
        if (!user) {
            setUser({
                id: 1,
                email: 'demo@syren.ai',
                credit_balance: 10,
                subscription_tier: 'free',
                is_subscribed: false,
            })
        }
    }, [user, setUser])

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center justify-between px-4 h-14">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
                        Syren
                    </h1>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-zinc-800">
                        <Zap size={14} className="text-accent" />
                        <span className="text-sm font-medium">{user?.credit_balance || 0}</span>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="px-4 py-6">
                <div className="rounded-2xl bg-gradient-to-br from-accent/20 to-purple-600/20 border border-accent/20 p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={18} className="text-accent" />
                        <span className="text-xs font-medium text-accent">AI POWERED</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Create Your AI Influencer
                    </h2>
                    <p className="text-sm text-zinc-400 mb-4">
                        Generate stunning, unique images in seconds with our advanced AI.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-light transition-colors"
                    >
                        <Sparkles size={16} />
                        Start Creating
                    </Link>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="px-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-surface border border-zinc-800">
                        <TrendingUp size={20} className="text-green-500 mb-2" />
                        <p className="text-2xl font-bold text-white">{generations.length}</p>
                        <p className="text-xs text-zinc-500">Total Generations</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-zinc-800">
                        <Zap size={20} className="text-accent mb-2" />
                        <p className="text-2xl font-bold text-white">{user?.credit_balance || 0}</p>
                        <p className="text-xs text-zinc-500">Credits Available</p>
                    </div>
                </div>
            </section>

            {/* Recent Generations */}
            <section className="flex-1 mt-4">
                <div className="flex items-center justify-between px-4 mb-3">
                    <h3 className="text-lg font-semibold text-white">Recent</h3>
                    <Link href="/gallery" className="text-sm text-accent">
                        View all
                    </Link>
                </div>

                <GenerationsFeed generations={generations.slice(0, 4)} />
            </section>
        </div>
    )
}
