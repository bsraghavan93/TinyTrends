import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF0F0',
          100: '#FFE0E0',
          200: '#FFC2C2',
          300: '#FF9B9B',
          400: '#FF6B6B',
          500: '#FF4757',
          600: '#E83E4E',
          700: '#C53040',
          800: '#A32535',
          900: '#7A1B28',
        },
        teal: {
          50: '#E8FAF8',
          100: '#D0F5F1',
          200: '#A1EBE3',
          300: '#72E1D5',
          400: '#4ECDC4',
          500: '#3BBFB6',
          600: '#2EA89F',
          700: '#238A83',
          800: '#1A6B66',
          900: '#114D49',
        },
        sunny: {
          50: '#FFFDF0',
          100: '#FFFAE0',
          200: '#FFF5C2',
          300: '#FFED9B',
          400: '#FFE66D',
          500: '#FFDD3D',
          600: '#E6C735',
          700: '#BFA42C',
          800: '#998323',
          900: '#73621A',
        },
        cream: '#FFF8F0',
        charcoal: '#2D3436',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
