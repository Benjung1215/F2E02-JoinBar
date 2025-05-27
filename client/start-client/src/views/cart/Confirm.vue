<template>
  <div class="confirm-wrapper">
    <div class="confirm-card">
      <h2 class="title">請確認您的訂單</h2>

      <!-- 商品清單 -->
      <div class="item-list">
        <div v-for="item in cartItems" :key="item.id" class="item-row">
          <div class="item-info">
            <img :src="item.image || 'https://placehold.co/60x60'" class="thumb" />
            <div>
              <p class="name">{{ item.name }}</p>
              <p class="qty">x {{ item.quantity }}</p>
            </div>
          </div>
          <div class="item-total">${{ calcSubtotal(item) }}</div>
        </div>
      </div>

      <!-- 訂單摘要 -->
      <div class="summary">
        <div class="summary-line">
          <span>付款方式</span>
          <strong>{{ paymentMethod }}</strong>
        </div>
        <div class="summary-line total">
          <span>總金額</span>
          <strong>${{ totalPrice }}</strong>
        </div>
      </div>

      <!-- 操作按鈕 -->
      <div class="btn-group">
        <button class="btn-outline" @click="router.back()">返回修改</button>
        <button class="btn-primary">送出訂單</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const cart = useCartStore()
const router = useRouter()
const route = useRoute()

const cartItems = computed(() => cart.items)

const paymentMethod = computed(() => {
  if (cart.paymentMethod === 'creditcard') return '信用卡'
  if (cart.paymentMethod === 'linepay') return 'LINE Pay'
  return '未選擇'
})

const calcSubtotal = (item) => (item.price * item.quantity).toFixed(0)

const totalPrice = computed(() =>
  cartItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
)
</script>

<style scoped>
.confirm-wrapper {
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
  background: #f5f5f5;
  min-height: 100vh;
}

.confirm-card {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #333;
}

.item-list {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin: 1rem 0;
  padding: 0.5rem 0;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f1f1;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  background: #eee;
}

.name {
  font-weight: 500;
  margin: 0 0 4px;
}

.qty {
  font-size: 14px;
  color: #666;
}

.item-total {
  font-weight: 600;
  font-size: 16px;
}

.summary {
  margin-top: 1rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  font-size: 15px;
}

.summary-line.total {
  font-size: 1.2rem;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background: #f44;
  color: white;
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-outline:hover {
  background: #f0f0f0;
}

.btn-primary:hover {
  background: #d32f2f;
}
</style>
