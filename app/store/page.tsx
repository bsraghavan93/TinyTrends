'use client'

import DemoBanner from '@/components/DemoBanner'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import Collections from '@/components/Collections'
import ReviewsSection from '@/components/ReviewsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function StorePage() {
  return (
    <>
      <DemoBanner />
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <Collections />
      <TestimonialsSection />
      <ReviewsSection />
      <Footer />

      {/* Floating Admin Portal CTA */}
      <Link
        href="/admin?demo=true"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-charcoal/90 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-xl shadow-black/20 border border-white/10 hover:bg-charcoal hover:-translate-y-1 transition-all group animate-bounce-in"
      >
        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
        <span className="text-sm font-semibold">Try Admin Portal</span>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Link>
    </>
  )
}
