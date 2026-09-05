<template>
  <div class="admin-product-edit-page">
    <div class="mb-4">
      <NuxtLink to="/admin/products" class="text-muted text-decoration-none small d-inline-flex align-items-center gap-1 mb-2">
        <i class="bi bi-arrow-left"></i> Retour à la liste des produits
      </NuxtLink>
      <h1 class="page-title">Modifier le Produit</h1>
      <p class="text-muted mb-0" v-if="product">Édition de « {{ product.name }} »</p>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-gold" role="status"></div>
      <p class="mt-2 text-muted small">Chargement du produit...</p>
    </div>

    <div v-else-if="!product" class="alert alert-warning text-center py-4">
      <i class="bi bi-exclamation-circle fs-3 d-block mb-2"></i>
      <h5 class="mb-1">Produit introuvable</h5>
      <p class="text-muted small mb-3">Le produit demandé n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/admin/products" class="btn btn-sm btn-dark">Retour au catalogue</NuxtLink>
    </div>

    <ProductForm v-else :initial-product="product" :is-edit="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { FirestoreProductsService } from '../../../../services/firestoreProducts'
import ProductForm from '../../../components/admin/ProductForm.vue'
import type { Product } from '../../../../types/product'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const slug = route.params.slug as string
const product = ref<Product | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    product.value = await FirestoreProductsService.getProductBySlug(slug)
  } catch (err) {
    console.error('[Admin Edit Product] Erreur chargement:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0B0B0B;
}

.text-gold {
  color: #C9A46C !important;
}
</style>
