<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Notre Histoire</h1>
        <p class="hero-subtitle">Élégance intemporelle et inspiration africaine</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="about-content-section">
      <div class="container">
        <div class="content-grid">
          <!-- Left Column -->
          <div class="content-main">
            <div class="content-block">
              <h2 class="block-title">Qui Sommes-Nous ?</h2>
              <p class="lead-text">
                MEM'S est votre destination en ligne pour des vêtements alliant élégance intemporelle et inspiration
                africaine.
              </p>
              <p class="body-text">
                Nous célébrons le raffinement contemporain et les racines culturelles à travers une sélection
                soigneusement choisie de boubous, gandouras, costumes, babouches et vêtements en lin naturel. Chaque
                pièce de notre collection est sélectionnée avec soin pour offrir qualité, confort et authenticité.
              </p>
              <p class="body-text">
                Nous croyons que la mode est un moyen d'expression culturelle et d'affirmation de soi. Notre mission
                est de rendre accessible l'élégance africaine à tous, tout en préservant l'authenticité et le
                savoir-faire artisanal.
              </p>
            </div>

            <div class="content-block">
              <h2 class="block-title">Notre Engagement</h2>
              <p class="body-text">
                Chez MEM'S, nous nous engageons à offrir une expérience d'achat simple et agréable. Notre processus de
                commande via WhatsApp vous permet de passer commande facilement et de communiquer directement avec nous
                pour toute question.
              </p>
              <p class="body-text">
                Nous travaillons avec des artisans talentueux pour vous proposer des créations uniques qui allient
                tradition et modernité. Chaque produit est le fruit d'un savoir-faire transmis de génération en
                génération.
              </p>
            </div>

            <div class="content-block">
              <h2 class="block-title">Nos Collections</h2>
              <div class="collections-list">
                <div class="collection-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <div>
                    <h3>Collection Hommes</h3>
                    <p>Boubous, gandouras, costumes, chemises et pantalons élégants</p>
                  </div>
                </div>
                <div class="collection-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <div>
                    <h3>Collection Femmes</h3>
                    <p>Robes africaines, ensembles traditionnels et sacs raffinés</p>
                  </div>
                </div>
                <div class="collection-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <div>
                    <h3>Babouches</h3>
                    <p>Chaussures artisanales en cuir de qualité premium</p>
                  </div>
                </div>
                <div class="collection-item">
                  <i class="bi bi-check-circle-fill"></i>
                  <div>
                    <h3>Collection Lins</h3>
                    <p>Vêtements en lin naturel pour un confort optimal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Sidebar -->
          <div class="content-sidebar">
            <div class="sidebar-card">
              <h3 class="sidebar-title">Nos Valeurs</h3>
              <div class="values-list">
                <div class="value-item">
                  <div class="value-icon">
                    <i class="bi bi-gem"></i>
                  </div>
                  <div>
                    <h4>Qualité Premium</h4>
                    <p>Des matériaux nobles et un savoir-faire artisanal</p>
                  </div>
                </div>
                <div class="value-item">
                  <div class="value-icon">
                    <i class="bi bi-heart"></i>
                  </div>
                  <div>
                    <h4>Authenticité</h4>
                    <p>Des créations qui célèbrent l'héritage africain</p>
                  </div>
                </div>
                <div class="value-item">
                  <div class="value-icon">
                    <i class="bi bi-star"></i>
                  </div>
                  <div>
                    <h4>Excellence</h4>
                    <p>Un service client attentif et personnalisé</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="sidebar-card">
              <h3 class="sidebar-title">Contactez-Nous</h3>
              <div class="contact-info">
                <div class="contact-item">
                  <i class="bi bi-whatsapp"></i>
                  <span>+237 XXX XXX XXX</span>
                </div>
                <div class="contact-item">
                  <i class="bi bi-envelope"></i>
                  <span>contact@mems.com</span>
                </div>
                <div class="contact-item">
                  <i class="bi bi-geo-alt"></i>
                  <span>Cameroun</span>
                </div>
              </div>
              <NuxtLink to="/contact" class="btn-contact">
                Nous Contacter
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.about-page {
  background: #F5F2EC;
}

/* Hero Section */
.about-hero {
  position: relative;
  height: 400px;
  background: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop&q=80') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right,
      rgba(14, 58, 52, 0.8) 0%,
      rgba(14, 58, 52, 0.6) 50%,
      rgba(14, 58, 52, 0.4) 100%);
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
  font-weight: 700;
  margin: 0 0 1rem 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: 1px;
}

/* Content Section */
.about-content-section {
  padding: 5rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
}

/* Main Content */
.content-main {
  background: #FFFFFF;
  padding: 3rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(11, 11, 11, 0.05);
}

.content-block {
  margin-bottom: 3rem;
}

.content-block:last-child {
  margin-bottom: 0;
}

.block-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.5px;
}

.lead-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  color: #0B0B0B;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.body-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #2A2A2A;
  line-height: 1.8;
  margin: 0 0 1.25rem 0;
}

/* Collections List */
.collections-list {
  display: grid;
  gap: 1.5rem;
}

.collection-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.collection-item>i {
  color: #C9A46C;
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.collection-item h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0B0B0B;
  margin: 0 0 0.25rem 0;
}

.collection-item p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
  line-height: 1.5;
}

/* Sidebar */
.content-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-card {
  background: #FFFFFF;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(11, 11, 11, 0.05);
}

.sidebar-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.5px;
}

/* Values List */
.values-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.value-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.value-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F2EC;
  border-radius: 50%;
  color: #0E3A34;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.value-item h4 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #0B0B0B;
  margin: 0 0 0.25rem 0;
}

.value-item p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
  line-height: 1.5;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  color: #2A2A2A;
}

.contact-item i {
  color: #C9A46C;
  font-size: 1.125rem;
}

.btn-contact {
  display: block;
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #0E3A34;
  color: #F5F2EC;
  border: 2px solid #0E3A34;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  border-radius: 2px;
  text-decoration: none;
}

.btn-contact:hover {
  background: transparent;
  color: #0E3A34;
}

/* Responsive - Tablet */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }
}

/* Responsive - Mobile */
@media (max-width: 767px) {
  .about-hero {
    height: 300px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .about-content-section {
    padding: 3rem 0;
  }

  .content-main {
    padding: 2rem 1.5rem;
  }

  .block-title {
    font-size: 1.75rem;
  }

  .lead-text {
    font-size: 1.125rem;
  }

  .body-text {
    font-size: 0.9375rem;
  }

  .sidebar-card {
    padding: 1.5rem;
  }
}
</style>
