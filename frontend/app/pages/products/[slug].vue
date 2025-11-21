<template>
    <div class="product-detail-page">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <p class="loading-text">Chargement du produit...</p>
        </div>

        <!-- Product Not Found -->
        <div v-else-if="!product" class="not-found-container">
            <div class="not-found-content">
                <i class="bi bi-exclamation-circle"></i>
                <h2>Produit non trouvé</h2>
                <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
                <NuxtLink to="/" class="btn-back-home">Retour à l'accueil</NuxtLink>
            </div>
        </div>

        <!-- Product Content -->
        <div v-else class="product-content">
            <div class="container">
                <div class="product-grid">
                    <!-- African Pattern Background -->
                    <AfricanPatternBackground opacity="light" color="gold" />

                    <!-- Left Side - Image Gallery -->
                    <div class="product-gallery">
                        <!-- Breadcrumb with Navigation Arrows -->
                        <div class="breadcrumb-wrapper">
                            <nav class="breadcrumb">
                                <NuxtLink to="/" class="breadcrumb-item">Accueil</NuxtLink>
                                <span class="breadcrumb-separator">›</span>
                                <NuxtLink v-if="previousPage.path" :to="previousPage.path" class="breadcrumb-item">{{
                                    previousPage.name }}</NuxtLink>
                                <span v-if="previousPage.path" class="breadcrumb-separator">›</span>
                                <NuxtLink v-if="categoryInfo.path" :to="categoryInfo.path" class="breadcrumb-item">{{
                                    categoryInfo.name }}</NuxtLink>
                                <span v-if="categoryInfo.path" class="breadcrumb-separator">›</span>
                                <span class="breadcrumb-item active">{{ product?.name }}</span>
                            </nav>

                            <!-- Navigation Arrows (visible on mobile) -->
                            <div class="product-navigation product-navigation-breadcrumb">
                                <button class="nav-arrow" :disabled="!canGoToPrevious" @click="goToPreviousProduct"
                                    aria-label="Produit précédent">
                                    <i class="bi bi-arrow-left"></i>
                                </button>
                                <button class="nav-arrow" :disabled="!canGoToNext" @click="goToNextProduct"
                                    aria-label="Produit suivant">
                                    <i class="bi bi-arrow-right"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Gallery Content -->
                        <div class="gallery-content">
                            <!-- Thumbnails -->
                            <div class="thumbnails">
                                <button v-for="(image, index) in product?.images" :key="index"
                                    @click="currentImageIndex = index"
                                    :class="['thumbnail', { active: currentImageIndex === index }]">
                                    <img :src="image.image" :alt="`${product?.name} - Image ${index + 1}`" />
                                </button>
                            </div>

                            <!-- Main Image -->
                            <div class="main-image-container">
                                <img :src="currentImage" :alt="product?.name" class="main-image" />
                            </div>
                        </div>
                    </div>

                    <!-- Right Side - Product Info -->
                    <div class="product-info">
                        <!-- Navigation Arrows -->
                        <div class="product-navigation">
                            <button class="nav-arrow" :disabled="!canGoToPrevious" @click="goToPreviousProduct"
                                aria-label="Produit précédent">
                                <i class="bi bi-arrow-left"></i>
                            </button>
                            <button class="nav-arrow" :disabled="!canGoToNext" @click="goToNextProduct"
                                aria-label="Produit suivant">
                                <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>

                        <!-- Product Title -->
                        <h1 class="product-title">{{ product?.name }}</h1>

                        <!-- Price -->
                        <div class="product-price">
                            <span v-if="product?.discount_price" class="original-price">{{ product?.price }} FCFA</span>
                            <span class="current-price">{{ product?.discount_price || product?.price }} FCFA</span>
                        </div>

                        <!-- Variants Grid -->
                        <div class="variants-grid">
                            <div v-for="(values, name) in allAvailableAttributes" :key="name" class="variant-group">
                                <label class="variant-label">{{ name }}</label>
                                <select v-model="selectedAttributes[name]" class="variant-select">
                                    <option value="">Sélectionner</option>
                                    <option v-for="value in values" :key="value" :value="value">{{ value }}</option>
                                </select>
                            </div>
                        </div>

                        <!-- Quantity and Add to Cart Row -->
                        <div class="cart-actions-row">
                            <div class="quantity-controls">
                                <button @click="decreaseQuantity" class="quantity-btn">-</button>
                                <input v-model.number="quantity" type="number" min="1" class="quantity-input"
                                    readonly />
                                <button @click="increaseQuantity" class="quantity-btn">+</button>
                            </div>

                            <!-- Add to Basket Button -->
                            <button @click="addToCart" class="btn-add-to-cart">
                                <i class="bi bi-cart"></i>
                                Ajouter au panier
                            </button>
                        </div>

                        <!-- WhatsApp Order Button -->
                        <button @click="orderViaWhatsApp" class="btn-whatsapp">
                            <i class="bi bi-whatsapp"></i>
                            Commander sur WhatsApp
                        </button>

                        <!-- Product Description -->
                        <div class="product-description">
                            <p>{{ product?.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Similar Products Section -->
                <div v-if="similarProducts.length > 0" class="similar-products-section">
                    <div class="section-header">
                        <h2 class="section-title">Produits Similaires</h2>
                        <div class="title-underline"></div>
                    </div>

                    <div class="similar-products-grid">
                        <ProductCard v-for="similarProduct in similarProducts" :key="similarProduct.id"
                            :product="formatProductForCard(similarProduct)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../../../stores/cart'
import { useProducts } from '../../../composables/useProducts'
import type { Product } from '../../../types/product'
import AfricanPatternBackground from '../../components/AfricanPatternBackground.vue'
import ProductCard from '../../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { fetchProductBySlug, fetchProducts } = useProducts()

// Charger le produit dynamiquement basé sur le slug
const product = ref<Product | null>(null)
const loading = ref(true)

// Détecter la page précédente
const previousPage = ref<{ name: string; path: string }>({ name: '', path: '' })
const categoryInfo = ref<{ name: string; path: string }>({ name: '', path: '' })

// Mapping des routes vers des noms lisibles
const routeNames: Record<string, string> = {
    '/': 'Accueil',
    '/men': 'Hommes',
    '/women': 'Femmes',
    '/babouches': 'Babouches',
    '/lins': 'Lins',
    '/nouveautes': 'Nouveautés',
    '/vedettes': 'Vedettes'
}

// Mapping des catégories vers des noms et chemins
const categoryMapping: Record<string, { name: string; parentPath: string }> = {
    'boubous': { name: 'Boubous', parentPath: '/men' },
    'gandouras': { name: 'Gandouras', parentPath: '/men' },
    'costumes': { name: 'Costumes', parentPath: '/men' },
    'chemises': { name: 'Chemises', parentPath: '/men' },
    'pantalons': { name: 'Pantalons', parentPath: '/men' },
    'robes': { name: 'Robes', parentPath: '/women' },
    'ensembles': { name: 'Ensembles', parentPath: '/women' },
    'sacs': { name: 'Sacs', parentPath: '/women' },
    'chemises-lin': { name: 'Chemises Lin', parentPath: '/lins' },
    'pantalons-lin': { name: 'Pantalons Lin', parentPath: '/lins' },
    'babouches-cuir': { name: 'Babouches Cuir', parentPath: '/babouches' },
    'babouches-brodees': { name: 'Babouches Brodées', parentPath: '/babouches' }
}

// Charger le produit au montage
onMounted(async () => {
    const slug = route.params.slug as string
    try {
        loading.value = true
        product.value = await fetchProductBySlug(slug)

        // Charger les produits de la même catégorie pour la navigation
        if (product.value?.category?.slug) {
            await loadCategoryProducts(product.value.category.slug)
        }
    } catch (error) {
        console.error('Erreur lors du chargement du produit:', error)
    } finally {
        loading.value = false
    }

    // Détecter la page précédente depuis le referrer
    const referrer = document.referrer
    if (referrer) {
        try {
            const referrerUrl = new URL(referrer)
            const referrerPath = referrerUrl.pathname

            // Vérifier si le referrer est une page connue
            if (routeNames[referrerPath]) {
                previousPage.value = {
                    name: routeNames[referrerPath],
                    path: referrerPath
                }
            }
        } catch (e) {
            // Si erreur de parsing, on ne fait rien
        }
    }

    // Définir les informations de catégorie basées sur le produit
    if (product.value?.category?.slug) {
        const categorySlug = product.value.category.slug
        const categoryData = categoryMapping[categorySlug]

        if (categoryData) {
            categoryInfo.value = {
                name: categoryData.name,
                path: categoryData.parentPath
            }

            // Si aucune page précédente n'est détectée, utiliser la page parente de la catégorie
            if (!previousPage.value.path) {
                previousPage.value = {
                    name: routeNames[categoryData.parentPath] || '',
                    path: categoryData.parentPath
                }
            }
        }
    }
})

// State
const currentImageIndex = ref(0)
const selectedAttributes = ref<Record<string, string>>({})
const quantity = ref(1)
const categoryProducts = ref<Product[]>([])
const currentProductIndex = ref(-1)
const similarProducts = ref<Product[]>([])

// Charger les produits de la même catégorie pour la navigation
const loadCategoryProducts = async (categorySlug: string) => {
    try {
        const response = await fetchProducts({ category: categorySlug })
        categoryProducts.value = response.results

        // Trouver l'index du produit actuel
        const slug = route.params.slug as string
        currentProductIndex.value = categoryProducts.value.findIndex(p => p.slug === slug)

        // Charger les produits similaires (exclure le produit actuel, max 4 produits)
        similarProducts.value = categoryProducts.value
            .filter(p => p.slug !== slug)
            .slice(0, 4)
    } catch (error) {
        console.error('Erreur lors du chargement des produits de la catégorie:', error)
    }
}

// Formater un produit pour le ProductCard
const formatProductForCard = (product: Product) => {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.discount_price || product.price,
        originalPrice: product.discount_price ? product.price : undefined,
        images: product.images.map(img => img.image),
        badge: product.is_new ? { type: 'new', text: 'NOUVEAU' } :
            product.is_featured ? { type: 'featured', text: 'VEDETTE' } :
                undefined
    }
}

// Navigation vers le produit précédent
const goToPreviousProduct = () => {
    if (currentProductIndex.value > 0) {
        const previousProduct = categoryProducts.value[currentProductIndex.value - 1]
        if (previousProduct) {
            router.push(`/products/${previousProduct.slug}`)
        }
    }
}

// Navigation vers le produit suivant
const goToNextProduct = () => {
    if (currentProductIndex.value < categoryProducts.value.length - 1) {
        const nextProduct = categoryProducts.value[currentProductIndex.value + 1]
        if (nextProduct) {
            router.push(`/products/${nextProduct.slug}`)
        }
    }
}

// Vérifier si on peut naviguer
const canGoToPrevious = computed(() => currentProductIndex.value > 0)
const canGoToNext = computed(() => currentProductIndex.value < categoryProducts.value.length - 1 && categoryProducts.value.length > 0)

// Computed
const currentImage = computed(() => {
    if (product.value?.images && product.value.images.length > 0) {
        return product.value.images[currentImageIndex.value]?.image || ''
    }
    return ''
})

const allAvailableAttributes = computed(() => {
    if (!product.value?.variants) return {}

    const attributes: Record<string, Set<string>> = {}

    product.value.variants.forEach(variant => {
        // Handle dynamic attributes
        if (variant.attributes) {
            variant.attributes.forEach(attr => {
                if (!attributes[attr.name]) {
                    attributes[attr.name] = new Set()
                }
                attributes[attr.name]?.add(attr.value)
            })
        }
    })

    // Convert Sets to Arrays
    const result: Record<string, string[]> = {}
    for (const [key, value] of Object.entries(attributes)) {
        result[key] = Array.from(value)
    }

    return result
})

// Methods
const increaseQuantity = () => {
    quantity.value++
}

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--
    }
}

