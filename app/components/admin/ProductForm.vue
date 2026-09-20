<template>
  <form class="product-form" @submit.prevent="handleSubmit">
    <div class="row g-4">
      <!-- Colonne Principale : Infos Générales, Images & Variantes -->
      <div class="col-lg-8">
        <!-- Informations Générales -->
        <div class="content-card mb-4">
          <h4 class="card-clean-title mb-3">Informations Générales</h4>

          <div class="mb-3">
            <label class="form-label fw-medium">Nom du vêtement / produit <span class="text-danger">*</span></label>
            <input
              v-model="form.name"
              type="text"
              class="form-control admin-input"
              placeholder="Ex: Boubou Royal Brodé Or"
              required
              @input="onNameChange"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-medium">Slug / Identifiant URL</label>
            <div class="input-group">
              <span class="input-group-text bg-light text-muted small">/products/</span>
              <input
                v-model="form.slug"
                type="text"
                class="form-control admin-input"
                placeholder="boubou-royal-brode-or"
                required
              />
            </div>
            <small class="text-muted">Généré automatiquement depuis le nom, utilisé pour l'adresse de la page.</small>
          </div>

          <div class="mb-3">
            <label class="form-label fw-medium">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="form-control admin-input"
              placeholder="Décrivez les finitions, le tissu (coton glacé, lin, bazin), la coupe et le confort..."
            ></textarea>
          </div>
        </div>

        <!-- Galerie Photos & Téléversement Cloudinary -->
        <div class="content-card mb-4">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h4 class="card-clean-title mb-0">Photos du Produit</h4>
              <small class="text-muted">Téléversement direct dans votre dossier Cloudinary <code>MEMS</code></small>
            </div>
            <span class="badge bg-gold-subtle text-gold fw-bold">
              {{ form.images.length }} photo(s)
            </span>
          </div>

          <!-- Composant Cloudinary Uploader -->
          <ImageUploader v-model="form.images" folder="MEMS" />
        </div>

        <!-- Tailles & Variantes -->
        <div class="content-card">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h4 class="card-clean-title mb-0">Tailles & Variantes</h4>
              <small class="text-muted">Gérez les disponibilités par taille (S, M, L, XL, etc.)</small>
            </div>
            <button type="button" class="btn btn-sm btn-outline-dark" @click="addVariant">
              <i class="bi bi-plus-lg me-1"></i> Ajouter une taille
            </button>
          </div>

          <div v-if="form.variants.length === 0" class="text-center py-3 text-muted border rounded bg-light">
            <small>Aucune variante spécifique. Le stock principal sera utilisé.</small>
          </div>

          <div v-else class="variants-list d-flex flex-column gap-2">
            <div
              v-for="(variant, vIndex) in form.variants"
              :key="vIndex"
              class="variant-row-card p-3 border rounded d-flex flex-wrap align-items-center gap-3 bg-light"
            >
              <!-- Attribut Taille -->
              <div class="flex-grow-1" style="min-width: 120px;">
                <label class="small text-muted mb-1 d-block">Taille / Variante</label>
                <input
                  v-model="variant.attributes[0].value"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Ex: M, L, 42..."
                />
              </div>

              <!-- SKU -->
              <div style="width: 140px;">
                <label class="small text-muted mb-1 d-block">SKU / Réf</label>
                <input
                  v-model="variant.sku"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="BOU-M-01"
                />
              </div>

              <!-- Stock -->
              <div style="width: 100px;">
                <label class="small text-muted mb-1 d-block">Stock</label>
                <input
                  v-model.number="variant.stock"
                  type="number"
                  min="0"
                  class="form-control form-control-sm"
                />
              </div>

              <!-- Supprimer -->
              <div class="align-self-end mb-1">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  @click="removeVariant(vIndex)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne Latérale : Organisation, Prix & Statuts -->
      <div class="col-lg-4">
        <!-- Organisation & Catégorie -->
        <div class="content-card mb-4">
          <h4 class="card-clean-title mb-3">Classement</h4>

          <div class="mb-3">
            <label class="form-label fw-medium">Catégorie <span class="text-danger">*</span></label>
            <select v-model="selectedCategorySlug" class="form-select admin-select-control" required @change="onCategorySelect">
              <option value="" disabled>Sélectionner une catégorie</option>
              <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
                {{ cat.name }} ({{ cat.collectionSlug || cat.collection?.name || 'Collection' }})
              </option>
            </select>
          </div>

          <div v-if="currentCategory" class="category-summary p-2 rounded bg-light border">
            <small class="text-muted d-block">Collection parente :</small>
            <span class="fw-bold text-dark text-capitalize">
              {{ currentCategory.collectionSlug || currentCategory.collection?.name }}
            </span>
          </div>
        </div>

          <!-- Tarification & Stock -->
          <div class="content-card mb-4">
            <h4 class="card-clean-title mb-3">Tarification & Stock</h4>

            <div class="mb-3">
              <label class="form-label fw-medium">Prix Standard (FCFA) <span class="text-danger">*</span></label>
              <div class="input-group">
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="500"
                  class="form-control admin-input"
                  placeholder="45000"
                  required
                />
                <span class="input-group-text">FCFA</span>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex align-items-center justify-content-between mb-1">
                <label class="form-label fw-medium mb-0">Prix Promotionnel (Optionnel)</label>
                <button
                  v-if="form.discount_price"
                  type="button"
                  class="btn btn-link text-danger p-0 text-decoration-none small"
                  style="font-size: 0.75rem;"
                  @click="form.discount_price = undefined"
                >
                  <i class="bi bi-x-circle me-1"></i>Supprimer la promo
                </button>
              </div>
              <div class="input-group">
                <input
                  v-model.number="form.discount_price"
                  type="number"
                  min="0"
                  step="500"
                  class="form-control admin-input"
                  placeholder="Laisser vide si pas de promo"
                />
                <span class="input-group-text">FCFA</span>
              </div>
              <small class="text-muted d-block mt-1">
                <span v-if="form.discount_price && Number(form.discount_price) > 0" class="text-success fw-medium">
                  <i class="bi bi-info-circle me-1"></i>Prix affiché en boutique : {{ formatFormPrice(form.discount_price) }} FCFA (barré : {{ formatFormPrice(form.price) }} FCFA)
                </span>
                <span v-else>
                  Le prix standard ({{ formatFormPrice(form.price) }} FCFA) sera le prix affiché en boutique.
                </span>
              </small>
            </div>

            <div class="mb-3">
              <label class="form-label fw-medium">Stock Global <span class="text-danger">*</span></label>
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                class="form-control admin-input"
                required
              />
            </div>
          </div>


        <!-- Options & Visibilité -->
        <div class="content-card mb-4">
          <h4 class="card-clean-title mb-3">Options d'Affichage</h4>

          <div class="form-check form-switch mb-3">
            <input
              id="switchNew"
              v-model="form.is_new"
              class="form-check-input"
              type="checkbox"
            />
            <label class="form-check-label fw-medium" for="switchNew">
              Marquer comme NOUVEAU
            </label>
            <small class="text-muted d-block">Affiche le badge terracotta "Nouveau" et l'intègre dans la section Nouveautés.</small>
          </div>

          <div class="form-check form-switch">
            <input
              id="switchFeatured"
              v-model="form.is_featured"
              class="form-check-input"
              type="checkbox"
            />
            <label class="form-check-label fw-medium" for="switchFeatured">
              Mettre en VEDETTE
            </label>
            <small class="text-muted d-block">Met en avant l'article sur la page d'accueil dans la sélection prestige.</small>
          </div>
        </div>

        <!-- Boutons d'Action -->
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-mems-gold py-2 fw-semibold" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ isEdit ? 'Mettre à jour le produit' : 'Créer le produit' }}
          </button>
          <NuxtLink :to="{ path: '/admin/products', query: route.query }" class="btn btn-outline-secondary">
            Annuler
          </NuxtLink>
        </div>
      </div>
    </div>
  </form>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import { useFirebase } from '../../../composables/useFirebase'
