<template>
    <section class="mens-collection-section">
        <AfricanPatternBackground opacity="light" color="gold" />
        <div class="container">
            <!-- Section Title -->
            <div class="section-header">
                <h2 class="section-title">Collection Hommes</h2>
                <div class="title-underline"></div>
                <p class="section-subtitle">Élégance et tradition africaine</p>
            </div>

            <!-- Subcategory Tabs -->
            <div v-if="categories.length > 0" class="subcategory-tabs">
                <button v-for="category in categories" :key="category.id"
                    @click="selectCategory(category.slug)"
                    :class="['subcategory-tab', { active: activeCategory === category.slug }]">
                    {{ category.name }}
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
                <p>Chargement des produits...</p>
            </div>

            <!-- Products Grid -->
            <div v-else class="products-grid">
                <ProductCard v-for="product in displayedProducts" :key="product.id" :product="product" />
            </div>

            <!-- View All Button -->
            <div class="view-all-container">
                <NuxtLink to="/men" class="btn-view-all">
                    Voir la collection complète
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProducts } from '../../composables/useProducts'
import ProductCard from './ProductCard.vue'

const { fetchProducts, fetchCategoriesByCollection } = useProducts()

const categories = ref([])
const products = ref([])
const activeCategory = ref(null)
const loading = ref(true)

// Charger les catégories de la collection "men"
onMounted(async () => {
    try {
        loading.value = true
        
        // Récupérer les catégories groupées par collection
        const collectionData = await fetchCategoriesByCollection()
        categories.value = collectionData['men'] || []
        
        // Sélectionner la première catégorie par défaut
        if (categories.value.length > 0) {
            activeCategory.value = categories.value[0].slug
        }
        
        // Charger les produits de la collection homme
        const response = await fetchProducts({ collection: 'men' })
        products.value = response.results || []
        
    } catch (error) {
        console.error('Error loading men collection:', error)
        categories.value = []
        products.value = []
    } finally {
        loading.value = false
    }
})

// Filtrer les produits par catégorie active
const filteredProducts = computed(() => {
    if (!activeCategory.value) return products.value
    return products.value.filter(product => product.category.slug === activeCategory.value)
})

// Limiter à 6 produits pour l'affichage dans la section
const displayedProducts = computed(() => {
    return filteredProducts.value.slice(0, 6)
})

const selectCategory = (categorySlug) => {
    activeCategory.value = categorySlug
}
</script>

<style scoped>
.mens-collection-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
    overflow: hidden;
}

.mens-collection-section::before {
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
    color: #2A2A2A;
    margin: 0;
    opacity: 0.8;
}

/* Loading State */
.loading-container {
    text-align: center;
    padding: 3rem;
    color: #2A2A2A;
    font-family: 'Montserrat', sans-serif;
}

/* Subcategory Tabs */
.subcategory-tabs {
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

.subcategory-tabs::-webkit-scrollbar {
    display: none;
}

.subcategory-tab {
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

.subcategory-tab:hover {
    color: #0E3A34;
}

.subcategory-tab.active {
    color: #0E3A34;
    font-weight: 600;
    border-bottom-color: #0E3A34;
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
        margin-bottom: 3rem;
    }

    .subcategory-tabs {
        margin-bottom: 2.5rem;
    }

    .subcategory-tab {
        padding: 0.875rem 1.5rem;
        font-size: 0.9375rem;
    }
}

/* Mobile */
@media (max-width: 767px) {
    .mens-collection-section {
        padding: 2rem 0 3rem 0;
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

    .subcategory-tabs {
        margin-bottom: 2rem;
    }

    .subcategory-tab {
        padding: 0.75rem 1.25rem;
        font-size: 0.875rem;
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
