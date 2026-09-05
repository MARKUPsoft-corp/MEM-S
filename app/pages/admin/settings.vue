<template>
  <div class="admin-settings-page">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
      <div>
        <h1 class="page-title">Paramètres & WhatsApp</h1>
        <p class="text-muted mb-0">Configurez le numéro WhatsApp officiel qui reçoit toutes les commandes des clients</p>
      </div>
      <div>
        <button class="btn btn-mems-gold px-4" :disabled="saving" @click="saveSettings">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-check-circle me-2"></i>
          Enregistrer les paramètres
        </button>
      </div>
    </div>

    <!-- Alert toast succès -->
    <div v-if="successMsg" class="alert alert-success d-flex align-items-center justify-content-between mb-4">
      <span><i class="bi bi-check-circle-fill me-2"></i>{{ successMsg }}</span>
      <button type="button" class="btn-close" @click="successMsg = ''"></button>
    </div>

    <!-- Alert toast erreur -->
    <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center justify-content-between mb-4">
      <span><i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMsg }}</span>
      <button type="button" class="btn-close" @click="errorMsg = ''"></button>
    </div>

    <div class="row g-4">
      <!-- Section Principale : WhatsApp des Commandes -->
      <div class="col-lg-7">
        <div class="content-card mb-4">
          <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <div class="whatsapp-icon-circle">
              <i class="bi bi-whatsapp"></i>
            </div>
            <div>
              <h3 class="card-clean-title mb-1">Numéro WhatsApp de Commande</h3>
              <p class="text-muted small mb-0">Toutes les commandes du panier et des fiches produits sont transmises à ce numéro</p>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">
              Numéro de téléphone WhatsApp (avec indicatif pays)
              <span class="text-danger">*</span>
            </label>
            <div class="input-group input-group-lg">
              <span class="input-group-text bg-light">
                <i class="bi bi-telephone-fill text-success"></i>
              </span>
              <input
                v-model="settings.whatsappNumber"
                type="text"
                class="form-control"
                placeholder="237696962662"
                @input="cleanNumber"
              />
            </div>
            <div class="form-text mt-2">
              <i class="bi bi-info-circle me-1"></i>
              Format international <strong>sans le signe +</strong> et <strong>sans espaces</strong>.<br />
              <em>Exemple Cameroun : <code>237696962662</code> | Exemple France : <code>33612345678</code></em>
            </div>
          </div>

          <!-- Carte de Test et Prévisualisation -->
          <div class="preview-box p-3 rounded-3 bg-light border mb-4">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="text-muted small fw-semibold text-uppercase">Aperçu du lien de commande</span>
              <span class="badge bg-success-subtle text-success">Actif</span>
            </div>
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <code class="text-dark fs-6">{{ whatsappLinkPreview }}</code>
              <a
                :href="testWhatsAppUrl"
                target="_blank"
                class="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-2"
              >
                <i class="bi bi-box-arrow-up-right"></i>
                Tester sur WhatsApp
              </a>
            </div>
          </div>

          <div class="alert alert-info d-flex gap-3 align-items-start mb-0">
            <i class="bi bi-shield-check fs-4 text-info mt-1"></i>
            <div class="small">
              <strong>Synchronisation universelle :</strong> Dès que vous enregistrez ce numéro, il sera automatiquement utilisé pour :
              <ul class="mb-0 mt-1 ps-3">
                <li>Le bouton <strong>Commander sur WhatsApp</strong> de chaque fiche article (slug).</li>
                <li>La validation finale du <strong>Panier d'achats</strong>.</li>
                <li>La page de contact et le service client.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Coordonnées de la boutique -->
      <div class="col-lg-5">
        <div class="content-card mb-4">
          <div class="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
            <div class="settings-icon-circle">
              <i class="bi bi-shop"></i>
            </div>
            <div>
              <h3 class="card-clean-title mb-1">Informations de la Boutique</h3>
              <p class="text-muted small mb-0">Coordonnées affichées sur le site et les messages</p>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Nom de la marque / boutique</label>
            <input
              v-model="settings.storeName"
              type="text"
              class="form-control"
              placeholder="MEM'S Concept"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Email de contact</label>
            <input
              v-model="settings.contactEmail"
              type="email"
              class="form-control"
              placeholder="contact@mems-concept.com"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Téléphone affiché aux clients</label>
            <input
              v-model="settings.contactPhone"
              type="text"
              class="form-control"
              placeholder="+237 6 96 96 26 62"
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Adresse physique / Ville</label>
            <input
              v-model="settings.address"
              type="text"
              class="form-control"
              placeholder="Douala, Cameroun"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ContentService, type StoreSettings, DEFAULT_STORE_SETTINGS } from '~~/services/contentService'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Paramètres WhatsApp & Boutique - MEM\'S Admin'
})

const settings = ref<StoreSettings>({ ...DEFAULT_STORE_SETTINGS })
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// Charger les paramètres actuels
onMounted(async () => {
  try {
    const loaded = await ContentService.getStoreSettings()
    if (loaded) {
      settings.value = { ...loaded }
    }
  } catch (err: any) {
    console.error('[AdminSettings] Erreur chargement:', err)
  }
})

// Nettoyer le numéro pour ne garder que les chiffres
const cleanNumber = () => {
  if (settings.value.whatsappNumber) {
    // Retirer les espaces, tirets, parenthèses et le + initial
    settings.value.whatsappNumber = settings.value.whatsappNumber.replace(/[^0-9]/g, '')
  }
}

// Aperçu du lien WhatsApp
const whatsappLinkPreview = computed(() => {
  const num = settings.value.whatsappNumber || '237696962662'
  return `https://wa.me/${num}`
})

// Lien de test WhatsApp
const testWhatsAppUrl = computed(() => {
  const num = settings.value.whatsappNumber || '237696962662'
  const text = encodeURIComponent("Bonjour MEM'S ! Ceci est un test de configuration du numéro WhatsApp des commandes.")
  return `https://wa.me/${num}?text=${text}`
})

// Sauvegarder les paramètres
const saveSettings = async () => {
  cleanNumber()
  if (!settings.value.whatsappNumber || settings.value.whatsappNumber.length < 8) {
    errorMsg.value = 'Veuillez saisir un numéro WhatsApp valide avec indicatif pays.'
    return
  }

  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    await ContentService.saveStoreSettings(settings.value)
    successMsg.value = 'Numéro WhatsApp et paramètres enregistrés avec succès !'
  } catch (err: any) {
    console.error('[AdminSettings] Erreur sauvegarde:', err)
    errorMsg.value = 'Erreur lors de l\'enregistrement dans Firestore. Vérifiez votre connexion.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 1.75rem;
  color: #0E3A34;
}

.content-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.card-clean-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 1.15rem;
  color: #0E3A34;
}

.whatsapp-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #25D366;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.settings-icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0E3A34;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.btn-mems-gold {
  background-color: #C9A46C;
  color: #FFFFFF;
  border: none;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.6rem 1.5rem;
  transition: all 0.2s ease;
}

.btn-mems-gold:hover:not(:disabled) {
  background-color: #b38e56;
  color: #FFFFFF;
}

.btn-mems-gold:disabled {
  opacity: 0.7;
}

.preview-box {
  background-color: #FAF8F5 !important;
  border-color: #E8E2D8 !important;
}
</style>
