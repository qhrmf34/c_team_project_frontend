<template>
  <div class="complete-signup-container">
    <div class="complete-signup-box">
      <h2>추가 정보 입력</h2>
      <p class="subtitle">회원가입을 완료하기 위해 추가 정보를 입력해주세요.</p>
      
      <form @submit.prevent="handleSubmit">
        <!-- 이메일 (구글이 아닐 때만 표시) -->
        <div v-if="!isGoogleUser" class="form-group">
          <label for="email">이메일 <span class="required">*</span></label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="example@email.com"
            :required="!isGoogleUser"
            :disabled="loading"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- 전화번호 -->
        <div class="form-group">
          <label for="phoneNumber">전화번호 <span class="required">*</span></label>
          <input
            id="phoneNumber"
            v-model="formData.phoneNumber"
            type="tel"
            placeholder="010-1234-5678"
            required
            :disabled="loading"
          />
          <span v-if="errors.phoneNumber" class="error-message">{{ errors.phoneNumber }}</span>
        </div>

        <!-- 제출 버튼 -->
        <button 
          type="submit" 
          class="submit-button"
          :disabled="loading"
        >
          <span v-if="!loading">완료</span>
          <span v-else>처리 중...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { authUtils, memberAPI } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'

export default {
  name: 'CompleteSocialSignup',
  data() {
    return {
      formData: {
        email: '',
        phoneNumber: ''
      },
      errors: {
        email: '',
        phoneNumber: ''
      },
      loading: false,
      isGoogleUser: false
    }
  },
  
  mounted() {
    // 사용자 정보에서 provider 확인
    const userInfo = authUtils.getUserInfo()
    if (userInfo && userInfo.provider === 'google') {
      this.isGoogleUser = true
      this.formData.email = userInfo.email // 구글 이메일 자동 설정
    }
    
    console.log('isGoogleUser:', this.isGoogleUser)
    console.log('userInfo:', userInfo)
  },
  
  methods: {
    validateForm() {
      this.errors = {
        email: '',
        phoneNumber: ''
      }
      
      let isValid = true
      
      // 이메일 검증 (구글이 아닐 때만)
      if (!this.isGoogleUser) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!this.formData.email) {
          this.errors.email = '이메일을 입력해주세요.'
          isValid = false
        } else if (!emailRegex.test(this.formData.email)) {
          this.errors.email = '올바른 이메일 형식이 아닙니다.'
          isValid = false
        }
      }
      
      // 전화번호 검증
      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
      if (!this.formData.phoneNumber) {
        this.errors.phoneNumber = '전화번호를 입력해주세요.'
        isValid = false
      } else if (!phoneRegex.test(this.formData.phoneNumber)) {
        this.errors.phoneNumber = '01X-XXXX-XXXX 형식으로 입력해주세요.'
        isValid = false
      }
      
      return isValid
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      this.loading = true
      
      try {
        // 구글 사용자면 phoneNumber만 전송
        const requestData = this.isGoogleUser 
          ? { phoneNumber: this.formData.phoneNumber }
          : { 
              email: this.formData.email, 
              phoneNumber: this.formData.phoneNumber 
            }
        
        console.log('전송 데이터:', requestData)
        
        const response = await memberAPI.completeSocialSignup(requestData)
        
        if (response.data?.data) {
          const token = authUtils.getToken()
          authUtils.saveAuth(token, response.data.data)
          
          const memberName = formatMemberName(response.data.data)
          alert(`${memberName}님, 회원가입이 완료되었습니다!`)
        } else {
          alert('회원가입이 완료되었습니다!')
        }
        
        this.$router.replace('/')
        
      } catch (error) {
        console.error('추가 정보 입력 실패:', error)
        alert(error.response?.data?.message || '추가 정보 입력 중 오류가 발생했습니다.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.complete-signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.complete-signup-box {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  max-width: 450px;
  width: 100%;
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}

.subtitle {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.required {
  color: #e74c3c;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 12px;
  margin-top: 0.5rem;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:hover:not(:disabled) {
  background: #5a67d8;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-button:active:not(:disabled) {
  transform: translateY(1px);
}
</style>