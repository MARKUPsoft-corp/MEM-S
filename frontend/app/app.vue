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

<style>
/* Styles globaux pour assurer le fond ivoire partout */
html,
body {
  background: #F5F2EC !important;
  margin: 0;
  padding: 0;
}

#__nuxt {
  background: #F5F2EC;
  min-height: 100vh;
}
</style>
