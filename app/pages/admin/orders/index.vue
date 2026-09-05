<template>
  <div class="admin-orders-page">
    <!-- En-tête -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
      <div>
        <h1 class="page-title">Gestion des Commandes</h1>
        <p class="text-muted mb-0">Suivi des ventes, traitement et fidélisation client WhatsApp</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-dark" @click="fetchOrders" :disabled="loading">
          <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin-icon': loading }"></i>
          Actualiser
        </button>
      </div>
    </div>

    <!-- KPIs Commandes -->
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">TOTAL COMMANDES</div>
          <div class="kpi-val">{{ orders.length }}</div>
          <div class="kpi-sub"><i class="bi bi-bag-check me-1 text-gold"></i>Historique complet</div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">EN ATTENTE</div>
          <div class="kpi-val text-warning">{{ pendingCount }}</div>
          <div class="kpi-sub"><i class="bi bi-clock-history me-1 text-warning"></i>À traiter rapidement</div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">LIVRÉES / FINALISÉES</div>
          <div class="kpi-val text-success">{{ deliveredCount }}</div>
          <div class="kpi-sub"><i class="bi bi-check-circle me-1 text-success"></i>Commandes abouties</div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="kpi-card">
          <div class="kpi-label">CHIFFRE D'AFFAIRES</div>
          <div class="kpi-val text-gold">{{ formatPrice(totalRevenue) }} <span class="kpi-currency">FCFA</span></div>
          <div class="kpi-sub"><i class="bi bi-graph-up-arrow me-1 text-gold"></i>Ventes confirmées</div>
        </div>
      </div>
    </div>

    <!-- Filtres & Onglets de Statut -->
    <div class="filter-bar content-card mb-4">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 border-bottom pb-3">
        <!-- Status Tabs -->
        <div class="status-pills d-flex flex-wrap gap-2">
          <button
            class="status-pill-btn"
            :class="{ active: statusFilter === 'all' }"
            @click="statusFilter = 'all'"
          >
            Toutes <span class="pill-badge">{{ orders.length }}</span>
          </button>
          <button
            class="status-pill-btn"
            :class="{ active: statusFilter === 'pending' }"
            @click="statusFilter = 'pending'"
          >
            En attente <span class="pill-badge pill-badge-warning">{{ pendingCount }}</span>
          </button>
          <button
            class="status-pill-btn"
            :class="{ active: statusFilter === 'confirmed' }"
            @click="statusFilter = 'confirmed'"
          >
            Confirmées <span class="pill-badge pill-badge-primary">{{ confirmedCount }}</span>
          </button>
          <button
            class="status-pill-btn"
            :class="{ active: statusFilter === 'delivered' }"
            @click="statusFilter = 'delivered'"
          >
            Livrées <span class="pill-badge pill-badge-success">{{ deliveredCount }}</span>
          </button>
          <button
            class="status-pill-btn"
            :class="{ active: statusFilter === 'cancelled' }"
            @click="statusFilter = 'cancelled'"
          >
            Annulées <span class="pill-badge pill-badge-secondary">{{ cancelledCount }}</span>
          </button>
        </div>

        <!-- Sort Select -->
        <div class="d-flex align-items-center gap-2">
          <label class="text-muted small text-nowrap mb-0">Trier par :</label>
          <select v-model="sortBy" class="form-select form-select-sm admin-select-control w-auto">
            <option value="recent">Plus récentes d'abord</option>
            <option value="oldest">Plus anciennes d'abord</option>
            <option value="amount-desc">Montant le plus élevé</option>
            <option value="amount-asc">Montant le plus faible</option>
          </select>
        </div>
      </div>

      <!-- Recherche textuelle -->
      <div class="row g-2 align-items-center">
        <div class="col-md-6">
          <div class="search-input-box">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control admin-search-control"
              placeholder="Rechercher par n° commande, nom du client, téléphone, ville..."
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
        <div class="col-md-6 text-md-end text-muted small">
          Affichage de {{ filteredOrders.length }} commande(s)
        </div>
      </div>
    </div>

    <!-- Tableau des Commandes -->
    <div class="content-card">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-gold" role="status"></div>
        <p class="mt-2 text-muted small">Chargement des commandes depuis Firestore...</p>
      </div>

      <div v-else-if="filteredOrders.length === 0" class="empty-state-box text-center py-5">
        <i class="bi bi-inbox fs-1 text-muted"></i>
        <p class="mt-2 mb-1 fw-medium">Aucune commande trouvée</p>
        <small class="text-muted">
          {{ searchQuery || statusFilter !== 'all' ? 'Essayez de réinitialiser vos critères de recherche.' : 'Les nouvelles commandes passées par vos clients apparaîtront ici.' }}
        </small>
        <div v-if="searchQuery || statusFilter !== 'all'" class="mt-3">
          <button class="btn btn-sm btn-outline-dark" @click="resetFilters">
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover align-middle mb-0 custom-admin-table">
          <thead>
            <tr>
              <th style="width: 150px;">Réf & Date</th>
              <th>Client</th>
              <th>Articles</th>
              <th>Total</th>
              <th style="width: 170px;">Statut</th>
              <th class="text-end" style="width: 130px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.orderNumber">
              <!-- Réf & Date -->
              <td>
                <span class="order-ref-badge">{{ order.orderNumber }}</span>
                <small class="text-muted d-block mt-1">{{ formatDate(order.createdAt) }}</small>
              </td>

              <!-- Client -->
              <td>
                <div class="d-flex align-items-center gap-2">
                  <div class="client-avatar-circle">
                    {{ getClientInitials(order.customer?.name) }}
                  </div>
                  <div>
                    <span class="client-name">{{ order.customer?.name || 'Client anonyme' }}</span>
                    <div class="d-flex align-items-center gap-2 text-muted small">
                      <span v-if="order.customer?.phone">
                        <i class="bi bi-telephone-fill me-1 text-gold"></i>{{ order.customer.phone }}
                      </span>
                      <span v-if="order.customer?.city">
                        • <i class="bi bi-geo-alt me-1"></i>{{ order.customer.city }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Articles aperçu -->
              <td>
                <span class="badge bg-light text-dark border me-1">
                  {{ order.items?.length || 0 }} article(s)
                </span>
                <span class="text-muted small d-inline-block text-truncate align-bottom" style="max-width: 220px;">
                  {{ getItemsPreview(order.items) }}
                </span>
              </td>

              <!-- Total -->
              <td>
                <span class="order-price">{{ formatPrice(order.total) }}</span>
                <span class="order-currency"> FCFA</span>
              </td>

              <!-- Statut & Sélecteur rapide -->
              <td>
                <select
                  :value="order.status || 'pending'"
                  class="form-select form-select-sm status-select"
                  :class="`status-${order.status || 'pending'}`"
                  @change="updateOrderStatus(order, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="pending">⏳ En attente</option>
                  <option value="confirmed">✅ Confirmée</option>
                  <option value="shipped">🚚 Expédiée</option>
                  <option value="delivered">🎉 Livrée</option>
                  <option value="cancelled">❌ Annulée</option>
                </select>
              </td>

              <!-- Actions -->
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button
                    class="btn btn-outline-dark"
                    title="Voir les détails complets"
                    @click="openOrderModal(order)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <a
                    v-if="order.customer?.phone"
                    :href="getWhatsAppUrl(order)"
                    target="_blank"
                    class="btn btn-outline-success"
                    title="Contacter le client sur WhatsApp"
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
          Page {{ currentPage }} sur {{ totalPages }} ({{ filteredOrders.length }} commandes)
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

    <!-- MODAL DÉTAILS DE LA COMMANDE -->
    <Teleport to="body">
      <div v-if="selectedOrder" class="modal-backdrop-custom" @click="closeOrderModal">
        <div class="modal-dialog-custom" @click.stop>
          <div class="modal-header-luxury d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <span class="modal-order-number">{{ selectedOrder.orderNumber }}</span>
              <span :class="getStatusBadgeClass(selectedOrder.status)">
                {{ getStatusLabel(selectedOrder.status) }}
              </span>
            </div>
            <button class="btn-close-luxury" @click="closeOrderModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body-content">
            <!-- Section Client -->
            <div class="detail-section mb-4">
              <h5 class="section-subtitle"><i class="bi bi-person-lines-fill me-2 text-gold"></i>Coordonnées Client</h5>
              <div class="info-grid-luxury">
                <div class="info-cell">
                  <span class="cell-label">Nom complet</span>
                  <span class="cell-val">{{ selectedOrder.customer?.name || 'Non spécifié' }}</span>
                </div>
                <div class="info-cell">
                  <span class="cell-label">Téléphone / WhatsApp</span>
                  <span class="cell-val">
                    <a v-if="selectedOrder.customer?.phone" :href="`tel:${selectedOrder.customer.phone}`" class="text-decoration-none text-dark fw-bold">
                      <i class="bi bi-telephone me-1 text-gold"></i>{{ selectedOrder.customer.phone }}
                    </a>
                    <span v-else class="text-muted">Non renseigné</span>
                  </span>
                </div>
                <div class="info-cell">
                  <span class="cell-label">Email</span>
                  <span class="cell-val">{{ selectedOrder.customer?.email || 'Non renseigné' }}</span>
                </div>
                <div class="info-cell">
                  <span class="cell-label">Ville & Adresse</span>
                  <span class="cell-val">
                    {{ selectedOrder.customer?.address ? `${selectedOrder.customer.address}, ` : '' }}
                    {{ selectedOrder.customer?.city || 'Cameroun' }}
                  </span>
                </div>
              </div>

              <!-- Message / Instructions client -->
              <div v-if="selectedOrder.notes" class="order-notes-box mt-3">
                <div class="notes-header"><i class="bi bi-chat-left-quote me-2 text-gold"></i>Instructions ou message du client :</div>
                <p class="notes-text mb-0">{{ selectedOrder.notes }}</p>
              </div>
            </div>

            <!-- Section Articles Commandés -->
            <div class="detail-section mb-4">
              <h5 class="section-subtitle">
                <i class="bi bi-bag-check me-2 text-gold"></i>Articles commandés ({{ selectedOrder.items?.length || 0 }})
              </h5>
              <div class="items-table-box">
                <table class="table table-sm align-middle mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th>Article</th>
                      <th class="text-center">Qté</th>
                      <th class="text-end">Prix Unit.</th>
                      <th class="text-end">Sous-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedOrder.items" :key="item.id || item.name">
                      <td>
                        <span class="fw-semibold text-dark">{{ item.name }}</span>
                        <small v-if="item.variant" class="d-block text-gold">
                          Option: {{ item.variant }}
                        </small>
                      </td>
                      <td class="text-center fw-bold">x{{ item.quantity }}</td>
                      <td class="text-end">{{ formatPrice(item.price) }} FCFA</td>
                      <td class="text-end fw-bold">{{ formatPrice(item.price * item.quantity) }} FCFA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Récapitulatif Financier -->
            <div class="detail-section mb-4">
              <div class="financial-summary-card">
                <div class="d-flex justify-content-between py-1">
                  <span class="text-muted">Sous-total :</span>
                  <span class="fw-semibold">{{ formatPrice(selectedOrder.subtotal || selectedOrder.total) }} FCFA</span>
                </div>
                <div class="d-flex justify-content-between py-1">
                  <span class="text-muted">Frais de livraison :</span>
                  <span class="text-success fw-bold">Gratuite</span>
                </div>
                <div class="d-flex justify-content-between py-2 border-top mt-2">
                  <span class="fs-5 fw-bold text-dark">Total Commande :</span>
                  <span class="fs-5 fw-bold text-gold">{{ formatPrice(selectedOrder.total) }} FCFA</span>
                </div>
              </div>
            </div>

            <!-- Changement de statut dans le modal -->
            <div class="detail-section mb-2">
              <h5 class="section-subtitle"><i class="bi bi-gear me-2 text-gold"></i>Mettre à jour le statut</h5>
              <div class="d-flex flex-wrap gap-2">
                <button
                  class="btn btn-sm"
                  :class="selectedOrder.status === 'pending' ? 'btn-warning' : 'btn-outline-warning'"
                  @click="updateOrderStatus(selectedOrder, 'pending')"
                >
                  ⏳ En attente
                </button>
                <button
                  class="btn btn-sm"
                  :class="selectedOrder.status === 'confirmed' ? 'btn-primary' : 'btn-outline-primary'"
                  @click="updateOrderStatus(selectedOrder, 'confirmed')"
                >
                  ✅ Confirmée
                </button>
                <button
                  class="btn btn-sm"
                  :class="selectedOrder.status === 'shipped' ? 'btn-info text-white' : 'btn-outline-info'"
                  @click="updateOrderStatus(selectedOrder, 'shipped')"
                >
                  🚚 Expédiée
                </button>
                <button
                  class="btn btn-sm"
                  :class="selectedOrder.status === 'delivered' ? 'btn-success' : 'btn-outline-success'"
                  @click="updateOrderStatus(selectedOrder, 'delivered')"
                >
                  🎉 Livrée
                </button>
                <button
                  class="btn btn-sm"
                  :class="selectedOrder.status === 'cancelled' ? 'btn-secondary' : 'btn-outline-secondary'"
                  @click="updateOrderStatus(selectedOrder, 'cancelled')"
                >
                  ❌ Annulée
                </button>
              </div>
            </div>
          </div>

          <!-- Footer du Modal -->
          <div class="modal-footer-luxury d-flex justify-content-between align-items-center">
            <button class="btn btn-outline-secondary" @click="closeOrderModal">
              Fermer
            </button>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-dark" @click="printReceipt">
                <i class="bi bi-printer me-1"></i> Imprimer Reçu
              </button>
              <a
                v-if="selectedOrder.customer?.phone"
                :href="getWhatsAppUrl(selectedOrder)"
                target="_blank"
                class="btn btn-success"
              >
                <i class="bi bi-whatsapp me-1"></i> Contacter Client WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { useFirebase } from '~~/composables/useFirebase'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { db } = useFirebase()

const orders = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref<string>('all')
const sortBy = ref<string>('recent')
const currentPage = ref(1)
const itemsPerPage = 12

const selectedOrder = ref<any | null>(null)

// Formatage du prix
const formatPrice = (price: number) => {
  return (price || 0).toLocaleString('fr-FR')
}

// Formatage de date
const formatDate = (isoStr: string) => {
  if (!isoStr) return 'Date inconnue'
  const d = new Date(isoStr)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initiales client
const getClientInitials = (name?: string) => {
  if (!name) return 'CL'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Aperçu des articles
const getItemsPreview = (items?: any[]) => {
  if (!items || items.length === 0) return 'Aucun article'
  return items.map(i => `${i.name} (x${i.quantity})`).join(', ')
}

// Badges & Labels statut
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
const pendingCount = computed(() => orders.value.filter(o => !o.status || o.status === 'pending').length)
const confirmedCount = computed(() => orders.value.filter(o => o.status === 'confirmed').length)
const deliveredCount = computed(() => orders.value.filter(o => o.status === 'delivered').length)
const cancelledCount = computed(() => orders.value.filter(o => o.status === 'cancelled').length)

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status === 'confirmed' || o.status === 'delivered')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0)
})

