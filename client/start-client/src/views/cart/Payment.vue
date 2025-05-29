<template>
  <div class="cart-container">
    <button class="back-btn" @click="goBack">← 返回購物車</button>

    <h2>付款資訊</h2>

    <div v-if="isLoading" class="loading-box">
      <div class="spinner"></div>
      <p>載入中，請稍候...</p>
    </div>

    <div v-else>
      <div class="cart-header">
        <div>活動</div>
        <div>單價</div>
        <div>數量</div>
        <div>小計</div>
      </div>

      <div v-for="item in cartItems" :key="item.id" class="cart-row">
        <div class="product">
          <img class="product-img" :src="item.image || 'https://placehold.co/80x80'" />
          <div class="product-info">
            <p class="product-name">{{ item.name }}</p>
          </div>
        </div>

        <div class="price">${{ item.price }}</div>
        <div class="quantity text-center">{{ item.quantity }}</div>
        <div class="subtotal">${{ calcSubtotal(item) }}</div>
      </div>

      <!-- 客戶資訊表單 -->
      <div class="customer-form">
        <h3>用戶資訊</h3>
        <div class="form-group">
          <label>姓名 *</label>
          <input v-model="customerInfo.name" type="text" placeholder="請輸入姓名" required />
        </div>
        <div class="form-group">
          <label>電話 *</label>
          <input v-model="customerInfo.phone" type="tel" placeholder="請輸入電話" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="customerInfo.email" type="email" placeholder="請輸入 Email (選填)" />
        </div>
        <div class="form-group">
          <label>備註</label>
          <textarea v-model="customerInfo.notes" placeholder="有任何需求請說明" rows="2"></textarea>
        </div>
      </div>

      <div class="payment-method section-spacing">
        <h3>選擇付款方式</h3>
        <div class="method-list">
          <div
            class="method-card"
            :class="{ selected: paymentMethod === 'linepay' }"
            @click="paymentMethod = 'linepay'"
          >
            <img src="/linepay.png" alt="LINE Pay" />
            <span>LINE Pay</span>
          </div>
          <div
            class="method-card"
            :class="{ selected: paymentMethod === 'creditcard' }"
            @click="paymentMethod = 'creditcard'"
          >
            <img src="/creditcard.png" alt="信用卡" />
            <span>信用卡</span>
          </div>
        </div>

        <div class="total-bar section-spacing">
          <p class="total-label">
            總金額：<strong>${{ totalPrice }}</strong>
          </p>
          <button 
            class="checkout-btn" 
            :disabled="!canSubmit || isSubmitting" 
            @click="submitOrder"
          >
            {{ isSubmitting ? '處理中...' : '確認付款' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()
const paymentMethod = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)

// 客戶資訊
const customerInfo = ref({
  name: '',
  phone: '',
  email: '',
  notes: ''
})

onMounted(() => {
  setTimeout(() => {
    cart.loadFromStorage()
    isLoading.value = false
  }, 600)
})

const cartItems = computed(() => cart.items)

const calcSubtotal = (item) => (item.price * item.quantity).toLocaleString()

const totalPrice = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString(),
)

const canSubmit = computed(() => {
  return paymentMethod.value && customerInfo.value.name && customerInfo.value.phone
})

const submitOrder = async () => {
  if (isSubmitting.value || !canSubmit.value) return

  try {
    isSubmitting.value = true

    // 1. 建立訂單
    const orderData = {
      customerName: customerInfo.value.name,
      customerPhone: customerInfo.value.phone,
      customerEmail: customerInfo.value.email,
      notes: customerInfo.value.notes,
      items: cartItems.value.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    }

    const orderResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })

    const orderResult = await orderResponse.json()

    if (!orderResult.success) {
      throw new Error(orderResult.message || '建立訂單失敗')
    }

    // 2. 根據付款方式處理
    if (paymentMethod.value === 'linepay') {
      // LINE Pay 付款
      const paymentResponse = await fetch('/api/linepay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderResult.data.orderId })
      })

      const paymentResult = await paymentResponse.json()

      if (paymentResult.success) {
        // 跳轉到 LINE Pay 付款頁面
        window.location.href = paymentResult.data.paymentUrl
      } else {
        throw new Error(paymentResult.message || 'LINE Pay 付款失敗')
      }
    } else {
      // 其他付款方式，直接跳轉到成功頁面
      cart.clearCart()
      router.push(`/order-success/${orderResult.data.orderNumber}?orderId=${orderResult.data.orderId}`)
    }

  } catch (error) {
    console.error('送出訂單失敗:', error)
    alert(error.message || '送出訂單失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/cart')
}
</script>

<style scoped>
.cart-container {
  max-width: 1280px;
  margin: 48px auto;
  padding: 40px;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.05);
  font-size: 15px;
}

.loading-box {
  text-align: center;
  padding: 48px 0;
  color: #666;
}

.spinner {
  margin: 16px auto;
  width: 40px;
  height: 40px;
  border: 4px solid #eee;
  border-top: 4px solid #860914;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.cart-header {
  display: flex;
  padding: 16px 0;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.cart-header > div {
  flex: 1;
  text-align: center;
}

.cart-header > div:first-child {
  flex: 2;
  text-align: left;
}

.cart-row {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.cart-row:hover {
  background-color: #fafafa;
}

.cart-row > div {
  flex: 1;
  text-align: center;
}

.cart-row > div:first-child {
  flex: 2;
  text-align: left;
}

.product {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  background-color: #f0f0f0;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.customer-form {
  margin: 32px 0;
  padding: 24px;
  background: #f9f9f9;
  border-radius: 8px;
}

.customer-form h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 98%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #860914;
}

.total-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 32px;
  gap: 16px;
}

.total-label {
  font-size: 19px;
}

.checkout-btn {
  background-color: #860914;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #860914;
}

.checkout-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.payment-method {
  font-size: 15px;
  margin-top: 16px;
}

.back-btn {
  background: none;
  color: #555;
  border: 1px solid #ccc;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: #f0f0f0;
}

.method-list {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.method-card {
  border: 2px solid #ccc;
  border-radius: 6px;
  padding: 16px;
  width: 150px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9f9f9;
}

.method-card img {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.method-card span {
  display: block;
  font-size: 15px;
  font-weight: 500;
}

.method-card:hover {
  border-color: #888;
}

.method-card.selected {
  border-color: #860914;
  background-color: #fff0f0;
}
</style>