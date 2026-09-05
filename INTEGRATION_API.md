# Guide d'Intégration API Backend

Ce document explique comment utiliser l'API Django dans le frontend Nuxt.

## 🔗 Configuration

L'URL de l'API est configurée dans `nuxt.config.ts` :

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
  }
}
```

Créez un fichier `.env` à la racine du frontend :

```env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

## 📦 Store Pinia

Le store `products` gère l'état des produits et catégories.

### Utilisation

```typescript
import { useProductsStore } from '~/stores/products'

const productsStore = useProductsStore()

// Récupérer les produits
await productsStore.fetchProducts()

// Récupérer les produits avec filtres
await productsStore.fetchProducts({
  category: 'boubous',
  is_new: true,
  min_price: 30000,
  max_price: 50000
})

// Récupérer un produit par slug
const product = await productsStore.fetchProductBySlug('boubou-traditionnel-1')

// Récupérer les produits en vedette
const featured = await productsStore.fetchFeaturedProducts()

// Récupérer les nouveaux produits
const newArrivals = await productsStore.fetchNewArrivals()

// Récupérer les catégories
await productsStore.fetchCategories()

// Récupérer les catégories groupées par collection
const collections = await productsStore.fetchCategoriesByCollection()
```

## 🎣 Composable useProducts

Le composable `useProducts` fournit une interface simplifiée pour accéder aux produits.

### Utilisation dans un composant

```vue
<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

const { 
  fetchProducts,
  fetchFeaturedProducts,
  fetchNewArrivals,
  products,
  loading 
} = useProducts()

// Charger les produits au montage
onMounted(async () => {
  await fetchProducts({ collection: 'men' })
})
</script>

<template>
  <div>
    <div v-if="loading">Chargement...</div>
    <div v-else>
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>
```

## 📄 Exemples d'Utilisation

### Page de Collection (ex: /men)

```vue
<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

const { fetchProducts, products, loading } = useProducts()

onMounted(async () => {
  // Récupérer tous les produits de la collection Hommes
  await fetchProducts({ collection: 'men' })
})
</script>
```

### Page de Catégorie (ex: /men?category=boubous)

```vue
<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'
import { useRoute } from 'vue-router'

const route = useRoute()
const { fetchProducts, products, loading } = useProducts()

onMounted(async () => {
  const category = route.query.category as string
  if (category) {
    await fetchProducts({ category })
  }
})
</script>
```

### Page de Détail Produit

```vue
<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'
import { useRoute } from 'vue-router'

const route = useRoute()
const { fetchProductBySlug } = useProducts()

const product = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    product.value = await fetchProductBySlug(slug)
  } catch (error) {
    console.error('Produit non trouvé:', error)
  } finally {
    loading.value = false
  }
})
</script>
```

### Section Produits en Vedette

```vue
<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

const { fetchFeaturedProducts } = useProducts()
const featuredProducts = ref([])

onMounted(async () => {
  featuredProducts.value = await fetchFeaturedProducts()
})
</script>

<template>
  <section>
    <h2>Produits en Vedette</h2>
    <div class="products-grid">
      <ProductCard 
        v-for="product in featuredProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </section>
</template>
```

### Section Nouveautés

```vue
<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

const { fetchNewArrivals } = useProducts()
const newProducts = ref([])

onMounted(async () => {
  newProducts.value = await fetchNewArrivals()
})
</script>

<template>
  <section>
    <h2>Nouveautés</h2>
    <div class="products-grid">
      <ProductCard 
        v-for="product in newProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </section>
</template>
```

## 🔍 Filtres Disponibles

### Filtrer par catégorie
```typescript
await fetchProducts({ category: 'boubous' })
```

### Filtrer par collection
```typescript
await fetchProducts({ collection: 'men' })
```

### Filtrer par prix
```typescript
await fetchProducts({ 
  min_price: 30000, 
  max_price: 50000 
})
```

### Filtrer les nouveaux produits
```typescript
await fetchProducts({ is_new: true })
```

### Filtrer les produits en vedette
```typescript
await fetchProducts({ is_featured: true })
```

### Recherche textuelle
```typescript
await fetchProducts({ search: 'boubou' })
```

### Tri
```typescript
// Prix croissant
await fetchProducts({ ordering: 'price' })

// Prix décroissant
await fetchProducts({ ordering: '-price' })

// Plus récents
await fetchProducts({ ordering: '-created_at' })

// Alphabétique
await fetchProducts({ ordering: 'name' })
```

### Combiner plusieurs filtres
```typescript
await fetchProducts({
  collection: 'men',
  category: 'boubous',
  is_new: true,
  min_price: 40000,
  max_price: 60000,
  ordering: '-created_at'
})
```

## 📊 Structure des Données

### Product
```typescript
interface Product {
  id: number
  name: string
  slug: string
  description: string
  category: Category
  price: number
  discount_price?: number
  is_new: boolean
  is_featured: boolean
  stock: number
  images: ProductImage[]
  variants: ProductVariant[]
  created_at: string
  updated_at?: string
}
```

### Category
```typescript
interface Category {
  id: number
  name: string
  slug: string
  image?: string
  order: number
  collection_type: 'men' | 'women' | 'babouches' | 'lins'
}
```

### ProductImage
```typescript
interface ProductImage {
  id: number
  image: string
  is_primary: boolean
  order: number
}
```

### ProductVariant
```typescript
interface ProductVariant {
  id: number
  size: string
  color: string
  sku: string
  stock: number
}
```

## 🚀 Démarrage

1. **Démarrer le backend Django:**
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

2. **Démarrer le frontend Nuxt:**
```bash
cd frontend
npm run dev
```

3. **Accéder à l'application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Django: http://localhost:8000/admin

## 🔧 Dépannage

### Erreur CORS
Si vous rencontrez des erreurs CORS, vérifiez que `CORS_ALLOWED_ORIGINS` dans `backend/config/settings.py` inclut `http://localhost:3000`.

### Erreur 404 sur les endpoints
Vérifiez que le backend Django est bien démarré et que l'URL de l'API dans `.env` est correcte.

### Produits non affichés
Assurez-vous que la base de données a été peuplée :
```bash
cd backend
python manage.py populate_products --clear
```

## 📝 Notes

- Les images utilisent des URLs Unsplash comme placeholder
- La pagination retourne 20 produits par page
- Les prix sont en FCFA
- Les appels API sont automatiquement gérés par Nuxt avec `$fetch`
