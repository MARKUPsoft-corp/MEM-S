export interface Collection {
  id: number
  name: string
  slug: string
  description?: string
  image?: string
  order: number
}

export interface Category {
  id: number
  name: string
  slug: string
  image?: string
  order: number
  collection: Collection
}

export interface ProductImage {
  id: number
  image: string
  is_primary: boolean
  order: number
}

export interface AttributeValue {
  name: string
  slug: string
  value: string
}

export interface ProductVariant {
  id: number
  attributes: AttributeValue[]
  sku: string
  stock: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  category: Category
  price: number
  discount_price?: number
  is_new: boolean
  is_featured?: boolean
  stock: number
  images: ProductImage[]
  variants: ProductVariant[]
  created_at: string
}

export interface ProductFilter {
  category?: string
  min_price?: number
  max_price?: number
  is_new?: boolean
  search?: string
}
