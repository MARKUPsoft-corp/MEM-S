<template>
  <div class="sidebar-footer">
    <a @click="handleCartClick" class="sidebar-footer__link" style="cursor: pointer;">
      <i class="bi bi-cart sidebar-footer__icon"></i>
      <span>PANIER</span>
      <span v-if="totalItems > 0" class="sidebar-footer__badge">{{ totalItems }}</span>
    </a>

    <NuxtLink :to="profileLink" class="sidebar-footer__link" @click="$emit('navigate')">
      <i class="bi bi-person sidebar-footer__icon"></i>
      <span>{{ authText }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../../stores/cart'
import { useAuthStore } from '../../../stores/auth'
import { useConfirm } from '../../../composables/useConfirm'

const emit = defineEmits<{
  navigate: []
}>()

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const totalItems = computed(() => cartStore.totalItems || 0)

const profileLink = computed(() => authStore.isAuthenticated ? '/profile' : '/auth')
const authText = computed(() => authStore.isAuthenticated ? 'MON PROFIL' : 'CONNEXION')

// Gérer le clic sur le lien panier
const handleCartClick = async () => {
  if (!authStore.isAuthenticated) {
    const { confirm: showConfirm } = useConfirm()
    const confirmed = await showConfirm({
      title: 'Connexion requise',
      message: 'Vous devez être connecté pour accéder au panier. Voulez-vous vous connecter maintenant ?',
      confirmText: 'Se connecter',
      cancelText: 'Annuler',
      type: 'info'
    })
    
    if (confirmed) {
      router.push('/auth')
      emit('navigate')
    }
  } else {
    router.push('/cart')
    emit('navigate')
  }
}
</script>

<style scoped>
.sidebar-footer {
  padding: 1.5rem 0;
  border-top: 1px solid rgba(201, 164, 108, 0.2);
  margin-top: auto;
}

.sidebar-footer__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  color: #0B0B0B;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  transition: background-color 0.2s, color 0.2s;
  position: relative;
}

.sidebar-footer__link:hover {
  background: rgba(201, 164, 108, 0.1);
  color: #C9A46C;
}

.sidebar-footer__icon {
  font-size: 1.125rem;
}

.sidebar-footer__badge {
  position: absolute;
  right: 1.5rem;
  background: #C9A46C;
  color: #0B0B0B;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
