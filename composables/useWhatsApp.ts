import type { Order } from '~/types/order'

export const useWhatsApp = () => {
  const config = useRuntimeConfig()

  const formatOrderMessage = (order: Order): string => {
    let message = `🛍️ *NOUVELLE COMMANDE*\n\n`
    message += `📋 *N° Commande:* ${order.order_number}\n\n`
    
    message += `👤 *Informations Client:*\n`
    message += `Nom: ${order.full_name}\n`
    message += `Téléphone: ${order.phone}\n`
    message += `WhatsApp: ${order.whatsapp}\n`
    message += `Adresse: ${order.address}\n`
    message += `Ville: ${order.city}\n`
    
    if (order.notes) {
      message += `Notes: ${order.notes}\n`
    }
    
    message += `\n📦 *Articles commandés:*\n`
    
    order.items.forEach((item, index) => {
      message += `\n${index + 1}. ${item.product.name}\n`
      if (item.variant) {
        message += `   Taille: ${item.variant.size} | Couleur: ${item.variant.color}\n`
      }
      message += `   Quantité: ${item.quantity}\n`
      message += `   Prix unitaire: ${formatPrice(item.price)} FCFA\n`
      message += `   Sous-total: ${formatPrice(item.price * item.quantity)} FCFA\n`
    })
    
    message += `\n💰 *Montant Total: ${formatPrice(order.total)} FCFA*\n`
    
    return message
  }

  const sendOrderToWhatsApp = (order: Order) => {
    const message = formatOrderMessage(order)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${config.public.whatsappNumber}?text=${encodedMessage}`
    
    if (process.client) {
      window.open(whatsappUrl, '_blank')
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  return {
    formatOrderMessage,
    sendOrderToWhatsApp,
    formatPrice,
  }
}
