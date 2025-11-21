<template>
    <div class="men-page">
        <!-- Hero Banner -->
        <section class="page-hero">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">Collection Hommes</h1>
                <p class="hero-subtitle">Élégance et tradition africaine</p>
            </div>
        </section>

        <!-- Main Content -->
        <div class="page-content">
            <div class="container">
                <!-- Filters & Products will be added here as components -->
                <div class="content-wrapper">
                    <!-- Sidebar Filters (Desktop) -->
                    <aside class="filters-sidebar">
                        <!-- African Pattern Background -->
                        <AfricanPatternBackground opacity="light" color="gold" />

                        <!-- Breadcrumb -->
                        <nav class="breadcrumb">
                            <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
                            <span class="breadcrumb-separator">/</span>
                            <span class="breadcrumb-current">Hommes</span>
                        </nav>

                        <div class="sidebar-header">
                            <h3 class="sidebar-title">Catégories</h3>
                            <div class="title-underline"></div>
                        </div>
                        <nav class="categories-nav">
                            <a href="#boubous" @click.prevent="scrollToCategory('boubous')" class="category-link">
                                <i class="bi bi-chevron-right"></i>
                                Boubous
                            </a>
                            <a href="#gandouras" @click.prevent="scrollToCategory('gandouras')" class="category-link">
                                <i class="bi bi-chevron-right"></i>
                                Gandouras
                            </a>
                            <a href="#costumes" @click.prevent="scrollToCategory('costumes')" class="category-link">
                                <i class="bi bi-chevron-right"></i>
                                Costumes
                            </a>
                            <a href="#chemises" @click.prevent="scrollToCategory('chemises')" class="category-link">
                                <i class="bi bi-chevron-right"></i>
                                Chemises
                            </a>
                            <a href="#pantalons" @click.prevent="scrollToCategory('pantalons')" class="category-link">
                                <i class="bi bi-chevron-right"></i>
                                Pantalons
                            </a>
                        </nav>
                    </aside>

                    <!-- Products Grid -->
                    <main class="products-main">
                        <!-- Boubou Preview -->
                        <div id="boubous">
                            <BoubouPreview :products="boubouProducts" @view-all="openBoubouOverlay" />
                        </div>

                        <!-- Gandoura Preview -->
                        <div id="gandouras">
                            <GandouraPreview :products="gandouraProducts" @view-all="openGandouraOverlay" />
                        </div>

                        <!-- Costumes Preview -->
                        <div id="costumes">
                            <CostumesPreview :products="costumesProducts" @view-all="openCostumesOverlay" />
                        </div>

                        <!-- Chemise Preview -->
                        <div id="chemises">
                            <ChemisePreview :products="chemiseProducts" @view-all="openChemiseOverlay" />
                        </div>

                        <!-- Pantalon Preview -->
                        <div id="pantalons">
                            <PantalonPreview :products="pantalonProducts" @view-all="openPantalonOverlay" />
                        </div>
                    </main>
                </div>
            </div>
        </div>

        <!-- Category Overlay -->
        <CategoryOverlay :is-open="overlayOpen" :title="overlayTitle" :products="overlayProducts"
            @close="closeOverlay" />

        <!-- Mobile Filter Button -->
        <FilterButton @open="filterPopupOpen = true" />

        <!-- Mobile Filter Popup -->
        <FilterPopup :is-open="filterPopupOpen" :categories="filterCategories" v-model="activeMobileCategory"
            @close="filterPopupOpen = false" />
    </div>
</template>

<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'
import BoubouPreview from '../components/men/BoubouPreview.vue'
import GandouraPreview from '../components/men/GandouraPreview.vue'
import CostumesPreview from '../components/men/CostumesPreview.vue'
import ChemisePreview from '../components/men/ChemisePreview.vue'
import PantalonPreview from '../components/men/PantalonPreview.vue'
import CategoryOverlay from '../components/men/CategoryOverlay.vue'
import FilterButton from '../components/FilterButton.vue'
import FilterPopup from '../components/FilterPopup.vue'

// Charger les produits depuis l'API
const { fetchProducts } = useProducts()
const allProducts = ref<any[]>([])

// Overlay state
const overlayOpen = ref(false)
const overlayTitle = ref('')
const overlayProducts = ref<any[]>([])

// Filter popup state
const filterPopupOpen = ref(false)

