<template>
    <div class="products-page">
        <!-- Hero Banner -->
        <section class="page-hero">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">Nos Produits</h1>
                <p class="hero-subtitle">Découvrez l'intégralité de nos créations artisanales</p>
            </div>
        </section>

        <!-- Main Content -->
        <div class="page-content">
            <div class="container">
                <div class="content-wrapper">
                    <!-- Sidebar Filters (Desktop) -->
                    <aside class="filters-sidebar">
                        <AfricanPatternBackground opacity="light" color="gold" />
                        
                        <!-- Breadcrumb -->
                        <nav class="breadcrumb">
                            <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
                            <span class="breadcrumb-separator">/</span>
                            <span class="breadcrumb-current">Produits</span>
                        </nav>

                        <div class="sidebar-header">
                            <h3 class="sidebar-title">Collections</h3>
                            <div class="title-underline"></div>
                        </div>
                        
                        <nav class="categories-nav">
                            <button @click="selectCollection('all')" 
                                :class="['category-link', { active: activeCollection === 'all' }]">
                                <i class="bi bi-chevron-right"></i>
                                Tous les produits
                            </button>
                            <button @click="selectCollection('men')" 
                                :class="['category-link', { active: activeCollection === 'men' }]">
                                <i class="bi bi-chevron-right"></i>
                                Hommes
                            </button>
                            <button @click="selectCollection('women')" 
                                :class="['category-link', { active: activeCollection === 'women' }]">
                                <i class="bi bi-chevron-right"></i>
                                Femmes
                            </button>
                            <button @click="selectCollection('babouches')" 
                                :class="['category-link', { active: activeCollection === 'babouches' }]">
                                <i class="bi bi-chevron-right"></i>
                                Babouches
                            </button>
                            <button @click="selectCollection('lins')" 
                                :class="['category-link', { active: activeCollection === 'lins' }]">
                                <i class="bi bi-chevron-right"></i>
                                Lins
                            </button>
                        </nav>

                        <!-- Sort Options -->
                        <div class="sidebar-section mt-4">
                            <h4 class="sidebar-subtitle">Trier par</h4>
                            <select v-model="sortBy" class="form-select custom-select">
                                <option value="default">Par défaut</option>
                                <option value="price-asc">Prix croissant</option>
                                <option value="price-desc">Prix décroissant</option>
                                <option value="newest">Nouveautés d'abord</option>
                            </select>
                        </div>
                    </aside>

                    <!-- Products Grid -->
                    <main class="products-main">
                        <div class="category-preview">
                            <AfricanPatternBackground opacity="light" color="gold" />
                            
                            <!-- Section Header -->
                            <div class="section-header">
                                <h2 class="section-title">{{ getCollectionTitle() }}</h2>
                                <div class="title-underline"></div>
                                <p class="section-subtitle">{{ sortedAndFilteredProducts.length }} produit{{ sortedAndFilteredProducts.length > 1 ? 's' : '' }} disponible{{ sortedAndFilteredProducts.length > 1 ? 's' : '' }}</p>
                            </div>

                            <!-- Loading State -->
                            <div v-if="loading" class="loading-container">
                                <div class="spinner-border text-gold" role="status">
                                    <span class="visually-hidden">Chargement...</span>
                                </div>
                                <p class="mt-3">Chargement des produits...</p>
                            </div>
                            
                            <!-- Products Grid -->
                            <div v-else-if="sortedAndFilteredProducts.length > 0" class="products-grid">
                                <ProductCard 
                                    v-for="product in sortedAndFilteredProducts" 
                                    :key="product.id" 
                                    :product="mapProduct(product)" 
                                />
                            </div>
                            
                            <!-- Empty State -->
                            <div v-else class="empty-state">
                                <i class="bi bi-inbox"></i>
                                <p>Aucun produit trouvé dans cette sélection.</p>
                                <button @click="selectCollection('all')" class="btn-reset">
                                    Voir tous les produits
                                </button>
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
            v-model="activeCollection"
            @close="filterPopupOpen = false" 
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../../../composables/useProducts'
import ProductCard from '../../components/ProductCard.vue'
import AfricanPatternBackground from '../../components/AfricanPatternBackground.vue'
import FilterButton from '../../components/FilterButton.vue'
import FilterPopup from '../../components/FilterPopup.vue'
import type { Product } from '../../../types/product'

const route = useRoute()
const { fetchProducts } = useProducts()

const allProducts = ref<Product[]>([])
const loading = ref(true)
const activeCollection = ref('all')
const sortBy = ref('default')
const filterPopupOpen = ref(false)

const filterCategories = [
    { id: 'all', label: 'Tous les produits' },
    { id: 'men', label: 'Hommes' },
    { id: 'women', label: 'Femmes' },
    { id: 'babouches', label: 'Babouches' },
    { id: 'lins', label: 'Lins' }
]