// Filtrage & Recherche
const filteredOrders = computed(() => {
  let list = [...orders.value]

  // Filtre statut
  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'pending') {
      list = list.filter(o => !o.status || o.status === 'pending')
    } else {
      list = list.filter(o => o.status === statusFilter.value)
    }
  }

  // Filtre recherche textuelle
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(o => {
      const matchRef = o.orderNumber?.toLowerCase().includes(q)
      const matchName = o.customer?.name?.toLowerCase().includes(q)
      const matchPhone = o.customer?.phone?.toLowerCase().includes(q)
      const matchCity = o.customer?.city?.toLowerCase().includes(q)
      const matchItems = o.items?.some((it: any) => it.name?.toLowerCase().includes(q))
      return matchRef || matchName || matchPhone || matchCity || matchItems
    })
  }

  // Tri
  if (sortBy.value === 'recent') {
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  } else if (sortBy.value === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
  } else if (sortBy.value === 'amount-desc') {
    list.sort((a, b) => (b.total || 0) - (a.total || 0))
  } else if (sortBy.value === 'amount-asc') {
    list.sort((a, b) => (a.total || 0) - (b.total || 0))
  }

  return list
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage) || 1)
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredOrders.value.slice(start, start + itemsPerPage)
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  sortBy.value = 'recent'
  currentPage.value = 1
}

