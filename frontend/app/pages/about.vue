<template>
  <div class="about-page">
    <!-- Hero Banner -->
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">À Propos</h1>
        <p class="hero-subtitle">Notre histoire, nos valeurs</p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="page-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Sidebar (Desktop) -->
          <aside class="about-sidebar">
            <!-- African Pattern Background -->
            <AfricanPatternBackground opacity="light" color="gold" />
            
            <!-- Breadcrumb -->
            <nav class="breadcrumb">
              <NuxtLink to="/" class="breadcrumb-link">Accueil</NuxtLink>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">À Propos</span>
            </nav>

            <div class="sidebar-header">
              <h3 class="sidebar-title">Navigation</h3>
              <div class="title-underline"></div>
            </div>
            
            <nav class="sidebar-nav">
              <a href="#qui-sommes-nous" @click.prevent="scrollToSection('qui-sommes-nous')" class="nav-link">
                <i class="bi bi-chevron-right"></i>
                Qui Sommes-Nous
              </a>
              <a href="#engagement" @click.prevent="scrollToSection('engagement')" class="nav-link">
                <i class="bi bi-chevron-right"></i>
                Notre Engagement
              </a>
              <a href="#collections" @click.prevent="scrollToSection('collections')" class="nav-link">
                <i class="bi bi-chevron-right"></i>
                Nos Collections
              </a>
              <a href="#valeurs" @click.prevent="scrollToSection('valeurs')" class="nav-link">
                <i class="bi bi-chevron-right"></i>
                Nos Valeurs
              </a>
              <a href="#contact" @click.prevent="scrollToSection('contact')" class="nav-link">
                <i class="bi bi-chevron-right"></i>
                Contact
              </a>
            </nav>
          </aside>

          <!-- Main Content -->
          <main class="about-main">
            <div id="qui-sommes-nous" class="content-block">
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

            <div id="engagement" class="content-block">
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

            <div id="collections" class="content-block">
              <h2 class="block-title">Nos Collections</h2>
              <div class="collections-grid">
                <div class="collection-card">
                  <i class="bi bi-person-fill collection-icon"></i>
                  <h3>Collection Hommes</h3>
                  <p>Boubous, gandouras, costumes, chemises et pantalons élégants</p>
                </div>
                <div class="collection-card">
                  <i class="bi bi-person-dress collection-icon"></i>
                  <h3>Collection Femmes</h3>
                  <p>Robes africaines, ensembles traditionnels et sacs raffinés</p>
                </div>
                <div class="collection-card">
                  <i class="bi bi-coin collection-icon"></i>
                  <h3>Babouches</h3>
                  <p>Chaussures artisanales en cuir de qualité premium</p>
                </div>
                <div class="collection-card">
                  <i class="bi bi-flower1 collection-icon"></i>
                  <h3>Collection Lins</h3>
                  <p>Vêtements en lin naturel pour un confort optimal</p>
                </div>
              </div>
            </div>

            <div id="valeurs" class="content-block">
              <h2 class="block-title">Nos Valeurs</h2>
              <div class="values-grid">
                <div class="value-card">
                  <div class="value-icon-large">
                    <i class="bi bi-gem"></i>
                  </div>
                  <h3>Qualité Premium</h3>
                  <p>Des matériaux nobles et un savoir-faire artisanal pour chaque création</p>
                </div>
                <div class="value-card">
                  <div class="value-icon-large">
                    <i class="bi bi-heart"></i>
                  </div>
                  <h3>Authenticité</h3>
                  <p>Des créations qui célèbrent l'héritage et la culture africaine</p>
                </div>
                <div class="value-card">
                  <div class="value-icon-large">
                    <i class="bi bi-star"></i>
                  </div>
                  <h3>Excellence</h3>
                  <p>Un service client attentif et personnalisé à chaque étape</p>
                </div>
              </div>
            </div>

            <div id="contact" class="content-block">
              <h2 class="block-title">Contactez-Nous</h2>
              <div class="contact-grid">
                <div class="contact-card">
                  <i class="bi bi-whatsapp"></i>
                  <div>
                    <h4>WhatsApp</h4>
                    <p>+237 XXX XXX XXX</p>
                  </div>
                </div>
                <div class="contact-card">
                  <i class="bi bi-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <p>contact@mems.com</p>
                  </div>
                </div>
                <div class="contact-card">
                  <i class="bi bi-geo-alt"></i>
                  <div>
                    <h4>Localisation</h4>
                    <p>Cameroun</p>
                  </div>
                </div>
              </div>
              <NuxtLink to="/contact" class="btn-contact">
                <i class="bi bi-send"></i>
                Nous Contacter
              </NuxtLink>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AfricanPatternBackground from '../components/AfricanPatternBackground.vue'

