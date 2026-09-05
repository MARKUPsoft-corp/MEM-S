import { computed, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

/**
 * Composable pour simplifier l'utilisation du panier
 * Gère automatiquement la synchronisation lors de la connexion
 */
export const useCart = () => {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  
  // Auto-sync lors de la connexion (mais pas au montage initial)
  watch(() => authStore.isAuthenticated, async (isAuth, wasAuth) => {
    // Seulement si l'état change de false à true (connexion)
    if (isAuth && wasAuth === false) {
      // L'utilisateur vient de se connecter
      await cartStore.syncWithBackend()
    }
  })
  
  return {
    // State
    items: computed(() => cartStore.items),
    totalItems: computed(() => cartStore.totalItems),
    subtotal: computed(() => cartStore.subtotal),
    total: computed(() => cartStore.total),
    loading: computed(() => cartStore.loading),
    syncing: computed(() => cartStore.syncing),
    error: computed(() => cartStore.error),
    
    // Actions
    addItem: cartStore.addItem,
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.removeItem,
    clear: cartStore.clear,
    fetchCart: cartStore.fetchCart,
  }
}