import { useNotification } from '../../../composables/useNotification'
import { useProductsStore } from '../../../stores/products'
import { FirestoreProductsService } from '../../../services/firestoreProducts'
import ImageUploader from './ImageUploader.vue'
import type { Product, Category } from '../../../types/product'

const props = defineProps<{
  initialProduct?: Product | null
  isEdit?: boolean
}>()

const route = useRoute()
const router = useRouter()
const { db } = useFirebase()

const notify = useNotification()
const productsStore = useProductsStore()

const formatFormPrice = (val: number | string | undefined | null) => {
  if (!val) return '0'
  const n = typeof val === 'string' ? parseFloat(val) : val
  return isNaN(n) ? '0' : new Intl.NumberFormat('fr-FR').format(n)
}

const categories = ref<Category[]>([])
const selectedCategorySlug = ref('')
const submitting = ref(false)

const form = ref({
  id: Date.now(),
  name: '',
  slug: '',
  description: '',
  price: 35000,
  discount_price: undefined as number | undefined,
  stock: 10,
  is_new: false,
  is_featured: false,
  images: [] as any[],
  variants: [] as any[]
})

const currentCategory = computed(() => {
  return categories.value.find(c => c.slug === selectedCategorySlug.value) || null
})

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const onNameChange = () => {
  form.value.slug = slugify(form.value.name)
}


