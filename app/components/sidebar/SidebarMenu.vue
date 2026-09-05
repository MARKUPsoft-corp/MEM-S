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
    id: 'home',
    label: 'ACCUEIL',
    link: '/',
    hasDropdown: false
  },
  {
    id: 'men',
    label: 'HOMMES',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Tous les produits', link: '/men' },
      { label: 'Boubou', link: '/men?category=boubous' },
      { label: 'Gandoura', link: '/men?category=gandouras' },
      { label: 'Costumes', link: '/men?category=costumes' },
      { label: 'Chemise', link: '/men?category=chemises' },
      { label: 'Pantalon', link: '/men?category=pantalons' }
    ]
  },
  {
    id: 'women',
    label: 'FEMMES',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Tous les produits', link: '/women' },
      { label: 'Robes', link: '/women?category=robes' },
      { label: 'Ensembles', link: '/women?category=ensembles' },
      { label: 'Sacs', link: '/women?category=sacs' }
    ]
  },
  {
    id: 'babouches',
    label: 'BABOUCHES',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Tous les produits', link: '/babouches' },
      { label: 'Cuir', link: '/babouches?category=cuir' },
      { label: 'Brodées', link: '/babouches?category=brodes' }
    ]
  },
  {
    id: 'lins',
    label: 'LINS',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Tous les produits', link: '/lins' },
      { label: 'Chemises', link: '/lins?category=chemises' },
      { label: 'Pantalons', link: '/lins?category=pantalons' }
    ]
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
