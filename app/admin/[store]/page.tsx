'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { DemoStoreConfig, DemoProduct, DemoOrder, getDemoOrders, updateDemoOrder, getDemoProducts, saveDemoProducts } from '@/lib/demo-store-types'
import boutiqueData from '@/data/boutique'
import jewelryData from '@/data/jewelry'
import bakeryData from '@/data/bakery'
import skincareData from '@/data/skincare'
import Link from 'next/link'

const STORES: Record<string, DemoStoreConfig> = {
  boutique: boutiqueData,
  jewelry: jewelryData,
  bakery: bakeryData,
  skincare: skincareData,
}

const ADMIN_EMAIL = 'admin@demo.in'
const ADMIN_PASSWORD = 'admin123'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-amber-100 text-amber-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_FLOW = ['new', 'confirmed', 'packed', 'shipped', 'delivered']

export default function DemoAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <AdminContent />
    </Suspense>
  )
}

function AdminContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const storeId = params.store as string
  const isDemo = searchParams.get('demo') === 'true'
  const store = STORES[storeId]

  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState(isDemo ? ADMIN_EMAIL : '')
  const [password, setPassword] = useState(isDemo ? ADMIN_PASSWORD : '')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard')
  const [products, setProducts] = useState<DemoProduct[]>([])
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DemoProduct | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  // Product form state
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formOriginalPrice, setFormOriginalPrice] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formBadge, setFormBadge] = useState('')

  useEffect(() => {
    if (!store) return
    const saved = getDemoProducts(storeId)
    setProducts(saved || store.products)
    const savedOrders = getDemoOrders(storeId)
    setOrders(savedOrders.length > 0 ? savedOrders : store.orders)
  }, [store, storeId])

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Store not found</h1>
          <p className="text-gray-500 mb-4">The store &quot;{storeId}&quot; does not exist.</p>
          <Link href="/" className="text-violet-600 hover:underline">Back to PixelCraft Studios</Link>
        </div>
      </div>
    )
  }

  const handleLogin = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Use admin@demo.in / admin123')
    }
  }

  const resetForm = () => {
    setFormName(''); setFormCategory(''); setFormPrice(''); setFormOriginalPrice('')
    setFormDescription(''); setFormBadge(''); setEditingProduct(null); setShowProductForm(false)
  }

  const openEditProduct = (p: DemoProduct) => {
    setEditingProduct(p)
    setFormName(p.name); setFormCategory(p.category); setFormPrice(String(p.price))
    setFormOriginalPrice(p.originalPrice ? String(p.originalPrice) : '')
    setFormDescription(p.description); setFormBadge(p.badge || '')
    setShowProductForm(true)
  }

  const saveProduct = () => {
    if (!formName || !formCategory || !formPrice) return
    const product: DemoProduct = {
      id: editingProduct?.id || `${storeId}_${Date.now()}`,
      name: formName, category: formCategory, price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      description: formDescription, image: '', badge: formBadge || undefined, inStock: true,
      variants: editingProduct?.variants, details: editingProduct?.details,
    }
    let updated: DemoProduct[]
    if (editingProduct) {
      updated = products.map(p => p.id === editingProduct.id ? product : p)
    } else {
      updated = [product, ...products]
    }
    setProducts(updated)
    saveDemoProducts(storeId, updated)
    resetForm()
  }

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    saveDemoProducts(storeId, updated)
  }

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: status as DemoOrder['status'] } : o)
    setOrders(updated)
    updateDemoOrder(storeId, orderId, { status: status as DemoOrder['status'] })
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: status as DemoOrder['status'] })
  }

  // Dashboard stats
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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  )

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.orderId.toLowerCase().includes(orderSearch.toLowerCase())
  )

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{store.name}</h1>
            <p className="text-gray-500 text-sm mt-1">Admin Portal</p>
          </div>
          {loginError && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-lg p-2">{loginError}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent outline-none text-gray-800" placeholder="admin@demo.in" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent outline-none text-gray-800" placeholder="••••••••" />
            </div>
            <button onClick={handleLogin} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors">Sign In</button>
          </div>
          {isDemo && (
            <p className="text-center text-xs text-gray-400 mt-4 bg-gray-50 rounded-lg p-2">
              Demo credentials pre-filled: admin@demo.in / admin123
            </p>
          )}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm text-violet-600 hover:underline">← Back to PixelCraft Studios</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-1 text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">{store.name}</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/demos/${storeId}`} className="text-sm text-violet-600 hover:underline hidden sm:inline">View Store →</Link>
            <button onClick={() => { setAuthenticated(false); setEmail(''); setPassword('') }} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar — desktop */}
        <aside className={`${mobileMenu ? 'block' : 'hidden'} md:block w-full md:w-56 bg-white md:bg-transparent md:border-r border-gray-100 md:min-h-[calc(100vh-60px)] shrink-0 fixed md:sticky top-[60px] left-0 z-30 md:z-auto shadow-lg md:shadow-none`}>
          <nav className="p-4 space-y-1">
            {(['dashboard', 'products', 'orders'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setMobileMenu(false) }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-violet-100 text-violet-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                {t === 'dashboard' && '📊 '}{t === 'products' && '📦 '}{t === 'orders' && '📋 '}{t}
              </button>
            ))}
            <hr className="my-3 border-gray-100" />
            <Link href={`/demos/${storeId}`} className="block px-4 py-2.5 text-sm text-gray-500 hover:text-violet-600">🏪 View Store</Link>
            <Link href="/" className="block px-4 py-2.5 text-sm text-gray-500 hover:text-violet-600">← PixelCraft Studios</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 min-w-0">
          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Orders" value={String(stats.totalOrders)} icon="📦" color="bg-blue-50 text-blue-600" />
                <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon="💰" color="bg-emerald-50 text-emerald-600" />
                <StatCard label="Pending" value={String(stats.pending)} icon="⏳" color="bg-amber-50 text-amber-600" />
                <StatCard label="Products" value={String(products.length)} icon="🏷️" color="bg-violet-50 text-violet-600" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Status Breakdown */}
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-700 mb-4">Order Status</h3>
                  <div className="space-y-3">
                    {STATUS_FLOW.map(s => (
                      <div key={s} className="flex items-center justify-between">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[s]}`}>{s}</span>
                        <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: `${stats.totalOrders ? ((stats.statusBreakdown[s] || 0) / stats.totalOrders * 100) : 0}%` }} />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-6 text-right">{stats.statusBreakdown[s] || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <h3 className="font-semibold text-gray-700 mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {stats.topProducts.map(([name, count], i) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-5">{i + 1}.</span>
                        <span className="text-sm text-gray-700 flex-1 truncate">{name}</span>
                        <span className="text-sm font-medium text-violet-600">{count} sold</span>
                      </div>
                    ))}
                    {stats.topProducts.length === 0 && <p className="text-sm text-gray-400">No orders yet</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {tab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-800">Products ({products.length})</h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..." className="flex-1 sm:w-60 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-400 outline-none text-gray-800" />
                  <button onClick={() => { resetForm(); setShowProductForm(true) }} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">+ Add</button>
                </div>
              </div>

              {/* Product Form */}
              {showProductForm && (
                <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-4">
                  <h3 className="font-semibold text-gray-700">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Product name" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-400 text-gray-800" />
                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-400 text-gray-800">
                      <option value="">Select category</option>
                      {store.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="Price (₹)" type="number" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-400 text-gray-800" />
                    <input value={formOriginalPrice} onChange={e => setFormOriginalPrice(e.target.value)} placeholder="Original price (optional)" type="number" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-400 text-gray-800" />
                    <input value={formBadge} onChange={e => setFormBadge(e.target.value)} placeholder="Badge (e.g. Bestseller)" className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-400 text-gray-800" />
                  </div>
                  <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-400 text-gray-800" />
                  <div className="flex gap-2">
                    <button onClick={saveProduct} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">{editingProduct ? 'Update' : 'Add Product'}</button>
                    <button onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {/* Product List */}
              <div className="space-y-2">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-12 h-12 bg-violet-50 rounded-lg flex items-center justify-center text-2xl shrink-0">
                      {store.categories.find(c => c.id === p.category)?.icon || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{store.categories.find(c => c.id === p.category)?.name || p.category}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="text-sm font-bold text-gray-800">₹{p.price}</span>
                      {p.badge && <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{p.badge}</span>}
                      <button onClick={() => openEditProduct(p)} className="text-xs text-violet-600 hover:underline">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-800">Orders ({orders.length})</h2>
                <input type="text" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search by name or order ID..." className="w-full sm:w-72 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-400 outline-none text-gray-800" />
              </div>

              {selectedOrder ? (
                <div className="bg-white rounded-xl p-5 border border-gray-200 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">Order {selectedOrder.orderId}</h3>
                    <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-gray-400 text-xs">Customer</p><p className="font-medium text-gray-800">{selectedOrder.customerName}</p></div>
                    <div><p className="text-gray-400 text-xs">Phone</p><p className="font-medium text-gray-800">{selectedOrder.customerPhone}</p></div>
                    <div><p className="text-gray-400 text-xs">City</p><p className="font-medium text-gray-800">{selectedOrder.city}</p></div>
                    <div><p className="text-gray-400 text-xs">Payment</p><p className="font-medium text-gray-800">{selectedOrder.paymentMode} · <span className={selectedOrder.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}>{selectedOrder.paymentStatus}</span></p></div>
                  </div>

                  <div><p className="text-gray-400 text-xs mb-1">Address</p><p className="text-sm text-gray-700">{selectedOrder.address}, {selectedOrder.city}</p></div>
                  {selectedOrder.notes && <div><p className="text-gray-400 text-xs mb-1">Notes</p><p className="text-sm text-gray-700">{selectedOrder.notes}</p></div>}

                  <div>
                    <p className="text-gray-400 text-xs mb-2">Items</p>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium text-gray-800">{item.productName}</p>
                            {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                          </div>
                          <p className="text-gray-700">{item.quantity} × ₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-right font-bold text-gray-800 mt-2">Total: ₹{selectedOrder.total.toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {[...STATUS_FLOW, 'cancelled'].map(s => (
                        <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${selectedOrder.status === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-violet-400' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredOrders.map(o => (
                    <div key={o.id} onClick={() => setSelectedOrder(o)} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-violet-200 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-800 text-sm">{o.orderId}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                        </div>
                        <p className="text-xs text-gray-500">{o.customerName} · {o.city}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800 text-sm">₹{o.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && <p className="text-center text-gray-400 py-8">No orders found</p>}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-xl mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  )
}
