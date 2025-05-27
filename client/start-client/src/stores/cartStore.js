import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 🛒 購物車項目
  const items = ref([])

  // 🆕 付款方式
  const paymentMethod = ref('') // 可預設為空，或 'linepay'

  // 📦 預設範例資料（如首次進入時）
  const sampleProducts = [
    { id: 101, name: '精釀啤酒｜琥珀艾爾', price: 120, spec: '330ml', quantity: 2 },
    { id: 102, name: '威士忌｜格蘭菲迪 12 年', price: 980, spec: '700ml', quantity: 1 }
  ]

  // ✅ 載入 localStorage
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('cart')
      items.value = saved ? JSON.parse(saved) : sampleProducts

      const method = localStorage.getItem('paymentMethod')
      paymentMethod.value = method || ''
    } catch (error) {
      console.error('載入儲存資料失敗', error)
    }
  }

  // ✅ 寫入 localStorage
  watch(items, val => {
    try {
      localStorage.setItem('cart', JSON.stringify(val))
    } catch (e) {
      console.warn('寫入購物車失敗', e)
    }
  }, { deep: true })

  watch(paymentMethod, val => {
    try {
      localStorage.setItem('paymentMethod', val)
    } catch (e) {
      console.warn('寫入付款方式失敗', e)
    }
  })

  // 🎯 操作方法
  const addItem = (item) => {
    const existing = items.value.find(i => i.id === item.id)
    existing ? existing.quantity += item.quantity : items.value.push({ ...item })
  }

  const removeItem = (id) => items.value = items.value.filter(i => i.id !== id)

  const increase = (item) => item.quantity++

  const decrease = (item) => {
    if (item.quantity > 1) item.quantity--
  }

  const clearCart = () => items.value = []

  const setPaymentMethod = (method) => {
    paymentMethod.value = method
  }

  return {
    items,
    paymentMethod,
    loadFromStorage,
    addItem,
    removeItem,
    increase,
    decrease,
    clearCart,
    setPaymentMethod
  }
})