// Categories for filter popup
const filterCategories = [
    { id: 'boubous', label: 'Boubous' },
    { id: 'gandouras', label: 'Gandouras' },
    { id: 'costumes', label: 'Costumes' },
    { id: 'chemises', label: 'Chemises' },
    { id: 'pantalons', label: 'Pantalons' }
]

// Active category for mobile filter
const activeMobileCategory = ref('')

// Get route for URL parameters
const route = useRoute()

// Produits groupés par catégorie
const boubouProducts = computed(() => allProducts.value.filter(p => p.category.slug === 'boubous'))
const gandouraProducts = computed(() => allProducts.value.filter(p => p.category.slug === 'gandouras'))
const costumesProducts = computed(() => allProducts.value.filter(p => p.category.slug === 'costumes'))
const chemiseProducts = computed(() => allProducts.value.filter(p => p.category.slug === 'chemises'))
const pantalonProducts = computed(() => allProducts.value.filter(p => p.category.slug === 'pantalons'))

// Charger les produits au montage
onMounted(async () => {
    try {
        const response = await fetchProducts({ collection: 'men' })
        // Transformer les données API pour ProductCard
        const apiProducts = response.results || []
        allProducts.value = apiProducts.map((product: any) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: parseFloat(product.price),
            originalPrice: product.discount_price ? parseFloat(product.price) : null,
            images: product.images?.map((img: any) => img.image) || [],
            badge: product.is_featured 
                ? { type: 'featured', text: 'VEDETTE' }
                : product.is_new 
                ? { type: 'new', text: 'NOUVEAU' }
                : null,
            category: product.category
        }))
    } catch (error) {
        console.error('Error loading men products:', error)
        allProducts.value = []
    }
})

// Open overlay functions
function openBoubouOverlay() {
    overlayTitle.value = 'Boubous'
    overlayProducts.value = boubouProducts.value
    overlayOpen.value = true
}

function openGandouraOverlay() {
    overlayTitle.value = 'Gandouras'
    overlayProducts.value = gandouraProducts.value
    overlayOpen.value = true
}

function openCostumesOverlay() {
    overlayTitle.value = 'Costumes'
    overlayProducts.value = costumesProducts.value
    overlayOpen.value = true
}

function openChemiseOverlay() {
    overlayTitle.value = 'Chemises'
    overlayProducts.value = chemiseProducts.value
    overlayOpen.value = true
}

function openPantalonOverlay() {
    overlayTitle.value = 'Pantalons'
    overlayProducts.value = pantalonProducts.value
    overlayOpen.value = true
}

// Close overlay
function closeOverlay() {
    overlayOpen.value = false
}

// Smooth scroll to category
function scrollToCategory(categoryId: string) {
    const element = document.getElementById(categoryId)
    if (element) {
        const yOffset = -20 // Offset pour positionner juste au-dessus de la box
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
    }
}

// Handle mobile filter selection
watch(activeMobileCategory, (newCategory) => {
    if (newCategory) {
        scrollToCategory(newCategory)
        activeMobileCategory.value = '' // Reset after scroll
    }
})

// Open overlay based on category parameter
function openOverlayFromUrl() {
    const category = route.query.category as string
    if (category) {
        switch (category) {
            case 'boubous':
                openBoubouOverlay()
                break
            case 'gandouras':
                openGandouraOverlay()
                break
            case 'costumes':
                openCostumesOverlay()
                break
            case 'chemises':
                openChemiseOverlay()
                break
            case 'pantalons':
                openPantalonOverlay()
                break
        }
    }
}

// Check URL on mount
onMounted(() => {
    openOverlayFromUrl()
})

// Watch for route changes
watch(() => route.query.category, () => {
    openOverlayFromUrl()
})

// Page metadata
useHead({
    title: 'Collection Hommes - MEM\'S',
    meta: [
        {
            name: 'description',
            content: 'Découvrez notre collection de vêtements pour hommes : boubous, gandouras, costumes, chemises et pantalons d\'inspiration africaine.'
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
    background-image: url('https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=1920&h=600&fit=crop&q=80');
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
}

.category-link i {
    font-size: 0.75rem;
    color: #C9A46C;
    transition: transform 0.3s ease;
}

.category-link:hover {
    background: #0E3A34;
    border-color: #C9A46C;
    color: #C9A46C;
    transform: translateX(4px);
}

.category-link:hover i {
    transform: translateX(4px);
    color: #C9A46C;
}

/* Products Main */
.products-main {
    background: transparent;
    padding: 0;
    min-height: 500px;
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
}
</style>
