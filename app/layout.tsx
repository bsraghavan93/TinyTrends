import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart'

export const metadata: Metadata = {
  title: 'PixelCraft Studios — We Build Stunning E-Commerce Stores',
  description: 'Custom e-commerce store development with modern design, admin dashboard, and full source code ownership. Get your online store live in 7 days.',
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
