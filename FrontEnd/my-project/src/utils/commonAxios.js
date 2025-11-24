// utils/commonAxios.js
import axios from 'axios'

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: 'https://mjc813k.softagape.com',
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
    // ✅ 네트워크 에러면 토큰 삭제 안 함
    if (!error.response) {
      console.error('백엔드 연결 실패')
      return Promise.reject(error)
    }
    
    if (error.response?.status === 401) {
      const token = authUtils.getToken()
      
      // ✅ 토큰 유효하면 삭제 안 함
      if (token && !authUtils.isTokenExpired()) {
        console.warn('401 에러지만 토큰 유효 - 백엔드 재시작 가능성')
        return Promise.reject(error)
      }
      
      // 진짜 만료된 경우만 삭제
      authUtils.clearAuth()
      
      if (window.location.pathname !== '/login' && 
          window.location.pathname !== '/signup') {
        alert('로그인이 만료되었습니다.')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)
// 인증 데이터 삭제 헬퍼 함수
function clearAuthData() {
  localStorage.removeItem('jwt_token')
  // 세션 스토리지도 함께 정리
  sessionStorage.clear()
}

// 회원 API
export const memberAPI = {
  // 회원가입
  async signup(signupData) {
    const response = await apiClient.post('/api/member/signup', signupData)
    return response.data
  },
  // 회원 탈퇴
  async withdrawMember(requestData) {
    const response = await apiClient.post('/api/member/withdraw', requestData)
    return response.data
  },
  // 로그인
  async login(loginData) {
    const response = await apiClient.post('/api/member/login', loginData)
    return response.data
  },

  // 사용자 정보 조회 
  async getUserInfo() {
    const response = await apiClient.get('/api/member/info')
    return response.data
  },

  // 로그아웃
  async logout() {
    try {
      // 서버에 로그아웃 요청
      const response = await apiClient.post('/api/member/logout')
      return response.data
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error)
      // API 호출 실패해도 클라이언트 데이터는 삭제
      throw error
    } finally {
      // 성공/실패 여부와 관계없이 항상 클라이언트 데이터 삭제
      clearAuthData()
    }
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
    try {
      const response = await apiClient.delete('/api/member/profile')
      return response.data
    } finally {
      // 탈퇴 성공 시에도 클라이언트 데이터 삭제
      clearAuthData()
    }
  },

  // 비밀번호 재설정 요청
  async forgotPassword(email) {
    const response = await apiClient.post('/api/member/forgot-password', { email })
    return response.data
  },

  async completeSocialSignup(data, token) {
    const response = await apiClient.post('/api/member/complete-social-signup', data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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

// 회원 이미지 API
export const memberImageAPI = {
  // 프로필 이미지 조회
  async getProfileImage() {
    const response = await apiClient.get('/api/member/images/profile')
    return response.data
  },
  // 특정 회원 프로필 이미지 조회 (관리자용)
  async getProfileImageByMemberId(memberId) {
    const response = await apiClient.get(`/api/member/images/profile/member/${memberId}`)
    return response.data
  },
  // 배경 이미지 조회
  async getBackgroundImage() {
    const response = await apiClient.get('/api/member/images/background')
    return response.data
  },

  // 프로필 이미지 업로드
  async uploadProfileImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/member/images/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // 배경 이미지 업로드
  async uploadBackgroundImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/member/images/background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

// 결제수단 API
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

  // 카드 정보 유효성 검증
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
    
    // 카드 비밀번호 검증 (2자리 숫자)
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

  // 카드 타입에 따른 이미지 반환
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

  // 카드사명을 한국어로 변환
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
// 예약 API
export const reservationAPI = {
  /**
   * 내 예약 목록 조회 (페이지네이션 지원)
   */
  async getMyReservations(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset);
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/reservations/my?${queryString}` : '/api/reservations/my';
    
    const response = await apiClient.get(url);
    return response.data;
  },
    /**
   * 내 결제 내역 조회 (HotelAccount용 )
   */
  async getMyReservationHistory(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset);
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/reservations/history?${queryString}` : '/api/reservations/history';
    
    const response = await apiClient.get(url);
    return response.data;
  }
}
// 결제 API 추가
export const paymentAPI = {
  /**
   * 결제 처리
   */
  async processPayment(paymentData) {
    const response = await apiClient.post('/api/payments/process', paymentData);
    return response.data;
  },
    /**
   * ✅ 전액 환불
   */
  async refundPayment(paymentId, refundData) {
    const response = await apiClient.post(`/api/payments/${paymentId}/refund`, refundData);
    return response.data;
  },

    /**
   * ✅ 부분 환불
   */
  async refundPaymentPartial(paymentId, refundData) {
    const response = await apiClient.post(`/api/payments/${paymentId}/refund-partial`, refundData);
    return response.data;
  },
    /**
   * ✅ 환불 사유 옵션 조회 - 새로 추가
   */
  async getRefundReasonOptions() {
    const response = await apiClient.get('/api/refund-reasons/options');
    return response.data;
  },

  /**
   * ✅ 특정 결제의 환불 사유 조회 - 새로 추가
   */
  async getRefundReasons(paymentId) {
    const response = await apiClient.get(`/api/refund-reasons/payment/${paymentId}/all`);
    return response.data;
  },
  
  /**
   * ✅ 내 결제 내역 조회
   */
  async getMyPayments() {
    const response = await apiClient.get('/api/payments/my');
    return response.data;
  },
    /**
   * 결제위젯 승인
   */
  async confirmPayment(confirmData) {
    console.log('결제 승인 요청:', confirmData);
    const response = await apiClient.post('/api/payments/confirm', confirmData);
    return response.data;
  },
  /**
   * 예약 생성
   */
  async createReservation(reservationData) {
    console.log('=== paymentAPI.createReservation 호출 ===');
    console.log('전송 데이터 (stringify):', JSON.stringify(reservationData, null, 2));
    console.log('전송 데이터 (원본):', reservationData);
    
    // 각 필드 타입 확인
    console.log('타입 체크:');
    for (const [key, value] of Object.entries(reservationData)) {
      console.log(`  ${key}: ${value} (${typeof value})`);
    }
    
    try {
      const response = await apiClient.post('/api/reservations', reservationData);
      console.log('응답 성공:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== API 호출 실패 ===');
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('Headers:', error.response.headers);
        
        // 백엔드 에러 메시지 파싱
        if (error.response.data) {
          console.error('상세 에러:', JSON.stringify(error.response.data, null, 2));
        }
      }
      
      throw error;
    }
  }
}
// 호텔 API
export const hotelAPI = {
  // 무료시설 조회
  async getFreebies() {
    const response = await apiClient.get('/api/test/freebies')
    return response.data
  },
  
  // 객실 이미지 조회
  async getRoomImages(roomId) {
    const response = await apiClient.get(`/api/public/rooms/${roomId}/images`);
    return response.data;
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
  },
    /**
   * 객실 날짜별 가격 상세 조회
   */
  async getRoomDailyPrices(roomId, checkIn, checkOut) {
    const response = await apiClient.get(`/api/admin/rooms/${roomId}/daily-prices`, {
      params: { checkIn, checkOut }
    });
    return response.data;
  },
  
  /**
   * 객실 상세 정보 조회
   */
  async getRoomDetail(roomId) {
    console.log('🔍 API 호출: getRoomDetail', roomId); // 디버깅용
    const response = await apiClient.get(`/api/admin/rooms/${roomId}/detail`);
    console.log('📦 API 응답:', response.data); // 디버깅용
    return response.data;
  },
  // 호텔 검색
  async searchHotels(params) {
    const response = await apiClient.get('/api/hotels', { params })
    return response.data
  },
  
  // 필터 옵션 조회
  async getFilterOptions() {
    const response = await apiClient.get('/api/hotels/filters')
    return response.data
  },
  
  // 호텔 상세 조회
  async getHotelDetail(id, params) {
    const response = await apiClient.get(`/api/hotels/${id}`, { params })
    return response.data
  },
  
  // 호텔 리뷰 조회
  async getHotelReviews(hotelId, sortBy = null, reviewCard = null) {
    const params = {};
    if (sortBy) params.sortBy = sortBy;
    if (reviewCard) params.reviewCard = reviewCard;
    
    const response = await apiClient.get(`/api/reviews/hotel/${hotelId}/filter`, { params });
    return response.data;
  },
  
  // 리뷰 통계 조회
  async getReviewStats(hotelId) {
    const response = await apiClient.get(`/api/reviews/hotel/${hotelId}/stats`);
    return response.data;
  },

  // 호텔 평점 통계 조회 (평균 평점, 리뷰 개수)
  async getHotelRatingStats(hotelId) {
    const response = await apiClient.get(`/api/reviews/hotel/${hotelId}/rating-stats`);
    return response.data;
  },
  
  
  // 객실 재고 조회 (날짜별)
  async getRoomAvailability(params) {
    const response = await apiClient.get('/api/admin/rooms/availability', { params });
    return response.data;
  },


  /**
   * 리뷰 작성 가능 여부 체크
   * GET /api/reviews/eligibility?hotelId=1
   */
  async checkReviewEligibility(hotelId) {
    const response = await apiClient.get('/api/reviews/eligibility', {
      params: { hotelId }
    });
    return response.data;
  },

  /**
   * 내 리뷰 조회
   * GET /api/reviews/my-review?hotelId=1
   */
  async getMyReview(hotelId) {
    const response = await apiClient.get('/api/reviews/my-review', {
      params: { hotelId }
    });
    return response.data;
  },

  /**
   * 리뷰 작성
   * POST /api/reviews
   */
  async createReview(reviewData) {
    const response = await apiClient.post('/api/reviews', reviewData);
    return response.data;
  },

  /**
   * 리뷰 수정
   * PUT /api/reviews/{reviewId}
   */
  async updateReview(reviewId, reviewData) {
    const response = await apiClient.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  /**
   * 리뷰 삭제
   * DELETE /api/reviews/{reviewId}
   */
  async deleteReview(reviewId) {
    const response = await apiClient.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },
  
  /**
   * 리뷰 신고 (본인 리뷰 체크 포함)
   * POST /api/reports
   */
  async reportReview(reportData) {
    const response = await apiClient.post('/api/reports', reportData);
    return response.data;
  },
  
  // ========== 찜하기 관련 ==========
  
  // 찜 목록 조회 (WishlistHotelDto 사용)
  async getWishlistHotels(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset);
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size);
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/api/carts/wishlist?${queryString}` : '/api/carts/wishlist';
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // 전체 찜한 호텔 조회 (페이지네이션 없음)
  async getAllWishlistHotels() {
    const response = await apiClient.get('/api/carts/all');
    return response.data;
  },
  
  // 찜하기 토글
  async toggleWishlist(hotelId) {
    const response = await apiClient.post('/api/carts/toggle', { hotelId: hotelId });
    return response.data;
  },
  
  // 찜 상태 확인 
  async checkWishlist(hotelId) {
    const response = await apiClient.get(`/api/carts/check/${hotelId}`);
    return response.data;
  }
}
// 회원 쿠폰 API
export const memberCouponAPI = {
  // 구독 쿠폰 지급
  async subscribeAndReceiveCoupons() {
    const response = await apiClient.post('/api/member-coupons/subscribe')
    return response.data
  },

  // 내 쿠폰 목록 조회
  async getMyCoupons() {
    const response = await apiClient.get('/api/member-coupons/my')
    return response.data
  },

  
  // 쿠폰 사용
  async useCoupon(couponId) {
    const response = await apiClient.post(`/api/member-coupons/${couponId}/use`)
    return response.data
  }
}
// 티켓 API 
export const ticketAPI = {
  /**
   * 결제 ID로 티켓 조회
   */
  async getTicketByPaymentId(paymentId) {
    const response = await apiClient.get(`/api/tickets/payment/${paymentId}`);
    return response.data;
  },
    /**
   * 티켓 이미지 업로드
   */
  async uploadTicketImage(ticketId, formData) {
    const response = await apiClient.post(
      `/api/tickets/${ticketId}/upload-image`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
}
// 채팅 API
export const chatAPI = {
  /**
   * 채팅방 생성 또는 가져오기
   */
  async getOrCreateRoom(customerId, customerName) {
    const response = await apiClient.post('/api/chat/room', null, {
      params: { customerId, customerName }
    });
    return response.data;
  },

  /**
   * 채팅 메시지 조회
   */
  async getMessages(roomId) {
    const response = await apiClient.get(`/api/chat/messages/${roomId}`);
    return response.data;
  },

  /**
   * 메시지 읽음 처리
   */
  async markAsRead(roomId, senderType) {
    const response = await apiClient.post(`/api/chat/read/${roomId}`, null, {
      params: { senderType }
    });
    return response.data;
  },

  /**
   * 활성 채팅방 목록 조회 (관리자용)
   */
  async getActiveRooms() {
    const response = await apiClient.get('/api/chat/rooms/active');
    return response.data;
  },

  /**
   * 채팅방 닫기
   */
  async closeRoom(roomId) {
    const response = await apiClient.post(`/api/chat/room/${roomId}/close`);
    return response.data;
  }
}
// 관리자 API
export const adminAPI = {
  // 기본 CRUD 메서드
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

  // 파일 업로드 (폴더별)
  async uploadFile(formData, folder = 'general') {
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
  // 파일 삭제 메서드 
  async deleteFile(filePath) {
    const response = await apiClient.delete('/api/admin/delete-file', {
      params: { filePath }
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

  // 유틸리티 메서드
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
  saveToken(token) {
    localStorage.setItem('jwt_token', token)
  },

  // 토큰 조회
  getToken() {
    return localStorage.getItem('jwt_token')
  },
  // 인증 데이터 삭제
  clearAuth() {
    localStorage.removeItem('jwt_token')
    sessionStorage.clear()
  },

  // JWT 디코딩하여 사용자 정보 추출
  decodeToken(token) {
    if (!token) return null
    
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('JWT 디코딩 실패:', error)
      return null
    }
  },

  // 토큰에서 사용자 정보 가져오기
  async getUserInfo() {
    try {
      const response = await memberAPI.getUserInfo()
      if (response.code === 200) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error)
      return null
    }
  },

  // 로그인 상태 확인
  isLoggedIn() {
    const token = this.getToken()
    if (!token) return false
    return !this.isTokenExpired()
  },

  // 토큰 만료 확인
  isTokenExpired() {
    const token = this.getToken()
    if (!token) return true

    try {
      const payload = this.decodeToken(token)
      if (!payload || !payload.exp) return true
      
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
      this.clearAuth()
  }
}
}
export default apiClient
