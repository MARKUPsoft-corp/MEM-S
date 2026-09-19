<template>
  <div class="admin-dashboard-page">
    <!-- En-tête de page -->
    <div class="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-3 gap-2">
      <div>
        <h1 class="page-title mb-0">Tableau de Bord</h1>
        <p class="page-subtitle text-muted mb-0">Aperçu en temps réel de votre boutique</p>
      </div>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <NuxtLink to="/admin/products/create" class="btn btn-mems-gold btn-sm d-inline-flex align-items-center gap-1.5">
          <i class="bi bi-plus-lg"></i>
          <span>Ajouter un produit</span>
        </NuxtLink>
        <NuxtLink to="/admin/banners" class="btn btn-outline-soft btn-sm d-inline-flex align-items-center gap-1.5">
          <i class="bi bi-images"></i>
          <span>Bannières & Hero</span>
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="btn btn-outline-soft btn-sm d-inline-flex align-items-center gap-1.5">
          <i class="bi bi-whatsapp text-success"></i>
          <span>WhatsApp</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Cartes KPI : 2 par ligne sur mobile (col-6), 4 sur desktop (col-lg-3) -->
    <div class="row g-2 g-md-3 mb-3">
      <!-- KPI 1 : Ventes -->
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">Ventes Totales</span>
            <div class="kpi-icon-mini bg-gold-subtle text-gold">
              <i class="bi bi-cash-stack"></i>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">{{ formatPrice(totalSales) }}</span>
            <span class="kpi-currency">FCFA</span>
          </div>
          <span class="kpi-subtext text-muted">{{ completedOrdersCount }} traitées</span>
        </div>
      </div>

      <!-- KPI 2 : Commandes en Attente -->
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">En Attente</span>
            <div class="kpi-icon-mini bg-terracotta-subtle text-terracotta">
              <i class="bi bi-clock-history"></i>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">{{ pendingOrdersCount }}</span>
          </div>
          <span class="kpi-subtext text-warning fw-medium" v-if="pendingOrdersCount > 0">
            Action requise
          </span>
          <span class="kpi-subtext text-muted" v-else>À jour</span>
        </div>
      </div>

      <!-- KPI 3 : Total Produits -->
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">Total Produits</span>
            <div class="kpi-icon-mini bg-dark-subtle text-dark">
              <i class="bi bi-grid-3x3-gap"></i>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value">{{ totalProductsCount }}</span>
          </div>
          <span class="kpi-subtext text-muted">Sur 4 collections</span>
        </div>
      </div>

      <!-- KPI 4 : Alerte Stock Faible -->
      <div class="col-6 col-lg-3">
        <div class="kpi-card">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="kpi-label">Stock Faible</span>
            <div class="kpi-icon-mini bg-danger-subtle text-danger">
              <i class="bi bi-exclamation-triangle"></i>
            </div>
          </div>
          <div class="kpi-value-row">
            <span class="kpi-value" :class="{ 'text-danger': lowStockCount > 0 }">{{ lowStockCount }}</span>
          </div>
          <span class="kpi-subtext text-muted">Stock ≤ 3 articles</span>
        </div>
      </div>
    </div>

    <!-- Commandes Récentes & Actions Rapides -->
    <div class="row g-3">
      <!-- Tableau des commandes récentes -->
      <div class="col-lg-8">
        <div class="content-card h-100 d-flex flex-column">
          <div class="card-header-clean d-flex align-items-center justify-content-between mb-2">
            <h4 class="card-clean-title mb-0">Dernières Commandes</h4>
            <NuxtLink to="/admin/orders" class="btn-link-gold d-inline-flex align-items-center gap-1">
              Voir tout <i class="bi bi-arrow-right"></i>
            </NuxtLink>
          </div>

          <div v-if="loadingOrders" class="text-center py-4 my-auto">
            <div class="spinner-border spinner-border-sm text-gold" role="status"></div>
            <p class="mt-2 text-muted small">Chargement des commandes...</p>
          </div>

          <div v-else-if="recentOrders.length === 0" class="empty-state-box text-center py-4 my-auto">
            <i class="bi bi-bag-x fs-2 text-muted"></i>
            <p class="mt-2 mb-1 fw-medium small">Aucune commande enregistrée</p>
            <small class="text-muted" style="font-size: 0.6875rem;">Les nouvelles commandes apparaîtront ici.</small>
          </div>

          <div v-else class="table-responsive flex-grow-1">
            <table class="table table-hover align-middle mb-0 custom-admin-table">
              <thead>
                <tr>
                  <th>Réf</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th class="text-end">Contact</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.orderNumber">
                  <td>
                    <span class="order-ref">{{ order.orderNumber }}</span>
                    <small class="order-date d-block text-muted">{{ formatDate(order.createdAt) }}</small>
                  </td>
                  <td>
                    <span class="client-name">{{ order.customer?.name || 'Client' }}</span>
                    <small class="client-city d-block text-muted">{{ order.customer?.city || 'Cameroun' }}</small>
                  </td>
                  <td>
                    <span class="order-price">{{ formatPrice(order.total) }}</span>
                    <span class="order-currency"> FCFA</span>
                  </td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)" class="status-badge d-inline-flex align-items-center gap-1">
                      <i :class="getStatusIconClass(order.status)"></i>
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="d-inline-flex align-items-center gap-1">
                      <a
                        v-if="order.customer?.phone"
                        :href="getWhatsAppUrl(order)"
                        target="_blank"
                        class="btn-whatsapp-icon"
                        title="Contacter sur WhatsApp"
                      >
                        <i class="bi bi-whatsapp"></i>
                      </a>
                      <button
                        class="btn-delete-icon"
                        title="Supprimer la commande"
                        :disabled="deletingOrderId === order.orderNumber"
                        @click="deleteRecentOrder(order)"
                      >
                        <span v-if="deletingOrderId === order.orderNumber" class="spinner-border spinner-border-sm" style="width: 10px; height: 10px;"></span>
                        <i v-else class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Colonne Droite : Alertes & Accès Rapides -->
      <div class="col-lg-4">
        <!-- Raccourcis Rapides -->
        <div class="content-card mb-3">
          <h4 class="card-clean-title mb-2">Accès Rapides</h4>
          <div class="d-flex flex-column gap-1.5">
            <NuxtLink to="/admin/products/create" class="quick-action-btn">
              <div class="action-icon bg-gold-subtle text-gold"><i class="bi bi-plus-lg"></i></div>
              <div class="action-info">
                <span class="action-title">Nouveau Vêtement</span>
                <small class="text-muted">Ajouter au catalogue</small>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted" style="font-size: 0.6875rem;"></i>
            </NuxtLink>

            <NuxtLink to="/admin/banners" class="quick-action-btn">
              <div class="action-icon bg-terracotta-subtle text-terracotta"><i class="bi bi-images"></i></div>
              <div class="action-info">
                <span class="action-title">Visuels & Bannières</span>
                <small class="text-muted">Slides d'accueil & pages</small>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted" style="font-size: 0.6875rem;"></i>
            </NuxtLink>

            <NuxtLink to="/admin/categories" class="quick-action-btn">
              <div class="action-icon bg-dark-subtle text-dark"><i class="bi bi-folder2-open"></i></div>
              <div class="action-info">
                <span class="action-title">Catégories</span>
                <small class="text-muted">Gérer les collections</small>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted" style="font-size: 0.6875rem;"></i>
            </NuxtLink>
          </div>
        </div>

        <!-- Produits avec stock critique -->
        <div class="content-card">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h4 class="card-clean-title mb-0">Stock Faible</h4>
            <NuxtLink to="/admin/products?filter=low_stock" class="btn-link-gold small">Voir tout</NuxtLink>
          </div>

          <div v-if="lowStockProducts.length === 0" class="text-center py-3 text-muted">
            <i class="bi bi-check2-circle fs-4 text-success d-block mb-1"></i>
            <small style="font-size: 0.75rem;">Tous les stocks sont normaux.</small>
          </div>

          <div v-else class="low-stock-list">
            <div
              v-for="prod in lowStockProducts.slice(0, 4)"
              :key="prod.id"
              class="low-stock-item d-flex align-items-center justify-content-between py-1.5 border-bottom"
            >
              <div class="d-flex align-items-center gap-2">
                <img :src="getProductThumb(prod)" class="thumb-mini" alt="" />
                <div>
                  <span class="product-mini-name">{{ prod.name }}</span>
                  <small class="text-muted d-block" style="font-size: 0.6875rem;">{{ prod.category?.name }}</small>
                </div>
              </div>
              <span class="badge bg-danger-subtle text-danger border border-danger-subtle" style="font-size: 0.6875rem;">
                {{ prod.stock }} restants
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs, doc, deleteDoc, query, orderBy, limit } from 'firebase/firestore'
import { useFirebase } from '../../../composables/useFirebase'
import { FirestoreProductsService } from '../../../services/firestoreProducts'
import type { Product } from '../../../types/product'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { db } = useFirebase()

