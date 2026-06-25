export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  images: string[]
  in_stock: boolean
  colors: { name: string; hex: string }[]
  sizes: string[]
  oos_sizes: string[]
  oos_colors: string[]
  material: string | null
  fit_type: string | null
  care_instructions: string | null
  age_group: string | null
  gender: string | null
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor: { name: string; hex: string } | null
  selectedSize: string | null
}

export interface Order {
  id: string
  order_id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  address: string
  city: string
  notes: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'paid' | 'unpaid'
  upi_ref: string
  created_at: string
}

export interface Review {
  id: string
  product_id: string | null
  reviewer_name: string
  rating: number
  comment: string
  created_at: string
  product_name?: string
}
