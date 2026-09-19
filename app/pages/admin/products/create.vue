<template>
  <div class="admin-product-create-page">
    <div class="mb-3">
      <NuxtLink to="/admin/products" class="text-muted text-decoration-none small d-inline-flex align-items-center gap-1 mb-1" style="font-size: 0.75rem;">
        <i class="bi bi-arrow-left"></i> Retour à la liste des produits
      </NuxtLink>
      <h1 class="page-title">Ajouter un Nouveau Produit</h1>
      <p class="text-muted page-subtitle mb-0">Remplissez les détails et téléversez les photos vers votre Cloudinary</p>
    </div>

    <ProductForm :is-edit="false" />
  </div>
</template>

<script setup lang="ts">
import ProductForm from '../../../components/admin/ProductForm.vue'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})
</script>

<style scoped>
.page-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #0B0B0B;
  letter-spacing: -0.01em;
}

.page-subtitle {
  font-size: 0.75rem;
  color: #7A7A7A;
}
</style>
