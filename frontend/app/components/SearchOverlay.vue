<template>
    <transition name="search-fade">
        <div v-if="isOpen" class="search-overlay">
            <div class="search-container">
                <!-- Header -->
                <div class="search-header">
                    <h2 class="search-title">Recherche</h2>
                    <button class="search-close" @click="$emit('close')" aria-label="Fermer la recherche">
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <!-- Categories Tabs -->
                <div class="search-categories">
                    <button 
                        v-for="category in categories" 
                        :key="category.id"
                        class="category-tab"
                        :class="{ 'category-tab--active': activeCategory === category.id }"
                        @click="activeCategory = category.id"
                    >
                        {{ category.label }}
                    </button>
                </div>

                <!-- Search Input -->
                <div class="search-input-wrapper">
                    <i class="bi bi-search search-input-icon"></i>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="Rechercher"
                        v-model="searchQuery"
                        @input="handleSearch"
                        ref="searchInput"
                    />
                    <button 
                        v-if="searchQuery" 
                        class="search-clear"
                        @click="clearSearch"
                        aria-label="Effacer la recherche"
                    >
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <!-- Search Results (placeholder) -->
                <div class="search-results">
                    <p v-if="!searchQuery" class="search-placeholder">
                        Commencez à taper pour rechercher des produits...
                    </p>
                    <p v-else-if="searchQuery && !hasResults" class="search-no-results">
                        Aucun résultat trouvé pour "{{ searchQuery }}"
                    </p>
                    <!-- TODO: Add actual search results here -->
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
interface Props {
    isOpen: boolean
}

interface Category {
    id: string
    label: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    close: []
}>()

const searchQuery = ref('')
const activeCategory = ref('all')
const hasResults = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const categories: Category[] = [
    { id: 'all', label: 'Toutes Catégories' },
    { id: 'men', label: 'Hommes' },
    { id: 'women', label: 'Femmes' },
    { id: 'babouches', label: 'Babouches' },
    { id: 'lins', label: 'Lins' }
]

function handleSearch() {
    // TODO: Implement actual search logic
    console.log('Searching for:', searchQuery.value, 'in category:', activeCategory.value)
}

function clearSearch() {
    searchQuery.value = ''
    hasResults.value = false
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
    background: #FFFFFF;
    z-index: 2000;
    overflow-y: auto;
}

.search-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

.search-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5rem;
}

.search-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.75rem;
    font-weight: 300;
    color: #0B0B0B;
    margin: 0;
    letter-spacing: 0.5px;
}

.search-close {
    background: none;
    border: none;
    color: #0B0B0B;
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
}

.search-close:hover {
    opacity: 0.6;
}

.search-categories {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 4rem;
    border-bottom: 1px solid #E8E8E8;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

.search-categories::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
}

.category-tab {
    background: none;
    border: none;
    color: #999999;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 400;
    padding: 0 0 1.5rem 0;
    cursor: pointer;
    transition: color 0.3s ease;
    white-space: nowrap;
    position: relative;
}

.category-tab:hover {
    color: #0B0B0B;
}

.category-tab--active {
    color: #0B0B0B;
}

.category-tab--active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #0B0B0B;
}

.search-input-wrapper {
    position: relative;
    max-width: 850px;
    margin: 0 auto 3rem;
}

.search-input-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: #999999;
    font-size: 1.125rem;
}

.search-input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 2rem;
    border: none;
    border-bottom: 1px solid #0B0B0B;
    background: transparent;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    color: #0B0B0B;
    outline: none;
    transition: border-color 0.3s ease;
}

.search-input:focus {
    border-bottom-color: #0B0B0B;
}

.search-input::placeholder {
    color: #CCCCCC;
    font-weight: 300;
}

.search-clear {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #999999;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
}

.search-clear:hover {
    opacity: 0.6;
}

.search-results {
    min-height: 300px;
}

.search-placeholder,
.search-no-results {
    text-align: center;
    color: #999999;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    margin-top: 3rem;
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

/* Mobile */
@media (max-width: 767px) {
    .search-container {
        padding: 2rem 1.5rem;
    }

    .search-header {
        margin-bottom: 3rem;
    }

    .search-title {
        font-size: 1.5rem;
    }

    .search-categories {
        gap: 2rem;
        margin-bottom: 3rem;
        justify-content: flex-start;
        padding-bottom: 0.5rem;
    }

    .category-tab {
        font-size: 0.875rem;
        padding-bottom: 0.75rem;
    }

    .category-tab--active::after {
        bottom: 0.5rem;
    }

    .search-input-wrapper {
        margin-bottom: 2rem;
    }
}
</style>