// Identifier le groupe de collection à partir du slug de catégorie
const getCategoryGroup = (categorySlug: string): string => {
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

onMounted(async () => {
    // Lire la collection depuis les query params si présente (ex: ?collection=men)
    if (route.query.collection && typeof route.query.collection === 'string') {
        activeCollection.value = route.query.collection
    }

    try {
        loading.value = true
        const response: any = await fetchProducts()
        if (response && response.results) {
            allProducts.value = response.results
        } else if (Array.isArray(response)) {
            allProducts.value = response
        }
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
    } finally {
        loading.value = false
    }
})

const selectCollection = (collectionId: string) => {
    activeCollection.value = collectionId
}

const getCollectionTitle = (): string => {
    const titles: Record<string, string> = {
        all: 'Tous nos produits',
        men: 'Collection Hommes',
        women: 'Collection Femmes',
        babouches: 'Collection Babouches',
        lins: 'Collection Lin'
    }
    return titles[activeCollection.value] || 'Tous nos produits'
}

const mapProduct = (product: any) => {
    const primaryImg = product.images?.find((img: any) => img.is_primary)?.image 
        || product.images?.[0]?.image 
        || ''

    const allImages = product.images?.map((img: any) => img.image) || []
    if (allImages.length === 0 && primaryImg) {
        allImages.push(primaryImg)
    }

    let badge = undefined
    if (product.is_new) {
        badge = { type: 'new', text: 'NOUVEAU' }
    } else if (product.discount_price) {
        badge = { type: 'sale', text: 'PROMO' }
    }

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.discount_price || product.price,
        originalPrice: product.discount_price ? product.price : undefined,
        images: allImages,
        badge
    }
}

const sortedAndFilteredProducts = computed(() => {
    let list = [...allProducts.value]

    // Filtrage par collection
    if (activeCollection.value !== 'all') {
        list = list.filter(p => {
            const catSlug = p.category?.slug || ''
            return getCategoryGroup(catSlug) === activeCollection.value
        })
    }

    // Tri
    if (sortBy.value === 'price-asc') {
        list.sort((a, b) => {
            const priceA = a.discount_price || a.price
            const priceB = b.discount_price || b.price
            return Number(priceA) - Number(priceB)
        })
    } else if (sortBy.value === 'price-desc') {
        list.sort((a, b) => {
            const priceA = a.discount_price || a.price
            const priceB = b.discount_price || b.price
            return Number(priceB) - Number(priceA)
        })
    } else if (sortBy.value === 'newest') {
        list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0))
    }

    return list
})

useHead({
    title: 'Catalogue Produits - MEM\'S',
    meta: [
        { name: 'description', content: 'Découvrez l\'ensemble des vêtements et accessoires MEM\'S.' }
    ]
})
</script>

<style scoped>
.products-page {
    background: #F5F2EC;
    min-height: 100vh;
}

/* Page Hero */
.page-hero {
    position: relative;
    height: 300px;
    background: linear-gradient(135deg, #0E3A34 0%, #0B0B0B 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #F5F2EC;
    margin-bottom: 3rem;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(201, 164, 108, 0.15) 0%, transparent 70%);
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 0 1.5rem;
}

.hero-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    color: #C9A46C;
    margin-bottom: 1rem;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.hero-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    color: #F5F2EC;
    font-weight: 300;
}

/* Page Content */
.page-content {
    padding-bottom: 5rem;
}

.content-wrapper {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2.5rem;
    align-items: start;
}

/* Sidebar Filters */
.filters-sidebar {
    position: sticky;
    top: 100px;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 1.75rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(201, 164, 108, 0.2);
    overflow: hidden;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
}

.breadcrumb-link {
    color: #666;
    text-decoration: none;
    transition: color 0.3s ease;
}

.breadcrumb-link:hover {
    color: #C9A46C;
}

.breadcrumb-separator {
    color: #999;
}

.breadcrumb-current {
    color: #0E3A34;
    font-weight: 600;
}

.sidebar-header {
    margin-bottom: 1.5rem;
}

.sidebar-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0E3A34;
    margin-bottom: 0.5rem;
}

.sidebar-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #0E3A34;
    margin-bottom: 0.75rem;
}

.title-underline {
    width: 40px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
}

.categories-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.category-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #2A2A2A;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-link i {
    font-size: 0.8rem;
    color: #C9A46C;
    transition: transform 0.3s ease;
}

.category-link:hover {
    background: rgba(201, 164, 108, 0.1);
    color: #0E3A34;
}

.category-link:hover i {
    transform: translateX(3px);
}

.category-link.active {
    background: #0E3A34;
    color: #F5F2EC;
}

.category-link.active i {
    color: #C9A46C;
}

.custom-select {
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 8px;
    padding: 0.6rem 1rem;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9rem;
    color: #0E3A34;
}

.custom-select:focus {
    border-color: #C9A46C;
    box-shadow: 0 0 0 0.25rem rgba(201, 164, 108, 0.25);
}

/* Products Main */
.category-preview {
    position: relative;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(201, 164, 108, 0.2);
    overflow: hidden;
}

.section-header {
    margin-bottom: 2rem;
}

.section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: #0E3A34;
    margin-bottom: 0.5rem;
}

.section-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.95rem;
    color: #666;
    margin-top: 0.5rem;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 2rem;
}

.loading-container {
    text-align: center;
    padding: 4rem 1rem;
    color: #0E3A34;
}

.text-gold {
    color: #C9A46C !important;
}

.empty-state {
    text-align: center;
    padding: 4rem 1rem;
    color: #666;
}

.empty-state i {
    font-size: 3.5rem;
    color: #C9A46C;
    margin-bottom: 1rem;
    display: block;
}

.empty-state p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}

.btn-reset {
    background: #0E3A34;
    color: #F5F2EC;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
}

.btn-reset:hover {
    background: #C9A46C;
    color: #0B0B0B;
}

/* Responsive */
@media (max-width: 991px) {
    .content-wrapper {
        grid-template-columns: 1fr;
    }

    .filters-sidebar {
        display: none;
    }

    .hero-title {
        font-size: 2.25rem;
    }
}
</style>
