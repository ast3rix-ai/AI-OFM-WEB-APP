'use client'

/**
 * ProtectedRoute - Wrapper for routes that require authentication
 * 
 * SECURITY: Enforces authentication on protected pages.
 * - Shows loading state while auth is being checked
 * - Redirects to home (landing) if user is null after auth check
 * - Only renders children if user is authenticated
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter()
    const { isAuthenticated, isAuthLoading } = useAppStore()

    useEffect(() => {
        // Only redirect after auth check is complete
        if (!isAuthLoading && !isAuthenticated) {
            router.replace('/')
        }
    }, [isAuthLoading, isAuthenticated, router])

    // Show loading state while checking auth
    if (isAuthLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="mt-4 text-sm text-zinc-500">Loading...</p>
            </div>
        )
    }

    // Not authenticated - show nothing while redirecting
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                <p className="mt-4 text-sm text-zinc-500">Redirecting...</p>
            </div>
        )
    }

    // Authenticated - render children
    return <>{children}</>
}
