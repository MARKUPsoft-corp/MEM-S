<template>
    <section class="categories-section">
        <AfricanPatternBackground opacity="light" color="gold" />
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Nos Collections</h2>
                <div class="title-underline"></div>
                <p class="section-subtitle">Découvrez nos collections d'inspiration africaine</p>
            </div>
            <div class="categories-grid">
                <NuxtLink v-for="collection in collections" :key="collection.id" :to="`/${collection.slug}`" class="category-card">
                    <div class="category-image">
                        <img :src="collection.image || getDefaultImage(collection.slug)" :alt="collection.name" />
                        <div class="category-overlay"></div>
                    </div>
                    <h3 class="category-title">{{ collection.name.toUpperCase() }}</h3>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductsStore } from '../../stores/products'
import { INITIAL_COLLECTIONS } from '../../data/productsData'
import type { Collection } from '../../types/product'

const productsStore = useProductsStore()

// Toujours avoir les 4 collections prêtes immédiatement (SSR + CSR)
const collections = computed<Collection[]>(() => {
    if (productsStore.collections && productsStore.collections.length > 0) {
        return productsStore.collections
    }
    return INITIAL_COLLECTIONS
})

onMounted(async () => {
    try {
        await productsStore.fetchCollections()
    } catch (error) {
        console.error('Error loading collections:', error)
    }
})

// Images par défaut si l'API ne fournit pas d'image
const getDefaultImage = (slug: string) => {
    const defaultImages: Record<string, string> = {
        'men': 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=600&fit=crop&q=80',
        'women': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop&q=80',
        'babouches': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop&q=80',
        'lins': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop&q=80'
    }
    return defaultImages[slug] || 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=600&fit=crop&q=80'
}
</script>

<style scoped>
.categories-section {
    padding: 3rem 0;
    background: #F5F2EC;
    position: relative;
    overflow: hidden;
}

.categories-section::before {
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
    z-index: 1;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    position: relative;
    z-index: 2;
}

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

/* Grille alignée sur UNE SEULE LIGNE de 4 collections */
.categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    width: 100%;
}

.category-card {
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    text-decoration: none;
    display: block;
    aspect-ratio: 1;
    cursor: pointer;
}

.category-image {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.category-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.category-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom,
            rgba(11, 11, 11, 0.1) 0%,
            rgba(11, 11, 11, 0.4) 100%);
    transition: background 0.3s ease;
}

.category-card:hover .category-image img {
    transform: scale(1.05);
}

.category-card:hover .category-overlay {
    background: linear-gradient(to bottom,
            rgba(11, 11, 11, 0.2) 0%,
            rgba(11, 11, 11, 0.5) 100%);
}

.category-title {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    color: #F5F2EC;
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
    z-index: 2;
    transition: color 0.3s ease;
}

.category-card:hover .category-title {
    color: #C9A46C;
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
    .categories-section {
        padding: 3rem 0;
    }

    .categories-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }

    .category-title {
        font-size: 1.25rem;
        bottom: 1.25rem;
        left: 1.25rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .categories-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 1.75rem;
    }

    .category-title {
        font-size: 1.5rem;
    }
}

/* Mobile */
@media (max-width: 767px) {
    .categories-section {
        padding: 2rem 0;
    }

    .container {
        padding: 0 1rem;
    }

    .section-header {
        margin-bottom: 2rem;
    }

    .section-title {
        font-size: 1.75rem;
    }

    .section-subtitle {
        font-size: 0.875rem;
    }

    /* Sur mobile : défilement fluide horizontal sur une seule ligne (pas d'empilement vertical) */
    .categories-grid {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        gap: 1rem;
        padding-bottom: 0.75rem;
        scrollbar-width: none;
    }

    .categories-grid::-webkit-scrollbar {
        display: none;
    }

    .category-card {
        flex: 0 0 72%;
        max-width: 270px;
        min-width: 190px;
        scroll-snap-align: start;
        aspect-ratio: 1;
    }

    .category-title {
        font-size: 1.15rem;
        bottom: 1.25rem;
        left: 1.25rem;
        letter-spacing: 1.2px;
    }
}
</style>
