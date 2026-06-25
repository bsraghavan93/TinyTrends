'use client'

import { useEffect, useState, useRef } from 'react'
import { Product } from '@/lib/types'
import { supabase } from '@/lib/supabase'

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Product[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Customer Review')
        .order('created_at', { ascending: false })
      setTestimonials(data || [])
    }
    fetch()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  if (testimonials.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-br from-coral-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-coral-400 font-semibold text-sm uppercase tracking-wider">Love from Families</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mt-2">Happy Parents & Kids</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors hidden md:block"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
            {testimonials.map((t) => (
              <div key={t.id} className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-sm overflow-hidden snap-start">
                {t.images?.[0] && (
                  <div className="h-48 bg-gray-100">
                    <img src={t.images[0]} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-charcoal/70 text-sm italic mb-3">&ldquo;{t.description}&rdquo;</p>
                  <p className="font-semibold text-charcoal">{t.name}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors hidden md:block"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
