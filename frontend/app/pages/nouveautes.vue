<template>
    <div class="nouveautes-page">
        <!-- Hero Banner -->
        <section class="page-hero">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">Nouveautés</h1>
                <p class="hero-subtitle">Découvrez nos dernières créations</p>
            </div>
        </section>

        <!-- Main Content -->
        <div class="page-content">
            <div class="container">
                <!-- Filters & Products -->
                <div class="content-wrapper">
                    <!-- Sidebar Filters (Desktop) -->
                    <aside class="filters-sidebar">
                        <!-- African Pattern Background -->
                        <AfricanPatternBackground opacity="light" color="gold" />
                        
                        <!-- Breadcrumb -->
                        <nav class="breadcrumb">
                            <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
                            <span class="breadcrumb-separator">/</span>
                            <span class="breadcrumb-current">Nouveautés</span>
                        </nav>

                        <div class="sidebar-header">
                            <h3 class="sidebar-title">Filtrer par</h3>
                            <div class="title-underline"></div>
                        </div>
                        
                        <nav class="categories-nav">
                            <button @click="selectCategory('all')" 
                                :class="['category-link', { active: activeCategory === 'all' }]">
                                <i class="bi bi-chevron-right"></i>
                                Tous les produits
                            </button>
                            <button @click="selectCategory('men')" 
                                :class="['category-link', { active: activeCategory === 'men' }]">
                                <i class="bi bi-chevron-right"></i>
                                Hommes
                            </button>
                            <button @click="selectCategory('women')" 
                                :class="['category-link', { active: activeCategory === 'women' }]">
                                <i class="bi bi-chevron-right"></i>
                                Femmes
                            </button>
                            <button @click="selectCategory('babouches')" 
                                :class="['category-link', { active: activeCategory === 'babouches' }]">
                                <i class="bi bi-chevron-right"></i>
                                Babouches
                            </button>
                            <button @click="selectCategory('lins')" 
                                :class="['category-link', { active: activeCategory === 'lins' }]">
                                <i class="bi bi-chevron-right"></i>
                                Lins
                            </button>
                        </nav>
                    </aside>

                    <!-- Products Grid -->
                    <main class="products-main">
                        <div class="category-preview">
                            <!-- African Pattern Background -->
                            <AfricanPatternBackground opacity="light" color="gold" />
                            
                            <!-- Section Header -->
                            <div class="section-header">
                                <h2 class="section-title">
                                    {{ activeCategory === 'all' ? 'Toutes les nouveautés' : getCategoryTitle() }}
                                </h2>
                                <div class="title-underline"></div>
                                <p class="section-subtitle">{{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }} disponible{{ filteredProducts.length > 1 ? 's' : '' }}</p>
                            </div>
                            
                            <div class="products-grid">
                                <ProductCard v-for="product in filteredProducts" :key="product.id" :product="mappedProduct(product)" />
                            </div>
                            
                            <!-- Empty State -->
                            <div v-if="filteredProducts.length === 0" class="empty-state">
                                <i class="bi bi-inbox"></i>
                                <p>Aucune nouveauté dans cette catégorie pour le moment.</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        
        <!-- Mobile Filter Button -->
        <FilterButton @open="filterPopupOpen = true" />
        
        <!-- Mobile Filter Popup -->
        <FilterPopup 
            :is-open="filterPopupOpen" 
            :categories="filterCategories"
            v-model="activeCategory"
            @close="filterPopupOpen = false" 
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProducts } from '../../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'
import FilterButton from '../components/FilterButton.vue'
import FilterPopup from '../components/FilterPopup.vue'

// Récupérer les nouveaux produits depuis l'API
const { fetchNewArrivals } = useProducts()

// Nouveaux produits
const newProducts = ref<any[]>([])
const loading = ref(false)

// Catégorie active
const activeCategory = ref('all')

// Filter popup state
const filterPopupOpen = ref(false)

// Categories for filter popup
const filterCategories = [
    { id: 'all', label: 'Tous les produits' },
    { id: 'men', label: 'Hommes' },
    { id: 'women', label: 'Femmes' },
    { id: 'babouches', label: 'Babouches' },
    { id: 'lins', label: 'Lins' }
]

// Mapper les catégories du composable aux catégories de filtrage
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

// Charger les nouveaux produits au montage
onMounted(async () => {
    try {
        loading.value = true
        newProducts.value = await fetchNewArrivals()
    } catch (error) {
        console.error('Erreur lors du chargement des nouveaux produits:', error)
    } finally {
        loading.value = false
    }
})

// Produits filtrés par catégorie
const filteredProducts = computed(() => {
    if (activeCategory.value === 'all') {
        return newProducts.value
    }
    return newProducts.value.filter(product => getCategoryGroup(product.category.slug) === activeCategory.value)
})

