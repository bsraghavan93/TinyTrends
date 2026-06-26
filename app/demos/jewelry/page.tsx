'use client'

import { useState, useEffect } from 'react'
import store from '@/data/jewelry'
import type { DemoProduct } from '@/lib/demo-store-types'

// ── Emoji map per category for gradient placeholders ──
const categoryEmoji: Record<string, string> = {
  earrings: '💎',
  necksets: '📿',
  bangles: '⭕',
  anklets: '✨',
  bridal: '👰',
}

const occasionBadgeColor: Record<string, string> = {
  Bestseller: 'from-amber-600 to-yellow-500',
  'Bridal Pick': 'from-rose-600 to-pink-400',
  'Party Wear': 'from-purple-600 to-fuchsia-400',
  'Daily Wear': 'from-teal-600 to-emerald-400',
  Handmade: 'from-orange-600 to-amber-400',
  Traditional: 'from-red-700 to-rose-500',
  Bridal: 'from-rose-600 to-pink-400',
  'Premium Set': 'from-yellow-600 to-amber-300',
  'Under ₹300': 'from-green-600 to-emerald-400',
}

type CartItem = { product: DemoProduct; qty: number; variant?: string }

export default function JewelryStorePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const filteredProducts =
    activeCategory === 'all'
      ? store.products
      : store.products.filter((p) => p.category === activeCategory)

  const bridalProducts = store.products.filter((p) => p.category === 'bridal')

  const addToCart = (product: DemoProduct) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id)
      if (existing) return prev.map((c) => (c.product.id === product.id ? { ...c, qty: c.qty + 1 } : c))
      const variant = product.variants?.[0] ? selectedVariants[product.variants[0].label] || product.variants[0].options[0] : undefined
      return [...prev, { product, qty: 1, variant }]
    })
  }

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((c) => c.product.id !== id))

  const updateQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((c) => (c.product.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    )

  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.qty, 0)
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)

  const waLink = (product: DemoProduct) => {
    const variant = product.variants?.[0] ? ` | ${product.variants[0].label}: ${selectedVariants[product.variants[0].label] || product.variants[0].options[0]}` : ''
    return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(`Hi! I'm interested in *${product.name}* (₹${product.price})${variant}. Please share more details.`)}`
  }

  const waCartLink = () => {
    const items = cart.map((c) => `• ${c.product.name} x${c.qty} — ₹${c.product.price * c.qty}${c.variant ? ` (${c.variant})` : ''}`).join('\n')
    return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(`Hi! I'd like to order:\n\n${items}\n\nTotal: ₹${cartTotal}\n\nPlease confirm availability.`)}`
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F5F0EB] font-serif">
      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37] bg-clip-text text-transparent tracking-wide">
            Aadhya Jewels
          </h1>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#E8DDD3]/80">
            <a href="#collections" className="hover:text-[#D4AF37] transition-colors">Collections</a>
            <a href="#bridal" className="hover:text-[#D4AF37] transition-colors">Bridal</a>
            <a href="#reviews" className="hover:text-[#D4AF37] transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-[#D4AF37] transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCartOpen(true)} className="relative p-2 hover:text-[#D4AF37] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-[#0D0D0D] text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
            <a href={`https://wa.me/${store.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 75% 50%, #D4AF37 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#B76E79] tracking-[0.3em] uppercase text-sm mb-4 animate-pulse">Est. Since Trust & Tradition</p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#B8860B] bg-clip-text text-transparent">
              Affordable Luxury,
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#B76E79] via-[#D4AF37] to-[#B76E79] bg-clip-text text-transparent">
              Timeless Beauty
            </span>
          </h2>
          <p className="text-[#E8DDD3]/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {store.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#collections" className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] font-bold rounded-sm tracking-wide hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-300">
              EXPLORE COLLECTIONS
            </a>
            <a href="#bridal" className="px-8 py-3 border border-[#D4AF37]/50 text-[#D4AF37] rounded-sm tracking-wide hover:bg-[#D4AF37]/10 transition-all duration-300">
              BRIDAL COLLECTION
            </a>
          </div>
        </div>
        {/* shimmer line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="border-y border-[#D4AF37]/15 bg-[#111]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[#D4AF37]/10">
          {[
            { icon: '✓', label: 'Quality Checked' },
            { icon: '📦', label: 'Safe Packing' },
            { icon: '💰', label: 'COD Available' },
            { icon: '🚚', label: 'Free Shipping' },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-2 py-4 text-sm text-[#E8DDD3]/70">
              <span className="text-lg">{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATEGORY TABS ─── */}
      <section id="collections" className="max-w-7xl mx-auto px-4 pt-16 pb-4">
        <h3 className="text-center text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">Our Collections</h3>
        <p className="text-center text-[#E8DDD3]/50 mb-8">Handpicked designs for every occasion</p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 text-sm border transition-all duration-300 ${activeCategory === 'all' ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-[#D4AF37]/20 text-[#E8DDD3]/60 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'}`}
          >
            All
          </button>
          {store.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-sm border transition-all duration-300 ${activeCategory === cat.id ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-[#D4AF37]/20 text-[#E8DDD3]/60 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ─── PRODUCT GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[#1A1A1A] border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-500 hover:shadow-[0_0_25px_rgba(212,175,55,0.08)] cursor-pointer"
              onClick={() => { setSelectedProduct(product); setSelectedVariants({}) }}
            >
              {/* image placeholder */}
              <div className="relative aspect-square bg-gradient-to-br from-[#1A1A1A] via-[#2A2218] to-[#1A1A1A] flex items-center justify-center overflow-hidden">
                <span className="text-5xl md:text-6xl opacity-60 group-hover:scale-110 transition-transform duration-500">
                  {categoryEmoji[product.category] || '💎'}
                </span>
                {product.badge && (
                  <span className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white rounded-sm bg-gradient-to-r ${occasionBadgeColor[product.badge] || 'from-[#D4AF37] to-[#B8860B]'}`}>
                    {product.badge}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold text-[#0D0D0D] bg-[#D4AF37] rounded-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                {/* hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                  <span className="text-xs text-[#D4AF37] tracking-wider">VIEW DETAILS</span>
                </div>
              </div>
              {/* info */}
              <div className="p-3 md:p-4">
                <h4 className="text-sm md:text-base font-semibold text-[#F5F0EB] leading-tight line-clamp-2 mb-1">{product.name}</h4>
                {product.details?.Material && (
                  <p className="text-[10px] text-[#B76E79] mb-2 truncate">{product.details.Material}</p>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-[#D4AF37] font-bold text-lg">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-[#E8DDD3]/40 text-xs line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product) }}
                    className="flex-1 py-1.5 text-xs bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                  >
                    Add to Bag
                  </button>
                  <a
                    href={waLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="py-1.5 px-2 text-xs bg-green-900/30 border border-green-700/30 text-green-400 hover:bg-green-900/50 transition-colors"
                    title="Enquire on WhatsApp"
                  >
                    <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BRIDAL SPOTLIGHT ─── */}
      <section id="bridal" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#1A1410] to-[#0D0D0D]" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#B76E79] tracking-[0.3em] uppercase text-xs mb-2">Exclusive</p>
            <h3 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37] bg-clip-text text-transparent mb-3">
              Bridal Collection
            </h3>
            <p className="text-[#E8DDD3]/50 max-w-lg mx-auto">Make your special day unforgettable with our handcrafted bridal pieces</p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bridalProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => { setSelectedProduct(product); setSelectedVariants({}) }}
                className="group relative bg-gradient-to-b from-[#1A1A1A] to-[#111] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all duration-500 cursor-pointer hover:shadow-[0_0_40px_rgba(212,175,55,0.12)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative aspect-[3/4] bg-gradient-to-br from-[#2A2218] via-[#1A1A1A] to-[#2A2218] flex items-center justify-center">
                  <span className="text-6xl opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500">👰</span>
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold text-[#0D0D0D] bg-gradient-to-r from-[#D4AF37] to-[#F5E6A3] tracking-wide">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="relative p-4 border-t border-[#D4AF37]/10">
                  <h4 className="font-semibold text-[#F5F0EB] mb-1">{product.name}</h4>
                  <p className="text-xs text-[#E8DDD3]/40 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[#D4AF37] font-bold text-xl">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[#E8DDD3]/30 text-xs line-through ml-2">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <a
                      href={waLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="reviews" className="max-w-6xl mx-auto px-4 py-20">
        <h3 className="text-center text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
          What Our Customers Say
        </h3>
        <p className="text-center text-[#E8DDD3]/50 mb-12">Trusted by thousands of happy customers across India</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.testimonials.map((t, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-[#D4AF37]/10 p-6 hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className={s < t.rating ? 'text-[#D4AF37]' : 'text-[#E8DDD3]/20'}>★</span>
                ))}
              </div>
              <p className="text-[#E8DDD3]/70 text-sm mb-4 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B76E79]/30 flex items-center justify-center text-sm font-bold text-[#D4AF37]">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F5F0EB]">{t.name}</p>
                  <p className="text-xs text-[#E8DDD3]/40">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─── */}
      <section id="contact" className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/30 via-[#0D0D0D] to-green-950/30" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 border border-green-700/30 mb-6">
            <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-3 text-[#F5F0EB]">Order Easily via WhatsApp</h3>
          <p className="text-[#E8DDD3]/60 mb-8 max-w-md mx-auto">
            No complicated checkout. Just send us a message, and we will handle the rest. Pay on delivery available!
          </p>
          <div className="inline-flex flex-col items-center bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-2xl p-6 md:p-8 max-w-sm w-full">
            <div className="w-full bg-[#111] rounded-lg p-4 mb-4 border border-[#333] text-left">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#333]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-xs font-bold text-[#0D0D0D]">AJ</div>
                <div>
                  <p className="text-xs font-semibold text-[#F5F0EB]">Aadhya Jewels</p>
                  <p className="text-[10px] text-green-400">Online</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-[#1A2E1A] text-xs text-[#E8DDD3]/80 px-3 py-2 rounded-lg rounded-tl-none max-w-[85%]">
                  Hi! Welcome to Aadhya Jewels. How can I help you today?
                </div>
                <div className="bg-[#2A2218] text-xs text-[#E8DDD3]/80 px-3 py-2 rounded-lg rounded-tr-none max-w-[85%] ml-auto">
                  I want to order the bridal set!
                </div>
              </div>
            </div>
            <a
              href={`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent('Hi! I want to explore your jewelry collection.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-center rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Start Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#D4AF37]/15 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent mb-3">
                Aadhya Jewels
              </h4>
              <p className="text-sm text-[#E8DDD3]/50">{store.description}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-[#D4AF37] mb-3 tracking-wider">QUICK LINKS</h5>
              <div className="space-y-2 text-sm text-[#E8DDD3]/50">
                <a href="#collections" className="block hover:text-[#D4AF37] transition-colors">Collections</a>
                <a href="#bridal" className="block hover:text-[#D4AF37] transition-colors">Bridal Collection</a>
                <a href="#reviews" className="block hover:text-[#D4AF37] transition-colors">Customer Reviews</a>
                <a href="#contact" className="block hover:text-[#D4AF37] transition-colors">Contact Us</a>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-[#D4AF37] mb-3 tracking-wider">CONTACT</h5>
              <div className="space-y-2 text-sm text-[#E8DDD3]/50">
                <p>WhatsApp: +91 79040 72714</p>
                <p>Email: {store.email}</p>
                <p>Instagram: {store.instagramHandle}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-[#D4AF37]/10 pt-6 text-center text-xs text-[#E8DDD3]/30">
            <p>&copy; 2026 Aadhya Jewels. All rights reserved. Crafted with love in India.</p>
          </div>
        </div>
      </footer>

      {/* ─── PRODUCT MODAL ─── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-[#1A1A1A] border border-[#D4AF37]/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-[#E8DDD3]/60 hover:text-[#D4AF37] transition-colors text-xl">&times;</button>
            {/* image area */}
            <div className="aspect-video bg-gradient-to-br from-[#2A2218] via-[#1A1A1A] to-[#2A2218] flex items-center justify-center border-b border-[#D4AF37]/10">
              <span className="text-7xl opacity-50">{categoryEmoji[selectedProduct.category] || '💎'}</span>
            </div>
            <div className="p-6">
              {selectedProduct.badge && (
                <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-sm bg-gradient-to-r ${occasionBadgeColor[selectedProduct.badge] || 'from-[#D4AF37] to-[#B8860B]'} mb-3`}>
                  {selectedProduct.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold text-[#F5F0EB] mb-2">{selectedProduct.name}</h3>
              <p className="text-[#E8DDD3]/60 text-sm mb-4">{selectedProduct.description}</p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-[#D4AF37]">₹{selectedProduct.price}</span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className="text-lg text-[#E8DDD3]/30 line-through">₹{selectedProduct.originalPrice}</span>
                    <span className="text-sm text-green-400 font-semibold">
                      Save ₹{selectedProduct.originalPrice - selectedProduct.price}
                    </span>
                  </>
                )}
              </div>

              {/* variants */}
              {selectedProduct.variants?.map((v) => (
                <div key={v.label} className="mb-4">
                  <p className="text-sm text-[#E8DDD3]/60 mb-2">{v.label}:</p>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariants((p) => ({ ...p, [v.label]: opt }))}
                        className={`px-4 py-1.5 text-sm border transition-all ${(selectedVariants[v.label] || v.options[0]) === opt ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-[#D4AF37]/20 text-[#E8DDD3]/50 hover:border-[#D4AF37]/40'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* details table */}
              {selectedProduct.details && (
                <div className="border border-[#D4AF37]/10 mb-6">
                  <div className="bg-[#D4AF37]/5 px-4 py-2 border-b border-[#D4AF37]/10">
                    <h4 className="text-sm font-semibold text-[#D4AF37]">Product Details</h4>
                  </div>
                  {Object.entries(selectedProduct.details).map(([key, val], i) => (
                    <div key={key} className={`flex px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-[#111]' : 'bg-[#1A1A1A]'}`}>
                      <span className="w-1/3 text-[#E8DDD3]/40">{key}</span>
                      <span className="w-2/3 text-[#F5F0EB]">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null) }}
                  className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0D0D0D] font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
                >
                  Add to Bag — ₹{selectedProduct.price}
                </button>
                <a
                  href={waLink(selectedProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CART SIDEBAR ─── */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#1A1A1A] border-l border-[#D4AF37]/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/10">
              <h3 className="text-lg font-bold text-[#D4AF37]">Shopping Bag ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} className="text-[#E8DDD3]/60 hover:text-[#D4AF37] text-xl">&times;</button>
            </div>
            {/* items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-5xl mb-4 opacity-30">💎</p>
                  <p className="text-[#E8DDD3]/40">Your bag is empty</p>
                  <button onClick={() => setCartOpen(false)} className="mt-4 text-sm text-[#D4AF37] hover:underline">Continue Shopping</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-[#111] border border-[#D4AF37]/10 p-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#2A2218] to-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl opacity-50">{categoryEmoji[item.product.category] || '💎'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#F5F0EB] truncate">{item.product.name}</h4>
                      {item.variant && <p className="text-[10px] text-[#B76E79]">Size: {item.variant}</p>}
                      <p className="text-sm text-[#D4AF37] font-bold mt-1">₹{item.product.price * item.qty}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <button onClick={() => updateQty(item.product.id, -1)} className="w-6 h-6 border border-[#D4AF37]/20 text-[#D4AF37] text-sm flex items-center justify-center hover:bg-[#D4AF37]/10">-</button>
                        <span className="text-sm text-[#E8DDD3]">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="w-6 h-6 border border-[#D4AF37]/20 text-[#D4AF37] text-sm flex items-center justify-center hover:bg-[#D4AF37]/10">+</button>
                        <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-xs text-red-400/60 hover:text-red-400">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* footer */}
            {cart.length > 0 && (
              <div className="border-t border-[#D4AF37]/10 p-6 space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-[#E8DDD3]/60">Total</span>
                  <span className="font-bold text-[#D4AF37]">₹{cartTotal}</span>
                </div>
                <a
                  href={waCartLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold text-center transition-colors rounded-sm"
                >
                  Order via WhatsApp
                </a>
                <p className="text-center text-[10px] text-[#E8DDD3]/30">COD &amp; UPI payment available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