const totalSales = ref(0)
const completedOrdersCount = ref(0)
const pendingOrdersCount = ref(0)
const totalProductsCount = ref(0)
const lowStockCount = ref(0)

const recentOrders = ref<any[]>([])
const lowStockProducts = ref<Product[]>([])
const loadingOrders = ref(true)
const deletingOrderId = ref<string | null>(null)

const formatPrice = (price: number) => {
  return (price || 0).toLocaleString('fr-FR')
}

const formatDate = (isoStr: string) => {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'badge bg-success'
    case 'delivered':
      return 'badge bg-primary'
    case 'cancelled':
      return 'badge bg-secondary'
    default:
      return 'badge bg-warning text-dark'
  }
}

const getStatusIconClass = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bi bi-check-circle-fill'
    case 'delivered':
      return 'bi bi-check2-all'
    case 'cancelled':
      return 'bi bi-x-circle-fill'
    default:
      return 'bi bi-clock-history'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmée'
    case 'delivered':
      return 'Livrée'
    case 'cancelled':
      return 'Annulée'
    default:
      return 'En attente'
  }
}

const getProductThumb = (prod: Product) => {
  if (prod.images && prod.images.length > 0) {
    const img: any = prod.images[0]
    return typeof img === 'object' ? img.image : img
  }
  return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop'
}