// Sélectionner une catégorie
function selectCategory(category: string) {
    activeCategory.value = category
}

// Obtenir le titre de la catégorie
function getCategoryTitle() {
    const titles: Record<string, string> = {
        men: 'Nouveautés Hommes',
        women: 'Nouveautés Femmes',
        babouches: 'Nouveautés Babouches',
        lins: 'Nouveautés Lins'
    }
    return titles[activeCategory.value] || 'Toutes les nouveautés'
}

// Mapper le produit pour ProductCard
function mappedProduct(product: any) {
    return {
        ...product,
        images: product.images.map((img: any) => img.image),
        badge: { type: 'new', text: 'NOUVEAU' }
    }
}

// Page metadata
useHead({
    title: 'Nouveautés - MEM\'S',
    meta: [
        {
            name: 'description',
            content: 'Découvrez nos dernières créations : boubous, robes, babouches et vêtements en lin. Nouveautés exclusives.'
        }
    ]
})
</script>

<style scoped>
/* Page Hero */
.page-hero {
    position: relative;
    width: 100%;
    height: 100vh;
    background-image: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop&q=80');
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Pas de margin-top - s'étend derrière la navbar */
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
            rgba(11, 11, 11, 0.5) 0%,
            rgba(11, 11, 11, 0.7) 100%);
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: #F5F2EC;
}

.hero-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 3.5rem;
    font-weight: 600;
    color: #F5F2EC;
    margin: 0 0 1rem 0;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.hero-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 400;
    color: #C9A46C;
    margin: 0;
    letter-spacing: 1px;
}

/* Breadcrumb inside sidebar */
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(201, 164, 108, 0.3);
}

.breadcrumb-link {
    color: #2A2A2A;
    text-decoration: none;
    transition: color 0.3s ease;
}

.breadcrumb-link:hover {
    color: #C9A46C;
}

.breadcrumb-separator {
    color: #2A2A2A;
    opacity: 0.5;
}

.breadcrumb-current {
    color: #0E3A34;
    font-weight: 500;
}

/* Page Content */
.page-content {
    background: #F5F2EC;
    padding: 3rem 0;
    min-height: 60vh;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
}

.content-wrapper {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 3rem;
}

/* Filters Sidebar */
.filters-sidebar {
    position: relative;
    overflow: hidden;
    background: #F5F2EC;
    padding: 2rem;
    border-radius: 4px;
    border: 1px solid rgba(201, 164, 108, 0.3);
    height: fit-content;
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
    transition: box-shadow 0.3s ease;
}

/* Sticky uniquement sur desktop */
@media (min-width: 768px) {
    .filters-sidebar {
        position: sticky;
        top: 120px;
    }
}

.sidebar-header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.sidebar-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 0.75rem 0;
    letter-spacing: 0.5px;
}

.title-underline {
    width: 60px;
    height: 2px;
    background: #C9A46C;
    border-radius: 2px;
    margin: 0 auto;
}

.categories-nav {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.category-link {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: #0E3A34;
    border: 1px solid rgba(201, 164, 108, 0.2);
    border-radius: 4px;
    color: #F5F2EC;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
}

.category-link i {
    font-size: 0.75rem;
    color: #C9A46C;
    transition: transform 0.3s ease;
}

.category-link:hover,
.category-link.active {
    background: #0E3A34;
    border-color: #C9A46C;
    color: #C9A46C;
    transform: translateX(4px);
}

.category-link:hover i,
.category-link.active i {
    transform: translateX(4px);
    color: #C9A46C;
}

/* Products Main */
.products-main {
    background: transparent;
    padding: 0;
    min-height: 500px;
}

/* Category Preview Box */
.category-preview {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding: 3rem;
    background: #F5F2EC;
    border: 2px solid rgba(201, 164, 108, 0.3);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(14, 58, 52, 0.08);
}

/* Section Header */
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

/* Products Grid */
.products-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

/* Empty State */
.empty-state {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 4rem 2rem;
}

.empty-state i {
    font-size: 4rem;
    color: #C9A46C;
    margin-bottom: 1rem;
}

.empty-state p {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.125rem;
    color: #2A2A2A;
    margin: 0;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
    .hero-title {
        font-size: 3rem;
    }

    .content-wrapper {
        grid-template-columns: 240px 1fr;
        gap: 2rem;
    }

    .products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
    }
}

/* Responsive - Mobile */
@media (max-width: 767px) {
    .hero-title {
        font-size: 2.5rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .page-content {
        padding: 2rem 0;
    }

    .content-wrapper {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .filters-sidebar {
        display: none;
    }

    .products-main {
        padding: 0;
    }

    .category-preview {
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
}
</style>
