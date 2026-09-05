<template>
  <div class="admin-banners-page">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
      <div>
        <h1 class="page-title">Gestion des Bannières & Visuels</h1>
        <p class="text-muted mb-0">Personnalisez les carrousels de la page d'accueil et les bannières de vos collections</p>
      </div>
      <div>
        <button class="btn btn-mems-gold px-4" :disabled="saving" @click="saveAll">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-check-circle me-2"></i>
          Enregistrer tous les visuels
        </button>
      </div>
    </div>

    <!-- Alert toast succès -->
    <div v-if="successMsg" class="alert alert-success d-flex align-items-center justify-content-between mb-4">
      <span><i class="bi bi-check-circle-fill me-2"></i>{{ successMsg }}</span>
      <button type="button" class="btn-close" @click="successMsg = ''"></button>
    </div>

    <!-- Onglets : 1. Hero Carousel Accueil | 2. Bannières des Collections -->
    <ul class="nav nav-pills custom-admin-tabs mb-4">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'hero' }"
          @click="activeTab = 'hero'"
        >
          <i class="bi bi-sliders me-2"></i>
          Carrousel Accueil (Hero)
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'pages' }"
          @click="activeTab = 'pages'"
        >
          <i class="bi bi-card-image me-2"></i>
          Bannières des Collections & Pages
        </button>
      </li>
    </ul>

    <!-- Contenu Onglet 1 : Carrousel Hero Accueil -->
    <div v-if="activeTab === 'hero'">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h3 class="section-subtitle mb-0">Diapositives du Carrousel Principal (3)</h3>
        <button class="btn btn-sm btn-outline-dark" @click="addHeroSlide">
          <i class="bi bi-plus-lg me-1"></i> Ajouter une diapositive
        </button>
      </div>

      <div class="row g-4">
        <div
          v-for="(slide, sIdx) in heroSlides"
          :key="slide.id"
          class="col-lg-6 col-xl-4"
        >
          <div class="content-card h-100 d-flex flex-column">
            <!-- Header Diapo -->
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <span class="fw-bold text-dark">Diapositive #{{ sIdx + 1 }}</span>
              <button
                v-if="heroSlides.length > 1"
                class="btn btn-sm btn-outline-danger py-0 px-2"
                title="Supprimer cette diapositive"
                @click="removeHeroSlide(sIdx)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>

            <!-- Aperçu de l'image actuelle -->
            <div class="slide-preview-box mb-3">
              <img :src="slide.image" alt="Slide preview" class="slide-preview-img" />
              <div class="slide-preview-overlay">
                <h5 class="slide-preview-title">{{ slide.title }}</h5>
                <span class="slide-preview-price">{{ slide.price }}</span>
              </div>
            </div>

            <!-- Champs de saisie -->
            <div class="mb-2">
              <label class="small fw-semibold text-muted">Titre de la diapositive</label>
              <input v-model="slide.title" type="text" class="form-control form-control-sm" />
            </div>

            <div class="mb-2">
              <label class="small fw-semibold text-muted">Prix / Texte d'accroche</label>
              <input v-model="slide.price" type="text" class="form-control form-control-sm" />
            </div>

            <div class="mb-3">
              <label class="small fw-semibold text-muted">Lien de destination</label>
              <input v-model="slide.link" type="text" class="form-control form-control-sm" />
            </div>

            <!-- Téléversement vers Cloudinary -->
            <div class="mt-auto pt-2">
              <label class="small fw-semibold text-muted d-block mb-1">Changer l'image (Cloudinary)</label>
              <ImageUploader
                :model-value="[slide.image]"
                :multiple="false"
                folder="MEMS/hero"
                @update:model-value="onSlideImageUpdated(sIdx, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu Onglet 2 : Bannières de Pages -->
    <div v-if="activeTab === 'pages'">
      <div class="row g-4">
        <div
          v-for="page in pageBannerConfig"
          :key="page.key"
          class="col-lg-6"
        >
          <div class="content-card">
            <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h4 class="card-clean-title mb-0">{{ page.title }}</h4>
                <small class="text-muted">Route : <code>{{ page.path }}</code></small>
              </div>
              <NuxtLink :to="page.path" target="_blank" class="btn btn-sm btn-outline-secondary">
                <i class="bi bi-box-arrow-up-right me-1"></i> Voir la page
              </NuxtLink>
            </div>

            <!-- Aperçu de la bannière actuelle -->
            <div class="page-banner-preview mb-3">
              <img :src="banners[page.key]" alt="Bannière actuelle" class="page-banner-img" />
              <div class="page-banner-title-overlay">
                <span>{{ page.title.toUpperCase() }}</span>
              </div>
            </div>

            <!-- Uploader pour cette bannière -->
            <label class="small fw-semibold text-muted d-block mb-1">Téléverser une nouvelle bannière</label>
            <ImageUploader
              :model-value="banners[page.key] ? [banners[page.key]] : []"
              :multiple="false"
              folder="MEMS/banners"
              @update:model-value="onBannerImageUpdated(page.key, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ContentService, type HeroSlide, type PageBanners, DEFAULT_HERO_SLIDES, DEFAULT_PAGE_BANNERS } from '~~/services/contentService'
