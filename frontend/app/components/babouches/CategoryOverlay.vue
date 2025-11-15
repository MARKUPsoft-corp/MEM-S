<template>
  <transition name="overlay-fade">
    <div v-if="isOpen" class="category-overlay">
      <div class="overlay-container">
        <button class="overlay-close" @click="$emit('close')" aria-label="Fermer">
          <i class="bi bi-x"></i>
        </button>

        <div class="overlay-header">
          <div class="header-left">
            <h2 class="overlay-title">{{ title }}</h2>
            <div class="title-underline"></div>
            <p class="overlay-count">{{ products.length }} produits</p>
          </div>
          
          <div class="overlay-sort">
            <select v-model="sortBy" class="sort-select">
              <option value="default">Trier par</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
              <option value="newest">Nouveautés</option>
            </select>
          </div>
        </div>

        <div class="overlay-products">
          <AfricanPatternBackground opacity="light" color="gold" />
          <div class="products-grid">
            <ProductCard
              v-for="product in sortedProducts"
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ProductCard from '../ProductCard.vue'
import AfricanPatternBackground from '../AfricanPatternBackground.vue'

interface Props {
  isOpen: boolean
  title: string
  products: any[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const sortBy = ref('default')

const sortedProducts = computed(() => {
  const sorted = [...props.products]
  
  switch (sortBy.value) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'newest':
      return sorted.reverse()
    default:
      return sorted
  }
})

watch(() => props.isOpen, (isOpen) => {
  if (import.meta.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

function handleEscapeKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('keydown', handleEscapeKey)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleEscapeKey)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.category-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #F5F2EC;
  z-index: 2000;
  overflow-y: auto;
}

.overlay-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
}

.overlay-close {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: #0E3A34;
  border: none;
  border-radius: 50%;
  color: #F5F2EC;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 2001;
  box-shadow: 0 4px 12px rgba(14, 58, 52, 0.3);
}

.overlay-close:hover {
  background: #C9A46C;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(14, 58, 52, 0.4);
}

.overlay-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.header-left {
  flex: 1;
}

.overlay-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0 0 0.75rem 0;
  letter-spacing: 1px;
}

.title-underline {
  width: 80px;
  height: 3px;
  background: #C9A46C;
  border-radius: 2px;
  margin: 0 0 1rem 0;
}

.overlay-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
  opacity: 0.8;
}

.overlay-sort {
  display: flex;
  align-items: flex-start;
}

.sort-select {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 4px;
  background: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  color: #2A2A2A;
  cursor: pointer;
  transition: border-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.sort-select:hover {
  border-color: #C9A46C;
}

.sort-select:focus {
  outline: none;
  border-color: #C9A46C;
}

.overlay-products {
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  padding: 3rem;
  background: #F5F2EC;
  border: 2px solid rgba(201, 164, 108, 0.3);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(14, 58, 52, 0.08);
}

.products-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1399px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1024px) {
  .overlay-container {
    padding: 2rem 1.5rem;
  }

  .overlay-close {
    top: 1.5rem;
    right: 1.5rem;
    width: 45px;
    height: 45px;
    font-size: 1.75rem;
  }

  .overlay-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding-top: 1rem;
  }

  .overlay-title {
    font-size: 2rem;
  }

  .overlay-sort {
    width: 100%;
  }

  .sort-select {
    width: 100%;
  }

  .overlay-products {
    padding: 2rem;
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 767px) {
  .overlay-container {
    padding: 1.5rem 1rem;
  }

  .overlay-close {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }

  .overlay-title {
    font-size: 1.75rem;
  }

  .overlay-products {
    padding: 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
</style>
