import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // EyeCandy Brand Colors
                'ec-bg': '#FFF7FB',
                'ec-text': '#0B0B0F',
                'ec-primary': '#7C3AED',
                'ec-primary-hover': '#6D28D9',
                'ec-accent': '#FF4D8D',
                'ec-secondary': '#06B6D4',
                'ec-card': '#FFFFFF',
                'ec-border': 'rgba(11, 11, 15, 0.08)',
                'ec-muted': '#6B7280',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                script: ['Parisienne', 'cursive'],
            },
            borderRadius: {
                'ec-sm': '8px',
                'ec-md': '14px',
                'ec-lg': '18px',
                'ec-xl': '24px',
            },
            boxShadow: {
                'ec-sm': '0 1px 2px rgba(11, 11, 15, 0.05)',
                'ec-md': '0 4px 12px rgba(11, 11, 15, 0.08)',
                'ec-lg': '0 8px 24px rgba(11, 11, 15, 0.12)',
                'glow-pink': '0 0 20px rgba(255, 77, 141, 0.3)',
                'glow-violet': '0 0 20px rgba(124, 58, 237, 0.3)',
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'roll-up': 'rollUp 15s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
                rollUp: {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-50%)' },
                },
            },
        },
    },
    plugins: [],
}

export default config
