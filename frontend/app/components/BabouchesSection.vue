<template>
    <section class="babouches-section">
        <AfricanPatternBackground opacity="light" color="gold" />
        <div class="container">
            <!-- Section Title -->
            <div class="section-header">
                <h2 class="section-title">Babouches en Vedette</h2>
                <div class="title-underline"></div>
                <p class="section-subtitle">Élégance traditionnelle</p>
            </div>

            <!-- Products Grid -->
            <div class="products-grid">
                <ProductCard v-for="product in products" :key="product.id" :product="product" />
            </div>

            <!-- View All Button -->
            <div class="view-all-container">
                <NuxtLink to="/babouches" class="btn-view-all">
                    Découvrir la collection
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import ProductCard from './ProductCard.vue'

// Données de produits babouches (à remplacer par des données réelles depuis une API)
const products = ref([
    {
        id: 1,
        name: 'Babouches Cuir Marron',
        slug: 'babouches-cuir-marron',
        price: 15000,
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
        ],
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 2,
        name: 'Babouches Traditionnelles Beige',
        slug: 'babouches-traditionnelles-beige',
        price: 12000,
        images: [
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'
        ],
        badge: { type: 'new', text: 'NOUVEAU' }
    },
    {
        id: 3,
        name: 'Babouches Brodées Noir',
        slug: 'babouches-brodees-noir',
        price: 18000,
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
        ]
    },
    {
        id: 4,
        name: 'Babouches Premium Rouge',
        slug: 'babouches-premium-rouge',
        price: 20000,
        images: [
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'
        ],
        badge: { type: 'featured', text: 'VEDETTE' }
    },
    {
        id: 5,
        name: 'Babouches Élégantes Bleues',
        slug: 'babouches-elegantes-bleues',
        price: 16000,
        images: [
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'
        ]
    },
    {
        id: 6,
        name: 'Babouches Artisanales Vertes',
        slug: 'babouches-artisanales-vertes',
        price: 14000,
        images: [
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'
        ],
        badge: { type: 'new', text: 'NOUVEAU' }
    }
])
</script>

<style scoped>
.babouches-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
    overflow: hidden;
}

.babouches-section::before {
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
