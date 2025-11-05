<template>
  <div class="sidebar-menu-item">
    <component 
      :is="hasDropdown ? 'button' : 'NuxtLink'"
      :to="link"
      class="sidebar-menu-item__button"
      :aria-expanded="hasDropdown ? isOpen : undefined"
      :aria-controls="hasDropdown ? `dropdown-${label}` : undefined"
      @click="handleClick"
    >
      <span>{{ label }}</span>
      <i 
        v-if="hasDropdown" 
        class="bi bi-chevron-down sidebar-menu-item__icon"
        :class="{ 'sidebar-menu-item__icon--rotated': isOpen }"
      ></i>
    </component>
    
    <transition name="dropdown">
      <div 
        v-if="hasDropdown && isOpen" 
        class="sidebar-menu-item__dropdown"
        :id="`dropdown-${label}`"
      >
        <NuxtLink
          v-for="item in dropdownItems"
          :key="item.link"
          :to="item.link"
          class="sidebar-menu-item__dropdown-link"
          @click="$emit('navigate')"
        >
          {{ item.label }}
        </NuxtLink>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
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

const emit = defineEmits<{
  toggle: []
  navigate: []
}>()

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
