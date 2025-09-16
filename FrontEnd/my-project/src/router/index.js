import { createRouter, createWebHistory } from 'vue-router'
import HotelOne from '../components/hotel/hotel1.vue'
import HotelTwo from '../components/hotel/hotel2.vue'
import HotelTest from '../components/hotel/hoteltest.vue'


const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HotelOne 
  },
  { 
    path: '/hoteltest', 
    name: 'HotelTest',
    component: HotelTest 
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