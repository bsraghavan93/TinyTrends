'use client'

export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-charcoal to-gray-800 text-white py-2.5 px-4 text-center text-sm">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
        <span className="text-gray-300 font-medium">Demo Store</span>
      </span>
      <span className="text-gray-500 mx-2">|</span>
      <span className="text-gray-300">Built by </span>
      <a href="/" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
        PixelCraft Studios
      </a>
      <span className="text-gray-300"> — </span>
      <a href="/" className="text-coral-400 font-semibold hover:text-coral-300 transition-colors">
        Want one for your brand? &rarr;
      </a>
    </div>
  )
}
