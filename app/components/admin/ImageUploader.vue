<template>
  <div class="image-uploader-wrapper">
    <!-- Zone de dépôt / Sélection -->
    <div
      class="upload-dropzone"
      :class="{ 'is-dragging': isDragging, 'is-uploading': uploading }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        :multiple="multiple"
        class="d-none"
        @change="handleFileSelect"
      />

      <div v-if="!uploading" class="dropzone-content">
        <div class="upload-icon-circle">
          <i class="bi bi-cloud-arrow-up"></i>
        </div>
        <p class="upload-main-text">Glissez-déposez vos photos ici</p>
        <span class="upload-sub-text">ou <span class="browse-link">parcourez vos fichiers</span></span>
        <small class="upload-hint">JPG, PNG, WEBP acceptés — Stockage direct Cloudinary</small>
      </div>

      <div v-else class="uploading-state">
        <div class="spinner-border text-gold" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2 mb-0 fw-medium">Téléversement vers Cloudinary en cours...</p>
        <small class="text-muted">{{ uploadProgressText }}</small>
      </div>
    </div>

    <!-- Option d'ajout direct par URL ou Cloudinary -->
    <div class="uploader-toolbar d-flex justify-content-between align-items-center mt-2 px-1">
      <small class="text-muted">Cloudinary (cloud : <strong class="text-dark">{{ cloudName }}</strong>)</small>
      <button
        v-if="!showUrlInput"
        type="button"
        class="btn btn-link btn-sm text-decoration-none p-0 text-gold fw-semibold"
        @click="showUrlInput = true"
      >
        <i class="bi bi-link-45deg me-1"></i>Ou coller une URL d'image directe
      </button>
    </div>

    <!-- Champ d'URL manuelle -->
    <div v-if="showUrlInput" class="input-group input-group-sm mt-2">
      <input
        v-model="manualUrl"
        type="url"
        class="form-control"
        placeholder="https://images.unsplash.com/... ou URL Cloudinary"
        @keydown.enter.prevent="addManualUrl"
      />
      <button class="btn btn-dark btn-sm" type="button" @click="addManualUrl">
        Ajouter
      </button>
      <button class="btn btn-outline-secondary btn-sm" type="button" @click="showUrlInput = false; manualUrl = ''">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <!-- Message d'erreur avec guide Cloudinary pas à pas -->
    <div v-if="uploadError" class="alert alert-danger mt-2 py-2 px-3">
      <div class="d-flex align-items-start justify-content-between">
        <div>
          <div class="fw-semibold small mb-1">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>Erreur téléversement Cloudinary
          </div>
          <div class="small">{{ uploadError }}</div>
        </div>
        <button type="button" class="btn-close btn-sm ms-2" @click="uploadError = ''"></button>
      </div>

      <!-- Guide direct si l'upload preset est manquant ou non unsigned -->
      <div v-if="uploadError.includes('preset') || uploadError.includes('Preset')" class="preset-help-box mt-2 p-2 rounded bg-white text-dark small border">
        <strong class="d-block mb-1 text-primary">
          <i class="bi bi-gear-fill me-1"></i>Comment activer l'upload dans Cloudinary en 30 secondes :
        </strong>
        <ol class="mb-1 ps-3 small text-muted">
          <li>Dans votre console Cloudinary, cliquez sur la roue crantée <strong>⚙️ Settings</strong> (en bas à gauche).</li>
          <li>Cliquez sur l'onglet <strong>Upload</strong>.</li>
          <li>Faites défiler jusqu'à la section <strong>Upload presets</strong> et cliquez sur <strong>Add upload preset</strong>.</li>
          <li>Nommez le preset : <code>mems_unsigned</code>.</li>
          <li><strong>Indispensable :</strong> Passez <strong>Signing Mode</strong> de "Signed" à <strong>"Unsigned"</strong>.</li>
          <li>Cliquez sur <strong>Save</strong> en haut à droite.</li>
        </ol>
        <div class="text-muted mt-1 small">
          <em>Astuce : En attendant, vous pouvez également utiliser le bouton "Ou coller une URL d'image directe" ci-dessus.</em>
        </div>
      </div>
    </div>

    <!-- Grille des images uploadées -->
    <div v-if="modelValue && modelValue.length > 0" class="image-grid mt-3">
      <div
        v-for="(img, index) in modelValue"
        :key="index"
        class="image-item-card"
        :class="{ 'is-primary': isPrimary(img, index) }"
      >
        <img :src="getImageUrl(img)" alt="Produit preview" class="preview-thumb" />

        <!-- Badge Principale -->
        <span v-if="isPrimary(img, index)" class="badge-primary-label">
          ★ Principale
        </span>

        <!-- Actions overlay -->
        <div class="image-actions-overlay">
          <button
            v-if="!isPrimary(img, index)"
            type="button"
            class="btn-action btn-set-primary"
            title="Définir comme image principale"
            @click.stop="setAsPrimary(index)"
          >
            <i class="bi bi-star"></i>
          </button>
          <button
            type="button"
            class="btn-action btn-delete"
            title="Supprimer cette image"
            @click.stop="removeImage(index)"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCloudinary } from '../../../composables/useCloudinary'

