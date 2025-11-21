<template>
  <div class="notification-container">
    <Notification
      v-for="notification in notifications"
      :key="notification.id"
      :message="notification.message"
      :type="notification.type"
      :duration="notification.duration"
      @close="remove(notification.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '../../composables/useNotification'
import Notification from './Notification.vue'

const { notifications, remove } = useNotification()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: none;
}

.notification-container > * {
  pointer-events: all;
}

@media (max-width: 767px) {
  .notification-container {
    top: 80px;
    right: 10px;
    left: 10px;
  }
}
</style>
