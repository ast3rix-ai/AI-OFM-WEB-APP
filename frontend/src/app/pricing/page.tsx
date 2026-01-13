'use client'

import { useState } from 'react'
import { ChevronLeft, Zap, Crown, Shield, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Pricing Plans - High-Risk Friendly Terminology
const PLANS = [
    {
        id: 'weekly',
        name: 'Impulse Buy',
        price: '$7.99',
        period: 'week',
        badge: null,
        highlights: [
            { icon: Zap, text: 'Instant Access' },
            { icon: Sparkles, text: '500 Fast Credits' },
            { icon: Shield, text: 'Full Fidelity Mode' },
        ],
        features: [
            'Uncensored Generations',
            'High-Resolution Downloads',
            'Artistic Freedom Enabled',
            'No Watermarks',
        ],
    },
    {
        id: 'monthly',
        name: 'Pro Mode',
        price: '$29.99',
        period: 'month',
        badge: 'BEST VALUE',
        highlights: [
            { icon: Crown, text: 'Unlimited Slow Gen' },
            { icon: Zap, text: 'Priority Queue Access' },
            { icon: Shield, text: 'Full Artistic Freedom' },
        ],
        features: [
            'Everything in Weekly',
            'Unlimited Generations',
            'Priority Support',
            'Early Feature Access',
            'Exclusive Styles',
        ],
    },
]

export default function PricingPage() {
    const { token, isAuthenticated } = useAppStore()
    const [loading, setLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    /**
     * Handle subscription checkout
     * Creates checkout session and redirects to payment provider
     */
    const handleSubscribe = async (planId: string) => {
        setLoading(planId)
        setError(null)

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }

            // Add auth token if available
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${API_URL}/create-checkout-session`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ plan_id: planId }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || 'Failed to create checkout session')
            }

            const { checkout_url } = await response.json()

            // Redirect to payment provider
            window.location.href = checkout_url

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(null)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-14 z-30 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center px-4 h-12">
                    <Link href="/" className="p-2 -ml-2 text-zinc-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="flex-1 text-center text-lg font-semibold">Upgrade</h1>
                    <div className="w-10" />
                </div>
            </header>

            {/* Hero Section */}
            <section className="px-4 py-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Crown size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Unlock Pro Mode
                </h2>
                <p className="text-sm text-zinc-400">
                    Full Fidelity • Artistic Freedom • No Limits
                </p>
            </section>

            {/* Pricing Cards */}
            <section className="px-4 pb-8 space-y-4">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-2xl p-5 border transition-all ${plan.badge
                                ? 'bg-gradient-to-br from-pink-500/10 to-purple-600/10 border-pink-500/30'
                                : 'bg-zinc-900/50 border-zinc-800'
                            }`}
                    >
                        {/* Best Value Badge */}
                        {plan.badge && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-bold text-white">
                                {plan.badge}
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                                    <span className="text-sm text-zinc-500">/{plan.period}</span>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {plan.highlights.map((highlight, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/50 text-xs font-medium text-zinc-300"
                                >
                                    <highlight.icon size={14} className="text-pink-500" />
                                    {highlight.text}
                                </div>
                            ))}
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-5">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                                    <Check size={16} className="text-pink-500 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* Subscribe Button */}
                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={loading === plan.id}
                            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${plan.badge
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90'
                                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}
                        >
                            {loading === plan.id ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap size={18} />
                                    Get {plan.name}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </section>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                    {error}
                </div>
            )}

            {/* Trust Badges */}
            <section className="px-4 pb-8">
                <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
                    <div className="flex items-center gap-1">
                        <Shield size={14} />
                        <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>•</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Cancel Anytime</span>
                    </div>
                </div>
            </section>

            {/* Terms */}
            <section className="px-4 pb-8 text-center">
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                    Subscription auto-renews until cancelled.
                </p>
            </section>
        </div>
    )
}
