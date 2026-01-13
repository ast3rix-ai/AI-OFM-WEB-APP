'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, LayoutGrid, Crown, User } from 'lucide-react'

const navItems = [
    { href: '/', icon: Sparkles, label: 'Create' },
    { href: '/gallery', icon: LayoutGrid, label: 'Gallery' },
    { href: '/pricing', icon: Crown, label: 'Upgrade' },
    { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
            {/* Glass background */}
            <div className="glass border-t border-white/5">
                <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-around h-16 px-2">
                        {navItems.map(({ href, icon: Icon, label }) => {
                            const isActive = pathname === href

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-all duration-200 ${isActive
                                            ? 'nav-active'
                                            : 'text-zinc-500 hover:text-zinc-300 active:scale-95'
                                        }`}
                                >
                                    <Icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className={`text-[10px] mt-1 font-medium tracking-wide ${isActive ? 'text-pink-500' : ''
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
