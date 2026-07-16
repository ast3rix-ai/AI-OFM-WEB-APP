'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const navLinks = [
    { href: '/features', label: 'Features', hasDropdown: true },
    { href: '/resources', label: 'Resources', hasDropdown: true },
    { href: '/pricing', label: 'Pricing', hasDropdown: false },
    { href: '/affiliates', label: 'Affiliates', hasDropdown: false },
]

export function DesktopNav() {
    const pathname = usePathname()
    const { isAuthenticated, isAuthLoading } = useAppStore()

    return (
        <header
            className="hidden md:block"
            style={{
                height: '64px',
                backgroundColor: '#FFF7FB',
                borderBottom: '1px solid rgba(11, 11, 15, 0.08)',
            }}
        >
            <div
                style={{
                    height: '100%',
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <span
                        style={{
                            fontFamily: 'Parisienne, cursive',
                            fontSize: '28px',
                            color: '#7C3AED',
                            transition: 'opacity 0.2s',
                        }}
                    >
                        EyeCandy
                    </span>
                </Link>

                {/* Center Nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    {navLinks.map(({ href, label, hasDropdown }) => {
                        const isActive = pathname === href || pathname?.startsWith(href + '/')
                        return (
                            <Link
                                key={href}
                                href={href}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: isActive ? '#7C3AED' : '#6B7280',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                            >
                                {label}
                                {hasDropdown && <ChevronDown size={14} style={{ opacity: 0.6 }} />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {isAuthLoading ? (
                        <div
                            style={{
                                width: '96px',
                                height: '40px',
                                borderRadius: '9999px',
                                backgroundColor: 'rgba(11, 11, 15, 0.08)',
                            }}
                        />
                    ) : isAuthenticated ? (
                        <Link
                            href="/create"
                            style={{
                                padding: '10px 24px',
                                borderRadius: '9999px',
                                backgroundColor: '#7C3AED',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                        >
                            Create
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#0B0B0F',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s',
                                }}
                            >
                                Login
                            </Link>
                            <Link
                                href="/login"
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '9999px',
                                    backgroundColor: '#7C3AED',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
