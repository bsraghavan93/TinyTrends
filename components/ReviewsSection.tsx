'use client'

import { useEffect, useState } from 'react'
import { Review } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import ReviewForm from './ReviewForm'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*, products(name)')
      .order('created_at', { ascending: false })
      .limit(6)

    const mapped = (data || []).map((r: any) => ({
      ...r,
      product_name: r.products?.name || null,
    }))
    setReviews(mapped)
  }

  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-sunny-500 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mt-2">What Parents Say</h2>
          <p className="text-charcoal/50 mt-2">Real feedback from happy families</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-cream rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-sunny-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-charcoal/70 mb-4 italic">&ldquo;{review.comment}&rdquo;</p>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-charcoal">{review.reviewer_name}</p>
                {review.product_name && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{review.product_name}</span>
                )}
              </div>
              <p className="text-xs text-charcoal/40 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <p className="text-center text-charcoal/40 mb-8">No reviews yet. Be the first!</p>
        )}

        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-sunny-400 hover:bg-sunny-500 text-charcoal font-semibold px-6 py-3 rounded-full transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Write a Review
          </button>
        </div>

        {showForm && (
          <ReviewForm
            onClose={() => setShowForm(false)}
            onSubmitted={() => { setShowForm(false); fetchReviews() }}
          />
        )}
      </div>
    </section>
  )
}
