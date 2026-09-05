<template>
    <transition name="search-fade">
        <div v-if="isOpen" class="search-overlay">
            <!-- African Pattern Background -->
            <AfricanPatternBackground opacity="light" color="gold" />
            
            <div class="search-container">
                <!-- Close Button -->
                <button class="search-close" @click="$emit('close')" aria-label="Fermer la recherche">
                    <i class="bi bi-x"></i>
                </button>

                <!-- Header -->
                <div class="search-header">
                    <h2 class="search-title">Recherche</h2>
                    <div class="title-underline"></div>
                </div>

                <!-- Search Input -->
                <form @submit.prevent="performSearch" class="search-input-wrapper">
                    <i class="bi bi-search search-input-icon"></i>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Rechercher des produits..."
                        v-model="searchQuery"
                        @input="onSearchInput"
                        ref="searchInput"
                    />
                    <button 
                        v-if="searchQuery" 
                        class="search-clear"
                        type="button"
                        @click="clearSearch"
                        aria-label="Effacer la recherche"
                    >
                        <i class="bi bi-x"></i>
                    </button>
                </form>

                <!-- Search Results -->
                <div v-if="hasSearched" class="search-results">
                    <!-- Results Header -->
                    <div class="results-header">
                        <h3 class="results-title">
                            {{ searchResults.length > 0 ? `${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''} trouvé${searchResults.length > 1 ? 's' : ''}` : 'Aucun résultat trouvé' }}
                        </h3>
                        <p v-if="searchQuery" class="results-query">pour "{{ searchQuery }}"</p>
                    </div>

                    <!-- Products Grid -->
                    <div v-if="searchResults.length > 0" class="products-grid">
                        <ProductCard 
                            v-for="product in searchResults" 
                            :key="product.id" 
                            :product="mappedProduct(product)"
                            @click="emit('close')"
                        />
                    </div>

                    <!-- Empty State -->
                    <div v-else class="empty-state">
                        <i class="bi bi-search"></i>
                        <p>Aucun produit trouvé pour "{{ searchQuery }}"</p>
                        <p class="empty-hint">Essayez avec d'autres mots-clés</p>
                    </div>
                </div>

                <!-- Popular Searches (when no search performed) -->
                <div v-else class="popular-searches-section">
                    <div class="popular-header">
                        <h3 class="popular-title">Recherches populaires</h3>
                        <div class="popular-underline"></div>
                    </div>
                    <div class="popular-tags">
                        <button 
                            v-for="tag in popularTags" 
                            :key="tag"
                            @click="searchByTag(tag)"
                            class="popular-tag"
                        >
                            {{ tag }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'
import AfricanPatternBackground from './AfricanPatternBackground.vue'
import ProductCard from './ProductCard.vue'

interface Props {
    isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
    close: []
}>()

const { fetchProducts, products } = useProducts()

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const hasSearched = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)

const popularTags = [
    'Boubou', 'Robe', 'Babouches', 'Lin', 'Gandoura', 
    'Costume', 'Ensemble', 'Sac', 'Brodé', 'Cuir'
]

// Perform search using API
const performSearch = async () => {
    if (!searchQuery.value.trim()) return
    
    hasSearched.value = true
    loading.value = true
    
    try {
        const query = searchQuery.value.toLowerCase().trim()
        // Utiliser l'API pour rechercher
        await fetchProducts({ search: query })
        searchResults.value = products.value
    } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        searchResults.value = []
    } finally {
        loading.value = false
    }
}

// Search on input (real-time search with debounce)
let searchTimeout: NodeJS.Timeout
const onSearchInput = () => {
    clearTimeout(searchTimeout)
    
    if (searchQuery.value.trim()) {
        // Debounce de 300ms pour éviter trop de requêtes
        searchTimeout = setTimeout(() => {
            performSearch()
        }, 300)
    } else {
        hasSearched.value = false
        searchResults.value = []
    }
}

// Search by tag
const searchByTag = (tag: string) => {
    searchQuery.value = tag
    performSearch()
}

// Clear search
function clearSearch() {
    searchQuery.value = ''
    searchResults.value = []
    hasSearched.value = false
}

// Map product for ProductCard
const mappedProduct = (product: any) => {
    return {
        ...product,
        images: product.images?.map((img: any) => typeof img === 'string' ? img : img.image) || []
    }
}

