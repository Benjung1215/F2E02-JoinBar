<!-- src/views/Payment.vue -->
<template>
  <div class="cart-container">
    <h2>付款資訊</h2>

    <!-- 商品摘要 -->
    <div class="cart-header">
      <div>商品</div>
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

    <!-- 付款方式 -->
    <div class="payment-method mt-4">
      <h3>選擇付款方式</h3>
      <label>
        <input type="radio" value="linepay" v-model="paymentMethod" />
        Line Pay
      </label>
      <label class="ms-4">
        <input type="radio" value="creditcard" v-model="paymentMethod" />
        信用卡
      </label>
    </div>

    <!-- 總金額與提交 -->
    <div class="total-bar mt-4">
      <p class="total-label">總金額：<strong>${{ totalPrice }}</strong></p>
      <button class="checkout-btn" @click="submitOrder">確認付款</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { computed, ref, onMounted } from 'vue'

const cart = useCartStore()
const paymentMethod = ref('linepay')

onMounted(() => {
  cart.loadFromStorage()
})

const cartItems = computed(() => cart.items)

const calcSubtotal = (item) => (item.price * item.quantity).toFixed(0)

const totalPrice = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0),
)

const submitOrder = () => {
  if (!paymentMethod.value) return alert('請選擇付款方式')
  // TODO: 將付款方式存入 store，再導向 Confirm 頁面
  alert(`選擇付款方式：${paymentMethod.value}，總金額：${totalPrice.value}`)
}
</script>

<style scoped>
.cart-container {
  max-width: 1280px;
  margin: 3rem auto;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.05);
  font-size: 15px;
}

.loading-box {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.spinner {
  margin: 1rem auto;
  width: 40px;
  height: 40px;
  border: 4px solid #eee;
  border-top: 4px solid #f44;
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
  padding: 1rem 0;
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
  padding: 1rem 0;
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
  gap: 1rem;
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

.qty-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.qty-box button {
  width: 32px;
  height: 32px;
  border: 1px solid #bbb;
  border-radius: 4px;
  background-color: white;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.qty-box button:hover {
  background-color: #eee;
}

.qty-box span {
  width: 36px;
  text-align: center;
  font-weight: 500;
}

.actions button {
  border: 1px solid #dc3545;
  color: #dc3545;
  background: white;
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.actions button:hover {
  background-color: #dc3545;
  color: white;
}

.total-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
}

.total-label {
  font-size: 1.2rem;
}

.checkout-btn {
  background-color: #f44;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background-color: #d32f2f;
}

.payment-method {
  font-size: 15px;
}

.payment-method label {
  display: inline-block;
  margin-top: 0.5rem;
  cursor: pointer;
}
</style>
