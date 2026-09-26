<template>
  <div class="women-page">
    <!-- Hero Banner -->
    <section class="page-hero" :style="heroBannerStyle">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Collection Femmes</h1>
        <p class="hero-subtitle">Élégance et raffinement</p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Sidebar Filters (Desktop) -->
          <aside class="filters-sidebar">
            <!-- African Pattern Background -->
            <AfricanPatternBackground opacity="light" color="terracotta" />
            
            <!-- Breadcrumb -->
            <nav class="breadcrumb">
              <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">Femmes</span>
            </nav>

            <div class="sidebar-header">
              <h3 class="sidebar-title">Catégories</h3>
              <div class="title-underline"></div>
            </div>
            <nav class="categories-nav">
              <a href="#robes" @click.prevent="scrollToCategory('robes')" class="category-link">
                <i class="bi bi-chevron-right"></i>
                Robes
              </a>
              <a href="#ensembles" @click.prevent="scrollToCategory('ensembles')" class="category-link">
                <i class="bi bi-chevron-right"></i>
                Ensembles
              </a>
              <a href="#sacs" @click.prevent="scrollToCategory('sacs')" class="category-link">
                <i class="bi bi-chevron-right"></i>
                Sacs & Accessoires
              </a>
            </nav>
          </aside>

          <!-- Products Grid -->
          <main class="products-main">
            <div v-if="productsStore.loading && allProducts.length === 0" class="text-center py-5">
              <div class="spinner-border" style="color: #c9a46c;" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
              <p class="mt-3 text-muted">Chargement des produits...</p>
            </div>
            <template v-else>
              <div id="robes">
                <RobesPreview :products="robesProducts" @view-all="openRobesOverlay" />
              </div>

              <div id="ensembles">
                <EnsemblesPreview :products="ensemblesProducts" @view-all="openEnsemblesOverlay" />
              </div>

              <div id="sacs">
                <SacsPreview :products="sacsProducts" @view-all="openSacsOverlay" />
              </div>
            </template>
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
    <FilterPopup 
      :is-open="filterPopupOpen" 
      :categories="filterCategories"
      v-model="activeMobileCategory"
      @close="filterPopupOpen = false" 
    />
  </div>
</template>

<script setup lang="ts">
import RobesPreview from '../components/women/RobesPreview.vue'
import EnsemblesPreview from '../components/women/EnsemblesPreview.vue'
import SacsPreview from '../components/women/SacsPreview.vue'
import CategoryOverlay from '../components/women/CategoryOverlay.vue'
import FilterButton from '../components/FilterButton.vue'
import FilterPopup from '../components/FilterPopup.vue'
import { ContentService, DEFAULT_PAGE_BANNERS } from '~~/services/contentService'

import { useProductsStore } from '../../stores/products'

// Store temps réel — mis à jour instantanément depuis Firestore
const productsStore = useProductsStore()

const getCategorySlug = (p: any) => {
  if (!p) return ''
  if (typeof p.category === 'string') return p.category.toLowerCase().trim()
  return (p.category?.slug || '').toLowerCase().trim()
}

const getCollectionSlug = (p: any) => {
  if (!p) return ''
  const col = (p.category as any)?.collectionSlug || p.category?.collection?.slug || p.collectionSlug || ''
  return String(col).toLowerCase().trim()
}

// Produits de la collection femmes, réactifs en temps réel
const allProducts = computed(() => {
  return productsStore.products
    .filter(p => ['robes', 'ensembles', 'sacs'].includes(getCategorySlug(p)) || getCollectionSlug(p) === 'women')
    .map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.discount_price ? parseFloat(product.discount_price) : parseFloat(product.price),
      originalPrice: product.discount_price ? parseFloat(product.price) : null,
      discount_price: product.discount_price ? parseFloat(product.discount_price) : undefined,
      images: product.images?.map((img: any) => typeof img === 'object' ? (img.image || img.url) : img) || [],
      badge: product.is_featured
        ? { type: 'featured', text: 'VEDETTE' }
        : product.is_new
        ? { type: 'new', text: 'NOUVEAU' }
        : null,
      category: product.category
    }))
})

// Charger les produits et la bannière au montage
const bannerUrl = ref(DEFAULT_PAGE_BANNERS.women)
const heroBannerStyle = computed(() => ({
    backgroundImage: `url(${bannerUrl.value})`
}))


const router = useRouter()
const activeOverlayCategory = ref<string | null>(null)

const categoryTitles: Record<string, string> = {
  robes: 'Robes Africaines',
  ensembles: 'Ensembles',
  sacs: 'Sacs & Accessoires'
}

const overlayTitle = computed(() => {
  return activeOverlayCategory.value ? (categoryTitles[activeOverlayCategory.value] || 'Produits') : ''
})

const overlayOpen = computed(() => !!activeOverlayCategory.value)

const overlayProducts = computed(() => {
  if (!activeOverlayCategory.value) return []
  return allProducts.value.filter(p => getCategorySlug(p) === activeOverlayCategory.value)
})

const filterPopupOpen = ref(false)
const activeMobileCategory = ref('')

const filterCategories = [
  { id: 'robes', label: 'Robes' },
  { id: 'ensembles', label: 'Ensembles' },
  { id: 'sacs', label: 'Sacs & Accessoires' }
]

const route = useRoute()

// Produits groupés par catégorie
const robesProducts = computed(() => allProducts.value.filter(p => getCategorySlug(p) === 'robes'))
const ensemblesProducts = computed(() => allProducts.value.filter(p => getCategorySlug(p) === 'ensembles'))
const sacsProducts = computed(() => allProducts.value.filter(p => getCategorySlug(p) === 'sacs'))


// Charger la bannière et sync URL au montage
onMounted(async () => {
  productsStore.initRealtimeSync()
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }

  try {
    const banners = await ContentService.getPageBanners()
    if (banners?.women) bannerUrl.value = banners.women
  } catch (e) {
    console.warn('[WomenPage] Banner error:', e)
  }
  checkUrlCategory()
})



function openRobesOverlay() {
  activeOverlayCategory.value = 'robes'
  router.push({ query: { category: 'robes' } })
}

function openEnsemblesOverlay() {
  activeOverlayCategory.value = 'ensembles'
  router.push({ query: { category: 'ensembles' } })
}

function openSacsOverlay() {
  activeOverlayCategory.value = 'sacs'
  router.push({ query: { category: 'sacs' } })
}

function closeOverlay() {
  activeOverlayCategory.value = null
  router.replace({ query: {} })
}

function scrollToCategory(categoryId: string) {
  const element = document.getElementById(categoryId)
  if (element) {
    const yOffset = -20
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

watch(activeMobileCategory, (newCategory) => {
  if (newCategory) {
    scrollToCategory(newCategory)
    activeMobileCategory.value = ''
  }
})

function checkUrlCategory() {
  const category = route.query.category as string
  if (category && categoryTitles[category]) {
    activeOverlayCategory.value = category
  } else if (!category) {
    activeOverlayCategory.value = null
  }
}

watch(() => route.query.category, () => {
  checkUrlCategory()
})

useHead({
  title: 'Collection Femmes - MEM\'S',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection de vêtements et accessoires pour femmes : robes africaines, ensembles élégants et sacs d\'inspiration africaine.'
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
  background-image: url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&h=600&fit=crop&q=80');
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
