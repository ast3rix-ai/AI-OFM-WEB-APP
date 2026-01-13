'use client'

import { useState, useRef } from 'react'
import { Upload, Sparkles, Loader2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const STYLE_OPTIONS = [
    { id: 'natural', label: 'Natural', emoji: '🌿' },
    { id: 'glamour', label: 'Glamour', emoji: '✨' },
    { id: 'artistic', label: 'Artistic', emoji: '🎨' },
    { id: 'vintage', label: 'Vintage', emoji: '📷' },
    { id: 'neon', label: 'Neon', emoji: '💜' },
    { id: 'minimal', label: 'Minimal', emoji: '⚪' },
    { id: 'cinematic', label: 'Cinematic', emoji: '🎬' },
    { id: 'fantasy', label: 'Fantasy', emoji: '🦋' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function ImageGenerator() {
    const { token, user, deductCredit, addGeneration } = useAppStore()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [selectedStyle, setSelectedStyle] = useState('natural')
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setError(null)
        }
    }

    const handleGenerate = async () => {
        if (!token) {
            setError('Please log in to generate images')
            return
        }

        if (!user || user.credit_balance < 1) {
            setError('Insufficient credits')
            return
        }

        setIsGenerating(true)
        setError(null)

        try {
            // Build prompt with style
            const fullPrompt = `${prompt || 'Professional influencer photo'}, ${selectedStyle} style`

            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: fullPrompt }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || 'Generation failed')
            }

            const generation = await response.json()

            // Update local state
            deductCredit()
            addGeneration(generation)

            // Reset form
            setSelectedFile(null)
            setPreviewUrl(null)
            setPrompt('')

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Generation failed')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Upload Section */}
            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-zinc-300">
                    Upload Selfie
                </label>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full aspect-square max-w-[200px] mx-auto rounded-2xl border-2 border-dashed border-zinc-700 hover:border-accent transition-colors bg-surface flex flex-col items-center justify-center overflow-hidden"
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <>
                            <Upload size={32} className="text-zinc-500 mb-2" />
                            <span className="text-sm text-zinc-500">Tap to upload</span>
                        </>
                    )}
                </button>
            </div>

            {/* Prompt Input */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-300">
                    Description (optional)
                </label>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Beach sunset, professional headshot..."
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
                />
            </div>

            {/* Style Selector - Horizontal Scroll */}
            <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-zinc-300">
                    Style
                </label>

                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4">
                    {STYLE_OPTIONS.map((style) => (
                        <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all ${selectedStyle === style.id
                                    ? 'bg-accent text-white scale-105'
                                    : 'bg-surface border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                }`}
                        >
                            <span className="text-xl">{style.emoji}</span>
                            <span className="text-xs font-medium">{style.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Generate Button */}
            <button
                onClick={handleGenerate}
                disabled={isGenerating || !user || user.credit_balance < 1}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-accent to-purple-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                {isGenerating ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles size={20} />
                        Generate ({user?.credit_balance || 0} credits)
                    </>
                )}
            </button>
        </div>
    )
}
