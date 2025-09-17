import { createRouter, createWebHistory } from 'vue-router'
import HotelOne from '../components/hotel/hotel1.vue'
import HotelTwo from '../components/hotel/hotel2.vue'
import HotelThree from '../components/hotel/hotel3.vue'
import HotelFour from '../components/hotel/hotel4.vue'
import HotelFive from '../components/hotel/hotel5.vue'
import HotelSix from '../components/hotel/hotel6.vue'
import HotelAccount from '../components/hotel_account/hotel_account.vue'
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
  },
    { 
    path: '/hotelthree', 
    name: 'HotelThree',
    component: HotelThree 
  },
    { 
    path: '/hotelfour', 
    name: 'HotelFour',
    component: HotelFour 
  },
    { 
    path: '/hotelfive', 
    name: 'HotelFive',
    component: HotelFive 
  },
    { 
    path: '/hotelsix', 
    name: 'HotelSix',
    component: HotelSix 
  },
    { 
    path: '/hotelaccount', 
    name: 'HotelAccount',
    component: HotelAccount 
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router