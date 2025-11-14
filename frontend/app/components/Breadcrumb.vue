<template>
  <div class="breadcrumb-container">
    <div class="container">
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
        <template v-for="(item, index) in items" :key="index">
          <span class="breadcrumb-separator">/</span>
          <NuxtLink 
            v-if="item.link" 
            :to="item.link" 
            class="breadcrumb-link"
          >
            {{ item.label }}
          </NuxtLink>
          <span v-else class="breadcrumb-current">{{ item.label }}</span>
        </template>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  link?: string
}

interface Props {
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>

<style scoped>
.breadcrumb-container {
  background: #F5F2EC;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(201, 164, 108, 0.2);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.breadcrumb-link {
  color: #2A2A2A;
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #C9A46C;
}

.breadcrumb-separator {
  color: #2A2A2A;
  opacity: 0.5;
}

.breadcrumb-current {
  color: #0E3A34;
  font-weight: 500;
}

/* Responsive - Mobile */
@media (max-width: 767px) {
  .breadcrumb-container {
    padding: 1rem 0;
  }

  .breadcrumb {
    font-size: 0.8125rem;
  }
}
</style>
