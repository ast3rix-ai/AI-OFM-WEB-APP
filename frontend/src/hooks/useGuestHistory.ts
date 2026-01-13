'use client'

import { useEffect } from 'react'

const GUEST_HISTORY_KEY = 'syren_guest_generations'

/**
 * Hook to manage guest generation history in localStorage
 * Preserves generation IDs for users who generate before signing up
 */
export function useGuestHistory() {

    /**
     * Save a generation ID to guest history
     */
    const saveGuestGeneration = (generationId: number) => {
        if (typeof window === 'undefined') return

        try {
            const existing = localStorage.getItem(GUEST_HISTORY_KEY)
            const history: number[] = existing ? JSON.parse(existing) : []

            // Avoid duplicates
            if (!history.includes(generationId)) {
                history.push(generationId)
                localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(history))
            }
        } catch (error) {
            console.error('Failed to save guest generation:', error)
        }
    }

    /**
     * Get all guest generation IDs
     */
    const getGuestGenerations = (): number[] => {
        if (typeof window === 'undefined') return []

        try {
            const existing = localStorage.getItem(GUEST_HISTORY_KEY)
            return existing ? JSON.parse(existing) : []
        } catch (error) {
            console.error('Failed to get guest generations:', error)
            return []
        }
    }

    /**
     * Clear guest history (call after user signs up and claims their generations)
     */
    const clearGuestHistory = () => {
        if (typeof window === 'undefined') return
        localStorage.removeItem(GUEST_HISTORY_KEY)
    }

    /**
     * Check if there are pending guest generations to claim
     */
    const hasPendingGenerations = (): boolean => {
        return getGuestGenerations().length > 0
    }

    return {
        saveGuestGeneration,
        getGuestGenerations,
        clearGuestHistory,
        hasPendingGenerations,
    }
}

/**
 * Hook to claim guest generations after signup
 * Call this in the auth flow after successful signup/login
 */
export function useClaimGuestGenerations(
    isAuthenticated: boolean,
    claimFn?: (generationIds: number[]) => Promise<void>
) {
    const { getGuestGenerations, clearGuestHistory, hasPendingGenerations } = useGuestHistory()

    useEffect(() => {
        const claimGenerations = async () => {
            if (!isAuthenticated || !hasPendingGenerations()) return

            const generationIds = getGuestGenerations()

            if (claimFn && generationIds.length > 0) {
                try {
                    await claimFn(generationIds)
                    clearGuestHistory()
                    console.log(`Claimed ${generationIds.length} guest generations`)
                } catch (error) {
                    console.error('Failed to claim guest generations:', error)
                }
            }
        }

        claimGenerations()
    }, [isAuthenticated])
}
