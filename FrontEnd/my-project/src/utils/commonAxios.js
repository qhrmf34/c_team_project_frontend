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

// 회원 API
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

  // 로그아웃
  async logout() {
    const response = await apiClient.post('/api/member/logout')
    return response.data
  },

  // 프로필 조회
  async getProfile() {
    const response = await apiClient.get('/api/member/profile')
    return response.data
  },

  // 프로필 수정
  async updateProfile(profileData) {
    const response = await apiClient.post('/api/member/profile', profileData)
    return response.data
  },

  // 회원 탈퇴
  async deleteAccount() {
    const response = await apiClient.delete('/api/member/profile')
    return response.data
  },

  // 비밀번호 재설정 요청
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
  },

  // 비밀번호 맞는지 검사 
  async accountForgot(password){
    const response = await apiClient.post('/api/member/match-password', {
      password
    })
    return response.data
  },

  // 비밀번호 재설정
  async accountPasswordReset(newPassword, confirmPassword){
    const response = await apiClient.post('/api/member/account-reset-password', {
      newPassword,
      confirmPassword
    })
    return response.data
  }
}

//결제수단 API
  export const paymentMethodAPI = {
  // 결제수단 등록 (토스 빌링키 발급)
  async registerPaymentMethod(cardData) {
    const response = await apiClient.post('/api/payment-methods/register', cardData)
    return response.data
  },

  // 내 결제수단 목록 조회
  async getMyPaymentMethods() {
    const response = await apiClient.get('/api/payment-methods/my')
    return response.data
  },

  // 결제수단 단건 조회
  async getPaymentMethod(id) {
    const response = await apiClient.get(`/api/payment-methods/${id}`)
    return response.data
  },

  // 결제수단 삭제
  async deletePaymentMethod(id) {
    const response = await apiClient.delete(`/api/payment-methods/${id}`)
    return response.data
  },

  // 카드 정보 유효성 검증 - 수정됨
  validateCardInfo(cardInfo) {
    const errors = []
    
    // 카드 번호 검증 (16자리 숫자)
    if (!cardInfo.cardNumber || !/^\d{16}$/.test(cardInfo.cardNumber.replace(/\s/g, ''))) {
      errors.push('카드번호는 16자리 숫자여야 합니다')
    }
    
    // 만료일 검증 (MM/YY 형식)
    if (!cardInfo.expiry || !/^\d{2}\/\d{2}$/.test(cardInfo.expiry)) {
      errors.push('만료일은 MM/YY 형식이어야 합니다')
    } else {
      const [month, year] = cardInfo.expiry.split('/')
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.push('올바른 월을 입력해주세요 (01-12)')
      }
      
      if (parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.push('만료일이 이미 지났습니다')
      }
    }
    
    // 카드 비밀번호 검증 (2자리 숫자) - 파라미터명 변경
    if (!cardInfo.cardPassword || !/^\d{2}$/.test(cardInfo.cardPassword)) {
      errors.push('카드 비밀번호는 2자리 숫자여야 합니다')
    }
    
    // 카드 소유자명 검증
    if (!cardInfo.name || cardInfo.name.trim().length < 2) {
      errors.push('카드 소유자명을 입력해주세요')
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    }
  },

  // 카드 번호 포맷팅 (4자리씩 공백으로 구분)
  formatCardNumber(cardNumber) {
    return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  },

  // 만료일 포맷팅 (MM/YY)
  formatExpiryDate(expiry) {
    const digitsOnly = expiry.replace(/\D/g, '')
    if (digitsOnly.length >= 2) {
      return digitsOnly.substring(0, 2) + '/' + digitsOnly.substring(2, 4)
    }
    return digitsOnly
  },

  // 카드 타입에 따른 이미지 반환 - 새로 추가
  getCardTypeImage(cardType) {
    const cardImages = {
      'VISA': '/images/hotel_account_img/visa.jpg',
      'MasterCard': '/images/hotel_account_img/mastercard.jpg',
      'AMEX': '/images/hotel_account_img/amex.jpg',
      'JCB': '/images/hotel_account_img/hotel_account_jcb.jpg',
      'DinersClub': '/images/hotel_account_img/dinersclub.jpg'
    };
    return cardImages[cardType] || '/images/hotel_account_img/hotel_account_visa.jpg';
  },

  // 카드사명을 한국어로 변환 - 새로 추가
  getKoreanCardCompany(cardCompany) {
    if (!cardCompany) return '카드사';
    
    const companyNames = {
      'KB': 'KB국민카드',
      'SAMSUNG': '삼성카드',
      'HYUNDAI': '현대카드',
      'LOTTE': '롯데카드',
      'HANA': '하나카드',
      'SHINHAN': '신한카드',
      'WOORI': '우리카드',
      'NH': 'NH농협카드',
      'CITI': '씨티카드',
      'KBANK': '케이뱅크카드',
      // 토스에서 반환하는 영어 카드사명들
      'KOOKMIN': 'KB국민카드',
      'SAMSUNG_CARD': '삼성카드',
      'HYUNDAI_CARD': '현대카드',
      'LOTTE_CARD': '롯데카드',
      'HANA_CARD': '하나카드',
      'SHINHAN_CARD': '신한카드',
      'WOORI_CARD': '우리카드',
      'NH_CARD': 'NH농협카드',
      'CITI_CARD': '씨티카드',
      'KAKAO_BANK': '카카오뱅크카드',
      'K_BANK': '케이뱅크카드'
    };
    return companyNames[cardCompany.toUpperCase()] || cardCompany;
  }
}

