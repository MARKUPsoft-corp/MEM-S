<template>
  <div class="admin-dashboard-page">
    <!-- En-tête de page -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
      <div>
        <h1 class="page-title">Tableau de Bord</h1>
        <p class="text-muted mb-0">Aperçu en temps réel de votre boutique MEM'S</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <NuxtLink to="/admin/products/create" class="btn btn-mems-gold">
          <i class="bi bi-plus-circle me-1"></i> Ajouter un produit
        </NuxtLink>
        <NuxtLink to="/admin/banners" class="btn btn-outline-dark">
          <i class="bi bi-images me-1"></i> Bannières & Hero
        </NuxtLink>
        <NuxtLink to="/admin/settings" class="btn btn-outline-dark">
          <i class="bi bi-whatsapp me-1 text-success"></i> Paramètres WhatsApp
        </NuxtLink>
      </div>
    </div>

    <!-- Cartes KPI -->
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-xl-3">
        <div class="kpi-card">
          <div class="kpi-icon-box bg-gold-subtle text-gold">
            <i class="bi bi-cash-stack"></i>
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Ventes Totales</span>
            <h3 class="kpi-value">{{ formatPrice(totalSales) }} FCFA</h3>
            <span class="kpi-subtext text-muted">{{ completedOrdersCount }} commandes traitées</span>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="kpi-card">
          <div class="kpi-icon-box bg-terracotta-subtle text-terracotta">
            <i class="bi bi-clock-history"></i>
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Commandes en Attente</span>
            <h3 class="kpi-value">{{ pendingOrdersCount }}</h3>
            <span class="kpi-subtext text-warning fw-semibold" v-if="pendingOrdersCount > 0">
              Action requise sur WhatsApp
            </span>
            <span class="kpi-subtext text-muted" v-else>À jour</span>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="kpi-card">
          <div class="kpi-icon-box bg-dark-subtle text-dark">
            <i class="bi bi-grid-3x3-gap"></i>
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Total Produits</span>
            <h3 class="kpi-value">{{ totalProductsCount }}</h3>
            <span class="kpi-subtext text-muted">Sur 4 collections</span>
          </div>
        </div>
      </div>

      <div class="col-sm-6 col-xl-3">
        <div class="kpi-card">
          <div class="kpi-icon-box bg-danger-subtle text-danger">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <div class="kpi-data">
            <span class="kpi-label">Alerte Stock Faible</span>
            <h3 class="kpi-value text-danger">{{ lowStockCount }}</h3>
            <span class="kpi-subtext text-muted">Articles avec stock ≤ 3</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Commandes Récentes & Actions Rapides -->
    <div class="row g-4">
      <!-- Tableau des commandes récentes -->
      <div class="col-lg-8">
        <div class="content-card">
          <div class="card-header-clean d-flex align-items-center justify-content-between">
            <h4 class="card-clean-title mb-0">Dernières Commandes</h4>
            <NuxtLink to="/admin/orders" class="btn-link-gold">Voir tout →</NuxtLink>
          </div>

          <div v-if="loadingOrders" class="text-center py-5">
            <div class="spinner-border text-gold" role="status"></div>
            <p class="mt-2 text-muted small">Chargement des commandes...</p>
          </div>

          <div v-else-if="recentOrders.length === 0" class="empty-state-box text-center py-5">
            <i class="bi bi-bag-x fs-1 text-muted"></i>
            <p class="mt-2 mb-1 fw-medium">Aucune commande enregistrée pour le moment</p>
            <small class="text-muted">Les nouvelles commandes passées par vos clients apparaîtront ici.</small>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0 custom-admin-table">
              <thead>
                <tr>
                  <th>Réf Commande</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th class="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.orderNumber">
                  <td>
                    <span class="fw-bold text-dark">{{ order.orderNumber }}</span>
                    <br />
                    <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
                  </td>
                  <td>
                    <span class="fw-medium">{{ order.customer?.name || 'Client' }}</span>
                    <br />
                    <small class="text-muted">{{ order.customer?.city || 'Cameroun' }}</small>
                  </td>
                  <td>
                    <span class="fw-semibold">{{ formatPrice(order.total) }} FCFA</span>
                  </td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <a
                      v-if="order.customer?.phone"
                      :href="getWhatsAppUrl(order)"
                      target="_blank"
                      class="btn btn-sm btn-outline-success"
                      title="Contacter sur WhatsApp"
                    >
                      <i class="bi bi-whatsapp"></i>
                    </a>
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
        <div class="content-card mb-4">
          <h4 class="card-clean-title mb-3">Accès Rapides</h4>
          <div class="d-flex flex-column gap-2">
            <NuxtLink to="/admin/products/create" class="quick-action-btn">
              <div class="action-icon bg-gold-subtle text-gold"><i class="bi bi-plus-lg"></i></div>
              <div class="action-info">
                <span class="action-title">Nouveau Vêtement</span>
                <small class="text-muted">Ajouter un boubou, gandoura...</small>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted"></i>
            </NuxtLink>

            <NuxtLink to="/admin/banners" class="quick-action-btn">
              <div class="action-icon bg-terracotta-subtle text-terracotta"><i class="bi bi-images"></i></div>
              <div class="action-info">
                <span class="action-title">Visuels & Bannières</span>
                <small class="text-muted">Modifier Hero slides & bannières</small>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted"></i>
            </NuxtLink>

            <NuxtLink to="/admin/categories" class="quick-action-btn">
              <div class="action-icon bg-dark-subtle text-dark"><i class="bi bi-folder2-open"></i></div>
              <div class="action-info">
                <span class="action-title">Catégories</span>
                <small class="text-muted">Gérer les 12 catégories</small>
              </div>
              <i class="bi bi-chevron-right ms-auto text-muted"></i>
            </NuxtLink>
          </div>
        </div>

        <!-- Produits avec stock critique -->
        <div class="content-card">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h4 class="card-clean-title mb-0">Stock Faible</h4>
            <NuxtLink to="/admin/products?filter=low_stock" class="btn-link-gold small">Voir tout</NuxtLink>
          </div>

          <div v-if="lowStockProducts.length === 0" class="text-center py-3 text-muted">
            <i class="bi bi-check2-circle fs-3 text-success d-block mb-1"></i>
            <small>Tous les stocks sont normaux.</small>
          </div>

          <div v-else class="low-stock-list">
            <div
              v-for="prod in lowStockProducts.slice(0, 4)"
              :key="prod.id"
              class="low-stock-item d-flex align-items-center justify-content-between py-2 border-bottom"
            >
              <div class="d-flex align-items-center gap-2">
                <img :src="getProductThumb(prod)" class="thumb-mini" alt="" />
                <div>
                  <span class="product-mini-name">{{ prod.name }}</span>
                  <small class="text-muted d-block">{{ prod.category?.name }}</small>
                </div>
              </div>
              <span class="badge bg-danger">{{ prod.stock }} restants</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #0B0B0B;
}

