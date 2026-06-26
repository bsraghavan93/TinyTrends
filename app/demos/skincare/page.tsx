'use client'

import { useState } from 'react'
import store from '@/data/skincare'
import { DemoProduct } from '@/lib/demo-store-types'

const ingredientSpotlight = [
  { name: 'Turmeric', emoji: '🟡', benefit: 'Brightens skin & evens tone' },
  { name: 'Charcoal', emoji: '⬛', benefit: 'Deep cleanses & detoxifies' },
  { name: 'Shea Butter', emoji: '🤍', benefit: 'Intense moisture & repair' },
  { name: 'Rose', emoji: '🌹', benefit: 'Soothes & adds natural glow' },
  { name: 'Coconut', emoji: '🥥', benefit: 'Nourishes & hydrates deeply' },
  { name: 'Aloe Vera', emoji: '🌱', benefit: 'Calms irritation & heals' },
]

const productEmojis: Record<string, string> = {
  soaps: '🧼',
  'body-butter': '🧴',
  'lip-balms': '💋',
  'face-packs': '🌿',
  'gift-combos': '🎁',
}

const productGradients: Record<string, string> = {
  soaps: 'from-[#E8E0D4] to-[#F5F0E8]',
  'body-butter': 'from-[#F0E6D8] to-[#FAF5EE]',
  'lip-balms': 'from-[#F2DDD5] to-[#FAF0EC]',
  'face-packs': 'from-[#D8E8D4] to-[#EFF5ED]',
  'gift-combos': 'from-[#E6DDE8] to-[#F5F0F7]',
}