import ImageUploader from '../../components/admin/ImageUploader.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const activeTab = ref<'hero' | 'pages'>('hero')
const saving = ref(false)
const successMsg = ref('')

const heroSlides = ref<HeroSlide[]>([...DEFAULT_HERO_SLIDES])
const banners = ref<PageBanners>({ ...DEFAULT_PAGE_BANNERS })

const pageBannerConfig = [
  { key: 'men' as keyof PageBanners, title: 'Collection Hommes', path: '/men' },
  { key: 'women' as keyof PageBanners, title: 'Collection Femmes', path: '/women' },
  { key: 'babouches' as keyof PageBanners, title: 'Babouches Traditionnelles', path: '/babouches' },
  { key: 'lins' as keyof PageBanners, title: 'Collection Lins', path: '/lins' },
  { key: 'nouveautes' as keyof PageBanners, title: 'Nouveautés', path: '/nouveautes' },
  { key: 'vedettes' as keyof PageBanners, title: 'Sélection Prestige / Vedettes', path: '/vedettes' },
  { key: 'about' as keyof PageBanners, title: 'Page À Propos', path: '/about' }
]

const addHeroSlide = () => {
  heroSlides.value.push({
    id: Date.now(),
    title: 'NOUVELLE COLLECTION',
    price: 'À PARTIR DE 25000 FCFA',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=80',
    link: '/products'
  })
}

const removeHeroSlide = (index: number) => {
  heroSlides.value.splice(index, 1)
}

const onSlideImageUpdated = (index: number, images: any[]) => {
  if (images && images.length > 0) {
    const last = images[images.length - 1]
    heroSlides.value[index].image = typeof last === 'object' ? last.image : last
  }
}

const onBannerImageUpdated = (key: keyof PageBanners, images: any[]) => {
  if (images && images.length > 0) {
    const last = images[images.length - 1]
    banners.value[key] = typeof last === 'object' ? last.image : last
  }
}

const saveAll = async () => {
  saving.value = true
  successMsg.value = ''
  try {
    await Promise.all([
      ContentService.saveHeroSlides(heroSlides.value),
      ContentService.savePageBanners(banners.value)
    ])
    successMsg.value = 'Toutes les bannières et diapositives ont été enregistrées avec succès dans Firestore !'
    setTimeout(() => {
      successMsg.value = ''
    }, 5000)
  } catch (err: any) {
    console.error('[Admin Banners] Erreur sauvegarde:', err)
    alert(`Erreur de sauvegarde : ${err.message}`)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const [slidesData, bannersData] = await Promise.all([
      ContentService.getHeroSlides(),
      ContentService.getPageBanners()
    ])
    if (slidesData && slidesData.length > 0) {
      heroSlides.value = slidesData
    }
    if (bannersData) {
      banners.value = bannersData
    }
  } catch (err) {
    console.warn('[Admin Banners] Erreur chargement:', err)
  }
})
</script>

<style scoped>
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0B0B0B;
}

.section-subtitle {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0B0B0B;
}

.content-card {
  background: #FFFFFF !important;
  border-radius: 8px;
  border: 1px solid #E5E0D8;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(11, 11, 11, 0.04);
  position: relative;
  z-index: 2;
}

.card-clean-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0B0B0B;
}

/* Tabs */
.custom-admin-tabs .nav-link {
  color: #555;
  background: #F5F2EC;
  border: 1px solid #E5E0D8;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.custom-admin-tabs .nav-link.active {
  background: #0B0B0B;
  color: #C9A46C;
  border-color: #0B0B0B;
}

/* Slide Preview */
.slide-preview-box {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  overflow: hidden;
  background: #0B0B0B;
}

.slide-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-preview-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
}

.slide-preview-title {
  color: #FFFFFF;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 0.15rem;
}

.slide-preview-price {
  color: #C9A46C;
  font-size: 0.8125rem;
  font-weight: 600;
}

/* Page Banner Preview */
.page-banner-preview {
  position: relative;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  background: #0B0B0B;
}

.page-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-banner-title-overlay {
  position: absolute;
  inset: 0;
  background: rgba(11, 11, 11, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 1rem;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 600;
  border-radius: 4px;
}

.btn-mems-gold:hover {
  background: #B89358;
}
</style>
