'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

// EyeCandy color constants
const COLORS = {
    bg: '#FFF7FB',
    text: '#0B0B0F',
    primary: '#7C3AED',
    accent: '#FF4D8D',
    secondary: '#06B6D4',
    card: '#FFFFFF',
    border: 'rgba(11, 11, 15, 0.08)',
    muted: '#6B7280',
}

// Influencer data
const influencers = [
    { name: 'Bella Rose', followers: '9.2M', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
    { name: 'Luna Martinez', followers: '4.7M', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
    { name: 'Sophia Chen', followers: '8.1M', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' },
    { name: 'Aria Woods', followers: '3.5M', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face' },
    { name: 'Mia Johnson', followers: '6.8M', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face' },
]

function InfluencerCard({ influencer }: { influencer: typeof influencers[0] }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '9999px',
                padding: '8px 12px',
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                flexShrink: 0,
            }}
        >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image src={influencer.avatar} alt={influencer.name} width={32} height={32} style={{ objectFit: 'cover' }} unoptimized />
            </div>
            <div style={{ fontSize: '12px' }}>
                <p style={{ fontWeight: 600, color: COLORS.text, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {influencer.name}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill={COLORS.accent} />
                        <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </p>
                <p style={{ fontWeight: 500, color: COLORS.primary }}>{influencer.followers}</p>
            </div>
        </div>
    )
}

export default function HomePage() {
    const { isAuthenticated, isAuthLoading } = useAppStore()

    return (
        <div style={{ minHeight: '100vh', backgroundColor: COLORS.bg }}>
            {/* Hero Section */}
            <section style={{ position: 'relative', minHeight: 'calc(100vh - 92px)', overflow: 'hidden' }}>
                {/* Decorative dots */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute',
                        top: '80px',
                        left: '10%',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: COLORS.accent,
                        opacity: 0.4,
                    }}
                />
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    style={{
                        position: 'absolute',
                        top: '160px',
                        right: '15%',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: COLORS.secondary,
                        opacity: 0.5,
                    }}
                />

                {/* Main Grid */}
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: '48px 24px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: '32px',
                        alignItems: 'center',
                        minHeight: 'calc(100vh - 92px)',
                    }}
                >
                    {/* Left Column - Headline */}
                    <div style={{ gridColumn: 'span 5' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 style={{ lineHeight: 0.9, letterSpacing: '-0.02em' }}>
                                {/* Line 1: EYE */}
                                <span style={{ display: 'block' }}>
                                    {/* Swash E - outlined */}
                                    <span
                                        style={{
                                            fontFamily: 'Parisienne, cursive',
                                            fontSize: 'clamp(80px, 10vw, 140px)',
                                            lineHeight: 0.8,
                                            WebkitTextStroke: '2px #7C3AED',
                                            WebkitTextFillColor: 'transparent',
                                            display: 'inline-block',
                                            marginRight: '-8px',
                                        }}
                                    >
                                        E
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 900,
                                            fontSize: 'clamp(48px, 6vw, 96px)',
                                            color: COLORS.text,
                                        }}
                                    >
                                        YE
                                    </span>
                                </span>
                                {/* Line 2: CANDY */}
                                <span
                                    style={{
                                        display: 'block',
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 900,
                                        fontSize: 'clamp(48px, 6vw, 96px)',
                                        color: COLORS.text,
                                    }}
                                >
                                    CANDY
                                </span>
                                {/* Line 3: STUDIO */}
                                <span
                                    style={{
                                        display: 'block',
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 900,
                                        fontSize: 'clamp(48px, 6vw, 96px)',
                                        color: COLORS.text,
                                    }}
                                >
                                    STUDIO
                                </span>
                            </h1>
                        </motion.div>
                    </div>

                    {/* Center Column - Video Card */}
                    <div style={{ gridColumn: 'span 4', display: 'flex', justifyContent: 'center' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            style={{ position: 'relative', width: '100%', maxWidth: '320px', aspectRatio: '9/16' }}
                        >
                            {/* Video Container */}
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    backgroundColor: COLORS.card,
                                    border: `1px solid ${COLORS.border}`,
                                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.15)',
                                }}
                            >
                                <video
                                    src="/videos/hero.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Decorative elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    position: 'absolute',
                                    top: '-16px',
                                    left: '-16px',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: COLORS.accent,
                                    opacity: 0.6,
                                }}
                            />
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '-24px',
                                    right: '-24px',
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '50%',
                                    backgroundColor: COLORS.secondary,
                                    opacity: 0.4,
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Right Column - CTA + Social Proof */}
                    <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            {/* Copy */}
                            <div>
                                <p style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.4, color: COLORS.text }}>
                                    Create AI Influencers.
                                    <br />
                                    Animate from 1 photo.
                                </p>
                                <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: 500, color: COLORS.muted }}>
                                    Face → Motion → Reel
                                </p>
                            </div>

                            {/* CTA */}
                            {isAuthLoading ? (
                                <div style={{ width: '192px', height: '56px', borderRadius: '9999px', backgroundColor: COLORS.border }} />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <Link
                                        href={isAuthenticated ? '/create' : '/login'}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '16px 32px',
                                            backgroundColor: COLORS.primary,
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            borderRadius: '9999px',
                                            textDecoration: 'none',
                                            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                        }}
                                    >
                                        Get Started
                                        <ArrowRight size={18} />
                                    </Link>
                                    <p style={{ fontSize: '12px', fontWeight: 500, color: COLORS.muted }}>
                                        ✨ Trusted by 100k+ creators
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        {/* Social Proof - Rolling Influencer Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                position: 'relative',
                                height: '140px',
                                overflow: 'hidden',
                                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                            }}
                        >
                            <div className="roll-animation" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {influencers.map((inf, i) => <InfluencerCard key={`a-${i}`} influencer={inf} />)}
                                {influencers.map((inf, i) => <InfluencerCard key={`b-${i}`} influencer={inf} />)}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 24px', backgroundColor: COLORS.card }}>
                <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{ textAlign: 'center', marginBottom: '64px' }}
                    >
                        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, color: COLORS.text, marginBottom: '16px' }}>
                            Why Creators Choose{' '}
                            <span style={{ color: COLORS.primary }}>EyeCandy</span>
                        </h2>
                        <p style={{ fontSize: '18px', color: COLORS.muted, maxWidth: '640px', margin: '0 auto' }}>
                            The fastest way to create viral AI content
                        </p>
                    </motion.div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {[
                            { title: 'One Photo Magic', description: 'Transform any photo into a consistent AI influencer', icon: '📸' },
                            { title: 'Instant Reels', description: 'Generate TikTok-ready videos in under 30 seconds', icon: '🎬' },
                            { title: 'Viral Templates', description: 'Recreate trending content with one click', icon: '🔥' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                style={{
                                    padding: '32px',
                                    borderRadius: '18px',
                                    backgroundColor: COLORS.bg,
                                    border: `1px solid ${COLORS.border}`,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                            >
                                <span style={{ fontSize: '40px', display: 'block', marginBottom: '24px' }}>{feature.icon}</span>
                                <h3 style={{ fontWeight: 700, fontSize: '20px', color: COLORS.text, marginBottom: '12px' }}>{feature.title}</h3>
                                <p style={{ color: COLORS.muted }}>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    {!isAuthenticated && !isAuthLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{ marginTop: '80px', textAlign: 'center' }}
                        >
                            <Link
                                href="/login"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '20px 40px',
                                    backgroundColor: COLORS.accent,
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    borderRadius: '9999px',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 14px rgba(255, 77, 141, 0.35)',
                                }}
                            >
                                Start Creating Free
                                <ArrowRight size={18} />
                            </Link>
                            <p style={{ marginTop: '16px', color: COLORS.muted }}>
                                100 free credits • No credit card required
                            </p>
                        </motion.div>
                    )}
                </div>
            </section>
        </div>
    )
}
