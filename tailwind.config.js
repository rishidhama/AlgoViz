/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Gradient color classes used dynamically in Sidebar categories
    'bg-gradient-to-r', 'bg-gradient-to-br',
    'from-red-500', 'to-pink-600',
    'from-purple-600', 'to-violet-700',
    'from-blue-500', 'to-cyan-600',
    'from-green-500', 'to-emerald-600',
    'from-cyan-600', 'to-teal-700',
    'from-purple-500', 'to-violet-600',
    'from-orange-600', 'to-amber-700',
    'from-pink-600', 'to-rose-700',
    'from-emerald-600', 'to-green-700',
    'from-orange-500', 'to-red-600',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
