<template>
  <div class="lins-page">
    <!-- Hero Banner -->
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Collection Lins</h1>
        <p class="hero-subtitle">Naturel & Élégant</p>
      </div>
    </section>

    <!-- Breadcrumb -->
    <div class="breadcrumb-container">
      <div class="container">
        <nav class="breadcrumb">
          <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Lins</span>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Sidebar Filters (Desktop) -->
          <aside class="filters-sidebar">
            <p class="placeholder-text">Filtres à venir</p>
          </aside>

          <!-- Products Grid -->
          <main class="products-main">
            <p class="placeholder-text">Grille de produits à venir</p>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Collection Lins - MEM\'S',
  meta: [
    {
      name: 'description',
      content: 'Découvrez notre collection de vêtements en lin naturel : chemises, pantalons, robes et ensembles pour hommes et femmes.'
    }
  ]
})
</script>

<style scoped>
/* Page Hero */
.page-hero {
  position: relative;
  width: 100%;
  height: 400px;
  background-image: url('https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1920&h=600&fit=crop&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 90px;
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

/* Breadcrumb */
.breadcrumb-container {
  background: #F5F2EC;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(201, 164, 108, 0.2);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
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

/* Page Content */
.page-content {
  background: #F5F2EC;
  padding: 3rem 0;
  min-height: 60vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
}

/* Filters Sidebar */
.filters-sidebar {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 4px;
  height: fit-content;
  position: sticky;
  top: 120px;
}

/* Products Main */
.products-main {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 4px;
  min-height: 500px;
}

.placeholder-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  color: #2A2A2A;
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .page-hero {
    height: 350px;
  }

  .hero-title {
    font-size: 3rem;
  }

  .content-wrapper {
    grid-template-columns: 240px 1fr;
    gap: 2rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 767px) {
  .page-hero {
    height: 300px;
    margin-top: 70px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .breadcrumb-container {
    padding: 1rem 0;
  }

  .page-content {
    padding: 2rem 0;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .filters-sidebar {
    position: static;
    padding: 1.5rem;
  }

  .products-main {
    padding: 1.5rem;
  }
}
</style>
