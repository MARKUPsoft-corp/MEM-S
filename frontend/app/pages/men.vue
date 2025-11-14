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

        <!-- Breadcrumb -->
        <div class="breadcrumb-container">
            <div class="container">
                <nav class="breadcrumb">
                    <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
                    <span class="breadcrumb-separator">/</span>
                    <span class="breadcrumb-current">Hommes</span>
                </nav>
            </div>
        </div>

        <!-- Main Content -->
        <div class="page-content">
            <div class="container">
                <!-- Filters & Products will be added here as components -->
                <div class="content-wrapper">
                    <!-- Sidebar Filters (Desktop) -->
                    <aside class="filters-sidebar">
                        <p class="placeholder-text">Filtres à venir</p>
                    </aside>

                    <!-- Products Grid -->
                    <main class="products-main">
                        <!-- Boubou Preview -->
                        <BoubouPreview @view-all="openBoubouOverlay" />

                        <!-- Gandoura Preview -->
                        <GandouraPreview @view-all="openGandouraOverlay" />

                        <!-- Costumes Preview -->
                        <CostumesPreview @view-all="openCostumesOverlay" />

                        <!-- Chemise Preview -->
                        <ChemisePreview @view-all="openChemiseOverlay" />

                        <!-- Pantalon Preview -->
                        <PantalonPreview @view-all="openPantalonOverlay" />
                    </main>
                </div>
            </div>
        </div>

        <!-- Category Overlay -->
        <CategoryOverlay :is-open="overlayOpen" :title="overlayTitle" :products="overlayProducts"
            @close="closeOverlay" />
    </div>
</template>

<script setup lang="ts">
import BoubouPreview from '../components/men/BoubouPreview.vue'
import GandouraPreview from '../components/men/GandouraPreview.vue'
import CostumesPreview from '../components/men/CostumesPreview.vue'
import ChemisePreview from '../components/men/ChemisePreview.vue'
import PantalonPreview from '../components/men/PantalonPreview.vue'
import CategoryOverlay from '../components/men/CategoryOverlay.vue'

// Overlay state
const overlayOpen = ref(false)
const overlayTitle = ref('')
const overlayProducts = ref<any[]>([])

// Boubou products (à remplacer par API)
const boubouProducts = [
    {
        id: 1,
        name: 'Boubou Traditionnel Blanc',
        slug: 'boubou-traditionnel-blanc',
        price: 35000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ],
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 2,
        name: 'Boubou Brodé Ivoire',
        slug: 'boubou-brode-ivoire',
        price: 42000,
        images: [
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'
        ]
    },
    {
        id: 3,
        name: 'Boubou Royal Noir',
        slug: 'boubou-royal-noir',
        price: 38000,
        images: [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ]
    },
    {
        id: 4,
        name: 'Boubou Premium Bleu',
        slug: 'boubou-premium-bleu',
        price: 45000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 5,
        name: 'Boubou Élégant Marron',
        slug: 'boubou-elegant-marron',
        price: 40000,
        images: [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ]
    },
    {
        id: 6,
        name: 'Boubou Moderne Gris',
        slug: 'boubou-moderne-gris',
        price: 37000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ]
    },
    {
        id: 7,
        name: 'Boubou Luxe Beige',
        slug: 'boubou-luxe-beige',
        price: 43000,
        images: [
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'
        ],
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 8,
        name: 'Boubou Classique Vert',
        slug: 'boubou-classique-vert',
        price: 36000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ]
    }
]

