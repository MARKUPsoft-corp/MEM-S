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

// Initialiser le store auth au démarrage
onMounted(() => {
  const authStore = useAuthStore()
  authStore.initFromLocalStorage()
  
  // Note: Le cart sera chargé par les pages qui en ont besoin
  // pour éviter des appels API inutiles
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
