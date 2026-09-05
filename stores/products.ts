import { defineStore } from 'pinia'
import type { Product, Category, Collection, ProductFilter } from '../types/product'
import { FirestoreProductsService } from '../services/firestoreProducts'
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS } from '../data/productsData'

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [...INITIAL_PRODUCTS] as Product[],
    categories: [...INITIAL_CATEGORIES] as Category[],
    collections: [...INITIAL_COLLECTIONS] as Collection[],
    filters: {
      category: undefined,
      min_price: undefined,
      max_price: undefined,
      is_new: undefined,
      search: undefined,
    } as ProductFilter,
    loading: false,
    totalCount: INITIAL_PRODUCTS.length,
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products
    },
  },

  actions: {
    /**
     * Récupération ultra-rapide des produits
     */
    async fetchProducts(params?: Record<string, any>) {
      try {
        // N'activer le loader que si la liste est complètement vide
        if (this.products.length === 0) {
          this.loading = true
        }

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

    /**
     * Récupération d'un produit par slug
     */
    async fetchProductBySlug(slug: string) {
      try {
        const product = await FirestoreProductsService.getProductBySlug(slug)
        return product
      } catch (error) {
        console.error('[Products Store] Erreur chargement produit par slug:', error)
        throw error
      }
    },

    /**
     * Récupération des produits en vedette
     */
    async fetchFeaturedProducts() {
      try {
        const response = await FirestoreProductsService.getProducts({ is_featured: true })
        return response.results
      } catch (error) {
        console.error('[Products Store] Erreur chargement produits en vedette:', error)
        throw error
      }
    },

    /**
     * Récupération des nouveautés
     */
    async fetchNewArrivals() {
      try {
        const response = await FirestoreProductsService.getProducts({ is_new: true })
        return response.results
      } catch (error) {
        console.error('[Products Store] Erreur chargement nouveaux produits:', error)
        throw error
      }
    },

    /**
     * Récupération des catégories
     */
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

    /**
     * Récupération des catégories par collection
     */
    async fetchCategoriesByCollection() {
      try {
        const collections = await FirestoreProductsService.getCategoriesByCollection()
        return collections
      } catch (error) {
        console.error('[Products Store] Erreur chargement catégories par collection:', error)
        throw error
      }
    },

    /**
     * Récupération des collections
     */
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

    /**
     * Invalidation du cache (appelé après modifications admin)
     */
    invalidateCache() {
      FirestoreProductsService.clearCache()
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
