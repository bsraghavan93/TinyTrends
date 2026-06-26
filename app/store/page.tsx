'use client'

import DemoBanner from '@/components/DemoBanner'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import Collections from '@/components/Collections'
import ReviewsSection from '@/components/ReviewsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import Footer from '@/components/Footer'

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
    </>
  )
}
