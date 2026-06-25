'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-coral-50 via-cream to-teal-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-sunny-200 rounded-full opacity-40 animate-float" />
        <div className="absolute top-40 -left-16 w-48 h-48 bg-coral-200 rounded-full opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 right-1/4 w-36 h-36 bg-teal-200 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-charcoal/70">New Summer Collection 2026</span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-charcoal mb-6 leading-tight">
            Where <span className="text-coral-400">Little</span> Fashion{' '}
            <span className="text-teal-500">Begins</span>
          </h1>

          <p className="text-lg md:text-xl text-charcoal/60 mb-10 max-w-xl mx-auto">
            Adorable, comfortable & trendy outfits for kids aged 0–14. Because every tiny human deserves to look amazing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-coral-400 hover:bg-coral-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-coral-400/30 transition-all hover:shadow-xl hover:shadow-coral-400/40 hover:-translate-y-0.5"
            >
              Shop Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#collections"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-charcoal font-semibold px-8 py-4 rounded-full shadow-md transition-all hover:-translate-y-0.5"
            >
              Browse Collections
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-charcoal/50">
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-charcoal">500+</p>
              <p className="text-sm">Happy Kids</p>
            </div>
            <div className="w-px h-10 bg-charcoal/10" />
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-charcoal">100%</p>
              <p className="text-sm">Cotton Comfort</p>
            </div>
            <div className="w-px h-10 bg-charcoal/10" />
            <div className="text-center">
              <p className="font-heading font-bold text-2xl text-charcoal">Free</p>
              <p className="text-sm">Delivery*</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
