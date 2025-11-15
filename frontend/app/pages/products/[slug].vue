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
                                <NuxtLink to="/" class="breadcrumb-item">Home</NuxtLink>
                                <span class="breadcrumb-separator">›</span>
                                <NuxtLink to="/products" class="breadcrumb-item">Products</NuxtLink>
                                <span class="breadcrumb-separator">›</span>
                                <span class="breadcrumb-item active">{{ product?.name }}</span>
                            </nav>

                            <!-- Navigation Arrows (visible on mobile) -->
                            <div class="product-navigation product-navigation-breadcrumb">
                                <button class="nav-arrow" aria-label="Produit précédent">
                                    <i class="bi bi-arrow-left"></i>
                                </button>
                                <button class="nav-arrow" aria-label="Produit suivant">
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
                            <button class="nav-arrow" aria-label="Produit précédent">
                                <i class="bi bi-arrow-left"></i>
                            </button>
                            <button class="nav-arrow" aria-label="Produit suivant">
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
                            <!-- Taille -->
                            <div class="variant-group">
                                <label class="variant-label">Taille</label>
                                <select v-model="selectedSize" class="variant-select">
                                    <option value="">Sélectionner</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </div>

                            <!-- Couleur -->
                            <div class="variant-group">
                                <label class="variant-label">Couleur</label>
                                <select v-model="selectedColor" class="variant-select">
                                    <option value="">Sélectionner</option>
                                    <option value="Noir">Noir</option>
                                    <option value="Blanc">Blanc</option>
                                    <option value="Bleu">Bleu</option>
                                    <option value="Beige">Beige</option>
                                    <option value="Marron">Marron</option>
                                </select>
                            </div>

                            <!-- Type de manche -->
                            <div class="variant-group">
                                <label class="variant-label">Type de manche</label>
                                <select v-model="selectedSleeveType" class="variant-select">
                                    <option value="">Sélectionner</option>
                                    <option value="Courte">Manche courte</option>
                                    <option value="Longue">Manche longue</option>
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../../../stores/cart'
import { useProducts } from '../../../composables/useProducts'
import type { Product } from '../../../types/product'
import AfricanPatternBackground from '../../components/AfricanPatternBackground.vue'

const route = useRoute()
const cartStore = useCartStore()
const { getProductBySlug } = useProducts()

// Charger le produit dynamiquement basé sur le slug
const product = ref<Product | null>(null)
const loading = ref(true)

// Charger le produit au montage
onMounted(() => {
    const slug = route.params.slug as string
    product.value = getProductBySlug(slug)
    loading.value = false
})

// State
const currentImageIndex = ref(0)
const selectedSize = ref('')
const selectedColor = ref('')
const selectedSleeveType = ref('')
const quantity = ref(1)

// Computed
const currentImage = computed(() => {
    return product.value?.images[currentImageIndex.value]?.image || ''
})

const availableSizes = computed(() => {
    if (!product.value?.variants) return []
    return [...new Set(product.value.variants.map(v => v.size))]
})

const availableColors = computed(() => {
    if (!product.value?.variants) return []
    return [...new Set(product.value.variants.map(v => v.color))]
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

    // Créer un objet avec toutes les sélections
    const customVariant = {
        size: selectedSize.value,
        color: selectedColor.value,
        sleeveType: selectedSleeveType.value
    }

    cartStore.addItem(product.value, undefined, quantity.value)

    // TODO: Afficher une notification de succès
    alert('Produit ajouté au panier !')
}

const orderViaWhatsApp = () => {
    if (!product.value) return

    const config = useRuntimeConfig()
    const whatsappNumber = config.public.whatsappNumber

    // Construire le message WhatsApp
    const message = `Bonjour, je suis intéressé(e) par ce produit:\n\n` +
        `*${product.value.name}*\n` +
        `Prix: ${product.value.discount_price || product.value.price} FCFA\n` +
        `Quantité: ${quantity.value}\n\n` +
        `Variantes sélectionnées:\n` +
        (selectedSize.value ? `- Taille: ${selectedSize.value}\n` : '') +
        (selectedColor.value ? `- Couleur: ${selectedColor.value}\n` : '') +
        (selectedSleeveType.value ? `- Type de manche: ${selectedSleeveType.value}\n` : '')

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
}

// Fetch product data (à implémenter avec l'API)
// onMounted(async () => {
//   const slug = route.params.slug as string
//   product.value = await fetchProductBySlug(slug)
// })
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
    padding-top: 125%;
    overflow: hidden;
    border-radius: 4px;
}

.main-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.nav-arrow:hover {
    background: #0E3A34;
    border-color: #0E3A34;
    color: #F5F2EC;
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
        padding-top: 125%;
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
        padding: 0 1rem;
    }

    /* Thumbnails en dessous en horizontal */
    .thumbnails {
        flex-direction: row;
        gap: 0.5rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0 1rem;
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
</style>
