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
  { path: '/', name: 'Home', component: HotelMaster, meta: { title: '개발용' } },
  { path: '/hoteltest', name: 'HotelTest', component: HotelTest, meta: { title: '테스트' } },
  { path: '/hotelone', name: 'HotelOne', component: HotelOne, meta: { title: '메인' } },
  { path: '/hoteltwo', name: 'HotelTwo', component: HotelTwo, meta: { title: '호텔' } },
  { path: '/hotelthree', name: 'HotelThree', component: HotelThree, meta: { title: '객실' } },
  { path: '/hotelfour', name: 'HotelFour', component: HotelFour, meta: { title: '결제' } },
  { path: '/hotelfive', name: 'HotelFive', component: HotelFive, meta: { title: '티켓' } },
  { path: '/hotelsix', name: 'HotelSix', component: HotelSix, meta: { title: '찜목록' } },
  { path: '/hotelaccount', name: 'HotelAccount', component: HotelAccount, meta: { title: '계정' } },
  { path: '/login', name: 'HotelLogin', component: HotelLogin, meta: { title: '로그인' } },
  { path: '/signup', name: 'HotelSignup', component: HotelSignup, meta: { title: '회원가입' } },
  { path: '/auth/callback', name: 'AuthCallback', component: AuthCallback, meta: { title: '로딩' } },
  { path: '/admin', name: 'HotelAdmin', component: HotelAdmin, meta: { title: '관리자 페이지' } },
  { path: '/payment/success', name: 'PaymentSuccess', component: PaymentSuccess, meta: { title: '결제 성공' } },
  { path: '/payment/fail', name: 'PaymentFail', component: PaymentFail, meta: { title: '결제 실패' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 토큰 검증 함수
async function checkTokenValidity(token) {
  try {
    const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:8089/'
    const response = await fetch(`${apiUrl}api/member/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.ok
  } catch (error) {
    return false
  }
}

// localStorage 정리 함수
function clearAuth() {
  localStorage.removeItem('jwt_token')
}

// beforeEach: await 없이 즉시 next() 호출
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '호텔'
  
  const token = localStorage.getItem('jwt_token')
  
  // 페이지간 이동 또는 또는 외부에서 들어와서 사용할떄도 로컬 스토리지를 초기화함. 어떻게 할지 생각해봐야할듯.
  // 토큰이 있으면 백그라운드에서 검증 (페이지 이동 차단 안 함)
  if (token) {
    checkTokenValidity(token).then(isValid => {
      if (!isValid) {
        clearAuth()
      }
    })
  }
  
  // await 없이 바로 next() 호출
  next()
})

export default router