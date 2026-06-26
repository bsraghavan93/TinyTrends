'use client'

import { useState, useEffect, useRef } from 'react'

const DEMO_STORE_URL = '/store'

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
  { name: 'Bakery & Cafe', icon: '🧁', color: 'from-amber-400/20 to-orange-400/20' },
  { name: 'Electronics', icon: '📱', color: 'from-blue-400/20 to-indigo-400/20' },
  { name: 'Grocery & Organic', icon: '🥬', color: 'from-green-400/20 to-emerald-400/20' },
  { name: 'Fashion Boutique', icon: '👗', color: 'from-pink-400/20 to-rose-400/20' },
  { name: 'Home & Furniture', icon: '🛋️', color: 'from-yellow-400/20 to-amber-400/20' },
  { name: 'Salon & Beauty', icon: '💇', color: 'from-purple-400/20 to-violet-400/20' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const { ref, visible } = useInView()
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    if (!visible) return
    const num = parseInt(target)
    if (isNaN(num)) { setDisplay(target); return }
    let current = 0
    const step = Math.ceil(num / 40)
    const interval = setInterval(() => {
      current = Math.min(current + step, num)
      setDisplay(String(current))
      if (current >= num) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [visible, target])
  return <span ref={ref}>{display}{suffix}</span>
}

export default function PortfolioPage() {
  const hero = useInView()
  const demos = useInView()
  const feats = useInView()
  const how = useInView()
  const why = useInView()

  return (
    <div className="min-h-screen bg-charcoal text-white overflow-hidden">
      {/* Animated grid background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 animate-grid-pulse" style={{
          backgroundImage: 'linear-gradient(rgba(78,205,196,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(78,205,196,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-coral-400/[0.03] rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-400/[0.03] rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-sunny-400/[0.02] rounded-full blur-[80px] animate-float" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-charcoal/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-coral-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-coral-400/20 group-hover:shadow-teal-400/30 transition-shadow duration-500 group-hover:scale-105 transform">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <span className="font-heading font-bold text-xl">
              Pixel<span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-teal-400">Craft</span> Studios
            </span>
          </div>
          <a
            href="https://wa.me/917904072714?text=Hi%2C%20I%20visited%20PixelCraft%20Studios%20and%20I%E2%80%99m%20interested%20in%20getting%20an%20online%20store."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-charcoal font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-teal-400/20 hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">Get Started</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section ref={hero.ref} className="relative pt-24 pb-32">
        {/* Orbiting element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] hidden lg:block">
          <div className="animate-orbit">
            <div className="w-3 h-3 bg-teal-400/30 rounded-full blur-sm" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] hidden lg:block" style={{ animationDirection: 'reverse' }}>
          <div className="animate-orbit" style={{ animationDuration: '30s' }}>
            <div className="w-2 h-2 bg-coral-400/30 rounded-full blur-sm" />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <div className={`inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/10 animate-glow ${hero.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-300">We build online stores that sell</span>
          </div>

          <h1 className={`font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${hero.visible ? 'animate-slide-in-up delay-100' : 'opacity-0'}`}>
            Your Business Deserves a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-sunny-400 to-teal-400 animate-gradient animate-text-glow">
              Stunning
            </span>{' '}
            Online Store
          </h1>

          <p className={`text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto ${hero.visible ? 'animate-slide-in-up delay-200' : 'opacity-0'}`}>
            We design and build fully-functional e-commerce stores with admin dashboards,
            payment integration, and order management — delivered in a week, tailored to your brand.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${hero.visible ? 'animate-slide-in-up delay-300' : 'opacity-0'}`}>
            <a
              href={DEMO_STORE_URL}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-coral-400 to-coral-500 hover:from-coral-500 hover:to-coral-600 text-white font-bold px-10 py-5 rounded-full shadow-lg shadow-coral-400/20 transition-all hover:shadow-xl hover:shadow-coral-400/30 hover:-translate-y-1 text-lg"
            >
              <span>Take a Demo Tour</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="https://wa.me/917904072714?text=Hi%2C%20I%20visited%20PixelCraft%20Studios%20and%20I%E2%80%99m%20interested%20in%20getting%20an%20online%20store."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-5 rounded-full border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
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
      <section ref={demos.ref} className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-14 ${demos.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="text-teal-400 font-semibold text-sm tracking-widest uppercase mb-3 block">Live Demos</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Explore our live demo stores. Browse products, add to cart, place orders — experience the full flow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Live Demo - Kids Wear */}
            <a
              href={DEMO_STORE_URL}
              className={`group relative bg-gradient-to-br from-coral-400/10 to-teal-400/10 rounded-2xl p-8 border border-white/10 hover:border-coral-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-coral-400/10 cursor-pointer ${demos.visible ? 'animate-scale-in delay-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 rounded-2xl animate-shimmer" />
              <div className="absolute top-4 right-4 bg-teal-400 text-charcoal text-xs font-bold px-3 py-1 rounded-full animate-pulse">LIVE</div>
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">👶</div>
              <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-coral-400 transition-colors">Kids Wear Store</h3>
              <p className="text-sm text-gray-400 mb-6">Full e-commerce with product catalog, cart, checkout, WhatsApp orders & admin dashboard.</p>
              <span className="inline-flex items-center gap-2 text-coral-400 font-semibold text-sm group-hover:gap-3 transition-all">
                Explore Demo <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </span>
            </a>

            {/* Coming Soon - Blurred */}
            {upcomingStores.slice(0, 2).map((store, i) => (
              <div
                key={store.name}
                className={`relative bg-gradient-to-br ${store.color} rounded-2xl p-8 border border-white/5 select-none ${demos.visible ? `animate-scale-in delay-${(i + 2) * 100}` : 'opacity-0'}`}
              >
                <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[3px] rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 inline-block mb-2 animate-pulse">
                      <span className="text-sm font-semibold text-gray-300">Coming Soon</span>
                    </div>
                    <p className="text-xs text-gray-500">Under Development</p>
                  </div>
                </div>
                <div className="text-5xl mb-4 opacity-40">{store.icon}</div>
                <h3 className="font-heading font-bold text-xl text-white/40 mb-2">{store.name}</h3>
                <p className="text-sm text-gray-600">Full-featured store with industry-specific features.</p>
              </div>
            ))}
          </div>

          {/* More Coming Soon Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {upcomingStores.slice(2).map((store, i) => (
              <div
                key={store.name}
                className={`group relative bg-gradient-to-br ${store.color} rounded-xl p-5 border border-white/5 select-none hover:border-white/10 transition-all ${demos.visible ? `animate-scale-in delay-${(i + 4) * 100}` : 'opacity-0'}`}
              >
                <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-[3px] rounded-xl flex items-center justify-center z-10">
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
      <section ref={feats.ref} className="py-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-400/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className={`text-center mb-14 ${feats.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="text-coral-400 font-semibold text-sm tracking-widest uppercase mb-3 block">Features</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Everything You Need to Sell Online</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Every store comes packed with features to run and grow your business.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`bg-white/[0.03] backdrop-blur-sm rounded-xl p-5 text-center border border-white/5 hover:border-teal-400/30 hover:bg-white/[0.06] transition-all duration-500 group hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-400/5 ${feats.visible ? `animate-scale-in` : 'opacity-0'}`}
                style={{ animationDelay: feats.visible ? `${i * 0.06}s` : '0s' }}
              >
                <span className="text-3xl mb-3 block group-hover:scale-125 transition-transform duration-500">{f.icon}</span>
                <p className="text-sm font-semibold text-white mb-1">{f.label}</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={how.ref} className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`text-center mb-16 ${how.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="text-sunny-400 font-semibold text-sm tracking-widest uppercase mb-3 block">Process</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Idea to Live Store</h2>
            <p className="text-gray-400">3 simple steps. That&apos;s it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-coral-400/20 via-teal-400/20 to-sunny-400/20" />

            {[
              { step: '01', title: 'Tell Us Your Vision', desc: 'Share your brand, products, and goals. We listen and plan.', color: 'from-coral-400 to-coral-500' },
              { step: '02', title: 'We Build It', desc: 'Our team designs and develops your store in under a week.', color: 'from-teal-400 to-teal-500' },
              { step: '03', title: 'You Go Live', desc: 'Launch your store, start selling, and grow your business.', color: 'from-sunny-400 to-sunny-500' },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`text-center relative ${how.visible ? 'animate-slide-in-up' : 'opacity-0'}`}
                style={{ animationDelay: how.visible ? `${i * 0.15}s` : '0s' }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg hover:scale-110 transition-transform duration-300 cursor-default`}>
                  <span className="text-white font-heading font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section ref={why.ref} className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-3xl p-10 md:p-14 text-center backdrop-blur-sm hover:border-white/15 transition-all duration-500 ${why.visible ? 'animate-scale-in' : 'opacity-0'}`}>
            <span className="text-teal-400 font-semibold text-sm tracking-widest uppercase mb-4 block">Why Us</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-10">Why Choose PixelCraft?</h2>

            <div className="grid sm:grid-cols-3 gap-8 mb-10">
              <div className="group">
                <p className="font-heading font-bold text-4xl text-coral-400 mb-1">
                  <AnimatedCounter target="7" /> <span className="text-2xl">Days</span>
                </p>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">From start to launch</p>
              </div>
              <div className="group">
                <p className="font-heading font-bold text-4xl text-teal-400 mb-1">
                  <AnimatedCounter target="100" suffix="%" />
                </p>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Customized to your brand</p>
              </div>
              <div className="group">
                <p className="font-heading font-bold text-4xl text-sunny-400 mb-1">24/7</p>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Ongoing support</p>
              </div>
            </div>

            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              We don&apos;t use templates. Every store is designed from scratch to match your brand identity, your products, and your customers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/917904072714?text=Hi%2C%20I%E2%80%99m%20interested%20in%20getting%20an%20online%20store%20for%20my%20business.%20Let%E2%80%99s%20discuss!"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-charcoal font-bold px-10 py-4 rounded-full shadow-lg shadow-teal-400/20 transition-all hover:shadow-xl hover:shadow-teal-400/30 hover:-translate-y-1"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Let&apos;s Build Your Store
              </a>
              <a
                href="mailto:bsraghavan93@gmail.com?subject=Website%20Inquiry%20-%20PixelCraft%20Studios"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-coral-400 to-teal-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">PC</span>
              </div>
              <span className="font-heading font-bold">
                Pixel<span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-teal-400">Craft</span> Studios
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="mailto:bsraghavan93@gmail.com" className="hover:text-white transition-colors">bsraghavan93@gmail.com</a>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">+91 79040 72714</span>
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
