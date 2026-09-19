<template>
  <div class="admin-products-page">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
      <div>
        <h1 class="page-title">Gestion des Produits</h1>
        <p class="text-muted mb-0">{{ filteredProducts.length }} produit(s) répertorié(s)</p>
      </div>
      <div>
        <NuxtLink to="/admin/products/create" class="btn btn-mems-gold">
          <i class="bi bi-plus-lg me-1"></i> Nouveau Produit
        </NuxtLink>
      </div>
    </div>

    <!-- Barre de filtres & Recherche -->
    <div class="filter-bar content-card mb-4">
      <div class="row g-3 align-items-center">
        <!-- Champ Recherche -->
        <div class="col-md-5">
          <div class="search-input-box">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control admin-search-control"
              placeholder="Rechercher par nom ou référence..."
            />
            <button
              v-if="searchQuery"
              class="btn-clear-search"
              @click="searchQuery = ''"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>

        <!-- Filtre Collection -->
        <div class="col-sm-6 col-md-3">
          <select v-model="selectedCollection" class="form-select admin-select-control">
            <option value="">Toutes les collections</option>
            <option value="men">Hommes</option>
            <option value="women">Femmes</option>
            <option value="babouches">Babouches</option>
            <option value="lins">Lins</option>
          </select>
        </div>

        <!-- Filtre Catégorie -->
        <div class="col-sm-6 col-md-4">
          <select v-model="selectedCategory" class="form-select admin-select-control">
            <option value="">Toutes les catégories</option>
            <option v-for="cat in availableCategories" :key="cat.slug" :value="cat.slug">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tableau des Produits -->
    <div class="content-card">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-gold" role="status"></div>
        <p class="mt-2 text-muted small">Chargement du catalogue...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty-state-box text-center py-5">
        <i class="bi bi-search fs-1 text-muted"></i>
        <p class="mt-2 mb-1 fw-medium">Aucun produit ne correspond à vos filtres</p>
        <button class="btn btn-sm btn-outline-dark mt-2" @click="resetFilters">
          Réinitialiser les filtres
        </button>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0 custom-admin-table">
          <thead>
            <tr>
              <th style="width: 70px;">Visuel</th>
              <th>Nom & Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Attributs</th>
              <th class="text-end" style="width: 140px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.slug">
              <!-- Visuel -->
              <td>
                <div class="product-avatar-box">
                  <img :src="getProductImage(product)" :alt="product.name" class="product-table-thumb" />
                </div>
              </td>

              <!-- Nom & Catégorie -->
              <td>
                <span class="product-table-name">{{ product.name }}</span>
                <div class="d-flex align-items-center gap-2 mt-1">
                  <span class="badge-collection">{{ product.category?.collectionSlug || 'Collection' }}</span>
                  <span class="text-muted small">• {{ product.category?.name }}</span>
                </div>
              </td>

              <!-- Prix -->
              <td>
                <div class="d-flex flex-column">
                  <span class="fw-bold text-dark">{{ formatPrice(product.discount_price || product.price) }} FCFA</span>
                  <span v-if="product.discount_price" class="text-muted text-decoration-line-through small">
                    {{ formatPrice(product.price) }} FCFA
                  </span>
                </div>
              </td>

              <!-- Stock -->
              <td>
                <div class="d-flex align-items-center gap-2">
                  <span :class="getStockBadgeClass(product.stock)">
                    {{ product.stock }} en stock
                  </span>
                  <!-- Actions rapides stock -->
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-light border py-0 px-2"
                      title="Diminuer stock"
                      :disabled="product.stock <= 0"
                      @click="adjustStock(product, -1)"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <button
                      class="btn btn-light border py-0 px-2"
                      title="Augmenter stock"
                      @click="adjustStock(product, 1)"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </td>

              <!-- Badges Vedette / Nouveau -->
              <td>
                <div class="d-flex gap-1 flex-wrap">
                  <span v-if="product.is_featured" class="badge-tag badge-gold">
                    <i class="bi bi-star-fill me-1"></i>Vedette
                  </span>
                  <span v-if="product.is_new" class="badge-tag badge-terracotta">
                    <i class="bi bi-sparkles me-1"></i>Nouveau
                  </span>
                  <span v-if="!product.is_featured && !product.is_new" class="text-muted small">-</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <div class="d-inline-flex gap-1">
                  <NuxtLink
                    :to="`/products/${product.slug}`"
                    target="_blank"
                    class="btn btn-sm btn-outline-secondary"
                    title="Voir sur le site public"
                  >
                    <i class="bi bi-eye"></i>
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/products/${product.slug}`"
                    class="btn btn-sm btn-outline-dark"
                    title="Modifier la fiche"
                  >
                    <i class="bi bi-pencil"></i>
                  </NuxtLink>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    title="Supprimer ce produit"
                    @click="confirmDelete(product)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
        <span class="text-muted small">
          Page {{ currentPage }} sur {{ totalPages }} ({{ filteredProducts.length }} produits)
        </span>
        <div class="d-flex gap-2">
          <button
            class="btn btn-sm btn-outline-dark"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Précédent
          </button>
          <button
            class="btn btn-sm btn-outline-dark"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { useFirebase } from '../../../../composables/useFirebase'
import { FirestoreProductsService } from '../../../../services/firestoreProducts'
import { useProductsStore } from '../../../../stores/products'
import type { Product, Category } from '../../../../types/product'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { db } = useFirebase()
const productsStore = useProductsStore()

// Lecture réactive depuis le store temps réel — se met à jour automatiquement
const products = computed(() => productsStore.products)
const loading = computed(() => productsStore.loading && productsStore.products.length === 0)

const categories = ref<Category[]>([])

const searchQuery = ref('')
const selectedCollection = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 12

const formatPrice = (price: number) => {
  return (price || 0).toLocaleString('fr-FR')
}

const getProductImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const img: any = product.images[0]
    return typeof img === 'object' ? (img.image || img.url) : img
  }
  return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop'
}

const getStockBadgeClass = (stock: number) => {
  if (stock <= 0) return 'badge bg-danger'
  if (stock <= 3) return 'badge bg-warning text-dark'
  return 'badge bg-success'
}

const availableCategories = computed(() => {
  if (!selectedCollection.value) return categories.value
  return categories.value.filter(c => (c as any).collectionSlug === selectedCollection.value || c.collection?.slug === selectedCollection.value)
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    // Filtre texte
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchName = p.name.toLowerCase().includes(q)
      const matchSlug = p.slug.toLowerCase().includes(q)
      if (!matchName && !matchSlug) return false
    }

    // Filtre collection
    if (selectedCollection.value) {
      const col = (p.category as any)?.collectionSlug || p.category?.collection?.slug
      if (col !== selectedCollection.value) return false
    }

    // Filtre catégorie
    if (selectedCategory.value) {
      if (p.category?.slug !== selectedCategory.value) return false
    }

    return true
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage) || 1
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedCollection.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}

const adjustStock = async (product: Product, delta: number) => {
  const newStock = Math.max(0, (product.stock || 0) + delta)

  // Mise à jour optimiste dans le cache local (le store se met à jour par le subscriber)
  FirestoreProductsService.updateLocalProduct({ ...product, stock: newStock })

  if (db) {
    try {
      await updateDoc(doc(db, 'products', product.slug), {
        stock: newStock,
        updated_at: new Date().toISOString()
      })
      // Pas besoin de clearCache — le onSnapshot Firestore rafraîchira automatiquement
    } catch (err) {
      console.warn('[Admin] Erreur mise à jour stock:', err)
      // Rollback optimiste
      FirestoreProductsService.updateLocalProduct(product)
    }
  }
}

const confirmDelete = async (product: Product) => {
  const ok = confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${product.name}" ?`)
  if (!ok) return

  // Suppression optimiste immédiate depuis le cache local
  FirestoreProductsService.removeLocalProduct(product.slug)

  if (db) {
    try {
      await deleteDoc(doc(db, 'products', product.slug))
      // onSnapshot confirme automatiquement la suppression
    } catch (err) {
      console.warn('[Admin] Erreur suppression Firestore:', err)
    }
  }
}

