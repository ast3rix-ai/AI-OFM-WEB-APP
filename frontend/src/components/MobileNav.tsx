'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Image, CreditCard, User } from 'lucide-react'

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/gallery', label: 'Gallery', icon: Image },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
    { href: '/profile', label: 'Profile', icon: User },
]

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
            style={{
                backgroundColor: '#FFF7FB',
                borderTop: '1px solid rgba(11, 11, 15, 0.08)',
            }}
        >
            <div className="flex items-center justify-around h-16 px-4">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-col items-center gap-1 py-2 px-4 transition-colors"
                            style={{ color: isActive ? '#7C3AED' : '#6B7280' }}
                        >
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium uppercase tracking-wide">
                                {label}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
