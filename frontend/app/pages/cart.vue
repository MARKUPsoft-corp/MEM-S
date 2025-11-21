<template>
    <div class="cart-page">
        <!-- Cart Content -->
        <div class="cart-container">
            <!-- African Pattern Background -->
            <AfricanPatternBackground opacity="light" color="gold" />

            <!-- Page Header -->
            <div class="page-header">
                <h1 class="page-title">Panier</h1>
                <div class="title-underline"></div>

                <!-- Sync Indicator -->
                <div v-if="syncing" class="sync-indicator">
                    <i class="bi bi-arrow-repeat spin"></i>
                    <span>Synchronisation en cours...</span>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="error-message">
                    <i class="bi bi-exclamation-triangle"></i>
                    <span>{{ error }}</span>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
                <div class="loading-spinner">
                    <i class="bi bi-arrow-repeat spin"></i>
                </div>
                <p>Chargement de votre panier...</p>
            </div>

            <!-- Empty Cart State -->
            <div v-else-if="items.length === 0" class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="bi bi-cart-x"></i>
                </div>
                <h2 class="empty-cart-title">Votre panier est vide</h2>
                <p class="empty-cart-text">Découvrez nos collections et ajoutez des articles à votre panier</p>
                <NuxtLink to="/" class="btn-continue-shopping">
                    Continuer vos achats
                </NuxtLink>
            </div>

            <!-- Cart with Items -->
            <div v-else class="cart-content">
                <!-- Cart Items Section -->
                <div class="cart-items-section">
                    <div class="cart-section-header">
                        <h2 class="cart-section-title">Articles ({{ totalItems }})</h2>
                        <div v-if="authStore.isAuthenticated" class="sync-status">
                            <i class="bi bi-cloud-check"></i>
                            <span>Synchronisé</span>
                        </div>
                    </div>

                    <!-- Cart Items List -->
                    <div class="cart-items-list">
                        <div v-for="item in items" :key="item.id" class="cart-item">
                            <!-- African Pattern Background -->
                            <AfricanPatternBackground opacity="light" color="gold" />

                            <!-- Product Image -->
                            <div class="cart-item-image">
                                <img :src="getProductImage(item.product)" :alt="item.product.name" />
                                <span v-if="item.product.is_new" class="cart-item-badge badge-new">
                                    NOUVEAU
                                </span>
                            </div>

                            <!-- Product Details -->
                            <div class="cart-item-details">
                                <NuxtLink :to="`/products/${item.product.slug}`" class="cart-item-name">
                                    {{ item.product.name }}
                                </NuxtLink>
                                <div v-if="item.variant && item.variant.attributes" class="cart-item-variant">
                                    <span v-for="(attr, index) in item.variant.attributes" :key="attr.name">
                                        {{ attr.name }}: {{ attr.value }}<span
                                            v-if="index < item.variant.attributes.length - 1"> | </span>
                                    </span>
                                </div>
                                <div class="cart-item-pricing-mobile">
                                    <div class="price-unit-mobile">
                                        <span class="price-label">Prix unitaire:</span>
                                        <span class="price-badge price-badge-mobile">{{ formatPrice(item.price) }}
                                            FCFA</span>
                                    </div>
                                    <div class="price-total-mobile">
                                        <span class="price-label">Total:</span>
                                        <span class="price-badge price-badge-total-mobile">{{ formatPrice(item.price *
                                            item.quantity) }} FCFA</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Quantity Controls -->
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" @click="decreaseQuantity(item)"
                                    :disabled="item.quantity <= 1" aria-label="Diminuer la quantité">
                                    <i class="bi bi-dash"></i>
                                </button>
                                <input type="number" class="quantity-input" :value="item.quantity"
                                    @change="updateQuantity(item, $event)" min="1" />
                                <button class="quantity-btn" @click="increaseQuantity(item)"
                                    aria-label="Augmenter la quantité">
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>

                            <!-- Price -->
                            <div class="cart-item-price">
                                <span class="price-badge">{{ formatPrice(item.price) }} FCFA</span>
                            </div>

                            <!-- Total -->
                            <div class="cart-item-total">
                                <span class="price-badge price-badge-total">{{ formatPrice(item.price * item.quantity)
                                    }} FCFA</span>
                            </div>

                            <!-- Remove Button -->
                            <button class="cart-item-remove" @click="removeItem(item)" aria-label="Retirer l'article">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Continue Shopping Link -->
                    <div class="continue-shopping-container">
                        <NuxtLink to="/" class="link-continue-shopping">
                            <i class="bi bi-arrow-left"></i>
                            Continuer vos achats
                        </NuxtLink>
                    </div>
                </div>

                <!-- Order Summary Section -->
                <div class="cart-summary-section">
                    <div class="cart-summary">
                        <h2 class="cart-summary-title">Résumé de la commande</h2>

                        <!-- Summary Details -->
                        <div class="summary-details">
                            <div class="summary-row">
                                <span class="summary-label">Sous-total</span>
                                <span class="summary-badge">{{ formatPrice(subtotal) }} FCFA</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Livraison</span>
                                <span class="summary-badge summary-badge-free">Gratuite</span>
                            </div>
                            <div class="summary-divider"></div>
                            <div class="summary-row summary-row-total">
                                <span class="summary-label">Total</span>
                                <span class="summary-badge summary-badge-total">{{ formatPrice(total) }} FCFA</span>
                            </div>
                        </div>

                        <!-- Checkout Button -->
                        <button class="btn-checkout">
                            Procéder au paiement
                        </button>

                        <!-- Security Info -->
                        <div class="security-info">
                            <i class="bi bi-shield-check"></i>
                            <span>Paiement 100% sécurisé</span>
                        </div>
                    </div>

                    <!-- Promo Code Section -->
                    <div class="promo-code-section">
                        <h3 class="promo-code-title">Code promo</h3>
                        <div class="promo-code-input-group">
                            <input type="text" class="promo-code-input" placeholder="Entrez votre code"
                                v-model="promoCode" />
                            <button class="btn-apply-promo" @click="applyPromoCode">
                                Appliquer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Floating Summary Button (Mobile Only) -->
        <button v-if="items.length > 0" @click="showSummaryModal = true"
            :class="['floating-summary-btn', { 'floating-summary-btn-absolute': isButtonAbsolute }]">
            <div class="floating-btn-content">
                <span class="floating-btn-total">{{ formatPrice(total) }} FCFA</span>
                <span class="floating-btn-text">Voir le résumé</span>
            </div>
        </button>

        <!-- Summary Modal (Mobile Only) -->
        <Transition name="modal">
            <div v-if="showSummaryModal" class="modal-overlay" @click="showSummaryModal = false">
                <div class="modal-content" @click.stop>
                    <!-- African Pattern Background -->
                    <AfricanPatternBackground opacity="light" color="gold" />

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h3 class="modal-title">Résumé de la commande</h3>
                        <button @click="showSummaryModal = false" class="modal-close">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="modal-body">
                        <!-- Cart Summary -->
                        <div class="cart-summary-modal">
                            <!-- Summary Details -->
                            <div class="summary-details">
                                <div class="summary-row">
                                    <span class="summary-label">Sous-total</span>
                                    <span class="summary-badge">{{ formatPrice(subtotal) }} FCFA</span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Livraison</span>
                                    <span class="summary-badge summary-badge-free">Gratuite</span>
                                </div>
                                <div class="summary-divider"></div>
                                <div class="summary-row summary-row-total">
                                    <span class="summary-label">Total</span>
                                    <span class="summary-badge summary-badge-total">{{ formatPrice(total) }} FCFA</span>
                                </div>
                            </div>

                            <!-- Checkout Button -->
                            <button class="btn-checkout">
                                Procéder au paiement
                            </button>

                            <!-- Security Info -->
                            <div class="security-info">
                                <i class="bi bi-shield-check"></i>
                                <span>Paiement 100% sécurisé</span>
                            </div>
                        </div>

                        <!-- Promo Code Section -->
                        <div class="promo-code-section-modal">
                            <h3 class="promo-code-title">Code promo</h3>
                            <div class="promo-code-input-group">
                                <input type="text" class="promo-code-input" placeholder="Entrez votre code"
                                    v-model="promoCode" />
                                <button class="btn-apply-promo" @click="applyPromoCode">
                                    Appliquer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useCart } from '../../composables/useCart'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import { useConfirm } from '../../composables/useConfirm'