const addToCart = () => {
    if (!product.value) return

    // Validate selection
    const requiredAttributes = Object.keys(allAvailableAttributes.value)
    const missingAttributes = requiredAttributes.filter(attr => !selectedAttributes.value[attr])

    if (missingAttributes.length > 0) {
        alert(`Veuillez sélectionner : ${missingAttributes.join(', ')}`)
        return
    }

    // Find matching variant
    const selectedVariant = product.value.variants.find(v => {
        // Check dynamic attributes
        if (v.attributes) {
            for (const attr of v.attributes) {
                if (selectedAttributes.value[attr.name] !== attr.value) return false
            }
        }

        return true
    })

    if (!selectedVariant) {
        alert('Cette combinaison n\'est pas disponible.')
        return
    }

    cartStore.addItem(product.value, selectedVariant, quantity.value)

    // Reset selection (optional)
    // selectedAttributes.value = {}

    // Feedback user
    alert('Produit ajouté au panier !')
}

const orderViaWhatsApp = () => {
    if (!product.value) return

    const config = useRuntimeConfig()
    const whatsappNumber = config.public.whatsappNumber

    // Construire le message WhatsApp
    let variantsMessage = ''
    for (const [key, value] of Object.entries(selectedAttributes.value)) {
        if (value) {
            variantsMessage += `- ${key}: ${value}\n`
        }
    }

    const message = `Bonjour, je suis intéressé(e) par ce produit:\n\n` +
        `*${product.value.name}*\n` +
        `Prix: ${product.value.discount_price || product.value.price} FCFA\n` +
        `Quantité: ${quantity.value}\n\n` +
        `Variantes sélectionnées:\n` +
        variantsMessage

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
}

