import { defineStore } from 'pinia'
import type { Product, Category, ProductFilter } from '../types/product'

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
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = [...state.products]

      if (state.filters.category) {
        filtered = filtered.filter(p => p.category.slug === state.filters.category)
      }

      if (state.filters.min_price !== undefined) {
        filtered = filtered.filter(p => {
          const price = p.discount_price || p.price
          return price >= state.filters.min_price!
        })
      }

      if (state.filters.max_price !== undefined) {
        filtered = filtered.filter(p => {
          const price = p.discount_price || p.price
          return price <= state.filters.max_price!
        })
      }

      if (state.filters.is_new !== undefined) {
        filtered = filtered.filter(p => p.is_new === state.filters.is_new)
      }

      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        )
      }

      return filtered
    },
  },

  actions: {
    async fetchProducts() {
      try {
        this.loading = true
        const config = useRuntimeConfig()
        const products = await $fetch<Product[]>(`${config.public.apiBase}/products/`)
        this.products = products
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

    async fetchCategories() {
      try {
        const config = useRuntimeConfig()
        const categories = await $fetch<Category[]>(`${config.public.apiBase}/categories/`)
        this.categories = categories
      } catch (error) {
        console.error('Error fetching categories:', error)
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
