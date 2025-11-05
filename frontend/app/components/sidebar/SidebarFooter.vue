<template>
  <div class="sidebar-footer">
    <NuxtLink to="/cart" class="sidebar-footer__link" @click="$emit('navigate')">
      <i class="bi bi-bag sidebar-footer__icon"></i>
      <span>PANIER</span>
      <span v-if="totalItems > 0" class="sidebar-footer__badge">{{ totalItems }}</span>
    </NuxtLink>

    <NuxtLink to="/account" class="sidebar-footer__link" @click="$emit('navigate')">
      <i class="bi bi-person sidebar-footer__icon"></i>
      <span>CONNEXION</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../../../stores/cart'

defineEmits<{
  navigate: []
}>()

const cartStore = useCartStore()
const totalItems = computed(() => cartStore.totalItems || 0)
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