// Watcher pour recharger le produit quand le slug change (navigation entre produits)
watch(() => route.params.slug, async (newSlug) => {
    if (newSlug) {
        try {
            loading.value = true
            product.value = await fetchProductBySlug(newSlug as string)

            // Mettre à jour l'index du produit actuel et les produits similaires
            currentProductIndex.value = categoryProducts.value.findIndex(p => p.slug === newSlug)
            similarProducts.value = categoryProducts.value
                .filter(p => p.slug !== newSlug)
                .slice(0, 4)

            // Réinitialiser les sélections
            currentImageIndex.value = 0
            selectedAttributes.value = {}
            quantity.value = 1

            // Scroll vers le haut
            if (process.client) {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } catch (error) {
            console.error('Erreur lors du chargement du produit:', error)
        } finally {
            loading.value = false
        }
    }
})
</script>

<style scoped>
.product-detail-page {
    background: #F5F2EC;
    min-height: 100vh;
    padding-top: 80px;
}

/* Product Content */
.product-content {
    padding: 0.5rem 0 3rem;
}

/* Breadcrumb Wrapper */
.breadcrumb-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding: 0;
}

/* Breadcrumb */
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.75rem;
    margin: 0;
    padding: 0;
}

.breadcrumb-item {
    color: #2A2A2A;
    text-decoration: none;
    transition: color 0.3s ease;
}