import { useNotification } from '../../composables/useNotification'
import { useRouter } from 'vue-router'
import type { CartItem } from '../../types/cart'
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'

const { items, totalItems, subtotal, total, loading, syncing, error, fetchCart, updateQuantity: updateQty, removeItem: removeItemFromCart } = useCart()
const authStore = useAuthStore()
const router = useRouter()
const promoCode = ref('')
const showSummaryModal = ref(false)
const isButtonAbsolute = ref(false)

// Load cart on mount
onMounted(async () => {
    const { confirm: showConfirm } = useConfirm()
    
    // Vérifier si l'utilisateur est connecté
    if (!authStore.isAuthenticated) {
        const confirmed = await showConfirm({
            title: 'Connexion requise',
            message: 'Vous devez être connecté pour accéder au panier. Voulez-vous vous connecter maintenant ?',
            confirmText: 'Se connecter',
            cancelText: 'Retour à l\'accueil',
            type: 'info'
        })
        
        if (confirmed) {
            router.push('/auth')
        } else {
            router.push('/')
        }
        return
    }

    // Charger le panier depuis le backend
    await fetchCart()

    // Handle scroll for floating button position
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial check
    }
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll)
    }
})

// Handle scroll to adjust button position
const handleScroll = () => {
    if (typeof window === 'undefined') return

    const footer = document.querySelector('footer')
    if (!footer) return

    const footerRect = footer.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const buttonHeight = 80 // Approximate button height
    const offset = 20 // Bottom offset

    // If footer is visible in viewport
    if (footerRect.top < windowHeight - buttonHeight - offset) {
        isButtonAbsolute.value = true
    } else {
        isButtonAbsolute.value = false
    }
}

