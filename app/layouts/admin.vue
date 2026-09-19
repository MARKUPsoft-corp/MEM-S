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

        <NuxtLink
          to="/admin/settings"
          class="sidebar-link"
          :class="{ active: route.path.startsWith('/admin/settings') }"
          @click="sidebarOpen = false"
        >
          <i class="bi bi-whatsapp"></i>
          <span>Paramètres & WhatsApp</span>
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

    <!-- Notifications Toast -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'
import NotificationContainer from '../components/NotificationContainer.vue'

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
  color: #1A1A1A;
  position: relative;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

/* Sidebar */
.admin-sidebar {
  width: 240px;
  background: #0B0B0B;
  color: #FFFFFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-header {
  padding: 1.1rem 1.15rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-brand {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: #FFFFFF;
}

.brand-badge {
  background: #C9A46C;
  color: #0B0B0B;
  font-size: 0.5625rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 2px;
  letter-spacing: 0.8px;
}

.btn-close-sidebar {
  background: transparent;
  border: none;
  color: #8C8C8C;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.btn-close-sidebar:hover {
  color: #FFFFFF;
}

.sidebar-nav {
  padding: 1rem 0.65rem;
  flex: 1;
  overflow-y: auto;
}

.nav-section-title {
  font-size: 0.5625rem;
  font-weight: 600;
  color: #6E6E6E;
  letter-spacing: 1.2px;
  padding: 0 0.65rem 0.35rem 0.65rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.45rem 0.65rem;
  color: #A39E96;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 400;
  transition: all 0.15s ease;
  margin-bottom: 2px;
}

.sidebar-link i {
  font-size: 0.95rem;
  color: #C9A46C;
  opacity: 0.85;
}

.sidebar-link:hover {
  background: rgba(201, 164, 108, 0.08);
  color: #FFFFFF;
}

.sidebar-link:hover i {
  opacity: 1;
}

.sidebar-link.active {
  background: rgba(201, 164, 108, 0.12);
  color: #F5E8D2;
  font-weight: 500;
  border-left: 2.5px solid #C9A46C;
  border-radius: 0 4px 4px 0;
}

.sidebar-link.active i {
  color: #C9A46C;
  opacity: 1;
}

.sidebar-footer {
  padding: 0.75rem 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-action-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.4rem 0.65rem;
  color: #7E7A74;
  text-decoration: none;
  font-size: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s ease;
}

.footer-action-link:hover {
  color: #FFFFFF;
}

/* Main Content Area */
.admin-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.admin-topbar {
  background: #FFFFFF !important;
  border-bottom: 1px solid #ECE7E1;
  padding: 0.65rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1020;
  box-shadow: 0 1px 2px rgba(11, 11, 11, 0.02);
}

.topbar-welcome {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.topbar-welcome .small {
  font-size: 0.625rem;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #8C8C8C;
  margin-bottom: 1px;
}

.topbar-title {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #1A1A1A;
}

.btn-toggle-sidebar {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #1A1A1A;
  cursor: pointer;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 4px;
  letter-spacing: 0.3px;
  transition: all 0.15s ease;
}

.btn-mems-gold:hover {
  background: #B89358;
  color: #0B0B0B;
}

.admin-user-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.55rem;
  background: #FAF8F5;
  border-radius: 40px;
  border: 1px solid #ECE7E1;
}

.user-avatar-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #A14E36;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 0.6875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1A1A1A;
  display: block;
  line-height: 1.1;
}

.user-role-badge {
  font-size: 0.5625rem;
  color: #A14E36;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-content-view {
  padding: 1.5rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Opacité et fond propre des conteneurs admin */
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

/* Responsive Mobile & Tablet */
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
    padding: 0.5rem 0.75rem;
  }

  .admin-content-view {
    padding: 0.85rem 0.75rem;
  }

  .sidebar-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(11, 11, 11, 0.4);
    z-index: 1030;
  }
}
</style>
