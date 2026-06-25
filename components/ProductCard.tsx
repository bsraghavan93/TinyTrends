'use client'

import { Product } from '@/lib/types'

interface Props {
  product: Product
  onClick: () => void
}

export default function ProductCard({ product, onClick }: Props) {
  const isOOS = !product.in_stock

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 w-full"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {isOOS && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-charcoal font-semibold text-sm px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}

        {product.age_group && (
          <span className="absolute top-2 left-2 bg-teal-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {product.age_group}
          </span>
        )}
      </div>

      <div className="p-3 md:p-4">
        <p className="text-xs text-charcoal/40 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-heading font-semibold text-charcoal text-sm md:text-base line-clamp-2 group-hover:text-coral-400 transition-colors">
          {product.name}
        </h3>
        <p className="font-bold text-coral-500 mt-1">₹{product.price}</p>

        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c.hex} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c.hex }} />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-charcoal/40">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}
