'use client'

import { useEffect, useRef } from 'react'
import { useAppStore, pollPendingGenerations } from '@/store/useAppStore'

/**
 * Hook to poll for pending generations every 3 seconds
 */
export function useGenerationPolling() {
    const { token, isPolling, hasPendingGenerations, setPolling } = useAppStore()
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const stopPolling = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
                setPolling(false)
            }
        }

        // Clear polling if no token (user logged out)
        if (!token) {
            stopPolling()
            return
        }

        const startPolling = () => {
            if (hasPendingGenerations() && !intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    pollPendingGenerations(token)
                }, 3000) // Poll every 3 seconds
                setPolling(true)
            }
        }

        // Start polling if there are pending generations
        if (hasPendingGenerations()) {
            startPolling()
        } else {
            stopPolling()
        }

        // Cleanup on unmount or token change
        return () => stopPolling()
    }, [token, hasPendingGenerations, setPolling])

    return { isPolling }
}

