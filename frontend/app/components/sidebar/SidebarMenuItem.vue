<template>
  <div class="sidebar-menu-item">
    <component :is="hasDropdown ? 'button' : 'NuxtLink'" :to="link" class="sidebar-menu-item__button"
      :class="{ 'sidebar-menu-item__button--active': isActive }" :aria-expanded="hasDropdown ? isOpen : undefined"
      :aria-controls="hasDropdown ? `dropdown-${label}` : undefined" @click="handleClick">
      <span>{{ label }}</span>
      <i v-if="hasDropdown" class="bi bi-chevron-down sidebar-menu-item__icon"
        :class="{ 'sidebar-menu-item__icon--rotated': isOpen }"></i>
    </component>

    <transition name="dropdown">
      <div v-if="hasDropdown && isOpen" class="sidebar-menu-item__dropdown" :id="`dropdown-${label}`">
        <NuxtLink v-for="item in dropdownItems" :key="item.link" :to="item.link"
          class="sidebar-menu-item__dropdown-link"
          :class="{ 'sidebar-menu-item__dropdown-link--active': isDropdownItemActive(item.link) }"
          @click="$emit('navigate')">
          {{ item.label }}
        </NuxtLink>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface DropdownItem {
  label: string
  link: string
}

interface Props {
  label: string
  link?: string
  hasDropdown: boolean
  isOpen: boolean
  dropdownItems?: DropdownItem[]
}

const props = defineProps<Props>()
const route = useRoute()

const emit = defineEmits<{
  toggle: []
  navigate: []
}>()

// Vérifier si le lien est actif
const isActive = computed(() => {
  if (!props.hasDropdown && props.link) {
    return route.path === props.link
  }
  // Pour les dropdowns, vérifier si on est sur une des pages du dropdown
  if (props.hasDropdown && props.dropdownItems) {
    return props.dropdownItems.some(item => {
      const itemPath = item.link.split('?')[0]
      return route.path === itemPath
    })
  }
  return false
})

// Vérifier si un item du dropdown est actif
function isDropdownItemActive(link: string): boolean {
  const linkPath = link.split('?')[0]
  const linkQuery = link.split('?')[1]

  if (route.path !== linkPath) {
    return false
  }

  // Si pas de query dans le lien, vérifier qu'on est sur la page sans query
  if (!linkQuery) {
    return Object.keys(route.query).length === 0
  }

  // Vérifier si la query correspond
  const queryParams = new URLSearchParams(linkQuery)
  const category = queryParams.get('category')
  return category === route.query.category
}

function handleClick() {
  if (props.hasDropdown) {
    emit('toggle')
  } else {
    emit('navigate')
  }
}
</script>

<style scoped>
.sidebar-menu-item {
  width: 100%;
}

.sidebar-menu-item__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #0E3A34;
  color: #F5F2EC;
  border: none;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-menu-item__button:hover {
  background: #0A2B27;
  color: #C9A46C;
}

.sidebar-menu-item__button--active {
  background: #0A2B27;
  color: #C9A46C;
  font-weight: 600;
  border-left: 4px solid #C9A46C;
  padding-left: calc(1.5rem - 4px);
}

.sidebar-menu-item__icon {
  font-size: 0.75rem;
  transition: transform 200ms ease;
}

.sidebar-menu-item__icon--rotated {
  transform: rotate(180deg);
}

.sidebar-menu-item__dropdown {
  background: #0A2B27;
  overflow: hidden;
}

.sidebar-menu-item__dropdown-link {
  display: block;
  padding: 0.75rem 2rem;
  color: #F5F2EC;
  text-decoration: none;
  font-size: 0.75rem;
  font-family: 'Montserrat', sans-serif;
  transition: background-color 0.2s, color 0.2s;
}

.sidebar-menu-item__dropdown-link:hover {
  background: #0E3A34;
  color: #C9A46C;
}

.sidebar-menu-item__dropdown-link--active {
  background: #0E3A34;
  color: #C9A46C;
  font-weight: 600;
  border-left: 3px solid #C9A46C;
  padding-left: calc(2rem - 3px);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: max-height 250ms ease, opacity 200ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
  max-height: 300px;
  opacity: 1;
}
</style>