/* Cartes KPI */
.kpi-card {
  background: #FFFFFF !important;
  border-radius: 8px;
  border: 1px solid #E5E0D8;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 2px 8px rgba(11, 11, 11, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  z-index: 2;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(11, 11, 11, 0.08);
}

.kpi-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.bg-gold-subtle {
  background: rgba(201, 164, 108, 0.15);
}

.text-gold {
  color: #C9A46C !important;
}

.bg-terracotta-subtle {
  background: rgba(161, 78, 54, 0.15);
}

.text-terracotta {
  color: #A14E36 !important;
}

.kpi-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7A7A7A;
  display: block;
}

.kpi-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0B0B0B;
  margin: 0.15rem 0;
}

.kpi-subtext {
  font-size: 0.75rem;
  display: block;
}

/* Content Cards */
.content-card {
  background: #FFFFFF !important;
  border-radius: 8px;
  border: 1px solid #E5E0D8;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(11, 11, 11, 0.04);
  position: relative;
  z-index: 2;
}

.card-clean-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0B0B0B;
}

.btn-link-gold {
  color: #C9A46C;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8125rem;
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
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #7A7A7A;
  font-weight: 600;
  border-bottom: 2px solid #F5F2EC;
  padding-bottom: 0.75rem;
  background: #FFFFFF !important;
}

.custom-admin-table td {
  padding: 0.85rem 0.5rem;
  border-bottom: 1px solid #F5F2EC;
  background: #FFFFFF !important;
}

/* Quick Actions */
.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  background: #FFFFFF !important;
  border: 1px solid #F5F2EC;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background: #FAF8F5 !important;
  border-color: #C9A46C;
  transform: translateX(2px);
}

.action-icon {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.action-title {
  font-size: 0.875rem;
  font-weight: 600;
  display: block;
}

/* Low Stock */
.thumb-mini {
  width: 38px;
  height: 38px;
  object-fit: cover;
  border-radius: 4px;
}

.product-mini-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0B0B0B;
  display: block;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-mems-gold:hover {
  background: #B89358;
}
</style>
