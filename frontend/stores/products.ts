import { defineStore } from 'pinia'
import type { Product, Category, ProductFilter } from '../types/product'

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [] as Product[],
    categories: [] as Category[],
    filters: {
      category: undefined,
      min_price: undefined,
      max_price: undefined,
      is_new: undefined,
      search: undefined,
    } as ProductFilter,
    loading: false,
    totalCount: 0,
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products
    },
  },

  actions: {
    async fetchProducts(params?: Record<string, any>) {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        
        // Construire les paramètres de requête
        const queryParams = new URLSearchParams()
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value))
            }
          })
        }
        
        const url = `${config.public.apiBase}/products/${queryParams.toString() ? '?' + queryParams.toString() : ''}`
        const response = await $fetch<PaginatedResponse>(url)
        
        this.products = response.results
        this.totalCount = response.count
        
        return response
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProductBySlug(slug: string) {
      try {
        const config = useRuntimeConfig()
        const product = await $fetch<Product>(`${config.public.apiBase}/products/${slug}/`)
        return product
      } catch (error) {
        console.error('Error fetching product:', error)
        throw error
      }
    },

    async fetchFeaturedProducts() {
      try {
        const config = useRuntimeConfig()
        const products = await $fetch<Product[]>(`${config.public.apiBase}/products/featured/`)
        return products
      } catch (error) {
        console.error('Error fetching featured products:', error)
        throw error
      }
    },

    async fetchNewArrivals() {
      try {
        const config = useRuntimeConfig()
        const products = await $fetch<Product[]>(`${config.public.apiBase}/products/new_arrivals/`)
        return products
      } catch (error) {
        console.error('Error fetching new arrivals:', error)
        throw error
      }
    },

    async fetchCategories() {
      try {
        const config = useRuntimeConfig()
        const categories = await $fetch<Category[]>(`${config.public.apiBase}/categories/`)
        this.categories = categories
        return categories
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw error
      }
    },

    async fetchCategoriesByCollection() {
      try {
        const config = useRuntimeConfig()
        const collections = await $fetch<Record<string, Category[]>>(`${config.public.apiBase}/categories/by_collection/`)
        return collections
      } catch (error) {
        console.error('Error fetching categories by collection:', error)
        throw error
      }
    },

    setFilter(filter: Partial<ProductFilter>) {
      this.filters = { ...this.filters, ...filter }
    },

    clearFilters() {
      this.filters = {
        category: undefined,
        min_price: undefined,
        max_price: undefined,
        is_new: undefined,
        search: undefined,
      }
    },
  },
})