const getWhatsAppUrl = (order: any) => {
  const phone = order.customer?.phone?.replace(/\D/g, '') || ''
  const text = encodeURIComponent(
    `Bonjour ${order.customer?.name || ''}, suite à votre commande ${order.orderNumber} sur MEM'S d'un montant de ${formatPrice(order.total)} FCFA, nous vous contactons pour finaliser la livraison.`
  )
  return `https://wa.me/${phone}?text=${text}`
}

const deleteRecentOrder = async (order: any) => {
  if (!order || !order.orderNumber) return
  const refNum = order.orderNumber
  const ok = confirm(`Êtes-vous sûr de vouloir supprimer définitivement la commande "${refNum}" ?\nCette action est irréversible.`)
  if (!ok) return

  deletingOrderId.value = refNum
  try {
    if (db) {
      await deleteDoc(doc(db, 'orders', refNum))
    }
    recentOrders.value = recentOrders.value.filter(o => o.orderNumber !== refNum)
    totalSales.value = Math.max(0, totalSales.value - (order.total || 0))
    if (order.status === 'pending') {
      pendingOrdersCount.value = Math.max(0, pendingOrdersCount.value - 1)
    } else if (order.status === 'confirmed' || order.status === 'delivered') {
      completedOrdersCount.value = Math.max(0, completedOrdersCount.value - 1)
    }
  } catch (err: any) {
    console.error('[Dashboard] Erreur suppression commande:', err)
    alert(`Erreur lors de la suppression de la commande : ${err.message}`)
  } finally {
    deletingOrderId.value = null
  }
}

onMounted(async () => {
  // 1. Charger les produits pour les métriques de stock
  try {
    const prodRes = await FirestoreProductsService.getProducts()
    const allProducts = prodRes.results || []
    totalProductsCount.value = allProducts.length

    const low = allProducts.filter(p => (p.stock || 0) <= 3)
    lowStockCount.value = low.length
    lowStockProducts.value = low
  } catch (err) {
    console.warn('[Dashboard] Erreur chargement produits:', err)
  }

  // 2. Charger les commandes depuis Firestore
  if (db) {
    try {
      loadingOrders.value = true
      const ordersRef = collection(db, 'orders')
      const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(15))
      const snap = await getDocs(q)

      let sales = 0
      let pending = 0
      let completed = 0
      const list: any[] = []

      snap.forEach(doc => {
        const data = doc.data()
        list.push({ ...data, orderNumber: doc.id })
        sales += data.total || 0
        if (data.status === 'pending') {
          pending++
        } else if (data.status === 'confirmed' || data.status === 'delivered') {
          completed++
        }
      })

      recentOrders.value = list.slice(0, 5)
      totalSales.value = sales
      pendingOrdersCount.value = pending
      completedOrdersCount.value = completed
    } catch (err) {
      console.warn('[Dashboard] Erreur chargement commandes:', err)
    } finally {
      loadingOrders.value = false
    }
  } else {
    loadingOrders.value = false
  }
})
</script>

<style scoped>
.page-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.2px;
}

.page-subtitle {
  font-size: 0.75rem;
  color: #7A7A7A;
  font-weight: 400;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 500;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 4px;
  letter-spacing: 0.2px;
  transition: all 0.15s ease;
}

