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
    decodeJWT(token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return null;
      }
    },
    
    extractUserInfoFromUrl(urlParams) {
      const userInfoParam = urlParams.get('userInfo')
      if (!userInfoParam) return null
      
      try {
        return JSON.parse(decodeURIComponent(userInfoParam))
      } catch (error) {
        console.error('userInfo 파싱 실패:', error)
        return null
      }
    },
    
    extractUserInfoFromJWT(token) {
      const payload = this.decodeJWT(token)
      if (!payload) return null
      
      return {
        id: payload.sub || null,
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        email: payload.email || '',
        provider: payload.provider || '',
        type: payload.type || ''
      }
    },
    
    async handleCallback() {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const error = urlParams.get('error')
        
        if (error) {
          throw new Error(this.getErrorMessage(error))
        }
        
        if (!token) {
          throw new Error('토큰이 누락되었습니다.')
        }
        
        // URL 파라미터에서 userInfo 추출 (우선순위 1)
        let userInfo = this.extractUserInfoFromUrl(urlParams)
        
        // userInfo가 없으면 JWT에서 추출 (우선순위 2)
        if (!userInfo) {
          userInfo = this.extractUserInfoFromJWT(token)
          if (!userInfo) {
            throw new Error('사용자 정보를 추출할 수 없습니다.')
          }
        }
        
        const memberName = formatMemberName(userInfo)
        const isNewUser = userInfo.type === 'social_signup'
        
        if (isNewUser) {
          this.handleNewUser(token, userInfo, memberName)
        } else {
          this.handleExistingUser(token, userInfo, memberName)
        }
        
      } catch (error) {
        console.error('콜백 처리 실패:', error)
        this.error = error.message
        setTimeout(() => this.goToLogin(), 5000)
      } finally {
        this.loading = false
      }
    },
    
    handleNewUser(token, userInfo, memberName) {
      sessionStorage.setItem('socialSignupData', JSON.stringify({
        tempToken: token,
        socialInfo: userInfo
      }))
      
      alert(`${memberName}님, 추가 정보를 입력해주세요.`)
      this.$router.replace('/signup')
    },
    
    handleExistingUser(token, userInfo, memberName) {
      authUtils.saveAuth(token, userInfo)
      alert(`${memberName}님, 환영합니다!`)
      this.$router.replace('/')
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