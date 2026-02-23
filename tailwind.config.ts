import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			/* Team 404 palette */
  			schedos: {
  				base: '#0A0A0F',
  				surface: '#111118',
  				elevated: '#0D0D14',
  				border: '#1E1E2E',
  				primary: '#7C3AED',
  				cyan: '#06B6D4',
  				amber: '#F59E0B',
  				emerald: '#10B981',
  				red: '#EF4444',
  				'muted': '#94A3B8',
  			},
  			chart: {
  				'1': '#06B6D4',
  				'2': '#F59E0B',
  				'3': '#10B981',
  				'4': '#EF4444',
  				'5': '#8B5CF6',
  				'6': '#EC4899'
  			}
  		},
  		fontFamily: {
  			display: ['var(--font-display)', 'Syne', 'sans-serif'],
  			body: ['var(--font-body)', 'DM Sans', 'sans-serif'],
  			mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'glow': '0 0 40px rgba(124, 58, 237, 0.3)',
  			'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.4)',
  		},
  		animation: {
  			'gradient-spin': 'gradient-spin 4s linear infinite',
  			'spotlight': 'spotlight 2s ease .75s 1 forwards',
  		},
  		keyframes: {
  			spotlight: {
  				'0%': { opacity: '0', transform: 'translate(-72%, -62%) skewX(-30deg)' },
  				'100%': { opacity: '1', transform: 'translate(-50%, -40%) skewX(-30deg)' },
  			},
  		},
  		backgroundSize: {
  			'200': '200% 200%',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
