import { defineStore } from 'pinia'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import type { CartItem } from '../types/cart'
import type { Product, ProductVariant } from '../types/product'
import { useAuthStore } from './auth'
import { useFirebase } from '../composables/useFirebase'

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
    // ========== FIRESTORE PERSISTENCE ==========
    
    async persistToFirestore() {
      const authStore = useAuthStore()
      if (!authStore.user?.uid) return

      const { db } = useFirebase()
      if (!db) return

      try {
        const cartRef = doc(db, 'carts', authStore.user.uid)
        const cleanItems = JSON.parse(JSON.stringify(this.items || []))
        await setDoc(cartRef, {
          items: cleanItems,
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        console.warn('[Cart] Erreur sauvegarde Firestore:', error)
      }
    },

    async fetchCart() {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated || !authStore.user?.uid) {
        this.loadFromLocalStorage()
        return
      }

      const { db } = useFirebase()
      if (!db) {
        this.loadFromLocalStorage()
        return
      }

      try {
        this.loading = true
        this.error = null

        const cartRef = doc(db, 'carts', authStore.user.uid)
        const snap = await getDoc(cartRef)

        if (snap.exists() && Array.isArray(snap.data().items)) {
          this.items = snap.data().items
          this.saveToLocalStorage()
        } else {
          this.loadFromLocalStorage()
        }
      } catch (error: any) {
        console.warn('[Cart] Erreur chargement Firestore:', error)
        this.loadFromLocalStorage()
      } finally {
        this.loading = false
      }
    },

    async syncWithBackend() {
      const authStore = useAuthStore()
      if (!authStore.user?.uid) return

      const { db } = useFirebase()
      if (!db) return

      try {
        this.syncing = true
        this.error = null

        const cartRef = doc(db, 'carts', authStore.user.uid)
        const snap = await getDoc(cartRef)

        let serverItems: CartItem[] = []
        if (snap.exists() && Array.isArray(snap.data().items)) {
          serverItems = snap.data().items
        }

        // Fusionner les articles locaux avec les articles serveur
        const localItems = [...this.items]
        const mergedItems = [...serverItems]

        for (const localItem of localItems) {
          const existing = mergedItems.find(i => i.id === localItem.id)
          if (existing) {
            existing.quantity += localItem.quantity
          } else {
            mergedItems.push(localItem)
          }
        }

        this.items = mergedItems
        this.saveToLocalStorage()

        // Enregistrer la version fusionnée dans Firestore
        const cleanItems = JSON.parse(JSON.stringify(this.items || []))
        await setDoc(cartRef, {
          items: cleanItems,
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        console.warn('[Cart] Erreur synchronisation Firestore:', error)
      } finally {
        this.syncing = false
      }
    },

    // ========== UNIFIED CRUD ==========
    
    async addItem(product: Product, variant?: ProductVariant, quantity: number = 1) {
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
      await this.persistToFirestore()
    },

    async updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        if (quantity <= 0) {
          await this.removeItem(itemId)
        } else {
          item.quantity = quantity
          this.saveToLocalStorage()
          await this.persistToFirestore()
        }
      }
    },

    async removeItem(itemId: string) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToLocalStorage()
      await this.persistToFirestore()
    },

    async clear() {
      const authStore = useAuthStore()
      this.items = []
      this.saveToLocalStorage()

      if (authStore.user?.uid) {
        const { db } = useFirebase()
        if (db) {
          try {
            await deleteDoc(doc(db, 'carts', authStore.user.uid))
          } catch (e) {
            console.warn('[Cart] Erreur suppression cart Firestore:', e)
          }
        }
      }
    },

    // ========== LOCAL STORAGE ==========
    
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
