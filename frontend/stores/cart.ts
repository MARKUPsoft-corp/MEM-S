import { defineStore } from 'pinia'
import type { CartItem } from '../types/cart'
import type { Product, ProductVariant } from '../types/product'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
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
    addItem(product: Product, variant?: ProductVariant, quantity: number = 1) {
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

    updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(item => item.id === itemId)
      
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else {
          item.quantity = quantity
          this.saveToLocalStorage()
        }
      }
    },

    removeItem(itemId: string) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToLocalStorage()
    },

    clear() {
      this.items = []
      this.saveToLocalStorage()
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
