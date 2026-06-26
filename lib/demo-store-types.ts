export interface DemoProduct {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  description: string
  image: string
  badge?: string
  variants?: { label: string; options: string[] }[]
  details?: Record<string, string>
  inStock: boolean
}

export interface DemoCategory {
  id: string
  name: string
  icon: string
  count: number
}

export interface DemoTestimonial {
  name: string
  location: string
  rating: number
  text: string
  avatar: string
}

export interface DemoOrder {
  id: string
  orderId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  address: string
  city: string
  items: { productId: string; productName: string; quantity: number; price: number; variant?: string }[]
  total: number
  status: 'new' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMode: 'COD' | 'UPI' | 'Bank Transfer'
  paymentStatus: 'paid' | 'unpaid'
  notes: string
  createdAt: string
}

export interface DemoStoreConfig {
  id: string
  name: string
  tagline: string
  description: string
  whatsappNumber: string
  instagramHandle: string
  email: string
  categories: DemoCategory[]
  products: DemoProduct[]
  testimonials: DemoTestimonial[]
  orders: DemoOrder[]
}

export function getDemoOrders(storeId: string): DemoOrder[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(`demo_orders_${storeId}`) || '[]')
  } catch {
    return []
  }
}

export function saveDemoOrder(storeId: string, order: DemoOrder) {
  const orders = getDemoOrders(storeId)
  orders.unshift(order)
  localStorage.setItem(`demo_orders_${storeId}`, JSON.stringify(orders))
}

export function updateDemoOrder(storeId: string, orderId: string, updates: Partial<DemoOrder>) {
  const orders = getDemoOrders(storeId)
  const idx = orders.findIndex((o) => o.id === orderId)
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...updates }
    localStorage.setItem(`demo_orders_${storeId}`, JSON.stringify(orders))
  }
}

export function getDemoProducts(storeId: string): DemoProduct[] | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(`demo_products_${storeId}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveDemoProducts(storeId: string, products: DemoProduct[]) {
  localStorage.setItem(`demo_products_${storeId}`, JSON.stringify(products))
}
