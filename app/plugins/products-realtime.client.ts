/**
 * Plugin Nuxt client — Synchronisation temps réel des produits
 *
 * Ce plugin s'exécute uniquement côté client (suffixe .client.ts).
 * Il initialise l'écouteur Firestore onSnapshot dès que l'application démarre,
 * ce qui garantit que :
 *   - Tous les onglets/pages reçoivent les mises à jour instantanément
 *   - Le store Pinia reste toujours synchronisé avec Firestore
 *   - Pas de désynchronisation entre admin et boutique
 */
import { useProductsStore } from '~~/stores/products'

export default defineNuxtPlugin(() => {
  const productsStore = useProductsStore()

  // Démarre le listener temps réel Firestore et met à jour le store Pinia
  // Le listener reste actif pour toute la durée de vie de la session
  productsStore.initRealtimeSync()
})