// Chargement des commandes Firestore
const fetchOrders = async () => {
  if (!db) return
  loading.value = true
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    orders.value = snap.docs.map(doc => ({
      orderNumber: doc.id,
      ...doc.data()
    }))
  } catch (err) {
    console.warn('[Orders] Erreur chargement commandes:', err)
  } finally {
    loading.value = false
  }
}

// Mise à jour de statut dans Firestore
const updateOrderStatus = async (order: any, newStatus: string) => {
  if (!db) return
  try {
    const orderDocRef = doc(db, 'orders', order.orderNumber)
    await updateDoc(orderDocRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    })
    order.status = newStatus
    if (selectedOrder.value && selectedOrder.value.orderNumber === order.orderNumber) {
      selectedOrder.value.status = newStatus
    }
  } catch (err: any) {
    alert(`Erreur de mise à jour du statut : ${err.message}`)
  }
}

// Modals
const openOrderModal = (order: any) => {
  selectedOrder.value = order
}

const closeOrderModal = () => {
  selectedOrder.value = null
}

// Lien WhatsApp interactif vers le client
const getWhatsAppUrl = (order: any) => {
  const phone = order.customer?.phone?.replace(/\D/g, '') || ''
  const statusFr = getStatusLabel(order.status || 'pending')
  const message = encodeURIComponent(
    `Bonjour ${order.customer?.name || ''},\n` +
    `Concernant votre commande *${order.orderNumber}* sur MEM'S d'un montant de *${formatPrice(order.total)} FCFA* :\n` +
    `Statut actuel : *${statusFr}*.\n\n` +
    `Nous restons à votre entière disposition pour toute précision.`
  )
  return `https://wa.me/${phone}?text=${message}`
}

