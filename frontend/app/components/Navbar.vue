<template>
    <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
        <div class="navbar-container">
            <!-- Left Navigation -->
            <div class="navbar-left">
                <!-- Mobile Menu Button -->
                <button class="mobile-menu-btn" @click="toggleSidebar" aria-label="Ouvrir le menu"
                    :aria-expanded="sidebarOpen" aria-controls="mobile-sidebar">
                    <i class="bi bi-list"></i>
                </button>

                <!-- Desktop Links -->
                <div class="nav-item" @mouseenter="activeDropdown = 'men'" @mouseleave="activeDropdown = null">
                    <span class="nav-link nav-link-dropdown" :class="{ 'nav-link--active': route.path === '/men' }">
                        HOMMES
                        <i class="bi bi-chevron-down dropdown-icon"></i>
                    </span>
                    <transition name="dropdown-fade">
                        <div v-if="activeDropdown === 'men'" class="dropdown-menu">
                            <NuxtLink to="/men" class="dropdown-item">Tous les produits</NuxtLink>
                            <NuxtLink to="/men?category=boubous" class="dropdown-item">Boubou</NuxtLink>
                            <NuxtLink to="/men?category=gandouras" class="dropdown-item">Gandoura</NuxtLink>
                            <NuxtLink to="/men?category=costumes" class="dropdown-item">Costumes</NuxtLink>
                            <NuxtLink to="/men?category=chemises" class="dropdown-item">Chemise</NuxtLink>
                            <NuxtLink to="/men?category=pantalons" class="dropdown-item">Pantalon</NuxtLink>
                        </div>
                    </transition>
                </div>

                <div class="nav-item" @mouseenter="activeDropdown = 'women'" @mouseleave="activeDropdown = null">
                    <span class="nav-link nav-link-dropdown" :class="{ 'nav-link--active': route.path === '/women' }">
                        FEMMES
                        <i class="bi bi-chevron-down dropdown-icon"></i>
                    </span>
                    <transition name="dropdown-fade">
                        <div v-if="activeDropdown === 'women'" class="dropdown-menu">
                            <NuxtLink to="/women" class="dropdown-item">Tous les produits</NuxtLink>
                            <NuxtLink to="/women?category=robes" class="dropdown-item">Robes</NuxtLink>
                            <NuxtLink to="/women?category=ensembles" class="dropdown-item">Ensembles</NuxtLink>
                            <NuxtLink to="/women?category=sacs" class="dropdown-item">Sacs</NuxtLink>
                        </div>
                    </transition>
                </div>

                <NuxtLink to="/babouches" class="nav-link" :class="{ 'nav-link--active': route.path === '/babouches' }">
                    BABOUCHES
                </NuxtLink>
                <NuxtLink to="/lins" class="nav-link" :class="{ 'nav-link--active': route.path === '/lins' }">
                    LINS
                </NuxtLink>
            </div>

            <!-- Center Logo -->
            <div class="navbar-center">
                <NuxtLink to="/" class="navbar-logo">
                    <img src="/images/LOGO.png" alt="MEM'S Logo" class="logo-image" />
                </NuxtLink>
            </div>

            <!-- Right Icons -->
            <div class="navbar-right">
                <button class="nav-icon" aria-label="Rechercher" @click="toggleSearch">
                    <i class="bi bi-search"></i>
                </button>
                <NuxtLink to="/account" class="nav-icon" aria-label="Compte">
                    <i class="bi bi-person"></i>
                </NuxtLink>
                <NuxtLink to="/cart" class="nav-icon cart-icon" aria-label="Panier">
                    <i class="bi bi-cart"></i>
                    <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
                </NuxtLink>
            </div>
        </div>

        <!-- Sidebar Overlay -->
        <SidebarOverlay :isVisible="sidebarOpen" @click="closeSidebar" />

        <!-- Sidebar -->
        <Sidebar :isOpen="sidebarOpen" @close="closeSidebar" />

        <!-- Search Overlay -->
        <SearchOverlay :isOpen="searchOpen" @close="closeSearch" />
    </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '../../stores/cart'
import { useRoute } from 'vue-router'
import Sidebar from './sidebar/Sidebar.vue'
import SidebarOverlay from './sidebar/SidebarOverlay.vue'
import SearchOverlay from './SearchOverlay.vue'

const cartStore = useCartStore()
const route = useRoute()
const sidebarOpen = ref(false)
const searchOpen = ref(false)
const isScrolled = ref(false)
const activeDropdown = ref<string | null>(null)
const totalItems = computed(() => cartStore.totalItems)

// Vérifier si on est sur une page avec hero (transparent navbar)
const hasHeroPage = computed(() => {
    const heroPages = ['/', '/men', '/women', '/babouches', '/lins']
    return heroPages.includes(route.path)
})

function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
    sidebarOpen.value = false
}

function toggleSearch() {
    searchOpen.value = !searchOpen.value
    if (searchOpen.value) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
}

function closeSearch() {
    searchOpen.value = false
    document.body.style.overflow = ''
}

// Handle scroll for transparent navbar
function handleScroll() {
    if (import.meta.client) {
        // Sur les pages avec hero, la navbar devient opaque au scroll
        // Sur les autres pages, elle est toujours opaque
        if (hasHeroPage.value) {
            isScrolled.value = window.scrollY > 50
        } else {
            isScrolled.value = true
        }
    }
}

// Body scroll lock
watch(sidebarOpen, (isOpen) => {
    if (import.meta.client) {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
})

// Escape key handler
function handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && sidebarOpen.value) {
        closeSidebar()
    }
}

