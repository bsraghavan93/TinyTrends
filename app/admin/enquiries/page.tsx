'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Enquiry {
  id: string
  full_name: string
  business_name: string
  whatsapp_number: string
  email: string
  city_state: string
  instagram_url: string
  existing_website_url: string
  business_type: string
  business_description: string
  currently_takes_orders: string
  website_type: string
  needs_admin_access: string
  needs_customer_login: string
  needs_online_payment: string
  preferred_order_method: string
  initial_product_count: string
  product_update_frequency: string
  has_variants: string
  product_photos_ready: string
  expected_monthly_orders: string
  needs_image_storage: string
  style_preference: string
  brand_colors: string
  reference_links: string
  budget_range: string
  timeline: string
  additional_requirements: string
  status: string
  created_at: string
}

const STATUS_OPTIONS = ['new', 'contacted', 'in_progress', 'quoted', 'converted', 'closed'] as const
type Status = typeof STATUS_OPTIONS[number]

const STATUS_COLORS: Record<Status, { bg: string; text: string; dot: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  contacted: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  in_progress: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  quoted: { bg: 'bg-cyan-50', text: 'text-cyan-700', dot: 'bg-cyan-500' },
  converted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
}

const STATUS_LABELS: Record<Status, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  quoted: 'Quoted',
  converted: 'Converted',
  closed: 'Closed',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  const s = (STATUS_OPTIONS.includes(status as Status) ? status : 'new') as Status
  const colors = STATUS_COLORS[s]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {STATUS_LABELS[s]}
    </span>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
      {children}
    </span>
  )
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 mb-0.5">{label}</dt>
      <dd className="text-sm text-gray-900">{value || '—'}</dd>
    </div>
  )
}

export default function EnquiriesPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchEnquiries = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('website_enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setEnquiries(data as Enquiry[])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (authenticated) fetchEnquiries()
  }, [authenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'pixelcraft2024') {
      setAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Incorrect password')
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(true)
    const { error } = await supabase
      .from('website_enquiries')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      await fetchEnquiries()
    }
    setUpdatingStatus(false)
  }

  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    const term = search.toLowerCase()
    const matchesSearch =
      !term ||
      e.business_name?.toLowerCase().includes(term) ||
      e.full_name?.toLowerCase().includes(term) ||
      e.business_type?.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })

  const selected = selectedId ? enquiries.find((e) => e.id === selectedId) : null

  // --- Login Screen ---
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9fafb' }}>
        <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Access</h1>
          <p className="text-sm text-gray-500 mb-6">Enter password to view enquiries</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
          />
          {loginError && <p className="text-red-500 text-xs mb-3">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    )
  }

  // --- Detail View ---
  if (selected) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to list
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.business_name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selected.full_name} &middot; {formatDate(selected.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selected.status || 'new'}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  disabled={updatingStatus}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <StatusBadge status={selected.status || 'new'} />
              </div>
            </div>

            {/* Section 1: Contact */}
            <div className="px-6 py-5 border-b border-gray-50">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <DetailField label="Full Name" value={selected.full_name} />
                <DetailField label="Business Name" value={selected.business_name} />
                <div>
                  <dt className="text-xs text-gray-500 mb-0.5">WhatsApp</dt>
                  <dd className="text-sm">
                    <a href={`https://wa.me/${selected.whatsapp_number?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      {selected.whatsapp_number}
                    </a>
                  </dd>
                </div>
                <DetailField label="Email" value={selected.email} />
                <DetailField label="City / State" value={selected.city_state} />
                <div>
                  <dt className="text-xs text-gray-500 mb-0.5">Instagram</dt>
                  <dd className="text-sm">
                    {selected.instagram_url ? (
                      <a href={selected.instagram_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selected.instagram_url}</a>
                    ) : '—'}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-gray-500 mb-0.5">Existing Website</dt>
                  <dd className="text-sm">
                    {selected.existing_website_url ? (
                      <a href={selected.existing_website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selected.existing_website_url}</a>
                    ) : '—'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Section 2: Business */}
            <div className="px-6 py-5 border-b border-gray-50">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Business</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <DetailField label="Business Type" value={selected.business_type} />
                <DetailField label="Currently Takes Orders" value={selected.currently_takes_orders} />
                <div className="sm:col-span-2">
                  <DetailField label="Business Description" value={selected.business_description} />
                </div>
              </dl>
            </div>

            {/* Section 3: Website Needs */}
            <div className="px-6 py-5 border-b border-gray-50">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Website Needs</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <DetailField label="Website Type" value={selected.website_type} />
                <DetailField label="Needs Admin Access" value={selected.needs_admin_access} />
                <DetailField label="Needs Customer Login" value={selected.needs_customer_login} />
                <DetailField label="Needs Online Payment" value={selected.needs_online_payment} />
                <DetailField label="Preferred Order Method" value={selected.preferred_order_method} />
              </dl>
            </div>

            {/* Section 4: Catalog */}
            <div className="px-6 py-5 border-b border-gray-50">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Catalog</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <DetailField label="Initial Product Count" value={selected.initial_product_count} />
                <DetailField label="Product Update Frequency" value={selected.product_update_frequency} />
                <DetailField label="Has Variants" value={selected.has_variants} />
                <DetailField label="Product Photos Ready" value={selected.product_photos_ready} />
                <DetailField label="Expected Monthly Orders" value={selected.expected_monthly_orders} />
                <DetailField label="Needs Image Storage" value={selected.needs_image_storage} />
              </dl>
            </div>

            {/* Section 5: Design & Budget */}
            <div className="px-6 py-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Design &amp; Budget</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <DetailField label="Style Preference" value={selected.style_preference} />
                <DetailField label="Brand Colors" value={selected.brand_colors} />
                <DetailField label="Reference Links" value={selected.reference_links} />
                <DetailField label="Budget Range" value={selected.budget_range} />
                <DetailField label="Timeline" value={selected.timeline} />
                <div className="sm:col-span-2">
                  <DetailField label="Additional Requirements" value={selected.additional_requirements} />
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- List View ---
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Website Enquiries</h1>
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-gray-900 text-white text-xs font-medium">
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchEnquiries}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              PixelCraft Studios
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by business name, owner, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {(['all', ...STATUS_OPTIONS] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-gray-900 font-medium mb-1">No enquiries yet</h3>
            <p className="text-sm text-gray-500">Enquiries from the website form will appear here.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid gap-3">
            {filtered.map((enquiry) => (
              <button
                key={enquiry.id}
                onClick={() => setSelectedId(enquiry.id)}
                className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{enquiry.business_name}</h3>
                    <p className="text-sm text-gray-500">{enquiry.full_name}</p>
                  </div>
                  <StatusBadge status={enquiry.status || 'new'} />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <a
                    href={`https://wa.me/${enquiry.whatsapp_number?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-green-600 hover:underline"
                  >
                    {enquiry.whatsapp_number}
                  </a>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {enquiry.business_type && <Pill>{enquiry.business_type}</Pill>}
                  {enquiry.initial_product_count && <Pill>{enquiry.initial_product_count} products</Pill>}
                  {enquiry.budget_range && <Pill>{enquiry.budget_range}</Pill>}
                  {enquiry.timeline && <Pill>{enquiry.timeline}</Pill>}
                </div>

                <p className="text-xs text-gray-400 mt-3">{formatDate(enquiry.created_at)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