// Impression du reçu
const printReceipt = () => {
  window.print()
}

onMounted(() => {
  fetchOrders()
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

.kpi-currency {
  font-size: 0.875rem;
  color: #7A7A7A;
  font-weight: 500;
}

.kpi-sub {
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.35rem;
}

/* Status Pills */
.status-pill-btn {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.status-pill-btn:hover {
  background: #EFEBE4;
  color: #0B0B0B;
}

.status-pill-btn.active {
  background: #0B0B0B;
  color: #F5F2EC;
  border-color: #0B0B0B;
}

.pill-badge {
  background: rgba(0, 0, 0, 0.08);
  font-size: 0.6875rem;
  padding: 1px 6px;
  border-radius: 10px;
}

.status-pill-btn.active .pill-badge {
  background: #C9A46C;
  color: #0B0B0B;
}

.pill-badge-warning {
  background: #fff3cd;
  color: #664d03;
}

.pill-badge-primary {
  background: #cfe2ff;
  color: #084298;
}

.pill-badge-success {
  background: #d1e7dd;
  color: #0f5132;
}

.pill-badge-secondary {
  background: #e2e3e5;
  color: #41464b;
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

.admin-select-control {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 6px;
  font-size: 0.8125rem;
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

.order-ref-badge {
  font-family: monospace;
  font-weight: 700;
  color: #0B0B0B;
  background: #FAF8F5;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid #E5E0D8;
  font-size: 0.8125rem;
}

.client-avatar-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #0B0B0B;
  color: #C9A46C;
  font-weight: 700;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.client-name {
  font-weight: 600;
  color: #0B0B0B;
  font-size: 0.875rem;
  display: block;
}

.order-price {
  font-weight: 700;
  color: #0B0B0B;
}

.order-currency {
  font-size: 0.75rem;
  color: #7A7A7A;
}

/* Status select */
.status-select {
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
}

.status-pending {
  background-color: #fff3cd;
  border-color: #ffecb5;
  color: #664d03;
}

.status-confirmed {
  background-color: #cfe2ff;
  border-color: #b6d4fe;
  color: #084298;
}

.status-shipped {
  background-color: #cff4fc;
  border-color: #b6effb;
  color: #055160;
}

.status-delivered {
  background-color: #d1e7dd;
  border-color: #badbcc;
  color: #0f5132;
}

.status-cancelled {
  background-color: #e2e3e5;
  border-color: #d3d6d8;
  color: #41464b;
}

/* MODAL STYLES */
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
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header-luxury {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #E5E0D8;
  background: #FAF8F5;
}

.modal-order-number {
  font-family: monospace;
  font-size: 1.25rem;
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
  overflow-y: auto;
}

.section-subtitle {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0B0B0B;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-grid-luxury {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
  background: #FAF8F5;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #E5E0D8;
}

.info-cell {
  display: flex;
  flex-direction: column;
}

.cell-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  color: #7A7A7A;
  font-weight: 600;
}

.cell-val {
  font-size: 0.875rem;
  color: #0B0B0B;
  font-weight: 500;
  margin-top: 2px;
}

.order-notes-box {
  background: rgba(201, 164, 108, 0.08);
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 6px;
  padding: 0.75rem 1rem;
}

.notes-header {
  font-size: 0.75rem;
  font-weight: 700;
  color: #8C6D37;
  margin-bottom: 0.25rem;
}

.notes-text {
  font-size: 0.875rem;
  color: #333;
}

.items-table-box {
  border: 1px solid #E5E0D8;
  border-radius: 6px;
  overflow: hidden;
}

.financial-summary-card {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.modal-footer-luxury {
  padding: 1rem 1.5rem;
  border-top: 1px solid #E5E0D8;
  background: #FAF8F5;
}
</style>
