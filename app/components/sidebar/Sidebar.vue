<template>
  <aside 
    class="sidebar" 
    :class="{ 'sidebar--open': isOpen }"
    role="navigation"
    aria-label="Menu de navigation mobile"
    :aria-hidden="!isOpen"
  >
    <AfricanPatternBackground opacity="light" color="gold" />
    <div class="sidebar-content">
      <SidebarSearch @search="handleSearch" />
      <SidebarMenu @navigate="handleNavigate" />
      <SidebarFooter @navigate="handleNavigate" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import SidebarSearch from './SidebarSearch.vue'
import SidebarMenu from './SidebarMenu.vue'
import SidebarFooter from './SidebarFooter.vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function handleSearch(query: string) {
  console.log('Search query:', query)
  // TODO: Implement search functionality
}

function handleNavigate() {
  emit('close')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 85vw;
  max-width: 320px;
  background: #F5F2EC;
  transform: translateX(-100%);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1100;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar--open {
  transform: translateX(0);
  box-shadow: 2px 0 12px rgba(11, 11, 11, 0.2);
}

.sidebar-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>


/* Hide sidebar on desktop */
@media (min-width: 768px) {
  .sidebar {
    display: none;
  }
}