// Watcher pour détecter les changements de route
watch(() => route.path, () => {
    handleScroll()
})

onMounted(() => {
    if (import.meta.client) {
        document.addEventListener('keydown', handleEscapeKey)
        document.addEventListener('scroll', handleScroll)
        handleScroll() // Check initial scroll position
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        document.removeEventListener('keydown', handleEscapeKey)
        document.removeEventListener('scroll', handleScroll)
    }
})
</script>

<style scoped>
.navbar {
    background: transparent;
    border-bottom: 1px solid transparent;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: none;
}

.navbar--scrolled {
    background: #F5F2EC;
    border-bottom: 1px solid rgba(201, 164, 108, 0.2);
    box-shadow: 0 4px 20px rgba(11, 11, 11, 0.08), 0 2px 8px rgba(11, 11, 11, 0.04);
}

.navbar-container {
    width: 100%;
    margin: 0;
    padding: 0.25rem 2rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0;
}

.navbar-left {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: flex-start;
}

.navbar-left .nav-link,
.navbar-left .nav-item {
    display: none;
}

.nav-item {
    position: relative;
}

.nav-link {
    color: #F5F2EC;
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 1.5px;
    transition: color 0.3s ease;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
    cursor: pointer;
}

.navbar--scrolled .nav-link {
    color: #0B0B0B;
}

.nav-link-dropdown {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.dropdown-icon {
    font-size: 0.625rem;
    transition: transform 0.3s ease;
}

.nav-item:hover .dropdown-icon {
    transform: rotate(180deg);
}

.nav-link:hover {
    color: #C9A46C;
}

.nav-link--active {
    color: #C9A46C !important;
    font-weight: 600;
    position: relative;
}

.nav-link--active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background: #C9A46C;
    border-radius: 2px;
}

.dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    background: #2A2A2A;
    min-width: 220px;
    padding: 0.75rem 0;
    border-radius: 4px;
    box-shadow: 0 4px 16px rgba(11, 11, 11, 0.3);
    z-index: 1001;
    animation: fadeIn 0.2s ease-in-out;
    display: block;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.navbar--scrolled .dropdown-menu {
    background: #2A2A2A;
    box-shadow: 0 4px 16px rgba(11, 11, 11, 0.25);
}

.dropdown-item {
    display: block;
    padding: 0.75rem 1.5rem;
    color: #F5F2EC;
    text-decoration: none;
    font-size: 0.8125rem;
    font-family: 'Montserrat', sans-serif;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.dropdown-item:hover {
    background: rgba(201, 164, 108, 0.2);
    color: #C9A46C;
    padding-left: 1.75rem;
}

.navbar-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.navbar-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.3s ease;
    position: relative;
    z-index: 10;
}

.navbar-logo:hover {
    opacity: 0.8;
}

.logo-image {
    height: 120px;
    width: auto;
    object-fit: contain;
    margin: -30px 0;
}

.navbar-right {
    display: flex;
    align-items: center;
    gap: 1.75rem;
    justify-content: flex-end;
}

.nav-icon {
    background: none;
    border: none;
    color: #F5F2EC;
    font-size: 1.125rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
    position: relative;
    text-decoration: none;
}

.navbar--scrolled .nav-icon {
    color: #0B0B0B;
}

.nav-icon:hover {
    color: #C9A46C;
}

.cart-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #C9A46C;
    color: #0B0B0B;
    font-size: 0.625rem;
    padding: 2px 5px;
    border-radius: 50%;
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
}

.mobile-menu-btn {
    display: flex;
    background: none;
    border: none;
    color: #F5F2EC;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
}

.navbar--scrolled .mobile-menu-btn {
    color: #0B0B0B;
}



/* Large desktop (1200px et plus) - Afficher les menus desktop */
@media (min-width: 1200px) {

    .navbar-left .nav-link,
    .navbar-left .nav-item {
        display: block;
    }

    .mobile-menu-btn {
        display: none;
    }

    .navbar-container {
        padding: 0.25rem 3rem;
    }
}

/* Extra large desktop */
@media (min-width: 1400px) {
    .navbar-container {
        padding: 0.25rem 4rem;
    }
}

/* Ultra large desktop */
@media (min-width: 1600px) {
    .navbar-container {
        padding: 0.25rem 5rem;
    }
}

/* Mobile et Tablette (jusqu'à 1199px) */
@media (max-width: 1199px) {
    .navbar-container {
        padding: 0.5rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .navbar-left {
        order: 1;
        flex-shrink: 0;
        gap: 0;
    }

    .navbar-left .nav-link,
    .navbar-left .nav-item {
        display: none;
    }

    .mobile-menu-btn {
        display: flex;
    }

    .navbar-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        order: 2;
    }

    .navbar-right {
        display: flex;
        gap: 1.5rem;
        order: 3;
        flex-shrink: 0;
    }
}

/* Mobile uniquement (petits écrans) */
@media (max-width: 767px) {
    .navbar-container {
        padding: 0.75rem 1.5rem;
    }

    .navbar-right {
        gap: 0;
    }

    /* Afficher SEULEMENT l'icône recherche sur mobile */
    .navbar-right .nav-icon:first-child {
        display: flex;
    }

    /* Cacher les icônes account et cart sur mobile */
    .navbar-right .nav-icon:nth-child(2),
    .navbar-right .nav-icon:nth-child(3) {
        display: none;
    }
}
</style>