const onCategorySelect = () => {
  // Optionnel: logiques dérivées
}

const addVariant = () => {
  const vNum = form.value.variants.length + 1
  form.value.variants.push({
    id: Date.now() + vNum,
    sku: `${form.value.slug ? form.value.slug.substring(0, 4).toUpperCase() : 'MEM'}-V${vNum}`,
    stock: 5,
    attributes: [
      { name: 'Taille', value: 'L' }
    ]
  })
}

const removeVariant = (index: number) => {
  form.value.variants.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.name || !selectedCategorySlug.value) {
    alert('Veuillez renseigner au moins le nom et la catégorie.')
    return
  }

  submitting.value = true
  const cat = currentCategory.value

  const discountVal = (form.value.discount_price && Number(form.value.discount_price) > 0)
    ? Number(form.value.discount_price)
    : null

  const payload: any = {
    id: form.value.id || Date.now(),
    name: form.value.name.trim(),
    slug: (form.value.slug || slugify(form.value.name)).trim(),
    description: form.value.description.trim(),
    price: Number(form.value.price) || 0,
    discount_price: discountVal,
    stock: Number(form.value.stock) || 0,
    is_new: Boolean(form.value.is_new),
    is_featured: Boolean(form.value.is_featured),
    category: {
      id: cat?.id || 1,
      name: cat?.name || 'Vêtements',
      slug: cat?.slug || selectedCategorySlug.value,
      collectionSlug: (cat as any)?.collectionSlug || cat?.collection?.slug || 'men'
    },
    images: form.value.images.map((img, idx) => {
      if (typeof img === 'string') {
        return { id: idx + 1, image: img, is_primary: idx === 0, order: idx + 1 }
      }
      return {
        id: img.id || idx + 1,
        image: img.image,
        is_primary: Boolean(img.is_primary),
        order: img.order || idx + 1
      }
    }),
    variants: form.value.variants,
    updated_at: new Date().toISOString()
  }

  // Nettoyage pour Firestore (zéro undefined, null préservé)
  const cleanData = JSON.parse(JSON.stringify(payload))

  if (db) {
    try {
      // Si on modifie un produit existant et que le slug a changé, supprimer l'ancien document Firestore
      if (props.isEdit && props.initialProduct?.slug && props.initialProduct.slug !== cleanData.slug) {
        try {
          await deleteDoc(doc(db, 'products', props.initialProduct.slug))
          FirestoreProductsService.removeLocalProduct(props.initialProduct.slug)
          productsStore.removeProduct(props.initialProduct.slug)
        } catch (delErr) {
          console.warn('[ProductForm] Suppression ancien slug Firestore:', delErr)
        }
      }

      await setDoc(doc(db, 'products', cleanData.slug), cleanData)
      // 1. Mise à jour instantanée du store Pinia pour réactivité Vue 3 immédiate
      productsStore.updateProduct(cleanData)
      // 2. Mise à jour du cache local et localStorage
      FirestoreProductsService.updateLocalProduct(cleanData)
    } catch (err: any) {
      console.error('[ProductForm] Erreur sauvegarde Firestore:', err)
      alert(`Erreur d'enregistrement : ${err.message}`)
      submitting.value = false
      return
    }
  } else {
    // Si pas de db connectée
    productsStore.updateProduct(cleanData)
    FirestoreProductsService.updateLocalProduct(cleanData)
  }

  notify.success(props.isEdit ? `« ${cleanData.name} » mis à jour avec succès !` : `« ${cleanData.name} » créé avec succès !`)
  submitting.value = false
  router.push({ path: '/admin/products', query: route.query })
}



