<template>
  <div class="admin-categories-page">
    <!-- En-tête -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
      <div>
        <h1 class="page-title">Catégories & Collections</h1>
        <p class="text-muted mb-0">Structure du catalogue et organisation des rayons MEM'S</p>
      </div>
      <div class="d-flex gap-2">
        <button
          v-if="categories.length === 0 && !loading"
          class="btn btn-outline-warning"
          @click="seedDefaultCategories"
          :disabled="seeding"
        >
          <span v-if="seeding" class="spinner-border spinner-border-sm me-1"></span>
          <i v-else class="bi bi-cloud-arrow-up me-1"></i>
          Initialiser depuis les données par défaut
        </button>
        <button class="btn btn-mems-gold" @click="openCreateModal">
          <i class="bi bi-plus-lg me-1"></i> Nouvelle Catégorie
        </button>
      </div>
    </div>

    <!-- Collections Overview Cards -->
    <div class="row g-3 mb-4">
      <div
        v-for="col in collectionsList"
        :key="col.slug"
        class="col-sm-6 col-lg-3"
      >
        <div
          class="collection-kpi-card"
          :class="{ active: selectedCollection === col.slug }"
          @click="selectedCollection = selectedCollection === col.slug ? '' : col.slug"
        >
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="collection-badge-kpi">{{ col.slug.toUpperCase() }}</span>
            <span class="count-pill">{{ getCategoryCountForCollection(col.slug) }} cat.</span>
          </div>
          <h4 class="collection-card-name">{{ col.name }}</h4>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <small class="text-muted">{{ getProductCountForCollection(col.slug) }} produit(s)</small>
            <i class="bi bi-chevron-right text-gold"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="filter-bar content-card mb-4">
      <div class="row g-3 align-items-center">
        <!-- Recherche -->
        <div class="col-md-6">
          <div class="search-input-box">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control admin-search-control"
              placeholder="Rechercher une catégorie..."
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
        <div class="col-md-6 d-flex justify-content-md-end">
          <div class="btn-group btn-group-sm">
            <button
              class="btn"
              :class="selectedCollection === '' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="selectedCollection = ''"
            >
              Toutes ({{ categories.length }})
            </button>
            <button
              v-for="col in collectionsList"
              :key="col.slug"
              class="btn"
              :class="selectedCollection === col.slug ? 'btn-dark' : 'btn-outline-secondary'"
              @click="selectedCollection = col.slug"
            >
              {{ col.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des Catégories -->
    <div class="content-card">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-gold" role="status"></div>
        <p class="mt-2 text-muted small">Chargement des catégories...</p>
      </div>

      <div v-else-if="filteredCategories.length === 0" class="empty-state-box text-center py-5">
        <i class="bi bi-folder-x fs-1 text-muted"></i>
        <p class="mt-2 mb-1 fw-medium">Aucune catégorie trouvée</p>
        <small class="text-muted">Créez une nouvelle catégorie ou initialisez le catalogue.</small>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0 custom-admin-table">
          <thead>
            <tr>
              <th style="width: 70px;">Ordre</th>
              <th>Nom & Slug</th>
              <th>Collection</th>
              <th>Produits Liés</th>
              <th>Description</th>
              <th class="text-end" style="width: 130px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in filteredCategories" :key="cat.slug">
              <!-- Ordre -->
              <td>
                <span class="order-number-badge">{{ cat.order || '-' }}</span>
              </td>

              <!-- Nom & Slug -->
              <td>
                <span class="category-name-text">{{ cat.name }}</span>
                <span class="category-slug-text">/{{ cat.slug }}</span>
              </td>

              <!-- Collection -->
              <td>
                <span class="badge-collection" :class="`col-${getCatCollectionSlug(cat)}`">
                  {{ getCollectionName(getCatCollectionSlug(cat)) }}
                </span>
              </td>

              <!-- Produits Liés -->
              <td>
                <span class="badge bg-light text-dark border">
                  {{ getProductCountForCategory(cat.slug) }} produit(s)
                </span>
              </td>

              <!-- Description -->
              <td>
                <span class="text-muted small">
                  {{ cat.description || 'Aucune description' }}
                </span>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-outline-dark"
                    title="Modifier la catégorie"
                    @click="openEditModal(cat)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-outline-danger"
                    title="Supprimer la catégorie"
                    @click="confirmDelete(cat)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL CRÉATION / ÉDITION CATÉGORIE -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop-custom" @click="closeModal">
        <div class="modal-dialog-custom" @click.stop>
          <div class="modal-header-luxury d-flex align-items-center justify-content-between">
            <h5 class="modal-title-custom">
              {{ isEditing ? 'Modifier la Catégorie' : 'Ajouter une Nouvelle Catégorie' }}
            </h5>
            <button class="btn-close-luxury" @click="closeModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <form @submit.prevent="saveCategory">
            <div class="modal-body-content">
              <div class="mb-3">
                <label class="form-label fw-semibold">Nom de la Catégorie <span class="text-danger">*</span></label>
                <input
                  v-model="modalForm.name"
                  type="text"
                  class="form-control admin-input"
                  placeholder="Ex: Boubous Brodés"
                  required
                  @input="onNameInput"
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Slug (Identifiant URL) <span class="text-danger">*</span></label>
                <input
                  v-model="modalForm.slug"
                  type="text"
                  class="form-control admin-input"
                  placeholder="boubous-brodes"
                  required
                  :disabled="isEditing"
                />
                <small class="text-muted">Utilisé dans les filtres et URLs. Non modifiable après création.</small>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-sm-6">
                  <label class="form-label fw-semibold">Collection de rattachement <span class="text-danger">*</span></label>
                  <select v-model="modalForm.collectionSlug" class="form-select admin-select-control" required>
                    <option v-for="col in collectionsList" :key="col.slug" :value="col.slug">
                      {{ col.name }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <label class="form-label fw-semibold">Ordre d'affichage</label>
                  <input
                    v-model.number="modalForm.order"
                    type="number"
                    min="1"
                    class="form-control admin-input"
                    placeholder="1"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Description (Optionnelle)</label>
                <textarea
                  v-model="modalForm.description"
                  class="form-control admin-input"
                  rows="3"
                  placeholder="Brève description de ce rayon..."
                ></textarea>
              </div>
            </div>

            <div class="modal-footer-luxury d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary" @click="closeModal">
                Annuler
              </button>
              <button type="submit" class="btn btn-mems-gold" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                {{ isEditing ? 'Enregistrer les modifications' : 'Créer la catégorie' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore'
import { useFirebase } from '~~/composables/useFirebase'
import { FirestoreProductsService } from '~~/services/firestoreProducts'
import { INITIAL_CATEGORIES } from '~~/data/productsData'
import type { Category, Product } from '~~/types/product'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { db } = useFirebase()

const collectionsList = [
  { slug: 'men', name: 'Hommes' },
  { slug: 'women', name: 'Femmes' },
  { slug: 'babouches', name: 'Babouches' },
  { slug: 'lins', name: 'Lins' }
]

const categories = ref<Category[]>([])
const allProducts = ref<Product[]>([])
const loading = ref(true)
const saving = ref(false)
const seeding = ref(false)

const searchQuery = ref('')
const selectedCollection = ref('')

const showModal = ref(false)
const isEditing = ref(false)

const modalForm = ref({
  id: 0,
  name: '',
  slug: '',
  collectionSlug: 'men',
  order: 1,
  description: ''
})

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const onNameInput = () => {
  if (!isEditing.value) {
    modalForm.value.slug = slugify(modalForm.value.name)
  }
}

const getCatCollectionSlug = (cat: any) => {
  return cat.collectionSlug || cat.collection?.slug || 'men'
}

const getCollectionName = (slug: string) => {
  const c = collectionsList.find(item => item.slug === slug)
  return c ? c.name : slug
}

const getCategoryCountForCollection = (colSlug: string) => {
  return categories.value.filter(cat => getCatCollectionSlug(cat) === colSlug).length
}

const getProductCountForCollection = (colSlug: string) => {
  return allProducts.value.filter(p => {
    const pCol = (p.category as any)?.collectionSlug || p.category?.collection?.slug
    return pCol === colSlug
  }).length
}

const getProductCountForCategory = (catSlug: string) => {
  return allProducts.value.filter(p => p.category?.slug === catSlug).length
}

// Filtre et recherche
const filteredCategories = computed(() => {
  let list = [...categories.value]

  if (selectedCollection.value) {
    list = list.filter(cat => getCatCollectionSlug(cat) === selectedCollection.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(cat =>
      cat.name.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q) ||
      (cat.description && cat.description.toLowerCase().includes(q))
    )
  }

  return list
})

// Chargement des données
const loadData = async () => {
  loading.value = true
  try {
    // 1. Récupérer les catégories
    let catList: Category[] = []
    if (db) {
      const catRef = collection(db, 'categories')
      const q = query(catRef, orderBy('order', 'asc'))
      const snap = await getDocs(q)
      if (!snap.empty) {
        catList = snap.docs.map(doc => ({ id: doc.id as any, ...doc.data() } as Category))
      }
    }

    // Si Firestore vide, fallback
    if (catList.length === 0) {
      catList = [...INITIAL_CATEGORIES]
    }
    categories.value = catList

    // 2. Récupérer les produits pour les compteurs
    const prodRes = await FirestoreProductsService.getProducts()
    allProducts.value = prodRes.results || []
  } catch (err) {
    console.warn('[Categories] Erreur chargement:', err)
  } finally {
    loading.value = false
  }
}

// Initialisation par défaut
const seedDefaultCategories = async () => {
  if (!db) return
  if (!confirm('Voulez-vous synchroniser les 12 catégories par défaut vers Firestore ?')) return

  seeding.value = true
  try {
    for (const cat of INITIAL_CATEGORIES) {
      const clean = JSON.parse(JSON.stringify({
        ...cat,
        collectionSlug: (cat as any).collectionSlug || cat.collection?.slug || 'men',
        updatedAt: new Date().toISOString()
      }))
      await setDoc(doc(db, 'categories', cat.slug), clean)
    }
    alert('Catégories par défaut synchronisées avec succès !')
    await loadData()
  } catch (err: any) {
    alert(`Erreur d'initialisation : ${err.message}`)
  } finally {
    seeding.value = false
  }
}

// Modals
const openCreateModal = () => {
  isEditing.value = false
  modalForm.value = {
    id: Date.now(),
    name: '',
    slug: '',
    collectionSlug: selectedCollection.value || 'men',
    order: categories.value.length + 1,
    description: ''
  }
  showModal.value = true
}

const openEditModal = (cat: Category) => {
  isEditing.value = true
  modalForm.value = {
    id: Number(cat.id) || Date.now(),
    name: cat.name || '',
    slug: cat.slug || '',
    collectionSlug: getCatCollectionSlug(cat),
    order: cat.order || 1,
    description: cat.description || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// Sauvegarde
const saveCategory = async () => {
  if (!db) return
  saving.value = true

  try {
    const cleanSlug = modalForm.value.slug.trim()
    const payload = JSON.parse(JSON.stringify({
      id: modalForm.value.id || Date.now(),
      name: modalForm.value.name.trim(),
      slug: cleanSlug,
      collectionSlug: modalForm.value.collectionSlug,
      collection: {
        id: modalForm.value.collectionSlug === 'men' ? 1 : 2,
        name: getCollectionName(modalForm.value.collectionSlug),
        slug: modalForm.value.collectionSlug
      },
      order: Number(modalForm.value.order) || 1,
      description: modalForm.value.description.trim() || null,
      updatedAt: new Date().toISOString()
    }))

    await setDoc(doc(db, 'categories', cleanSlug), payload)
    await loadData()
    closeModal()
  } catch (err: any) {
    alert(`Erreur d'enregistrement : ${err.message}`)
  } finally {
    saving.value = false
  }
}

// Suppression
const confirmDelete = async (cat: Category) => {
  const prodCount = getProductCountForCategory(cat.slug)
  let confirmMsg = `Êtes-vous sûr de vouloir supprimer la catégorie "${cat.name}" ?`
  if (prodCount > 0) {
    confirmMsg += `\n⚠️ Attention : ${prodCount} produit(s) sont actuellement rattachés à cette catégorie !`
  }

  if (!confirm(confirmMsg)) return

  if (db) {
    try {
      await deleteDoc(doc(db, 'categories', cat.slug))
      await loadData()
    } catch (err: any) {
      alert(`Erreur de suppression : ${err.message}`)
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-title {
  font-size: 1.5rem;
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

/* Collection Cards */
.collection-kpi-card {
  background: #FFFFFF !important;
  border: 1px solid #E5E0D8;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  position: relative;
  z-index: 2;
}

.collection-kpi-card:hover {
  transform: translateY(-2px);
  border-color: #C9A46C;
  box-shadow: 0 4px 12px rgba(201, 164, 108, 0.15);
}

.collection-kpi-card.active {
  border-color: #0B0B0B;
  background: #FAF8F5 !important;
}

.collection-badge-kpi {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #7A7A7A;
}

.count-pill {
  background: #F5F2EC;
  color: #8C6D37;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
}

.collection-card-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0B0B0B;
  margin: 0;
}

/* Search Box */
.search-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #888;
}

.admin-search-control {
  padding-left: 36px;
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 6px;
  font-size: 0.875rem;
}

.admin-select-control {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-clear-search {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: #888;
}

/* Custom Table */
.custom-admin-table {
  background: #FFFFFF !important;
}

.custom-admin-table th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7A7A7A;
  font-weight: 600;
  border-bottom: 2px solid #F5F2EC;
  padding: 0.75rem 0.5rem;
  background: #FFFFFF !important;
}

.custom-admin-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #F5F2EC;
  background: #FFFFFF !important;
}

.order-number-badge {
  font-family: monospace;
  font-weight: 700;
  background: #FAF8F5;
  color: #555;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8125rem;
}

.category-name-text {
  font-weight: 600;
  color: #0B0B0B;
  display: block;
}

.category-slug-text {
  font-size: 0.75rem;
  color: #888;
  font-family: monospace;
}

.badge-collection {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.col-men {
  background: #e7f1ff;
  color: #0c63e4;
}

.col-women {
  background: #fce8e6;
  color: #c5221f;
}

.col-babouches {
  background: #fef7e0;
  color: #b06000;
}

.col-lins {
  background: #e6f4ea;
  color: #137333;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.btn-mems-gold:hover {
  background: #B89358;
}

/* Modal */
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(11, 11, 11, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog-custom {
  background: #FFFFFF;
  border-radius: 10px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header-luxury {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #E5E0D8;
  background: #FAF8F5;
}

.modal-title-custom {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0B0B0B;
  margin: 0;
}

.btn-close-luxury {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #7A7A7A;
  cursor: pointer;
}

.btn-close-luxury:hover {
  color: #0B0B0B;
}

.modal-body-content {
  padding: 1.5rem;
}

.modal-footer-luxury {
  padding: 1rem 1.5rem;
  border-top: 1px solid #E5E0D8;
  background: #FAF8F5;
}

.admin-input {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.admin-input:focus {
  background: #FFFFFF;
  border-color: #C9A46C;
  box-shadow: 0 0 0 3px rgba(201, 164, 108, 0.2);
}
</style>
