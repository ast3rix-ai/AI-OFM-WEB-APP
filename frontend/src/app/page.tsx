'use client'

import { Sparkles, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppStore } from '@/store/useAppStore'
import { TextCarousel } from '@/components/TextCarousel'

export default function HomePage() {
    const { isAuthenticated, isAuthLoading } = useAppStore()

    return (
        <div className="flex flex-col">
            {/* Text Carousel Announcement Bar */}
            <TextCarousel />

            {/* Hero Section - Split on Desktop, Full on Mobile */}
            <section className="relative min-h-[calc(100vh-2rem)] md:h-[calc(100vh-2rem)] flex flex-col md:flex-row">
                {/* Mobile: Background Image */}
                <div className="absolute inset-0 z-0 md:hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1618721405821-80ebc4b63d26?q=80&w=2000&auto=format&fit=crop"
                        alt="Fashion model"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                </div>

                {/* Left Column - Content */}
                <div className="relative z-10 flex-1 flex flex-col h-full pt-8 md:pt-32 pb-8 md:pb-12 px-6 md:px-8 lg:px-16 xl:px-24">
                    {/* Mobile Brand Mark */}
                    <div className="flex items-center justify-between md:hidden mb-8">
                        <span className="text-xl font-serif tracking-wider text-white">
                            SYREN
                        </span>
                        {!isAuthLoading && !isAuthenticated && (
                            <Link
                                href="/login"
                                className="text-sm text-white/80 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Main Content Block */}
                    <div className="flex-1 flex flex-col justify-center items-start gap-8">
                        {/* Tagline */}
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] text-white/70 md:text-pink-500 uppercase">
                                <Sparkles size={12} className="text-rose-500" />
                                AI-Powered Creation
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1
                            className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-none tracking-tight animate-fade-in-up"
                            style={{ animationDelay: '0.2s' }}
                        >
                            YOUR<br />
                            <span className="italic text-pink-400">AI</span> CONTENT<br />
                            STUDIO
                        </h1>

                        {/* Subheadline */}
                        <p
                            className="text-lg text-zinc-400 max-w-md leading-relaxed animate-fade-in-up"
                            style={{ animationDelay: '0.3s' }}
                        >
                            Generate stunning, editorial-quality images in seconds. No experience required.
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                            style={{ animationDelay: '0.4s' }}
                        >
                            {isAuthenticated ? (
                                <Link
                                    href="/create"
                                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-all active:scale-[0.98]"
                                >
                                    <Sparkles size={16} />
                                    Start Creating
                                    <ArrowRight size={16} />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm hover:from-pink-400 hover:to-rose-400 transition-all active:scale-[0.98] shadow-lg shadow-pink-500/25"
                                    >
                                        Get Started Free
                                        <ArrowRight size={16} />
                                    </Link>
                                    <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-all">
                                        <Play size={14} fill="white" />
                                        Watch Demo
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Social Proof Footer - Pinned to bottom with mt-auto */}
                    <div
                        className="mt-auto flex items-center gap-3 animate-fade-in-up"
                        style={{ animationDelay: '0.5s' }}
                    >
                        {/* Avatar Stack */}
                        <div className="flex -space-x-2">
                            {[
                                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
                                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
                            ].map((src, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-black overflow-hidden"
                                >
                                    <Image
                                        src={src}
                                        alt={`Creator ${i + 1}`}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-zinc-500">
                            Trusted by <span className="text-white font-medium">100k+</span> creators
                        </span>
                    </div>
                </div>

                {/* Right Column - Hero Image (Desktop Only) */}
                <div className="hidden md:block relative flex-1 h-full">
                    <Image
                        src="https://images.unsplash.com/photo-1618721405821-80ebc4b63d26?q=80&w=2000&auto=format&fit=crop"
                        alt="Fashion model"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                    {/* Subtle gradient overlay for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-[#0a0a0a] px-6 md:px-8 lg:px-16 xl:px-24 py-16 md:py-24">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-serif text-3xl md:text-5xl text-white mb-12 text-center">
                        Why <span className="italic text-pink-400">Creators</span> Choose Us
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Editorial Quality',
                                description: 'AI-generated images that rival professional photography',
                                icon: '✨',
                            },
                            {
                                title: 'Lightning Fast',
                                description: 'Generate stunning content in under 30 seconds',
                                icon: '⚡',
                            },
                            {
                                title: 'Multiple Styles',
                                description: 'From haute couture to streetwear aesthetics',
                                icon: '🎨',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-pink-500/30 transition-colors"
                            >
                                <span className="text-3xl mb-4 block">{feature.icon}</span>
                                <h3 className="font-medium text-xl text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-white/50">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    {!isAuthenticated && !isAuthLoading && (
                        <div className="mt-16 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:from-pink-400 hover:to-rose-400 transition-all shadow-lg shadow-pink-500/25"
                            >
                                Start Your Free Trial
                                <ArrowRight size={18} />
                            </Link>
                            <p className="text-sm text-white/40 mt-4">
                                10 free credits • No credit card required
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
