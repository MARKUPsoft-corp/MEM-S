<template>
  <Teleport to="body">
    <div v-if="order" class="invoice-modal-backdrop" @click.self="$emit('close')">
      <div class="invoice-modal-container">
        <!-- Barre d'actions supérieure (Non imprimée) -->
        <div class="invoice-modal-header no-print d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <span class="invoice-badge-label">
              <i class="bi bi-file-earmark-pdf-fill me-1 text-gold"></i>
              Facture Officielle MEM'S
            </span>
            <span class="invoice-ref-tag">{{ invoiceReference }}</span>
          </div>

          <div class="d-flex align-items-center gap-2">
            <!-- Bouton Télécharger PDF Vectoriel Direct -->
            <button
              class="btn btn-sm btn-mems-gold d-inline-flex align-items-center gap-1.5"
              :disabled="generatingPdf"
              @click="handleDownloadPdf"
            >
              <span v-if="generatingPdf" class="spinner-border spinner-border-sm" style="width: 12px; height: 12px;"></span>
              <i v-else class="bi bi-download"></i>
              <span>Télécharger PDF</span>
            </button>

            <!-- Bouton Ouvrir PDF -->
            <button
              class="btn btn-sm btn-outline-dark d-inline-flex align-items-center gap-1.5"
              :disabled="generatingPdf"
              @click="handleOpenPdf"
              title="Ouvrir le PDF dans un nouvel onglet"
            >
              <i class="bi bi-box-arrow-up-right"></i>
              <span class="d-none d-sm-inline">Aperçu PDF</span>
            </button>

            <!-- Bouton Impression A4 -->
            <button
              class="btn btn-sm btn-outline-dark d-inline-flex align-items-center gap-1.5"
              @click="handlePrint"
              title="Imprimer au format A4"
            >
              <i class="bi bi-printer"></i>
              <span class="d-none d-sm-inline">Imprimer A4</span>
            </button>

            <!-- Bouton Fermer -->
            <button class="btn-close-invoice" @click="$emit('close')" title="Fermer">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Corps du modal avec défilement -->
        <div class="invoice-modal-body">
          <!-- FEUILLE A4 DE FACTURE LUXE (Zone Imprimable et Prévisualisée) -->
          <div id="mems-invoice-sheet" class="invoice-a4-sheet">
            <!-- Double Cadre Décoratif Haute Couture -->
            <div class="invoice-inner-frame">
              <!-- 1. EN-TÊTE : Logo officiel & Identité de marque -->
              <div class="invoice-header d-flex justify-content-between align-items-start pb-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="brand-logo-container">
                    <img
                      src="/images/LOGO.png"
                      alt="Logo Maison MEM'S"
                      class="brand-logo-img"
                    />
                  </div>
                  <div>
                    <h2 class="brand-name mb-0">MAISON MEM'S</h2>
                    <p class="brand-tagline mb-1">HAUTE COUTURE AFRICAINE & PRÊT-À-PORTER DE PRESTIGE</p>
                    <div class="brand-contact-info">
                      <span>{{ storeSettings?.address || 'Douala, République du Cameroun' }}</span>
                      <span class="dot-separator">•</span>
                      <span>Tél / WhatsApp : {{ storeSettings?.contactPhone || storeSettings?.whatsappNumber || '+237 6 96 96 26 62' }}</span>
                    </div>
                    <div class="brand-contact-info">
                      <span>Email : {{ storeSettings?.contactEmail || 'contact@mems-concept.com' }}</span>
                      <span class="dot-separator">•</span>
                      <span>Web : www.mems-couture.com</span>
                    </div>
                  </div>
                </div>

                <!-- Métadonnées Facture -->
                <div class="invoice-meta text-end">
                  <h1 class="invoice-title mb-0">FACTURE</h1>
                  <span class="invoice-meta-ref">{{ invoiceReference }}</span>
                  <div class="invoice-meta-date mt-1">
                    Émise le : {{ formatDate(order.createdAt) }}
                  </div>
                  <div class="invoice-meta-status mt-1">
                    <span class="status-pill" :class="`status-${order.status || 'pending'}`">
                      <i :class="getStatusIconClass(order.status || 'pending')" class="me-1"></i>
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Ligne de séparation or brossé -->
              <div class="gold-divider-double mb-4">
                <div class="gold-line-thick"></div>
                <div class="gold-line-thin"></div>
              </div>

              <!-- 2. COORDONNÉES : ÉMETTEUR & FACTURÉ À -->
              <div class="row g-3 mb-4">
                <!-- Émetteur -->
                <div class="col-6">
                  <div class="party-box party-box-sender">
                    <div class="party-box-badge sender-badge">ÉMETTEUR / MAISON DE COUTURE</div>
                    <div class="party-name">{{ storeSettings?.storeName || 'Maison MEM\'S' }}</div>
                    <div class="party-detail"><i class="bi bi-geo-alt-fill text-gold me-1"></i>{{ storeSettings?.address || 'Douala, République du Cameroun' }}</div>
                    <div class="party-detail"><i class="bi bi-telephone-fill text-gold me-1"></i>{{ storeSettings?.contactPhone || storeSettings?.whatsappNumber || '+237 6 96 96 26 62' }}</div>
                    <div class="party-detail party-legal mt-1">RCCM : RC/DLA/2024/B/1842 • NUI : M032412895412</div>
                  </div>
                </div>

                <!-- Destinataire (Client) -->
                <div class="col-6">
                  <div class="party-box party-box-client">
                    <div class="party-box-badge client-badge">FACTURÉ À / DESTINATAIRE</div>
                    <div class="party-name">{{ order.customer?.name || 'Client Particulier' }}</div>
                    <div class="party-detail" v-if="order.customer?.phone">
                      <i class="bi bi-telephone-fill text-gold me-1"></i>{{ order.customer.phone }}
                    </div>
                    <div class="party-detail" v-if="order.customer?.email">
                      <i class="bi bi-envelope-fill text-gold me-1"></i>{{ order.customer.email }}
                    </div>
                    <div class="party-detail">
                      <i class="bi bi-geo-alt-fill text-gold me-1"></i>
                      {{ [order.customer?.address, order.customer?.city, 'Cameroun'].filter(Boolean).join(', ') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. TABLEAU DÉTAILLÉ DES ARTICLES -->
              <div class="invoice-table-wrapper mb-4">
                <table class="invoice-table w-100">
                  <thead>
                    <tr>
                      <th style="width: 40px;" class="text-center">N°</th>
                      <th>Désignation de l'article</th>
                      <th style="width: 180px;">Option / Taille</th>
                      <th style="width: 60px;" class="text-center">Qté</th>
                      <th style="width: 120px;" class="text-end">Prix Unit.</th>
                      <th style="width: 130px;" class="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in formattedItems" :key="idx">
                      <td class="text-center text-muted col-index">{{ String(idx + 1).padStart(2, '0') }}</td>
                      <td>
                        <span class="item-title">{{ item.name }}</span>
                      </td>
                      <td>
                        <span class="item-variant">{{ item.variantText || 'Standard / Sur mesure' }}</span>
                      </td>
                      <td class="text-center fw-bold">{{ item.quantity }}</td>
                      <td class="text-end text-muted">{{ formatPrice(item.price) }} FCFA</td>
                      <td class="text-end fw-bold text-dark">{{ formatPrice(item.price * item.quantity) }} FCFA</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 4. RÉCAPITULATIF FINANCIER & ARRÊTÉ DE COMPTE -->
              <div class="row g-3 mb-4 align-items-start">
                <!-- Arrêté de compte & Notes -->
                <div class="col-7">
                  <div class="account-statement-card">
                    <div class="statement-title">ARRÊTÉ DE COMPTE :</div>
                    <p class="statement-text mb-2">
                      La présente facture est arrêtée à la somme nette de :<br />
                      <strong class="text-gold fs-6">{{ formatPrice(order.total) }} Francs CFA TTC</strong>
                    </p>
                    <div v-if="order.notes" class="client-note-box mt-2">
                      <div class="note-label"><i class="bi bi-chat-quote-fill me-1 text-gold"></i>Note / Instruction client :</div>
                      <div class="note-content">{{ order.notes }}</div>
                    </div>
                  </div>
                </div>

                <!-- Totaux Financiers -->
                <div class="col-5">
                  <div class="totals-luxury-card">
                    <div class="d-flex justify-content-between py-1 total-subline">
                      <span class="text-muted">Sous-total brut :</span>
                      <span class="fw-semibold text-dark">{{ formatPrice(order.subtotal || order.total) }} FCFA</span>
                    </div>
                    <div class="d-flex justify-content-between py-1 total-subline">
                      <span class="text-muted">Frais d'expédition :</span>
                      <span class="text-success fw-bold">Offerte (0 FCFA)</span>
                    </div>
                    <div class="total-net-box mt-2 d-flex justify-content-between align-items-center">
                      <span class="total-net-label">TOTAL NET TTC</span>
                      <span class="total-net-val">{{ formatPrice(order.total) }} FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. SCEAU D'AUTHENTICITÉ & SIGNATURE OFFICIELLE -->
              <div class="row g-3 align-items-center pt-2 mb-3">
                <div class="col-6 d-flex align-items-center gap-3">
                  <!-- Sceau vectoriel doré -->
                  <div class="luxury-seal-badge">
                    <div class="seal-inner-ring">
                      <span class="seal-arc top">MAISON MEM'S</span>
                      <span class="seal-stars">★  CERTIFIÉ  ★</span>
                      <span class="seal-arc bottom">DOUALA • CAMEROUN</span>
                    </div>
                  </div>
                  <div>
                    <div class="direction-title">POUR LA DIRECTION / MAISON MEM'S</div>
                    <div class="direction-sub text-muted">Service Facturation & Confection</div>
                    <div class="signature-calligraphy">Maison Mem's Haute Couture</div>
                  </div>
                </div>

                <div class="col-6 text-end">
                  <div class="gratitude-title text-gold">MERCI POUR VOTRE CONFIANCE</div>
                  <div class="gratitude-sub text-muted">
                    Chaque création MEM'S est façonnée selon les règles de l'art.<br />
                    Échange possible sous 7 jours ouvrés sur présentation de cette facture.<br />
                    Articles neufs, non portés, avec étiquettes et emballage d'origine.
                  </div>
                </div>
              </div>

              <!-- 6. PIED DE PAGE LÉGAL -->
              <div class="invoice-footer-legal text-center mt-3 pt-2">
                <div class="footer-gold-bar mb-1"></div>
                <div class="legal-text">
                  Maison MEM'S • Haute Couture Africaine & Confection de Prestige • Douala, République du Cameroun<br />
                  WhatsApp Service Client : {{ storeSettings?.contactPhone || storeSettings?.whatsappNumber || '+237 6 96 96 26 62' }} • Email : {{ storeSettings?.contactEmail || 'contact@mems-concept.com' }}<br />
                  Document officiel généré par le système informatique de vente MEM'S
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ContentService, type StoreSettings } from '~~/services/contentService'
import {
  downloadInvoicePdf,
  openInvoicePdfInNewTab,
  type OrderData
} from '~~/utils/invoicePdfGenerator'

const props = defineProps<{
  order: OrderData
}>()

defineEmits<{
  (e: 'close'): void
}>()

const storeSettings = ref<StoreSettings | null>(null)
const generatingPdf = ref(false)

// Référence facture
const invoiceReference = computed(() => {
  return props.order?.orderNumber ? `FAC-${props.order.orderNumber}` : 'FAC-000000'
})

// Articles formatés
const formattedItems = computed(() => {
  if (!props.order?.items || props.order.items.length === 0) {
    return [
      {
        name: 'Commande d\'articles personnalisés',
        variantText: 'Confection sur mesure',
        quantity: 1,
        price: props.order.total || 0
      }
    ]
  }

  return props.order.items.map((item) => {
    let variantText = ''
    if (typeof item.variant === 'string') {
      variantText = item.variant
    } else if (item.variant && (item.variant as any).attributes) {
      variantText = (item.variant as any).attributes
        .map((a: any) => `${a.name}: ${a.value}`)
        .join(' | ')
    }
    return {
      name: item.name,
      variantText,
      quantity: item.quantity || 1,
      price: item.price || 0
    }
  })
})

// Formatage de prix
const formatPrice = (val?: number) => {
  return (val || 0).toLocaleString('fr-FR')
}

// Formatage de date
const formatDate = (isoStr?: string) => {
  if (!isoStr) return 'Date non spécifiée'
  try {
    const d = new Date(isoStr)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return isoStr
  }
}

// Badges & Labels statut
const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'confirmed': return 'Confirmée'
    case 'shipped': return 'Expédiée'
    case 'delivered': return 'Livrée'
    case 'cancelled': return 'Annulée'
    default: return 'En attente'
  }
}