// Get product image
const getProductImage = (product: any) => {
    if (product?.images && product.images.length > 0) {
        const imageUrl = product.images[0].image || product.images[0]

        // Si l'URL est relative, ajouter le domaine du backend (sans /api)
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('/')) {
            const config = useRuntimeConfig()
            // Enlever /api de l'URL de base pour les médias
            const baseUrl = config.public.apiBase.replace('/api', '')
            return `${baseUrl}${imageUrl}`
        }
        return imageUrl
    }
    return '/images/placeholder.jpg'
}

// Format price with thousands separator
const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR')
}

// Quantity management
const increaseQuantity = async (item: CartItem) => {
    await updateQty(item.id, item.quantity + 1)
}

const decreaseQuantity = async (item: CartItem) => {
    if (item.quantity > 1) {
        await updateQty(item.id, item.quantity - 1)
    }
}

const updateQuantity = async (item: CartItem, event: Event) => {
    const target = event.target as HTMLInputElement
    const newQuantity = parseInt(target.value)
    if (newQuantity > 0) {
        await updateQty(item.id, newQuantity)
    }
}

const removeItem = async (item: CartItem) => {
    const { confirm: showConfirm } = useConfirm()
    const { success } = useNotification()
    
    const confirmed = await showConfirm({
        title: 'Retirer l\'article',
        message: 'Êtes-vous sûr de vouloir retirer cet article du panier ?',
        confirmText: 'Retirer',
        cancelText: 'Annuler',
        type: 'danger'
    })
    
    if (confirmed) {
        await removeItemFromCart(item.id)
        success('Article retiré du panier')
    }
}

const applyPromoCode = () => {
    // TODO: Implement promo code logic
    console.log('Applying promo code:', promoCode.value)
}
</script>

<style scoped>
.cart-page {
    position: relative;
    min-height: 100vh;
    background: #F5F2EC;
    padding-top: 80px;
}

