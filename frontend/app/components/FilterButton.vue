<template>
    <!-- Floating Filter Button (Mobile Only) -->
    <button class="filter-fab" @click="$emit('open')" aria-label="Filtrer">
        <i class="bi bi-funnel-fill"></i>
    </button>
</template>

<script setup lang="ts">
defineEmits<{
    open: []
}>()
</script>

<style scoped>
.filter-fab {
    position: fixed;
    top: calc(100vh - 3.5rem);
    right: 1rem;
    z-index: 998;
    display: none;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    padding: 0;
    background: #0E3A34;
    color: #F5F2EC;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 16px rgba(14, 58, 52, 0.4), 0 2px 8px rgba(14, 58, 52, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    -webkit-tap-highlight-color: transparent;
}

.filter-fab i {
    font-size: 1.125rem;
}

.filter-fab:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(14, 58, 52, 0.5), 0 3px 10px rgba(14, 58, 52, 0.35);
}

.filter-fab:active {
    transform: scale(0.95);
}

/* Show only on mobile */
@media (max-width: 767px) {
    .filter-fab {
        display: flex;
    }
}
</style>
