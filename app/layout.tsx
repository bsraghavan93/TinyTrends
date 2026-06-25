import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart'

export const metadata: Metadata = {
  title: 'TinyTrend Kids — Where Little Fashion Begins',
  description: 'Adorable, comfortable, and trendy clothing for kids aged 0–14. Shop dresses, tops, ethnic wear, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
