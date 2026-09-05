import type { Product, ProductVariant } from './product'

export interface OrderItem {
  id: number
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
}

export interface Order {
  id: number
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  full_name: string
  phone: string
  whatsapp: string
  address: string
  city: string
  notes?: string
  subtotal: number
  total: number
  items: OrderItem[]
  whatsapp_sent: boolean
  whatsapp_sent_at?: string
  created_at: string
  updated_at: string
}

export interface CreateOrderData {
  full_name: string
  phone: string
  whatsapp: string
  address: string
  city: string
  notes?: string
  items: {
    product_id: number
    variant_id?: number
    quantity: number
    price: number
  }[]
}
