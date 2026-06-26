'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import storeData from '@/data/skincare'
import { getDemoOrders, updateDemoOrder, getDemoProducts, saveDemoProducts, DemoProduct, DemoOrder } from '@/lib/demo-store-types'

const STORE_ID = storeData.id
const ADMIN_EMAIL = 'admin@demo.in'
const ADMIN_PASSWORD = 'admin123'

const STATUS_FLOW = ['new', 'confirmed', 'packed', 'shipped', 'delivered'] as const
const STATUS_DOT: Record<string, string> = {
  new: 'bg-blue-400', confirmed: 'bg-amber-400', packed: 'bg-purple-400',
  shipped: 'bg-cyan-400', delivered: 'bg-emerald-400', cancelled: 'bg-red-400',
}

type TabKey = 'dashboard' | 'products' | 'orders' | 'ingredients' | 'batches'
interface Batch { id: string; batchNumber: string; productName: string; quantity: number; manufactureDate: string; expiryDate: string; notes: string }

export default function SkincareAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#F7F5F0' }} />}>
      <AdminContent />
    </Suspense>
  )
}

function AdminContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState(isDemo ? ADMIN_EMAIL : '')
  const [password, setPassword] = useState(isDemo ? ADMIN_PASSWORD : '')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<TabKey>('dashboard')
  const [products, setProducts] = useState<DemoProduct[]>([])
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DemoProduct | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [mobileStats, setMobileStats] = useState(false)

  // Product form
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formOriginalPrice, setFormOriginalPrice] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formBadge, setFormBadge] = useState('')

  // Batch tracker
  const [batches, setBatches] = useState<Batch[]>([])
  const [batchNumber, setBatchNumber] = useState('')
  const [batchProduct, setBatchProduct] = useState('')
  const [batchQty, setBatchQty] = useState('')
  const [batchMfg, setBatchMfg] = useState('')
  const [batchExp, setBatchExp] = useState('')
  const [batchNotes, setBatchNotes] = useState('')

  useEffect(() => {
    const saved = getDemoProducts(STORE_ID)
    setProducts(saved || storeData.products)
    const savedOrders = getDemoOrders(STORE_ID)
    setOrders(savedOrders.length > 0 ? savedOrders : storeData.orders)
    try {
      const b = localStorage.getItem('demo_batches_skincare')
      if (b) setBatches(JSON.parse(b))
    } catch { /* empty */ }
  }, [])

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0)
    const pending = orders.filter(o => ['new', 'confirmed'].includes(o.status)).length
    const productCounts: Record<string, number> = {}
    orders.forEach(o => o.items.forEach(i => { productCounts[i.productName] = (productCounts[i.productName] || 0) + i.quantity }))
    const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const statusBreakdown: Record<string, number> = {}
    orders.forEach(o => { statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1 })
    return { totalOrders, revenue, pending, topProducts, statusBreakdown }
  }, [orders])

  const ingredients = useMemo(() => {
    const map: Record<string, string[]> = {}
    products.forEach(p => {
      const raw = p.details?.['Key Ingredients']
      if (!raw) return
      raw.split(',').map(i => i.trim()).filter(Boolean).forEach(ing => {
        if (!map[ing]) map[ing] = []
        if (!map[ing].includes(p.name)) map[ing].push(p.name)
      })
    })
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length)
  }, [products])

  const mostRecentOrder = orders.length > 0 ? [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : null

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) { setAuthenticated(true); setLoginError('') }
    else setLoginError('Invalid credentials. Use admin@demo.in / admin123')
  }

  const resetForm = () => {
    setFormName(''); setFormCategory(''); setFormPrice(''); setFormOriginalPrice('')
    setFormDescription(''); setFormBadge(''); setEditingProduct(null); setShowProductForm(false)
  }

  const openEditProduct = (p: DemoProduct) => {
    setEditingProduct(p); setFormName(p.name); setFormCategory(p.category)
    setFormPrice(String(p.price)); setFormOriginalPrice(p.originalPrice ? String(p.originalPrice) : '')
    setFormDescription(p.description); setFormBadge(p.badge || ''); setShowProductForm(true)
  }

  const saveProduct = () => {
    if (!formName || !formCategory || !formPrice) return
    const product: DemoProduct = {
      id: editingProduct?.id || `sk_${Date.now()}`, name: formName, category: formCategory,
      price: Number(formPrice), originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      description: formDescription, image: '', badge: formBadge || undefined, inStock: true,
      variants: editingProduct?.variants, details: editingProduct?.details,
    }
    const updated = editingProduct ? products.map(p => p.id === editingProduct.id ? product : p) : [product, ...products]
    setProducts(updated); saveDemoProducts(STORE_ID, updated); resetForm()
  }

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated); saveDemoProducts(STORE_ID, updated)
  }

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: status as DemoOrder['status'] } : o)
    setOrders(updated); updateDemoOrder(STORE_ID, orderId, { status: status as DemoOrder['status'] })
  }

  const addBatch = () => {
    if (!batchNumber || !batchProduct || !batchQty || !batchMfg || !batchExp) return
    const b: Batch = { id: `batch_${Date.now()}`, batchNumber, productName: batchProduct, quantity: Number(batchQty), manufactureDate: batchMfg, expiryDate: batchExp, notes: batchNotes }
    const updated = [b, ...batches]
    setBatches(updated); localStorage.setItem('demo_batches_skincare', JSON.stringify(updated))
    setBatchNumber(''); setBatchProduct(''); setBatchQty(''); setBatchMfg(''); setBatchExp(''); setBatchNotes('')
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  )

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' }, { key: 'products', label: 'Products' },
    { key: 'orders', label: 'Orders' }, { key: 'ingredients', label: 'Ingredients' },
    { key: 'batches', label: 'Batch Tracker' },
  ]

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F7F5F0' }}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: '#2D5F3E' }}>Nila Naturals</h1>
            <p className="text-sm mt-1" style={{ color: '#8B9467' }}>Admin Portal</p>
          </div>
          {loginError && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-lg p-2">{loginError}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-none text-gray-800" style={{ '--tw-ring-color': '#2D5F3E' } as React.CSSProperties} placeholder="admin@demo.in" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-none text-gray-800" placeholder="********" />
            </div>
            <button onClick={handleLogin} className="w-full text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90" style={{ background: '#2D5F3E' }}>Sign In</button>
          </div>
          {isDemo && <p className="text-center text-xs text-gray-400 mt-4 bg-gray-50 rounded-lg p-2">Demo credentials pre-filled: admin@demo.in / admin123</p>}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm hover:underline" style={{ color: '#2D5F3E' }}>Back to PixelCraft Studios</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#F7F5F0' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div>
            <h1 className="font-bold text-lg" style={{ color: '#2D5F3E' }}>Nila Naturals</h1>
            <p className="text-xs" style={{ color: '#8B9467' }}>Admin Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demos/skincare" className="text-sm hover:underline hidden sm:inline" style={{ color: '#2D5F3E' }}>View Store &rarr;</Link>
            <button onClick={() => { setAuthenticated(false); setEmail(''); setPassword('') }} className="text-sm text-gray-400 hover:text-red-500 transition-colors">Logout</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? 'border-current' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              style={tab === t.key ? { color: '#2D5F3E' } : undefined}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Quick Stats toggle */}
      <div className="lg:hidden px-4 pt-3">
        <button onClick={() => setMobileStats(!mobileStats)} className="w-full text-left text-sm font-medium py-2 px-3 rounded-lg border border-gray-200 bg-white flex items-center justify-between" style={{ color: '#2D5F3E' }}>
          Quick Stats
          <span className="text-gray-400 text-xs">{mobileStats ? 'Hide' : 'Show'}</span>
        </button>
        {mobileStats && <QuickStats orders={orders} stats={stats} mostRecentOrder={mostRecentOrder} />}
      </div>

      {/* Split layout */}
      <div className="max-w-7xl mx-auto flex">
        {/* Left panel — tab content */}
        <main className="flex-1 p-4 md:p-6 min-w-0">

          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: String(stats.totalOrders) },
                  { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}` },
                  { label: 'Pending', value: String(stats.pending) },
                  { label: 'Products', value: String(products.length) },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border" style={{ borderColor: '#2D5F3E33' }}>
                    <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                    <p className="text-xs mt-1" style={{ color: '#8B9467' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Status segments */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#2D5F3E22' }}>
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Order Status Breakdown</h3>
                {stats.totalOrders > 0 ? (
                  <div className="flex h-4 rounded-full overflow-hidden">
                    {STATUS_FLOW.map(s => {
                      const pct = (stats.statusBreakdown[s] || 0) / stats.totalOrders * 100
                      if (!pct) return null
                      return <div key={s} className={`${STATUS_DOT[s]} transition-all`} style={{ width: `${pct}%` }} title={`${s}: ${stats.statusBreakdown[s]}`} />
                    })}
                    {(stats.statusBreakdown['cancelled'] || 0) > 0 && (
                      <div className="bg-red-400 transition-all" style={{ width: `${(stats.statusBreakdown['cancelled'] / stats.totalOrders) * 100}%` }} title={`cancelled: ${stats.statusBreakdown['cancelled']}`} />
                    )}
                  </div>
                ) : <p className="text-sm text-gray-400">No orders yet</p>}
                <div className="flex flex-wrap gap-3 mt-3">
                  {[...STATUS_FLOW, 'cancelled' as const].map(s => (
                    <span key={s} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />{s} ({stats.statusBreakdown[s] || 0})
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Top 5 products */}
                <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#2D5F3E22' }}>
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Top 5 Products</h3>
                  <div className="space-y-2">
                    {stats.topProducts.map(([name, count], i) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-300 w-5">{i + 1}.</span>
                        <span className="text-sm text-gray-700 flex-1 truncate">{name}</span>
                        <span className="text-sm font-medium" style={{ color: '#2D5F3E' }}>{count} sold</span>
                      </div>
                    ))}
                    {stats.topProducts.length === 0 && <p className="text-sm text-gray-400">No orders yet</p>}
                  </div>
                </div>

                {/* Category breakdown */}
                <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#2D5F3E22' }}>
                  <h3 className="font-semibold text-gray-700 mb-3 text-sm">Products by Category</h3>
                  <div className="space-y-2">
                    {storeData.categories.map(cat => {
                      const count = products.filter(p => p.category === cat.id).length
                      return (
                        <div key={cat.id} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex items-center gap-2">
                            <span>{cat.icon}</span> {cat.name}
                          </span>
                          <span className="text-sm font-medium text-gray-800">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-xl p-5 border" style={{ borderColor: '#2D5F3E22' }}>
                <h3 className="font-semibold text-gray-700 mb-3 text-sm">Recent Orders</h3>
                <div className="space-y-2">
                  {[...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4).map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: '#2D5F3E10' }}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[o.status]}`} />
                          <span className="text-sm font-medium text-gray-800 truncate">{o.customerName}</span>
                        </div>
                        <p className="text-xs text-gray-400 ml-4">{o.items.length} item{o.items.length > 1 ? 's' : ''} &middot; {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-800 shrink-0">{'₹'}{o.total.toLocaleString()}</span>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-sm text-gray-400">No orders yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {tab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-gray-800">Products ({products.length})</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search..." className="flex-1 sm:w-52 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 outline-none text-gray-800" />
                  <button onClick={() => { resetForm(); setShowProductForm(true) }} className="text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: '#2D5F3E' }}>+ Add</button>
                </div>
              </div>

              {showProductForm && (
                <div className="bg-white rounded-xl p-5 border space-y-4" style={{ borderColor: '#2D5F3E44' }}>
                  <h3 className="font-semibold text-gray-700 text-sm">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Product name" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800">
                      <option value="">Select category</option>
                      {storeData.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="Price" type="number" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                    <input value={formOriginalPrice} onChange={e => setFormOriginalPrice(e.target.value)} placeholder="Original price (optional)" type="number" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                    <input value={formBadge} onChange={e => setFormBadge(e.target.value)} placeholder="Badge (e.g. Bestseller)" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                  </div>
                  <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                  <div className="flex gap-2">
                    <button onClick={saveProduct} className="text-white px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90" style={{ background: '#2D5F3E' }}>{editingProduct ? 'Update' : 'Add Product'}</button>
                    <button onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {/* Products table */}
              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#2D5F3E22' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#2D5F3E15' }}>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Category</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Price</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Badge</th>
                        <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#2D5F3E10' }}>
                          <td className="px-4 py-3 text-gray-800 font-medium">{p.name}</td>
                          <td className="px-4 py-3 text-gray-500 capitalize hidden sm:table-cell">{storeData.categories.find(c => c.id === p.category)?.name || p.category}</td>
                          <td className="px-4 py-3 text-gray-800">{'₹'}{p.price}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {p.badge && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#2D5F3E15', color: '#2D5F3E' }}>{p.badge}</span>}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => openEditProduct(p)} className="text-xs mr-3 hover:underline" style={{ color: '#2D5F3E' }}>Edit</button>
                            <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredProducts.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No products found</p>}
              </div>
            </div>
          )}

          {/* Orders — Timeline style */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Orders ({orders.length})</h2>
              <div className="space-y-0">
                {orders.map((o, idx) => (
                  <div key={o.id} className="relative pl-8">
                    {/* Timeline line */}
                    {idx < orders.length - 1 && <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200" />}
                    {/* Status dot */}
                    <div className={`absolute left-1 top-4 w-[14px] h-[14px] rounded-full border-2 border-white shadow-sm ${STATUS_DOT[o.status]}`} />

                    <div className={`bg-white rounded-xl border mb-3 transition-colors cursor-pointer ${expandedOrder === o.id ? '' : 'hover:border-gray-300'}`}
                      style={{ borderColor: expandedOrder === o.id ? '#2D5F3E55' : '#2D5F3E18' }}
                      onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-800 text-sm">{o.orderId}</span>
                            <span className="text-xs capitalize px-2 py-0.5 rounded-full" style={{ background: '#2D5F3E12', color: '#2D5F3E' }}>{o.status}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{o.customerName} &middot; {o.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-800 text-sm">{'₹'}{o.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>

                      {expandedOrder === o.id && (
                        <div className="border-t px-4 pb-4 pt-3 space-y-3" style={{ borderColor: '#2D5F3E15' }} onClick={e => e.stopPropagation()}>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div><p className="text-gray-400 text-xs">Phone</p><p className="text-gray-700">{o.customerPhone}</p></div>
                            <div><p className="text-gray-400 text-xs">City</p><p className="text-gray-700">{o.city}</p></div>
                            <div><p className="text-gray-400 text-xs">Payment</p><p className="text-gray-700">{o.paymentMode} &middot; <span className={o.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>{o.paymentStatus}</span></p></div>
                            <div><p className="text-gray-400 text-xs">Address</p><p className="text-gray-700">{o.address}, {o.city}</p></div>
                          </div>
                          {o.notes && <p className="text-xs text-gray-500 italic">Note: {o.notes}</p>}
                          <div className="space-y-1">
                            {o.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm rounded-lg px-3 py-1.5" style={{ background: '#F7F5F0' }}>
                                <span className="text-gray-700">{item.productName}{item.variant ? ` (${item.variant})` : ''}</span>
                                <span className="text-gray-500">{item.quantity} x {'₹'}{item.price}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-2">Update Status</p>
                            <div className="flex flex-wrap gap-1.5">
                              {[...STATUS_FLOW, 'cancelled' as const].map(s => (
                                <button key={s} onClick={() => updateOrderStatus(o.id, s)}
                                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${o.status === s ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                  style={o.status === s ? { background: '#2D5F3E' } : { background: '#2D5F3E10' }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {tab === 'ingredients' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Ingredient Tracker</h2>
              <p className="text-sm text-gray-500">Key ingredients used across your product line.</p>
              <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#2D5F3E22' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#2D5F3E15' }}>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Ingredient</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Products</th>
                        <th className="text-center px-4 py-3 font-medium text-gray-500">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map(([name, prods]) => (
                        <tr key={name} className="border-b last:border-0" style={{ borderColor: '#2D5F3E10' }}>
                          <td className="px-4 py-3 font-medium text-gray-800">{name}</td>
                          <td className="px-4 py-3 text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {prods.map(p => (
                                <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#C67B5C18', color: '#C67B5C' }}>{p}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#2D5F3E12', color: '#2D5F3E' }}>{prods.length}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {ingredients.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No ingredient data found</p>}
              </div>
            </div>
          )}

          {/* Batch Tracker */}
          {tab === 'batches' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Batch Tracker</h2>

              <div className="bg-white rounded-xl p-5 border space-y-4" style={{ borderColor: '#2D5F3E33' }}>
                <h3 className="font-semibold text-gray-700 text-sm">Log New Batch</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <input value={batchNumber} onChange={e => setBatchNumber(e.target.value)} placeholder="Batch number (e.g. B-2026-001)" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                  <select value={batchProduct} onChange={e => setBatchProduct(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800">
                    <option value="">Select product</option>
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <input value={batchQty} onChange={e => setBatchQty(e.target.value)} placeholder="Quantity made" type="number" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Manufacture Date</label>
                    <input type="date" value={batchMfg} onChange={e => setBatchMfg(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Expiry Date</label>
                    <input type="date" value={batchExp} onChange={e => setBatchExp(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                  </div>
                  <input value={batchNotes} onChange={e => setBatchNotes(e.target.value)} placeholder="Notes (optional)" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none text-gray-800" />
                </div>
                <button onClick={addBatch} className="text-white px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90" style={{ background: '#2D5F3E' }}>Add Batch</button>
              </div>

              {/* Batch list */}
              {batches.length > 0 ? (
                <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#2D5F3E22' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b" style={{ borderColor: '#2D5F3E15' }}>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Batch #</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Product</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Qty</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Mfg Date</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500">Expiry</th>
                          <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batches.map(b => (
                          <tr key={b.id} className="border-b last:border-0" style={{ borderColor: '#2D5F3E10' }}>
                            <td className="px-4 py-3 font-medium text-gray-800">{b.batchNumber}</td>
                            <td className="px-4 py-3 text-gray-700">{b.productName}</td>
                            <td className="px-4 py-3 text-gray-700 hidden sm:table-cell">{b.quantity}</td>
                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{b.manufactureDate}</td>
                            <td className="px-4 py-3 text-gray-500">{b.expiryDate}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{b.notes || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-8 text-sm">No batches logged yet. Add your first batch above.</p>
              )}
            </div>
          )}
        </main>

        {/* Right sidebar — Quick Stats (desktop only) */}
        <aside className="hidden lg:block w-72 shrink-0 p-6 border-l border-gray-200">
          <QuickStats orders={orders} stats={stats} mostRecentOrder={mostRecentOrder} />
        </aside>
      </div>

      {/* Back link */}
      <div className="max-w-7xl mx-auto px-4 py-4 border-t border-gray-100">
        <Link href="/" className="text-sm text-gray-400 hover:underline">Back to PixelCraft Studios</Link>
      </div>
    </div>
  )
}

function QuickStats({ orders, stats, mostRecentOrder }: {
  orders: DemoOrder[]
  stats: { totalOrders: number; revenue: number; pending: number; statusBreakdown: Record<string, number> }
  mostRecentOrder: DemoOrder | null
}) {
  return (
    <div className="space-y-5 py-2">
      <h3 className="font-semibold text-sm" style={{ color: '#2D5F3E' }}>Quick Stats</h3>

      {/* Revenue */}
      <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#2D5F3E22' }}>
        <p className="text-xs text-gray-400">Total Revenue</p>
        <p className="text-xl font-bold text-gray-800">{'₹'}{stats.revenue.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">{orders.length} orders</p>
      </div>

      {/* Status breakdown */}
      <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#2D5F3E22' }}>
        <p className="text-xs text-gray-400 mb-2">Orders by Status</p>
        <div className="space-y-1.5">
          {[...STATUS_FLOW, 'cancelled' as const].map(s => (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
              <span className="text-gray-600 capitalize flex-1">{s}</span>
              <span className="font-medium text-gray-800">{stats.statusBreakdown[s] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Most recent order */}
      {mostRecentOrder && (
        <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#2D5F3E22' }}>
          <p className="text-xs text-gray-400 mb-2">Most Recent Order</p>
          <p className="text-sm font-medium text-gray-800">{mostRecentOrder.customerName}</p>
          <p className="text-xs text-gray-500 mt-1">{mostRecentOrder.items.map(i => i.productName).join(', ')}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold" style={{ color: '#2D5F3E' }}>{'₹'}{mostRecentOrder.total.toLocaleString()}</span>
            <span className="text-xs text-gray-400">{new Date(mostRecentOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      )}

      {/* Payment summary */}
      <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#2D5F3E22' }}>
        <p className="text-xs text-gray-400 mb-2">Payments</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-600 font-medium">Paid</span>
          <span className="text-gray-800 font-bold">{orders.filter(o => o.paymentStatus === 'paid').length}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-amber-600 font-medium">Unpaid</span>
          <span className="text-gray-800 font-bold">{orders.filter(o => o.paymentStatus === 'unpaid').length}</span>
        </div>
      </div>
    </div>
  )
}
