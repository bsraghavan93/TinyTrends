const STORAGE_KEY = 'tinytrend_orders'

export function getLocalOrders(): any[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveLocalOrder(order: any) {
  const orders = getLocalOrders()
  orders.unshift({ ...order, id: order.order_id, created_at: new Date().toISOString() })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function updateLocalOrder(orderId: string, updates: any) {
  const orders = getLocalOrders()
  const idx = orders.findIndex((o) => o.id === orderId)
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }
}