.breadcrumb-item:hover {
    color: #C9A46C;
}

.breadcrumb-item.active {
    color: #0E3A34;
    font-weight: 500;
}

.breadcrumb-separator {
    color: #2A2A2A;
    opacity: 0.5;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
}

.product-grid {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    background: #F5F2EC;
    padding: 3rem;
    border-radius: 4px;
    box-shadow: none;
}

/* Product Gallery */
.product-gallery {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0;
}

.gallery-content {
    display: flex;
    gap: 1rem;
}

.thumbnails {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.thumbnail {
    width: 80px;
    height: 100px;
    border: 2px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    background: none;
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.thumbnail:hover {
    border-color: #C9A46C;
}

.thumbnail.active {
    border-color: #0E3A34;
}

.main-image-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    max-height: 80vh;
    /* Prevent image from becoming too tall on large screens */
}

/* Product Info */
.product-info {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding-top: 2rem;
}

.product-navigation {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    gap: 0.5rem;
    z-index: 10;
}

.product-navigation-breadcrumb {
    display: none;
}

.nav-arrow {
    width: 40px;
    height: 40px;
    border: 1px solid #2A2A2A;
    background: transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #2A2A2A;
    font-size: 1.125rem;
}

.nav-arrow:hover:not(:disabled) {
    background: #0E3A34;
    border-color: #0E3A34;
    color: #F5F2EC;
}

.nav-arrow:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.product-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 3rem 0 0 0;
    letter-spacing: 0.5px;
    width: 100%;
    text-align: center;
}

