'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product } from './types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number, selectedColor: { name: string; hex: string } | null, selectedSize: string | null) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  lastAdded: CartItem | null
  clearLastAdded: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tinytrend-cart')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tinytrend-cart', JSON.stringify(items))
  }, [items])

  const addItem = (
    product: Product,
    quantity: number,
    selectedColor: { name: string; hex: string } | null,
    selectedSize: string | null
  ) => {
    const existingIndex = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor?.name === selectedColor?.name &&
        item.selectedSize === selectedSize
    )

    const newItem: CartItem = { product, quantity, selectedColor, selectedSize }

    if (existingIndex >= 0) {
      const updated = [...items]
      updated[existingIndex].quantity += quantity
      setItems(updated)
    } else {
      setItems([...items, newItem])
    }

    setLastAdded(newItem)
    setTimeout(() => setLastAdded(null), 3000)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index)
      return
    }
    const updated = [...items]
    updated[index].quantity = quantity
    setItems(updated)
  }

  const clearCart = () => setItems([])
  const clearLastAdded = () => setLastAdded(null)

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, lastAdded, clearLastAdded }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
