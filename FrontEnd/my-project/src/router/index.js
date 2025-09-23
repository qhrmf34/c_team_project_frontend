import { createRouter, createWebHistory } from 'vue-router'
import HotelOne from '../components/hotel/hotel1.vue'
import HotelTwo from '../components/hotel/hotel2.vue'
import HotelThree from '../components/hotel/hotel3.vue'
import HotelFour from '../components/hotel/hotel4.vue'
import HotelFive from '../components/hotel/hotel5.vue'
import HotelSix from '../components/hotel/hotel6.vue'
import HotelAccount from '../components/hotel_account/hotel_account.vue'
import HotelLogin from '../components/login/login.vue'
import HotelSignup from '../components/login/signup.vue'
import HotelMaster from '../components/hotelmaster.vue'
import HotelTest from '../components/hotel/hoteltest.vue'
import AuthCallback from '../components/login/AuthCallback.vue'


const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HotelMaster 
  },
   { 
    path: '/hoteltest', 
    name: 'HotelTest',
    component: HotelTest 
  },
  { 
    path: '/hotelone', 
    name: 'HotelOne',
    component: HotelOne 
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
  },
    { 
    path: '/login', 
    name: 'HotelLogin',
    component: HotelLogin 
  },
    { 
    path: '/signup', 
    name: 'HotelSignup',
    component: HotelSignup
  },{
  path: '/auth/callback',
  name: 'AuthCallback',
  component: AuthCallback
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router