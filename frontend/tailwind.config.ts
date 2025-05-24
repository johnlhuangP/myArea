import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			animation: {
				'steam': 'steam 2s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'sway': 'sway 3s ease-in-out infinite',
				'flash': 'flash 3s ease-in-out infinite',
				'wave': 'wave 2s ease-in-out infinite',
				'marker-enter': 'markerEnter 0.5s ease-out',
			},
			keyframes: {
				steam: {
					'0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
					'50%': { transform: 'translateY(-2px) scale(1.05)', opacity: '0.9' },
				},
				glow: {
					'0%': { boxShadow: '0 0 5px rgba(159, 122, 234, 0.5)' },
					'100%': { boxShadow: '0 0 20px rgba(159, 122, 234, 0.8)' },
				},
				sway: {
					'0%, 100%': { transform: 'rotate(-2deg)' },
					'50%': { transform: 'rotate(2deg)' },
				},
				flash: {
					'0%, 90%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7', transform: 'scale(1.1)' },
				},
				wave: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-1px)' },
					'75%': { transform: 'translateX(1px)' },
				},
				markerEnter: {
					'0%': { transform: 'scale(0)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
