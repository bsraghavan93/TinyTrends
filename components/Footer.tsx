'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-coral-400 rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">TT</span>
              </div>
              <span className="font-heading font-bold text-xl">
                Tiny<span className="text-coral-400">Trend</span> Kids
              </span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Adorable, comfortable, and trendy clothing for your little ones. From newborn essentials to teen fashion — we&apos;ve got every tiny trend covered.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-coral-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-coral-400 transition-colors">Shop All</Link></li>
              <li><a href="#collections" className="text-gray-400 hover:text-coral-400 transition-colors">Collections</a></li>
              <li><a href="#reviews" className="text-gray-400 hover:text-coral-400 transition-colors">Reviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +91 79040 72714
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                bsraghavan93@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} TinyTrend Kids. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Built with</span>
            <svg className="w-4 h-4 text-coral-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>by <a href="/" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">PixelCraft Studios</a></span>
          </div>
        </div>
      </div>
    </footer>
  )
}
