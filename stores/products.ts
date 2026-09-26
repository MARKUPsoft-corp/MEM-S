import { defineStore } from 'pinia'
import type { Product, Category, Collection, ProductFilter } from '../types/product'
import { FirestoreProductsService } from '../services/firestoreProducts'
import { INITIAL_CATEGORIES, INITIAL_COLLECTIONS } from '../data/productsData'

interface PaginatedResponse {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    // Uniquement les VRAIS produits provenant de Firebase Firestore
    products: [] as Product[],
    categories: [...INITIAL_CATEGORIES] as Category[],
    collections: [...INITIAL_COLLECTIONS] as Collection[],
    filters: {
      category: undefined,
      min_price: undefined,
      max_price: undefined,
      is_new: undefined,
      search: undefined,
    } as ProductFilter,
    loading: true,  // true tant que les vrais produits Firestore ne sont pas arrivés
    totalCount: 0,
    realtimeActive: false,
  }),

  getters: {
    filteredProducts: (state) => {
      return state.products
    },
  },

  actions: {
    /**
     * Initialise la synchronisation temps réel des vrais produits Firestore.
     */
    initRealtimeSync(): () => void {
      if (this.realtimeActive) {
        if (this.products.length === 0) {
          FirestoreProductsService.fetchRealProducts().then(prods => {
            if (prods && prods.length > 0) {
              this.products = [...prods]
              this.totalCount = prods.length
              this.loading = false
            }
          })
        }
        return () => {}
      }

      this.realtimeActive = true

      // Timeout de sécurité : si Firestore prend plus de 3 secondes, masquer le spinner
      setTimeout(() => {
        if (this.loading) {
          this.loading = false
        }
      }, 3500)

      const cleanup = FirestoreProductsService.initRealtimeSubscription(
        (products: Product[]) => {
          this.products = [...products]
          this.totalCount = products.length
          this.loading = false
        }
      )

      return cleanup
    },


    /**
     * Met à jour immédiatement un produit dans le store Pinia (réactivité Vue 3 instantanée)
     */
    updateProduct(product: Product) {
      const next = [...this.products]
      const idx = next.findIndex(p => p.slug === product.slug || String(p.id) === String(product.id))
      if (idx !== -1) {
        next[idx] = { ...product }
      } else {
        next.unshift({ ...product })
      }
      this.products = next
      this.totalCount = next.length
    },

    /**
     * Supprime immédiatement un produit du store Pinia
     */
    removeProduct(slug: string) {
      this.products = this.products.filter(p => p.slug !== slug)
      this.totalCount = this.products.length
    },


    /**
     * Récupération des produits avec support des filtres.
     * GARANTIE : Ne détruit JAMAIS la liste complète master `this.products` du store Pinia.
     */
    async fetchProducts(params?: Record<string, any>) {
      try {
        const hasFilters = Boolean(
          params && Object.keys(params).some(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
        )

        if (this.products.length === 0) {
          this.loading = true
          // Charger la liste complète master depuis Firestore si le store est vide
          const fullResponse = await FirestoreProductsService.getProducts()
          if (fullResponse && fullResponse.results.length > 0) {
            this.products = fullResponse.results
            this.totalCount = fullResponse.count
          }
        }

        // Si des filtres sont demandés, renvoyer les données filtrées à l'appelant SANS corrompre this.products
        if (hasFilters) {
          const response = await FirestoreProductsService.getProducts(params)
          return {
            count: response.count,
            next: null,
            previous: null,
            results: response.results
          } as PaginatedResponse
        }

        // Si aucun filtre spécifique, rafraîchir this.products avec tous les produits
        const response = await FirestoreProductsService.getProducts()
        if (response && response.results.length > 0) {
          this.products = response.results
          this.totalCount = response.count
        }

        return {
          count: this.totalCount || this.products.length,
          next: null,
          previous: null,
          results: this.products
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
     * Récupération des produits en vedette (lecture depuis le store réactif)
     */
    async fetchFeaturedProducts() {
      try {
        if (this.products.length > 0) {
          return this.products.filter(p => p.is_featured)
        }
        await this.fetchProducts()
        return this.products.filter(p => p.is_featured)
      } catch (error) {
        console.error('[Products Store] Erreur chargement produits en vedette:', error)
        throw error
      }
    },

    /**
     * Récupération des nouveautés (lecture depuis le store réactif)
     */
    async fetchNewArrivals() {
      try {
        if (this.products.length > 0) {
          return this.products.filter(p => p.is_new)
        }
        await this.fetchProducts()
        return this.products.filter(p => p.is_new)
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
