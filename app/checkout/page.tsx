'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart'
import Navbar from '@/components/Navbar'

const UPI_ID = 'adithyarajendran27@okicici'
const WHATSAPP_NUMBER = '919942384380'

function generateOrderId() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(-2)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `TK-${dd}${mm}${yy}-${code}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'later'>('upi')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    notes: '',
    upiRef: '',
  })

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = form.name && form.phone && form.address

  const handlePlaceOrder = async () => {
    if (submitting) return
    setSubmitting(true)

    const orderId = generateOrderId()
    const paymentStatus = paymentMethod === 'upi' ? 'paid' : 'unpaid'

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email,
          address: form.address,
          city: form.city,
          notes: form.notes,
          items,
          total,
          status: 'pending',
          payment_status: paymentStatus,
          upi_ref: form.upiRef,
        }),
      })

      const itemsText = items
        .map(
          (item) =>
            `• ${item.product.name}${item.selectedSize ? ` (${item.selectedSize})` : ''}${item.selectedColor ? ` - ${item.selectedColor.name}` : ''} x${item.quantity} = ₹${item.product.price * item.quantity}`
        )
        .join('\n')

      const whatsappMsg = encodeURIComponent(
        `🛍️ *TinyTrend Kids — New Order*\n\n📋 Order ID: ${orderId}\n💳 Payment: ${paymentStatus === 'paid' ? '✅ Paid' : '⏳ Unpaid'}${form.upiRef ? `\n🔗 UPI Ref: ${form.upiRef}` : ''}\n\n👤 ${form.name}\n📞 ${form.phone}${form.email ? `\n📧 ${form.email}` : ''}${form.city ? `\n🏙️ ${form.city}` : ''}\n📍 ${form.address}${form.notes ? `\n📝 ${form.notes}` : ''}\n\n📦 Items:\n${itemsText}\n\n💰 *Total: ₹${total}*`
      )

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`, '_blank')

      clearCart()
      router.push(`/order-success?id=${orderId}&payment=${paymentStatus}`)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <div className="text-center">
            <p className="text-charcoal/40 text-lg font-medium mb-4">Your cart is empty</p>
            <a href="/products" className="text-coral-400 font-semibold hover:text-coral-500">Shop Now</a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s ? 'bg-coral-400 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {s}
                </div>
                <span className={`text-sm font-medium ${step >= s ? 'text-charcoal' : 'text-charcoal/30'}`}>
                  {s === 1 ? 'Details' : 'Payment'}
                </span>
                {s < 2 && <div className={`w-16 h-0.5 ${step > 1 ? 'bg-coral-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <h3 className="font-heading font-semibold text-charcoal mb-3">Order Summary ({items.length} items)</h3>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-charcoal">{item.product.name}</span>
                    {item.selectedSize && <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{item.selectedSize}</span>}
                    <span className="text-charcoal/40">x{item.quantity}</span>
                  </div>
                  <span className="font-medium text-charcoal">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 flex items-center justify-between">
              <span className="font-semibold text-charcoal">Total</span>
              <span className="font-bold text-xl text-coral-500">₹{total}</span>
            </div>
          </div>

          {/* Step 1: Customer Details */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in">
              <h3 className="font-heading font-semibold text-lg text-charcoal mb-4">Customer Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} required className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Email (optional)</label>
                  <input type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">City (optional)</label>
                  <input type="text" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none" placeholder="Your city" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Delivery Address *</label>
                  <textarea value={form.address} onChange={(e) => updateForm('address', e.target.value)} required rows={3} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none resize-none" placeholder="Full delivery address with PIN code" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Order Notes (optional)</label>
                  <textarea value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} rows={2} className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none resize-none" placeholder="Any special requests..." />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceed}
                className="w-full mt-6 bg-coral-400 hover:bg-coral-500 text-white font-semibold py-3 rounded-xl transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-charcoal/50 hover:text-charcoal mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to details
              </button>

              <h3 className="font-heading font-semibold text-lg text-charcoal mb-4">Payment Options</h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'upi' ? 'border-coral-400 bg-coral-50' : 'border-gray-200'
                  }`}
                >
                  <span className="text-lg mb-1 block">💳</span>
                  <p className="font-semibold text-charcoal text-sm">Pay Now (UPI)</p>
                  <p className="text-xs text-charcoal/40">Pay via UPI</p>
                </button>
                <button
                  onClick={() => setPaymentMethod('later')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'later' ? 'border-coral-400 bg-coral-50' : 'border-gray-200'
                  }`}
                >
                  <span className="text-lg mb-1 block">⏳</span>
                  <p className="font-semibold text-charcoal text-sm">Pay Later</p>
                  <p className="text-xs text-charcoal/40">Arrange via WhatsApp</p>
                </button>
              </div>

              {paymentMethod === 'upi' && (
                <div className="space-y-4 mb-6">
                  <div className="bg-cream rounded-xl p-4 text-center">
                    <p className="text-sm text-charcoal/50 mb-2">Scan QR or pay to UPI ID:</p>
                    <p className="font-mono font-bold text-charcoal bg-white rounded-lg px-4 py-2 inline-block">{UPI_ID}</p>
                    <p className="text-lg font-bold text-coral-500 mt-2">₹{total}</p>
                  </div>
                  <a
                    href={`upi://pay?pa=${UPI_ID}&pn=TinyTrend+Kids&am=${total}&cu=INR`}
                    className="block w-full text-center bg-teal-400 hover:bg-teal-500 text-white font-semibold py-3 rounded-xl transition-all"
                  >
                    Open UPI App
                  </a>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">UPI Transaction / Ref ID</label>
                    <input
                      type="text"
                      value={form.upiRef}
                      onChange={(e) => updateForm('upiRef', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-transparent outline-none"
                      placeholder="Enter UPI reference number"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'later' && (
                <div className="bg-sunny-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-charcoal/70">
                    Place your order now and arrange payment later via WhatsApp. We&apos;ll reach out to confirm.
                  </p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full bg-coral-400 hover:bg-coral-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-coral-400/30 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing Order...' : paymentMethod === 'upi' ? "I've Paid — Place Order" : 'Pay Later — Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