const getStatusIconClass = (status?: string) => {
  switch (status) {
    case 'confirmed': return 'bi bi-check-circle-fill'
    case 'shipped': return 'bi bi-truck'
    case 'delivered': return 'bi bi-check2-all'
    case 'cancelled': return 'bi bi-x-circle-fill'
    default: return 'bi bi-clock-history'
  }
}

// Téléchargement du PDF vectoriel
const handleDownloadPdf = async () => {
  try {
    generatingPdf.value = true
    await downloadInvoicePdf(props.order, storeSettings.value || undefined)
  } catch (err) {
    console.error('[InvoiceModal] Erreur génération PDF:', err)
    alert('Une erreur est survenue lors de la génération du PDF.')
  } finally {
    generatingPdf.value = false
  }
}

// Aperçu PDF dans un nouvel onglet
const handleOpenPdf = async () => {
  try {
    generatingPdf.value = true
    await openInvoicePdfInNewTab(props.order, storeSettings.value || undefined)
  } catch (err) {
    console.error('[InvoiceModal] Erreur ouverture PDF:', err)
    alert('Une erreur est survenue lors de l\'ouverture du PDF.')
  } finally {
    generatingPdf.value = false
  }
}

// Impression A4 directe
const handlePrint = () => {
  window.print()
}

