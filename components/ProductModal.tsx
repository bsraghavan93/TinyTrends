'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/cart'

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const hasColors = product.colors && product.colors.length > 0
  const hasSizes = product.sizes && product.sizes.length > 0
  const isOOS = !product.in_stock
  const needsColor = hasColors && !selectedColor
  const needsSize = hasSizes && !selectedSize
  const canAdd = !isOOS && !needsColor && !needsSize

  const isColorOOS = (colorName: string) => product.oos_colors?.includes(colorName)
  const isSizeOOS = (size: string) => product.oos_sizes?.includes(size)

  const handleAdd = () => {
    if (!canAdd) return
    addItem(product, quantity, selectedColor, selectedSize)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 animate-fade-in" />

      <div
        className="relative bg-white w-full md:w-auto md:max-w-3xl md:rounded-2xl md:mx-4 rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:flex">
          {/* Images */}
          <div className="md:w-1/2 p-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
              {product.images?.[selectedImage] ? (
                <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-coral-400' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-4 md:p-6">
            <span className="text-xs text-charcoal/40 uppercase tracking-wider">{product.category}</span>
            <h2 className="font-heading text-2xl font-bold text-charcoal mt-1">{product.name}</h2>
            <p className="text-2xl font-bold text-coral-500 mt-2">₹{product.price}</p>

            {isOOS && (
              <div className="mt-3 bg-red-50 text-red-600 text-sm font-medium px-3 py-2 rounded-lg">
                Currently out of stock
              </div>
            )}

            <p className="text-charcoal/60 mt-4 text-sm leading-relaxed">{product.description}</p>

            {/* Brand-specific details */}
            <div className="mt-4 space-y-2 text-sm">
              {product.material && (
                <div className="flex gap-2"><span className="text-charcoal/40 w-24">Material:</span><span className="text-charcoal">{product.material}</span></div>
              )}
              {product.fit_type && (
                <div className="flex gap-2"><span className="text-charcoal/40 w-24">Fit:</span><span className="text-charcoal">{product.fit_type}</span></div>
              )}
              {product.care_instructions && (
                <div className="flex gap-2"><span className="text-charcoal/40 w-24">Care:</span><span className="text-charcoal">{product.care_instructions}</span></div>
              )}
              {product.age_group && (
                <div className="flex gap-2"><span className="text-charcoal/40 w-24">Age Group:</span><span className="text-charcoal">{product.age_group}</span></div>
              )}
              {product.gender && (
                <div className="flex gap-2"><span className="text-charcoal/40 w-24">Gender:</span><span className="text-charcoal">{product.gender}</span></div>
              )}
            </div>

            {/* Colors */}
            {hasColors && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-charcoal mb-2">
                  Color{selectedColor ? `: ${selectedColor.name}` : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => {
                    const oos = isColorOOS(c.name)
                    return (
                      <button
                        key={c.hex}
                        onClick={() => !oos && setSelectedColor(c)}
                        disabled={oos}
                        className={`w-9 h-9 rounded-full border-2 transition-all relative ${
                          selectedColor?.hex === c.hex ? 'border-charcoal scale-110' : 'border-gray-200'
                        } ${oos ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}`}
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name}${oos ? ' (Out of Stock)' : ''}`}
                      >
                        {oos && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-0.5 bg-red-500 rotate-45 absolute" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {hasSizes && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-charcoal mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const oos = isSizeOOS(size)
                    return (
                      <button
                        key={size}
                        onClick={() => !oos && setSelectedSize(size)}
                        disabled={oos}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-charcoal text-white border-charcoal'
                            : 'bg-white text-charcoal border-gray-200 hover:border-charcoal'
                        } ${oos ? 'opacity-30 line-through cursor-not-allowed' : ''}`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-charcoal hover:bg-gray-50 transition-colors">-</button>
                <span className="px-3 py-2 font-semibold text-charcoal min-w-[2rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-charcoal hover:bg-gray-50 transition-colors">+</button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  canAdd
                    ? 'bg-coral-400 hover:bg-coral-500 text-white shadow-lg shadow-coral-400/30 hover:-translate-y-0.5'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isOOS ? 'Out of Stock' : needsColor || needsSize ? 'Select Options' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
