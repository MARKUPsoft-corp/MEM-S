<template>
  <div class="babouches-page">
    <!-- Hero Banner -->
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Collection Babouches</h1>
        <p class="hero-subtitle">Élégance traditionnelle</p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Sidebar Filters (Desktop) -->
          <aside class="filters-sidebar">
            <!-- Breadcrumb -->
            <nav class="breadcrumb">
              <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">Babouches</span>
            </nav>

            <div class="sidebar-header">
              <h3 class="sidebar-title">Catégories</h3>
              <div class="title-underline"></div>
            </div>
            <nav class="categories-nav">
              <a href="#cuir" class="category-link">
                <i class="bi bi-chevron-right"></i>
                Cuir
              </a>
              <a href="#brodes" class="category-link">
                <i class="bi bi-chevron-right"></i>
                Brodées
              </a>
            </nav>
          </aside>

          <!-- Products Grid -->
          <main class="products-main">
            <div id="cuir">
              <CuirPreview @view-all="openCuirOverlay" />
            </div>

            <div id="brodes">
              <BrodesPreview @view-all="openBrodesOverlay" />
            </div>
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
import CuirPreview from '../components/babouches/CuirPreview.vue'
import BrodesPreview from '../components/babouches/BrodesPreview.vue'
import CategoryOverlay from '../components/babouches/CategoryOverlay.vue'

const overlayOpen = ref(false)
const overlayTitle = ref('')
const overlayProducts = ref<any[]>([])

const cuirProducts = [
  { id: 1, name: 'Babouches Cuir Premium', slug: 'babouches-cuir-premium', price: 20000, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 2, name: 'Babouches Cuir Marron', slug: 'babouches-cuir-marron', price: 18000, images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'] },
  { id: 3, name: 'Babouches Cuir Noir', slug: 'babouches-cuir-noir', price: 19000, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
  { id: 4, name: 'Babouches Cuir Beige', slug: 'babouches-cuir-beige', price: 17000, images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'] },
  { id: 5, name: 'Babouches Cuir Rouge', slug: 'babouches-cuir-rouge', price: 21000, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 6, name: 'Babouches Cuir Bleu', slug: 'babouches-cuir-bleu', price: 18500, images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'] }
]

const brodesProducts = [
  { id: 1, name: 'Babouches Brodées Or', slug: 'babouches-brodees-or', price: 25000, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 2, name: 'Babouches Brodées Argent', slug: 'babouches-brodees-argent', price: 24000, images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'] },
  { id: 3, name: 'Babouches Brodées Multicolores', slug: 'babouches-brodees-multicolores', price: 26000, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
  { id: 4, name: 'Babouches Brodées Traditionnelles', slug: 'babouches-brodees-traditionnelles', price: 23000, images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'] },
  { id: 5, name: 'Babouches Brodées Luxe', slug: 'babouches-brodees-luxe', price: 28000, images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 6, name: 'Babouches Brodées Élégantes', slug: 'babouches-brodees-elegantes', price: 24500, images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=750&fit=crop&q=80'] }
]

function openCuirOverlay() {
  overlayTitle.value = 'Babouches en Cuir'
  overlayProducts.value = cuirProducts
  overlayOpen.value = true
}

function openBrodesOverlay() {
  overlayTitle.value = 'Babouches Brodées'
  overlayProducts.value = brodesProducts
  overlayOpen.value = true
}

function closeOverlay() {
  overlayOpen.value = false
}

useHead({
  title: 'Collection Babouches - MEM\'S',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection de babouches artisanales en cuir : élégance traditionnelle et confort moderne.'
    }
  ]
})
</script>

<style scoped>
.page-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1920&h=600&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
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

.filters-sidebar {
  background: #F5F2EC;
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid rgba(201, 164, 108, 0.3);
  height: fit-content;
  position: sticky;
  top: 120px;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-link {
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

.products-main {
  background: transparent;
  padding: 0;
  min-height: 500px;
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }

  .content-wrapper {
    grid-template-columns: 240px 1fr;
    gap: 2rem;
  }
}

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
    position: static;
    padding: 1.5rem;
  }

  .products-main {
    padding: 0;
  }
}
</style>
