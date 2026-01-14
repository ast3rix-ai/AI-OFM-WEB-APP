'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Crown, Zap, LogOut, Settings, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'

export default function ProfilePage() {
    const router = useRouter()
    const { user, isAuthenticated, isAuthLoading, logout, generations } = useAppStore()

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.replace('/')
        }
    }, [isAuthLoading, isAuthenticated, router])

    // Show loading while checking auth
    if (isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="mt-4 text-sm text-zinc-500">Loading...</p>
            </div>
        )
    }

    // Show nothing while redirecting
    if (!isAuthenticated || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="mt-4 text-sm text-zinc-500">Redirecting...</p>
            </div>
        )
    }

    const completedGenerations = generations.filter(g => g.status === 'completed').length

    const handleLogout = () => {
        logout()
        router.replace('/')
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center justify-between px-4 h-14">
                    <Link href="/" className="p-2 -ml-2 text-zinc-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-lg font-semibold">Profile</h1>
                    <button className="p-2 -mr-2 text-zinc-400 hover:text-white">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* Profile Info */}
            <div className="p-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-2xl font-bold">
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">{user.email}</h2>
                        <div className="flex items-center gap-1 mt-1">
                            <Crown size={14} className={user.subscription_tier === 'free' ? 'text-zinc-500' : 'text-yellow-500'} />
                            <span className="text-sm text-zinc-400 capitalize">
                                {user.subscription_tier} Plan
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-4 rounded-xl bg-surface border border-zinc-800 text-center">
                        <p className="text-2xl font-bold text-white">{user.credit_balance}</p>
                        <p className="text-xs text-zinc-500">Credits</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-zinc-800 text-center">
                        <p className="text-2xl font-bold text-white">{completedGenerations}</p>
                        <p className="text-xs text-zinc-500">Images</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface border border-zinc-800 text-center">
                        <p className="text-2xl font-bold text-white">0</p>
                        <p className="text-xs text-zinc-500">Saved</p>
                    </div>
                </div>

                {/* Upgrade Banner */}
                {user.subscription_tier === 'free' && (
                    <div className="rounded-xl bg-gradient-to-r from-accent/20 to-purple-600/20 border border-accent/30 p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                <Crown size={20} className="text-accent" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">Upgrade to Pro</h3>
                                <p className="text-xs text-zinc-400">Unlock HD images & unlimited generations</p>
                            </div>
                        </div>
                        <Link
                            href="/pricing"
                            className="block w-full mt-4 py-3 rounded-xl bg-accent text-white font-medium text-sm text-center"
                        >
                            Upgrade Now
                        </Link>
                    </div>
                )}

                {/* Buy Credits */}
                <div className="rounded-xl bg-surface border border-zinc-800 p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap size={20} className="text-accent" />
                        <h3 className="font-semibold text-white">Buy Credits</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { credits: 10, price: '$4.99' },
                            { credits: 50, price: '$19.99' },
                            { credits: 100, price: '$34.99' },
                        ].map((pack) => (
                            <button
                                key={pack.credits}
                                className="py-3 rounded-lg bg-surface-light border border-zinc-700 hover:border-accent transition-colors"
                            >
                                <p className="text-lg font-bold text-white">{pack.credits}</p>
                                <p className="text-xs text-zinc-500">{pack.price}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </div>
    )
}
