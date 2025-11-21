import { ref } from 'vue'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

const showModal = ref(false)
const modalOptions = ref<ConfirmOptions>({
  message: ''
})
let resolvePromise: ((value: boolean) => void) | null = null

export const useConfirm = () => {
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    showModal.value = true
    modalOptions.value = options

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const handleConfirm = () => {
    showModal.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    showModal.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    showModal,
    modalOptions,
    confirm,
    handleConfirm,
    handleCancel
  }
}
