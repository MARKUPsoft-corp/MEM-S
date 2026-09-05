<template>
  <NuxtLink :to="`/products/${product.slug}`" class="product-card-link">
    <div class="product-card">
      <!-- Image Container -->
      <div class="product-image-container">
        <img :src="currentImage" :alt="product.name" class="product-image" @error="handleImageError" />

        <!-- Badge (Nouveau, Promo, Vedette, etc.) -->
        <div v-if="displayBadge" class="product-badge" :class="`badge-${displayBadge.type}`">
          {{ displayBadge.text }}
        </div>

        <!-- Navigation Arrows (desktop hover) -->
        <div class="image-navigation">
          <button @click.prevent.stop="previousImage" class="nav-arrow nav-arrow-left" aria-label="Image précédente">
            ‹
          </button>
          <button @click.prevent.stop="nextImage" class="nav-arrow nav-arrow-right" aria-label="Image suivante">
            ›
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <h3 class="product-name" :title="product.name">{{ product.name }}</h3>

        <div class="product-price-container">
          <div class="product-price">
            <div class="price-main">
              <span class="current-price" :class="{ 'has-discount': hasDiscount }">
                {{ formatAmount(effectivePrice) }} FCFA
              </span>
            </div>
            <div v-if="hasDiscount && effectiveOriginalPrice" class="price-discount-row">
              <span class="original-price">{{ formatAmount(effectiveOriginalPrice) }} FCFA</span>
              <span v-if="discountPercentage > 0" class="discount-pill">-{{ discountPercentage }}%</span>
            </div>
          </div>

          <div class="product-action">
            <span class="view-product">Voir le produit</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCloudinary } from '../../composables/useCloudinary'

const { getOptimizedImageUrl } = useCloudinary()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
})

const currentImageIndex = ref(0)
const currentVariant = ref(props.product.variants?.[0] || null)

// Prix calculés et détection des promotions
const effectivePrice = computed(() => {
  const p = props.product
  if (p.discount_price && Number(p.discount_price) > 0) {
    return Number(p.discount_price)
  }
  return Number(p.price) || 0
})

const effectiveOriginalPrice = computed(() => {
  const p = props.product
  // Cas 1 : originalPrice explicite supérieur au prix actuel
  if (p.originalPrice && Number(p.originalPrice) > Number(p.price)) {
    return Number(p.originalPrice)
  }
  // Cas 2 : discount_price est présent et inférieur au prix de base
  if (p.discount_price && Number(p.discount_price) > 0 && Number(p.price) > Number(p.discount_price)) {
    return Number(p.price)
  }
  // Cas 3 : originalPrice égal à price mais discount_price est renseigné
  if (p.originalPrice && p.discount_price && Number(p.discount_price) < Number(p.price)) {
    return Number(p.price)
  }
  return null
})

const hasDiscount = computed(() => {
  return effectiveOriginalPrice.value !== null && effectiveOriginalPrice.value > effectivePrice.value
})

const discountPercentage = computed(() => {
  if (!hasDiscount.value || !effectiveOriginalPrice.value) return 0
  return Math.round(((effectiveOriginalPrice.value - effectivePrice.value) / effectiveOriginalPrice.value) * 100)
})

const formatAmount = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null || val === '') return ''
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''))
  if (isNaN(num)) return String(val)
  return new Intl.NumberFormat('fr-FR').format(num)
}

const displayBadge = computed(() => {
  if (props.product.badge) {
    if (props.product.badge.type === 'sale' && discountPercentage.value > 0) {
      return { type: 'sale', text: `-${discountPercentage.value}%` }
    }
    return props.product.badge
  }
  if (hasDiscount.value && discountPercentage.value > 0) {
    return { type: 'sale', text: `-${discountPercentage.value}%` }
  }
  if (props.product.is_new) {
    return { type: 'new', text: 'NOUVEAU' }
  }
  if (props.product.is_featured) {
    return { type: 'featured', text: 'VEDETTE' }
  }
  return null
})

const rawImage = computed(() => {
  let img: any = ''
  if (currentVariant.value && currentVariant.value.images) {
    img = currentVariant.value.images[currentImageIndex.value] || props.product.images?.[0] || ''
  } else {
    img = props.product.images?.[currentImageIndex.value] || props.product.images?.[0] || ''
  }
  let src = ''
  if (img && typeof img === 'object') {
    src = img.image || img.url || ''
  } else if (typeof img === 'string') {
    src = img
  }
  if (!src && props.product.image) {
    src = typeof props.product.image === 'string' ? props.product.image : props.product.image.url || ''
  }
  if (src.includes('photo-1514989940745-12a14b18c6e2')) {
    src = src.replace('photo-1514989940745-12a14b18c6e2', 'photo-1542291026-7eec264c27ff')
  }
  return src || fallbackImage
})