// Smooth scroll to section
function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    const yOffset = -20
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

// Page metadata
useHead({
  title: 'À Propos - MEM\'S',
  meta: [
    {
      name: 'description',
      content: 'Découvrez l\'histoire de MEM\'S, nos valeurs et notre engagement pour l\'élégance africaine.'
    }
  ]
})
</script>

<style scoped>
/* Page Hero */
.page-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=600&fit=crop&q=80');
  background-size: cover;
  background-position: center;
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

/* Sidebar */
.about-sidebar {
  position: relative;
  overflow: hidden;
  background: #F5F2EC;
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid rgba(201, 164, 108, 0.3);
  height: fit-content;
  box-shadow: 0 4px 12px rgba(14, 58, 52, 0.15);
  transition: box-shadow 0.3s ease;
}

/* Sticky uniquement sur desktop */
@media (min-width: 768px) {
  .about-sidebar {
    position: sticky;
    top: 120px;
  }
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(201, 164, 108, 0.3);
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

.sidebar-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.sidebar-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.5px;
}

.title-underline {
  width: 60px;
  height: 2px;
  background: #C9A46C;
  border-radius: 2px;
  margin: 0 auto;
}

.sidebar-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #0E3A34;
  border: 1px solid rgba(201, 164, 108, 0.2);
  border-radius: 4px;
  color: #F5F2EC;
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link i {
  font-size: 0.75rem;
  color: #C9A46C;
  transition: transform 0.3s ease;
}

.nav-link:hover {
  background: #0E3A34;
  border-color: #C9A46C;
  color: #C9A46C;
  transform: translateX(4px);
}

.nav-link:hover i {
  transform: translateX(4px);
  color: #C9A46C;
}

/* Main Content */
.about-main {
  background: transparent;
  padding: 0;
  min-height: 500px;
}

.content-block {
  background: #FFFFFF;
  padding: 2.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(11, 11, 11, 0.05);
  margin-bottom: 2rem;
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

.body-text:last-child {
  margin-bottom: 0;
}

/* Collections Grid */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.collection-card {
  background: #F5F2EC;
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(201, 164, 108, 0.2);
}

.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(14, 58, 52, 0.15);
}

.collection-icon {
  font-size: 3rem;
  color: #C9A46C;
  margin-bottom: 1rem;
  display: block;
}

.collection-card h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0B0B0B;
  margin: 0 0 0.5rem 0;
}

.collection-card p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
  line-height: 1.5;
}

/* Values Grid */
.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.value-card {
  background: #F5F2EC;
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(201, 164, 108, 0.2);
}

.value-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(14, 58, 52, 0.15);
}

.value-icon-large {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 50%;
  color: #0E3A34;
  font-size: 1.5rem;
  margin: 0 auto 1rem auto;
}

.value-card h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0B0B0B;
  margin: 0 0 0.5rem 0;
}

.value-card p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
  line-height: 1.5;
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #F5F2EC;
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid rgba(201, 164, 108, 0.2);
}

.contact-card i {
  font-size: 1.75rem;
  color: #C9A46C;
  flex-shrink: 0;
}

.contact-card h4 {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0B0B0B;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-card p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: #2A2A2A;
  margin: 0;
}

.btn-contact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 1.5rem;
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
  .hero-title {
    font-size: 3rem;
  }

  .content-wrapper {
    grid-template-columns: 240px 1fr;
    gap: 2rem;
  }

  .collections-grid {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
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

  .page-content {
    padding: 2rem 0;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .about-sidebar {
    display: none;
  }

  .content-block {
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
}
</style>
