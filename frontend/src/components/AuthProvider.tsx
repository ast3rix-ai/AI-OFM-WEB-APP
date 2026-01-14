'use client'

/**
 * AuthProvider - Handles authentication state initialization
 * 
 * SECURITY: This component enforces strict authentication.
 * - Checks for stored token on mount
 * - Validates token against /auth/me endpoint
 * - Sets user to null on 401 (no fallback to mock data)
 * - Provides isLoading state for proper UX
 */

import { useEffect, ReactNode } from 'react'
import { useAppStore } from '@/store/useAppStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { setUser, setToken, setAuthLoading } = useAppStore()

    useEffect(() => {
        const initializeAuth = async () => {
            setAuthLoading(true)

            // Check for stored token
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
                    console.warn('Auth token invalid or expired')
                    localStorage.removeItem('syren_token')
                    setUser(null)
                    setToken(null)
                } else {
                    // Other error - still clear auth state for safety
                    console.error('Auth check failed:', response.status)
                    setUser(null)
                    setToken(null)
                }
            } catch (error) {
                // Network error - clear auth state
                console.error('Auth initialization error:', error)
                setUser(null)
                setToken(null)
            } finally {
                setAuthLoading(false)
            }
        }

        initializeAuth()
    }, [setUser, setToken, setAuthLoading])

    return <>{children}</>
}