interface ImageItem {
  id?: number
  image: string
  is_primary?: boolean
  order?: number
}

const props = withDefaults(
  defineProps<{
    modelValue: (string | ImageItem)[]
    multiple?: boolean
    folder?: string
  }>(),
  {
    modelValue: () => [],
    multiple: true,
    folder: 'MEMS'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | ImageItem)[]): void
}>()

const { uploadImage, cloudName } = useCloudinary()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgressText = ref('')
const uploadError = ref('')
const showUrlInput = ref(false)
const manualUrl = ref('')

const addManualUrl = () => {
  const url = manualUrl.value.trim()
  if (!url) return
  const currentList = [...props.modelValue]
  const isFirst = currentList.length === 0
  currentList.push({
    id: Date.now(),
    image: url,
    is_primary: isFirst,
    order: currentList.length + 1
  })
  emit('update:modelValue', currentList)
  manualUrl.value = ''
  showUrlInput.value = false
}

const triggerFileInput = () => {
  if (uploading.value) return
  fileInputRef.value?.click()
}

const getImageUrl = (item: string | ImageItem): string => {
  if (typeof item === 'string') return item
  return item?.image || ''
}

const isPrimary = (item: string | ImageItem, index: number): boolean => {
  if (typeof item === 'object' && item?.is_primary) return true
  return index === 0
}

const setAsPrimary = (index: number) => {
  const updated = props.modelValue.map((item, idx) => {
    if (typeof item === 'string') {
      return {
        id: idx + 1,
        image: item,
        is_primary: idx === index,
        order: idx + 1
      }
    }
    return {
      ...item,
      is_primary: idx === index
    }
  })
  emit('update:modelValue', updated)
}

const removeImage = (index: number) => {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  // S'assurer qu'il y a toujours une principale si la liste n'est pas vide
  if (updated.length > 0 && typeof updated[0] === 'object') {
    const hasPrimary = updated.some(i => typeof i === 'object' && i.is_primary)
    if (!hasPrimary) {
      (updated[0] as ImageItem).is_primary = true
    }
  }
  emit('update:modelValue', updated)
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    processFiles(Array.from(input.files))
  }
  // Reset input
  if (input) input.value = ''
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

const processFiles = async (files: File[]) => {
  uploadError.value = ''
  uploading.value = true

  const currentList = [...props.modelValue]
  let successCount = 0

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    uploadProgressText.value = `Image ${i + 1}/${files.length} (${file.name})`
    try {
      const result = await uploadImage(file, props.folder)
      const isFirst = currentList.length === 0

      currentList.push({
        id: Date.now() + i,
        image: result.secure_url,
        is_primary: isFirst,
        order: currentList.length + 1
      })
      successCount++
    } catch (err: any) {
      console.error('[Upload Cloudinary] Erreur:', err)
      uploadError.value = err.message || 'Impossible de téléverser une ou plusieurs images.'
    }
  }

  uploading.value = false
  uploadProgressText.value = ''

  if (successCount > 0) {
    emit('update:modelValue', currentList)
  }
}
</script>

<style scoped>
.image-uploader-wrapper {
  width: 100%;
}

.upload-dropzone {
  border: 2px dashed #C9A46C;
  background: #FAF8F5;
  border-radius: 8px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.upload-dropzone:hover,
.upload-dropzone.is-dragging {
  background: #F5F2EC;
  border-color: #A14E36;
  transform: scale(1.005);
}

.upload-icon-circle {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(201, 164, 108, 0.15);
  color: #C9A46C;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.upload-main-text {
  font-size: 1rem;
  font-weight: 600;
  color: #0B0B0B;
  margin-bottom: 0.25rem;
}

.upload-sub-text {
  font-size: 0.875rem;
  color: #555;
  display: block;
}

.browse-link {
  color: #A14E36;
  font-weight: 600;
  text-decoration: underline;
}

.upload-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #888;
}

.text-gold {
  color: #C9A46C !important;
}

/* Grille des previews */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
}

.image-item-card {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid #E5E0D8;
  background: #0B0B0B;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.image-item-card:hover {
  transform: translateY(-2px);
  border-color: #C9A46C;
}

.image-item-card.is-primary {
  border-color: #C9A46C;
  box-shadow: 0 0 0 2px rgba(201, 164, 108, 0.3);
}

.preview-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.badge-primary-label {
  position: absolute;
  top: 6px;
  left: 6px;
  background: #C9A46C;
  color: #0B0B0B;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  z-index: 2;
}

.image-actions-overlay {
  position: absolute;
  inset: 0;
  background: rgba(11, 11, 11, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 3;
}

.image-item-card:hover .image-actions-overlay {
  opacity: 1;
}

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}

.btn-action:hover {
  transform: scale(1.1);
}

.btn-set-primary {
  background: #FFFFFF;
  color: #0B0B0B;
}

.btn-delete {
  background: #A14E36;
  color: #FFFFFF;
}
</style>
