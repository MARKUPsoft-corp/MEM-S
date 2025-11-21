import { defineStore } from 'pinia'
import type { CartItem } from '../types/cart'
import type { Product, ProductVariant } from '../types/product'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    loading: false,
    syncing: false,
    error: null as string | null,
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    subtotal: (state) => state.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0),
    
    total: (state) => state.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0),
  },

  actions: {
    // ========== BACKEND METHODS ==========
    
    async fetchCart() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated || !authStore.token) {
        this.loadFromLocalStorage()
        return
      }
      
      try {
        this.loading = true
        this.error = null
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.apiBase}/cart/`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })
        
        this.items = this.transformBackendItems(response.items || [])
      } catch (error: any) {
        console.error('Error fetching cart:', error)
        
        // Si erreur 403 (non autorisé), charger depuis localStorage sans afficher d'erreur
        if (error.status === 403 || error.statusCode === 403) {
          this.loadFromLocalStorage()
        } else {
          this.error = 'Impossible de charger le panier'
          this.loadFromLocalStorage() // Fallback
        }
      } finally {
        this.loading = false
      }
    },
    
    async addItemBackend(product: Product, variant?: ProductVariant, quantity: number = 1) {
      const authStore = useAuthStore()
      
      try {
        this.error = null
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.apiBase}/cart/add-item/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          },
          body: {
            product_id: product.id,
            variant_id: variant?.id,
            quantity
          }
        })
        
        this.items = this.transformBackendItems(response.items || [])
      } catch (error: any) {
        console.error('Error adding item to cart:', error)
        this.error = error.data?.error || 'Impossible d\'ajouter l\'article'
        throw error
      }
    },
    
    async updateQuantityBackend(itemId: string, quantity: number) {
      const authStore = useAuthStore()
      const backendId = this.getBackendItemId(itemId)
      
      if (!backendId) return
      
      try {
        this.error = null
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/cart/items/${backendId}/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          },
          body: { quantity }
        })
        
        // Mettre à jour localement
        const item = this.items.find(i => i.id === itemId)
        if (item) {
          item.quantity = quantity
        }
      } catch (error: any) {
        console.error('Error updating quantity:', error)
        this.error = 'Impossible de modifier la quantité'
        throw error
      }
    },
    
    async removeItemBackend(itemId: string) {
      const authStore = useAuthStore()
      const backendId = this.getBackendItemId(itemId)
      
      if (!backendId) return
      
      try {
        this.error = null
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/cart/items/${backendId}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })
        
        // Mettre à jour localement
        this.items = this.items.filter(i => i.id !== itemId)
      } catch (error: any) {
        console.error('Error removing item:', error)
        this.error = 'Impossible de supprimer l\'article'
        throw error
      }
    },
    
    async syncWithBackend() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated || !authStore.token) return
      
      const localItems = this.items
      if (localItems.length === 0) {
        await this.fetchCart()
        return
      }
      
      try {
        this.syncing = true
        this.error = null
        const config = useRuntimeConfig()
        const response = await $fetch<any>(`${config.public.apiBase}/cart/sync/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authStore.token}`
          },
          body: {
            items: localItems.map(item => ({
              product_id: item.product.id,
              variant_id: item.variant?.id,
              quantity: item.quantity
            }))
          }
        })
        
        this.items = this.transformBackendItems(response.items || [])
        localStorage.removeItem('cart') // Vider localStorage
      } catch (error: any) {
        console.error('Error syncing cart:', error)
        
        // Si erreur 403, ne pas afficher d'erreur (token invalide/expiré)
        if (error.status !== 403 && error.statusCode !== 403) {
          this.error = 'Impossible de synchroniser le panier'
        }
      } finally {
        this.syncing = false
      }
    },
    
    // ========== LOCAL METHODS ==========
    
    addItemLocal(product: Product, variant?: ProductVariant, quantity: number = 1) {
      const price = product.discount_price || product.price
      const itemId = variant ? `${product.id}-${variant.id}` : `${product.id}`

      const existingItem = this.items.find(item => item.id === itemId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: itemId,
          product,
          variant,
          quantity,
          price,
        })
      }

      this.saveToLocalStorage()
    },
    
    updateQuantityLocal(itemId: string, quantity: number) {
      const item = this.items.find(item => item.id === itemId)
      
      if (item) {
        if (quantity <= 0) {
          this.removeItemLocal(itemId)
        } else {
          item.quantity = quantity
          this.saveToLocalStorage()
        }
      }
    },
    
    removeItemLocal(itemId: string) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToLocalStorage()
    },
    
    // ========== UNIFIED METHODS ==========
    
    async addItem(product: Product, variant?: ProductVariant, quantity: number = 1) {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        await this.addItemBackend(product, variant, quantity)
      } else {
        this.addItemLocal(product, variant, quantity)
      }
    },
    
    async updateQuantity(itemId: string, quantity: number) {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        await this.updateQuantityBackend(itemId, quantity)
      } else {
        this.updateQuantityLocal(itemId, quantity)
      }
    },
    
    async removeItem(itemId: string) {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        await this.removeItemBackend(itemId)
      } else {
        this.removeItemLocal(itemId)
      }
    },
    
    async clear() {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        try {
          const config = useRuntimeConfig()
          await $fetch(`${config.public.apiBase}/cart/clear/`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          })
        } catch (error) {
          console.error('Error clearing cart:', error)
        }
      }
      
      this.items = []
      this.saveToLocalStorage()
    },
    
    // ========== HELPER METHODS ==========
    
    transformBackendItems(backendItems: any[]): CartItem[] {
      // Vérifier que backendItems est bien un tableau
      if (!Array.isArray(backendItems)) {
        console.warn('backendItems is not an array:', backendItems)
        return []
      }
      
      return backendItems.map(item => ({
        id: item.variant ? `${item.product.id}-${item.variant.id}` : `${item.product.id}`,
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        price: parseFloat(item.price),
        backendId: item.id // Garder l'ID backend pour les updates
      }))
    },
    
    getBackendItemId(itemId: string): number | null {
      const item = this.items.find(i => i.id === itemId) as any
      return item?.backendId || null
    },
    
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const cartStr = localStorage.getItem('cart')
        if (cartStr) {
          try {
            this.items = JSON.parse(cartStr)
          } catch (error) {
            console.error('Error loading cart from localStorage:', error)
            this.items = []
          }
        }
      }
    },
  },
})
