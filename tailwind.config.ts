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
        // Nigerian-inspired color palette
        nigerian: {
          green: '#008751',
          gold: '#FFD700',
          orange: '#FF6B35',
          red: '#E63946',
        },
        food: {
          jollof: '#FF8C42',
          plantain: '#F4D03F',
          pepper: '#C0392B',
          palmOil: '#E74C3C',
          yam: '#8E44AD',
          coconut: '#F8F9FA',
          charcoal: '#2C3E50',
        },
        accent: {
          teal: '#17A2B8',
          coral: '#FF7F7F',
          lime: '#32CD32',
        },
      },
      backgroundImage: {
        'gradient-nigerian': 'linear-gradient(135deg, #008751 0%, #FFD700 100%)',
        'gradient-food': 'linear-gradient(135deg, #FF8C42 0%, #C0392B 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F4D03F 0%, #FF6B35 100%)',
        'gradient-cool': 'linear-gradient(135deg, #17A2B8 0%, #008751 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF6B35 0%, #E74C3C 100%)',
        'gradient-earth': 'linear-gradient(135deg, #2C3E50 0%, #8E44AD 100%)',
      },
      animation: {
        'nigerian-pulse': 'nigerian-pulse 2s infinite',
        'food-shimmer': 'food-shimmer 2s infinite',
      },
      keyframes: {
        'nigerian-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(255, 107, 53, 0.4)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(255, 107, 53, 0)',
          },
        },
        'food-shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
