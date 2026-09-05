<template>
    <section class="new-arrivals-section">
        <AfricanPatternBackground opacity="light" color="gold" />
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

            <!-- View All Button -->
            <div class="view-all-container">
                <NuxtLink to="/nouveautes" class="btn-view-all">
                    Voir toutes les nouveautés
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import { useProducts } from '../../composables/useProducts'
import type { Product } from '../../types/product'

const { fetchNewArrivals } = useProducts()

// Type étendu pour les produits avec badge et categoryGroup
interface ExtendedProduct extends Product {
    badge?: { type: string; text: string }
    categoryGroup?: string
}

// Categories de filtrage
const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'men', name: 'Hommes' },
    { id: 'women', name: 'Femmes' },
    { id: 'babouches', name: 'Babouches' },
    { id: 'lins', name: 'Lins' }
]

const activeCategory = ref('all')
const newProducts = ref<ExtendedProduct[]>([])
const loading = ref(false)

// Mapper les catégories aux collections
const getCategoryGroup = (categorySlug: string) => {
    if (['boubous', 'gandouras', 'costumes', 'chemises', 'pantalons'].includes(categorySlug)) {
        return 'men'
    }
    if (['robes', 'ensembles', 'sacs'].includes(categorySlug)) {
        return 'women'
    }
    if (['babouches-cuir', 'babouches-brodees'].includes(categorySlug)) {
        return 'babouches'
    }
    if (['chemises-lin', 'pantalons-lin'].includes(categorySlug)) {
        return 'lins'
    }
    return 'all'
}

// Charger les nouveaux produits
onMounted(async () => {
    try {
        loading.value = true
        const products = await fetchNewArrivals()
        // Ajouter le badge et categoryGroup
        newProducts.value = products.map(product => ({
            ...product,
            images: product.images?.map((img: any) => img.image) || [],
            badge: { type: 'new', text: 'NOUVEAU' },
            categoryGroup: getCategoryGroup(product.category.slug)
        }))
    } catch (error) {
        console.error('Erreur lors du chargement des nouveaux produits:', error)
    } finally {
        loading.value = false
    }
})

// Filtrage des produits par catégorie
const filteredProducts = computed(() => {
    if (activeCategory.value === 'all') {
        return newProducts.value
    }
    return newProducts.value.filter(product => product.categoryGroup === activeCategory.value)
})

const selectCategory = (categoryId: string) => {
    activeCategory.value = categoryId
}
</script>

<style scoped>
.new-arrivals-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
    overflow: hidden;
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
    position: relative;
    z-index: 2;
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

/* View All Button */
.view-all-container {
    display: flex;
    justify-content: center;
    margin-top: 4rem;
}

.btn-view-all {
    display: inline-block;
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
