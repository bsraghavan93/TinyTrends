'use client'

export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-charcoal to-gray-800 text-white py-2 px-4 text-center text-sm">
      <span className="text-gray-300">This is a demo store by </span>
      <a href="#portfolio" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
        PixelCraft Studios
      </a>
      <span className="text-gray-300"> — </span>
      <a href="#portfolio" className="text-coral-400 font-semibold hover:text-coral-300 transition-colors">
        Want one for your brand? Let&apos;s talk &rarr;
      </a>
    </div>
  )
}