const currentImage = computed(() => {
  return getOptimizedImageUrl(rawImage.value, { width: 600, quality: 'auto', format: 'auto' })
})

const nextImage = () => {
  const images = currentVariant.value?.images || props.product.images
  if (!images || images.length === 0) return
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

const previousImage = () => {
  const images = currentVariant.value?.images || props.product.images
  if (!images || images.length === 0) return
  currentImageIndex.value = currentImageIndex.value === 0
    ? images.length - 1
    : currentImageIndex.value - 1
}

const fallbackImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop&q=80'
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  if (target && target.src !== fallbackImage) {
    target.src = fallbackImage
  }
}
</script>

<style scoped>
.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.product-card {
  position: relative;
  background: #F5F2EC;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card-link:hover .product-card {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(11, 11, 11, 0.15);
}

/* Image Container */
.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 125%; /* Ratio 4:5 */
  overflow: hidden;
  background: #EAE6DF;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Navigation Arrows */
.image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 3;
}

.product-image-container:hover .image-navigation {
  opacity: 1;
  pointer-events: auto;
}

.nav-arrow {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 28px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #0B0B0B;
  cursor: pointer;
  transition: background 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-arrow:hover {
  background: rgba(255, 255, 255, 1);
}

/* Badge */
.product-badge {
  position: absolute;
  top: 0.75rem;
  left: 0;
  padding: 0.35rem 0.65rem;
  border-radius: 0 3px 3px 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.badge-new {
  background: #A14E36;
  color: #FFFFFF;
}

.badge-sale {
  background: #A14E36;
  color: #FFFFFF;
}

.badge-featured {
  background: #C9A46C;
  color: #0B0B0B;
}

/* Product Info */
.product-info {
  padding: 1rem 0.75rem 1.15rem;
  background: #F5F2EC;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #0B0B0B;
  margin: 0 0 0.4rem 0;
  line-height: 1.3;
  min-height: 2.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price-container {
  position: relative;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  width: 100%;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.price-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.current-price {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0B0B0B;
  white-space: nowrap;
}

.current-price.has-discount {
  color: #A14E36; /* Accent Terracotta chic */
}

.price-discount-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.original-price {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: #767676;
  text-decoration: line-through;
  white-space: nowrap;
}

.discount-pill {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #A14E36;
  background: rgba(161, 78, 54, 0.12);
  border: 1px solid rgba(161, 78, 54, 0.25);
  padding: 1px 5px;
  border-radius: 3px;
  line-height: 1.2;
  white-space: nowrap;
}

.product-action {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}

.view-product {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0B0B0B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
}

/* Hover effect on desktop devices */
@media (hover: hover) and (min-width: 769px) {
  .product-card:hover .product-price {
    opacity: 0;
    transform: translateY(-4px);
  }

  .product-card:hover .product-action {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

/* Responsive Tablet & Mobile */
@media (max-width: 768px) {
  .product-info {
    padding: 0.625rem 0.5rem 0.75rem;
  }

  .product-name {
    font-size: 0.8125rem;
    line-height: 1.25;
    min-height: 2.05rem;
    margin-bottom: 0.3rem;
  }

  .product-price-container {
    min-height: 2.2rem;
    overflow: visible;
  }

  .product-price {
    gap: 0.15rem;
  }

  .current-price {
    font-size: 0.875rem;
  }

  .original-price {
    font-size: 0.72rem;
  }

  .discount-pill {
    font-size: 0.625rem;
    padding: 1px 4px;
  }

  .product-badge {
    top: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.6875rem;
  }

  .image-navigation {
    display: none;
  }

  .product-action {
    display: none;
  }
}

@media (max-width: 380px) {
  .product-info {
    padding: 0.5rem 0.35rem 0.65rem;
  }

  .product-name {
    font-size: 0.75rem;
    min-height: 1.9rem;
  }

  .current-price {
    font-size: 0.8125rem;
  }

  .original-price {
    font-size: 0.6875rem;
  }

  .discount-pill {
    font-size: 0.5625rem;
    padding: 0px 3px;
  }
}
</style>
