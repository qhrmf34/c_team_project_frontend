<template>
  <div class="auth-callback">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <h2>로그인 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
    
    <div v-if="error" class="error-container">
      <h2>로그인 실패</h2>
      <p>{{ error }}</p>
      <button @click="goToLogin" class="retry-button">로그인 페이지로 돌아가기</button>
    </div>
  </div>
</template>

<script>
import { authUtils } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'

export default {
  name: 'AuthCallback',
  data() {
    return {
      loading: true,
      error: null
    }
  },
  
  async mounted() {
    await this.handleCallback()
  },
  
  methods: {
    async handleCallback() {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const error = urlParams.get('error')
        
        // 에러 체크
        if (error) {
          throw new Error(this.getErrorMessage(error))
        }
        
        if (!token) {
          throw new Error('토큰이 누락되었습니다.')
        }
        
        // JWT 디코딩하여 사용자 정보 추출
        const payload = authUtils.decodeToken(token)
        
        if (!payload) {
          throw new Error('JWT 토큰을 디코딩할 수 없습니다.')
        }
        
        // 토큰 타입 확인
        const tokenType = payload.type
        const memberId = payload.sub ? parseInt(payload.sub) : null
        
        // 사용자 정보 구성
        const userInfo = {
          id: memberId,
          firstName: payload.firstName || '',
          lastName: payload.lastName || '',
          email: payload.email || '',
          provider: payload.provider || ''
        }
        
        const memberName = formatMemberName(userInfo)
        
        // 토큰 타입에 따라 분기
        if (tokenType === 'social_signup') {
          // 신규 회원 - 임시 토큰
          this.handleNewUser(token, userInfo, memberName)
        } else if (tokenType === 'social_login' || tokenType === 'access') {
          // 기존 회원 - 정식 토큰
          this.handleExistingUser(token, memberName)
        } else {
          throw new Error('알 수 없는 토큰 타입입니다.')
        }
        
      } catch (error) {
        console.error('❌ 콜백 처리 실패:', error)
        this.error = error.message
        this.loading = false
        setTimeout(() => this.goToLogin(), 5000)
      }
    },
    
    handleNewUser(token, userInfo, memberName) {
      // sessionStorage에 임시 토큰과 정보 저장
      const socialData = {
        tempToken: token,
        socialInfo: {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          provider: userInfo.provider
        }
      }
      
      sessionStorage.setItem('socialSignupData', JSON.stringify(socialData))
      
      alert(`${memberName}님, 추가 정보를 입력해주세요.`)
      
      // signup 페이지로 이동
      this.$router.replace('/signup')
    },
    
    handleExistingUser(token, memberName) {
      // localStorage에 토큰 저장
      localStorage.setItem('jwt_token', token)
      
      // 저장 확인
      const savedToken = localStorage.getItem('jwt_token')
      if (!savedToken) {
        this.error = '토큰 저장에 실패했습니다.'
        this.loading = false
        return
      }
      
      alert(`${memberName}님, 환영합니다!`)
      
      // 페이지 이동
      this.loading = false
      this.$router.push('/')
    },
    
    getErrorMessage(error) {
      const errorMessages = {
        'user_not_found': '사용자 정보를 찾을 수 없습니다.',
        'login_failed': '로그인 처리 중 오류가 발생했습니다.',
        'access_denied': '로그인이 취소되었습니다.',
        'no_token': '토큰을 생성하지 못했습니다.',
        'redirect_failed': '리다이렉트 처리 중 오류가 발생했습니다.',
        'oauth_failed': 'OAuth 인증에 실패했습니다.'
      }
      return errorMessages[error] || '알 수 없는 오류가 발생했습니다.'
    },
    
    goToLogin() {
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.auth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.loading-container, .error-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-container h2, .error-container h2 {
  margin: 1rem 0;
  color: #333;
  font-weight: 600;
}

.loading-container p, .error-container p {
  color: #666;
  margin-bottom: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  border-left: 4px solid #e74c3c;
}

.retry-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
}

.retry-button:hover {
  background: #5a67d8;
}

.retry-button:active {
  transform: translateY(1px);
}
</style>