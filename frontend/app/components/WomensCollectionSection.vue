<template>
    <section class="womens-collection-section">
        <div class="container">
            <!-- Section Title -->
            <div class="section-header">
                <h2 class="section-title">Collection Femmes</h2>
                <div class="title-underline"></div>
                <p class="section-subtitle">Élégance et raffinement</p>
            </div>

            <!-- Subcategory Tabs -->
            <div class="subcategory-tabs">
                <button v-for="subcategory in subcategories" :key="subcategory.id"
                    @click="selectSubcategory(subcategory.id)"
                    :class="['subcategory-tab', { active: activeSubcategory === subcategory.id }]">
                    {{ subcategory.name }}
                </button>
            </div>

            <!-- Products Grid -->
            <div class="products-grid">
                <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
            </div>

            <!-- View All Button -->
            <div class="view-all-container">
                <NuxtLink :to="currentSubcategoryLink" class="btn-view-all">
                    Voir la collection complète
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from './ProductCard.vue'

// Sous-catégories femmes
const subcategories = [
    { id: 'vetements', name: 'Vêtements', link: '/women/vetements' },
    { id: 'sacs', name: 'Sacs', link: '/women/sacs' }
]

const activeSubcategory = ref('vetements')

// Données de produits (à remplacer par des données réelles depuis une API)
const products = ref([
    // Vêtements
    {
        id: 1,
        name: 'Robe Africaine Élégante',
        price: 35000,
        images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'vetements',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 2,
        name: 'Ensemble Traditionnel Bleu',
        price: 42000,
        images: [
            'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'vetements',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 3,
        name: 'Robe Wax Moderne',
        price: 38000,
        images: [
            'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'vetements'
    },
    {
        id: 4,
        name: 'Ensemble Brodé Premium',
        price: 45000,
        images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'vetements',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 9,
        name: 'Robe Longue Wax',
        price: 40000,
        images: [
            'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'vetements'
    },
    {
        id: 10,
        name: 'Ensemble Moderne Rose',
        price: 36000,
        images: [
            'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'vetements'
    },
    // Sacs
    {
        id: 5,
        name: 'Sac à Main Cuir Marron',
        price: 25000,
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'sacs',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 6,
        name: 'Sac Traditionnel Wax',
        price: 22000,
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'sacs'
    },
    {
        id: 7,
        name: 'Sac Bandoulière Élégant',
        price: 28000,
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'sacs',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 8,
        name: 'Sac à Dos Moderne',
        price: 30000,
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'sacs',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 11,
        name: 'Sac Pochette Élégante',
        price: 18000,
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'sacs'
    },
    {
        id: 12,
        name: 'Sac Cabas Wax',
        price: 26000,
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'sacs',
        badge: { type: 'featured', text: 'VEDETTE' }
    }
])

// Filtrage des produits par sous-catégorie
const filteredProducts = computed(() => {
    return products.value.filter(product => product.subcategory === activeSubcategory.value)
})

// Lien de la sous-catégorie active
const currentSubcategoryLink = computed(() => {
    const subcategory = subcategories.find(sub => sub.id === activeSubcategory.value)
    return subcategory ? subcategory.link : '/women'
})

const selectSubcategory = (subcategoryId) => {
    activeSubcategory.value = subcategoryId
}
</script>

<style scoped>
.womens-collection-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
}

.womens-collection-section::before {
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
    color: #2A2A2A;
    margin: 0;
    opacity: 0.8;
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
