'use client'

import { useState } from 'react'
import store from '@/data/bakery'
import type { DemoProduct } from '@/lib/demo-store-types'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface CartItem {
  product: DemoProduct
  quantity: number
  selectedVariants: Record<string, string>
}

/* ------------------------------------------------------------------ */
/*  Pastel gradient palette for product image placeholders             */
/* ------------------------------------------------------------------ */
const gradients = [
  'from-pink-200 to-purple-200',
  'from-orange-200 to-yellow-200',
  'from-rose-200 to-pink-200',
  'from-amber-200 to-orange-200',
  'from-violet-200 to-fuchsia-200',
  'from-pink-200 to-rose-200',
  'from-yellow-200 to-amber-200',
  'from-fuchsia-200 to-purple-200',
]

const emojiMap: Record<string, string> = {
  'birthday-cakes': '🎂',
  cupcakes: '🧁',
  brownies: '🍫',
  cookies: '🍪',
  'dessert-boxes': '🎁',
}

const WA_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'

const IG_PATH =
  'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'

function WaIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d={WA_PATH} />
    </svg>
  )
}

function IgIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d={IG_PATH} />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default function BakeryStorePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<DemoProduct | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [modalVariants, setModalVariants] = useState<Record<string, string>>({})

  /* ---- helpers ---- */
  const filteredProducts = activeCategory
    ? store.products.filter((p) => p.category === activeCategory)
    : store.products

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0)
  const cartTotal = cart.reduce((s, c) => s + c.product.price * c.quantity, 0)

  function addToCart(product: DemoProduct, variants: Record<string, string> = {}) {
    setCart((prev) => {
      const key = product.id + JSON.stringify(variants)
      const idx = prev.findIndex(
        (c) => c.product.id + JSON.stringify(c.selectedVariants) === key
      )
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 }
        return copy
      }
      return [...prev, { product, quantity: 1, selectedVariants: variants }]
    })
  }

  function removeFromCart(index: number) {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  function openModal(product: DemoProduct) {
    const defaults: Record<string, string> = {}
    product.variants?.forEach((v) => {
      defaults[v.label] = v.options[0]
    })
    setModalVariants(defaults)
    setSelectedProduct(product)
  }

  function waLink(text: string) {
    return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(text)}`
  }

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans text-[#5C3317]">
      {/* ========== NAVBAR ========== */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="text-2xl">{'🧁'}</span>
            <span className="bg-gradient-to-r from-[#F4845F] to-[#C084FC] bg-clip-text text-transparent">
              SweetCrumb Bakery
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href={`https://instagram.com/${store.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B5E3C] transition hover:text-[#F4845F]"
              aria-label="Instagram"
            >
              <IgIcon />
            </a>
            {/* WhatsApp */}
            <a
              href={waLink('Hi! I want to order from SweetCrumb Bakery')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B5E3C] transition hover:text-green-600"
              aria-label="WhatsApp"
            >
              <WaIcon />
            </a>
            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full bg-[#FEF3E2] p-2 transition hover:bg-[#F4845F]/20"
            >
              <svg className="h-5 w-5 text-[#5C3317]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F4845F] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative bg-gradient-to-br from-[#F4845F]/20 via-[#D8B4FE]/20 to-[#FF8C69]/20 pb-20 pt-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#E8725C]">
            Homemade Goodness
          </p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            Baked with <span className="text-[#F4845F]">Love</span>, <br className="hidden sm:block" />
            Delivered with <span className="text-[#C084FC]">Joy</span>
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-lg text-[#8B5E3C]">
            {store.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#products"
              className="rounded-full bg-[#F4845F] px-8 py-3 font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              Order Now {'🍰'}
            </a>
            <a
              href="#custom-order"
              className="rounded-full border-2 border-[#C084FC] px-8 py-3 font-bold text-[#C084FC] transition hover:scale-105 hover:bg-[#C084FC] hover:text-white"
            >
              Custom Cake {'🎂'}
            </a>
          </div>
        </div>
        {/* Wavy bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V100H0V40Z"
              fill="#FFFBF0"
            />
          </svg>
        </div>
      </section>

      {/* ========== CATEGORY STICKERS ========== */}
      <section className="mx-auto -mt-2 max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-center text-2xl font-extrabold">
          What are you craving? {'🤤'}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 rounded-full px-6 py-3 text-sm font-bold transition hover:scale-105 ${
              activeCategory === null
                ? 'bg-[#F4845F] text-white shadow-lg'
                : 'bg-white text-[#5C3317] shadow-md hover:shadow-lg'
            }`}
          >
            {'✨'} All Items
          </button>
          {store.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`flex-shrink-0 rounded-full px-6 py-3 text-sm font-bold transition hover:scale-105 ${
                activeCategory === cat.id
                  ? 'bg-[#F4845F] text-white shadow-lg'
                  : 'bg-white text-[#5C3317] shadow-md hover:shadow-lg'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ========== PRODUCT GRID ========== */}
      <section id="products" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {filteredProducts.map((product, i) => (
            <div
              key={product.id}
              className="group cursor-pointer rounded-3xl bg-white shadow-md transition hover:scale-[1.03] hover:shadow-xl"
              onClick={() => openModal(product)}
            >
              {/* Image placeholder */}
              <div
                className={`relative flex h-40 items-center justify-center rounded-t-3xl bg-gradient-to-br sm:h-48 ${gradients[i % gradients.length]}`}
              >
                <span className="text-5xl sm:text-6xl">
                  {emojiMap[product.category] || '🍰'}
                </span>
                {product.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#F4845F] px-3 py-1 text-[10px] font-bold uppercase text-white shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>
              {/* Info */}
              <div className="p-3 sm:p-4">
                <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-snug sm:text-base">
                  {product.name}
                </h3>
                {product.variants?.find((v) => v.label === 'Type') && (
                  <p className="mb-2 text-[11px] text-[#8B5E3C]/70">
                    {product.variants
                      .find((v) => v.label === 'Type')!
                      .options.join(' / ')}
                  </p>
                )}
                <div className="mb-3 flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-[#F4845F]">
                    {'₹'}{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {'₹'}{product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const defaults: Record<string, string> = {}
                      product.variants?.forEach((v) => {
                        defaults[v.label] = v.options[0]
                      })
                      addToCart(product, defaults)
                    }}
                    className="flex-1 rounded-full bg-[#F4845F] py-2 text-xs font-bold text-white transition hover:bg-[#E8725C] sm:text-sm"
                  >
                    Add to Cart
                  </button>
                  <a
                    href={waLink(`Hi! I'd like to order: ${product.name} (${'₹'}${product.price})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center rounded-full bg-green-500 px-3 text-white transition hover:bg-green-600"
                    aria-label="Order on WhatsApp"
                  >
                    <WaIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== PRODUCT MODAL ========== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <div
              className={`mb-6 flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br ${
                gradients[store.products.indexOf(selectedProduct) % gradients.length]
              }`}
            >
              <span className="text-7xl">
                {emojiMap[selectedProduct.category] || '🍰'}
              </span>
            </div>

            {selectedProduct.badge && (
              <span className="mb-3 inline-block rounded-full bg-[#F4845F] px-4 py-1 text-xs font-bold uppercase text-white">
                {selectedProduct.badge}
              </span>
            )}

            <h3 className="mb-2 text-2xl font-extrabold">{selectedProduct.name}</h3>
            <p className="mb-4 text-sm text-[#8B5E3C]/80">{selectedProduct.description}</p>

            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#F4845F]">
                {'₹'}{selectedProduct.price}
              </span>
              {selectedProduct.originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  {'₹'}{selectedProduct.originalPrice}
                </span>
              )}
            </div>

            {/* Variants */}
            {selectedProduct.variants?.map((variant) => (
              <div key={variant.label} className="mb-4">
                <p className="mb-2 text-sm font-bold">{variant.label}</p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setModalVariants((prev) => ({ ...prev, [variant.label]: opt }))
                      }
                      className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
                        modalVariants[variant.label] === opt
                          ? 'border-[#F4845F] bg-[#F4845F]/10 text-[#F4845F]'
                          : 'border-gray-200 text-[#5C3317] hover:border-[#F4845F]/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Details */}
            {selectedProduct.details && (
              <div className="mb-6 rounded-2xl bg-[#FEF3E2] p-4">
                <p className="mb-2 text-sm font-bold">Product Details</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedProduct.details).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-xs text-[#8B5E3C]/60">{k}</span>
                      <p className="text-sm font-semibold">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(selectedProduct, modalVariants)
                  setSelectedProduct(null)
                }}
                className="flex-1 rounded-full bg-[#F4845F] py-3 font-bold text-white transition hover:scale-105 hover:bg-[#E8725C]"
              >
                Add to Cart
              </button>
              <a
                href={waLink(
                  `Hi! I'd like to order:\n${selectedProduct.name}\n${
                    Object.entries(modalVariants)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join('\n')
                  }\nPrice: ${'₹'}${selectedProduct.price}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 font-bold text-white transition hover:scale-105 hover:bg-green-600"
              >
                <WaIcon />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========== CART SIDEBAR ========== */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-[60] flex justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Your Cart {'🛒'}</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="mb-4 text-6xl">{'🧁'}</span>
                <p className="text-lg font-bold text-[#8B5E3C]">Your cart is empty</p>
                <p className="text-sm text-[#8B5E3C]/60">Add some goodies!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl bg-[#FEF3E2] p-4"
                    >
                      <div
                        className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                          gradients[store.products.findIndex((p) => p.id === item.product.id) % gradients.length]
                        }`}
                      >
                        <span className="text-2xl">
                          {emojiMap[item.product.category] || '🍰'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold leading-snug">{item.product.name}</h4>
                        {Object.keys(item.selectedVariants).length > 0 && (
                          <p className="text-xs text-[#8B5E3C]/60">
                            {Object.values(item.selectedVariants).join(' / ')}
                          </p>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="font-bold text-[#F4845F]">
                            {'₹'}{item.product.price} x {item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-xs text-red-400 transition hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#F4845F]/20 pt-4">
                  <div className="mb-4 flex items-center justify-between text-lg font-extrabold">
                    <span>Total</span>
                    <span className="text-[#F4845F]">{'₹'}{cartTotal}</span>
                  </div>
                  <a
                    href={waLink(
                      `Hi! I'd like to place an order:\n\n${cart
                        .map(
                          (item) =>
                            `${item.product.name}${
                              Object.keys(item.selectedVariants).length
                                ? ` (${Object.values(item.selectedVariants).join(', ')})`
                                : ''
                            } x${item.quantity} - ${'₹'}${item.product.price * item.quantity}`
                        )
                        .join('\n')}\n\nTotal: ${'₹'}${cartTotal}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-full bg-green-500 py-3 text-center font-bold text-white transition hover:scale-105 hover:bg-green-600"
                  >
                    Order via WhatsApp {'📩'}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========== CUSTOM ORDER BANNER ========== */}
      <section id="custom-order" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#D8B4FE]/30 via-[#FEF3E2] to-[#F4845F]/20 p-8 text-center sm:p-12">
          <span className="mb-4 inline-block text-5xl">{'🎂'}</span>
          <h2 className="mb-2 text-3xl font-extrabold">Got a Special Occasion?</h2>
          <p className="mx-auto mb-8 max-w-md text-[#8B5E3C]">
            We make custom cakes for birthdays, weddings, anniversaries & more. Tell us what you need!
          </p>

          <div className="mx-auto grid max-w-lg gap-4 text-left sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold">Your Name {'👤'}</label>
              <input
                type="text"
                placeholder="e.g. Priya"
                className="w-full rounded-xl border-2 border-[#D8B4FE]/40 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C084FC]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Occasion {'🎉'}</label>
              <input
                type="text"
                placeholder="Birthday, Wedding..."
                className="w-full rounded-xl border-2 border-[#D8B4FE]/40 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C084FC]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Flavor Preference {'🍰'}</label>
              <input
                type="text"
                placeholder="Chocolate, Vanilla..."
                className="w-full rounded-xl border-2 border-[#D8B4FE]/40 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#C084FC]"
              />
            </div>
            <div className="flex items-end">
              <a
                href={waLink('Hi! I need a custom cake order. Here are my details:')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3 font-bold text-white transition hover:scale-105 hover:bg-green-600"
              >
                <WaIcon />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DELIVERY INFO ========== */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-8 text-center text-2xl font-extrabold">
          Why Choose Us? {'💖'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              emoji: '🚗',
              title: 'Same Day Delivery',
              desc: 'Order before 2 PM and get it delivered the same day. Fresh from our kitchen to your doorstep.',
            },
            {
              emoji: '📦',
              title: 'Safe Packaging',
              desc: 'Every item is carefully packed to ensure it reaches you in perfect condition.',
            },
            {
              emoji: '🌿',
              title: '100% Fresh',
              desc: 'No preservatives. Made fresh with premium ingredients for every order.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-white p-8 text-center shadow-md transition hover:scale-105 hover:shadow-xl"
            >
              <span className="mb-4 inline-block text-5xl">{item.emoji}</span>
              <h3 className="mb-2 text-lg font-extrabold">{item.title}</h3>
              <p className="text-sm text-[#8B5E3C]/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="bg-gradient-to-br from-[#D8B4FE]/10 to-[#F4845F]/10 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-extrabold">
            What Our Customers Say {'😍'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {store.testimonials.map((t, i) => {
              const pastelBgs = [
                'bg-pink-50',
                'bg-purple-50',
                'bg-orange-50',
                'bg-amber-50',
                'bg-rose-50',
              ]
              return (
                <div
                  key={i}
                  className={`rounded-3xl ${pastelBgs[i % pastelBgs.length]} p-6 shadow-md transition hover:scale-105 hover:shadow-xl`}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4845F] text-sm font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-[#8B5E3C]/60">{t.location}</p>
                    </div>
                  </div>
                  <div className="mb-2 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg
                        key={s}
                        className={`h-4 w-4 ${s < t.rating ? 'text-amber-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-[#5C3317]/80">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========== INSTAGRAM SECTION ========== */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-3xl bg-gradient-to-r from-[#F4845F]/20 via-[#D8B4FE]/20 to-[#FF8C69]/20 p-10">
            <span className="mb-4 inline-block text-5xl">{'📸'}</span>
            <h2 className="mb-2 text-2xl font-extrabold">Follow Us for Daily Baking Updates!</h2>
            <p className="mb-6 text-[#8B5E3C]/70">
              Behind-the-scenes, new flavors, and customer celebrations
            </p>
            <a
              href={`https://instagram.com/${store.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F4845F] to-[#C084FC] px-8 py-3 font-bold text-white transition hover:scale-105 hover:shadow-xl"
            >
              <IgIcon />
              {store.instagramHandle}
            </a>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-[#FEF3E2] py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-xl font-extrabold">
                <span className="text-2xl">{'🧁'}</span>
                <span className="bg-gradient-to-r from-[#F4845F] to-[#C084FC] bg-clip-text text-transparent">
                  SweetCrumb Bakery
                </span>
              </div>
              <p className="text-sm text-[#8B5E3C]/70">{store.description}</p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="mb-3 font-bold">Quick Links</h4>
              <ul className="space-y-2 text-sm text-[#8B5E3C]/70">
                <li>
                  <a href="#products" className="transition hover:text-[#F4845F]">
                    Our Menu
                  </a>
                </li>
                <li>
                  <a href="#custom-order" className="transition hover:text-[#F4845F]">
                    Custom Orders
                  </a>
                </li>
                <li>
                  <a
                    href={`https://instagram.com/${store.instagramHandle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-[#F4845F]"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="mb-3 font-bold">Contact Us</h4>
              <ul className="space-y-2 text-sm text-[#8B5E3C]/70">
                <li className="flex items-center gap-2">
                  <span>{'📧'}</span> {store.email}
                </li>
                <li className="flex items-center gap-2">
                  <span>{'📱'}</span>
                  <a
                    href={waLink('Hi! I have a question.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-[#F4845F]"
                  >
                    WhatsApp Us
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span>{'📍'}</span> Bangalore, India
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[#F4845F]/10 pt-6 text-center text-xs text-[#8B5E3C]/50">
            Made with {'❤️'} by SweetCrumb Bakery &bull; Powered by TinyTrends
          </div>
        </div>
      </footer>
    </div>
  )
}
