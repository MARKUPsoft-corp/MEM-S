import type { Product, ProductVariant } from './product'

export interface CartItem {
  id: string
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
  backendId?: number  // ID backend pour les updates
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  total: number
  totalItems: number
  loading: boolean
  syncing: boolean
  error: string | null
}
