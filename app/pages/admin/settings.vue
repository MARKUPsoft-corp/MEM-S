<template>
  <div class="admin-settings-page">
    <!-- Header -->
    <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-3 gap-2">
      <div>
        <h1 class="page-title">Paramètres & WhatsApp</h1>
        <p class="text-muted page-subtitle mb-0">Configurez le numéro WhatsApp officiel qui reçoit toutes les commandes des clients</p>
      </div>
      <div>
        <button class="btn btn-sm btn-mems-gold px-3" :disabled="saving" @click="saveSettings">
          <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
          <i v-else class="bi bi-check-circle me-1"></i>
          Enregistrer les paramètres
        </button>
      </div>
    </div>

    <!-- Alert toast succès -->
    <div v-if="successMsg" class="alert alert-success d-flex align-items-center justify-content-between mb-3 py-2 px-3 small">
      <span><i class="bi bi-check-circle-fill me-2"></i>{{ successMsg }}</span>
      <button type="button" class="btn-close btn-sm" @click="successMsg = ''"></button>
    </div>

    <!-- Alert toast erreur -->
    <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center justify-content-between mb-3 py-2 px-3 small">
      <span><i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMsg }}</span>
      <button type="button" class="btn-close btn-sm" @click="errorMsg = ''"></button>
    </div>

    <div class="row g-3">
      <!-- Section Principale : WhatsApp des Commandes -->
      <div class="col-lg-7">
        <div class="content-card mb-3">
          <div class="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
            <div class="whatsapp-icon-circle">
              <i class="bi bi-whatsapp"></i>
            </div>
            <div>
              <h3 class="card-clean-title mb-0">Numéro WhatsApp de Commande</h3>
              <p class="text-muted page-subtitle mb-0">Toutes les commandes du panier et des fiches produits sont transmises à ce numéro</p>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label-soft">
              Numéro de téléphone WhatsApp (avec indicatif pays)
              <span class="text-danger">*</span>
            </label>
            <div class="input-group">
              <span class="input-group-text bg-light px-2 border-end-0">
                <i class="bi bi-telephone-fill text-success" style="font-size: 0.75rem;"></i>
              </span>
              <input
                v-model="settings.whatsappNumber"
                type="text"
                class="form-control admin-form-control"
                placeholder="237696962662"
                @input="cleanNumber"
              />
            </div>
            <div class="form-text-soft mt-1">
              <i class="bi bi-info-circle me-1"></i>
              Format international sans le signe + et sans espaces. Ex: <code>237696962662</code>
            </div>
          </div>

          <!-- Carte de Test et Prévisualisation -->
          <div class="preview-box p-2 rounded bg-light border mb-3">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="text-muted small fw-semibold text-uppercase" style="font-size: 0.6875rem;">Aperçu du lien de commande</span>
              <span class="badge bg-success-subtle text-success" style="font-size: 0.625rem;">Actif</span>
            </div>
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <code class="text-dark" style="font-size: 0.75rem;">{{ whatsappLinkPreview }}</code>
              <a
                :href="testWhatsAppUrl"
                target="_blank"
                class="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 py-1 px-2"
                style="font-size: 0.75rem;"
              >
                <i class="bi bi-box-arrow-up-right"></i>
                Tester sur WhatsApp
              </a>
            </div>
          </div>

          <div class="alert alert-info d-flex gap-2 align-items-start mb-0 py-2 px-3 small">
            <i class="bi bi-shield-check text-info mt-1"></i>
            <div>
              <strong>Synchronisation universelle :</strong> Dès que vous enregistrez ce numéro, il sera automatiquement utilisé pour :
              <ul class="mb-0 mt-1 ps-3">
                <li>Le bouton <strong>Commander sur WhatsApp</strong> de chaque fiche article.</li>
                <li>La validation finale du <strong>Panier d'achats</strong>.</li>
                <li>La page de contact et le service client.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Coordonnées de la boutique -->
      <div class="col-lg-5">
        <div class="content-card mb-3">
          <div class="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
            <div class="settings-icon-circle">
              <i class="bi bi-shop"></i>
            </div>
            <div>
              <h3 class="card-clean-title mb-0">Informations de la Boutique</h3>
              <p class="text-muted page-subtitle mb-0">Coordonnées affichées sur le site et les messages</p>
            </div>
          </div>

          <div class="mb-2">
            <label class="form-label-soft">Nom de la marque / boutique</label>
            <input
              v-model="settings.storeName"
              type="text"
              class="form-control admin-form-control"
              placeholder="MEM'S Concept"
            />
          </div>

          <div class="mb-2">
            <label class="form-label-soft">Email de contact</label>
            <input
              v-model="settings.contactEmail"
              type="email"
              class="form-control admin-form-control"
              placeholder="contact@mems-concept.com"
            />
          </div>

          <div class="mb-2">
            <label class="form-label-soft">Téléphone affiché aux clients</label>
            <input
              v-model="settings.contactPhone"
              type="text"
              class="form-control admin-form-control"
              placeholder="+237 6 96 96 26 62"
            />
          </div>

          <div class="mb-2">
            <label class="form-label-soft">Adresse physique / Ville</label>
            <input
              v-model="settings.address"
              type="text"
              class="form-control admin-form-control"
              placeholder="Yaoundé, Cameroun"
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
  font-weight: 600;
  font-size: 1.15rem;
  color: #0B0B0B;
  letter-spacing: -0.01em;
}

.page-subtitle {
  font-size: 0.75rem;
  color: #7A7A7A;
}

.content-card {
  background: #FFFFFF;
  border-radius: 6px;
  padding: 1.15rem 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid #EAE6DF;
}

.card-clean-title {
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  color: #0B0B0B;
}

.whatsapp-icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #25D366;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.settings-icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0B0B0B;
  color: #C9A46C;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  flex-shrink: 0;
}

.form-label-soft {
  font-size: 0.6875rem;
  font-weight: 500;
  color: #8C827A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 0.25rem;
}

.form-text-soft {
  font-size: 0.6875rem;
  color: #8C827A;
}

.admin-form-control {
  font-size: 0.8125rem;
  background: #FAF8F5;
  border: 1px solid #EAE6DF;
  border-radius: 4px;
}

.admin-form-control:focus {
  background: #FFFFFF;
  border-color: #C9A46C;
  box-shadow: 0 0 0 2px rgba(201, 164, 108, 0.15);
}

.btn-mems-gold {
  background-color: #C9A46C;
  color: #0B0B0B;
  border: none;
  font-weight: 500;
  border-radius: 4px;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  transition: all 0.15s ease;
}

.btn-mems-gold:hover:not(:disabled) {
  background-color: #B89358;
}

.btn-mems-gold:disabled {
  opacity: 0.7;
}

.preview-box {
  background-color: #FAF8F5 !important;
  border-color: #EAE6DF !important;
}
</style>
