// src/utils/authMixin.js
import { memberAPI, authUtils } from './commonAxios'

export const authMixin = {
  data() {
    return {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
  },
  
  created() {
    this.checkAuth()
  },
  
  methods: {
    // 인증 상태 확인
    checkAuth() {
      const token = authUtils.getToken()
      const userInfo = authUtils.getUserInfo()
      
      if (token && !authUtils.isTokenExpired() && userInfo) {
        this.isAuthenticated = true
        this.currentUser = userInfo
        return true
      } else {
        this.logout()
        return false
      }
    },
    
    // 로그인 처리
    async login(loginData) {
      this.isLoading = true
      try {
        const result = await memberAPI.login(loginData)
        
        if (result.data && result.data.token) {
          authUtils.saveAuth(result.data.token, {
            id: result.data.memberId,
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            provider: result.data.provider
          })
          
          this.checkAuth()
          return { success: true, data: result.data }
        }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || '로그인 중 오류가 발생했습니다.' 
        }
      } finally {
        this.isLoading = false
      }
    },
    
    // 회원가입 처리
    async signup(signupData) {
      this.isLoading = true
      try {
        const result = await memberAPI.signup(signupData)
        
        if (result.data && result.data.token) {
          authUtils.saveAuth(result.data.token, {
            id: result.data.memberId,
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            provider: result.data.provider
          })
          
          this.checkAuth()
          return { success: true, data: result.data }
        }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || '회원가입 중 오류가 발생했습니다.' 
        }
      } finally {
        this.isLoading = false
      }
    },
    
    // 회원가입 + 결제 트랜잭션
    async signupWithPayment(signupWithPaymentData) {
      this.isLoading = true
      try {
        const result = await memberAPI.signupWithPayment(signupWithPaymentData)
        
        if (result.data && result.data.token) {
          authUtils.saveAuth(result.data.token, {
            id: result.data.memberId,
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            provider: result.data.provider
          })
          
          this.checkAuth()
          return { success: true, data: result.data }
        }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || '처리 중 오류가 발생했습니다.' 
        }
      } finally {
        this.isLoading = false
      }
    },
    
    // 프로필 조회
    async getProfile() {
      try {
        const result = await memberAPI.getProfile()
        return { success: true, data: result.data }
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || '프로필 조회 중 오류가 발생했습니다.' 
        }
      }
    },
    
    // 로그아웃 (서버 API 호출 + 상태 업데이트)
    async logout() {
      try {
        // 서버에 로그아웃 요청 (토큰 블랙리스트 등록)
        await authUtils.logout()
      } catch (error) {
        console.warn('서버 로그아웃 중 오류:', error)
      } finally {
        // 상태 업데이트
        this.currentUser = null
        this.isAuthenticated = false
      }
    },
    
    // 인증 필요 페이지 체크
    requireAuth() {
      if (!this.checkAuth()) {
        alert('로그인이 필요한 서비스입니다.')
        this.$router.push('/login')
        return false
      }
      return true
    },
    
    // 페이지 이동 헬퍼 메서드들
    goToLogin() {
      this.$router.push('/login')
    },
    
    goToSignup() {
      this.$router.push('/signup')
    },
    
    goToHome() {
      this.$router.push('/')
    },
    
    goToHotel(hotelName) {
      this.$router.push(`/hotel${hotelName}`)
    },
    
    goToAccount() {
      this.$router.push('/hotelaccount')
    }
  }
}