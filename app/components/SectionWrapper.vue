<template>
  <div class="section-wrapper">
    <div v-if="showDivider" class="section-divider">
      <div class="divider-line"></div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  showDivider?: boolean
}

withDefaults(defineProps<Props>(), {
  showDivider: false
})
</script>

<style scoped>
.section-wrapper {
  padding: 3rem 0;
}

.section-divider {
  max-width: 1400px;
  margin: 0 auto 3rem auto;
  padding: 0 1rem;
}

.divider-line {
  height: 1px;
  background: linear-gradient(to right, transparent 0%, #C9A46C 20%, #C9A46C 80%, transparent 100%);
  opacity: 0.3;
}

@media (max-width: 767px) {
  .section-wrapper {
    padding: 2rem 0;
  }
  
  .section-divider {
    margin-bottom: 2rem;
  }
}
</style>