.product-price {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
}

.original-price {
    font-size: 1.25rem;
    color: #2A2A2A;
    text-decoration: line-through;
    font-family: 'Montserrat', sans-serif;
}

.current-price {
    font-size: 2rem;
    font-weight: 700;
    color: #C9A46C;
    font-family: 'Montserrat', sans-serif;
}

/* Variants Grid */
.variants-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem 2rem;
    width: 100%;
    max-width: 600px;
}

.variant-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.variant-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.8125rem;
    font-weight: 400;
    color: #999;
    text-align: left;
}

.variant-select {
    padding: 0.75rem 1rem;
    border: none;
    border-bottom: 1px solid #E5E5E5;
    background: transparent;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #0B0B0B;
    cursor: pointer;
    transition: border-color 0.3s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    padding-right: 2rem;
}

.variant-select:focus {
    outline: none;
    border-bottom-color: #0B0B0B;
}

/* Cart Actions Row */
.cart-actions-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 600px;
}

/* Quantity Controls */
.quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.quantity-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #E5E5E5;
    background: transparent;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.125rem;
    color: #0B0B0B;
    transition: all 0.3s ease;
}

.quantity-btn:hover {
    background: #F5F2EC;
    border-color: #0B0B0B;
}

.quantity-input {
    width: 60px;
    height: 36px;
    border: none;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    color: #0B0B0B;
    background: transparent;
}

.quantity-input:focus {
    outline: none;
}

/* Add to Basket Button */
.btn-add-to-cart {
    flex: 1;
    padding: 0.75rem 1.5rem;
    background: #0E3A34;
    color: #FFFFFF;
    border: none;
    font-size: 0.9375rem;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    height: 48px;
}

.btn-add-to-cart:hover {
    background: #0A2A26;
}

.btn-add-to-cart i {
    font-size: 1.125rem;
}

/* WhatsApp Button */
.btn-whatsapp {
    width: 100%;
    max-width: 600px;
    padding: 1rem 2rem;
    background: #25D366;
    color: #FFFFFF;
    border: none;
    font-size: 0.9375rem;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
}

.btn-whatsapp:hover {
    background: #20BA5A;
}

.btn-whatsapp i {
    font-size: 1.25rem;
}

/* Product Description */
.product-description {
    width: 100%;
    max-width: 600px;
    padding: 1.5rem 0;
    border-top: 1px solid #E5E5E5;
}

.product-description p {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #2A2A2A;
    margin: 0;
    text-align: center;
}

/* Loading State */
.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 3rem;
}

.loading-text {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.125rem;
    color: #2A2A2A;
}

/* Not Found State */
.not-found-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 3rem;
}

.not-found-content {
    text-align: center;
    max-width: 500px;
}

.not-found-content i {
    font-size: 4rem;
    color: #C9A46C;
    margin-bottom: 1.5rem;
}

