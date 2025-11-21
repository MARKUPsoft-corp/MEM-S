<template>
  <Transition name="notification">
    <div v-if="show" :class="['notification', `notification-${type}`]">
      <div class="notification-content">
        <i :class="['notification-icon', iconClass]"></i>
        <p class="notification-message">{{ message }}</p>
      </div>
      <button @click="close" class="notification-close">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(true)

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bi bi-check-circle-fill'
    case 'error':
      return 'bi bi-exclamation-circle-fill'
    case 'warning':
      return 'bi bi-exclamation-triangle-fill'
    default:
      return 'bi bi-info-circle-fill'
  }
})

const close = () => {
  show.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  min-width: 320px;
  max-width: 400px;
  padding: 1rem 1.5rem;
  background: #F5F2EC;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(14, 58, 52, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 2px solid;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-message {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  color: #0B0B0B;
  margin: 0;
  line-height: 1.4;
}

.notification-close {
  background: transparent;
  border: none;
  color: #2A2A2A;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  color: #0B0B0B;
}

/* Types */
.notification-success {
  border-color: #0E3A34;
}

.notification-success .notification-icon {
  color: #0E3A34;
}

.notification-error {
  border-color: #A14E36;
}

.notification-error .notification-icon {
  color: #A14E36;
}

.notification-warning {
  border-color: #C9A46C;
}

.notification-warning .notification-icon {
  color: #C9A46C;
}

.notification-info {
  border-color: #0E3A34;
}

.notification-info .notification-icon {
  color: #0E3A34;
}

/* Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive */
@media (max-width: 767px) {
  .notification {
    top: 80px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
