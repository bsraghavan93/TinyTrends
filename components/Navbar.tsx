'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart'
import CartSidebar from './CartSidebar'
import CartToast from './CartToast'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemCount, lastAdded, clearLastAdded } = useCart()

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-coral-400 rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">TT</span>
              </div>
              <span className="font-heading font-bold text-xl text-charcoal">
                Tiny<span className="text-coral-400">Trend</span> Kids
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-charcoal/70 hover:text-coral-400 font-medium transition-colors">Home</Link>
              <Link href="/products" className="text-charcoal/70 hover:text-coral-400 font-medium transition-colors">Shop</Link>
              <a href="#collections" className="text-charcoal/70 hover:text-coral-400 font-medium transition-colors">Collections</a>
              <a href="#reviews" className="text-charcoal/70 hover:text-coral-400 font-medium transition-colors">Reviews</a>
              <Link href="/admin" className="text-charcoal/70 hover:text-coral-400 font-medium transition-colors">Admin</Link>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setCartOpen(true)} className="relative p-2 text-charcoal hover:text-coral-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-coral-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-charcoal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 animate-slide-up">
              <div className="flex flex-col gap-3">
                <Link href="/" onClick={() => setMenuOpen(false)} className="text-charcoal/70 hover:text-coral-400 font-medium py-2">Home</Link>
                <Link href="/products" onClick={() => setMenuOpen(false)} className="text-charcoal/70 hover:text-coral-400 font-medium py-2">Shop</Link>
                <a href="#collections" onClick={() => setMenuOpen(false)} className="text-charcoal/70 hover:text-coral-400 font-medium py-2">Collections</a>
                <a href="#reviews" onClick={() => setMenuOpen(false)} className="text-charcoal/70 hover:text-coral-400 font-medium py-2">Reviews</a>
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-charcoal/70 hover:text-coral-400 font-medium py-2">Admin</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      {lastAdded && <CartToast item={lastAdded} onClose={clearLastAdded} />}
    </>
  )
}
