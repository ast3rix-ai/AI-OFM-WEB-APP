'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LoginPage() {
    const router = useRouter()
    const { setUser, setToken } = useAppStore()

    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (isLogin) {
                // Login flow
                const formData = new FormData()
                formData.append('username', email)
                formData.append('password', password)

                const loginRes = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    body: formData,
                })

                if (!loginRes.ok) {
                    const data = await loginRes.json()
                    throw new Error(data.detail || 'Login failed')
                }

                const { access_token } = await loginRes.json()
                setToken(access_token)

                // Fetch user profile
                const userRes = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                })

                if (userRes.ok) {
                    const userData = await userRes.json()
                    setUser(userData)
                    router.replace('/')
                }
            } else {
                // Signup flow
                const signupRes = await fetch(`${API_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                })

                if (!signupRes.ok) {
                    const data = await signupRes.json()
                    throw new Error(data.detail || 'Signup failed')
                }

                // Auto-login after signup
                const formData = new FormData()
                formData.append('username', email)
                formData.append('password', password)

                const loginRes = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    body: formData,
                })

                if (loginRes.ok) {
                    const { access_token } = await loginRes.json()
                    setToken(access_token)

                    const userRes = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                        },
                    })

                    if (userRes.ok) {
                        const userData = await userRes.json()
                        setUser(userData)
                        router.replace('/')
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-white/5">
                <div className="flex items-center px-4 h-14">
                    <Link href="/" className="p-2 -ml-2 text-zinc-400 hover:text-white">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="flex-1 text-center text-lg font-semibold">
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </h1>
                    <div className="w-10" />
                </div>
            </header>

            {/* Form */}
            <div className="flex-1 p-6">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {isLogin
                            ? 'Sign in to continue creating'
                            : 'Create an account and get 10 free credits'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full pl-11 pr-12 py-3 rounded-xl bg-surface border border-zinc-800 text-white placeholder:text-zinc-600 focus:border-accent focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isLogin ? 'Signing in...' : 'Creating account...'}
                            </>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                {/* Toggle */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError('')
                        }}
                        className="text-sm text-zinc-400 hover:text-white"
                    >
                        {isLogin ? (
                            <>Don&apos;t have an account? <span className="text-accent">Sign up</span></>
                        ) : (
                            <>Already have an account? <span className="text-accent">Sign in</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