// 호텔 API
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
  },
    // 추천 도시 목록 조회
  async getFeaturedCities(limit = 4) {
    const response = await apiClient.get('/api/admin/cities/featured', {
      params: { limit }
    })
    return response.data
  }
}

// 관리자 API
export const adminAPI = {
  // 기본 CRUD 메서드 (getList가 검색 기능 통합)
  async getList(tableName, params = {}) {
    const response = await apiClient.get(`/api/admin/${tableName}`, { params })
    return response.data
  },

  async getById(tableName, id) {
    const response = await apiClient.get(`/api/admin/${tableName}/${id}`)
    return response.data
  },

  async insert(tableName, data) {
    const response = await apiClient.post(`/api/admin/${tableName}`, data)
    return response.data
  },

  async update(tableName, id, data) {
    const response = await apiClient.put(`/api/admin/${tableName}/${id}`, data)
    return response.data
  },

  async delete(tableName, id) {
    const response = await apiClient.delete(`/api/admin/${tableName}/${id}`)
    return response.data
  },

  // searchByName 메서드 제거됨 (getList로 통합)

  // 파일 업로드 (폴더별)
  async uploadFile(formData, folder = 'general') {
    // FormData에 folder 정보 추가
    if (folder !== 'general') {
      formData.append('folder', folder)
    }
    
    const response = await apiClient.post('/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // 폴더별 파일 업로드 편의 메서드
  async uploadCityImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return this.uploadFile(formData, 'city')
  },

  async uploadHotelImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return this.uploadFile(formData, 'hotel')
  },

  async uploadRoomImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return this.uploadFile(formData, 'room')
  },

  // 유틸리티 메서드 (기존과 동일)
  getImageUrl(imagePath) {
    if (!imagePath) return ''
    if (imagePath.startsWith('http')) return imagePath
    return `${apiClient.defaults.baseURL}/uploads${imagePath}`
  },
  
  formatDate(dateString) {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('ko-KR')
  },
  
  formatNumber(number) {
    if (!number) return '0'
    return new Intl.NumberFormat('ko-KR').format(number)
  },

  // 파일 크기 포맷
  formatFileSize(bytes) {
    if (!bytes) return '0 B'
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // 이미지 미리보기 URL 생성
  createPreviewUrl(file) {
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }
    return null
  },

  // 이미지 파일 검증
  validateImageFile: function (file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('JPG, PNG, GIF 파일만 업로드 가능합니다.')
    }

    if (file.size > maxSize) {
      throw new Error('파일 크기는 5MB 이하만 가능합니다.')
    }

    return true
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

  // 로그아웃
  async logout() {
    try {
      await memberAPI.logout()
    } catch (error) {
      console.warn('서버 로그아웃 실패, 로컬 정보만 삭제:', error)
    } finally {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_info')
    }
  }
}

export default apiClient