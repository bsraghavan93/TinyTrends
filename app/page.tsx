'use client'

import { useState, useEffect, useRef } from 'react'

const DEMO_STORE_URL = '/store'

const features = [
  { label: 'Product Management', icon: '📦', desc: 'Add, edit & organize your entire catalog', gradient: 'from-rose-500/20 to-pink-500/20', border: 'hover:border-rose-400/40' },
  { label: 'Order Tracking', icon: '📋', desc: 'Real-time order status & history', gradient: 'from-blue-500/20 to-cyan-500/20', border: 'hover:border-blue-400/40' },
  { label: 'UPI Payments', icon: '💳', desc: 'Seamless UPI & payment gateway integration', gradient: 'from-emerald-500/20 to-teal-500/20', border: 'hover:border-emerald-400/40' },
  { label: 'WhatsApp Orders', icon: '💬', desc: 'Instant order notifications on WhatsApp', gradient: 'from-green-500/20 to-lime-500/20', border: 'hover:border-green-400/40' },
  { label: 'Mobile Optimized', icon: '📱', desc: 'Beautiful on every screen size', gradient: 'from-violet-500/20 to-purple-500/20', border: 'hover:border-violet-400/40' },
  { label: 'Admin Dashboard', icon: '📊', desc: 'Manage everything from one place', gradient: 'from-amber-500/20 to-orange-500/20', border: 'hover:border-amber-400/40' },
  { label: 'Revenue Dashboard', icon: '💰', desc: 'Track sales, revenue & growth', gradient: 'from-yellow-500/20 to-amber-500/20', border: 'hover:border-yellow-400/40' },
  { label: 'Stock Control', icon: '🏷️', desc: 'Size & color level inventory', gradient: 'from-teal-500/20 to-cyan-500/20', border: 'hover:border-teal-400/40' },
  { label: 'Email Alerts', icon: '📧', desc: 'Order confirmations & notifications', gradient: 'from-indigo-500/20 to-blue-500/20', border: 'hover:border-indigo-400/40' },
  { label: 'Fully Customizable', icon: '🎨', desc: 'Every page tailored to your brand', gradient: 'from-fuchsia-500/20 to-pink-500/20', border: 'hover:border-fuchsia-400/40' },
]

const liveStores = [
  { name: 'Kids Wear Store', icon: '👶', href: '/store', adminHref: '/admin?demo=true', gradient: 'from-violet-500/[0.1] via-fuchsia-500/[0.05] to-cyan-500/[0.1]', desc: 'Trendy kids clothing — dresses, ethnic wear, accessories with full cart & checkout.', tag: 'TinyTrend Kids' },
  { name: 'Women\'s Boutique', icon: '👗', href: '/demos/boutique', adminHref: '/admin/boutique?demo=true', gradient: 'from-rose-500/[0.1] via-pink-500/[0.05] to-amber-500/[0.1]', desc: 'Sarees, kurtis, ethnic wear — elegant Indian boutique with editorial layouts.', tag: 'Varnika Boutique' },
  { name: 'Artificial Jewelry', icon: '💎', href: '/demos/jewelry', adminHref: '/admin/jewelry?demo=true', gradient: 'from-amber-500/[0.1] via-yellow-500/[0.05] to-amber-500/[0.1]', desc: 'Kundan, bridal sets, bangles — luxury dark-theme jewelry store with gold accents.', tag: 'Aadhya Jewels' },
  { name: 'Home Bakery', icon: '🧁', href: '/demos/bakery', adminHref: '/admin/bakery?demo=true', gradient: 'from-orange-500/[0.1] via-pink-500/[0.05] to-rose-500/[0.1]', desc: 'Cakes, brownies, cupcakes — cute pastel bakery with custom order forms.', tag: 'SweetCrumb Bakery' },
  { name: 'Handmade Skincare', icon: '🌿', href: '/demos/skincare', adminHref: '/admin/skincare?demo=true', gradient: 'from-emerald-500/[0.1] via-green-500/[0.05] to-teal-500/[0.1]', desc: 'Natural soaps, body butter, lip balms — clean earthy design with ingredient focus.', tag: 'Nila Naturals' },
]

