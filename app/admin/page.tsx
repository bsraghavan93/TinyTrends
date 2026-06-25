'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Product, Order } from '@/lib/types'
import { getLocalOrders, updateLocalOrder } from '@/lib/local-orders'

const ADMIN_EMAIL = 'admin@tinytrend.in'
const ADMIN_PASSWORD = 'admin123'

const CATEGORIES = ['Tops & T-Shirts', 'Dresses & Frocks', 'Bottoms & Shorts', 'Ethnic Wear', 'Winter Wear', 'Accessories', 'Customer Review']
const MATERIALS = ['Cotton', 'Linen', 'Denim', 'Polyester', 'Silk', 'Wool', 'Fleece', 'Rayon', 'Organic Cotton']
const FIT_TYPES = ['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Oversized', 'A-Line', 'Straight', 'Flared']
const SIZE_OPTIONS = ['0-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-10Y', '10-12Y', '12-14Y', 'Free Size']
const AGE_GROUPS = ['Newborn (0-6M)', 'Infant (6-12M)', 'Toddler (1-3Y)', 'Kids (3-7Y)', 'Junior (7-10Y)', 'Pre-Teen (10-14Y)']
const GENDERS = ['Boys', 'Girls', 'Unisex']

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
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
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')

  // Products state
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productSearch, setProductSearch] = useState('')
  const [productPage, setProductPage] = useState(1)

  // Product form state
  const [formName, setFormName] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formNewCategory, setFormNewCategory] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formMaterial, setFormMaterial] = useState('')
  const [formFitType, setFormFitType] = useState('')
  const [formCareInstructions, setFormCareInstructions] = useState('')
  const [formAgeGroup, setFormAgeGroup] = useState('')
  const [formGender, setFormGender] = useState('')
  const [formSizes, setFormSizes] = useState<string[]>([])
  const [formColors, setFormColors] = useState<{ name: string; hex: string }[]>([])
  const [formColorName, setFormColorName] = useState('')
  const [formColorHex, setFormColorHex] = useState('#FF6B6B')
  const [formImages, setFormImages] = useState<string[]>([])
  const [formNewImages, setFormNewImages] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Orders state
  const [orders, setOrders] = useState<Order[]>([])
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  const [orderPage, setOrderPage] = useState(1)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [confirmPopup, setConfirmPopup] = useState<string | null>(null)
  const [confirmUpiRef, setConfirmUpiRef] = useState('')

  // Stock modal
  const [stockProduct, setStockProduct] = useState<Product | null>(null)
  const [stockOosSizes, setStockOosSizes] = useState<string[]>([])
  const [stockOosColors, setStockOosColors] = useState<string[]>([])

  useEffect(() => {
    const storedAuth = localStorage.getItem('tinytrend_admin_auth')
    if (storedAuth === 'true') {
      setAuthenticated(true)
    } else {
      supabase.auth.getSession().then(({ data }: any) => {
        if (data?.session) setAuthenticated(true)
      }).catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (authenticated) {
      fetchProducts()
      fetchOrders()
    }
  }, [authenticated])

  // Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('tinytrend_admin_auth', 'true')
      setAuthenticated(true)
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoginError('Invalid email or password')
    } else {
      setAuthenticated(true)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('tinytrend_admin_auth')
    setAuthenticated(false)
  }

  // Products
  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  function openAddForm() {
    setEditingProduct(null)
    resetForm()
    setShowForm(true)
  }

  function openEditForm(p: Product) {
    setEditingProduct(p)
    setFormName(p.name)
    setFormPrice(String(p.price || ''))
    setFormCategory(p.category)
    setFormDescription(p.description || '')
    setFormMaterial(p.material || '')
    setFormFitType(p.fit_type || '')
    setFormCareInstructions(p.care_instructions || '')
    setFormAgeGroup(p.age_group || '')
    setFormGender(p.gender || '')
    setFormSizes(p.sizes || [])
    setFormColors(p.colors || [])
    setFormImages(p.images || [])
    setFormNewImages([])
    setShowForm(true)
  }

  function resetForm() {
    setFormName(''); setFormPrice(''); setFormCategory(''); setFormNewCategory('')
    setFormDescription(''); setFormMaterial(''); setFormFitType(''); setFormCareInstructions('')
    setFormAgeGroup(''); setFormGender(''); setFormSizes([]); setFormColors([])
    setFormImages([]); setFormNewImages([]); setFormColorName(''); setFormColorHex('#FF6B6B')
  }

  function addColor() {
    if (!formColorName) return
    setFormColors([...formColors, { name: formColorName, hex: formColorHex }])
    setFormColorName('')
    setFormColorHex('#FF6B6B')
  }

  function toggleSize(size: string) {
    setFormSizes(formSizes.includes(size) ? formSizes.filter((s) => s !== size) : [...formSizes, size])
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const category = formCategory === '__new__' ? formNewCategory : formCategory

    // Upload new images
    const uploadedUrls: string[] = []
    for (const file of formNewImages) {
      const ext = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(fileName, file)
      if (!error) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    const allImages = [...formImages, ...uploadedUrls]

    const productData = {
      name: formName,
      price: parseFloat(formPrice) || 0,
      category,
      description: formDescription,
      material: formMaterial || null,
      fit_type: formFitType || null,
      care_instructions: formCareInstructions || null,
      age_group: formAgeGroup || null,
      gender: formGender || null,
      sizes: formSizes,
      colors: formColors,
      images: allImages,
    }

    if (editingProduct) {
      await supabase.from('products').update(productData).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert(productData)
    }

    setSaving(false)
    setShowForm(false)
    fetchProducts()
  }

  async function toggleStock(p: Product) {
    await supabase.from('products').update({ in_stock: !p.in_stock }).eq('id', p.id)
    fetchProducts()
  }

  function openStockModal(p: Product) {
    setStockProduct(p)
    setStockOosSizes(p.oos_sizes || [])
    setStockOosColors(p.oos_colors || [])
  }

  async function saveVariantStock() {
    if (!stockProduct) return
    await supabase.from('products').update({ oos_sizes: stockOosSizes, oos_colors: stockOosColors }).eq('id', stockProduct.id)
    setStockProduct(null)
    fetchProducts()
  }

  // Orders
  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    const supabaseOrders = data || []
    const localOrders = getLocalOrders()
    const supabaseIds = new Set(supabaseOrders.map((o: any) => o.order_id))
    const merged = [
      ...supabaseOrders,
      ...localOrders.filter((o: any) => !supabaseIds.has(o.order_id)),
    ]
    merged.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setOrders(merged)
  }

  async function updateOrderStatus(orderId: string, status: string, paymentStatus?: string, upiRef?: string) {
    const update: any = { status }
    if (paymentStatus) update.payment_status = paymentStatus
    if (upiRef) update.upi_ref = upiRef
    await supabase.from('orders').update(update).eq('id', orderId)
    updateLocalOrder(orderId, update)
    setConfirmPopup(null)
    setConfirmUpiRef('')
    fetchOrders()
  }

  // Filtered / paginated
  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true
    const q = productSearch.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
  })
  const productPages = Math.ceil(filteredProducts.length / 10)
  const paginatedProducts = filteredProducts.slice((productPage - 1) * 10, productPage * 10)

  const filteredOrders = orders.filter((o) => {
    if (orderStatus && o.status !== orderStatus) return false
    if (!orderSearch) return true
    const q = orderSearch.toLowerCase()
    return o.customer_name?.toLowerCase().includes(q) || o.customer_phone?.includes(q) || o.customer_email?.toLowerCase().includes(q) || o.order_id?.toLowerCase().includes(q)
  })
  const orderPages = Math.ceil(filteredOrders.length / 10)
  const paginatedOrders = filteredOrders.slice((orderPage - 1) * 10, orderPage * 10)

  // Stats
  const totalOrders = filteredOrders.length
  const pendingOrders = filteredOrders.filter((o) => o.status === 'pending').length
  const paidOrders = filteredOrders.filter((o) => o.payment_status === 'paid' && o.status !== 'cancelled')
  const unpaidOrders = filteredOrders.filter((o) => o.payment_status === 'unpaid' && o.status !== 'cancelled')
  const totalRevenue = filteredOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0)

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-coral-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-heading font-bold">TT</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-charcoal">Admin Login</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 outline-none" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 outline-none" />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="w-full bg-coral-400 hover:bg-coral-500 text-white font-semibold py-3 rounded-xl transition-all">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-coral-400 rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xs">TT</span>
              </div>
              <span className="font-heading font-bold text-charcoal">Admin</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-coral-400 text-white' : 'text-charcoal/50 hover:bg-gray-100'}`}>Products</button>
              <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-coral-400 text-white' : 'text-charcoal/50 hover:bg-gray-100'}`}>Orders</button>
            </div>
          </div>
          <button onClick={handleLogout} className="text-sm text-charcoal/50 hover:text-charcoal">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ===== PRODUCTS TAB ===== */}
        {activeTab === 'products' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-charcoal">Products</h2>
                <p className="text-charcoal/40 text-sm">{products.length} total products</p>
              </div>
              <button onClick={openAddForm} className="bg-coral-400 hover:bg-coral-500 text-white font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Product
              </button>
            </div>

            <div className="mb-4">
              <input type="text" value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setProductPage(1) }} placeholder="Search products..." className="w-full max-w-md px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 outline-none" />
            </div>

            {/* Product Cards — Mobile */}
            <div className="md:hidden space-y-3">
              {paginatedProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-charcoal text-sm truncate">{p.name}</h4>
                      <p className="text-xs text-charcoal/40">{p.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-charcoal">₹{p.price}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.in_stock ? 'In Stock' : 'OOS'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-t pt-3">
                    <button onClick={() => openEditForm(p)} className="flex-1 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                    <button onClick={() => toggleStock(p)} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${p.in_stock ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {p.in_stock ? 'Mark OOS' : 'In Stock'}
                    </button>
                    {(p.sizes?.length > 0 || p.colors?.length > 0) && (
                      <button onClick={() => openStockModal(p)} className="flex-1 py-2 bg-purple-50 text-purple-600 text-xs font-semibold rounded-lg hover:bg-purple-100 transition-colors">Variants</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Product Table — Desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-charcoal/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <span className="font-medium text-charcoal truncate max-w-[200px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-charcoal/50">{p.category}</td>
                      <td className="px-4 py-3 font-medium text-charcoal">₹{p.price}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.in_stock ? 'In Stock' : 'OOS'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditForm(p)} className="text-blue-500 hover:text-blue-600 text-xs font-medium">Edit</button>
                          <button onClick={() => toggleStock(p)} className={`text-xs font-medium ${p.in_stock ? 'text-red-400 hover:text-red-500' : 'text-green-500 hover:text-green-600'}`}>
                            {p.in_stock ? 'Mark OOS' : 'Mark In Stock'}
                          </button>
                          {(p.sizes?.length > 0 || p.colors?.length > 0) && (
                            <button onClick={() => openStockModal(p)} className="text-purple-500 hover:text-purple-600 text-xs font-medium">Stock</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {productPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 mt-3 bg-white rounded-xl shadow-sm">
                <button onClick={() => setProductPage(Math.max(1, productPage - 1))} disabled={productPage === 1} className="text-sm text-charcoal/50 disabled:opacity-30">Previous</button>
                <span className="text-sm text-charcoal/40">Page {productPage} of {productPages}</span>
                <button onClick={() => setProductPage(Math.min(productPages, productPage + 1))} disabled={productPage === productPages} className="text-sm text-charcoal/50 disabled:opacity-30">Next</button>
              </div>
            )}

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-center sm:overflow-y-auto sm:py-8 sm:px-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
                <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[85vh] mt-auto sm:mt-0 sm:max-h-none flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-charcoal">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
                    <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-charcoal/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {/* Scrollable form body */}
                  <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

                      {/* Basic Info */}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Basic Info</p>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
                          <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">Price (₹)</label>
                            <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">Category *</label>
                            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none">
                              <option value="">Select...</option>
                              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                              <option value="__new__">+ New Category</option>
                            </select>
                          </div>
                        </div>
                        {formCategory === '__new__' && (
                          <input type="text" value={formNewCategory} onChange={(e) => setFormNewCategory(e.target.value)} placeholder="New category name" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none" />
                        )}
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                          <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none resize-none" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Details</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">Age Group</label>
                            <select value={formAgeGroup} onChange={(e) => setFormAgeGroup(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none">
                              <option value="">Select...</option>
                              {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">Gender</label>
                            <select value={formGender} onChange={(e) => setFormGender(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none">
                              <option value="">Select...</option>
                              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">Material</label>
                            <select value={formMaterial} onChange={(e) => setFormMaterial(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none">
                              <option value="">Select...</option>
                              {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">Fit Type</label>
                            <select value={formFitType} onChange={(e) => setFormFitType(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none">
                              <option value="">Select...</option>
                              {FIT_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-1">Care Instructions</label>
                          <input type="text" value={formCareInstructions} onChange={(e) => setFormCareInstructions(e.target.value)} placeholder="e.g., Machine Wash Cold" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none" />
                        </div>
                      </div>

                      {/* Sizes */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Sizes</p>
                        <div className="flex flex-wrap gap-2">
                          {SIZE_OPTIONS.map((s) => (
                            <button key={s} type="button" onClick={() => toggleSize(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${formSizes.includes(s) ? 'bg-coral-400 text-white border-coral-400' : 'bg-white text-charcoal/50 border-gray-200 hover:border-coral-300'}`}>{s}</button>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Colors</p>
                        {formColors.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formColors.map((c, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full text-sm">
                                <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                                {c.name}
                                <button type="button" onClick={() => setFormColors(formColors.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-500 ml-1">&times;</button>
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input type="color" value={formColorHex} onChange={(e) => setFormColorHex(e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer flex-shrink-0" />
                          <input type="text" value={formColorName} onChange={(e) => setFormColorName(e.target.value)} placeholder="Color name" className="flex-1 min-w-0 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor() } }} />
                          <button type="button" onClick={addColor} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex-shrink-0">Add</button>
                        </div>
                      </div>

                      {/* Images */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Images</p>
                        {(formImages.length > 0 || formNewImages.length > 0) && (
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {formImages.map((img, i) => (
                              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => setFormImages(formImages.filter((_, j) => j !== i))} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-lg">&times;</button>
                              </div>
                            ))}
                            {formNewImages.map((file, i) => (
                              <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-green-400 group">
                                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                                <span className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">NEW</span>
                                <button type="button" onClick={() => setFormNewImages(formNewImages.filter((_, j) => j !== i))} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-lg">&times;</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files) setFormNewImages([...formNewImages, ...Array.from(e.target.files)]); e.target.value = '' }} />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-coral-400 hover:text-coral-500 font-medium">+ Add Images</button>
                      </div>
                    </div>

                    {/* Sticky footer buttons */}
                    <div className="flex gap-3 p-4 sm:p-6 border-t bg-white flex-shrink-0">
                      <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-charcoal/50 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                      <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-coral-400 hover:bg-coral-500 text-white font-semibold rounded-xl transition-all disabled:bg-gray-300">
                        {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Stock Modal */}
            {stockProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setStockProduct(null)} />
                <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                  <h3 className="font-heading text-lg font-bold text-charcoal mb-4">Manage Stock — {stockProduct.name}</h3>
                  {stockProduct.sizes?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-charcoal mb-2">Sizes (click to toggle OOS)</p>
                      <div className="flex flex-wrap gap-2">
                        {stockProduct.sizes.map((s) => {
                          const oos = stockOosSizes.includes(s)
                          return (
                            <button key={s} onClick={() => setStockOosSizes(oos ? stockOosSizes.filter((x) => x !== s) : [...stockOosSizes, s])} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${oos ? 'bg-red-100 text-red-600 border-red-200' : 'bg-green-100 text-green-600 border-green-200'}`}>{s}</button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {stockProduct.colors?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-charcoal mb-2">Colors (click to toggle OOS)</p>
                      <div className="flex flex-wrap gap-2">
                        {stockProduct.colors.map((c) => {
                          const oos = stockOosColors.includes(c.name)
                          return (
                            <button key={c.hex} onClick={() => setStockOosColors(oos ? stockOosColors.filter((x) => x !== c.name) : [...stockOosColors, c.name])} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm border transition-all ${oos ? 'opacity-30 border-red-200' : 'border-green-200'}`}>
                              <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c.hex }} />
                              {c.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setStockProduct(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-charcoal/50 font-medium hover:bg-gray-50">Cancel</button>
                    <button onClick={saveVariantStock} className="flex-1 py-2 bg-coral-400 hover:bg-coral-500 text-white font-semibold rounded-xl">Save Variant Stock</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-charcoal/40 text-xs">Total Orders</p><p className="font-heading font-bold text-2xl text-charcoal">{totalOrders}</p></div>
              <div className="bg-yellow-50 rounded-xl p-4 shadow-sm"><p className="text-yellow-600 text-xs">Pending</p><p className="font-heading font-bold text-2xl text-yellow-700">{pendingOrders}</p></div>
              <div className="bg-green-50 rounded-xl p-4 shadow-sm"><p className="text-green-600 text-xs">Paid</p><p className="font-heading font-bold text-2xl text-green-700">{paidOrders.length}</p><p className="text-xs text-green-500">₹{paidOrders.reduce((s, o) => s + (o.total || 0), 0)}</p></div>
              <div className="bg-red-50 rounded-xl p-4 shadow-sm"><p className="text-red-600 text-xs">Unpaid</p><p className="font-heading font-bold text-2xl text-red-700">{unpaidOrders.length}</p><p className="text-xs text-red-500">₹{unpaidOrders.reduce((s, o) => s + (o.total || 0), 0)}</p></div>
              <div className="bg-blue-50 rounded-xl p-4 shadow-sm col-span-2 md:col-span-1"><p className="text-blue-600 text-xs">Total Revenue</p><p className="font-heading font-bold text-2xl text-blue-700">₹{totalRevenue}</p></div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input type="text" value={orderSearch} onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1) }} placeholder="Search orders..." className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 outline-none" />
              <select value={orderStatus} onChange={(e) => { setOrderStatus(e.target.value); setOrderPage(1) }} className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-coral-400 outline-none">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={fetchOrders} className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">Refresh</button>
            </div>

            {/* Order Cards */}
            <div className="space-y-3">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    {/* Desktop row */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div>
                        <p className="font-medium text-charcoal">{order.customer_name}</p>
                        <p className="text-xs text-charcoal/40">{order.order_id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.payment_status}</span>
                        <span className="font-semibold text-charcoal">₹{order.total}</span>
                        <svg className={`w-4 h-4 text-charcoal/30 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    {/* Mobile stacked */}
                    <div className="sm:hidden">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-charcoal">{order.customer_name}</p>
                        <span className="font-bold text-charcoal">₹{order.total}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-charcoal/40">{order.order_id}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.payment_status}</span>
                          <svg className={`w-4 h-4 text-charcoal/30 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                  </button>

                  {expandedOrder === order.id && (
                    <div className="px-4 pb-4 border-t animate-fade-in">
                      {/* Customer info */}
                      <div className="bg-gray-50 rounded-lg p-3 mt-3 space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div><p className="text-charcoal/40 text-xs">Phone</p><p className="text-charcoal font-medium">{order.customer_phone}</p></div>
                          <div><p className="text-charcoal/40 text-xs">Date</p><p className="text-charcoal">{new Date(order.created_at).toLocaleDateString()}</p></div>
                          {order.customer_email && <div><p className="text-charcoal/40 text-xs">Email</p><p className="text-charcoal break-all">{order.customer_email}</p></div>}
                          {order.city && <div><p className="text-charcoal/40 text-xs">City</p><p className="text-charcoal">{order.city}</p></div>}
                        </div>
                        <div><p className="text-charcoal/40 text-xs">Address</p><p className="text-charcoal">{order.address}</p></div>
                        {order.upi_ref && <div><p className="text-charcoal/40 text-xs">UPI Ref</p><p className="text-charcoal font-mono text-xs">{order.upi_ref}</p></div>}
                        {order.notes && <div><p className="text-charcoal/40 text-xs">Notes</p><p className="text-charcoal italic">{order.notes}</p></div>}
                      </div>

                      {/* Items */}
                      <div className="mt-3 mb-3">
                        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">Items</p>
                        <div className="space-y-2">
                          {(order.items || []).map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-charcoal truncate">{item.product?.name}</p>
                                <p className="text-xs text-charcoal/40">
                                  {[item.selectedColor?.name, item.selectedSize].filter(Boolean).join(' / ')}
                                  {(item.selectedColor?.name || item.selectedSize) && ' · '}
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-charcoal ml-3 flex-shrink-0">₹{(item.product?.price || 0) * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status actions */}
                      <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider mb-2">Update Status</p>
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                        {order.status === 'pending' && (
                          <button onClick={() => setConfirmPopup(order.id)} className="py-2 sm:px-3 sm:py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors">Confirm</button>
                        )}
                        <button onClick={() => updateOrderStatus(order.id, 'shipped')} disabled={order.status === 'pending'} className="py-2 sm:px-3 sm:py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Shipped</button>
                        <button onClick={() => updateOrderStatus(order.id, 'delivered')} disabled={order.status === 'pending'} className="py-2 sm:px-3 sm:py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Delivered</button>
                        <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="py-2 sm:px-3 sm:py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12"><p className="text-charcoal/40">No orders found</p></div>
            )}

            {orderPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button onClick={() => setOrderPage(Math.max(1, orderPage - 1))} disabled={orderPage === 1} className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm disabled:opacity-30">Previous</button>
                <span className="text-sm text-charcoal/40">Page {orderPage} of {orderPages}</span>
                <button onClick={() => setOrderPage(Math.min(orderPages, orderPage + 1))} disabled={orderPage === orderPages} className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm disabled:opacity-30">Next</button>
              </div>
            )}

            {/* Confirm Popup */}
            {confirmPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmPopup(null)} />
                <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                  <h3 className="font-heading font-bold text-charcoal mb-3">Confirm Order</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-charcoal mb-1">UPI Transaction / Ref ID (optional)</label>
                    <input type="text" value={confirmUpiRef} onChange={(e) => setConfirmUpiRef(e.target.value)} placeholder="Enter UPI reference" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-400 outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => updateOrderStatus(confirmPopup, 'confirmed', 'paid', confirmUpiRef)} className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all text-sm">Confirm as Paid</button>
                    <button onClick={() => updateOrderStatus(confirmPopup, 'confirmed', 'unpaid')} className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all text-sm">Confirm as Unpaid</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
