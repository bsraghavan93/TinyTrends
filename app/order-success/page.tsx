'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id') || ''
  const paymentStatus = searchParams.get('payment') || 'unpaid'

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="animate-bounce-in">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="font-heading text-3xl font-bold text-charcoal mb-2">Order Placed!</h1>
            <p className="text-charcoal/50 mb-6">Thank you for shopping with TinyTrend Kids</p>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <p className="text-sm text-charcoal/40 mb-1">Order ID</p>
              <p className="font-heading font-bold text-2xl text-charcoal mb-3">{orderId}</p>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                paymentStatus === 'paid'
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-sunny-100 text-sunny-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${paymentStatus === 'paid' ? 'bg-teal-500' : 'bg-sunny-500'}`} />
                {paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </span>

              <p className="text-charcoal/50 text-sm mt-4">
                We&apos;ll call you shortly to confirm your order
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-coral-400 hover:bg-coral-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-coral-400/30 transition-all hover:-translate-y-0.5"
            >
              Continue Shopping
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
