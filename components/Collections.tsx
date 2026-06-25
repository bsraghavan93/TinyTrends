'use client'

import Link from 'next/link'

const collections = [
  { name: 'Tops & T-Shirts', emoji: '👕', color: 'from-coral-400 to-coral-500', desc: 'Comfy everyday wear' },
  { name: 'Dresses & Frocks', emoji: '👗', color: 'from-teal-400 to-teal-500', desc: 'Pretty & playful' },
  { name: 'Bottoms & Shorts', emoji: '👖', color: 'from-sunny-400 to-sunny-500', desc: 'Active & fun' },
  { name: 'Ethnic Wear', emoji: '🪷', color: 'from-purple-400 to-purple-500', desc: 'Festival favorites' },
  { name: 'Winter Wear', emoji: '🧥', color: 'from-blue-400 to-blue-500', desc: 'Warm & snug' },
  { name: 'Accessories', emoji: '🎀', color: 'from-pink-400 to-pink-500', desc: 'Finishing touches' },
]

export default function Collections() {
  return (
    <section id="collections" className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-teal-500 font-semibold text-sm uppercase tracking-wider">Browse By</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal mt-2">Shop Collections</h2>
          <p className="text-charcoal/50 mt-2">Find the perfect outfit for every occasion</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {collections.map((col) => (
            <Link
              key={col.name}
              href={`/products?category=${encodeURIComponent(col.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${col.color} p-6 md:p-8`}>
                <span className="text-4xl md:text-5xl">{col.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-charcoal group-hover:text-coral-400 transition-colors">{col.name}</h3>
                <p className="text-sm text-charcoal/50">{col.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