onMounted(async () => {
  try {
    const loaded = await ContentService.getStoreSettings()
    if (loaded) {
      storeSettings.value = loaded
    }
  } catch (e) {
    console.warn('[InvoiceModal] Impossible de charger storeSettings:', e)
  }
})
</script>

<style scoped>
/* Backdrop & Conteneur */
.invoice-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 11, 11, 0.75);
  backdrop-filter: blur(5px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.invoice-modal-container {
  background: #202020;
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(201, 164, 108, 0.3);
  overflow: hidden;
}

.invoice-modal-header {
  padding: 0.75rem 1.25rem;
  background: #0B0B0B;
  border-bottom: 1px solid rgba(201, 164, 108, 0.3);
}

.invoice-badge-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #F5F2EC;
  letter-spacing: 0.3px;
}

.invoice-ref-tag {
  font-family: monospace;
  font-size: 0.75rem;
  background: rgba(201, 164, 108, 0.15);
  color: #C9A46C;
  border: 1px solid rgba(201, 164, 108, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
}

.btn-mems-gold {
  background: #C9A46C;
  color: #0B0B0B;
  font-weight: 600;
  border: none;
  transition: all 0.2s;
}

.btn-mems-gold:hover {
  background: #d4af6a;
  color: #000;
}

.btn-outline-dark {
  background: #1A1A1A;
  color: #F5F2EC;
  border: 1px solid #333;
}

.btn-outline-dark:hover {
  background: #333;
  color: #FFFFFF;
}

.btn-close-invoice {
  background: transparent;
  border: none;
  color: #999;
  font-size: 1.1rem;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-close-invoice:hover {
  color: #FFF;
  background: rgba(255, 255, 255, 0.1);
}

.invoice-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  background: #2a2a2a;
  display: flex;
  justify-content: center;
}

/* ==============================================================
   FEUILLE A4 DE FACTURE LUXE
   ============================================================== */
.invoice-a4-sheet {
  background: #FFFFFF;
  width: 100%;
  max-width: 800px;
  min-height: 1050px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #0B0B0B;
  box-sizing: border-box;
}

.invoice-inner-frame {
  border: 2px solid #C9A46C;
  padding: 24px;
  position: relative;
  background: #FFFFFF;
  outline: 1px solid #E5E0D8;
  outline-offset: -5px;
}

/* En-tête */
.brand-logo-container {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.brand-name {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #0B0B0B;
}

.brand-tagline {
  font-size: 0.625rem;
  font-weight: 700;
  color: #C9A46C;
  letter-spacing: 0.8px;
}

.brand-contact-info {
  font-size: 0.6875rem;
  color: #666666;
  line-height: 1.35;
}

.dot-separator {
  margin: 0 4px;
  color: #C9A46C;
}

.invoice-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #0B0B0B;
}

.invoice-meta-ref {
  font-family: monospace;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #C9A46C;
  display: block;
}

.invoice-meta-date {
  font-size: 0.75rem;
  color: #777777;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.status-pending {
  background: #FFF3CD;
  color: #856404;
}

.status-confirmed, .status-delivered {
  background: #D1E7DD;
  color: #0F5132;
}

.status-shipped {
  background: #CFF4FC;
  color: #055160;
}

.status-cancelled {
  background: #E2E3E5;
  color: #383D41;
}

/* Diviseur or */
.gold-divider-double {
  margin-top: 10px;
}

.gold-line-thick {
  height: 2px;
  background: #C9A46C;
  width: 100%;
}

.gold-line-thin {
  height: 1px;
  background: #E5E0D8;
  width: 100%;
  margin-top: 2px;
}

/* Blocs Coordonnées */
.party-box {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 4px;
  padding: 10px 14px;
  position: relative;
  height: 100%;
}

.party-box-sender {
  border-left: 3px solid #C9A46C;
}

.party-box-client {
  border-left: 3px solid #0B0B0B;
}

.party-box-badge {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
}

.sender-badge {
  color: #C9A46C;
}

.client-badge {
  color: #0B0B0B;
}

.party-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #0B0B0B;
  margin-bottom: 3px;
}

