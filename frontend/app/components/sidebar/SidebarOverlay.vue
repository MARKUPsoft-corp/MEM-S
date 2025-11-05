<template>
  <div 
    v-if="isVisible"
    class="sidebar-overlay"
    :class="{ 'sidebar-overlay--visible': isVisible }"
    @click="$emit('click')"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  opacity: 0;
  transition: opacity 300ms ease;
  pointer-events: none;
}

.sidebar-overlay--visible {
  opacity: 1;
  pointer-events: auto;
}
</style>


/* Hide overlay on desktop */
@media (min-width: 768px) {
  .sidebar-overlay {
    display: none;
  }
}
