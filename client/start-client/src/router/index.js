import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/home/Home.vue'
import Events from '@/views/events/Events.vue'
import Map from '@/views/map/Map.vue'
import Member from '@/views/member/Member.vue'
import Reviews from '@/views/reviews/Reviews.vue'
import Subscription from '@/views/sub/Subscription.vue'
import Cart from '@/views/cart/Cart.vue'
import Payment from '@/views/cart/Payment.vue'

const routes = [
  { path: '/home', name: 'Home', component: Home },
  { path: '/events', name: 'Events', component: Events },
  { path: '/map', name: 'Map', component: Map },
  { path: '/member', name: 'Member', component: Member },
  { path: '/reviews', name: 'Reviews', component: Reviews },
  { path: '/subscription', name: 'Subscription', component: Subscription },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/payment', name: 'Payment', component: Payment },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
