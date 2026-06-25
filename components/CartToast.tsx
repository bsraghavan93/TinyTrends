'use client'

import { CartItem } from '@/lib/types'

interface Props {
  item: CartItem
  onClose: () => void
}

export default function CartToast({ item, onClose }: Props) {
  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-3 flex items-center gap-3 max-w-xs">
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {item.product.images?.[0] ? (
            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-teal-100">
              <span className="text-teal-400 text-xs">+</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-teal-500 font-semibold">Added to cart!</p>
          <p className="text-sm font-medium text-charcoal truncate">{item.product.name}</p>
          <p className="text-xs text-charcoal/50">₹{item.product.price} x {item.quantity}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
