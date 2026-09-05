import { ref } from 'vue'

interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
}

const notifications = ref<Notification[]>([])
let notificationId = 0

export const useNotification = () => {
  const show = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000) => {
    const id = notificationId++
    notifications.value.push({ id, message, type, duration })
  }

  const remove = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration = 3000) => {
    show(message, 'success', duration)
  }

  const error = (message: string, duration = 4000) => {
    show(message, 'error', duration)
  }

  const warning = (message: string, duration = 3500) => {
    show(message, 'warning', duration)
  }

  const info = (message: string, duration = 3000) => {
    show(message, 'info', duration)
  }

  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info
  }
}
