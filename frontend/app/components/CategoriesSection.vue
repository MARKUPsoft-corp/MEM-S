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
                <NuxtLink v-for="category in categories" :key="category.id" :to="category.link" class="category-card">
                    <div class="category-image">
                        <img :src="category.image" :alt="category.title" />
                        <div class="category-overlay"></div>
                    </div>
                    <h3 class="category-title">{{ category.title }}</h3>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Category {
    id: string
    title: string
    image: string
    link: string
}

const categories: Category[] = [
    {
        id: 'men',
        title: 'Hommes',
        image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&h=600&fit=crop&q=80',
        link: '/men'
    },
    {
        id: 'women',
        title: 'Femmes',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop&q=80',
        link: '/women'
    },
    {
        id: 'babouches',
        title: 'Babouches',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop&q=80',
        link: '/babouches'
    },
    {
        id: 'lins',
        title: 'Lins',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop&q=80',
        link: '/lins'
    }
]
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
    margin-bottom: 4rem;
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

.categories-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
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
    font-size: 1.75rem;
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
        padding: 4rem 0;
    }

    .categories-grid {
        gap: 1.5rem;
    }

    .category-title {
        font-size: 1.5rem;
        bottom: 1.5rem;
        left: 1.5rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .categories-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
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
        margin-bottom: 2.5rem;
    }

    .section-title {
        font-size: 2rem;
    }

    .section-subtitle {
        font-size: 0.9375rem;
    }

    .categories-grid {
        gap: 1.5rem;
    }

    .category-title {
        font-size: 1.25rem;
        bottom: 1.5rem;
        left: 1.5rem;
        letter-spacing: 1.5px;
    }
}
</style>
