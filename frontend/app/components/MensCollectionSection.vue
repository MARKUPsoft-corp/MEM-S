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

// Sous-catégories hommes
const subcategories = [
    { id: 'boubou', name: 'Boubou', link: '/men?category=boubou' },
    { id: 'gandoura', name: 'Gandoura', link: '/men?category=gandoura' },
    { id: 'costumes', name: 'Costumes', link: '/men?category=costumes' },
    { id: 'chemise', name: 'Chemise', link: '/men?category=chemise' },
    { id: 'pantalon', name: 'Pantalon', link: '/men?category=pantalon' }
]

const activeSubcategory = ref('boubou')

// Données de produits (à remplacer par des données réelles depuis une API)
const products = ref([
    // Boubou
    {
        id: 1,
        name: 'Boubou Traditionnel Blanc',
        slug: 'boubou-traditionnel-blanc',
        price: 35000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'boubou',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 2,
        name: 'Boubou Brodé Ivoire',
        slug: 'boubou-brode-ivoire',
        price: 42000,
        images: [
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'boubou'
    },
    {
        id: 3,
        name: 'Boubou Royal Noir',
        slug: 'boubou-royal-noir',
        price: 38000,
        images: [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'boubou'
    },
    {
        id: 16,
        name: 'Boubou Premium Bleu',
        slug: 'boubou-premium-bleu',
        price: 45000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'boubou',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 21,
        name: 'Boubou Élégant Marron',
        slug: 'boubou-elegant-marron',
        price: 40000,
        images: [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'boubou'
    },
    {
        id: 22,
        name: 'Boubou Moderne Gris',
        slug: 'boubou-moderne-gris',
        price: 37000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'boubou'
    },
    // Gandoura
    {
        id: 4,
        name: 'Gandoura Élégante Beige',
        slug: 'gandoura-elegante-beige',
        price: 32000,
        images: [
            'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'gandoura',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 5,
        name: 'Gandoura Moderne Grise',
        slug: 'gandoura-moderne-grise',
        price: 30000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'gandoura'
    },
    {
        id: 6,
        name: 'Gandoura Classique Blanche',
        slug: 'gandoura-classique-blanche',
        price: 28000,
        images: [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'gandoura'
    },
    {
        id: 17,
        name: 'Gandoura Luxe Marron',
        slug: 'gandoura-luxe-marron',
        price: 35000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'gandoura',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 23,
        name: 'Gandoura Premium Noire',
        slug: 'gandoura-premium-noire',
        price: 33000,
        images: [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'gandoura'
    },
    {
        id: 24,
        name: 'Gandoura Chic Bleue',
        slug: 'gandoura-chic-bleue',
        price: 31000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'gandoura'
    },
    // Costumes
    {
        id: 7,
        name: 'Costume 3 Pièces Marine',
        slug: 'costume-3-pieces-marine',
        price: 55000,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'costumes',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 8,
        name: 'Costume Slim Noir',
        slug: 'costume-slim-noir',
        price: 52000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'costumes'
    },
    {
        id: 9,
        name: 'Costume Africain Moderne',
        slug: 'costume-africain-moderne',
        price: 58000,
        images: [
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'costumes'
    },
    {
        id: 18,
        name: 'Costume Élégant Gris',
        slug: 'costume-elegant-gris',
        price: 60000,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'costumes',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 25,
        name: 'Costume Classique Beige',
        slug: 'costume-classique-beige',
        price: 56000,
        images: [
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'costumes'
    },
    {
        id: 26,
        name: 'Costume Premium Bleu',
        slug: 'costume-premium-bleu',
        price: 62000,
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'costumes'
    },
    // Chemise
    {
        id: 10,
        name: 'Chemise Brodée Blanche',
        slug: 'chemise-brodee-blanche',
        price: 18000,
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'chemise',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 11,
        name: 'Chemise Africaine Bleue',
        slug: 'chemise-africaine-bleue',
        price: 16000,
        images: [
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'chemise'
    },
    {
        id: 12,
        name: 'Chemise Casual Beige',
        slug: 'chemise-casual-beige',
        price: 15000,
        images: [
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'chemise'
    },
    {
        id: 19,
        name: 'Chemise Élégante Noire',
        slug: 'chemise-elegante-noire',
        price: 19000,
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'chemise',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 27,
        name: 'Chemise Lin Grise',
        slug: 'chemise-lin-grise',
        price: 17000,
        images: [
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'chemise'
    },
    {
        id: 28,
        name: 'Chemise Moderne Verte',
        slug: 'chemise-moderne-verte',
        price: 16500,
        images: [
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'chemise'
    },
    // Pantalon
    {
        id: 13,
        name: 'Pantalon Chino Beige',
        slug: 'pantalon-chino-beige',
        price: 22000,
        images: [
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'pantalon'
    },
    {
        id: 14,
        name: 'Pantalon Africain Noir',
        slug: 'pantalon-africain-noir',
        price: 25000,
        images: [
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'pantalon',
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 15,
        name: 'Pantalon Slim Marine',
        slug: 'pantalon-slim-marine',
        price: 20000,
        images: [
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'pantalon'
    },
    {
        id: 20,
        name: 'Pantalon Cargo Kaki',
        slug: 'pantalon-cargo-kaki',
        price: 24000,
        images: [
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'pantalon',
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 29,
        name: 'Pantalon Élégant Gris',
        slug: 'pantalon-elegant-gris',
        price: 23000,
        images: [
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'pantalon'
    },
    {
        id: 30,
        name: 'Pantalon Moderne Blanc',
        slug: 'pantalon-moderne-blanc',
        price: 21000,
        images: [
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'
        ],
        subcategory: 'pantalon'
    }
])

// Filtrage des produits par sous-catégorie
const filteredProducts = computed(() => {
    return products.value.filter(product => product.subcategory === activeSubcategory.value)
})

// Lien de la sous-catégorie active
const currentSubcategoryLink = computed(() => {
    const subcategory = subcategories.find(sub => sub.id === activeSubcategory.value)
    return subcategory ? subcategory.link : '/men'
})

const selectSubcategory = (subcategoryId) => {
    activeSubcategory.value = subcategoryId
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
