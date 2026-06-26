'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { DemoProduct, DemoOrder, getDemoOrders, updateDemoOrder, getDemoProducts, saveDemoProducts } from '@/lib/demo-store-types'
import storeData from '@/data/bakery'
import Link from 'next/link'

const ADMIN_EMAIL = 'admin@demo.in'
const ADMIN_PASSWORD = 'admin123'
const STORE_ID = 'bakery'

type Tab = 'dashboard' | 'products' | 'orders' | 'custom' | 'delivery'

interface CustomOrder {
  id: string
  customerName: string
  description: string
  deliveryDate: string
  budgetMin: number
  budgetMax: number
  status: 'inquiry' | 'confirmed' | 'in-progress' | 'ready' | 'delivered'
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-400',
  confirmed: 'bg-amber-400',
  packed: 'bg-purple-400',
  shipped: 'bg-cyan-400',
  delivered: 'bg-emerald-400',
  cancelled: 'bg-red-400',
}

const STATUS_TEXT: Record<string, string> = {
  new: 'text-blue-700 bg-blue-50',
  confirmed: 'text-amber-700 bg-amber-50',
  packed: 'text-purple-700 bg-purple-50',
  shipped: 'text-cyan-700 bg-cyan-50',
  delivered: 'text-emerald-700 bg-emerald-50',
  cancelled: 'text-red-700 bg-red-50',
}

const STATUS_FLOW = ['new', 'confirmed', 'packed', 'shipped', 'delivered']

const CUSTOM_STATUS_COLORS: Record<string, string> = {
  inquiry: 'text-blue-700 bg-blue-50',
  confirmed: 'text-amber-700 bg-amber-50',
  'in-progress': 'text-purple-700 bg-purple-50',
  ready: 'text-emerald-700 bg-emerald-50',
  delivered: 'text-teal-700 bg-teal-50',
}

const CATEGORY_EMOJI: Record<string, string> = {
  'birthday-cakes': '🎂',
  cupcakes: '🧁',
  brownies: '🍫',
  cookies: '🍪',
  'dessert-boxes': '🎁',
}

const TAB_CONFIG: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'products', icon: '🎂', label: 'Products' },
  { id: 'orders', icon: '📋', label: 'Orders' },
  { id: 'custom', icon: '✨', label: 'Custom Orders' },
  { id: 'delivery', icon: '🚚', label: 'Delivery' },
]

export default function BakeryAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#FFF8F3' }} />}>
      <BakeryAdminContent />
    </Suspense>
  )
}

function BakeryAdminContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get('demo') === 'true'

  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState(isDemo ? ADMIN_EMAIL : '')
  const [password, setPassword] = useState(isDemo ? ADMIN_PASSWORD : '')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [products, setProducts] = useState<DemoProduct[]>([])
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DemoProduct | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [sidebarHover, setSidebarHover] = useState(false)

  // Product form
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formOriginalPrice, setFormOriginalPrice] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formBadge, setFormBadge] = useState('')

  // Custom orders
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [coName, setCoName] = useState('')
  const [coDesc, setCoDesc] = useState('')
  const [coDate, setCoDate] = useState('')
  const [coBudgetMin, setCoBudgetMin] = useState('')
  const [coBudgetMax, setCoBudgetMax] = useState('')
  const [coStatus, setCoStatus] = useState<CustomOrder['status']>('inquiry')

  useEffect(() => {
    const saved = getDemoProducts(STORE_ID)
    setProducts(saved || storeData.products)
    const savedOrders = getDemoOrders(STORE_ID)
    setOrders(savedOrders.length > 0 ? savedOrders : storeData.orders)
    try {
      const co = JSON.parse(localStorage.getItem('demo_custom_orders_bakery') || '[]')
      setCustomOrders(co)
    } catch { /* empty */ }
  }, [])

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
      id: editingProduct?.id || `bk_${Date.now()}`,
      name: formName, category: formCategory, price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      description: formDescription, image: '', badge: formBadge || undefined, inStock: true,
      variants: editingProduct?.variants, details: editingProduct?.details,
    }
    const updated = editingProduct
      ? products.map(p => p.id === editingProduct.id ? product : p)
      : [product, ...products]
    setProducts(updated)
    saveDemoProducts(STORE_ID, updated)
    resetForm()
  }

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id)
    setProducts(updated)
    saveDemoProducts(STORE_ID, updated)
  }

  const updateOrderStatus = (orderId: string, status: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: status as DemoOrder['status'] } : o)
    setOrders(updated)
    updateDemoOrder(STORE_ID, orderId, { status: status as DemoOrder['status'] })
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: status as DemoOrder['status'] })
  }

  const saveCustomOrder = () => {
    if (!coName || !coDesc || !coDate) return
    const co: CustomOrder = {
      id: `co_${Date.now()}`, customerName: coName, description: coDesc,
      deliveryDate: coDate, budgetMin: Number(coBudgetMin) || 0, budgetMax: Number(coBudgetMax) || 0,
      status: coStatus, createdAt: new Date().toISOString(),
    }
    const updated = [co, ...customOrders]
    setCustomOrders(updated)
    localStorage.setItem('demo_custom_orders_bakery', JSON.stringify(updated))
    setCoName(''); setCoDesc(''); setCoDate(''); setCoBudgetMin(''); setCoBudgetMax('')
    setCoStatus('inquiry'); setShowCustomForm(false)
  }

  const updateCustomStatus = (id: string, status: CustomOrder['status']) => {
    const updated = customOrders.map(c => c.id === id ? { ...c, status } : c)
    setCustomOrders(updated)
    localStorage.setItem('demo_custom_orders_bakery', JSON.stringify(updated))
  }

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

  const deliveryGroups = useMemo(() => {
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7)

    const groups: { label: string; orders: DemoOrder[] }[] = [
      { label: 'Today', orders: [] },
      { label: 'Tomorrow', orders: [] },
      { label: 'This Week', orders: [] },
      { label: 'Earlier', orders: [] },
    ]

    const active = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
    active.forEach(o => {
      const d = o.createdAt.split('T')[0]
      if (d === todayStr) groups[0].orders.push(o)
      else if (d === tomorrowStr) groups[1].orders.push(o)
      else if (new Date(d) <= weekEnd && new Date(d) > tomorrow) groups[2].orders.push(o)
      else groups[3].orders.push(o)
    })
    return groups
  }, [orders])

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFF8F3' }}>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4" style={{ background: '#FEF0E8' }}>
              <span className="text-3xl">🧁</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#F4845F' }}>SweetCrumb Bakery</h1>
            <p className="text-gray-400 text-sm mt-1">Admin Portal</p>
          </div>
          {loginError && <p className="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-2xl p-2">{loginError}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 outline-none text-gray-800"
                style={{ '--tw-ring-color': '#F4845F' } as React.CSSProperties}
                placeholder="admin@demo.in" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 outline-none text-gray-800"
                style={{ '--tw-ring-color': '#F4845F' } as React.CSSProperties}
                placeholder="••••••••" />
            </div>
            <button onClick={handleLogin}
              className="w-full text-white font-semibold py-3 rounded-2xl transition-opacity hover:opacity-90"
              style={{ background: '#F4845F' }}>
              Sign In
            </button>
          </div>
          {isDemo && (
            <p className="text-center text-xs text-gray-400 mt-4 bg-orange-50 rounded-2xl p-2">
              Demo credentials pre-filled: admin@demo.in / admin123
            </p>
          )}
          <div className="text-center mt-6">
            <Link href="/" className="text-sm hover:underline" style={{ color: '#F4845F' }}>
              ← Back to PixelCraft Studios
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F3' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <h1 className="font-bold text-xl tracking-tight" style={{ color: '#F4845F' }}>
            SweetCrumb Bakery
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/demos/bakery" className="text-sm hover:underline hidden sm:inline" style={{ color: '#F4845F' }}>
              View Store →
            </Link>
            <button onClick={() => { setAuthenticated(false); setEmail(''); setPassword('') }}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 flex">
        {TAB_CONFIG.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${tab === t.id ? 'font-semibold' : 'text-gray-400'}`}
            style={tab === t.id ? { color: '#F4845F' } : {}}>
            <span className="text-lg">{t.icon}</span>
            <span className="mt-0.5">{t.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex max-w-7xl mx-auto">
        {/* Left icon sidebar — expands on hover */}
        <aside
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
          className={`hidden md:flex flex-col sticky top-[57px] h-[calc(100vh-57px)] bg-white border-r border-orange-100 transition-all duration-300 shrink-0 ${sidebarHover ? 'w-48' : 'w-16'}`}>
          <nav className="flex flex-col gap-1 p-2 mt-2">
            {TAB_CONFIG.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                title={t.label}
                className={`flex items-center gap-3 rounded-2xl transition-all duration-200 overflow-hidden whitespace-nowrap ${tab === t.id ? 'shadow-sm' : 'hover:bg-orange-50'} ${sidebarHover ? 'px-4 py-2.5' : 'px-0 py-2.5 justify-center'}`}
                style={tab === t.id ? { background: '#FEF0E8', color: '#F4845F' } : { color: '#9CA3AF' }}>
                <span className="text-xl shrink-0">{t.icon}</span>
                {sidebarHover && <span className="text-sm font-medium">{t.label}</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto p-2 mb-4">
            <Link href="/" title="PixelCraft Studios"
              className={`flex items-center gap-3 text-gray-400 hover:text-gray-600 rounded-2xl transition-all ${sidebarHover ? 'px-4 py-2.5' : 'justify-center py-2.5'}`}>
              <span className="text-xl shrink-0">←</span>
              {sidebarHover && <span className="text-sm">Home</span>}
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 min-w-0 pb-24 md:pb-6">

          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Orders', value: String(stats.totalOrders), emoji: '🧾', bg: '#FEF0E8' },
                  { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, emoji: '💰', bg: '#F0FDF4' },
                  { label: 'Pending', value: String(stats.pending), emoji: '⏳', bg: '#FFF7ED' },
                  { label: 'Products', value: String(products.length), emoji: '🧁', bg: '#F5F3FF' },
                ].map(c => (
                  <div key={c.label} className="bg-white rounded-3xl p-5 shadow-sm border border-orange-50">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl mb-3" style={{ background: c.bg }}>
                      {c.emoji}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{c.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{c.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Status breakdown */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50">
                  <h3 className="font-semibold text-gray-700 mb-4">Order Status</h3>
                  <div className="space-y-3">
                    {STATUS_FLOW.map(s => {
                      const count = stats.statusBreakdown[s] || 0
                      const pct = stats.totalOrders ? Math.round((count / stats.totalOrders) * 100) : 0
                      return (
                        <div key={s} className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${STATUS_COLORS[s]}`} />
                          <span className="text-sm text-gray-600 capitalize w-20">{s}</span>
                          <span className="text-sm font-semibold text-gray-800 w-8 text-right">{pct}%</span>
                          <span className="text-xs text-gray-400">({count})</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Top products */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50">
                  <h3 className="font-semibold text-gray-700 mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {stats.topProducts.map(([name, count], i) => (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-300 w-5">{i + 1}.</span>
                        <span className="text-sm text-gray-700 flex-1 truncate">{name}</span>
                        <span className="text-sm font-semibold" style={{ color: '#F4845F' }}>{count} sold</span>
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
                  <input type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 sm:w-60 px-4 py-2 border border-gray-200 rounded-2xl text-sm focus:ring-2 outline-none text-gray-800"
                    style={{ '--tw-ring-color': '#F4845F' } as React.CSSProperties} />
                  <button onClick={() => { resetForm(); setShowProductForm(true) }}
                    className="text-white px-4 py-2 rounded-2xl text-sm font-medium transition-opacity hover:opacity-90 whitespace-nowrap"
                    style={{ background: '#F4845F' }}>
                    + Add
                  </button>
                </div>
              </div>

              {showProductForm && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50 space-y-4">
                  <h3 className="font-semibold text-gray-700">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="Product name"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)}
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800">
                      <option value="">Select category</option>
                      {storeData.categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                    <input value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="Price (₹)" type="number"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                    <input value={formOriginalPrice} onChange={e => setFormOriginalPrice(e.target.value)} placeholder="Original price (optional)" type="number"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                    <input value={formBadge} onChange={e => setFormBadge(e.target.value)} placeholder="Badge (e.g. Bestseller)"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                  </div>
                  <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Description" rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                  <div className="flex gap-2">
                    <button onClick={saveProduct}
                      className="text-white px-5 py-2 rounded-2xl text-sm font-medium transition-opacity hover:opacity-90"
                      style={{ background: '#F4845F' }}>
                      {editingProduct ? 'Update' : 'Add Product'}
                    </button>
                    <button onClick={resetForm}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-2xl text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-50 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ background: '#FEF0E8' }}>
                      {CATEGORY_EMOJI[p.category] || '🧁'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{storeData.categories.find(c => c.id === p.category)?.name || p.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-800">₹{p.price}</span>
                      {p.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                          {p.badge}
                        </span>
                      )}
                      <button onClick={() => openEditProduct(p)} className="text-xs hover:underline" style={{ color: '#F4845F' }}>Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && <p className="text-center text-gray-400 py-8">No products found</p>}
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-gray-800">Orders ({orders.length})</h2>
                <input type="text" value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Search by name or order ID..."
                  className="w-full sm:w-72 px-4 py-2 border border-gray-200 rounded-2xl text-sm focus:ring-2 outline-none text-gray-800" />
              </div>

              {selectedOrder ? (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">Order {selectedOrder.orderId}</h3>
                    <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-400 hover:text-gray-600">← Back</button>
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
                        <div key={i} className="flex justify-between items-center rounded-2xl px-4 py-3 text-sm" style={{ background: '#FFF8F3' }}>
                          <div>
                            <p className="font-medium text-gray-800">{item.productName}</p>
                            {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                          </div>
                          <p className="text-gray-700">{item.quantity} x ₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-right font-bold text-gray-800 mt-3">Total: ₹{selectedOrder.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {[...STATUS_FLOW, 'cancelled'].map(s => (
                        <button key={s} onClick={() => updateOrderStatus(selectedOrder.id, s)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${selectedOrder.status === s ? STATUS_TEXT[s] + ' ring-2 ring-offset-1' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                          style={selectedOrder.status === s ? { '--tw-ring-color': '#F4845F' } as React.CSSProperties : {}}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredOrders.map(o => (
                    <div key={o.id} onClick={() => setSelectedOrder(o)}
                      className="bg-white rounded-2xl shadow-sm border border-orange-50 hover:border-orange-200 transition-colors cursor-pointer flex overflow-hidden">
                      {/* Status ribbon */}
                      <div className={`w-1.5 shrink-0 ${STATUS_COLORS[o.status]}`} />
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-800 text-sm">{o.orderId}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_TEXT[o.status]}`}>{o.status}</span>
                          </div>
                          <p className="text-xs text-gray-500">{o.customerName} · {o.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-sm">₹{o.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && <p className="text-center text-gray-400 py-8">No orders found</p>}
                </div>
              )}
            </div>
          )}

          {/* Custom Orders */}
          {tab === 'custom' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Custom Orders</h2>
                  <p className="text-sm text-gray-400">Custom cakes and pastry requests</p>
                </div>
                <button onClick={() => setShowCustomForm(!showCustomForm)}
                  className="text-white px-4 py-2 rounded-2xl text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: '#F4845F' }}>
                  + New Request
                </button>
              </div>

              {showCustomForm && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50 space-y-4">
                  <h3 className="font-semibold text-gray-700">Log Custom Order</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={coName} onChange={e => setCoName(e.target.value)} placeholder="Customer name"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                    <input value={coDate} onChange={e => setCoDate(e.target.value)} type="date" placeholder="Delivery date"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                    <input value={coBudgetMin} onChange={e => setCoBudgetMin(e.target.value)} placeholder="Budget min (₹)" type="number"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                    <input value={coBudgetMax} onChange={e => setCoBudgetMax(e.target.value)} placeholder="Budget max (₹)" type="number"
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                    <select value={coStatus} onChange={e => setCoStatus(e.target.value as CustomOrder['status'])}
                      className="px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800">
                      <option value="inquiry">Inquiry</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <textarea value={coDesc} onChange={e => setCoDesc(e.target.value)} placeholder="Describe the custom order (cake design, flavour, tiers, etc.)" rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 text-gray-800" />
                  <div className="flex gap-2">
                    <button onClick={saveCustomOrder}
                      className="text-white px-5 py-2 rounded-2xl text-sm font-medium transition-opacity hover:opacity-90"
                      style={{ background: '#F4845F' }}>
                      Save
                    </button>
                    <button onClick={() => setShowCustomForm(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-2xl text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {customOrders.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-50">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ background: '#F5F3FF' }}>
                        ✨
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-gray-800 text-sm">{c.customerName}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${CUSTOM_STATUS_COLORS[c.status]}`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{c.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Delivery: {new Date(c.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {(c.budgetMin > 0 || c.budgetMax > 0) && (
                            <span>Budget: ₹{c.budgetMin.toLocaleString()} - ₹{c.budgetMax.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <select value={c.status}
                        onChange={e => updateCustomStatus(c.id, e.target.value as CustomOrder['status'])}
                        className="text-xs border border-gray-200 rounded-xl px-2 py-1.5 text-gray-600 outline-none shrink-0">
                        <option value="inquiry">Inquiry</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                ))}
                {customOrders.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-4xl block mb-3">🎂</span>
                    <p className="text-gray-400 text-sm">No custom orders yet. Click &quot;+ New Request&quot; to log one.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery Schedule */}
          {tab === 'delivery' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Delivery Schedule</h2>
                <p className="text-sm text-gray-400">Active orders grouped by date</p>
              </div>

              {deliveryGroups.map(group => (
                <div key={group.label}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-gray-700">{group.label}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FEF0E8', color: '#F4845F' }}>
                      {group.orders.length}
                    </span>
                  </div>
                  {group.orders.length > 0 ? (
                    <div className="space-y-2">
                      {group.orders.map(o => (
                        <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-50 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_COLORS[o.status]}`} />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-sm">{o.orderId} — {o.customerName}</p>
                              <p className="text-xs text-gray-400 truncate">
                                {o.items.map(i => i.productName).join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${STATUS_TEXT[o.status]}`}>{o.status}</span>
                            <span className="text-xs text-gray-400">{o.city}</span>
                            <span className="text-sm font-semibold text-gray-800">₹{o.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 py-3 pl-2">No deliveries</p>
                  )}
                </div>
              ))}

              {deliveryGroups.every(g => g.orders.length === 0) && (
                <div className="text-center py-12">
                  <span className="text-4xl block mb-3">🚚</span>
                  <p className="text-gray-400 text-sm">All orders are delivered or cancelled. Nothing to deliver!</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
