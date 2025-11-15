<template>
  <div class="category-preview">
    <!-- African Pattern Background -->
    <AfricanPatternBackground opacity="light" color="gold" />
    
    <div class="section-header">
      <h2 class="section-title">Babouches Brodées</h2>
      <div class="title-underline"></div>
      <p class="section-subtitle">{{ products.length }} produits disponibles</p>
    </div>

    <div class="products-grid">
      <ProductCard
        v-for="product in previewProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <div class="view-more-container">
      <button @click="$emit('viewAll')" class="btn-view-more">
        Voir Plus
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductCard from '../ProductCard.vue'
import AfricanPatternBackground from '../AfricanPatternBackground.vue'

defineEmits<{
  viewAll: []
}>()

const products = ref([
  {
    id: 1,
    name: 'Babouches Brodées Or',
    slug: 'babouches-brodees-or',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'
    ],
    badge: { type: 'featured', text: 'VEDETTE' }
  },
  {
    id: 2,
    name: 'Babouches Brodées Argent',
    slug: 'babouches-brodees-argent',
    price: 24000,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
    ]
  },
  {
    id: 3,
    name: 'Babouches Brodées Multicolores',
    slug: 'babouches-brodees-multicolores',
    price: 26000,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'
    ],
    badge: { type: 'new', text: 'NOUVEAU' }
  },
  {
    id: 4,
    name: 'Babouches Brodées Traditionnelles',
    slug: 'babouches-brodees-traditionnelles',
    price: 23000,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
    ]
  },
  {
    id: 5,
    name: 'Babouches Brodées Luxe',
    slug: 'babouches-brodees-luxe',
    price: 28000,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'
    ],
    badge: { type: 'featured', text: 'VEDETTE' }
  },
  {
    id: 6,
    name: 'Babouches Brodées Élégantes',
    slug: 'babouches-brodees-elegantes',
    price: 24500,
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
    ]
  }
])

const previewProducts = computed(() => products.value.slice(0, 4))
</script>

<style scoped>
.category-preview {
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-bottom: 4rem;
  padding: 3rem;
  background: #F5F2EC;
  border: 2px solid rgba(201, 164, 108, 0.3);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(14, 58, 52, 0.08);
}

.section-header {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0 0 1rem 0;
  letter-spacing: 1px;
}

.title-underline {
  width: 80px;
  height: 3px;
  background: #C9A46C;
  border-radius: 2px;
  margin: 0 auto 1rem;
}

.section-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
  opacity: 0.8;
}

.products-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.view-more-container {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.btn-view-more {
  padding: 1rem 3rem;
  background: #0E3A34;
  color: #F5F2EC;
  border: 2px solid #0E3A34;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.btn-view-more:hover {
  background: transparent;
  color: #0E3A34;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .btn-view-more {
    padding: 0.875rem 2.5rem;
  }
}

@media (max-width: 767px) {
  .category-preview {
    margin-bottom: 3rem;
    padding: 2rem 1.5rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 0.9375rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .btn-view-more {
    padding: 0.875rem 2rem;
    width: 100%;
  }
}
</style>