const populateForm = (p: Product) => {
  form.value = {
    id: p.id as any,
    name: p.name || '',
    slug: p.slug || '',
    description: p.description || '',
    price: p.price || 0,
    discount_price: p.discount_price,
    stock: p.stock || 0,
    is_new: Boolean(p.is_new),
    is_featured: Boolean(p.is_featured),
    images: Array.isArray(p.images) ? [...p.images] : [],
    variants: Array.isArray(p.variants) ? [...p.variants] : []
  }
  if (p.category?.slug) {
    selectedCategorySlug.value = p.category.slug
  }
}

// Watcher réactif pour peupler automatiquement dès que le produit est disponible
watch(
  () => props.initialProduct,
  (newVal) => {
    if (newVal) {
      populateForm(newVal)
    }
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  try {
    const catList = await FirestoreProductsService.getCategories()
    categories.value = catList || []

    if (props.initialProduct) {
      populateForm(props.initialProduct)
    } else if (categories.value.length > 0 && !selectedCategorySlug.value) {
      selectedCategorySlug.value = categories.value[0].slug
    }
  } catch (err) {
    console.warn('[ProductForm] Erreur montage:', err)
  }
})
</script>

<style scoped>
.content-card {
  background: #FFFFFF !important;
  border-radius: 6px;
  border: 1px solid #EAE6DF;
  padding: 1.15rem 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: relative;
  z-index: 2;
}

.card-clean-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0B0B0B;
}

.form-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #8C827A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.admin-input,
.admin-select-control {
  background: #FAF8F5;
  border: 1px solid #EAE6DF;
  border-radius: 4px;
  padding: 0.45rem 0.75rem;
  font-size: 0.8125rem;
}

.admin-input:focus,
.admin-select-control:focus {
  border-color: #C9A46C;
  box-shadow: 0 0 0 2px rgba(201, 164, 108, 0.15);
  background: #FFFFFF;
}

.bg-gold-subtle {
  background: rgba(201, 164, 108, 0.15);
}

.text-gold {
  color: #C9A46C !important;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 500;
  border-radius: 4px;
  font-size: 0.8125rem;
  padding: 0.45rem 1rem;
}

.btn-mems-gold:hover {
  background: #B89358;
}

.variant-row-card {
  border: 1px solid #EAE6DF !important;
  border-radius: 4px !important;
  padding: 0.6rem 0.75rem !important;
  background: #FAF8F5 !important;
}
</style>
