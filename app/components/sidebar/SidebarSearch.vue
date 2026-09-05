<template>
    <div class="sidebar-search">
        <input type="text" placeholder="Rechercher" v-model="searchQuery" @input="handleInput"
            class="sidebar-search__input" />
        <i class="bi bi-search sidebar-search__icon"></i>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    search: [query: string]
}>()

const searchQuery = ref('')

function handleInput() {
    emit('search', searchQuery.value)
}
</script>

<style scoped>
.sidebar-search {
    padding: 1.5rem 1.5rem 1rem;
    position: relative;
}

.sidebar-search__input {
    width: 100%;
    height: 44px;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    background: #FFFFFF;
    border: 1px solid rgba(201, 164, 108, 0.3);
    border-radius: 4px;
    font-size: 0.875rem;
    font-family: 'Montserrat', sans-serif;
    outline: none;
    transition: border-color 0.2s;
}

.sidebar-search__input:focus {
    border-color: #C9A46C;
}

.sidebar-search__input::placeholder {
    color: #2A2A2A;
    opacity: 0.6;
}

.sidebar-search__icon {
    position: absolute;
    right: 2.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #C9A46C;
    font-size: 1rem;
    pointer-events: none;
}
</style>
