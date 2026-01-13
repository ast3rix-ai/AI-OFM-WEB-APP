import type { Metadata, Viewport } from 'next'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'
import { TopBar } from '@/components/TopBar'

export const metadata: Metadata = {
    title: 'Syren - AI Image Generator',
    description: 'Create stunning AI-generated images in seconds',
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
    themeColor: '#09090b',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className="bg-[#09090b] text-zinc-200 antialiased">
                {/* 
          Mobile App Shell Container
          Forces phone-like appearance on desktop for IG ad consistency
        */}
                <div className="max-w-md mx-auto min-h-screen overflow-hidden relative bg-[#09090b] shadow-2xl shadow-black/50">
                    {/* Top Bar - Fixed glassmorphism header */}
                    <TopBar />

                    {/* Main Content Area */}
                    <main className="pt-14 pb-20 min-h-screen">
                        {children}
                    </main>

                    {/* Bottom Navigation - Fixed at viewport bottom */}
                    <BottomNav />
                </div>
            </body>
        </html>
    )
}
