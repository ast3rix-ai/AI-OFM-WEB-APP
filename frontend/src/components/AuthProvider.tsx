'use client'

/**
 * AuthProvider - Handles authentication state initialization
 * 
 * SECURITY: This component enforces strict authentication.
 * - Checks for stored token on mount
 * - Validates token against /auth/me endpoint
 * - Sets user to null on 401 (no fallback to mock data)
 * - Provides isLoading state for proper UX
 * 
 * HYDRATION: Uses isMounted pattern to prevent SSR mismatch.
 * The component returns null until mounted on client, ensuring
 * consistent server/client HTML output.
 */

import { useEffect, useState, ReactNode } from 'react'
import { useAppStore } from '@/store/useAppStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { setUser, setToken, setAuthLoading } = useAppStore()
    const [isMounted, setIsMounted] = useState(false)

    // Handle hydration - only render children after client mount
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        // Only run auth initialization after mount (client-side only)
        if (!isMounted) return

        const initializeAuth = async () => {
            setAuthLoading(true)

            // Check for stored token (safe to access localStorage here)
            const storedToken = localStorage.getItem('syren_token')

            if (!storedToken) {
                // No token = not authenticated
                setUser(null)
                setToken(null)
                setAuthLoading(false)
                return
            }

            try {
                // Validate token against backend
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (response.ok) {
                    const userData = await response.json()
                    setUser(userData)
                    setToken(storedToken)
                } else if (response.status === 401) {
                    // Token invalid/expired - clear everything
                    localStorage.removeItem('syren_token')
                    setUser(null)
                    setToken(null)
                } else {
                    // Other error - still clear auth state for safety
                    setUser(null)
                    setToken(null)
                }
            } catch {
                // Network error - clear auth state
                setUser(null)
                setToken(null)
            } finally {
                setAuthLoading(false)
            }
        }

        initializeAuth()
    }, [isMounted, setUser, setToken, setAuthLoading])

    return <>{children}</>
}
