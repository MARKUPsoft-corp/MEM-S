<template>
    <section class="featured-products-section">
        <AfricanPatternBackground opacity="light" color="gold" />
        <div class="container">
            <!-- Section Title -->
            <div class="section-header">
                <h2 class="section-title">Produits en Vedette</h2>
                <div class="title-underline"></div>
                <p class="section-subtitle">Nos meilleurs produits sélectionnés pour vous</p>
            </div>

            <!-- Category Tabs -->
            <div class="category-tabs">
                <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)"
                    :class="['category-tab', { active: activeCategory === category.id }]">
                    {{ category.name }}
                </button>
            </div>

            <!-- Products Grid -->
            <div class="products-grid">
                <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'

// Categories de filtrage
const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'men', name: 'Hommes' },
    { id: 'women', name: 'Femmes' },
    { id: 'babouches', name: 'Babouches' },
    { id: 'lins', name: 'Lins' }
]

const activeCategory = ref('all')

// Tous les produits en vedette (uniquement ceux avec badge VEDETTE)
const products = ref([
    // Hommes
    {
        id: 1,
        name: 'Boubou Premium Blanc',
        slug: 'boubou-premium-blanc',
        price: 45000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ],
        category: 'men',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 2,
        name: 'Costume Africain Moderne',
        slug: 'costume-africain-moderne',
        price: 60000,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        category: 'men',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    // Femmes
    {
        id: 3,
        name: 'Robe Africaine Élégante',
        slug: 'robe-africaine-elegante',
        price: 38000,
        images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=600&h=750&fit=crop&q=80'
        ],
        category: 'women',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 4,
        name: 'Sac à Main Élégant',
        slug: 'sac-a-main-elegant',
        price: 28000,
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80'
        ],
        category: 'women',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    // Babouches
    {
        id: 5,
        name: 'Babouches Cuir Premium',
        slug: 'babouches-cuir-premium',
        price: 20000,
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
        ],
        category: 'babouches',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    // Lins
    {
        id: 6,
        name: 'Ensemble Lin Naturel',
        slug: 'ensemble-lin-naturel',
        price: 35000,
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80'
        ],
        category: 'lins',
        badge: { type: 'featured', text: 'VEDETTE' }
    }
])

// Filtrage des produits par catégorie
const filteredProducts = computed(() => {
    if (activeCategory.value === 'all') {
        return products.value
    }
    return products.value.filter(product => product.category === activeCategory.value)
})

const selectCategory = (categoryId) => {
    activeCategory.value = categoryId
}
</script>

<style scoped>
.featured-products-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
    overflow: hidden;
}

.featured-products-section::before {
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
    margin-bottom: 2rem;
}

.title-underline {
    width: 80px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
    margin: 0 auto 1rem;
}

/* Category Tabs */
.category-tabs {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-bottom: 3rem;
    border-bottom: 2px solid #e5e5e5;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.category-tabs::-webkit-scrollbar {
    display: none;
}

.category-tab {
    padding: 1rem 2rem;
    border: none;
    background: transparent;
    color: #2A2A2A;
    font-size: 1rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
    white-space: nowrap;
    font-family: 'Montserrat', sans-serif;
    position: relative;
    bottom: -2px;
}

.category-tab:hover {
    color: #0E3A34;
}

.category-tab.active {
    color: #0E3A34;
    font-weight: 600;
    border-bottom-color: #0E3A34;
}

.section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
    letter-spacing: 1px;
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

    .category-tabs {
        margin-bottom: 2rem;
    }

    .category-tab {
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
    }

    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}
</style>