.btn-mems-gold:hover {
  background: #B89358;
  color: #0B0B0B;
}

.btn-outline-soft {
  background: #FFFFFF;
  border: 1px solid #ECE7E1;
  color: #2D2D2D;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-outline-soft:hover {
  background: #FAF8F5;
  border-color: #C9A46C;
  color: #0B0B0B;
}

/* Cartes KPI */
.kpi-card {
  background: #FFFFFF !important;
  border-radius: 6px;
  border: 1px solid #ECE7E1;
  padding: 0.85rem 0.95rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  z-index: 2;
  min-height: 92px;
}

.kpi-card:hover {
  border-color: #D6CEBE;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.kpi-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #8C8C8C;
  display: block;
}

.kpi-icon-mini {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  flex-shrink: 0;
}

.bg-gold-subtle {
  background: rgba(201, 164, 108, 0.14);
}

.text-gold {
  color: #C9A46C !important;
}

.bg-terracotta-subtle {
  background: rgba(161, 78, 54, 0.12);
}

.text-terracotta {
  color: #A14E36 !important;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin: 0.15rem 0;
}

.kpi-value {
  font-size: 1.15rem;
  font-weight: 600;
  color: #111111;
  line-height: 1.2;
}

.kpi-currency {
  font-size: 0.6875rem;
  color: #8C8C8C;
  font-weight: 500;
}

.kpi-subtext {
  font-size: 0.6875rem;
  line-height: 1.2;
}

/* Content Cards */
.content-card {
  background: #FFFFFF !important;
  border-radius: 6px;
  border: 1px solid #ECE7E1;
  padding: 1.1rem 1.15rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: relative;
  z-index: 2;
}

.card-clean-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111111;
}

.btn-link-gold {
  color: #C9A46C;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem;
}

.btn-link-gold:hover {
  color: #B89358;
  text-decoration: underline;
}

/* Tableau custom */
.custom-admin-table {
  background: #FFFFFF !important;
}

.custom-admin-table th {
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #8C8C8C;
  font-weight: 600;
  border-bottom: 1px solid #ECE7E1;
  padding: 0.5rem 0.4rem;
  background: #FFFFFF !important;
}

.custom-admin-table td {
  padding: 0.55rem 0.4rem;
  border-bottom: 1px solid #F5F2EC;
  background: #FFFFFF !important;
}

.order-ref {
  font-size: 0.75rem;
  font-weight: 600;
  color: #111111;
  font-family: monospace;
}

.order-date {
  font-size: 0.6875rem;
  color: #8A8A8A;
}

.client-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #111111;
  display: block;
}

.client-city {
  font-size: 0.6875rem;
  color: #8A8A8A;
}

.order-price {
  font-size: 0.75rem;
  font-weight: 600;
  color: #111111;
}

.order-currency {
  font-size: 0.6875rem;
  color: #8A8A8A;
}

.status-badge {
  font-size: 0.625rem;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 20px;
}

.btn-whatsapp-icon {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(37, 211, 102, 0.1);
  color: #25D366;
  text-decoration: none;
  border: 1px solid rgba(37, 211, 102, 0.25);
  font-size: 0.8125rem;
  transition: all 0.15s ease;
}

.btn-whatsapp-icon:hover {
  background: #25D366;
  color: #FFFFFF;
}

.btn-delete-icon {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #FFF5F5;
  color: #DC3545;
  border: 1px solid #FFEBEB;
  font-size: 0.75rem;
  transition: all 0.15s ease;
  cursor: pointer;
  padding: 0;
}

.btn-delete-icon:hover:not(:disabled) {
  background: #DC3545;
  color: #FFFFFF;
}

.btn-delete-icon:disabled {
  opacity: 0.6;
}

/* Quick Actions */
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
  background: #FAF8F5 !important;
  border: 1px solid #ECE7E1;
  transition: all 0.15s ease;
}

.quick-action-btn:hover {
  background: #FFFFFF !important;
  border-color: #C9A46C;
}

.action-icon {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.action-title {
  font-size: 0.75rem;
  font-weight: 500;
  display: block;
  line-height: 1.2;
}

.quick-action-btn small {
  font-size: 0.6875rem;
  line-height: 1.1;
}

/* Low Stock */
.thumb-mini {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
}

.product-mini-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #111111;
  display: block;
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 575.98px) {
  .kpi-card {
    padding: 0.7rem 0.75rem;
    min-height: 84px;
  }
  .kpi-value {
    font-size: 1rem;
  }
  .content-card {
    padding: 0.85rem 0.75rem;
  }
}
</style>
