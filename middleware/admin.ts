import { useAuthStore } from '~~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const authStore = useAuthStore()

  // Attendre la résolution complète de la session Firebase & profil Firestore
  await authStore.initAuth()

  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth',
      query: { redirect: to.fullPath }
    })
  }

  if (!authStore.isAdmin) {
    return navigateTo('/')
  }
})
