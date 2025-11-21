<template>
    <section class="babouches-section">
        <AfricanPatternBackground opacity="light" color="gold" />
        <div class="container">
            <!-- Section Title -->
            <div class="section-header">
                <h2 class="section-title">Collection Babouches</h2>
                <div class="title-underline"></div>
                <p class="section-subtitle">Élégance traditionnelle</p>
            </div>

            <!-- Products Grid -->
            <div class="products-grid">
                <ProductCard v-for="product in products" :key="product.id" :product="product" />
            </div>

            <!-- View All Button -->
            <div class="view-all-container">
                <NuxtLink to="/babouches" class="btn-view-all">
                    Découvrir la collection
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProducts } from '../../composables/useProducts'
import ProductCard from './ProductCard.vue'

const { fetchProducts } = useProducts()

// Charger les produits babouches depuis l'API
const products = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await fetchProducts({ collection: 'babouches' })
    // Transformer les données API pour correspondre au format attendu par ProductCard
    const apiProducts = response.results || []
    products.value = apiProducts.slice(0, 6).map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      originalPrice: product.discount_price ? parseFloat(product.price) : null,
      // Extraire les URLs des images depuis les objets
      images: product.images?.map((img: any) => img.image) || [],
      // Mapper les badges
      badge: product.is_featured 
        ? { type: 'featured', text: 'VEDETTE' }
        : product.is_new 
        ? { type: 'new', text: 'NOUVEAU' }
        : null
    }))
  } catch (error) {
    console.error('Error loading babouches products:', error)
    products.value = []
  }
})
</script>

<style scoped>
.babouches-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
    overflow: hidden;
}

.babouches-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 2rem);
    max-width: 1400px;
    height: 1px;
    background: linear-gradient(to right,
            transparent 0%,
            #C9A46C 20%,
            #C9A46C 80%,
            transparent 100%);
    opacity: 0.3;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
}

/* Section Header */
.section-header {
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

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    margin-bottom: 3rem;
}

/* View All Button */
.view-all-container {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
}

.btn-view-all {
    padding: 1rem 3rem;
    background: #0E3A34;
    color: #F5F2EC;
    border: 2px solid #0E3A34;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 2px;
    text-decoration: none;
    display: inline-block;
}

.btn-view-all:hover {
    background: transparent;
    color: #0E3A34;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
}

/* Responsive */
@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }
}

@media (max-width: 992px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
    .section-header {
        margin-bottom: 2.5rem;
    }
}

/* Mobile */
@media (max-width: 767px) {
    .container {
        padding: 0 1rem;
    }

    .section-header {
        margin-bottom: 2.5rem;
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

    .view-all-container {
        margin-top: 3rem;
    }

    .btn-view-all {
        padding: 0.875rem 2rem;
        font-size: 0.8125rem;
        letter-spacing: 1px;
    }
}
</style>
