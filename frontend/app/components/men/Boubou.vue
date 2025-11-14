<template>
  <div class="boubou-section">
    <!-- Section Header -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">Boubous</h2>
        <p class="section-count">{{ filteredProducts.length }} produits</p>
      </div>
      <div class="header-right">
        <select v-model="sortBy" class="sort-select">
          <option value="default">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name">Nom A-Z</option>
          <option value="newest">Nouveautés</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="filteredProducts.length > 0" class="products-grid">
      <ProductCard
        v-for="product in displayedProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- View More Button -->
    <div v-if="hasMore" class="view-more-container">
      <button @click="loadMore" class="btn-view-more">
        Voir Plus
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <p class="empty-text">Aucun boubou disponible pour le moment</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from '../ProductCard.vue'

// Sort option
const sortBy = ref('default')

// Pagination
const itemsPerPage = 6
const currentPage = ref(1)

// Mock data - À remplacer par des données de l'API
const products = ref([
  {
    id: 1,
    name: 'Boubou Traditionnel Blanc',
    slug: 'boubou-traditionnel-blanc',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'
    ],
    badge: { type: 'featured', text: 'VEDETTE' }
  },
  {
    id: 2,
    name: 'Boubou Brodé Ivoire',
    slug: 'boubou-brode-ivoire',
    price: 42000,
    images: [
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
    ]
  },
  {
    id: 3,
    name: 'Boubou Royal Noir',
    slug: 'boubou-royal-noir',
    price: 38000,
    images: [
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
    ]
  },
  {
    id: 4,
    name: 'Boubou Premium Bleu',
    slug: 'boubou-premium-bleu',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'
    ],
    badge: { type: 'new', text: 'NOUVEAU' }
  },
  {
    id: 5,
    name: 'Boubou Élégant Marron',
    slug: 'boubou-elegant-marron',
    price: 40000,
    images: [
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
    ]
  },
  {
    id: 6,
    name: 'Boubou Moderne Gris',
    slug: 'boubou-moderne-gris',
    price: 37000,
    images: [
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
    ]
  },
  {
    id: 7,
    name: 'Boubou Luxe Beige',
    slug: 'boubou-luxe-beige',
    price: 43000,
    images: [
      'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
    ],
    badge: { type: 'featured', text: 'VEDETTE' }
  },
  {
    id: 8,
    name: 'Boubou Classique Vert',
    slug: 'boubou-classique-vert',
    price: 36000,
    images: [
      'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
    ]
  }
])

// Filtered products (pour l'instant, tous les produits)
const filteredProducts = computed(() => products.value)

// Sorted products
const sortedProducts = computed(() => {
  const sorted = [...filteredProducts.value]
  
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

// Displayed products (with pagination)
const displayedProducts = computed(() => {
  return sortedProducts.value.slice(0, currentPage.value * itemsPerPage)
})

// Check if there are more products to load
const hasMore = computed(() => {
  return displayedProducts.value.length < sortedProducts.value.length
})

// Load more products
function loadMore() {
  currentPage.value++
}

// Reset pagination when sort changes
watch(sortBy, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.boubou-section {
  width: 100%;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(201, 164, 108, 0.2);
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0;
  letter-spacing: 0.5px;
}

.section-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
  opacity: 0.7;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 4px;
  background: #FFFFFF;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  color: #2A2A2A;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.sort-select:hover {
  border-color: #C9A46C;
}

.sort-select:focus {
  outline: none;
  border-color: #C9A46C;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* View More Button */
.view-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  color: #C9A46C;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  color: #2A2A2A;
  margin: 0;
  opacity: 0.7;
}

/* Responsive - Large Desktop */
@media (min-width: 1400px) {
  .products-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Responsive - Desktop */
@media (max-width: 1399px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-right {
    width: 100%;
  }

  .sort-select {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  .btn-view-more {
    padding: 0.875rem 2.5rem;
    font-size: 0.8125rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 767px) {
  .section-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .empty-state {
    padding: 3rem 1.5rem;
  }

  .empty-state i {
    font-size: 3rem;
  }

  .btn-view-more {
    padding: 0.875rem 2rem;
    font-size: 0.8125rem;
    width: 100%;
  }
}
</style>
