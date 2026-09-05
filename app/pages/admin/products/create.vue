<template>
  <div class="admin-product-create-page">
    <div class="mb-4">
      <NuxtLink to="/admin/products" class="text-muted text-decoration-none small d-inline-flex align-items-center gap-1 mb-2">
        <i class="bi bi-arrow-left"></i> Retour à la liste des produits
      </NuxtLink>
      <h1 class="page-title">Ajouter un Nouveau Produit</h1>
      <p class="text-muted mb-0">Remplissez les détails et téléversez les photos vers votre Cloudinary</p>
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #0B0B0B;
}
</style>
