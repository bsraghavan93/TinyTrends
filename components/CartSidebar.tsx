'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartSidebar({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-heading font-bold text-xl text-charcoal">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-charcoal/40 font-medium">Your cart is empty</p>
              <button onClick={onClose} className="mt-4 text-coral-400 font-semibold hover:text-coral-500 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={index} className="flex gap-3 bg-cream rounded-xl p-3">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-charcoal text-sm truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {item.selectedColor && (
                      <span className="flex items-center gap-1 text-xs text-charcoal/50">
                        <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.selectedColor.hex }} />
                        {item.selectedColor.name}
                      </span>
                    )}
                    {item.selectedSize && (
                      <span className="text-xs bg-gray-100 text-charcoal/60 px-2 py-0.5 rounded">{item.selectedSize}</span>
                    )}
                  </div>
                  <p className="font-bold text-coral-500 mt-1 text-sm">₹{item.product.price}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(index, item.quantity - 1)} className="px-2 py-1 text-xs text-charcoal hover:bg-gray-50">-</button>
                      <span className="px-2 py-1 text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)} className="px-2 py-1 text-xs text-charcoal hover:bg-gray-50">+</button>
                    </div>
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-500 text-xs font-medium">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-charcoal">Subtotal</span>
              <span className="font-bold text-xl text-charcoal">₹{total}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-coral-400 hover:bg-coral-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-coral-400/30 transition-all"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