/* Container */
.cart-container {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

/* Page Header */
.page-header {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-bottom: 3rem;
}

.page-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
    letter-spacing: 1px;
}

.title-underline {
    width: 80px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
    margin: 0 auto;
}

/* Sync Indicator */
.sync-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: rgba(201, 164, 108, 0.1);
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 20px;
    font-size: 0.875rem;
    color: #C9A46C;
    font-weight: 500;
}

.sync-indicator i {
    font-size: 1rem;
}

/* Error Message */
.error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background: rgba(161, 78, 54, 0.1);
    border: 1px solid rgba(161, 78, 54, 0.3);
    border-radius: 20px;
    font-size: 0.875rem;
    color: #A14E36;
    font-weight: 500;
}

.error-message i {
    font-size: 1rem;
}

/* Loading State */
.loading-state {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 4rem 2rem;
    background: #F5F2EC;
    border-radius: 8px;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
}

.loading-spinner {
    font-size: 3rem;
    color: #C9A46C;
    margin-bottom: 1rem;
}

.loading-spinner i {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin 1s linear infinite;
}

.loading-state p {
    font-size: 1rem;
    color: #2A2A2A;
    margin: 0;
}

/* Empty Cart */
.empty-cart {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 4rem 2rem;
    background: #F5F2EC;
    border-radius: 8px;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
}

.empty-cart-icon {
    font-size: 5rem;
    color: #C9A46C;
    margin-bottom: 1.5rem;
}

.empty-cart-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
}

.empty-cart-text {
    font-size: 1rem;
    color: #2A2A2A;
    margin: 0 0 2rem 0;
}

.btn-continue-shopping {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: #0E3A34;
    color: #F5F2EC;
    border: 2px solid #0E3A34;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 4px;
    text-decoration: none;
}

.btn-continue-shopping:hover {
    background: transparent;
    color: #0E3A34;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
}

/* Cart Content */
.cart-content {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    align-items: start;
}

/* Cart Items Section */
.cart-items-section {
    background: #F5F2EC;
    border-radius: 8px;
    padding: 2rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
}

.cart-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #F5F2EC;
}

.cart-section-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0;
}

/* Sync Status */
.sync-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(14, 58, 52, 0.1);
    border: 1px solid rgba(14, 58, 52, 0.2);
    border-radius: 16px;
    font-size: 0.8125rem;
    color: #0E3A34;
    font-weight: 500;
}

.sync-status i {
    color: #0E3A34;
    font-size: 1rem;
}

/* Cart Items List */
.cart-items-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Cart Item */
.cart-item {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 120px 1fr 140px 100px 120px 40px;
    gap: 1.5rem;
    align-items: center;
    padding: 1.5rem;
    background: #FFFFFF;
    border: 2px solid rgba(201, 164, 108, 0.2);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(14, 58, 52, 0.1);
    transition: all 0.3s ease;
}

.cart-item:hover {
    border-color: rgba(201, 164, 108, 0.4);
    box-shadow: 0 4px 16px rgba(14, 58, 52, 0.15);
    transform: translateY(-2px);
}

.cart-item-image {
    position: relative;
    z-index: 2;
    width: 120px;
    height: 150px;
    border-radius: 4px;
    overflow: hidden;
}

.cart-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cart-item-badge {
    position: absolute;
    top: 0.5rem;
    left: 0;
    padding: 0.25rem 0.5rem;
    border-radius: 0 2px 2px 0;
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.badge-new {
    background: #A14E36;
    color: #FFFFFF;
}

.badge-featured {
    background: #C9A46C;
    color: #0B0B0B;
}

.cart-item-details {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.cart-item-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: #0B0B0B;
    text-decoration: none;
    transition: color 0.3s ease;
}

.cart-item-name:hover {
    color: #C9A46C;
}

.cart-item-variant {
    font-size: 0.875rem;
    color: #2A2A2A;
}

.cart-item-pricing-mobile {
    display: none;
}

.price-unit-mobile,
.price-total-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
}

