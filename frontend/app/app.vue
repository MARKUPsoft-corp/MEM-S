<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

// Initialiser les stores au démarrage
onMounted(() => {
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  
  authStore.initFromLocalStorage()
  cartStore.loadFromLocalStorage()
})
</script>
