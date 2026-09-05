import { defineStore } from 'pinia'
import type { Product, Category, Collection, ProductFilter } from '../types/product'
import { FirestoreProductsService } from '../services/firestoreProducts'

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
    collections: [] as Collection[],
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
        const response = await FirestoreProductsService.getProducts(params)

        this.products = response.results
        this.totalCount = response.count

        return {
          count: response.count,
          next: null,
          previous: null,
          results: response.results
        } as PaginatedResponse
      } catch (error) {
        console.error('[Products Store] Erreur chargement produits:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchProductBySlug(slug: string) {
      try {
        const product = await FirestoreProductsService.getProductBySlug(slug)
        return product
      } catch (error) {
        console.error('[Products Store] Erreur chargement produit par slug:', error)
        throw error
      }
    },

    async fetchFeaturedProducts() {
      try {
        const response = await FirestoreProductsService.getProducts({ is_featured: true })
        return response.results
      } catch (error) {
        console.error('[Products Store] Erreur chargement produits en vedette:', error)
        throw error
      }
    },

    async fetchNewArrivals() {
      try {
        const response = await FirestoreProductsService.getProducts({ is_new: true })
        return response.results
      } catch (error) {
        console.error('[Products Store] Erreur chargement nouveaux produits:', error)
        throw error
      }
    },

    async fetchCategories() {
      try {
        const categories = await FirestoreProductsService.getCategories()
        this.categories = categories
        return categories
      } catch (error) {
        console.error('[Products Store] Erreur chargement catégories:', error)
        throw error
      }
    },

    async fetchCategoriesByCollection() {
      try {
        const collections = await FirestoreProductsService.getCategoriesByCollection()
        return collections
      } catch (error) {
        console.error('[Products Store] Erreur chargement catégories par collection:', error)
        throw error
      }
    },

    async fetchCollections() {
      try {
        const collections = await FirestoreProductsService.getCollections()
        this.collections = collections
        return collections
      } catch (error) {
        console.error('[Products Store] Erreur chargement collections:', error)
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