.price-total-mobile {
    border-top: 1px solid rgba(201, 164, 108, 0.2);
    padding-top: 0.75rem;
    margin-top: 0.5rem;
}

.price-label {
    font-size: 0.8125rem;
    color: #2A2A2A;
    font-weight: 400;
}

/* Mobile Price Badges */
.price-badge-mobile {
    display: inline-block;
    padding: 0.375rem 0.875rem;
    background: rgba(201, 164, 108, 0.1);
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 16px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #0B0B0B;
}

.price-badge-total-mobile {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(14, 58, 52, 0.15);
    border: 1px solid rgba(14, 58, 52, 0.4);
    border-radius: 16px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 700;
    color: #0E3A34;
}

/* Quantity Controls */
.cart-item-quantity {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 0.25rem;
}

.quantity-btn {
    width: 32px;
    height: 32px;
    background: #F5F2EC;
    border: 1px solid #E5E5E5;
    border-radius: 4px;
    color: #0B0B0B;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
    background: #C9A46C;
    border-color: #C9A46C;
    color: #FFFFFF;
}

.quantity-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.quantity-input {
    width: 50px;
    height: 32px;
    text-align: center;
    border: 1px solid #E5E5E5;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0B0B0B;
    background: #FFFFFF;
}

.quantity-input:focus {
    outline: none;
    border-color: #C9A46C;
}

/* Price and Total */
.cart-item-price,
.cart-item-total {
    position: relative;
    z-index: 2;
    text-align: right;
}

/* Price Badges */
.price-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(201, 164, 108, 0.1);
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 20px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0B0B0B;
    white-space: nowrap;
}

.price-badge-total {
    background: rgba(14, 58, 52, 0.1);
    border-color: rgba(14, 58, 52, 0.3);
    color: #0E3A34;
    font-weight: 700;
    font-size: 0.9375rem;
}

/* Remove Button */
.cart-item-remove {
    position: relative;
    z-index: 2;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    color: #A14E36;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 4px;
}

.cart-item-remove:hover {
    background: #A14E36;
    color: #FFFFFF;
}

/* Continue Shopping */
.continue-shopping-container {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #F5F2EC;
}

.link-continue-shopping {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #0E3A34;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: color 0.3s ease;
}

.link-continue-shopping:hover {
    color: #C9A46C;
}

/* Cart Summary Section */
.cart-summary-section {
    position: sticky;
    top: 100px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-self: flex-start;
    height: fit-content;
}

.cart-summary {
    background: #F5F2EC;
    border-radius: 8px;
    padding: 2rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
}

.cart-summary-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1.5rem 0;
}

/* Summary Details */
.summary-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.summary-label {
    font-size: 0.9375rem;
    color: #2A2A2A;
}

/* Summary Badges */
.summary-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(201, 164, 108, 0.1);
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 20px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0B0B0B;
    white-space: nowrap;
}

.summary-badge-free {
    background: rgba(14, 58, 52, 0.1);
    border-color: rgba(14, 58, 52, 0.3);
    color: #0E3A34;
}

.summary-badge-total {
    background: rgba(14, 58, 52, 0.15);
    border-color: rgba(14, 58, 52, 0.4);
    color: #0E3A34;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.625rem 1.25rem;
}

.summary-divider {
    height: 1px;
    background: #E5E5E5;
    margin: 0.5rem 0;
}

.summary-row-total {
    margin-top: 0.5rem;
}

.summary-row-total .summary-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #0E3A34;
}

/* Checkout Button */
.btn-checkout {
    width: 100%;
    padding: 1rem;
    background: #0E3A34;
    color: #F5F2EC;
    border: 2px solid #0E3A34;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 4px;
    margin-top: 1.5rem;
}

.btn-checkout:hover {
    background: transparent;
    color: #0E3A34;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
}

/* Security Info */
.security-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #E5E5E5;
    font-size: 0.8125rem;
    color: #2A2A2A;
}

.security-info i {
    color: #0E3A34;
    font-size: 1rem;
}

/* Promo Code Section */
.promo-code-section {
    background: #F5F2EC;
    border-radius: 8px;
    padding: 1.5rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
}

