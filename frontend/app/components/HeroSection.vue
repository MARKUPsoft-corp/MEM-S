<template>
    <section class="hero-section" role="region" aria-label="Hero carousel">
        <div class="hero-carousel">
            <!-- Slides -->
            <div v-for="(slide, index) in slides" :key="slide.id" class="hero-slide"
                :class="{ 'hero-slide--active': index === currentSlide }"
                :style="{ backgroundImage: `url(${slide.image})` }">
                <div class="hero-overlay"></div>
                <div class="hero-content">
                    <h1 class="hero-title">{{ slide.title }}</h1>
                    <p class="hero-price">{{ slide.price }}</p>
                    <NuxtLink :to="slide.link" class="hero-cta">
                        Acheter Maintenant
                    </NuxtLink>
                </div>
            </div>

            <!-- Navigation Arrows -->
            <button class="hero-arrow hero-arrow--prev" @click="prevSlide" aria-label="Slide précédent">
                <i class="bi bi-chevron-left"></i>
            </button>
            <button class="hero-arrow hero-arrow--next" @click="nextSlide" aria-label="Slide suivant">
                <i class="bi bi-chevron-right"></i>
            </button>

            <!-- Pagination Dots -->
            <div class="hero-pagination">
                <button v-for="(slide, index) in slides" :key="`dot-${slide.id}`" class="hero-dot"
                    :class="{ 'hero-dot--active': index === currentSlide }" @click="goToSlide(index)"
                    :aria-label="`Aller au slide ${index + 1}`"></button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Slide {
    id: number
    title: string
    price: string
    image: string
    link: string
}

const currentSlide = ref(0)
const autoPlayInterval = ref<NodeJS.Timeout | null>(null)

const slides = ref<Slide[]>([
    {
        id: 1,
        title: 'ALKEBU-LAN',
        price: '2100 FCFA',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=80',
        link: '/products'
    },
    {
        id: 2,
        title: 'COLLECTION PRINTEMPS',
        price: '1500 FCFA',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=80',
        link: '/products'
    },
    {
        id: 3,
        title: 'NOUVEAUTÉS',
        price: '1800 FCFA',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop&q=80',
        link: '/products'
    }
])

function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
    resetAutoPlay()
}

function prevSlide() {
    currentSlide.value = currentSlide.value === 0
        ? slides.value.length - 1
        : currentSlide.value - 1
    resetAutoPlay()
}

function goToSlide(index: number) {
    currentSlide.value = index
    resetAutoPlay()
}

function startAutoPlay() {
    autoPlayInterval.value = setInterval(() => {
        nextSlide()
    }, 5000)
}

function stopAutoPlay() {
    if (autoPlayInterval.value) {
        clearInterval(autoPlayInterval.value)
        autoPlayInterval.value = null
    }
}

function resetAutoPlay() {
    stopAutoPlay()
    startAutoPlay()
}

onMounted(() => {
    startAutoPlay()
})

onUnmounted(() => {
    stopAutoPlay()
})
</script>

<style scoped>
.hero-section {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.hero-carousel {
    position: relative;
    width: 100%;
    height: 100%;
}

.hero-slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0;
    transition: opacity 500ms ease-in-out;
    pointer-events: none;
}

.hero-slide--active {
    opacity: 1;
    pointer-events: auto;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,
            rgba(11, 11, 11, 0.6) 0%,
            rgba(11, 11, 11, 0.3) 50%,
            rgba(11, 11, 11, 0.1) 100%);
    z-index: 1;
}

.hero-content {
    position: absolute;
    top: 50%;
    left: 15%;
    transform: translateY(-50%);
    z-index: 2;
    max-width: 600px;
}

.hero-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: #F5F2EC;
    line-height: 1.1;
    margin: 0 0 0.75rem 0;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.hero-price {
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #C9A46C;
    margin: 0 0 1.5rem 0;
    letter-spacing: 1px;
}

.hero-cta {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: #C9A46C;
    color: #0B0B0B;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.hero-cta:hover {
    background: #0B0B0B;
    color: #C9A46C;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(201, 164, 108, 0.4);
}

.hero-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    width: 50px;
    height: 50px;
    background: rgba(201, 164, 108, 0.3);
    border: 1px solid rgba(201, 164, 108, 0.6);
    border-radius: 50%;
    color: #F5F2EC;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.hero-arrow:hover {
    background: rgba(201, 164, 108, 0.8);
    transform: translateY(-50%) scale(1.1);
}

.hero-arrow--prev {
    left: 2rem;
}

.hero-arrow--next {
    right: 2rem;
}

.hero-pagination {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.hero-dot {
    width: 12px;
    height: 12px;
    background: rgba(201, 164, 108, 0.5);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
}

.hero-dot:hover {
    background: rgba(201, 164, 108, 0.8);
    transform: scale(1.2);
}

.hero-dot--active {
    background: #C9A46C;
    width: 32px;
    border-radius: 6px;
}

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) {
    .hero-content {
        left: 10%;
    }

    .hero-title {
        font-size: 3rem;
    }

    .hero-price {
        font-size: 1.75rem;
    }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
    .hero-content {
        left: 1.5rem;
        right: 1.5rem;
        max-width: none;
    }

    .hero-title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .hero-price {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
    }

    .hero-cta {
        padding: 0.875rem 2rem;
        font-size: 0.8125rem;
    }

    /* Cacher les flèches sur mobile (écran tactile) */
    .hero-arrow {
        display: none;
    }

    .hero-pagination {
        bottom: 1.5rem;
    }

    .hero-dot {
        width: 10px;
        height: 10px;
    }

    .hero-dot--active {
        width: 24px;
    }
}
</style>
