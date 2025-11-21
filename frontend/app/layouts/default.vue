<template>
  <div class="layout-wrapper">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Notifications -->
    <NotificationContainer />
    
    <!-- Confirm Modal -->
    <ConfirmModalContainer />

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4">
            <h5 class="fw-bold mb-3">MEM'S</h5>
            <p class="footer-description">Élégance intemporelle, inspiration africaine. Découvrez notre collection de vêtements qui allient raffinement contemporain et racines culturelles.</p>
          </div>
          <div class="col-md-4 mb-4">
            <h6 class="mb-3">Liens Rapides</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><NuxtLink to="/men" class="footer-link">Hommes</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/women" class="footer-link">Femmes</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/about" class="footer-link">À Propos</NuxtLink></li>
              <li class="mb-2"><NuxtLink to="/contact" class="footer-link">Contact</NuxtLink></li>
            </ul>
          </div>
          <div class="col-md-4 mb-4">
            <h6 class="mb-3">Suivez-Nous</h6>
            <div class="d-flex gap-3 mb-3">
              <a href="#" class="social-link" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-link" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="#" class="social-link" aria-label="Twitter"><i class="bi bi-twitter"></i></a>
              <a href="#" class="social-link" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
            </div>
            <p class="footer-contact">
              <i class="bi bi-envelope me-2"></i>contact@mems.com<br>
              <i class="bi bi-telephone me-2"></i>+237 XXX XXX XXX
            </p>
          </div>
        </div>
        <hr class="footer-divider">
        <div class="text-center footer-bottom">
          <small>&copy; {{ new Date().getFullYear() }} MEM'S. Tous droits réservés.</small>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NotificationContainer from '../components/NotificationContainer.vue'
import ConfirmModalContainer from '../components/ConfirmModalContainer.vue'
</script>

<style scoped>
.layout-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F2EC;
}

.main-content {
  flex: 1;
  background: #F5F2EC;
}

.footer {
  background-color: #0E3A34;
  color: #F5F2EC;
  padding: 4rem 0 2rem;
  margin-top: 0;
  font-family: 'Montserrat', sans-serif;
}

.footer h5 {
  color: #F5F2EC;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.5px;
}

.footer h6 {
  color: #F5F2EC;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-description {
  color: rgba(245, 242, 236, 0.8);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-link {
  color: rgba(245, 242, 236, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
  display: inline-block;
}

.footer-link:hover {
  color: #C9A46C;
  transform: translateX(5px);
}

.social-link {
  color: #F5F2EC;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(245, 242, 236, 0.1);
}

.social-link:hover {
  color: #0E3A34;
  background: #C9A46C;
  transform: translateY(-3px);
}

.footer-contact {
  color: rgba(245, 242, 236, 0.8);
  font-size: 0.85rem;
  line-height: 1.8;
}

.footer-contact i {
  color: #C9A46C;
}

.footer-divider {
  border-color: rgba(245, 242, 236, 0.2);
  margin: 2.5rem 0 1.5rem;
  opacity: 0.5;
}

.footer-bottom {
  color: rgba(245, 242, 236, 0.7);
  font-size: 0.85rem;
}

/* Mobile - 2 colonnes pour Liens Rapides et Suivez-nous */
@media (max-width: 767px) {
  .footer .row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
  }

  /* Description MEM'S en premier, pleine largeur */
  .footer .row > div:nth-child(1) {
    grid-column: 1 / -1;
    margin-bottom: 2rem;
  }

  /* Container pour les 2 colonnes */
  .footer .row > div:nth-child(2) {
    grid-column: 1 / 2;
    margin-bottom: 1.5rem;
  }

  .footer .row > div:nth-child(3) {
    grid-column: 1 / 2;
    margin-bottom: 1.5rem;
  }

  /* Forcer les colonnes 2 et 3 sur la même ligne */
  .footer .row {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }

  .footer .row > div:nth-child(1) {
    grid-column: 1 / 3;
    grid-row: 1;
  }

  .footer .row > div:nth-child(2) {
    grid-column: 1 / 2;
    grid-row: 2;
    padding-right: 0.5rem;
  }

  .footer .row > div:nth-child(3) {
    grid-column: 2 / 3;
    grid-row: 2;
    padding-left: 0.5rem;
  }
}
</style>