.party-detail {
  font-size: 0.75rem;
  color: #555555;
  line-height: 1.35;
}

.party-legal {
  font-size: 0.6875rem;
  color: #888888;
}

/* Tableau */
.invoice-table-wrapper {
  border: 1px solid #E5E0D8;
  border-radius: 4px;
  overflow: hidden;
}

.invoice-table {
  border-collapse: collapse;
}

.invoice-table thead tr {
  background: #0B0B0B;
  color: #F5F2EC;
}

.invoice-table th {
  padding: 7px 10px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.invoice-table tbody tr {
  border-bottom: 1px solid #EFEAE3;
}

.invoice-table tbody tr:nth-child(even) {
  background: #FAF8F5;
}

.invoice-table td {
  padding: 8px 10px;
  font-size: 0.75rem;
  vertical-align: middle;
}

.col-index {
  font-family: monospace;
}

.item-title {
  font-weight: 700;
  color: #0B0B0B;
  display: block;
}

.item-variant {
  font-size: 0.6875rem;
  color: #777777;
}

/* Arrêté de compte & Totaux */
.account-statement-card {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 4px;
  padding: 12px 14px;
}

.statement-title {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #0B0B0B;
  margin-bottom: 4px;
}

.statement-text {
  font-size: 0.75rem;
  color: #444444;
  line-height: 1.4;
}

.client-note-box {
  background: #FFFFFF;
  border-left: 2px solid #C9A46C;
  padding: 6px 10px;
  border-radius: 0 4px 4px 0;
}

.note-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #C9A46C;
}