// Focus input when overlay opens
watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        nextTick(() => {
            searchInput.value?.focus()
        })
    } else {
        clearSearch()
    }
})

// Close on Escape key
function handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && props.isOpen) {
        emit('close')
    }
}

onMounted(() => {
    if (import.meta.client) {
        document.addEventListener('keydown', handleEscapeKey)
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        document.removeEventListener('keydown', handleEscapeKey)
    }
})
</script>

<style scoped>
.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F5F2EC;
    z-index: 2000;
    overflow-y: auto;
}

.search-container {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
    min-height: 100vh;
    z-index: 2;
}

.search-close {
    position: absolute;
    top: 2rem;
    right: 2rem;
    background: none;
    border: none;
    color: #0E3A34;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
    line-height: 1;
    z-index: 3;
}

.search-close:hover {
    opacity: 0.6;
}

.search-header {
    text-align: center;
    margin-bottom: 3rem;
}

.search-title {
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

.search-input-wrapper {
    position: relative;
    max-width: 700px;
    margin: 0 auto 3rem;
    background: #FFFFFF;
    border: 2px solid rgba(201, 164, 108, 0.3);
    border-radius: 50px;
    padding: 0.5rem 1rem;
    box-shadow: 0 4px 20px rgba(14, 58, 52, 0.15);
    transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
    border-color: #C9A46C;
    box-shadow: 0 6px 24px rgba(201, 164, 108, 0.25);
    transform: translateY(-2px);
}

.search-input-icon {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #C9A46C;
    font-size: 1.25rem;
}

.search-input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 2.5rem;
    border: none;
    background: transparent;
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    color: #0E3A34;
    outline: none;
}

.search-input::placeholder {
    color: #999;
    font-weight: 400;
}

.search-clear {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(201, 164, 108, 0.1);
    border: none;
    color: #C9A46C;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.search-clear:hover {
    background: #C9A46C;
    color: #FFFFFF;
}

/* Search Results */
.search-results {
    margin-top: 2rem;
}

.results-header {
    text-align: center;
    margin-bottom: 2rem;
}

.results-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 0.5rem 0;
}

.results-query {
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #666;
    margin: 0;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 3rem 2rem;
}

.empty-state i {
    font-size: 3rem;
    color: #C9A46C;
    margin-bottom: 1rem;
}

.empty-state p {
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    color: #666;
    margin: 0.5rem 0;
}

.empty-hint {
    font-size: 0.875rem !important;
    color: #999 !important;
}

/* Popular Searches */
.popular-searches-section {
    margin-top: 4rem;
}

.popular-header {
    text-align: center;
    margin-bottom: 2rem;
}

.popular-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.5rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0 0 1rem 0;
    letter-spacing: 0.5px;
}

.popular-underline {
    width: 80px;
    height: 3px;
    background: #C9A46C;
    border-radius: 2px;
    margin: 0 auto;
}

.popular-tags {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 800px;
    margin: 0 auto;
}

.popular-tag {
    padding: 0.75rem 1.5rem;
    background: #FFFFFF;
    border: 2px solid rgba(201, 164, 108, 0.3);
    border-radius: 25px;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #0E3A34;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(14, 58, 52, 0.08);
}

.popular-tag:hover {
    background: #0E3A34;
    border-color: #0E3A34;
    color: #F5F2EC;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
}

/* Transitions */
.search-fade-enter-active,
.search-fade-leave-active {
    transition: opacity 0.3s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
    opacity: 0;
}

/* Responsive */
@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 1024px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 767px) {
    .search-container {
        padding: 2rem 1.5rem;
    }

    .search-close {
        top: 1.5rem;
        right: 1.5rem;
    }

    .search-header {
        margin-bottom: 2rem;
    }

    .search-title {
        font-size: 2rem;
    }

    .title-underline {
        width: 60px;
        height: 2px;
    }

    .search-input-wrapper {
        margin-bottom: 2rem;
    }

    .search-input {
        font-size: 0.9375rem;
        padding: 0.625rem 2.5rem 0.625rem 2.25rem;
    }

    .search-input-icon {
        left: 1rem;
        font-size: 1.125rem;
    }

    .popular-title {
        font-size: 1.25rem;
    }

    .popular-underline {
        width: 60px;
        height: 2px;
    }

    .popular-tag {
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
    }

    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}
</style>
