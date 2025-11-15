<template>
    <!-- Overlay -->
    <Transition name="overlay-fade">
        <div v-if="isOpen" class="filter-overlay" @click="$emit('close')"></div>
    </Transition>

    <!-- Popup -->
    <Transition name="slide-up">
        <div v-if="isOpen" class="filter-popup">
            <!-- Header -->
            <div class="popup-header">
                <h3 class="popup-title">Filtrer par</h3>
                <button class="close-btn" @click="$emit('close')" aria-label="Fermer">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Content -->
            <div class="popup-content">
                <AfricanPatternBackground opacity="medium" color="gold" />
                
                <nav class="filter-nav">
                    <button 
                        v-for="category in categories" 
                        :key="category.id"
                        @click="selectAndApply(category.id)"
                        :class="['filter-item', { active: activeCategory === category.id }]"
                    >
                        <i class="bi bi-chevron-right"></i>
                        {{ category.label }}
                    </button>
                </nav>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AfricanPatternBackground from './AfricanPatternBackground.vue'

interface Category {
    id: string
    label: string
}

interface Props {
    isOpen: boolean
    categories: Category[]
    modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    close: []
    'update:modelValue': [value: string]
}>()

const activeCategory = ref(props.modelValue)

function selectAndApply(categoryId: string) {
    activeCategory.value = categoryId
    emit('update:modelValue', categoryId)
    emit('close')
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
    activeCategory.value = newValue
})

// Prevent body scroll when popup is open
watch(() => props.isOpen, (isOpen) => {
    if (import.meta.client) {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
})
</script>

<style scoped>
/* Overlay */
.filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(11, 11, 11, 0.6);
    z-index: 999;
    backdrop-filter: blur(4px);
}

/* Popup */
.filter-popup {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 70vh;
    background: #F5F2EC;
    border-radius: 20px 20px 0 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -4px 20px rgba(11, 11, 11, 0.2);
}

/* Header */
.popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid rgba(201, 164, 108, 0.3);
}

.popup-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #0E3A34;
    margin: 0;
    letter-spacing: 0.5px;
}

.close-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: #2A2A2A;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 50%;
}

.close-btn:hover {
    background: rgba(201, 164, 108, 0.2);
    color: #0E3A34;
}

/* Content */
.popup-content {
    position: relative;
    overflow: hidden;
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
}

.filter-nav {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: #0E3A34;
    border: 2px solid rgba(201, 164, 108, 0.2);
    border-radius: 8px;
    color: #F5F2EC;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
}

.filter-item i {
    font-size: 0.875rem;
    color: #C9A46C;
    transition: transform 0.3s ease;
}

.filter-item:hover,
.filter-item.active {
    background: #0E3A34;
    border-color: #C9A46C;
    color: #C9A46C;
    transform: translateX(4px);
}

.filter-item:hover i,
.filter-item.active i {
    transform: translateX(4px);
    color: #C9A46C;
}

/* Animations */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-leave-active {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.slide-up-enter-from {
    transform: translateY(100%);
}

.slide-up-leave-to {
    transform: translateY(100%);
}
</style>
