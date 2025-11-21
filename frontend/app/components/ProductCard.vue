<template>
  <NuxtLink :to="`/products/${product.slug}`" class="product-card-link">
    <div class="product-card">
      <!-- Image Container -->
      <div class="product-image-container">
        <img :src="currentImage" :alt="product.name" class="product-image" />

        <!-- Badge (Nouveau, Promo, etc.) -->
        <div v-if="product.badge" class="product-badge" :class="`badge-${product.badge.type}`">
          {{ product.badge.text }}
        </div>

        <!-- Navigation Arrows -->
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
        <h3 class="product-name">{{ product.name }}</h3>
        <div class="product-price-container">
          <div class="product-price">
            <span v-if="product.originalPrice" class="original-price">{{ product.originalPrice }} FCFA</span>
            <span class="current-price">{{ product.price }} FCFA</span>
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

const props = defineProps({
  product: {
    type: Object,
    required: true,
    // Structure attendue:
    // {
    //   id: String/Number,
    //   name: String,
    //   slug: String (requis pour la navigation),
    //   price: Number,
    //   originalPrice: Number (optionnel),
    //   images: Array<String>,
    //   variants: Array<{ id, name, images }> (optionnel),
    //   badge: { type: 'new'|'sale'|'featured', text: String } (optionnel)
    // }
  }
})

const currentImageIndex = ref(0)
const currentVariant = ref(props.product.variants?.[0] || null)

const currentImage = computed(() => {
  if (currentVariant.value && currentVariant.value.images) {
    return currentVariant.value.images[currentImageIndex.value] || props.product.images[0]
  }
  return props.product.images[currentImageIndex.value] || props.product.images[0]
})

const nextImage = () => {
  const images = currentVariant.value?.images || props.product.images
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length
}

const previousImage = () => {
  const images = currentVariant.value?.images || props.product.images
  currentImageIndex.value = currentImageIndex.value === 0
    ? images.length - 1
    : currentImageIndex.value - 1
}

const selectVariant = (variant) => {
  currentVariant.value = variant
  currentImageIndex.value = 0
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
}

.product-card-link:hover .product-card {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(11, 11, 11, 0.15);
}

/* Image Container */
.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 125%;
  /* Ratio 4:5 */
  overflow: hidden;
  background: var(--ivoire);
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
  top: 1rem;
  left: 0;
  padding: 0.375rem 0.75rem;
  border-radius: 0 2px 2px 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
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
  padding: 1.25rem;
  background: #F5F2EC;
  text-align: center;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0B0B0B;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
  min-height: 2.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price-container {
  position: relative;
  height: 1.75rem;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: transform 0.3s ease;
}

.product-card:hover .product-price {
  transform: translateY(-1.75rem);
}

.product-action {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(1.75rem);
  transition: transform 0.3s ease;
}

.product-card:hover .product-action {
  transform: translateY(0);
}

.view-product {
  font-size: 0.75rem;
  font-weight: 600;
  color: #0B0B0B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 2px;
}

.original-price {
  font-size: 0.75rem;
  color: #2A2A2A;
  text-decoration: line-through;
}

.current-price {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0B0B0B;
}

/* Responsive */
@media (max-width: 768px) {
  .product-info {
    padding: 1rem;
  }

  .product-name {
    font-size: 0.8125rem;
  }

  .current-price {
    font-size: 0.875rem;
  }
}
</style>
