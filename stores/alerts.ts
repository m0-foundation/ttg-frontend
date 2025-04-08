import { defineStore } from 'pinia'

export const useAlertsStore = defineStore('alerts', () => {
  const toasts = useToast()

  const items = ref<
    Array<{
      show: boolean
      message: string
      id: string
      type: 'success' | 'error' | 'info'
    }>
  >([])

  const successAlert = (message: string) => {
    toasts.add({
      description: message,
      icon: 'i-heroicons-check-circle',
      color: 'green',
    })
  }
  const errorAlert = (message: string) => {
    toasts.add({
      description: message,
      icon: 'i-heroicons-x-circle',
      color: 'red',
    })
  }
  const infoAlert = (message: string) => {
    toasts.add({ description: message })
  }

  return {
    items,
    successAlert,
    infoAlert,
    errorAlert,
  }
})
