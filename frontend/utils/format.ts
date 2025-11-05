export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatDateShort = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export const calculateDiscount = (price: number, discountPrice: number): number => {
  return Math.round(((price - discountPrice) / price) * 100)
}
