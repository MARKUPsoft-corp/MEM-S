<template>
    <div class="cart-page">
        <!-- Page Hero -->
        <div class="cart-hero">
            <div class="cart-hero-content">
                <h1 class="cart-hero-title">Panier</h1>
                <div class="title-underline"></div>
            </div>
        </div>

        <!-- Cart Content -->
        <div class="cart-container">
            <!-- Empty Cart State -->
            <div v-if="cartStore.items.length === 0" class="empty-cart">
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
                        <h2 class="cart-section-title">Articles ({{ cartStore.totalItems }})</h2>
                    </div>

                    <!-- Cart Items List -->
                    <div class="cart-items-list">
                        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
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
                                <div v-if="item.variant" class="cart-item-variant">
                                    Taille: {{ item.variant.size }} | Couleur: {{ item.variant.color }}
                                </div>
                                <div class="cart-item-price-mobile">
                                    {{ formatPrice(item.price) }} FCFA
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
                                {{ formatPrice(item.price) }} FCFA
                            </div>

                            <!-- Total -->
                            <div class="cart-item-total">
                                {{ formatPrice(item.price * item.quantity) }} FCFA
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
                                <span class="summary-value">{{ formatPrice(cartStore.subtotal) }} FCFA</span>
                            </div>
                            <div class="summary-row">
                                <span class="summary-label">Livraison</span>
                                <span class="summary-value summary-value-free">Gratuite</span>
                            </div>
                            <div class="summary-divider"></div>
                            <div class="summary-row summary-row-total">
                                <span class="summary-label">Total</span>
                                <span class="summary-value">{{ formatPrice(cartStore.total) }} FCFA</span>
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
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart'
import type { CartItem } from '../../types/cart'

const cartStore = useCartStore()
const promoCode = ref('')

// Load cart from localStorage on mount
onMounted(() => {
    cartStore.loadFromLocalStorage()
})

// Get product image
const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
        return product.images[0].image || product.images[0]
    }
    return '/images/placeholder.jpg'
}

// Format price with thousands separator
const formatPrice = (price: number) => {
    return price.toLocaleString('fr-FR')
}

// Quantity management
const increaseQuantity = (item: CartItem) => {
    cartStore.updateQuantity(item.id, item.quantity + 1)
}

const decreaseQuantity = (item: CartItem) => {
    if (item.quantity > 1) {
        cartStore.updateQuantity(item.id, item.quantity - 1)
    }
}

const updateQuantity = (item: CartItem, event: Event) => {
    const target = event.target as HTMLInputElement
    const newQuantity = parseInt(target.value)
    if (newQuantity > 0) {
        cartStore.updateQuantity(item.id, newQuantity)
    }
}

const removeItem = (item: CartItem) => {
    if (confirm('Êtes-vous sûr de vouloir retirer cet article ?')) {
        cartStore.removeItem(item.id)
    }
}

const applyPromoCode = () => {
    // TODO: Implement promo code logic
    console.log('Applying promo code:', promoCode.value)
}
</script>

<style scoped>
.cart-page {
    min-height: 100vh;
    background: #F5F2EC;
}

/* Hero Section */
.cart-hero {
    background: linear-gradient(135deg, #0E3A34 0%, #1a5449 100%);
    padding: 8rem 2rem 4rem;
    text-align: center;
    position: relative;
}

.cart-hero-content {
    max-width: 1400px;
    margin: 0 auto;
}

.cart-hero-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 3rem;
    font-weight: 600;
    color: #F5F2EC;
    margin: 0 0 1rem 0;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.title-underline {
    width: 80px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
    margin: 0 auto;
}

/* Container */
.cart-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

/* Empty Cart */
.empty-cart {
    text-align: center;
    padding: 4rem 2rem;
    background: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(11, 11, 11, 0.08);
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
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
    align-items: start;
}

/* Cart Items Section */
.cart-items-section {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(11, 11, 11, 0.08);
}

.cart-section-header {
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

/* Cart Items List */
.cart-items-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Cart Item */
.cart-item {
    display: grid;
    grid-template-columns: 120px 1fr 140px 100px 120px 40px;
    gap: 1.5rem;
    align-items: center;
    padding: 1.5rem;
    background: #F5F2EC;
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
}

.cart-item:hover {
    box-shadow: 0 4px 12px rgba(11, 11, 11, 0.1);
}

.cart-item-image {
    position: relative;
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

.cart-item-price-mobile {
    display: none;
    font-size: 0.875rem;
    font-weight: 600;
    color: #0B0B0B;
}

/* Quantity Controls */
.cart-item-quantity {
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
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #0B0B0B;
    text-align: right;
}

.cart-item-total {
    color: #0E3A34;
}

/* Remove Button */
.cart-item-remove {
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
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: sticky;
    top: 100px;
}

.cart-summary {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(11, 11, 11, 0.08);
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

.summary-value {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #0B0B0B;
}

.summary-value-free {
    color: #0E3A34;
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

.summary-row-total .summary-value {
    font-size: 1.5rem;
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
    background: #FFFFFF;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(11, 11, 11, 0.08);
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

/* Responsive - Mobile */
@media (max-width: 767px) {
    .cart-hero {
        padding: 6rem 1.5rem 3rem;
    }

    .cart-hero-title {
        font-size: 2rem;
    }

    .cart-container {
        padding: 2rem 1rem;
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

    .cart-item-price-mobile {
        display: block;
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
