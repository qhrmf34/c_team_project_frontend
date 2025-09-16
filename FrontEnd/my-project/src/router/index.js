import { createRouter, createWebHistory } from 'vue-router'
import HotelOne from '../components/hotel/hotel1.vue'
import HotelTest from '../components/hotel/hoteltest.vue'


const routes = [
  { 
    path: '/hotelone', 
    name: 'HotelOne',
    component: HotelOne 
  },
  { 
    path: '/hoteltest', 
    name: 'HotelTest',
    component: HotelTest 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router