const upcomingStores = [
  { name: 'Electronics', icon: '📱', gradient: 'from-blue-400/15 to-indigo-400/15' },
  { name: 'Grocery & Organic', icon: '🥬', gradient: 'from-green-400/15 to-emerald-400/15' },
  { name: 'Home & Furniture', icon: '🛋️', gradient: 'from-yellow-400/15 to-amber-400/15' },
  { name: 'Salon & Beauty', icon: '💇', gradient: 'from-purple-400/15 to-violet-400/15' },
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
    <div className="min-h-screen bg-[#0a0d1a] text-white overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0a0d1a]" />
        {/* Sweeping gradient that moves diagonally */}
        <div className="absolute inset-0 animate-bg-sweep opacity-70" style={{
          background: 'radial-gradient(ellipse 80% 60% at var(--sweep-x, 30%) var(--sweep-y, 30%), rgba(99,102,241,0.08) 0%, transparent 70%)',
        }} />
        {/* Pulsing grid */}
        <div className="absolute inset-0 animate-grid-pulse" style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        {/* Diagonal moving lines */}
        <div className="absolute inset-0 animate-lines-move opacity-[0.03]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(139,92,246,0.5) 40px, rgba(139,92,246,0.5) 41px)',
          backgroundSize: '200% 200%',
        }} />
      </div>

      {/* Animated moving orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-violet-600/[0.08] to-fuchsia-600/[0.05] rounded-full blur-[120px] animate-orb-drift-1" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/[0.07] to-blue-600/[0.04] rounded-full blur-[100px] animate-orb-drift-2" />
        <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-rose-500/[0.06] to-orange-500/[0.03] rounded-full blur-[100px] animate-orb-drift-3" />
        <div className="absolute w-[350px] h-[350px] bg-gradient-to-br from-emerald-500/[0.05] to-teal-500/[0.03] rounded-full blur-[90px] animate-orb-drift-4" />
        {/* Small bright moving particles */}
        <div className="absolute w-2 h-2 bg-violet-400/30 rounded-full blur-[1px] animate-particle-1" />
        <div className="absolute w-1.5 h-1.5 bg-cyan-400/25 rounded-full blur-[1px] animate-particle-2" />
        <div className="absolute w-2 h-2 bg-fuchsia-400/20 rounded-full blur-[1px] animate-particle-3" />
        <div className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-particle-4" />
        <div className="absolute w-1.5 h-1.5 bg-rose-400/25 rounded-full blur-[1px] animate-particle-5" />
      </div>

      {/* Nav — glass */}
      <nav className="sticky top-0 z-50 bg-[#0c0f1a]/60 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-fuchsia-500/30 transition-all duration-500 group-hover:scale-105">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <span className="font-heading font-bold text-xl">
              Pixel<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Craft</span> Studios
            </span>
          </div>
          <a
            href="https://wa.me/917904072714?text=Hi%2C%20I%20visited%20PixelCraft%20Studios%20and%20I%E2%80%99m%20interested%20in%20getting%20an%20online%20store."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
          >
            <span className="hidden sm:inline">Get Started</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section ref={hero.ref} className="relative pt-20 pb-28 md:pt-28 md:pb-36">
        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] hidden lg:block">
          <div className="animate-orbit">
            <div className="w-3 h-3 bg-violet-400/40 rounded-full blur-[2px] shadow-lg shadow-violet-400/30" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] hidden lg:block" style={{ animationDirection: 'reverse' }}>
          <div className="animate-orbit" style={{ animationDuration: '25s' }}>
            <div className="w-2 h-2 bg-cyan-400/40 rounded-full blur-[1px] shadow-lg shadow-cyan-400/30" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] hidden lg:block">
          <div className="animate-orbit" style={{ animationDuration: '35s' }}>
            <div className="w-1.5 h-1.5 bg-fuchsia-400/30 rounded-full blur-[1px]" />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          {/* Glass pill badge */}
          <div className={`inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl rounded-full px-5 py-2.5 mb-8 border border-white/[0.08] shadow-lg shadow-violet-500/5 ${hero.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-sm font-medium text-gray-300">We build online stores that sell</span>
          </div>

          <h1 className={`font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${hero.visible ? 'animate-slide-in-up delay-100' : 'opacity-0'}`}>
            Your Business Deserves a{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 animate-gradient">
                Stunning
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 rounded-full opacity-60 animate-shimmer" />
            </span>{' '}
            Online Store
          </h1>

          <p className={`text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed ${hero.visible ? 'animate-slide-in-up delay-200' : 'opacity-0'}`}>
            We design and build fully-functional e-commerce stores with admin dashboards,
            payment integration, and order management — delivered in a week, tailored to your brand.
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${hero.visible ? 'animate-slide-in-up delay-300' : 'opacity-0'}`}>
            <a
              href={DEMO_STORE_URL}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-[length:200%_100%] animate-gradient text-white font-bold px-10 py-5 rounded-full shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-fuchsia-500/30 hover:-translate-y-1 text-lg"
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
              className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl hover:bg-white/[0.1] text-white font-semibold px-8 py-5 rounded-full border border-white/[0.1] hover:border-violet-400/30 transition-all hover:-translate-y-1 shadow-lg shadow-black/10"
            >
              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact Us
            </a>
          </div>
        </div>

        {/* Decorative glow under hero */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </section>

      {/* Live Demo Showcase */}
      <section ref={demos.ref} className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-14 ${demos.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold text-sm tracking-widest uppercase mb-3">Live Demos</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Explore our live demo stores. Browse products, add to cart, place orders — experience the full flow.</p>
          </div>

          {/* Live Stores Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {liveStores.map((store, i) => (
              <div
                key={store.name}
                className={`group relative bg-gradient-to-br ${store.gradient} backdrop-blur-xl rounded-2xl p-7 border border-white/[0.1] hover:border-violet-400/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-500/10 overflow-hidden ${demos.visible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: demos.visible ? `${i * 0.08}s` : '0s' }}
              >
                <div className="absolute inset-0 animate-shimmer rounded-2xl opacity-50" />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg shadow-emerald-400/30 animate-pulse">LIVE</div>
                <div className="relative">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-500">{store.icon}</div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{store.tag}</p>
                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-violet-300 transition-colors">{store.name}</h3>
                  <p className="text-xs text-gray-400 mb-5 leading-relaxed">{store.desc}</p>
                  <div className="flex items-center gap-2">
                    <a href={store.href} className="inline-flex items-center gap-1.5 bg-white/[0.08] hover:bg-white/[0.14] backdrop-blur-sm text-white font-semibold px-4 py-2 rounded-full text-xs border border-white/[0.1] hover:border-violet-400/30 transition-all">
                      View Store <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </a>
                    <a href={store.adminHref} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-violet-400 text-xs font-medium transition-colors">
                      Admin Demo
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {upcomingStores.map((store, i) => (
              <div
                key={store.name}
                className={`group relative bg-gradient-to-br ${store.gradient} backdrop-blur-xl rounded-xl p-5 border border-white/[0.06] select-none hover:border-white/[0.1] transition-all overflow-hidden ${demos.visible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: demos.visible ? `${(i + 5) * 0.08}s` : '0s' }}
              >
                <div className="absolute inset-0 bg-[#0a0d1a]/50 backdrop-blur-[4px] rounded-xl flex items-center justify-center z-10">
                  <span className="text-xs font-semibold text-gray-400 bg-white/[0.08] backdrop-blur-sm px-3 py-1 rounded-full border border-white/[0.06]">Coming Soon</span>
                </div>
                <div className="text-3xl mb-2 opacity-30">{store.icon}</div>
                <h4 className="font-semibold text-sm text-white/30">{store.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get — colorful glass cards */}
      <section ref={feats.ref} className="py-24 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.02] to-transparent" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className={`text-center mb-14 ${feats.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 font-semibold text-sm tracking-widest uppercase mb-3">Features</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Everything You Need to Sell Online</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Every store comes packed with features to run and grow your business.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <div
                key={f.label}
                className={`bg-gradient-to-br ${f.gradient} backdrop-blur-xl rounded-xl p-5 text-center border border-white/[0.06] ${f.border} hover:bg-white/[0.06] transition-all duration-500 group hover:-translate-y-1 hover:shadow-lg overflow-hidden ${feats.visible ? 'animate-scale-in' : 'opacity-0'}`}
                style={{ animationDelay: feats.visible ? `${i * 0.06}s` : '0s' }}
              >
                <span className="text-3xl mb-3 block group-hover:scale-125 transition-transform duration-500 drop-shadow-md">{f.icon}</span>
                <p className="text-sm font-semibold text-white mb-1">{f.label}</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — with colorful gradient line */}
      <section ref={how.ref} className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`text-center mb-16 ${how.visible ? 'animate-slide-in-up' : 'opacity-0'}`}>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 font-semibold text-sm tracking-widest uppercase mb-3">Process</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Idea to Live Store</h2>
            <p className="text-gray-400">3 simple steps. That&apos;s it.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[2px]">
              <div className="w-full h-full bg-gradient-to-r from-violet-500/40 via-fuchsia-500/40 to-cyan-500/40 rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-sm" />
            </div>

            {[
              { step: '01', title: 'Tell Us Your Vision', desc: 'Share your brand, products, and goals. We listen and plan.', gradient: 'from-violet-500 to-fuchsia-500', shadow: 'shadow-violet-500/30', text: 'text-violet-400' },
              { step: '02', title: 'We Build It', desc: 'Our team designs and develops your store in under a week.', gradient: 'from-fuchsia-500 to-rose-500', shadow: 'shadow-fuchsia-500/30', text: 'text-fuchsia-400' },
              { step: '03', title: 'You Go Live', desc: 'Launch your store, start selling, and grow your business.', gradient: 'from-cyan-500 to-blue-500', shadow: 'shadow-cyan-500/30', text: 'text-cyan-400' },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`text-center relative ${how.visible ? 'animate-slide-in-up' : 'opacity-0'}`}
                style={{ animationDelay: how.visible ? `${i * 0.15}s` : '0s' }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl ${item.shadow} hover:scale-110 transition-transform duration-300 cursor-default rotate-3 hover:rotate-0`}>
                  <span className="text-white font-heading font-bold text-2xl">{item.step}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us — glass panel */}
      <section ref={why.ref} className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`relative bg-gradient-to-br from-violet-500/[0.08] via-fuchsia-500/[0.04] to-cyan-500/[0.08] backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-10 md:p-14 text-center overflow-hidden hover:border-violet-400/20 transition-all duration-500 ${why.visible ? 'animate-scale-in' : 'opacity-0'}`}>
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-br-3xl" />
            <div className="absolute inset-0 animate-shimmer opacity-30 rounded-3xl" />

            <div className="relative">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-semibold text-sm tracking-widest uppercase mb-4">Why Us</span>
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-10">Why Choose PixelCraft?</h2>

              <div className="grid sm:grid-cols-3 gap-8 mb-10">
                <div className="group">
                  <div className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.06] group-hover:border-violet-400/20 transition-all">
                    <p className="font-heading font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-1">
                      <AnimatedCounter target="7" /> <span className="text-2xl">Days</span>
                    </p>
                    <p className="text-sm text-gray-400">From start to launch</p>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.06] group-hover:border-cyan-400/20 transition-all">
                    <p className="font-heading font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-1">
                      <AnimatedCounter target="100" suffix="%" />
                    </p>
                    <p className="text-sm text-gray-400">Customized to your brand</p>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.06] group-hover:border-amber-400/20 transition-all">
                    <p className="font-heading font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-1">24/7</p>
                    <p className="text-sm text-gray-400">Ongoing support</p>
                  </div>
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
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-fuchsia-500/30 hover:-translate-y-1"
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
        </div>
      </section>

      {/* Footer — glass */}
      <footer className="border-t border-white/[0.06] py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-bold text-xs">PC</span>
              </div>
              <span className="font-heading font-bold">
                Pixel<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Craft</span> Studios
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="mailto:bsraghavan93@gmail.com" className="hover:text-violet-400 transition-colors">bsraghavan93@gmail.com</a>
              <span className="hidden sm:inline text-gray-700">|</span>
              <span className="hidden sm:inline hover:text-violet-400 transition-colors">+91 79040 72714</span>
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