.not-found-content h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
}

.not-found-content p {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.125rem;
    color: #2A2A2A;
    margin: 0 0 2rem 0;
    line-height: 1.6;
}

.btn-back-home {
    display: inline-block;
    padding: 0.875rem 2rem;
    background: #0E3A34;
    color: #F5F2EC;
    border: 2px solid #0E3A34;
    font-size: 0.9375rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 2px;
    text-decoration: none;
}

.btn-back-home:hover {
    background: transparent;
    color: #0E3A34;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
        padding: 2rem;
    }

    .product-title {
        font-size: 2.25rem;
    }

    /* Cacher les flèches desktop sur tablette */
    .product-info .product-navigation {
        display: none;
    }

    /* Afficher les flèches à droite du breadcrumb sur tablette */
    .product-navigation-breadcrumb {
        display: flex !important;
    }
}

/* Responsive - Mobile */
@media (max-width: 767px) {
    .product-detail-page {
        padding-top: 80px;
    }

    .product-content {
        padding: 1.5rem 0 2rem;
    }

    .product-grid {
        padding: 0;
        gap: 1rem;
    }

    /* Gallery mobile: image principale en haut, thumbnails en dessous */
    .product-gallery {
        flex-direction: column;
        position: relative;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
    }

    /* Trait stylisé après la galerie sur mobile */
    .product-gallery::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 2rem);
        height: 1px;
        background: linear-gradient(to right,
                transparent 0%,
                #C9A46C 20%,
                #C9A46C 80%,
                transparent 100%);
        opacity: 0.3;
    }

    .gallery-content {
        flex-direction: column;
        gap: 1rem;
    }

    /* Image principale en grand */
    .main-image-container {
        width: 100%;
        padding-top: 0;
        height: auto;
        order: 1;
    }

    /* Cacher les flèches desktop sur mobile */
    .product-info .product-navigation {
        display: none;
    }

    /* Afficher les flèches sur la ligne du breadcrumb */
    .product-navigation-breadcrumb {
        display: flex !important;
    }

    .breadcrumb-wrapper {
        padding: 0;
    }

    /* Thumbnails en dessous en horizontal */
    .thumbnails {
        flex-direction: row;
        gap: 0.5rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0;
        order: 2;
        justify-content: flex-start;
    }

    .thumbnail {
        flex-shrink: 0;
        width: 70px;
        height: 88px;
    }

    .breadcrumb {
        padding: 0;
        margin: 0;
        flex: 1;
        overflow: hidden;
    }

    .breadcrumb-item {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .product-title {
        font-size: 1.75rem;
        padding-right: 0;
        margin: 0 0 0 0;
    }

    .product-info {
        gap: 1.5rem;
        padding-top: 0;
    }

    .current-price {
        font-size: 1.5rem;
    }

    .variants-grid {
        grid-template-columns: 1fr;
    }

    .nav-arrow {
        width: 30px;
        height: 30px;
        font-size: 0.875rem;
    }

    .product-navigation-breadcrumb .nav-arrow {
        width: 28px;
        height: 28px;
        font-size: 0.8125rem;
    }

    .cart-actions-row {
        flex-direction: column;
        gap: 1rem;
    }

    .quantity-controls {
        width: 100%;
        justify-content: center;
    }

    .btn-add-to-cart {
        width: 100%;
    }
}

/* Similar Products Section */
.similar-products-section {
    position: relative;
    z-index: 2;
    margin-top: 5rem;
    padding: 3rem 0;
}

.section-header {
    text-align: center;
    margin-bottom: 3rem;
}

.section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 2rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.title-underline {
    width: 80px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
    margin: 0 auto;
}

.similar-products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

/* Responsive - Similar Products */
@media (max-width: 1024px) {
    .similar-products-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.5rem;
    }
}

@media (max-width: 767px) {
    .similar-products-section {
        margin-top: 3rem;
        padding: 2rem 0;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .similar-products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}
</style>
