import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DesktopNav } from '@/components/DesktopNav'
import { TopBanner } from '@/components/TopBanner'
import { MobileNav } from '@/components/MobileNav'
import { AuthProvider } from '@/components/AuthProvider'
import { Creditsbage } from '@/components/CreditsBadge'

// Typography - EyeCandy Style
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
    weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
    title: 'EyeCandy - AI Influencer Studio',
    description: 'Create AI Influencers. Animate from 1 photo. Face → Motion → Reel.',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'EyeCandy',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
    themeColor: '#FFF7FB',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                {/* Parisienne for script/swash font */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Parisienne&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                className="min-h-screen antialiased"
                style={{
                    backgroundColor: '#FFF7FB',
                    color: '#0B0B0F',
                    fontFamily: 'var(--font-sans)',
                }}
                suppressHydrationWarning
            >
                <AuthProvider>
                    {/* Fixed Header Stack */}
                    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
                        <TopBanner />
                        <DesktopNav />
                    </div>

                    {/* Main Content */}
                    {/* TopBanner ~28px + DesktopNav ~64px = ~92px */}
                    <main className="min-h-screen pt-[92px] md:pt-[92px] pb-20 md:pb-0">
                        {children}
                    </main>

                    {/* Credits Badge */}
                    <Creditsbage />

                    {/* Mobile Bottom Navigation */}
                    <div className="block md:hidden">
                        <MobileNav />
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
