import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCheckoutStore = defineStore('checkout', () => {
  const name = ref('')
  const phone = ref('')
  const address = ref('')
  const payment = ref('LINE Pay')

  const reset = () => {
    name.value = ''
    phone.value = ''
    address.value = ''
    payment.value = 'LINE Pay'
  }

  return { name, phone, address, payment, reset }
})
