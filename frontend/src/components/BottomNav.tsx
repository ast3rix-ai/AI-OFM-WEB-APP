'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutGrid, Crown, User } from 'lucide-react'

const navItems = [
    { href: '/', icon: Sparkles, label: 'Create' },
    { href: '/gallery', icon: LayoutGrid, label: 'Gallery' },
    { href: '/pricing', icon: Crown, label: 'Pro' },
    { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
            {/* Glassmorphism background - floating over hero */}
            <div className="max-w-md mx-auto px-4 pb-2">
                <div className="backdrop-blur-xl bg-black/70 border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
                    <div className="flex items-center justify-around h-16 px-2">
                        {navItems.map(({ href, icon: Icon, label }) => {
                            const isActive = pathname === href

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all duration-200 ${isActive
                                            ? 'text-white'
                                            : 'text-white/40 hover:text-white/70 active:scale-95'
                                        }`}
                                >
                                    <div className={`relative ${isActive ? '' : ''}`}>
                                        <Icon
                                            size={22}
                                            strokeWidth={isActive ? 2.5 : 1.5}
                                        />
                                        {isActive && (
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] mt-1.5 font-medium tracking-wide ${isActive ? 'text-white' : ''
                                        }`}>
                                        {label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