// Gandoura products
const gandouraProducts = [
    { id: 1, name: 'Gandoura Élégante Beige', slug: 'gandoura-elegante-beige', price: 32000, images: ['https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
    { id: 2, name: 'Gandoura Moderne Grise', slug: 'gandoura-moderne-grise', price: 30000, images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'] },
    { id: 3, name: 'Gandoura Classique Blanche', slug: 'gandoura-classique-blanche', price: 28000, images: ['https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'] },
    { id: 4, name: 'Gandoura Luxe Marron', slug: 'gandoura-luxe-marron', price: 35000, images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
    { id: 5, name: 'Gandoura Premium Noire', slug: 'gandoura-premium-noire', price: 33000, images: ['https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'] },
    { id: 6, name: 'Gandoura Chic Bleue', slug: 'gandoura-chic-bleue', price: 31000, images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'] }
]

// Costumes products
const costumesProducts = [
    { id: 1, name: 'Costume 3 Pièces Marine', slug: 'costume-3-pieces-marine', price: 55000, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
    { id: 2, name: 'Costume Slim Noir', slug: 'costume-slim-noir', price: 52000, images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'] },
    { id: 3, name: 'Costume Africain Moderne', slug: 'costume-africain-moderne', price: 58000, images: ['https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'] },
    { id: 4, name: 'Costume Élégant Gris', slug: 'costume-elegant-gris', price: 60000, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
    { id: 5, name: 'Costume Classique Beige', slug: 'costume-classique-beige', price: 56000, images: ['https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'] },
    { id: 6, name: 'Costume Premium Bleu', slug: 'costume-premium-bleu', price: 62000, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80'] }
]

// Chemise products
const chemiseProducts = [
    { id: 1, name: 'Chemise Brodée Blanche', slug: 'chemise-brodee-blanche', price: 18000, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
    { id: 2, name: 'Chemise Africaine Bleue', slug: 'chemise-africaine-bleue', price: 16000, images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80'] },
    { id: 3, name: 'Chemise Casual Beige', slug: 'chemise-casual-beige', price: 15000, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop&q=80'] },
    { id: 4, name: 'Chemise Élégante Noire', slug: 'chemise-elegante-noire', price: 19000, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
    { id: 5, name: 'Chemise Lin Grise', slug: 'chemise-lin-grise', price: 17000, images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80'] },
    { id: 6, name: 'Chemise Moderne Verte', slug: 'chemise-moderne-verte', price: 16500, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop&q=80'] }
]

// Pantalon products
const pantalonProducts = [
    { id: 1, name: 'Pantalon Chino Beige', slug: 'pantalon-chino-beige', price: 22000, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'] },
    { id: 2, name: 'Pantalon Africain Noir', slug: 'pantalon-africain-noir', price: 25000, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
    { id: 3, name: 'Pantalon Slim Marine', slug: 'pantalon-slim-marine', price: 20000, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'] },
    { id: 4, name: 'Pantalon Cargo Kaki', slug: 'pantalon-cargo-kaki', price: 24000, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
    { id: 5, name: 'Pantalon Élégant Gris', slug: 'pantalon-elegant-gris', price: 23000, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'] },
    { id: 6, name: 'Pantalon Moderne Blanc', slug: 'pantalon-moderne-blanc', price: 21000, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'] }
]

// Open overlay functions
function openBoubouOverlay() {
    overlayTitle.value = 'Boubous'
    overlayProducts.value = boubouProducts
    overlayOpen.value = true
}

function openGandouraOverlay() {
    overlayTitle.value = 'Gandouras'
    overlayProducts.value = gandouraProducts
    overlayOpen.value = true
}

function openCostumesOverlay() {
    overlayTitle.value = 'Costumes'
    overlayProducts.value = costumesProducts
    overlayOpen.value = true
}

function openChemiseOverlay() {
    overlayTitle.value = 'Chemises'
    overlayProducts.value = chemiseProducts
    overlayOpen.value = true
}

function openPantalonOverlay() {
    overlayTitle.value = 'Pantalons'
    overlayProducts.value = pantalonProducts
    overlayOpen.value = true
}

// Close overlay
function closeOverlay() {
    overlayOpen.value = false
}

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

/* Breadcrumb */
.breadcrumb-container {
    background: #F5F2EC;
    padding: 1.5rem 0;
    border-bottom: 1px solid rgba(201, 164, 108, 0.2);
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
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
    background: #FFFFFF;
    padding: 2rem;
    border-radius: 4px;
    height: fit-content;
    position: sticky;
    top: 120px;
}

/* Products Main */
.products-main {
    background: #FFFFFF;
    padding: 2rem;
    border-radius: 4px;
    min-height: 500px;
}

.placeholder-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    color: #2A2A2A;
    text-align: center;
    padding: 3rem;
    opacity: 0.6;
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

    .breadcrumb-container {
        padding: 1rem 0;
    }

    .page-content {
        padding: 2rem 0;
    }

    .content-wrapper {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .filters-sidebar {
        position: static;
        padding: 1.5rem;
    }

    .products-main {
        padding: 1.5rem;
    }
}
</style>