onMounted(async () => {
  try {
    categories.value = await FirestoreProductsService.getCategories()
  } catch (err) {
    console.warn('[Admin Products] Erreur chargement catégories:', err)
  }

  // Fallback de sécurité : si le store est toujours vide après 3s, forcer un chargement
  setTimeout(async () => {
    if (productsStore.products.length === 0) {
      console.warn('[Admin] Store vide après 3s, forçage du chargement...')
      await productsStore.fetchProducts()
    }
  }, 3000)
})


</script>

<style scoped>
.page-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.2px;
}

.content-card {
  background: #FFFFFF !important;
  border-radius: 6px;
  border: 1px solid #ECE7E1;
  padding: 1.1rem 1.15rem;
  box-shadow: 0 1px 3px rgba(11, 11, 11, 0.02);
  position: relative;
  z-index: 2;
}

.search-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: #888;
  font-size: 0.8125rem;
}

.admin-search-control {
  padding-left: 32px;
  padding-right: 28px;
  background: #FAF8F5;
  border: 1px solid #ECE7E1;
  border-radius: 4px;
  font-size: 0.75rem;
}

.admin-select-control {
  background: #FAF8F5;
  border: 1px solid #ECE7E1;
  border-radius: 4px;
  font-size: 0.75rem;
}

.btn-clear-search {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: #888;
  font-size: 1rem;
}

/* Custom Table */
.custom-admin-table {
  background: #FFFFFF !important;
}

.custom-admin-table th {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #8C8C8C;
  font-weight: 600;
  border-bottom: 1px solid #ECE7E1;
  padding: 0.5rem 0.4rem;
  background: #FFFFFF !important;
}

.custom-admin-table td {
  padding: 0.55rem 0.4rem;
  border-bottom: 1px solid #F5F2EC;
  background: #FFFFFF !important;
  font-size: 0.8125rem;
}

.product-avatar-box {
  width: 38px;
  height: 44px;
  border-radius: 4px;
  overflow: hidden;
  background: #0B0B0B;
}

.product-table-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-table-name {
  font-weight: 500;
  color: #111111;
  font-size: 0.8125rem;
  display: block;
}

.badge-collection {
  background: #F5F2EC;
  color: #A14E36;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.badge-tag {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

.badge-gold {
  background: rgba(201, 164, 108, 0.15);
  color: #8C6D37;
}

.badge-terracotta {
  background: rgba(161, 78, 54, 0.12);
  color: #A14E36;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 4px;
  letter-spacing: 0.2px;
}

.btn-mems-gold:hover {
  background: #B89358;
}
</style>
