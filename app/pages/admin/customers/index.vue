<template>
  <div class="admin-customers-page">
    <!-- En-tête -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
      <div>
        <h1 class="page-title">Clients & Gestion des Accès</h1>
        <p class="text-muted mb-0">Base clientèle, historique d'achats et attribution des privilèges administrateur</p>
      </div>
      <div>
        <button class="btn btn-outline-dark" @click="loadData" :disabled="loading">
          <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin-icon': loading }"></i>
          Actualiser
        </button>
      </div>
    </div>

    <!-- KPIs Clients -->
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">TOTAL COMPTES</div>
          <div class="kpi-val">{{ users.length }}</div>
          <div class="kpi-sub"><i class="bi bi-people me-1 text-gold"></i>Utilisateurs enregistrés</div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">CLIENTS</div>
          <div class="kpi-val text-primary">{{ customersCount }}</div>
          <div class="kpi-sub"><i class="bi bi-person-check me-1 text-primary"></i>Acheteurs boutique</div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">ADMINISTRATEURS</div>
          <div class="kpi-val text-gold">{{ adminsCount }}</div>
          <div class="kpi-sub"><i class="bi bi-shield-lock me-1 text-gold"></i>Accès complet au dashboard</div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">VILLES CLIENTS</div>
          <div class="kpi-val">{{ uniqueCitiesCount }}</div>
          <div class="kpi-sub"><i class="bi bi-geo-alt me-1"></i>Répartition géographique</div>
        </div>
      </div>
    </div>

    <!-- Barre de recherche & Filtres -->
    <div class="filter-bar content-card mb-4">
      <div class="row g-3 align-items-center">
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
              class="btn"
              :class="roleFilter === 'all' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="roleFilter = 'all'"
            >
              Tous ({{ users.length }})
            </button>
            <button
              class="btn"
              :class="roleFilter === 'customer' ? 'btn-dark' : 'btn-outline-secondary'"
              @click="roleFilter = 'customer'"
            >
              Clients ({{ customersCount }})
            </button>
            <button
              class="btn"
              :class="roleFilter === 'admin' ? 'btn-dark' : 'btn-outline-secondary'"
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
                      <span :class="getStatusBadgeClass(ord.status)">
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #0B0B0B;
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
  border-radius: 8px;
  border: 1px solid #E5E0D8;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(11, 11, 11, 0.04);
  position: relative;
  z-index: 2;
}

/* KPIs */
.kpi-card {
  background: #FFFFFF !important;
  border: 1px solid #E5E0D8;
  border-radius: 8px;
  padding: 1.25rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 2;
}

.kpi-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7A7A7A;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.kpi-val {
  font-size: 1.625rem;
  font-weight: 700;
  color: #0B0B0B;
  font-family: 'Montserrat', sans-serif;
  line-height: 1.2;
}

.kpi-sub {
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.35rem;
}

/* Search Box */
.search-input-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #888;
}

.admin-search-control {
  padding-left: 36px;
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-clear-search {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: #888;
}

/* Custom Table */
.custom-admin-table {
  background: #FFFFFF !important;
}

.custom-admin-table th {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7A7A7A;
  font-weight: 600;
  border-bottom: 2px solid #F5F2EC;
  padding: 0.75rem 0.5rem;
  background: #FFFFFF !important;
}

.custom-admin-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #F5F2EC;
  background: #FFFFFF !important;
}

.client-avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0B0B0B;
  color: #F5F2EC;
  font-weight: 700;
  font-size: 0.75rem;
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
  font-weight: 600;
  color: #0B0B0B;
  font-size: 0.875rem;
  display: block;
}

.user-email {
  font-size: 0.8125rem;
  color: #444;
}

/* Badges */
.badge-role {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.badge-role-admin {
  background: rgba(201, 164, 108, 0.2);
  color: #8C6D37;
  border: 1px solid rgba(201, 164, 108, 0.4);
}

.badge-role-customer {
  background: #F5F2EC;
  color: #555;
}

.badge-orders-btn {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.2s;
}

.badge-orders-btn:hover {
  background: #0B0B0B;
  color: #F5F2EC;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
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
  border-radius: 10px;
  width: 100%;
  max-width: 620px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header-luxury {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #E5E0D8;
  background: #FAF8F5;
}

.modal-title-custom {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0B0B0B;
}

.btn-close-luxury {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #7A7A7A;
  cursor: pointer;
}

.btn-close-luxury:hover {
  color: #0B0B0B;
}

.modal-body-content {
  padding: 1.5rem;
  max-height: 65vh;
  overflow-y: auto;
}

.modal-footer-luxury {
  padding: 1rem 1.5rem;
  border-top: 1px solid #E5E0D8;
  background: #FAF8F5;
}
</style>
