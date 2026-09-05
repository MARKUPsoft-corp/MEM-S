<template>
  <div class="contact-page">
    <!-- African Pattern Background -->
    <AfricanPatternBackground opacity="light" color="gold" />
    
    <div class="container py-5">
      <h1 class="mb-4">Contactez-nous</h1>
    <div class="row">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-4">Informations de contact</h5>
            
            <div class="mb-3">
              <i class="bi bi-whatsapp text-success fs-5"></i>
              <a :href="`https://wa.me/${whatsappNumber}`" target="_blank" class="ms-2 text-decoration-none text-dark fw-semibold">
                {{ displayPhone }}
              </a>
            </div>
            
            <div class="mb-3">
              <i class="bi bi-envelope fs-5"></i>
              <span class="ms-2">{{ storeSettings.contactEmail || 'contact@mems-concept.com' }}</span>
            </div>
            
            <div class="mb-3">
              <i class="bi bi-geo-alt fs-5"></i>
              <span class="ms-2">{{ storeSettings.address || 'Douala, Cameroun' }}</span>
            </div>
            
            <hr>
            
            <h6 class="mb-3">Suivez-nous</h6>
            <div class="d-flex gap-3">
              <a href="#" class="text-dark fs-4"><i class="bi bi-facebook"></i></a>
              <a href="#" class="text-dark fs-4"><i class="bi bi-instagram"></i></a>
              <a href="#" class="text-dark fs-4"><i class="bi bi-twitter"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'
import { ContentService, type StoreSettings, DEFAULT_STORE_SETTINGS } from '~~/services/contentService'

const config = useRuntimeConfig()
const storeSettings = ref<StoreSettings>({ ...DEFAULT_STORE_SETTINGS })

onMounted(async () => {
  try {
    const loaded = await ContentService.getStoreSettings()
    if (loaded) {
      storeSettings.value = { ...loaded }
    }
  } catch (e) {
    console.warn('[Contact] Erreur chargement paramètres:', e)
  }
})

const whatsappNumber = computed(() => {
  return (storeSettings.value.whatsappNumber || config.public.whatsappNumber || '237696962662').replace(/[^0-9]/g, '')
})

const displayPhone = computed(() => {
  return storeSettings.value.contactPhone || `+${whatsappNumber.value}`
})

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.contact-page {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: #F5F2EC;
}

.container {
  position: relative;
  z-index: 2;
}
</style>