.promo-code-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
}

.promo-code-input-group {
    display: flex;
    gap: 0.5rem;
}

.promo-code-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #E5E5E5;
    border-radius: 4px;
    font-size: 0.875rem;
    color: #0B0B0B;
    background: #F5F2EC;
}

.promo-code-input:focus {
    outline: none;
    border-color: #C9A46C;
}

.btn-apply-promo {
    padding: 0.75rem 1.5rem;
    background: #C9A46C;
    color: #0B0B0B;
    border: none;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    border-radius: 4px;
    white-space: nowrap;
}

.btn-apply-promo:hover {
    background: #0E3A34;
    color: #F5F2EC;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
    .cart-content {
        grid-template-columns: 1fr;
    }

    .cart-summary-section {
        position: static;
    }

    .cart-item {
        grid-template-columns: 100px 1fr 120px 100px 100px 40px;
        gap: 1rem;
        padding: 1rem;
    }

    .cart-item-image {
        width: 100px;
        height: 125px;
    }
}

/* Floating Summary Button (Mobile Only) */
.floating-summary-btn {
    display: none;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(11, 11, 11, 0.7);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
}

.modal-content {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-height: 85vh;
    background: #F5F2EC;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 20px rgba(14, 58, 52, 0.2);
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.modal-header {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 2px solid rgba(201, 164, 108, 0.3);
}

.modal-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0;
}

.modal-close {
    width: 36px;
    height: 36px;
    background: transparent;
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #0E3A34;
}

.modal-close:hover {
    background: #0E3A34;
    border-color: #0E3A34;
    color: #F5F2EC;
}

.modal-body {
    position: relative;
    z-index: 2;
    padding: 1.5rem;
    max-height: calc(85vh - 80px);
    overflow-y: auto;
}

.cart-summary-modal {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 2px 8px rgba(14, 58, 52, 0.1);
}

.promo-code-section-modal {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 1.5rem;
    border: 2px solid rgba(201, 164, 108, 0.3);
    box-shadow: 0 2px 8px rgba(14, 58, 52, 0.1);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Responsive - Mobile */
@media (max-width: 767px) {
    .cart-container {
        padding: 2rem 1rem 6rem;
    }

    .page-header {
        margin-bottom: 2rem;
    }

    .page-title {
        font-size: 2rem;
    }

    /* Show Floating Button on Mobile */
    .floating-summary-btn {
        display: flex;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 100;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #0E3A34 0%, #1a5449 100%);
        border: none;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(14, 58, 52, 0.4);
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .cart-page {
        position: relative;
    }

    .floating-summary-btn-absolute {
        position: absolute;
        bottom: 100px;
        right: 20px;
        top: auto;
    }

    .floating-summary-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(14, 58, 52, 0.5);
    }

    .floating-btn-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .floating-btn-total {
        font-family: 'Montserrat', sans-serif;
        font-size: 1rem;
        font-weight: 700;
        color: #C9A46C;
    }

    .floating-btn-text {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.75rem;
        font-weight: 500;
        color: #F5F2EC;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Hide Desktop Summary on Mobile */
    .cart-summary-section {
        display: none;
    }

    .cart-items-section {
        padding: 1.5rem 1rem;
    }

    .cart-item {
        grid-template-columns: 80px 1fr;
        gap: 1rem;
        padding: 1rem;
    }

    .cart-item-image {
        width: 80px;
        height: 100px;
    }

    .cart-item-pricing-mobile {
        display: block;
        width: 100%;
        margin-top: 0.75rem;
    }

    .cart-item-quantity {
        grid-column: 1 / -1;
        justify-content: center;
        margin-top: 0.5rem;
    }

    .cart-item-price,
    .cart-item-total {
        display: none;
    }

    .cart-item-remove {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

    .cart-summary {
        padding: 1.5rem;
    }

    .promo-code-section {
        padding: 1.5rem;
    }

    .promo-code-input-group {
        flex-direction: column;
    }

    .btn-apply-promo {
        width: 100%;
    }
}
</style>
