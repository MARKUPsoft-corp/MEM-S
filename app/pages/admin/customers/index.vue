<template>
  <div class="admin-customers-page">
    <!-- En-tête -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
      <div>
        <h1 class="page-title">Clients & Gestion des Accès</h1>
        <p class="text-muted page-subtitle mb-0">Base clientèle, historique d'achats et attribution des privilèges administrateur</p>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-soft" @click="loadData" :disabled="loading">
          <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin-icon': loading }"></i>
          Actualiser
        </button>
      </div>
    </div>

    <!-- KPIs Clients (2x2 sur mobile) -->
    <div class="row g-2 g-md-3 mb-3">
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">TOTAL COMPTES</span>
            <div class="kpi-icon-badge"><i class="bi bi-people text-gold"></i></div>
          </div>
          <div class="kpi-val">{{ users.length }}</div>
          <div class="kpi-sub">Utilisateurs enregistrés</div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">CLIENTS</span>
            <div class="kpi-icon-badge text-primary"><i class="bi bi-person-check"></i></div>
          </div>
          <div class="kpi-val text-primary">{{ customersCount }}</div>
          <div class="kpi-sub">Acheteurs boutique</div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">ADMINS</span>
            <div class="kpi-icon-badge text-gold"><i class="bi bi-shield-lock"></i></div>
          </div>
          <div class="kpi-val text-gold">{{ adminsCount }}</div>
          <div class="kpi-sub">Accès complet dashboard</div>
        </div>
      </div>
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">VILLES</span>
            <div class="kpi-icon-badge"><i class="bi bi-geo-alt"></i></div>
          </div>
          <div class="kpi-val">{{ uniqueCitiesCount }}</div>
          <div class="kpi-sub">Répartition géographique</div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche & Filtres -->
    <div class="filter-bar content-card mb-3 py-2 px-3">
      <div class="row g-2 align-items-center">
        <!-- Champ Recherche -->
        <div class="col-md-6">
          <div class="search-input-box">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control admin-search-control"
              placeholder="Rechercher par nom, email, téléphone, ville..."
            />
            <button
              v-if="searchQuery"
              class="btn-clear-search"
              @click="searchQuery = ''"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>

        <!-- Filtre Rôle -->
        <div class="col-md-6 d-flex justify-content-md-end">
          <div class="btn-group btn-group-sm">
            <button
              class="btn btn-filter"
              :class="roleFilter === 'all' ? 'active' : ''"
              @click="roleFilter = 'all'"
            >
              Tous ({{ users.length }})
            </button>
            <button
              class="btn btn-filter"
              :class="roleFilter === 'customer' ? 'active' : ''"
              @click="roleFilter = 'customer'"
            >
              Clients ({{ customersCount }})
            </button>
            <button
              class="btn btn-filter"
              :class="roleFilter === 'admin' ? 'active' : ''"
              @click="roleFilter = 'admin'"
            >
              Admins ({{ adminsCount }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des Utilisateurs -->
    <div class="content-card">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-gold" role="status"></div>
        <p class="mt-2 text-muted small">Chargement des utilisateurs...</p>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="empty-state-box text-center py-5">
        <i class="bi bi-person-x fs-1 text-muted"></i>
        <p class="mt-2 mb-1 fw-medium">Aucun utilisateur trouvé</p>
        <small class="text-muted">Modifiez vos critères de recherche.</small>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0 custom-admin-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Coordonnées</th>
              <th>Localisation</th>
              <th>Rôle</th>
              <th>Commandes</th>
              <th class="text-end" style="width: 140px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in paginatedUsers" :key="u.uid || u.id">
              <!-- Nom & Avatar -->
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="client-avatar-circle" :class="{ 'avatar-admin': u.role === 'admin' }">
                    <img v-if="u.photoURL" :src="u.photoURL" class="avatar-img" alt="" />
                    <span v-else>{{ getUserInitials(u) }}</span>
                  </div>
                  <div>
                    <span class="user-fullname">{{ getFullName(u) }}</span>
                    <small class="text-muted d-block font-monospace" style="font-size: 0.6875rem;">
                      UID: {{ (u.uid || u.id || '').substring(0, 10) }}...
                    </small>
                  </div>
                </div>
              </td>

              <!-- Coordonnées -->
              <td>
                <span class="user-email d-block">{{ u.email || 'Email non renseigné' }}</span>
                <span v-if="u.phone" class="text-muted small">
                  <i class="bi bi-telephone-fill me-1 text-gold"></i>{{ u.phone }}
                </span>
              </td>

              <!-- Localisation -->
              <td>
                <span v-if="u.city" class="fw-medium text-dark">{{ u.city }}</span>
                <span v-else class="text-muted small">Non renseignée</span>
                <small v-if="u.address" class="text-muted d-block">{{ u.address }}</small>
              </td>

              <!-- Rôle -->
              <td>
                <span v-if="u.role === 'admin'" class="badge-role badge-role-admin">
                  <i class="bi bi-shield-lock-fill me-1"></i> ADMIN
                </span>
                <span v-else class="badge-role badge-role-customer">
                  <i class="bi bi-person me-1"></i> Client
                </span>
              </td>

              <!-- Commandes -->
              <td>
                <button
                  class="badge-orders-btn"
                  @click="openCustomerOrdersModal(u)"
                  title="Voir les commandes de ce client"
                >
                  <i class="bi bi-bag me-1"></i>
                  {{ getUserOrders(u).length }} commande(s)
                </button>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <!-- Promotion / Rétrogradation Rôle -->
                  <button
                    v-if="u.role !== 'admin'"
                    class="btn btn-outline-warning"
                    title="Promouvoir en Administrateur"
                    @click="toggleAdminRole(u, true)"
                  >
                    <i class="bi bi-shield-plus"></i>
                  </button>
                  <button
                    v-else
                    class="btn btn-outline-secondary"
                    title="Rétrograder en Client"
                    @click="toggleAdminRole(u, false)"
                  >
                    <i class="bi bi-shield-minus"></i>
                  </button>

                  <!-- WhatsApp direct -->
                  <a
                    v-if="u.phone"
                    :href="getUserWhatsAppUrl(u)"
                    target="_blank"
                    class="btn btn-outline-success"
                    title="Contacter sur WhatsApp"
                  >
                    <i class="bi bi-whatsapp"></i>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex align-items-center justify-content-between p-3 border-top">
        <small class="text-muted">
          Page {{ currentPage }} sur {{ totalPages }} ({{ filteredUsers.length }} utilisateurs)
        </small>
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-secondary"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Précédent
          </button>
          <button
            class="btn btn-outline-secondary"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL COMMANDES DU CLIENT -->
    <Teleport to="body">
      <div v-if="selectedUserForOrders" class="modal-backdrop-custom" @click="selectedUserForOrders = null">
        <div class="modal-dialog-custom" @click.stop>
          <div class="modal-header-luxury d-flex align-items-center justify-content-between">
            <div>
              <h5 class="modal-title-custom mb-0">Commandes de {{ getFullName(selectedUserForOrders) }}</h5>
              <small class="text-muted">{{ selectedUserForOrders.email }}</small>
            </div>
            <button class="btn-close-luxury" @click="selectedUserForOrders = null">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body-content">
            <div v-if="selectedUserOrdersList.length === 0" class="text-center py-4">
              <i class="bi bi-bag-x fs-2 text-muted"></i>
              <p class="mt-2 text-muted">Aucune commande enregistrée pour ce client.</p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Réf & Date</th>
                    <th>Articles</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ord in selectedUserOrdersList" :key="ord.orderNumber">
                    <td>
                      <span class="fw-bold text-dark">{{ ord.orderNumber }}</span>
                      <small class="d-block text-muted">{{ formatDate(ord.createdAt) }}</small>
                    </td>
                    <td>
                      <small>{{ ord.items?.length || 0 }} article(s)</small>
                    </td>
                    <td>
                      <span class="fw-bold">{{ formatPrice(ord.total) }} FCFA</span>
                    </td>
                    <td>
                      <span :class="getStatusBadgeClass(ord.status)" class="d-inline-flex align-items-center gap-1">
                        <i :class="getStatusIconClass(ord.status)"></i>
                        {{ getStatusLabel(ord.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer-luxury d-flex justify-content-between">
            <button class="btn btn-outline-secondary" @click="selectedUserForOrders = null">
              Fermer
            </button>
            <NuxtLink to="/admin/orders" class="btn btn-mems-gold">
              Voir toutes les commandes
            </NuxtLink>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { useFirebase } from '~~/composables/useFirebase'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { db } = useFirebase()

const users = ref<any[]>([])
const allOrders = ref<any[]>([])
const loading = ref(true)

const searchQuery = ref('')
const roleFilter = ref<string>('all')
const currentPage = ref(1)
const itemsPerPage = 12

const selectedUserForOrders = ref<any | null>(null)

const formatPrice = (price: number) => {
  return (price || 0).toLocaleString('fr-FR')
}

const formatDate = (isoStr: string) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getFullName = (u: any) => {
  const name = `${u.first_name || ''} ${u.last_name || ''}`.trim()
  return name || u.email?.split('@')[0] || 'Utilisateur'
}

const getUserInitials = (u: any) => {
  const name = getFullName(u)
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Badges
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmée'
    case 'shipped': return 'Expédiée'
    case 'delivered': return 'Livrée'
    case 'cancelled': return 'Annulée'
    default: return 'En attente'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'confirmed': return 'badge bg-primary'
    case 'shipped': return 'badge bg-info text-white'
    case 'delivered': return 'badge bg-success'
    case 'cancelled': return 'badge bg-secondary'
    default: return 'badge bg-warning text-dark'
  }
}

const getStatusIconClass = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bi bi-check-circle-fill'
    case 'shipped': return 'bi bi-truck'
    case 'delivered': return 'bi bi-check2-all'
    case 'cancelled': return 'bi bi-x-circle-fill'
    default: return 'bi bi-clock-history'
  }
}

// KPIs
const customersCount = computed(() => users.value.filter(u => u.role !== 'admin').length)
const adminsCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const uniqueCitiesCount = computed(() => {
  const cities = new Set(users.value.map(u => u.city?.trim()).filter(Boolean))
  return cities.size
})

// Filtrage
const filteredUsers = computed(() => {
  let list = [...users.value]

  if (roleFilter.value !== 'all') {
    if (roleFilter.value === 'admin') {
      list = list.filter(u => u.role === 'admin')
    } else {
      list = list.filter(u => u.role !== 'admin')
    }
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(u => {
      const matchName = getFullName(u).toLowerCase().includes(q)
      const matchEmail = u.email?.toLowerCase().includes(q)
      const matchPhone = u.phone?.toLowerCase().includes(q)
      const matchCity = u.city?.toLowerCase().includes(q)
      return matchName || matchEmail || matchPhone || matchCity
    })
  }

  return list
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage) || 1)
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

// Commandes par utilisateur
const getUserOrders = (u: any) => {
  const uid = u.uid || u.id
  const email = u.email?.toLowerCase()
  const phone = u.phone?.replace(/\D/g, '')

  return allOrders.value.filter(ord => {
    if (ord.userId && ord.userId === uid) return true
    if (email && ord.customer?.email?.toLowerCase() === email) return true
    if (phone && ord.customer?.phone?.replace(/\D/g, '') === phone) return true
    return false
  })
}

const selectedUserOrdersList = computed(() => {
  if (!selectedUserForOrders.value) return []
  return getUserOrders(selectedUserForOrders.value)
})

const openCustomerOrdersModal = (u: any) => {
  selectedUserForOrders.value = u
}

// Chargement des données Firestore
const loadData = async () => {
  if (!db) return
  loading.value = true
  try {
    // 1. Charger les utilisateurs
    const usersSnap = await getDocs(collection(db, 'users'))
    users.value = usersSnap.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }))

    // 2. Charger les commandes
    const ordersSnap = await getDocs(collection(db, 'orders'))
    allOrders.value = ordersSnap.docs.map(doc => ({
      orderNumber: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.warn('[Customers] Erreur chargement:', err)
  } finally {
    loading.value = false
  }
}

// Promotion / Rétrogradation
const toggleAdminRole = async (u: any, makeAdmin: boolean) => {
  const action = makeAdmin ? 'promouvoir en Administrateur' : 'rétrograder en Client'
  if (!confirm(`Confirmez-vous vouloir ${action} l'utilisateur "${getFullName(u)}" ?`)) return

  if (db) {
    try {
      const targetUid = u.uid || u.id
      const newRole = makeAdmin ? 'admin' : 'customer'
      await updateDoc(doc(db, 'users', targetUid), {
        role: newRole,
        updatedAt: new Date().toISOString()
      })
      u.role = newRole
      alert(`Rôle mis à jour avec succès : ${makeAdmin ? 'Administrateur' : 'Client'}`)
    } catch (err: any) {
      alert(`Erreur de mise à jour du rôle : ${err.message}`)
    }
  }
}

// WhatsApp URL
const getUserWhatsAppUrl = (u: any) => {
  const phone = u.phone?.replace(/\D/g, '') || ''
  const message = encodeURIComponent(`Bonjour ${getFullName(u)}, le service client MEM'S vous contacte :`)
  return `https://wa.me/${phone}?text=${message}`
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #0B0B0B;
  letter-spacing: -0.01em;
}

.page-subtitle {
  font-size: 0.75rem;
  color: #7A7A7A;
}

.btn-outline-soft {
  background: #FFFFFF;
  border: 1px solid #E5E0D8;
  color: #555;
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-outline-soft:hover {
  background: #F5F2EC;
  color: #0B0B0B;
  border-color: #D8D2C7;
}

.spin-icon {
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Content Card */
.content-card {
  background: #FFFFFF !important;
  border-radius: 6px;
  border: 1px solid #EAE6DF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: relative;
  z-index: 2;
}

/* KPIs */
.kpi-card {
  background: #FFFFFF !important;
  border: 1px solid #EAE6DF;
  border-radius: 6px;
  padding: 0.75rem 0.85rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: relative;
  z-index: 2;
}

.kpi-label {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #8C827A;
  font-weight: 500;
}

.kpi-icon-badge {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #FAF8F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #7A7A7A;
}

.kpi-val {
  font-size: 1.15rem;
  font-weight: 600;
  color: #0B0B0B;
  font-family: 'Montserrat', sans-serif;
  line-height: 1.2;
  margin-bottom: 0.15rem;
}

.kpi-sub {
  font-size: 0.6875rem;
  color: #8C827A;
}

/* Search Box */
.search-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  color: #9E9E9E;
  font-size: 0.75rem;
}

.admin-search-control {
  padding-left: 30px;
  background: #FAF8F5;
  border: 1px solid #EAE6DF;
  border-radius: 4px;
  font-size: 0.75rem;
  height: 32px;
}

.admin-search-control:focus {
  background: #FFFFFF;
  border-color: #C9A46C;
  box-shadow: 0 0 0 2px rgba(201, 164, 108, 0.15);
}

.btn-clear-search {
  position: absolute;
  right: 6px;
  background: transparent;
  border: none;
  color: #888;
  font-size: 0.75rem;
}

/* Filter buttons */
.btn-filter {
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border: 1px solid #EAE6DF;
  background: #FFFFFF;
  color: #666;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-filter:hover {
  background: #FAF8F5;
  color: #0B0B0B;
}

.btn-filter.active {
  background: #0B0B0B;
  color: #FFFFFF;
  border-color: #0B0B0B;
}

/* Custom Table */
.custom-admin-table {
  background: #FFFFFF !important;
}

.custom-admin-table th {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #8C827A;
  font-weight: 600;
  border-bottom: 1px solid #EAE6DF;
  padding: 0.6rem 0.65rem;
  background: #FAF8F5 !important;
}

.custom-admin-table td {
  padding: 0.6rem 0.65rem;
  border-bottom: 1px solid #F5F2EC;
  background: #FFFFFF !important;
  font-size: 0.8125rem;
}

.client-avatar-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0B0B0B;
  color: #F5F2EC;
  font-weight: 600;
  font-size: 0.6875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-admin {
  background: #C9A46C;
  color: #0B0B0B;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-fullname {
  font-weight: 500;
  color: #0B0B0B;
  font-size: 0.8125rem;
  display: block;
}

.user-email {
  font-size: 0.75rem;
  color: #666;
}

/* Badges */
.badge-role {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.badge-role-admin {
  background: rgba(201, 164, 108, 0.15);
  color: #8C6D37;
  border: 1px solid rgba(201, 164, 108, 0.3);
}

.badge-role-customer {
  background: #F5F2EC;
  color: #555;
}

.badge-orders-btn {
  background: #FAF8F5;
  border: 1px solid #EAE6DF;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.15s;
}

.badge-orders-btn:hover {
  background: #0B0B0B;
  color: #F5F2EC;
  border-color: #0B0B0B;
}

.text-gold {
  color: #C9A46C !important;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 500;
  padding: 0.35rem 0.85rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.btn-mems-gold:hover {
  background: #B89358;
}

/* Modal */
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(11, 11, 11, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-dialog-custom {
  background: #FFFFFF;
  border-radius: 6px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border: 1px solid #EAE6DF;
}

.modal-header-luxury {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #EAE6DF;
  background: #FAF8F5;
}

.modal-title-custom {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0B0B0B;
}

.btn-close-luxury {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #7A7A7A;
  cursor: pointer;
}

.btn-close-luxury:hover {
  color: #0B0B0B;
}

.modal-body-content {
  padding: 1.25rem;
  max-height: 65vh;
  overflow-y: auto;
  font-size: 0.8125rem;
}

.modal-footer-luxury {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #EAE6DF;
  background: #FAF8F5;
}
</style>
