'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/gallery', label: 'Gallery' },
]

export function DesktopNav() {
    const pathname = usePathname()
    const { isAuthenticated, isAuthLoading } = useAppStore()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 hidden md:block">
            {/* Glassmorphism background */}
            <div className="backdrop-blur-md bg-black/50 border-b border-white/10">
                {/* Inner container with consistent gutter padding */}
                <div className="h-20 px-8 lg:px-16 xl:px-24 flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group"
                    >
                        <span className="text-2xl font-serif tracking-wide text-white group-hover:text-pink-400 transition-colors">
                            SYREN
                        </span>
                    </Link>

                    {/* Center Navigation */}
                    <nav className="flex items-center gap-8">
                        {navLinks.map(({ href, label }) => {
                            const isActive = pathname === href
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`text-sm tracking-wide transition-colors ${isActive
                                            ? 'text-white'
                                            : 'text-white/60 hover:text-white'
                                        }`}
                                >
                                    {label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {isAuthLoading ? (
                            <div className="w-24 h-10 rounded-full bg-white/10 animate-pulse" />
                        ) : isAuthenticated ? (
                            <Link
                                href="/create"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium hover:from-pink-400 hover:to-rose-400 transition-all shadow-lg shadow-pink-500/25"
                            >
                                <Sparkles size={16} />
                                Create
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium hover:from-pink-400 hover:to-rose-400 transition-all shadow-lg shadow-pink-500/25"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
