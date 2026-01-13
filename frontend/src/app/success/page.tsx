'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const { token, user, setUser } = useAppStore()

    const [processing, setProcessing] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const isMockPayment = searchParams.get('mock_payment') === 'true'
    const planId = searchParams.get('plan')
    const userId = searchParams.get('user_id')

    useEffect(() => {
        const processPayment = async () => {
            if (!isMockPayment) {
                // Real payment - wait for webhook confirmation
                setProcessing(false)
                return
            }

            // Mock payment - simulate webhook by calling it directly
            try {
                const response = await fetch(
                    `${API_URL}/webhooks/ccbill?token=MY_SECRET`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            custom_field_user_id: parseInt(userId || '0'),
                            subscription_id: `mock-${Date.now()}`,
                        }),
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to process payment')
                }

                // Refresh user data
                if (token) {
                    const userResponse = await fetch(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })

                    if (userResponse.ok) {
                        const userData = await userResponse.json()
                        setUser(userData)
                    }
                }

                setProcessing(false)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Payment processing failed')
                setProcessing(false)
            }
        }

        // Small delay for UX
        setTimeout(processPayment, 1500)
    }, [isMockPayment, userId, token, setUser])

    if (processing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="w-16 h-16 mb-6">
                    <div className="w-full h-full border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Processing Payment</h2>
                <p className="text-sm text-zinc-400 text-center">
                    Please wait while we confirm your subscription...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                    <span className="text-3xl">😕</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Something Went Wrong</h2>
                <p className="text-sm text-zinc-400 text-center mb-6">{error}</p>
                <Link
                    href="/pricing"
                    className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-medium text-sm"
                >
                    Try Again
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            {/* Success Animation */}
            <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center animate-bounce">
                <Check size={40} className="text-white" strokeWidth={3} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">You're All Set! 🎉</h2>
            <p className="text-sm text-zinc-400 text-center mb-2">
                Welcome to Pro Mode
            </p>

            {/* Credits Display */}
            <div className="my-6 px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <p className="text-sm text-zinc-400 mb-1">Your new balance</p>
                <p className="text-3xl font-bold text-white">
                    {user?.credit_balance ?? 500} <span className="text-lg text-pink-500">credits</span>
                </p>
            </div>

            {/* Features Unlocked */}
            <div className="w-full max-w-xs space-y-3 mb-8">
                {[
                    'Uncensored Generations',
                    'Full Fidelity Mode',
                    'Artistic Freedom Enabled',
                    'Priority Queue Access',
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                        <Sparkles size={16} className="text-pink-500" />
                        {feature}
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Link
                href="/"
                className="w-full max-w-xs py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-center flex items-center justify-center gap-2"
            >
                Start Creating
                <ArrowRight size={18} />
            </Link>
        </div>
    )
}
