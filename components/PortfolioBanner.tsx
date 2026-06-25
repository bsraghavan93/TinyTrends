'use client'

export default function PortfolioBanner() {
  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-charcoal via-gray-900 to-charcoal text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-coral-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-300">Portfolio Showcase</span>
        </div>

        <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
          Want a <span className="text-coral-400">Beautiful</span> Online Store{' '}
          <span className="text-teal-400">Like This?</span>
        </h2>

        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          We build stunning, fully-functional e-commerce stores with admin dashboards,
          payment integration, and order management — all tailored to your brand.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Product Management', icon: '📦' },
            { label: 'Order Tracking', icon: '📋' },
            { label: 'UPI Payments', icon: '💳' },
            { label: 'WhatsApp Orders', icon: '💬' },
            { label: 'Mobile Optimized', icon: '📱' },
            { label: 'Admin Dashboard', icon: '📊' },
            { label: 'Stock Control', icon: '🏷️' },
            { label: 'Email Alerts', icon: '📧' },
          ].map((feature) => (
            <div key={feature.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
              <span className="text-2xl mb-2 block">{feature.icon}</span>
              <p className="text-sm text-gray-300">{feature.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/919942384380?text=Hi%2C%20I%20saw%20the%20TinyTrend%20demo%20store%20and%20I%E2%80%99m%20interested%20in%20getting%20a%20similar%20website%20for%20my%20brand."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-charcoal font-bold px-8 py-4 rounded-full shadow-lg shadow-teal-400/30 transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
          <a
            href="mailto:bsraghavan93@gmail.com?subject=Website%20Inquiry%20-%20Saw%20TinyTrend%20Demo"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full border border-white/20 transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </a>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Starting at ₹14,999 &middot; 7-day delivery &middot; Full source code ownership
        </p>
      </div>
    </section>
  )
}
