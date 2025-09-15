import { createRouter, createWebHistory } from 'vue-router'
import HotelOne from '../components/hotel/hotel1.vue'
import HotelTwo from '../components/hotel/hotel2.vue'

const routes = [
  { 
    path: '/hotelone', 
    name: 'HotelOne',
    component: HotelOne 
  },
  { 
    path: '/hoteltwo', 
    name: 'HotelTwo',
    component: HotelTwo 
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router