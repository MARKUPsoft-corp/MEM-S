<template>
  <div class="sidebar-menu">
    <SidebarMenuItem
      v-for="item in menuItems"
      :key="item.id"
      :label="item.label"
      :link="item.link"
      :hasDropdown="item.hasDropdown"
      :isOpen="openDropdowns[item.id] || false"
      :dropdownItems="item.dropdownItems"
      @toggle="toggleDropdown(item.id)"
      @navigate="$emit('navigate')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SidebarMenuItem from './SidebarMenuItem.vue'

interface DropdownItem {
  label: string
  link: string
}

interface MenuItem {
  id: string
  label: string
  link?: string
  hasDropdown: boolean
  dropdownItems?: DropdownItem[]
}

defineEmits<{
  navigate: []
}>()

const menuItems: MenuItem[] = [
  {
    id: 'men',
    label: 'HOMMES',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Tous les produits', link: '/men' },
      { label: 'Boubou', link: '/men/boubou' },
      { label: 'Gandoura', link: '/men/gandoura' },
      { label: 'Costumes', link: '/men/costumes' },
      { label: 'Chemise', link: '/men/chemise' },
      { label: 'Pantalon', link: '/men/pantalon' }
    ]
  },
  {
    id: 'women',
    label: 'FEMMES',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Tous les produits', link: '/women' },
      { label: 'Vêtements', link: '/women/vetements' },
      { label: 'Sacs', link: '/women/sacs' }
    ]
  },
  {
    id: 'babouches',
    label: 'BABOUCHES',
    link: '/babouches',
    hasDropdown: false
  },
  {
    id: 'lins',
    label: 'LINS',
    link: '/lins',
    hasDropdown: false
  }
]

const openDropdowns = ref<Record<string, boolean>>({})

function toggleDropdown(id: string) {
  openDropdowns.value[id] = !openDropdowns.value[id]
}
</script>

<style scoped>
.sidebar-menu {
  background: #0E3A34;
  margin: 1rem 0;
  padding: 0;
}
</style>
