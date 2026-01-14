import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'
import { DesktopNav } from '@/components/DesktopNav'
import { AuthProvider } from '@/components/AuthProvider'

// Typography - High-end fashion editorial
const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-serif',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Syren - AI Content Studio',
    description: 'Create stunning AI-generated content for the modern creator',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Syren',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
    themeColor: '#0a0a0a',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`dark ${playfair.variable} ${inter.variable}`}>
            <body className="min-h-screen bg-black text-white antialiased font-sans selection:bg-pink-500 selection:text-white">
                <AuthProvider>
                    {/* Desktop Navigation - Hidden on mobile */}
                    <DesktopNav />

                    {/* Main Content Area */}
                    {/* Mobile: no top padding (immersive) */}
                    {/* Desktop: top padding for fixed nav */}
                    <main className="min-h-screen md:pt-20 pb-20 md:pb-0">
                        {children}
                    </main>

                    {/* Mobile Bottom Navigation - Hidden on desktop */}
                    <div className="block md:hidden">
                        <BottomNav />
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