export default function SkincareStorePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null)
  const [cart, setCart] = useState<{ product: DemoProduct; qty: number }[]>([])
  const [cartOpen, setCartOpen] = useState(false)

  const filteredProducts =
    activeCategory === 'all'
      ? store.products
      : store.products.filter((p) => p.category === activeCategory)

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const addToCart = (product: DemoProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const waLink = (text: string) =>
    `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(text)}`

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8E4DC]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-semibold text-[#2D5F3E] tracking-tight">
              {store.name}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#5A6B5A]">
            <a href="#ingredients" className="hover:text-[#2D5F3E] transition-colors">
              Ingredients
            </a>
            <a href="#products" className="hover:text-[#2D5F3E] transition-colors">
              Products
            </a>
            <a href="#reviews" className="hover:text-[#2D5F3E] transition-colors">
              Reviews
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={waLink('Hi! I would like to know more about your products.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:scale-110 transition-transform"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[#2D5F3E] hover:scale-110 transition-transform"
              aria-label="Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#C67B5C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E8F0E4] via-[#F0EDE6] to-[#F7F5F0]">
        <div className="absolute top-8 left-8 text-5xl opacity-20 select-none">🍃</div>
        <div className="absolute bottom-12 right-12 text-6xl opacity-15 select-none">🌿</div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-10 select-none">🌸</div>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center relative z-10">
          <p className="text-[#8B9467] text-sm tracking-[0.2em] uppercase mb-4 font-medium">
            Handmade with Love
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#2D5F3E] mb-6 leading-tight">
            {store.tagline}
          </h1>
          <p className="text-[#5A6B5A] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {store.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#products"
              className="px-8 py-3.5 bg-[#2D5F3E] text-white rounded-full font-medium hover:bg-[#3B7A52] transition-colors"
            >
              Shop Now
            </a>
            <a
              href={waLink('Hi! I would like to enquire about your natural skincare products.')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border-2 border-[#2D5F3E] text-[#2D5F3E] rounded-full font-medium hover:bg-[#2D5F3E] hover:text-white transition-colors"
            >
              Send Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* Ingredient Spotlight */}
      <section id="ingredients" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D5F3E] text-center mb-3">
            Our Star Ingredients
          </h2>
          <p className="text-[#8B9467] text-center mb-12">
            Nature&apos;s finest, carefully sourced for your skin
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {ingredientSpotlight.map((ing) => (
              <div
                key={ing.name}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-[#F7F5F0] flex items-center justify-center text-3xl mb-3 group-hover:bg-[#E8F0E4] transition-colors border border-[#E8E4DC]">
                  {ing.emoji}
                </div>
                <h3 className="font-semibold text-[#2D5F3E] text-sm mb-1">{ing.name}</h3>
                <p className="text-xs text-[#8B9467] leading-snug">{ing.benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Nav + Products */}
      <section id="products" className="py-16 md:py-20 bg-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D5F3E] text-center mb-3">
            Our Products
          </h2>
          <p className="text-[#8B9467] text-center mb-10">
            Crafted from pure, natural ingredients
          </p>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-hide justify-start md:justify-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#2D5F3E] text-white'
                  : 'text-[#5A6B5A] hover:text-[#2D5F3E] bg-white border border-[#E8E4DC]'
              }`}
            >
              All
            </button>
            {store.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#2D5F3E] text-white'
                    : 'text-[#5A6B5A] hover:text-[#2D5F3E] bg-white border border-[#E8E4DC]'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden hover:border-[#A8B088] hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image placeholder */}
                <div
                  className={`relative aspect-square bg-gradient-to-br ${
                    productGradients[product.category] || 'from-[#E8E0D4] to-[#F5F0E8]'
                  } flex items-center justify-center`}
                >
                  <span className="text-5xl md:text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">
                    {productEmojis[product.category] || '🌿'}
                  </span>
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#2D5F3E] text-white text-xs px-3 py-1 rounded-full font-medium">
                      {product.badge}
                    </span>
                  )}
                </div>
                {/* Info */}
                <div className="p-4 md:p-5">
                  {product.details?.['Skin Type'] && (
                    <span className="inline-block text-xs text-[#8B9467] bg-[#F7F5F0] px-2.5 py-1 rounded-full mb-2 font-medium">
                      {product.details['Skin Type']}
                    </span>
                  )}
                  <h3 className="font-semibold text-[#2D5F3E] text-sm md:text-base mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  {product.details?.['Key Ingredients'] && (
                    <p className="text-xs text-[#A8B088] mb-3 line-clamp-1">
                      {product.details['Key Ingredients']}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-[#2D5F3E]">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#B0A898] line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 text-xs md:text-sm py-2.5 border border-[#2D5F3E] text-[#2D5F3E] rounded-lg font-medium hover:bg-[#2D5F3E] hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 text-xs md:text-sm py-2.5 bg-[#C67B5C] text-white rounded-lg font-medium hover:bg-[#D4896B] transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Harsh Chemicals */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#E8F0E4] to-[#F0EDE6]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D5F3E] mb-3">
            No Harsh Chemicals. Ever.
          </h2>
          <p className="text-[#5A6B5A] mb-10 max-w-xl mx-auto">
            Every product is made with ingredients you can trust
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              { label: 'No SLS', icon: '✗' },
              { label: 'No Parabens', icon: '✗' },
              { label: 'No Artificial Colors', icon: '✗' },
              { label: 'Cruelty Free', icon: '🐰' },
              { label: 'Handmade with Love', icon: '💚' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="bg-white/80 backdrop-blur-sm border border-[#C5D4BE] rounded-xl px-6 py-4 flex items-center gap-3 shadow-sm"
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="font-semibold text-[#2D5F3E] text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D5F3E] text-center mb-3">
            What Our Customers Say
          </h2>
          <p className="text-[#8B9467] text-center mb-12">
            Real reviews from real people
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {store.testimonials.slice(0, 3).map((t, i) => (
              <div
                key={i}
                className="bg-[#FAFAF7] border border-[#E8E4DC] rounded-2xl p-6 hover:border-[#A8B088] transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className={s < t.rating ? 'text-[#C67B5C]' : 'text-[#E0DAD0]'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-[#5A6B5A] text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F0E4] flex items-center justify-center text-sm font-semibold text-[#2D5F3E]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#2D5F3E] text-sm">{t.name}</p>
                    <p className="text-xs text-[#8B9467]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Natural? */}
      <section className="py-16 md:py-20 bg-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D5F3E] text-center mb-3">
            Why Go Natural?
          </h2>
          <p className="text-[#8B9467] text-center mb-12">
            Your skin deserves ingredients from nature, not a lab
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌱',
                title: 'Gentle on Skin',
                desc: 'Natural ingredients work with your skin, not against it. No irritation, no side effects — just pure care.',
              },
              {
                icon: '🌍',
                title: 'Kind to the Planet',
                desc: 'Biodegradable ingredients, minimal packaging, and zero animal testing. Beauty that doesn\'t cost the earth.',
              },
              {
                icon: '✨',
                title: 'Real Results',
                desc: 'Ayurvedic wisdom meets modern skincare. Time-tested ingredients that actually work, naturally.',
              },
            ].map((point) => (
              <div key={point.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E8F0E4] flex items-center justify-center text-3xl mx-auto mb-5">
                  {point.icon}
                </div>
                <h3 className="font-semibold text-[#2D5F3E] text-lg mb-2">{point.title}</h3>
                <p className="text-sm text-[#5A6B5A] leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F0EDE6] border-t border-[#E0DAD0] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌿</span>
                <span className="text-lg font-semibold text-[#2D5F3E]">{store.name}</span>
              </div>
              <p className="text-sm text-[#5A6B5A] leading-relaxed">
                {store.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#2D5F3E] mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm text-[#5A6B5A]">
                <a href="#products" className="hover:text-[#2D5F3E] transition-colors">Shop All</a>
                <a href="#ingredients" className="hover:text-[#2D5F3E] transition-colors">Our Ingredients</a>
                <a href="#reviews" className="hover:text-[#2D5F3E] transition-colors">Reviews</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#2D5F3E] mb-4">Get in Touch</h4>
              <div className="flex flex-col gap-2 text-sm text-[#5A6B5A]">
                <a href={`mailto:${store.email}`} className="hover:text-[#2D5F3E] transition-colors">
                  {store.email}
                </a>
                <a
                  href={waLink('Hi! I have a question about your products.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D5F3E] transition-colors"
                >
                  WhatsApp Us
                </a>
                <a
                  href={`https://instagram.com/${store.instagramHandle?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2D5F3E] transition-colors"
                >
                  {store.instagramHandle} on Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-[#E0DAD0] pt-6 text-center text-xs text-[#8B9467]">
            &copy; {new Date().getFullYear()} {store.name}. All rights reserved. Made with 💚 in India.
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal image area */}
            <div
              className={`relative aspect-[4/3] bg-gradient-to-br ${
                productGradients[selectedProduct.category] || 'from-[#E8E0D4] to-[#F5F0E8]'
              } flex items-center justify-center rounded-t-2xl`}
            >
              <span className="text-7xl opacity-60">
                {productEmojis[selectedProduct.category] || '🌿'}
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-[#5A6B5A] hover:bg-white transition-colors"
              >
                ✕
              </button>
              {selectedProduct.badge && (
                <span className="absolute top-4 left-4 bg-[#2D5F3E] text-white text-xs px-3 py-1 rounded-full font-medium">
                  {selectedProduct.badge}
                </span>
              )}
            </div>
            {/* Modal body */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#2D5F3E] mb-2">{selectedProduct.name}</h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-[#2D5F3E]">₹{selectedProduct.price}</span>
                {selectedProduct.originalPrice && (
                  <span className="text-base text-[#B0A898] line-through">
                    ₹{selectedProduct.originalPrice}
                  </span>
                )}
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-[#C67B5C] font-medium">
                    {Math.round(
                      ((selectedProduct.originalPrice - selectedProduct.price) /
                        selectedProduct.originalPrice) *
                        100
                    )}
                    % off
                  </span>
                )}
              </div>
              <p className="text-sm text-[#5A6B5A] leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              {/* Details */}
              {selectedProduct.details && (
                <div className="space-y-3 mb-6">
                  {Object.entries(selectedProduct.details).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-start text-sm border-b border-[#F0EDE6] pb-2 last:border-0"
                    >
                      <span className="text-[#8B9467] font-medium">{key}</span>
                      <span className="text-[#2D5F3E] text-right max-w-[60%]">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedProduct)
                    setSelectedProduct(null)
                  }}
                  className="flex-1 py-3 bg-[#2D5F3E] text-white rounded-xl font-medium hover:bg-[#3B7A52] transition-colors"
                >
                  Add to Cart
                </button>
                <a
                  href={waLink(
                    `Hi! I'm interested in ${selectedProduct.name} (₹${selectedProduct.price}). Is it available?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20BD5A] transition-colors text-center"
                >
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Admin Button */}
      <a
        href="/admin/skincare?demo=true"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-[#2D5F3E] text-white rounded-full shadow-lg hover:bg-[#3A7A50] transition-all hover:scale-105 hover:shadow-xl group"
      >
        <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        <span className="text-sm font-medium">Try Admin Portal</span>
      </a>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E8E4DC]">
              <h2 className="text-lg font-semibold text-[#2D5F3E]">
                Your Cart ({cartCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F7F5F0] flex items-center justify-center text-[#5A6B5A] hover:bg-[#E8E4DC] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-5xl mb-4">🌿</span>
                  <p className="text-[#8B9467] text-sm">Your cart is empty</p>
                  <p className="text-[#B0A898] text-xs mt-1">Add some natural goodness!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-3 bg-[#FAFAF7] rounded-xl border border-[#E8E4DC]"
                    >
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-br ${
                          productGradients[item.product.category] || 'from-[#E8E0D4] to-[#F5F0E8]'
                        } flex items-center justify-center text-2xl flex-shrink-0`}
                      >
                        {productEmojis[item.product.category] || '🌿'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-[#2D5F3E] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-[#8B9467] mt-0.5">
                          ₹{item.product.price} x {item.qty}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              setCart((prev) =>
                                prev
                                  .map((c) =>
                                    c.product.id === item.product.id
                                      ? { ...c, qty: c.qty - 1 }
                                      : c
                                  )
                                  .filter((c) => c.qty > 0)
                              )
                            }
                            className="w-7 h-7 rounded-full border border-[#E0DAD0] flex items-center justify-center text-[#5A6B5A] hover:bg-[#E8E4DC] text-sm"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium text-[#2D5F3E]">{item.qty}</span>
                          <button
                            onClick={() =>
                              setCart((prev) =>
                                prev.map((c) =>
                                  c.product.id === item.product.id
                                    ? { ...c, qty: c.qty + 1 }
                                    : c
                                )
                              )
                            }
                            className="w-7 h-7 rounded-full border border-[#E0DAD0] flex items-center justify-center text-[#5A6B5A] hover:bg-[#E8E4DC] text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto text-xs text-[#C67B5C] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-[#E8E4DC]">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-[#2D5F3E]">Total</span>
                  <span className="text-xl font-bold text-[#2D5F3E]">₹{cartTotal}</span>
                </div>
                <a
                  href={waLink(
                    `Hi! I'd like to order:\n${cart
                      .map((item) => `- ${item.product.name} x${item.qty} (₹${item.product.price * item.qty})`)
                      .join('\n')}\n\nTotal: ₹${cartTotal}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-[#25D366] text-white rounded-xl font-medium hover:bg-[#20BD5A] transition-colors text-center"
                >
                  Order via WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
