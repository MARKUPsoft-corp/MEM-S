<template>
  <section class="page-hero" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  backgroundImage: string
}

defineProps<Props>()
</script>

<style scoped>
.page-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Pas de margin-top - s'étend derrière la navbar comme HeroSection */
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
      rgba(11, 11, 11, 0.5) 0%,
      rgba(11, 11, 11, 0.7) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #F5F2EC;
}

.hero-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 3.5rem;
  font-weight: 600;
  color: #F5F2EC;
  margin: 0 0 1rem 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #C9A46C;
  margin: 0;
  letter-spacing: 1px;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 767px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
