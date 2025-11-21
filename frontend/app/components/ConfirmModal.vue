<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="cancel">
        <div class="modal-container" @click.stop>
          <AfricanPatternBackground opacity="light" color="gold" />
          
          <div class="modal-content">
            <div class="modal-icon">
              <i :class="iconClass"></i>
            </div>
            
            <h3 class="modal-title">{{ title }}</h3>
            <p class="modal-message">{{ message }}</p>
            
            <div class="modal-actions">
              <button @click="cancel" class="btn-cancel">
                {{ cancelText }}
              </button>
              <button @click="confirm" class="btn-confirm">
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import AfricanPatternBackground from './AfricanPatternBackground.vue'

interface Props {
  show: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmation',
  confirmText: 'Confirmer',
  cancelText: 'Annuler',
  type: 'warning'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bi bi-exclamation-triangle-fill'
    case 'warning':
      return 'bi bi-question-circle-fill'
    default:
      return 'bi bi-info-circle-fill'
  }
})

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(11, 11, 11, 0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  position: relative;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  background: #F5F2EC;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(14, 58, 52, 0.3);
  border: 2px solid rgba(201, 164, 108, 0.3);
}

.modal-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  text-align: center;
}

.modal-icon {
  font-size: 4rem;
  color: #C9A46C;
  margin-bottom: 1rem;
}

.modal-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0 0 1rem 0;
}

.modal-message {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  color: #2A2A2A;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  padding: 0.875rem 2rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;
  min-width: 140px;
}

.btn-cancel {
  background: transparent;
  color: #2A2A2A;
  border-color: #E5E5E5;
}

.btn-cancel:hover {
  background: #E5E5E5;
  border-color: #2A2A2A;
  color: #0B0B0B;
}

.btn-confirm {
  background: #0E3A34;
  color: #F5F2EC;
  border-color: #0E3A34;
}

.btn-confirm:hover {
  background: transparent;
  color: #0E3A34;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 58, 52, 0.2);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 767px) {
  .modal-content {
    padding: 1.5rem;
  }

  .modal-icon {
    font-size: 3rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-message {
    font-size: 0.9375rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
