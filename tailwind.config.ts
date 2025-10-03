import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Celestial Color Palette
        'celestial-deep-space': '#0a0b1e',
        'celestial-midnight': '#1a1b3a',
        'celestial-cosmic-blue': '#2d3561',
        'celestial-nebula-purple': '#4a4e7c',
        'celestial-stardust': '#6b73a1',
        'celestial-moonlight': '#a8b2d1',
        'celestial-silver': '#c7d2e7',
        'celestial-pearl': '#e8edf7',
        'celestial-rose-gold': '#d4a574',
        'celestial-cosmic-pink': '#c49bb0',
        'celestial-aurora-green': '#7ba098',
        'celestial-golden-star': '#f4e4a6',
        
        // Original Wedding Colors (preserved for compatibility)
        'blush-pink': '#F8E8E8',
        'sage-green': '#A8B5A0',
        'cream': '#FFF8F0',
        'soft-gray': '#F5F5F5',
        'charcoal': '#2D2D2D',
        'gold-accent': '#D4AF37',
        'rose-gold': '#E8B4B8',
        'dusty-rose': '#D4A5A5',
        'sage-light': '#C8D5C0',
        'cream-dark': '#F5F0E8',
        
        // Enhanced Romantic Colors
        'romantic-rose': '#F4C2C2',
        'deep-rose': '#E91E63',
        'soft-lavender': '#E8D5FF',
        'warm-peach': '#FFE0B2',
        'champagne': '#F7E7CE',
        'pearl-white': '#FEFEFE',
        'romantic-purple': '#9C27B0',
        'sunset-orange': '#FF8A65',
        'mint-green': '#B2DFDB',
        
        // New Romantic Pastel Palette
        'romantic-blush': '#F8E8E8',
        'romantic-blush-light': '#FDF2F2',
        'romantic-blush-dark': '#F0D0D0',
        'romantic-cream': '#FFF8F0',
        'romantic-cream-light': '#FFFCF7',
        'romantic-cream-dark': '#F5F0E8',
        'romantic-lavender': '#E8E0F5',
        'romantic-lavender-light': '#F2ECFA',
        'romantic-lavender-dark': '#D8C8E8',
        'romantic-gold': '#F4E4A6',
        'romantic-gold-light': '#F9F0C4',
        'romantic-gold-dark': '#E8D088',
        'romantic-rose-light': '#F9D7D7',
        'romantic-rose-dark': '#E8A8A8',
        'romantic-sage': '#D4E4D0',
        'romantic-sage-light': '#E2F0DE',
        'romantic-sage-dark': '#C0D4BC',
        'romantic-pearl': '#FEFEFE',
        'romantic-charcoal': '#4A4A4A',
        'romantic-charcoal-light': '#6A6A6A',
      },
      backgroundImage: {
        'celestial-gradient-1': 'linear-gradient(135deg, #0a0b1e 0%, #2d3561 50%, #4a4e7c 100%)',
        'celestial-gradient-2': 'linear-gradient(135deg, #4a4e7c 0%, #6b73a1 50%, #a8b2d1 100%)',
        'celestial-gradient-3': 'linear-gradient(135deg, #c49bb0 0%, #d4a574 50%, #f4e4a6 100%)',
        'celestial-gradient-4': 'linear-gradient(45deg, #0a0b1e, #2d3561, #4a4e7c, #6b73a1)',
        'celestial-gradient-5': 'linear-gradient(180deg, rgba(10, 11, 30, 0.9) 0%, rgba(45, 53, 97, 0.7) 50%, rgba(74, 78, 124, 0.5) 100%)',
        'romantic-gradient-1': 'linear-gradient(135deg, #F4C2C2 0%, #E8D5FF 100%)',
        'romantic-gradient-2': 'linear-gradient(135deg, #FFE0B2 0%, #F7E7CE 100%)',
        'romantic-gradient-3': 'linear-gradient(135deg, #B2DFDB 0%, #A8B5A0 100%)',
        'romantic-gradient-4': 'linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #A8B5A0 100%)',
        'romantic-gradient-5': 'linear-gradient(45deg, #F4C2C2, #E8D5FF, #FFE0B2, #B2DFDB)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        script: ['var(--font-dancing)', 'Dancing Script', 'cursive'],
      },
      animation: {
        'celestial-shimmer': 'celestialShimmer 4s ease-in-out infinite',
        'twinkle-stars': 'twinkleStars 20s linear infinite',
        'float-constellation': 'floatConstellation 8s ease-in-out infinite',
        'pulse-orb': 'pulseOrb 3s ease-in-out infinite',
        'shooting-star': 'shootingStar 3s linear infinite',
        'ethereal-float': 'etherealFloat 6s ease-in-out infinite',
        'cosmic-glow': 'cosmicGlow 4s ease-in-out infinite alternate',
        'romantic-pulse': 'romanticPulse 2s ease-in-out infinite',
        'heart-beat': 'heartBeat 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'romantic-glow': 'romanticGlow 3s ease-in-out infinite alternate',
        'floating-hearts': 'floatingHearts 4s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        celestialShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        twinkleStars: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-200px)' },
        },
        floatConstellation: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(2deg)' },
          '66%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        pulseOrb: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.7' },
        },
        shootingStar: {
          '0%': { transform: 'translateX(-100px) translateY(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(300px) translateY(-200px)', opacity: '0' },
        },
        etherealFloat: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        cosmicGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(244, 228, 166, 0.3), 0 0 40px rgba(212, 165, 116, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(244, 228, 166, 0.5), 0 0 60px rgba(212, 165, 116, 0.3)' 
          },
        },
        romanticPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(244, 194, 194, 0.7)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(244, 194, 194, 0)',
          },
        },
        heartBeat: {
          '0%, 14%, 28%, 42%, 70%': { transform: 'scale(1)' },
          '7%, 21%, 35%': { transform: 'scale(1.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        romanticGlow: {
          '0%': {
            boxShadow: '0 0 5px rgba(244, 194, 194, 0.5), 0 0 10px rgba(232, 213, 255, 0.3)',
          },
          '100%': {
            boxShadow: '0 0 20px rgba(244, 194, 194, 0.8), 0 0 30px rgba(232, 213, 255, 0.6)',
          },
        },
        floatingHearts: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(180deg)', opacity: '0' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'celestial': '0 8px 32px rgba(10, 11, 30, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'celestial-dark': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'luxury': '0 20px 40px rgba(10, 11, 30, 0.3), 0 8px 16px rgba(45, 53, 97, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
