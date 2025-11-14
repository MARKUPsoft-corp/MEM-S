<template>
  <div class="lins-page">
    <!-- Hero Banner -->
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Collection Lins</h1>
        <p class="hero-subtitle">Naturel & Élégant</p>
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
              <span class="breadcrumb-current">Lins</span>
            </nav>

            <div class="sidebar-header">
              <h3 class="sidebar-title">Catégories</h3>
              <div class="title-underline"></div>
            </div>
            <nav class="categories-nav">
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
            <div id="chemises">
              <ChemisesPreview @view-all="openChemisesOverlay" />
            </div>

            <div id="pantalons">
              <PantalonsPreview @view-all="openPantalonsOverlay" />
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
import ChemisesPreview from '../components/lins/ChemisesPreview.vue'
import PantalonsPreview from '../components/lins/PantalonsPreview.vue'
import CategoryOverlay from '../components/lins/CategoryOverlay.vue'

const overlayOpen = ref(false)
const overlayTitle = ref('')
const overlayProducts = ref<any[]>([])

const route = useRoute()

const chemisesProducts = [
  { id: 1, name: 'Chemise Lin Blanc', slug: 'chemise-lin-blanc', price: 22000, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 2, name: 'Chemise Lin Beige', slug: 'chemise-lin-beige', price: 20000, images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80'] },
  { id: 3, name: 'Chemise Lin Bleu Ciel', slug: 'chemise-lin-bleu-ciel', price: 21000, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
  { id: 4, name: 'Chemise Lin Gris', slug: 'chemise-lin-gris', price: 19000, images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&q=80'] },
  { id: 5, name: 'Chemise Lin Vert', slug: 'chemise-lin-vert', price: 23000, images: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 6, name: 'Chemise Lin Rose', slug: 'chemise-lin-rose', price: 20500, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=750&fit=crop&q=80'] }
]

const pantalonsProducts = [
  { id: 1, name: 'Pantalon Lin Beige', slug: 'pantalon-lin-beige', price: 25000, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 2, name: 'Pantalon Lin Blanc', slug: 'pantalon-lin-blanc', price: 24000, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'] },
  { id: 3, name: 'Pantalon Lin Bleu Marine', slug: 'pantalon-lin-bleu-marine', price: 26000, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'], badge: { type: 'new', text: 'NOUVEAU' } },
  { id: 4, name: 'Pantalon Lin Gris', slug: 'pantalon-lin-gris', price: 23000, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'] },
  { id: 5, name: 'Pantalon Lin Kaki', slug: 'pantalon-lin-kaki', price: 27000, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop&q=80'], badge: { type: 'featured', text: 'VEDETTE' } },
  { id: 6, name: 'Pantalon Lin Noir', slug: 'pantalon-lin-noir', price: 24500, images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&q=80'] }
]

function openChemisesOverlay() {
  overlayTitle.value = 'Chemises en Lin'
  overlayProducts.value = chemisesProducts
  overlayOpen.value = true
}

function openPantalonsOverlay() {
  overlayTitle.value = 'Pantalons en Lin'
  overlayProducts.value = pantalonsProducts
  overlayOpen.value = true
}

function closeOverlay() {
  overlayOpen.value = false
}

function scrollToCategory(categoryId: string) {
  const element = document.getElementById(categoryId)
  if (element) {
    const yOffset = -20
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

function openOverlayFromUrl() {
  const category = route.query.category as string
  if (category) {
    switch (category) {
      case 'chemises':
        openChemisesOverlay()
        break
      case 'pantalons':
        openPantalonsOverlay()
        break
    }
  }
}

onMounted(() => {
  openOverlayFromUrl()
})

watch(() => route.query.category, () => {
  openOverlayFromUrl()
})

useHead({
  title: 'Collection Lins - MEM\'S',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection de vêtements en lin naturel : chemises, pantalons, robes et ensembles pour hommes et femmes.'
    }
  ]
})
</script>

<style scoped>
.page-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1920&h=600&fit=crop&q=80');
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
