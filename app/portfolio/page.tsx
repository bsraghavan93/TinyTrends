'use client'

import Link from 'next/link'

const DEMO_STORE_URL = 'https://tinytrend-kids.vercel.app'

const features = [
  { label: 'Product Management', icon: '📦', desc: 'Add, edit & organize your entire catalog' },
  { label: 'Order Tracking', icon: '📋', desc: 'Real-time order status & history' },
  { label: 'UPI Payments', icon: '💳', desc: 'Seamless UPI & payment gateway integration' },
  { label: 'WhatsApp Orders', icon: '💬', desc: 'Instant order notifications on WhatsApp' },
  { label: 'Mobile Optimized', icon: '📱', desc: 'Beautiful on every screen size' },
  { label: 'Admin Dashboard', icon: '📊', desc: 'Manage everything from one place' },
  { label: 'Revenue Dashboard', icon: '💰', desc: 'Track sales, revenue & growth' },
  { label: 'Stock Control', icon: '🏷️', desc: 'Size & color level inventory' },
  { label: 'Email Alerts', icon: '📧', desc: 'Order confirmations & notifications' },
  { label: 'Fully Customizable', icon: '🎨', desc: 'Every page tailored to your brand' },
]

const upcomingStores = [
  { name: 'Bakery & Cafe Store', icon: '🧁', color: 'from-amber-400/20 to-orange-400/20' },
  { name: 'Electronics Store', icon: '📱', color: 'from-blue-400/20 to-indigo-400/20' },
  { name: 'Grocery & Organic', icon: '🥬', color: 'from-green-400/20 to-emerald-400/20' },
  { name: 'Fashion Boutique', icon: '👗', color: 'from-pink-400/20 to-rose-400/20' },
  { name: 'Home & Furniture', icon: '🛋️', color: 'from-yellow-400/20 to-amber-400/20' },
  { name: 'Salon & Beauty', icon: '💇', color: 'from-purple-400/20 to-violet-400/20' },
]

const process_steps = [
  { step: '01', title: 'Tell Us Your Vision', desc: 'Share your brand, products, and goals. We listen and plan.' },
  { step: '02', title: 'We Build It', desc: 'Our team designs and develops your store in under a week.' },
  { step: '03', title: 'You Go Live', desc: 'Launch your store, start selling, and grow your business.' },
]

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-coral-400 to-teal-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <span className="font-heading font-bold text-lg">
              Pixel<span className="text-coral-400">Craft</span> Studios
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/917904072714?text=Hi%2C%20I%20visited%20PixelCraft%20Studios%20and%20I%E2%80%99m%20interested%20in%20getting%20an%20online%20store."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-charcoal font-semibold px-5 py-2.5 rounded-full text-sm transition-all"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 bg-coral-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/10">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300">We build online stores that sell</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Your Business Deserves a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-teal-400">
              Stunning
            </span>{' '}
            Online Store
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            We design and build fully-functional e-commerce stores with admin dashboards,
            payment integration, and order management — delivered in a week, tailored to your brand.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={DEMO_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 text-white font-bold px-10 py-5 rounded-full shadow-lg shadow-coral-400/20 transition-all hover:shadow-xl hover:-translate-y-0.5 text-lg"
            >
              <span>Take a Demo Tour</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="https://wa.me/917904072714?text=Hi%2C%20I%20visited%20PixelCraft%20Studios%20and%20I%E2%80%99m%20interested%20in%20getting%20an%20online%20store."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-5 rounded-full border border-white/20 transition-all hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Live Demo Showcase */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Explore our live demo stores. Browse products, add to cart, place orders — experience the full flow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Live Demo - Kids Wear */}
            <a
              href={DEMO_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-br from-coral-400/10 to-teal-400/10 rounded-2xl p-8 border border-white/10 hover:border-coral-400/30 transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="absolute top-4 right-4 bg-teal-400 text-charcoal text-xs font-bold px-3 py-1 rounded-full">LIVE</div>
              <div className="text-5xl mb-4">👶</div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">Kids Wear Store</h3>
              <p className="text-sm text-gray-400 mb-4">Full e-commerce store with product catalog, cart, checkout, WhatsApp orders, and admin dashboard.</p>
              <span className="inline-flex items-center gap-1 text-coral-400 font-semibold text-sm group-hover:gap-2 transition-all">
                Explore Demo <span>&rarr;</span>
              </span>
            </a>

            {/* Coming Soon Stores - Blurred */}
            {upcomingStores.slice(0, 2).map((store) => (
              <div
                key={store.name}
                className={`relative bg-gradient-to-br ${store.color} rounded-2xl p-8 border border-white/5 select-none`}
              >
                <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block mb-2">
                      <span className="text-sm font-semibold text-gray-300">Coming Soon</span>
                    </div>
                    <p className="text-xs text-gray-500">Under Development</p>
                  </div>
                </div>
                <div className="text-5xl mb-4 opacity-40">{store.icon}</div>
                <h3 className="font-heading font-bold text-xl text-white/40 mb-2">{store.name}</h3>
                <p className="text-sm text-gray-600">Full-featured store with industry-specific features and integrations.</p>
              </div>
            ))}
          </div>

          {/* More Coming Soon Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {upcomingStores.slice(2).map((store) => (
              <div
                key={store.name}
                className={`relative bg-gradient-to-br ${store.color} rounded-xl p-5 border border-white/5 select-none`}
              >
                <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
                  <span className="text-xs font-semibold text-gray-400 bg-white/10 px-3 py-1 rounded-full">Coming Soon</span>
                </div>
                <div className="text-3xl mb-2 opacity-40">{store.icon}</div>
                <h4 className="font-semibold text-sm text-white/40">{store.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Everything You Need to Sell Online</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Every store comes packed with features to run and grow your business.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {features.map((f) => (
              <div key={f.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10 hover:border-white/20 transition-all group">
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{f.icon}</span>
                <p className="text-sm font-semibold text-white mb-1">{f.label}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400">From idea to live store in 3 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {process_steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coral-400 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-heading font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-coral-400/10 to-teal-400/10 border border-white/10 rounded-3xl p-10 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Why Choose PixelCraft?</h2>
            <div className="grid sm:grid-cols-3 gap-8 mb-8">
              <div>
                <p className="font-heading font-bold text-3xl text-coral-400 mb-1">1 Week</p>
                <p className="text-sm text-gray-400">From start to launch</p>
              </div>
              <div>
                <p className="font-heading font-bold text-3xl text-teal-400 mb-1">100%</p>
                <p className="text-sm text-gray-400">Customized to your brand</p>
              </div>
              <div>
                <p className="font-heading font-bold text-3xl text-sunny-400 mb-1">Ongoing</p>
                <p className="text-sm text-gray-400">Maintenance & support packages</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              We don&apos;t use templates. Every store is designed from scratch to match your brand identity, your products, and your customers.
            </p>
            <a
              href="https://wa.me/917904072714?text=Hi%2C%20I%E2%80%99m%20interested%20in%20getting%20an%20online%20store%20for%20my%20business.%20Let%E2%80%99s%20discuss!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-charcoal font-bold px-10 py-4 rounded-full shadow-lg shadow-teal-400/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Let&apos;s Build Your Store
            </a>
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-teal-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">PC</span>
              </div>
              <span className="font-heading font-bold">
                Pixel<span className="text-coral-400">Craft</span> Studios
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="mailto:bsraghavan93@gmail.com" className="hover:text-white transition-colors">bsraghavan93@gmail.com</a>
              <span>|</span>
              <span>+91 79040 72714</span>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} PixelCraft Studios. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
