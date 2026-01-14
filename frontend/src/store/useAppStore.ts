/**
 * Syren Frontend - Zustand Store
 * Manages user state, credits, and generation polling
 */
import { create } from 'zustand'

// Types
export interface User {
    id: number
    email: string
    credit_balance: number
    subscription_tier: string
    is_subscribed: boolean
}

export interface Generation {
    id: number
    status: 'pending' | 'completed' | 'failed'
    image_url: string | null
    prompt: string
    created_at: string
}

interface AppState {
    // Auth
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isAuthLoading: boolean

    // Generations
    generations: Generation[]
    isPolling: boolean

    // Actions
    setUser: (user: User | null) => void
    setToken: (token: string | null) => void
    setAuthLoading: (isLoading: boolean) => void
    logout: () => void

    // Credits
    deductCredit: () => void
    addCredits: (amount: number) => void

    // Generations
    setGenerations: (generations: Generation[]) => void
    addGeneration: (generation: Generation) => void
    updateGeneration: (id: number, updates: Partial<Generation>) => void

    // Polling
    setPolling: (isPolling: boolean) => void
    hasPendingGenerations: () => boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    user: null,
    token: null,
    isAuthenticated: false,
    isAuthLoading: true, // Start true until auth check completes
    generations: [],
    isPolling: false,

    // Auth actions
    setUser: (user) => set({
        user,
        isAuthenticated: !!user
    }),

    setToken: (token) => {
        if (token) {
            localStorage.setItem('syren_token', token)
        } else {
            localStorage.removeItem('syren_token')
        }
        set({ token })
    },

    setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

    logout: () => {
        localStorage.removeItem('syren_token')
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            generations: []
        })
    },

    // Credit actions
    deductCredit: () => set((state) => ({
        user: state.user
            ? { ...state.user, credit_balance: Math.max(0, state.user.credit_balance - 1) }
            : null
    })),

    addCredits: (amount) => set((state) => ({
        user: state.user
            ? { ...state.user, credit_balance: state.user.credit_balance + amount }
            : null
    })),

    // Generation actions
    setGenerations: (generations) => set({ generations }),

    addGeneration: (generation) => set((state) => ({
        generations: [generation, ...state.generations]
    })),

    updateGeneration: (id, updates) => set((state) => ({
        generations: state.generations.map((gen) =>
            gen.id === id ? { ...gen, ...updates } : gen
        )
    })),

    // Polling
    setPolling: (isPolling) => set({ isPolling }),

    hasPendingGenerations: () => {
        return get().generations.some((gen) => gen.status === 'pending')
    },
}))

// Polling function - call this from components
export async function pollPendingGenerations(token: string) {
    const { generations, updateGeneration, setPolling, hasPendingGenerations } = useAppStore.getState()

    if (!hasPendingGenerations()) {
        setPolling(false)
        return
    }

    setPolling(true)

    try {
        const response = await fetch(`${API_URL}/generations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        if (response.ok) {
            const data = await response.json()
            const updatedGenerations: Generation[] = data.generations

            // Update any generations that have changed status
            updatedGenerations.forEach((updated) => {
                const existing = generations.find((g) => g.id === updated.id)
                if (existing && existing.status !== updated.status) {
                    updateGeneration(updated.id, {
                        status: updated.status,
                        image_url: updated.image_url,
                    })
                }
            })
        }
    } catch (error) {
        console.error('Polling error:', error)
    }
}
