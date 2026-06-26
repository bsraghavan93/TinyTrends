'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { DemoProduct, DemoOrder, getDemoOrders, updateDemoOrder, getDemoProducts, saveDemoProducts } from '@/lib/demo-store-types'
import type { DemoStoreConfig } from '@/lib/demo-store-types'
import storeData from '@/data/jewelry'
import Link from 'next/link'

const ADMIN_EMAIL = 'admin@demo.in'
const ADMIN_PASSWORD = 'admin123'
const STATUS_FLOW: DemoOrder['status'][] = ['new', 'confirmed', 'packed', 'shipped', 'delivered']
const STATUS_LABELS: Record<string, string> = { new: 'New', confirmed: 'Confirmed', packed: 'Packed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' }

export default function JewelryAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F0F]" />}>
      <JewelryAdminContent />
    </Suspense>
  )
}

function JewelryAdminContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'
  const store: DemoStoreConfig = storeData

  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState(isDemo ? ADMIN_EMAIL : '')
  const [password, setPassword] = useState(isDemo ? ADMIN_PASSWORD : '')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders' | 'collections'>('dashboard')
  const [products, setProducts] = useState<DemoProduct[]>([])
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DemoProduct | null>(null)
  const [productSearch, setProductSearch] = useState('')

  // Product form
  const [fName, setFName] = useState('')
  const [fCategory, setFCategory] = useState('')
  const [fPrice, setFPrice] = useState('')
  const [fOriginalPrice, setFOriginalPrice] = useState('')
  const [fDescription, setFDescription] = useState('')
  const [fBadge, setFBadge] = useState('')

  useEffect(() => {
    const saved = getDemoProducts(store.id)
    setProducts(saved || store.products)
    const savedOrders = getDemoOrders(store.id)
    setOrders(savedOrders.length > 0 ? savedOrders : store.orders)
  }, [store])

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Use admin@demo.in / admin123')
    }
  }

  const resetForm = () => {
    setFName(''); setFCategory(''); setFPrice(''); setFOriginalPrice('')
    setFDescription(''); setFBadge(''); setEditingProduct(null); setShowProductForm(false)
  }

  const openEditForm = (p: DemoProduct) => {
    setEditingProduct(p); setFName(p.name); setFCategory(p.category)
    setFPrice(String(p.price)); setFOriginalPrice(p.originalPrice ? String(p.originalPrice) : '')
    setFDescription(p.description); setFBadge(p.badge || ''); setShowProductForm(true)
  }

  const saveProduct = () => {
    if (!fName || !fCategory || !fPrice) return
    let updated: DemoProduct[]
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? {
        ...p, name: fName, category: fCategory, price: Number(fPrice),
        originalPrice: fOriginalPrice ? Number(fOriginalPrice) : undefined,
        description: fDescription, badge: fBadge || undefined,
      } : p)
    } else {
      const newP: DemoProduct = {
        id: `j_${Date.now()}`, name: fName, category: fCategory, price: Number(fPrice),
        originalPrice: fOriginalPrice ? Number(fOriginalPrice) : undefined,
        description: fDescription, image: '', badge: fBadge || undefined, inStock: true,
      }
      updated = [...products, newP]
    }
    setProducts(updated); saveDemoProducts(store.id, updated); resetForm()
  }

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated); saveDemoProducts(store.id, updated)
  }

  const updateOrderStatus = (orderId: string, status: DemoOrder['status']) => {
    updateDemoOrder(store.id, orderId, { status })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  // Dashboard stats
  const stats = useMemo(() => {
    const totalOrders = orders.length
    const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
    const pending = orders.filter(o => ['new', 'confirmed', 'packed'].includes(o.status)).length
    const totalProducts = products.length
    const statusBreakdown = STATUS_FLOW.concat(['cancelled'] as DemoOrder['status'][]).map(s => ({
      status: s, count: orders.filter(o => o.status === s).length,
    }))
    // Top 5 selling
    const productSales: Record<string, { name: string; qty: number }> = {}
    orders.filter(o => o.status !== 'cancelled').forEach(o => {
      o.items.forEach(i => {
        if (!productSales[i.productId]) productSales[i.productId] = { name: i.productName, qty: 0 }
        productSales[i.productId].qty += i.quantity
      })
    })
    const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5)
    return { totalOrders, revenue, pending, totalProducts, statusBreakdown, topProducts }
  }, [orders, products])

  // Collections data
  const collections = useMemo(() => {
    const catMap: Record<string, { icon: string; name: string; products: DemoProduct[] }> = {}
    store.categories.forEach(c => { catMap[c.id] = { icon: c.icon, name: c.name, products: [] } })
    products.forEach(p => {
      if (catMap[p.category]) catMap[p.category].products.push(p)
      else catMap[p.category] = { icon: '💍', name: p.category, products: [p] }
    })
    return Object.entries(catMap).map(([id, data]) => ({
      id, icon: data.icon, name: data.name, count: data.products.length,
      totalValue: data.products.reduce((s, p) => s + p.price, 0),
    }))
  }, [products, store.categories])

  const filteredProducts = useMemo(() => {
    if (!productSearch) return products
    const q = productSearch.toLowerCase()
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }, [products, productSearch])

  // --- Login Screen ---
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">💎</div>
            <h1 className="text-2xl font-bold text-[#D4AF37]">Aadhya Jewels</h1>
            <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
          </div>
          <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="admin@demo.in" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                placeholder="admin123" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            {loginError && <p className="text-red-400 text-xs">{loginError}</p>}
            <button onClick={handleLogin}
              className="w-full bg-[#D4AF37] text-[#0F0F0F] font-semibold py-2.5 rounded-lg hover:bg-[#c9a430] transition-colors">
              Sign In
            </button>
          </div>
          <div className="text-center mt-4">
            <Link href="/" className="text-gray-500 text-xs hover:text-[#D4AF37] transition-colors">
              PixelCraft Studios
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'dashboard' as const, label: 'Dashboard', icon: '📊' },
    { key: 'products' as const, label: 'Products', icon: '💍' },
    { key: 'orders' as const, label: 'Orders', icon: '📦' },
    { key: 'collections' as const, label: 'Collections', icon: '👑' },
  ]

  const statusBarColor = (s: string) => {
    const map: Record<string, string> = {
      new: 'bg-blue-500', confirmed: 'bg-amber-500', packed: 'bg-purple-500',
      shipped: 'bg-cyan-500', delivered: 'bg-emerald-500', cancelled: 'bg-red-500',
    }
    return map[s] || 'bg-gray-500'
  }

  const statusPillClass = (s: string, active: boolean) =>
    active ? 'bg-[#D4AF37] text-[#0F0F0F] font-semibold' : 'border border-[#555] text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37]'

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-[#D4AF37] text-sm transition-colors">
              &larr; PixelCraft
            </Link>
            <div className="h-5 w-px bg-[#333]" />
            <div>
              <h1 className="text-lg font-bold text-[#D4AF37]">Aadhya Jewels</h1>
              <p className="text-[10px] text-gray-500 -mt-0.5">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demos/jewelry" className="text-xs text-gray-400 border border-[#444] px-3 py-1.5 rounded-full hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
              View Store
            </Link>
            <button onClick={() => setAuthenticated(false)}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors">
              Logout
            </button>
          </div>
        </div>
        {/* Horizontal Tab Bar */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  tab === t.key
                    ? 'bg-[#D4AF37] text-[#0F0F0F] font-semibold'
                    : 'border border-[#555] text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}>
                <span className="mr-1.5">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ===== DASHBOARD ===== */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: stats.totalOrders, icon: '📦' },
                { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: '💰' },
                { label: 'Pending Orders', value: stats.pending, icon: '⏳' },
                { label: 'Total Products', value: stats.totalProducts, icon: '💍' },
              ].map(card => (
                <div key={card.label} className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <p className="text-2xl font-bold text-[#D4AF37]">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Order Status Breakdown</h3>
              <div className="space-y-3">
                {stats.statusBreakdown.map(s => {
                  const maxCount = Math.max(...stats.statusBreakdown.map(x => x.count), 1)
                  return (
                    <div key={s.status} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-20 capitalize">{STATUS_LABELS[s.status]}</span>
                      <div className="flex-1 bg-[#252525] rounded-full h-5 overflow-hidden">
                        <div className={`${statusBarColor(s.status)} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                          style={{ width: `${Math.max((s.count / maxCount) * 100, s.count > 0 ? 12 : 0)}%` }}>
                          {s.count > 0 && <span className="text-[10px] font-bold text-white">{s.count}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top 5 Selling Products */}
            <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Top 5 Selling Products</h3>
              {stats.topProducts.length === 0 ? (
                <p className="text-gray-500 text-sm">No sales data yet</p>
              ) : (
                <div className="space-y-2">
                  {stats.topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#252525] last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[#D4AF37] font-bold text-sm w-5">#{i + 1}</span>
                        <span className="text-sm text-gray-200">{p.name}</span>
                      </div>
                      <span className="text-xs text-[#D4AF37] font-semibold">{p.qty} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== PRODUCTS ===== */}
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full sm:w-72 bg-[#252525] border border-[#444] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]" />
              <button onClick={() => { resetForm(); setShowProductForm(true) }}
                className="bg-[#D4AF37] text-[#0F0F0F] font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#c9a430] transition-colors whitespace-nowrap">
                + Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-[#1A1A1A] border border-[#333] rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-semibold text-[#D4AF37]">
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Name *</label>
                      <input value={fName} onChange={e => setFName(e.target.value)}
                        className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Category *</label>
                        <select value={fCategory} onChange={e => setFCategory(e.target.value)}
                          className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]">
                          <option value="">Select</option>
                          {store.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Badge</label>
                        <input value={fBadge} onChange={e => setFBadge(e.target.value)}
                          className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                          placeholder="e.g. Bestseller" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Price (₹) *</label>
                        <input value={fPrice} onChange={e => setFPrice(e.target.value)} type="number"
                          className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-xs mb-1">Original Price (₹)</label>
                        <input value={fOriginalPrice} onChange={e => setFOriginalPrice(e.target.value)} type="number"
                          className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Description</label>
                      <textarea value={fDescription} onChange={e => setFDescription(e.target.value)} rows={3}
                        className="w-full bg-[#252525] border border-[#444] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] resize-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={saveProduct}
                      className="flex-1 bg-[#D4AF37] text-[#0F0F0F] font-semibold py-2 rounded-lg text-sm hover:bg-[#c9a430] transition-colors">
                      {editingProduct ? 'Update' : 'Add'} Product
                    </button>
                    <button onClick={resetForm}
                      className="flex-1 border border-[#555] text-gray-400 py-2 rounded-lg text-sm hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-[#1A1A1A] border border-[#333] rounded-xl p-5 hover:border-[#D4AF37] transition-colors group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{p.name}</h4>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">{p.category}</p>
                    </div>
                    {p.badge && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-semibold whitespace-nowrap">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#D4AF37]">₹{p.price.toLocaleString('en-IN')}</span>
                      {p.originalPrice && (
                        <span className="ml-2 text-xs text-gray-500 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditForm(p)} className="text-xs text-[#D4AF37] hover:underline">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500 py-12 text-sm">No products found</p>
            )}
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {tab === 'orders' && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 mb-2">{orders.length} Order{orders.length !== 1 ? 's' : ''}</h2>
            {orders.length === 0 && <p className="text-gray-500 text-sm text-center py-12">No orders yet</p>}
            {orders.map(order => {
              const isExpanded = expandedOrder === order.id
              return (
                <div key={order.id} className="bg-[#1A1A1A] border border-[#333] rounded-xl overflow-hidden">
                  {/* Order Header - clickable */}
                  <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#252525]/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{order.orderId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400' :
                            order.status === 'cancelled' ? 'bg-red-500/15 text-red-400' :
                            order.status === 'shipped' ? 'bg-cyan-500/15 text-cyan-400' :
                            order.status === 'new' ? 'bg-blue-500/15 text-blue-400' :
                            'bg-amber-500/15 text-amber-400'
                          }`}>{STATUS_LABELS[order.status]}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{order.customerName} &middot; {order.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-[#D4AF37]">₹{order.total.toLocaleString('en-IN')}</span>
                      <span className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>&#9662;</span>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-[#333] px-5 py-4 space-y-4 bg-[#151515]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</h4>
                          <p className="text-sm text-gray-200">{order.customerName}</p>
                          <p className="text-xs text-gray-400">{order.customerEmail}</p>
                          <p className="text-xs text-gray-400">{order.customerPhone}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Address</h4>
                          <p className="text-sm text-gray-200">{order.address}</p>
                          <p className="text-xs text-gray-400">{order.city}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</h4>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#252525] last:border-0">
                              <div>
                                <span className="text-sm text-gray-200">{item.productName}</span>
                                {item.variant && <span className="text-xs text-gray-500 ml-2">({item.variant})</span>}
                                <span className="text-xs text-gray-500 ml-2">x{item.quantity}</span>
                              </div>
                              <span className="text-sm text-gray-300">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-gray-500">Payment: <span className="text-gray-300">{order.paymentMode}</span></span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                        }`}>{order.paymentStatus}</span>
                        <span className="text-gray-500">Date: <span className="text-gray-300">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span></span>
                      </div>

                      {order.notes && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</h4>
                          <p className="text-sm text-gray-300 italic">{order.notes}</p>
                        </div>
                      )}

                      {/* Status Update Buttons */}
                      {order.status !== 'cancelled' && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</h4>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_FLOW.map(s => (
                              <button key={s} onClick={() => updateOrderStatus(order.id, s)}
                                className={`px-3 py-1 rounded-full text-xs capitalize transition-all ${statusPillClass(s, order.status === s)}`}>
                                {STATUS_LABELS[s]}
                              </button>
                            ))}
                            <button onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="px-3 py-1 rounded-full text-xs transition-all border border-red-500/30 text-red-400 hover:border-red-500 hover:text-red-300">
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ===== COLLECTIONS ===== */}
        {tab === 'collections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-400">Product Collections</h2>
              <span className="text-xs text-gray-500">{collections.length} categories</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map(col => (
                <div key={col.id} className="bg-[#1A1A1A] border border-[#333] rounded-xl p-6 hover:border-[#D4AF37]/50 transition-colors">
                  <div className="text-3xl mb-3">{col.icon}</div>
                  <h3 className="text-base font-semibold text-white mb-1">{col.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xl font-bold text-[#D4AF37]">{col.count}</p>
                      <p className="text-[10px] text-gray-500">Products</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-200">₹{col.totalValue.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-gray-500">Total Value</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {collections.length === 0 && (
              <p className="text-center text-gray-500 py-12 text-sm">No collections found</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
