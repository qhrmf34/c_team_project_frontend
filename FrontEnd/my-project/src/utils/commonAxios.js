// utils/commonAxios.js
import axios from 'axios'

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'http://localhost:8089',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 자동 로그아웃
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_info')
      
      // 현재 페이지가 인증이 필요한 페이지라면 로그인 페이지로 이동
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API 호출 메서드들
export const memberAPI = {
  // 회원가입
  async signup(signupData) {
    const response = await apiClient.post('/api/member/signup', signupData)
    return response.data
  },

  // 로그인
  async login(loginData) {
    const response = await apiClient.post('/api/member/login', loginData)
    return response.data
  },

  // 소셜 로그인 (NEW)
  async socialLogin(socialLoginData) {
    const response = await apiClient.post('/api/member/social-login', socialLoginData)
    return response.data
  },

  // 로그아웃 (NEW)
  async logout() {
    const response = await apiClient.post('/api/member/logout')
    return response.data
  },

  // 회원가입 + 결제 트랜잭션
  async signupWithPayment(signupWithPaymentData) {
    const response = await apiClient.post('/api/member/signup-with-payment', signupWithPaymentData)
    return response.data
  },

  // 프로필 조회
  async getProfile() {
    const response = await apiClient.get('/api/member/profile')
    return response.data
  },

  // 프로필 수정
  async updateProfile(profileData) {
    const response = await apiClient.put('/api/member/profile', profileData)
    return response.data
  },

  // 회원 탈퇴
  async deleteAccount() {
    const response = await apiClient.delete('/api/member/profile')
    return response.data
  },

  // ========== 비밀번호 재설정 관련 API ==========
  
  // 비밀번호 재설정 요청 (인증 코드 전송)
  async forgotPassword(email) {
    const response = await apiClient.post('/api/member/forgot-password', { email })
    return response.data
  },

  // 인증 코드 확인
  async verifyResetCode(email, verificationCode) {
    const response = await apiClient.post('/api/member/verify-reset-code', {
      email,
      verificationCode
    })
    return response.data
  },

  // 비밀번호 재설정
  async resetPassword(email, verificationCode, newPassword, confirmPassword) {
    const response = await apiClient.post('/api/member/reset-password', {
      email,
      verificationCode,
      newPassword,
      confirmPassword
    })
    return response.data
  }
}

// 기타 API들
export const hotelAPI = {
  // 무료시설 조회
  async getFreebies() {
    const response = await apiClient.get('/api/test/freebies')
    return response.data
  },

  // 무료시설 단건 조회
  async getFreebieById(id) {
    const response = await apiClient.get(`/api/test/${id}`)
    return response.data
  },

  // 무료시설 검색
  async searchFreebies(name) {
    const response = await apiClient.get('/api/test/search', {
      params: { name }
    })
    return response.data
  }
}

// 인증 관련 유틸리티
export const authUtils = {
  // 토큰 저장
  saveAuth(token, userInfo) {
    localStorage.setItem('jwt_token', token)
    localStorage.setItem('user_info', JSON.stringify(userInfo))
  },

  // 토큰 조회
  getToken() {
    return localStorage.getItem('jwt_token')
  },

  // 사용자 정보 조회
  getUserInfo() {
    const userInfo = localStorage.getItem('user_info')
    return userInfo ? JSON.parse(userInfo) : null
  },

  // 로그인 상태 확인
  isLoggedIn() {
    return !!this.getToken()
  },

  // 토큰 만료 확인
  isTokenExpired() {
    const token = this.getToken()
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  },

  // 로그아웃 (서버 API 호출 + 로컬 스토리지 정리)
  async logout() {
    try {
      // 서버에 로그아웃 요청 (토큰 블랙리스트 등록)
      await memberAPI.logout()
    } catch (error) {
      console.warn('서버 로그아웃 실패, 로컬 정보만 삭제:', error)
    } finally {
      // 로컬 스토리지에서 토큰과 사용자 정보 삭제
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_info')
    }
  }
}

export default apiClient