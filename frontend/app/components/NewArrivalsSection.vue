<template>
    <section class="new-arrivals-section">
        <div class="container">
            <!-- Section Title -->
            <div class="section-header">
                <h2 class="section-title">Nouveautés</h2>
                <div class="title-underline"></div>
                <p class="section-subtitle">Découvrez nos dernières créations</p>
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

            <!-- Load More Button (optionnel) -->
            <div v-if="hasMore" class="load-more-container">
                <button class="btn-load-more" @click="loadMore">
                    Voir Plus
                </button>
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
const hasMore = ref(false) // À activer si pagination

// Données de produits (à remplacer par des données réelles depuis une API)
const products = ref([
    {
        id: 1,
        name: 'Boubou Traditionnel',
        slug: 'boubou-traditionnel',
        price: 252.00,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'
        ],
        category: 'men',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 2,
        name: 'Gandoura Élégante',
        slug: 'gandoura-elegante',
        price: 504.00,
        images: [
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        category: 'men',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 3,
        name: 'Robe Africaine',
        slug: 'robe-africaine',
        price: 350.00,
        images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=750&fit=crop&q=80'
        ],
        category: 'women',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 4,
        name: 'Babouches Cuir',
        slug: 'babouches-cuir',
        price: 120.00,
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
        ],
        category: 'babouches',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 5,
        name: 'Chemise Lin Homme',
        slug: 'chemise-lin-homme',
        price: 180.00,
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop&q=80'
        ],
        category: 'lins',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 6,
        name: 'Pantalon Lin',
        slug: 'pantalon-lin',
        price: 150.00,
        images: [
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'
        ],
        category: 'lins',
        badge: { type: 'new', text: 'NOUVEAU' }
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

const loadMore = () => {
    // Logique pour charger plus de produits
    console.log('Load more products...')
}
</script>

<style scoped>
.new-arrivals-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
}

.new-arrivals-section::before {
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
}

/* Section Header */
.section-header {
    text-align: center;
    margin-bottom: 2rem;
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
    color: var(--gris-anthracite);
    margin: 0;
    opacity: 0.8;
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
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

.category-tabs::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

.category-tab {
    padding: 1rem 2rem;
    border: none;
    background: transparent;
    color: var(--gris-anthracite);
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
    color: var(--vert-ebene);
}

.category-tab.active {
    color: var(--vert-ebene);
    font-weight: 600;
    border-bottom-color: var(--vert-ebene);
}

/* Products Grid */
.products-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
    margin-bottom: 0;
}

/* Load More Button */
.load-more-container {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
}

.btn-load-more {
    padding: 1rem 3rem;
    background: var(--vert-ebene);
    color: var(--ivoire);
    border: 2px solid var(--vert-ebene);
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 2px;
}

.btn-load-more:hover {
    background: transparent;
    color: var(--vert-ebene);
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

    .new-arrivals-section {
        padding: 4rem 0;
    }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
    .section-header {
        margin-bottom: 3rem;
    }

    .category-tabs {
        margin-bottom: 2.5rem;
    }

    .category-tab {
        padding: 0.875rem 1.5rem;
        font-size: 0.9375rem;
    }
}

/* Mobile */
@media (max-width: 767px) {
    .new-arrivals-section {
        padding: 2rem 0 0 0;
    }

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

    /* 2 colonnes sur mobile comme demandé */
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .load-more-container {
        margin-top: 3rem;
    }

    .btn-load-more {
        padding: 0.875rem 2rem;
        font-size: 0.8125rem;
        letter-spacing: 1px;
    }
}
</style>
