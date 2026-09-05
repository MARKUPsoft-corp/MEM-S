<template>
  <div class="admin-wrapper">
    <!-- African Pattern Background Subtil -->
    <AfricanPatternBackground opacity="subtle" color="gold" />

    <!-- Overlay Mobile -->
    <div
      v-if="sidebarOpen"
      class="sidebar-backdrop d-lg-none"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar Latérale -->
    <aside class="admin-sidebar" :class="{ 'is-open': sidebarOpen }">
      <!-- Header Sidebar / Logo -->
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="admin-brand">
          <span class="brand-name">MEM'S</span>
          <span class="brand-badge">ADMIN</span>
        </NuxtLink>
        <button
          class="btn-close-sidebar d-lg-none"
          @click="sidebarOpen = false"
          aria-label="Fermer le menu"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <div class="nav-section-title">GESTION DU CATALOGUE</div>
        <NuxtLink
          to="/admin"
          class="sidebar-link"
          :class="{ active: route.path === '/admin' }"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-speedometer2"></i>
          <span>Tableau de bord</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/products"
          class="sidebar-link"
          :class="{ active: route.path.startsWith('/admin/products') }"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-tag"></i>
          <span>Produits</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/categories"
          class="sidebar-link"
          :class="{ active: route.path.startsWith('/admin/categories') }"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-collection"></i>
          <span>Catégories & Collections</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/banners"
          class="sidebar-link"
          :class="{ active: route.path.startsWith('/admin/banners') }"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-images"></i>
          <span>Bannières & Hero</span>
        </NuxtLink>

        <div class="nav-section-title mt-3">COMMERCE & CLIENTS</div>
        <NuxtLink
          to="/admin/orders"
          class="sidebar-link"
          :class="{ active: route.path.startsWith('/admin/orders') }"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-bag-check"></i>
          <span>Commandes</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/customers"
          class="sidebar-link"
          :class="{ active: route.path.startsWith('/admin/customers') }"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-people"></i>
          <span>Clients & Accès</span>
        </NuxtLink>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <NuxtLink to="/" class="footer-action-link" target="_blank">
          <i class="bi bi-box-arrow-up-right"></i>
          <span>Voir la boutique</span>
        </NuxtLink>
        <button class="footer-action-link text-danger border-0 bg-transparent" @click="handleLogout">
          <i class="bi bi-box-arrow-left"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Conteneur Principal -->
    <div class="admin-main">
      <!-- Barre Supérieure -->
      <header class="admin-topbar">
        <div class="d-flex align-items-center gap-3">
          <button
            class="btn-toggle-sidebar d-lg-none"
            @click="sidebarOpen = !sidebarOpen"
            aria-label="Ouvrir le menu"
          >
            <i class="bi bi-list"></i>
          </button>
          <div class="topbar-welcome">
            <span class="text-muted small">Espace Gestion</span>
            <h2 class="topbar-title mb-0">Atelier MEM'S</h2>
          </div>
        </div>

        <div class="topbar-actions">
          <NuxtLink to="/admin/products/create" class="btn btn-mems-gold btn-sm d-none d-sm-inline-flex align-items-center gap-2">
            <i class="bi bi-plus-lg"></i>
            <span>Nouveau Produit</span>
          </NuxtLink>

          <!-- Profil Admin -->
          <ClientOnly>
            <div class="admin-user-pill">
              <div class="user-avatar-circle">
                {{ userInitial }}
              </div>
              <div class="user-meta d-none d-md-block">
                <span class="user-name">{{ userName }}</span>
                <span class="user-role-badge">Admin</span>
              </div>
            </div>
            <template #fallback>
              <div class="admin-user-pill">
                <div class="user-avatar-circle">
                  A
                </div>
                <div class="user-meta d-none d-md-block">
                  <span class="user-name">Administrateur</span>
                  <span class="user-role-badge">Admin</span>
                </div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </header>

      <!-- Contenu de la page -->
      <main class="admin-content-view">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(false)

const userName = computed(() => {
  if (authStore.user?.first_name || authStore.user?.last_name) {
    return `${authStore.user.first_name || ''} ${authStore.user.last_name || ''}`.trim()
  }
  return authStore.user?.email?.split('@')[0] || 'Administrateur'
})

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase() || 'A'
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth')
}
</script>

<style scoped>
.admin-wrapper {
  display: flex;
  min-height: 100vh;
  background: #FAF8F5;
  color: #0B0B0B;
  position: relative;
  font-family: 'Montserrat', sans-serif;
}

/* Sidebar */
.admin-sidebar {
  width: 270px;
  background: #0B0B0B;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  border-right: 1px solid rgba(201, 164, 108, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  padding: 1.5rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-brand {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-name {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #FFFFFF;
}

.brand-badge {
  background: #C9A46C;
  color: #0B0B0B;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 1px;
}

.btn-close-sidebar {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 1.25rem;
  cursor: pointer;
}

.sidebar-nav {
  padding: 1.25rem 0.75rem;
  flex: 1;
  overflow-y: auto;
}

.nav-section-title {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #7A7A7A;
  letter-spacing: 1.5px;
  padding: 0 0.75rem 0.5rem 0.75rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.85rem;
  color: #C5C1BA;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: 0.25rem;
}

.sidebar-link i {
  font-size: 1.1rem;
  color: #C9A46C;
}

.sidebar-link:hover {
  background: rgba(201, 164, 108, 0.12);
  color: #FFFFFF;
  transform: translateX(3px);
}

.sidebar-link.active {
  background: #C9A46C;
  color: #0B0B0B;
  font-weight: 600;
}

.sidebar-link.active i {
  color: #0B0B0B;
}

.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-action-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.85rem;
  color: #9E9E9E;
  text-decoration: none;
  font-size: 0.8125rem;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer-action-link:hover {
  color: #FFFFFF;
}

/* Main Content Area */
.admin-main {
  flex: 1;
  margin-left: 270px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.admin-topbar {
  background: #FFFFFF !important;
  border-bottom: 1px solid #E5E0D8;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1020;
  box-shadow: 0 1px 3px rgba(11, 11, 11, 0.03);
}

.topbar-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #0B0B0B;
}

.btn-toggle-sidebar {
  background: #F5F2EC;
  border: 1px solid #E5E0D8;
  width: 38px;
  height: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #0B0B0B;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  letter-spacing: 0.5px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn-mems-gold:hover {
  background: #B89358;
  color: #0B0B0B;
  transform: translateY(-1px);
}

.admin-user-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.75rem;
  background: #F5F2EC;
  border-radius: 50px;
  border: 1px solid #E5E0D8;
}

.user-avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #A14E36;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  display: block;
  line-height: 1.1;
}

.user-role-badge {
  font-size: 0.6875rem;
  color: #A14E36;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-content-view {
  padding: 2rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Garantir l'opacité 100% de toutes les div de contenu dans l'admin */
:deep(.content-card),
:deep(.kpi-card),
:deep(.collection-kpi-card),
:deep(.modal-content),
:deep(.modal-body-luxury),
:deep(.custom-admin-table) {
  background-color: #FFFFFF !important;
}

:deep(.custom-admin-table th),
:deep(.custom-admin-table td) {
  background-color: #FFFFFF !important;
}

/* Responsive */
@media (max-width: 991.98px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.is-open {
    transform: translateX(0);
  }

  .admin-main {
    margin-left: 0;
  }

  .admin-topbar {
    padding: 0.75rem 1rem;
  }

  .admin-content-view {
    padding: 1rem;
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 11, 11, 0.5);
    z-index: 1030;
  }
}
</style>
