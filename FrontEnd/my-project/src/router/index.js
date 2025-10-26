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
    component: PaymentSuccess,
    meta: { title: '결제 성공' }
  },
  {
    path: '/payment/fail',
    name: 'PaymentFail',
    component: PaymentFail,
    meta: { title: '결제 실패' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 토큰 검증 캐시 (중복 호출 방지)
let tokenValidationPromise = null

async function validateToken(token) {
  // 이미 검증 중이면 같은 Promise 재사용
  if (tokenValidationPromise) {
    return tokenValidationPromise
  }

  tokenValidationPromise = (async () => {
    try {
      const response = await fetch(`${process.env.VUE_APP_API_URL}api/member/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const isValid = response.ok
      
      // 검증 완료 후 캐시 초기화
      setTimeout(() => {
        tokenValidationPromise = null
      }, 1000)
      
      return isValid
    } catch (error) {
      console.error('토큰 검증 실패:', error)
      tokenValidationPromise = null
      return false
    }
  })()

  return tokenValidationPromise
}

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || '호텔'
  
  const token = localStorage.getItem('token')
  const publicPages = ['/login', '/signup', '/auth/callback', '/payment/success', '/payment/fail']
  const authRequired = !publicPages.includes(to.path)
  
  // 토큰이 있고 인증이 필요한 페이지라면 검증
  if (token && authRequired) {
    const isValid = await validateToken(token)
    
    if (!isValid) {
      console.log('토큰이 유효하지 않아 로그아웃 처리합니다.')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      return next('/login')
    }
  }
  
  // 로그인 페이지인데 이미 유효한 토큰이 있다면 메인으로
  if (to.path === '/login' && token) {
    const isValid = await validateToken(token)
    if (isValid) {
      return next('/hotelone')
    }
  }
  
  next()
})

export default router