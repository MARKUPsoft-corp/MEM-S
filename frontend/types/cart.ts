import type { Product, ProductVariant } from './product'

export interface CartItem {
  id: string
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  total: number
  totalItems: number
}
