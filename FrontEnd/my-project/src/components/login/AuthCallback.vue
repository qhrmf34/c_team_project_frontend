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
        console.log('=== AuthCallback 실행 ===')
        console.log('현재 URL:', window.location.href)
        
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const userInfoParam = urlParams.get('userInfo')
        const error = urlParams.get('error')
        
        console.log('URL 파라미터:', { 
          hasToken: !!token, 
          hasUserInfo: !!userInfoParam, 
          error 
        })
        
        if (error) {
          throw new Error(this.getErrorMessage(error))
        }
        
        if (token && userInfoParam) {
          try {
            // URL 파라미터에서 받은 사용자 정보 파싱
            const userInfo = JSON.parse(decodeURIComponent(userInfoParam))
            
            console.log('파싱된 사용자 정보:', userInfo)
            console.log('토큰 앞부분:', token.substring(0, 20) + '...')
            
            // localStorage에 토큰과 사용자 정보 저장
            authUtils.saveAuth(token, userInfo)
            
            console.log('✓ 토큰과 사용자 정보 저장 완료')
            
            // 저장된 정보 확인
            const savedToken = localStorage.getItem('jwt_token')
            const savedUserInfo = localStorage.getItem('user_info')
            
            console.log('저장 확인:', {
              tokenSaved: !!savedToken,
              userInfoSaved: !!savedUserInfo
            })
            
            // 성공 메시지
            alert(`${userInfo.firstName}님, 로그인되었습니다!`)
            
            // 메인 페이지로 리다이렉트 (3초 후)
            setTimeout(() => {
              this.$router.replace('/')
            }, 1000)
            
          } catch (parseError) {
            console.error('사용자 정보 파싱 실패:', parseError)
            throw new Error('사용자 정보 처리 중 오류가 발생했습니다.')
          }
        } else {
          throw new Error('토큰 또는 사용자 정보가 누락되었습니다.')
        }
        
      } catch (error) {
        console.error('콜백 처리 실패:', error)
        this.error = error.message
        
        // 5초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          this.goToLogin()
        }, 5000)
      } finally {
        this.loading = false
      }
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