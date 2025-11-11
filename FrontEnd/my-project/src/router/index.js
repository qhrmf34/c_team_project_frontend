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
import HotelAdmin from '../components/admin/admin.vue'
import PaymentSuccess from '../components/hotel/PaymentSuccess.vue'
import PaymentFail from '../components/hotel/PaymentFail.vue'


const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HotelMaster, 
    meta: { title: '개발용' }
  },
   { 
    path: '/hoteltest', 
    name: 'HotelTest',
    component: HotelTest, 
    meta: { title: '테스트' } 
  },
  { 
    path: '/hotelone', 
    name: 'HotelOne',
    component: HotelOne,
    meta: { title: '메인' }
  },
    { 
    path: '/hoteltwo', 
    name: 'HotelTwo',
    component: HotelTwo, 
    meta: { title: '호텔' } 
  },
    { 
    path: '/hotelthree', 
    name: 'HotelThree',
    component: HotelThree, 
    meta: { title: '객실' } 
  },
    { 
    path: '/hotelfour', 
    name: 'HotelFour',
    component: HotelFour, 
    meta: { title: '결제' } 
  },
    { 
    path: '/hotelfive', 
    name: 'HotelFive',
    component: HotelFive, 
    meta: { title: '티켓' } 
  },
    { 
    path: '/hotelsix', 
    name: 'HotelSix',
    component: HotelSix, 
    meta: { title: '찜목록' } 
  },
    { 
    path: '/hotelaccount', 
    name: 'HotelAccount',
    component: HotelAccount, 
    meta: { title: '계정' } 
  },
    { 
    path: '/login', 
    name: 'HotelLogin',
    component: HotelLogin, 
    meta: { title: '로그인' } 
  },
    { 
    path: '/signup', 
    name: 'HotelSignup',
    component: HotelSignup, 
    meta: { title: '회원가입' }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback, 
    meta: { title: '로딩' }
  },
  {
    path: '/admin',
    name: 'HotelAdmin',
    component: HotelAdmin, 
    meta: { title: '관리자 페이지' }
  },
    {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  },
  {
    path: '/payment/fail',
    name: 'PaymentFail',
    component: PaymentFail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '호텔';
  next();
});
export default router
