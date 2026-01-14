'use client'

import { Zap, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'

export function TopBar() {
    const { user, isAuthenticated, isAuthLoading } = useAppStore()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 safe-top">
            {/* Glassmorphism background */}
            <div className="glass border-b border-white/5">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between h-14 px-4">
                        {/* Left spacer for balance */}
                        <div className="w-16" />

                        {/* Center Logo */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                                Syren
                            </span>
                        </div>

                        {/* Right - Credit Counter or Sign In */}
                        {isAuthLoading ? (
                            <div className="w-16 h-8 rounded-full bg-zinc-800/50 animate-pulse" />
                        ) : isAuthenticated ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
                                <Zap size={14} className="text-pink-500" />
                                <span className="text-sm font-semibold text-zinc-200">
                                    {user?.credit_balance ?? 0}
                                </span>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500 text-white text-sm font-medium hover:bg-pink-400 transition-colors"
                            >
                                <LogIn size={14} />
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
