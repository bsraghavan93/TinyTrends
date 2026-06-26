'use client'

import { useState, useRef } from 'react'
import store from '@/data/boutique'
import type { DemoProduct } from '@/lib/demo-store-types'

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  product: DemoProduct
  quantity: number
  variant?: string
}

// ─── Gradient map for product image placeholders ──────────────────────────────
const categoryGradients: Record<string, string> = {
  sarees: 'from-rose-200 via-pink-100 to-amber-100',
  kurtis: 'from-amber-200 via-orange-100 to-rose-100',
  'dress-materials': 'from-violet-200 via-purple-100 to-pink-100',
  'party-wear': 'from-emerald-200 via-teal-100 to-cyan-100',
  'new-arrivals': 'from-sky-200 via-indigo-100 to-violet-100',
}

const categoryIcon: Record<string, string> = {}
store.categories.forEach((c) => { categoryIcon[c.id] = c.icon })

function getWhatsAppLink(text: string) {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(text)}`
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function BoutiquePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [addedToCartId, setAddedToCartId] = useState<string | null>(null)
  const productGridRef = useRef<HTMLDivElement>(null)
  const categoryScrollRef = useRef<HTMLDivElement>(null)

  // Filter products
  const filteredProducts = activeCategory === 'all'
    ? store.products
    : store.products.filter((p) => p.category === activeCategory)

  const festivalProducts = store.products.filter(
    (p) => p.category === 'party-wear' || p.badge === 'Premium'
  )
  const newArrivals = store.products.filter((p) => p.category === 'new-arrivals')

  // Cart helpers
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  function addToCart(product: DemoProduct, variant?: string) {
    setCart((prev) => {
      const existing = prev.findIndex(
        (item) => item.product.id === product.id && item.variant === variant
      )
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + 1 }
        return updated
      }
      return [...prev, { product, quantity: 1, variant }]
    })
    setAddedToCartId(product.id)
    setTimeout(() => setAddedToCartId(null), 1200)
  }

  function removeFromCart(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  function updateCartQty(index: number, delta: number) {
    setCart((prev) => {
      const updated = [...prev]
      const newQty = updated[index].quantity + delta
      if (newQty <= 0) return prev.filter((_, i) => i !== index)
      updated[index] = { ...updated[index], quantity: newQty }
      return updated
    })
  }

  // Scroll to products on category click
  function handleCategoryClick(catId: string) {
    setActiveCategory(catId)
    productGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Open product modal
  function openProduct(product: DemoProduct) {
    const defaults: Record<string, string> = {}
    product.variants?.forEach((v) => { defaults[v.label] = v.options[0] })
    setSelectedVariants(defaults)
    setSelectedProduct(product)
  }

  // Discount percentage
  function discountPercent(product: DemoProduct) {
    if (!product.originalPrice) return 0
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  }

  // ─── Product Card ─────────────────────────────────────────────────────────
  function ProductCard({ product }: { product: DemoProduct }) {
    const discount = discountPercent(product)
    const icon = categoryIcon[product.category] || '👗'
    const gradient = categoryGradients[product.category] || 'from-gray-200 to-gray-100'
    const justAdded = addedToCartId === product.id

    return (
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#F0E6DF]">
        {/* Image placeholder */}
        <div
          className={`relative h-56 md:h-64 bg-gradient-to-br ${gradient} flex items-center justify-center cursor-pointer overflow-hidden`}
          onClick={() => openProduct(product)}
        >
          <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-500">
            {icon}
          </span>
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#7B2D3B] text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-[#C4956A] text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <div className="absolute inset-0 bg-[#7B2D3B]/0 group-hover:bg-[#7B2D3B]/10 transition-colors duration-300" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="font-heading font-semibold text-[#3D2C2E] text-sm md:text-base leading-tight mb-2 cursor-pointer hover:text-[#7B2D3B] transition-colors line-clamp-2"
            onClick={() => openProduct(product)}
          >
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[#7B2D3B]">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openProduct(product)}
              className="flex-1 text-xs md:text-sm py-2 px-3 rounded-lg border-2 border-[#7B2D3B] text-[#7B2D3B] font-semibold hover:bg-[#7B2D3B] hover:text-white transition-all duration-200"
            >
              View Details
            </button>
            <a
              href={getWhatsAppLink(`Hi! I'm interested in ${product.name} (₹${product.price})`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
              title="Order on WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF8F4', color: '#3D2C2E' }}>

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-[#F0E6DF]" style={{ backgroundColor: 'rgba(253,248,244,0.95)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7B2D3B] flex items-center justify-center">
              <span className="text-white font-heading font-bold text-sm">VB</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-[#3D2C2E] leading-none">{store.name}</h1>
              <p className="text-xs text-[#C4956A]">{store.instagramHandle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://instagram.com/${store.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#E8D5C8] flex items-center justify-center text-[#7B2D3B] hover:bg-[#7B2D3B] hover:text-white transition-all"
            >
              <InstagramIcon />
            </a>
            <a
              href={getWhatsAppLink('Hi! I would like to know more about your collection.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
            >
              <WhatsAppIcon />
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 rounded-full border border-[#E8D5C8] flex items-center justify-center text-[#7B2D3B] hover:bg-[#7B2D3B] hover:text-white transition-all"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C4956A] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7B2D3B 0%, #9B3747 40%, #C4956A 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-float-slow">🥻</div>
          <div className="absolute bottom-10 right-10 text-7xl animate-float">👘</div>
          <div className="absolute top-1/2 left-1/3 text-6xl animate-float-slow" style={{ animationDelay: '1s' }}>✨</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <p className="text-[#D4A76A] text-sm md:text-base font-medium tracking-widest uppercase mb-4 animate-fade-in">
              {store.instagramHandle} &middot; Since 2019
            </p>
            <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
              {store.tagline}
            </h2>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-lg animate-fade-in">
              {store.description}
            </p>
            <div className="flex flex-wrap gap-3 animate-slide-up">
              <button
                onClick={() => productGridRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-white text-[#7B2D3B] font-heading font-bold rounded-full hover:bg-[#FDF8F4] transition-colors shadow-lg"
              >
                Shop Now
              </button>
              <a
                href={getWhatsAppLink('Hi! I want to browse your latest collection.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-green-500 text-white font-heading font-bold rounded-full hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2"
              >
                <WhatsAppIcon /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="#FDF8F4" />
          </svg>
        </div>
      </section>

      {/* ── Category Pills ──────────────────────────────────────────────────── */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div ref={categoryScrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                activeCategory === 'all'
                  ? 'bg-[#7B2D3B] text-white border-[#7B2D3B] shadow-md'
                  : 'bg-white text-[#3D2C2E] border-[#E8D5C8] hover:border-[#7B2D3B] hover:text-[#7B2D3B]'
              }`}
            >
              ✦ All
            </button>
            {store.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border-2 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-[#7B2D3B] text-white border-[#7B2D3B] shadow-md'
                    : 'bg-white text-[#3D2C2E] border-[#E8D5C8] hover:border-[#7B2D3B] hover:text-[#7B2D3B]'
                }`}
              >
                <span>{cat.icon}</span> {cat.name}
                <span className="text-xs opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Grid ────────────────────────────────────────────────────── */}
      <section ref={productGridRef} className="py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#3D2C2E]">Our Collection</h2>
              <p className="text-sm text-[#9B8A80] mt-1">{filteredProducts.length} pieces curated for you</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Lifestyle Banner ────────────────────────────────────────────────── */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAF5EF 0%, #F0E6DF 50%, #E8D5C8 100%)' }}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-14 flex flex-col justify-center">
                <p className="text-[#C4956A] text-sm tracking-widest uppercase font-semibold mb-3">Editorial</p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#3D2C2E] mb-4 leading-tight">
                  Curated for the Modern Indian Woman
                </h2>
                <p className="text-[#6B5B55] leading-relaxed mb-6">
                  Every piece in our collection tells a story of tradition meeting contemporary elegance. From handwoven Banarasi silks to breezy linen drapes, we source directly from artisan clusters across India to bring you authentic craftsmanship at honest prices.
                </p>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="font-heading text-2xl font-bold text-[#7B2D3B]">500+</p>
                    <p className="text-xs text-[#9B8A80]">Happy Customers</p>
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-bold text-[#7B2D3B]">100%</p>
                    <p className="text-xs text-[#9B8A80]">Authentic Fabrics</p>
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-bold text-[#7B2D3B]">Pan India</p>
                    <p className="text-xs text-[#9B8A80]">Delivery</p>
                  </div>
                </div>
              </div>
              <div className="relative h-64 md:h-auto bg-gradient-to-br from-[#7B2D3B]/10 via-[#C4956A]/20 to-[#D4A76A]/10 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl md:text-9xl">🥻</span>
                  <p className="mt-4 text-[#9B8A80] text-sm italic">Handcrafted with love</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Festival Collection ──────────────────────────────────────────────── */}
      {festivalProducts.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-[#C4956A] text-sm tracking-widest uppercase font-semibold mb-2">Special Curation</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#3D2C2E]">Festival Collection</h2>
              <p className="text-sm text-[#9B8A80] mt-2">Statement pieces for your most memorable occasions</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {festivalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── New Arrivals ─────────────────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[#C4956A] text-sm tracking-widest uppercase font-semibold mb-2">Just Dropped</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#3D2C2E]">New Arrivals</h2>
              </div>
              <button
                onClick={() => handleCategoryClick('new-arrivals')}
                className="text-sm text-[#7B2D3B] font-semibold hover:underline"
              >
                View All &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Shop With Us ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16" style={{ backgroundColor: '#FAF5EF' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-[#3D2C2E] mb-10">
            Why Shop With Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: '🧶', title: 'Quality Fabrics', desc: 'Sourced from trusted artisan clusters across India' },
              { icon: '💬', title: 'Easy WhatsApp Ordering', desc: 'Chat with us, customize, and order in minutes' },
              { icon: '📦', title: 'Safe Delivery', desc: 'Secure packaging with pan-India tracked shipping' },
              { icon: '🔄', title: 'Hassle-free Returns', desc: '7-day easy returns with full refund guarantee' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#F0E6DF] hover:shadow-md transition-shadow"
              >
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <h3 className="font-heading font-bold text-sm md:text-base text-[#3D2C2E] mb-2">{item.title}</h3>
                <p className="text-xs text-[#9B8A80] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#3D2C2E]">What Our Customers Say</h2>
            <p className="text-sm text-[#9B8A80] mt-2">Real love from real women</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {store.testimonials.map((t, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-sm border border-[#F0E6DF] snap-start"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#7B2D3B] flex items-center justify-center text-white font-heading font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#3D2C2E]">{t.name}</p>
                    <p className="text-xs text-[#9B8A80]">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={`text-sm ${j < t.rating ? 'text-[#D4A76A]' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
                <p className="text-sm text-[#6B5B55] leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Banner ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7B2D3B 0%, #9B3747 100%)' }}
          >
            <div className="absolute inset-0 opacity-5">
              {['🥻', '👘', '✨', '🧵'].map((e, i) => (
                <span key={i} className="absolute text-6xl animate-float-slow" style={{ top: `${20 + i * 20}%`, left: `${10 + i * 25}%`, animationDelay: `${i * 0.7}s` }}>{e}</span>
              ))}
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <InstagramIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-heading text-2xl md:text-4xl font-bold text-white mb-3">
                Follow Us on Instagram
              </h2>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Get first access to new launches, styling tips, and exclusive offers at {store.instagramHandle}
              </p>
              <a
                href={`https://instagram.com/${store.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#7B2D3B] font-heading font-bold rounded-full hover:bg-[#FDF8F4] transition-colors shadow-lg"
              >
                <InstagramIcon className="w-5 h-5" /> Follow {store.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E8D5C8] py-12" style={{ backgroundColor: '#FAF5EF' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#7B2D3B] flex items-center justify-center">
                  <span className="text-white font-heading font-bold text-sm">VB</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-[#3D2C2E]">{store.name}</h3>
                  <p className="text-xs text-[#C4956A]">{store.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-[#9B8A80] leading-relaxed">{store.description}</p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#3D2C2E] mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-[#6B5B55]">
                {store.categories.map((cat) => (
                  <li key={cat.id}>
                    <button onClick={() => handleCategoryClick(cat.id)} className="hover:text-[#7B2D3B] transition-colors">
                      {cat.icon} {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-[#3D2C2E] mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-[#6B5B55]">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <a href={`mailto:${store.email}`} className="hover:text-[#7B2D3B] transition-colors">{store.email}</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <a href={getWhatsAppLink('Hi!')} target="_blank" rel="noopener noreferrer" className="hover:text-[#7B2D3B] transition-colors">
                    WhatsApp: +91 {store.whatsappNumber.slice(2)}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📸</span>
                  <a href={`https://instagram.com/${store.instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#7B2D3B] transition-colors">
                    {store.instagramHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E8D5C8] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#9B8A80]">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <p className="text-xs text-[#C4956A]">Made with ♥ in India</p>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp Button ─────────────────────────────────────────── */}
      <a
        href={getWhatsAppLink('Hi! I would like to place an order.')}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
      >
        <WhatsAppIcon className="w-7 h-7" />
      </a>

      {/* ── Product Modal ────────────────────────────────────────────────────── */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white w-full md:w-[600px] md:max-h-[90vh] max-h-[85vh] rounded-t-3xl md:rounded-3xl overflow-y-auto shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-[#3D2C2E] hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>

            {/* Modal image */}
            <div className={`h-64 md:h-72 bg-gradient-to-br ${categoryGradients[selectedProduct.category] || 'from-gray-200 to-gray-100'} flex items-center justify-center relative`}>
              <span className="text-8xl">{categoryIcon[selectedProduct.category] || '👗'}</span>
              {selectedProduct.badge && (
                <span className="absolute top-4 left-4 bg-[#7B2D3B] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedProduct.badge}
                </span>
              )}
              {discountPercent(selectedProduct) > 0 && (
                <span className="absolute top-4 right-14 bg-[#C4956A] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Save {discountPercent(selectedProduct)}%
                </span>
              )}
            </div>

            {/* Modal content */}
            <div className="p-6">
              <h2 className="font-heading text-xl md:text-2xl font-bold text-[#3D2C2E] mb-2">{selectedProduct.name}</h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-[#7B2D3B]">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                {selectedProduct.originalPrice && (
                  <>
                    <span className="text-base text-gray-400 line-through">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-green-600 font-semibold">
                      You save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-[#6B5B55] leading-relaxed mb-5">{selectedProduct.description}</p>

              {/* Variants */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="mb-5 space-y-4">
                  {selectedProduct.variants.map((variant) => (
                    <div key={variant.label}>
                      <label className="text-sm font-semibold text-[#3D2C2E] mb-2 block">{variant.label}</label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.label]: opt }))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                              selectedVariants[variant.label] === opt
                                ? 'border-[#7B2D3B] bg-[#7B2D3B] text-white'
                                : 'border-[#E8D5C8] text-[#3D2C2E] hover:border-[#7B2D3B]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Details table */}
              {selectedProduct.details && Object.keys(selectedProduct.details).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#3D2C2E] mb-3">Product Details</h4>
                  <div className="rounded-xl overflow-hidden border border-[#F0E6DF]">
                    {Object.entries(selectedProduct.details).map(([key, value], i) => (
                      <div key={key} className={`flex text-sm ${i % 2 === 0 ? 'bg-[#FDF8F4]' : 'bg-white'}`}>
                        <span className="w-1/3 px-4 py-2.5 font-medium text-[#7B2D3B] border-r border-[#F0E6DF]">{key}</span>
                        <span className="flex-1 px-4 py-2.5 text-[#6B5B55]">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 sticky bottom-0 bg-white pt-2 pb-1">
                <button
                  onClick={() => {
                    const variantStr = Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
                    addToCart(selectedProduct, variantStr || undefined)
                  }}
                  className="flex-1 py-3 bg-[#7B2D3B] text-white font-heading font-bold rounded-xl hover:bg-[#9B3747] transition-colors flex items-center justify-center gap-2"
                >
                  <CartIcon className="w-5 h-5" /> Add to Cart
                </button>
                <a
                  href={getWhatsAppLink(
                    `Hi! I'd like to order:\n${selectedProduct.name} — ₹${selectedProduct.price}${
                      Object.keys(selectedVariants).length
                        ? '\n' + Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
                        : ''
                    }`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 bg-green-500 text-white font-heading font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <WhatsAppIcon /> Order
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin CTA */}
      <a href="/admin/boutique?demo=true" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#7B2D3B]/90 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-xl shadow-[#7B2D3B]/20 border border-[#C4956A]/30 hover:bg-[#7B2D3B] hover:-translate-y-1 transition-all group animate-bounce-in">
        <span className="w-2 h-2 bg-[#C4956A] rounded-full animate-pulse" />
        <span className="text-sm font-semibold">Try Admin Portal</span>
        <svg className="w-4 h-4 text-[#C4956A] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </a>

      {/* ── Cart Sidebar ─────────────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-slide-in-right flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#F0E6DF]">
              <h2 className="font-heading font-bold text-lg text-[#3D2C2E]">Your Cart ({cartCount})</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FDF8F4] flex items-center justify-center text-[#3D2C2E] hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl mb-4 block">🛒</span>
                  <p className="text-[#9B8A80] font-medium">Your cart is empty</p>
                  <p className="text-xs text-[#C4956A] mt-1">Browse our collection and add something beautiful!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, i) => {
                    const icon = categoryIcon[item.product.category] || '👗'
                    return (
                      <div key={`${item.product.id}-${item.variant}-${i}`} className="flex gap-3 bg-[#FDF8F4] rounded-xl p-3">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${categoryGradients[item.product.category] || 'from-gray-200 to-gray-100'} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-2xl">{icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#3D2C2E] truncate">{item.product.name}</h4>
                          {item.variant && <p className="text-xs text-[#9B8A80]">{item.variant}</p>}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateCartQty(i, -1)}
                                className="w-6 h-6 rounded-full border border-[#E8D5C8] flex items-center justify-center text-xs text-[#3D2C2E] hover:bg-[#7B2D3B] hover:text-white hover:border-[#7B2D3B] transition-colors"
                              >
                                −
                              </button>
                              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQty(i, 1)}
                                className="w-6 h-6 rounded-full border border-[#E8D5C8] flex items-center justify-center text-xs text-[#3D2C2E] hover:bg-[#7B2D3B] hover:text-white hover:border-[#7B2D3B] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-sm font-bold text-[#7B2D3B]">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(i)}
                          className="text-[#9B8A80] hover:text-red-500 transition-colors self-start text-xs mt-1"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Cart footer */}
            {cart.length > 0 && (
              <div className="border-t border-[#F0E6DF] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#3D2C2E]">Total</span>
                  <span className="text-xl font-bold text-[#7B2D3B]">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <a
                  href={getWhatsAppLink(
                    `Hi! I'd like to order:\n${cart
                      .map(
                        (item) =>
                          `• ${item.product.name}${item.variant ? ` (${item.variant})` : ''} × ${item.quantity} — ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}`
                      )
                      .join('\n')}\n\nTotal: ₹${cartTotal.toLocaleString('en-IN')}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-green-500 text-white font-heading font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon /> Order on WhatsApp
                </a>
                <button
                  onClick={() => setCart([])}
                  className="w-full py-2.5 border-2 border-[#E8D5C8] text-[#9B8A80] font-medium rounded-xl hover:border-red-300 hover:text-red-500 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function CartIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}
