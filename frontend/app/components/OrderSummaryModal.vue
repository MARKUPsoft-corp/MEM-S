<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <AfricanPatternBackground opacity="light" color="gold" />
          
          <!-- Modal Header -->
          <div class="modal-header">
            <h2 class="modal-title">Résumé de votre commande</h2>
            <button @click="$emit('close')" class="modal-close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <!-- User Info -->
            <div class="section">
              <h3 class="section-title">
                <i class="bi bi-person-circle"></i>
                Informations client
              </h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Nom</span>
                  <span class="info-badge">{{ user.first_name }} {{ user.last_name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-badge">{{ user.email }}</span>
                </div>
                <div class="info-item" v-if="user.phone">
                  <span class="info-label">Téléphone</span>
                  <span class="info-badge info-badge-phone">
                    <i class="bi bi-telephone-fill"></i>
                    {{ user.phone }}
                  </span>
                </div>
                <div class="info-item" v-if="user.address">
                  <span class="info-label">Adresse</span>
                  <span class="info-badge info-badge-address">
                    <i class="bi bi-geo-alt-fill"></i>
                    {{ user.address }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="section">
              <h3 class="section-title">
                <i class="bi bi-cart-check"></i>
                Articles commandés
                <span class="items-count-badge">{{ items.length }}</span>
              </h3>
              <div class="items-list">
                <div v-for="item in items" :key="item.id" class="order-item">
                  <div class="item-info">
                    <span class="item-name">{{ item.product.name }}</span>
                    <div v-if="item.variant && item.variant.attributes" class="item-variants">
                      <span v-for="attr in item.variant.attributes" :key="attr.name" class="variant-badge">
                        {{ attr.name }}: {{ attr.value }}
                      </span>
                    </div>
                  </div>
                  <div class="item-details">
                    <span class="quantity-badge">x{{ item.quantity }}</span>
                    <span class="price-badge">{{ formatPrice(item.price * item.quantity) }} FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Total -->
            <div class="section section-total">
              <div class="total-row">
                <span class="total-label">Sous-total</span>
                <span class="total-badge">{{ formatPrice(subtotal) }} FCFA</span>
              </div>
              <div class="total-row">
                <span class="total-label">Livraison</span>
                <span class="total-badge total-badge-free">
                  <i class="bi bi-truck"></i>
                  Gratuite
                </span>
              </div>
              <div class="total-divider"></div>
              <div class="total-row total-row-final">
                <span class="total-label-final">Total à payer</span>
                <span class="total-badge-final">{{ formatPrice(total) }} FCFA</span>
              </div>
            </div>

            <!-- Custom Message -->
            <div class="section">
              <h3 class="section-title">
                <i class="bi bi-chat-dots"></i>
                Message (optionnel)
              </h3>
              <textarea
                v-model="customMessage"
                class="message-input"
                placeholder="Ajoutez un message pour votre commande (adresse de livraison, instructions spéciales, etc.)"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button @click="$emit('close')" class="btn-cancel">
              Annuler
            </button>
            <button @click="sendToWhatsApp" class="btn-whatsapp">
              <i class="bi bi-whatsapp"></i>
              Commander sur WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import AfricanPatternBackground from './AfricanPatternBackground.vue'
import type { CartItem } from '../../types/cart'
import type { User } from '../../types/auth'

interface Props {
  show: boolean
  items: CartItem[]
  user: User
  subtotal: number
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const customMessage = ref('')

const formatPrice = (price: number) => {
  return price.toLocaleString('fr-FR')
}

const sendToWhatsApp = () => {
  const whatsappNumber = '237696962662' // Format international sans + ni espaces
  
  // Construire le message
  let message = `🛍️ *NOUVELLE COMMANDE - MEM'S*\n\n`
  
  // Informations client
  message += `👤 *Client:*\n`
  message += `Nom: ${props.user.first_name} ${props.user.last_name}\n`
  message += `Email: ${props.user.email}\n`
  if (props.user.phone) message += `Téléphone: ${props.user.phone}\n`
  if (props.user.address) message += `Adresse: ${props.user.address}\n`
  message += `\n`
  
  // Articles commandés
  message += `📦 *Articles commandés:*\n`
  props.items.forEach((item, index) => {
    message += `\n${index + 1}. ${item.product.name}\n`
    if (item.variant && item.variant.attributes) {
      const variantText = item.variant.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ')
      message += `   ${variantText}\n`
    }
    message += `   Quantité: ${item.quantity}\n`
    message += `   Prix: ${formatPrice(item.price * item.quantity)} FCFA\n`
  })
  message += `\n`
  
  // Total
  message += `💰 *Résumé:*\n`
  message += `Sous-total: ${formatPrice(props.subtotal)} FCFA\n`
  message += `Livraison: Gratuite\n`
  message += `*Total: ${formatPrice(props.total)} FCFA*\n`
  
  // Message personnalisé
  if (customMessage.value.trim()) {
    message += `\n📝 *Message:*\n${customMessage.value.trim()}\n`
  }
  
  // Encoder le message
  const encodedMessage = encodeURIComponent(message)
  
  // Détecter si mobile ou desktop
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // Construire l'URL WhatsApp
  let whatsappUrl = ''
  if (isMobile) {
    // Sur mobile : ouvrir l'app WhatsApp
    whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`
  } else {
    // Sur desktop : ouvrir WhatsApp Web
    whatsappUrl = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`
  }
  
  // Ouvrir WhatsApp
  window.open(whatsappUrl, '_blank')
  
  // Fermer la modale après un court délai
  setTimeout(() => {
    emit('close')
  }, 500)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(11, 11, 11, 0.8);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  overflow: hidden;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  background: #F5F2EC;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(14, 58, 52, 0.3);
  border: 2px solid rgba(201, 164, 108, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid rgba(201, 164, 108, 0.3);
}

.modal-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0;
}

.modal-close {
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #0E3A34;
}

.modal-close:hover {
  background: #0E3A34;
  border-color: #0E3A34;
  color: #F5F2EC;
}

.modal-body {
  position: relative;
  z-index: 2;
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.section {
  margin-bottom: 2rem;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0E3A34;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #C9A46C;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.75rem;
  color: #2A2A2A;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-badge {
  display: inline-block;
  padding: 0.625rem 1rem;
  background: #FFFFFF;
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  color: #0B0B0B;
  font-weight: 600;
}

.info-badge-phone,
.info-badge-address {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-badge-phone i,
.info-badge-address i {
  color: #C9A46C;
  font-size: 1rem;
}

.items-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 0.5rem;
  background: #C9A46C;
  color: #0B0B0B;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 14px;
  margin-left: 0.5rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  padding: 1rem;
  background: #FFFFFF;
  border: 1px solid rgba(201, 164, 108, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.item-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #0B0B0B;
  margin-bottom: 0.5rem;
}

.item-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.variant-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(201, 164, 108, 0.15);
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 12px;
  font-size: 0.75rem;
  color: #0B0B0B;
  font-weight: 500;
}

.item-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.quantity-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: rgba(14, 58, 52, 0.1);
  border: 1px solid rgba(14, 58, 52, 0.2);
  border-radius: 12px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  color: #0E3A34;
  font-weight: 600;
}

.price-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(201, 164, 108, 0.2);
  border: 1px solid rgba(201, 164, 108, 0.4);
  border-radius: 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #0B0B0B;
}

.section-total {
  background: #FFFFFF;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid rgba(201, 164, 108, 0.3);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.total-label {
  font-size: 0.9375rem;
  color: #2A2A2A;
  font-weight: 500;
}

.total-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(201, 164, 108, 0.1);
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0B0B0B;
}

.total-badge-free {
  background: rgba(14, 58, 52, 0.1);
  border-color: rgba(14, 58, 52, 0.3);
  color: #0E3A34;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-badge-free i {
  font-size: 1rem;
}

.total-divider {
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(201, 164, 108, 0.3), transparent);
  margin: 0.75rem 0;
}

.total-row-final {
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.total-label-final {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0E3A34;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.total-badge-final {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #0E3A34 0%, #1a5449 100%);
  border: 2px solid #0E3A34;
  border-radius: 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #C9A46C;
  box-shadow: 0 3px 10px rgba(14, 58, 52, 0.2);
}

.message-input {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid rgba(201, 164, 108, 0.3);
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  color: #0B0B0B;
  background: #FFFFFF;
  resize: vertical;
  min-height: 80px;
}

.message-input:focus {
  outline: none;
  border-color: #C9A46C;
}

.message-input::placeholder {
  color: #999;
}

.modal-footer {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid rgba(201, 164, 108, 0.3);
}

.btn-cancel,
.btn-whatsapp {
  flex: 1;
  padding: 1rem 2rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: transparent;
  color: #2A2A2A;
  border-color: #E5E5E5;
}

.btn-cancel:hover {
  background: #E5E5E5;
  border-color: #2A2A2A;
  color: #0B0B0B;
}

.btn-whatsapp {
  background: #25D366;
  color: #FFFFFF;
  border-color: #25D366;
}

.btn-whatsapp:hover {
  background: #20BA5A;
  border-color: #20BA5A;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.btn-whatsapp i {
  font-size: 1.25rem;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 767px) {
  .modal-container {
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .order-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-details {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .modal-footer {
    flex-direction: column;
    padding: 1rem 1.5rem;
  }

  .btn-cancel,
  .btn-whatsapp {
    width: 100%;
  }

  /* Reduce total badge size on mobile */
  .total-label-final {
    font-size: 0.75rem;
    font-weight: 600;
  }

  .total-badge-final {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 700;
    border-radius: 14px;
  }

  .total-row-final {
    padding-top: 0.75rem;
    margin-top: 0.25rem;
  }
}
</style>