.note-content {
  font-size: 0.75rem;
  color: #555555;
}

.totals-luxury-card {
  background: #FAF8F5;
  border: 1px solid #E5E0D8;
  border-radius: 4px;
  padding: 12px 14px;
}

.total-subline {
  font-size: 0.75rem;
}

.total-net-box {
  background: #0B0B0B;
  color: #FFFFFF;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 8px;
}

.total-net-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #C9A46C;
}

.total-net-val {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #FFFFFF;
}

/* Sceau et Signature */
.luxury-seal-badge {
  width: 68px;
  height: 68px;
  border: 2px solid #C9A46C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  flex-shrink: 0;
}

.seal-inner-ring {
  width: 100%;
  height: 100%;
  border: 1px dashed #C9A46C;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2px;
}

.seal-arc {
  font-size: 0.4375rem;
  font-weight: 800;
  color: #C9A46C;
  letter-spacing: 0.3px;
}

.seal-stars {
  font-size: 0.4375rem;
  color: #C9A46C;
  margin: 1px 0;
  font-weight: 700;
}

.direction-title {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #0B0B0B;
  letter-spacing: 0.3px;
}

.direction-sub {
  font-size: 0.625rem;
}

.signature-calligraphy {
  font-family: 'Brush Script MT', 'Dancing Script', cursive, serif;
  font-size: 1.15rem;
  color: #C9A46C;
  font-weight: bold;
  margin-top: 2px;
}

.gratitude-title {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.gratitude-sub {
  font-size: 0.625rem;
  line-height: 1.35;
}

/* Pied de page */
.footer-gold-bar {
  height: 1px;
  background: #C9A46C;
  width: 100%;
}

.legal-text {
  font-size: 0.5625rem;
  color: #888888;
  line-height: 1.4;
}

/* ==============================================================
   STYLES D'IMPRESSION (@media print)
   ============================================================== */
@media print {
  body * {
    visibility: hidden !important;
  }

  .invoice-modal-backdrop {
    position: static !important;
    background: transparent !important;
    padding: 0 !important;
    display: block !important;
  }

  .invoice-modal-container {
    box-shadow: none !important;
    border: none !important;
    max-width: 100% !important;
    max-height: none !important;
    background: transparent !important;
  }

  .invoice-modal-header, .no-print {
    display: none !important;
  }

  .invoice-modal-body {
    padding: 0 !important;
    background: transparent !important;
    display: block !important;
  }

  #mems-invoice-sheet,
  #mems-invoice-sheet * {
    visibility: visible !important;
  }

  #mems-invoice-sheet {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
}
</style>
