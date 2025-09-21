<template>
  <div class="hotel-login-container">
    <!-- Login Screen -->
    <div class="container screen" :class="{ active: currentScreen === 'login' }">
      <!-- Left Form Section -->
      <div class="form-section">
        <div class="form-section-content">
          <h1>Login</h1>
          <p class="subtitle">로그인해주세요</p>
          <form @submit.prevent="handleLogin">
            <div class="input-group">
              <input 
                type="email" 
                id="email" 
                v-model="loginForm.email"
                placeholder="john.doe@gmail.com" 
                maxlength="100"
              >
              <label for="email">Email</label>
            </div>
            <div class="input-group">
              <div class="password-input-wrapper">
                <input 
                  :type="showPassword.login ? 'text' : 'password'" 
                  id="password" 
                  v-model="loginForm.password"
                  placeholder="••••••••••••••••" 
                  maxlength="255"
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="togglePassword('login')"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path v-if="!showPassword.login" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle v-if="!showPassword.login" cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path v-if="showPassword.login" d="M9.88 9.88a3 3 0 1 0 4.24 4.24M2 12s3-7 10-7a9.902 9.902 0 0 1 5.13 1.31m3.15 3.15a7.98 7.98 0 0 1 1.72 4.54s-3 7-10 7a9.902 9.902 0 0 1-5.13-1.31M2 2l20 20" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </button>
              </div>
              <label for="password">Password</label>
            </div>
            
            <div class="options">
              <div class="remember-forgot">
                <span class="remember-me">
                  <input type="checkbox" id="remember-checkbox" v-model="loginForm.rememberMe">
                  <label for="remember-checkbox">비밀번호 기억하기</label>
                </span>
                <a href="#" class="forgot-password" @click="showScreen('forgot-password')">Forgot Password</a>
              </div>
              <button type="submit" class="login-button">Login</button>
              <a href="#" class="signup-link">회원가입</a>
            </div>
          </form>
          
          <div class="divider">
            <span class="divider-beeline"></span>
            <span>Or login with</span>
            <span class="divider-beeline"></span>
          </div>
          
          <!-- Social Login Buttons -->
          <div class="social-login">
            <!-- 카카오 버튼-->
            <button class="social-btn kakao-btn" @click="loginWithKakao">
              <img src="../../assets/login_img/kakao_login_medium_narrow.png" alt="카카오 로그인" width="24" height="24">
            </button>
            <button class="social-btn" @click="loginWithGoogle">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button class="social-btn" @click="loginWithApple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Right Image Section -->
      <div class="image-section">
        <div class="slider-container">
          <div class="slider-wrapper" :style="{ transform: `translateX(${-currentSlideIndex * 33.333}%)` }">
            <div class="slide">
              <img src="/images/slide1.jpg" alt="Hotel slide 1" />
            </div>
            <div class="slide">
              <img src="/images/slide2.jpg" alt="Hotel slide 2" />
            </div>
            <div class="slide">
              <img src="/images/paris.jpg" alt="Paris hotel" />
            </div>
          </div>
          <div class="image-dots">
            <div 
              v-for="(slide, index) in 3" 
              :key="index"
              class="dot" 
              :class="{ active: currentSlideIndex === index }"
              @click="slideToImage(index)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Forgot Password Screen -->
    <div class="container screen" :class="{ active: currentScreen === 'forgot-password' }">
      <!-- Left Form Section -->
      <div class="form-section">
        <div class="form-section-content">
          <a href="#" class="back-link" @click="showScreen('login')">
            &lt; Back to login
          </a>
          <h1>비밀번호 찾기</h1>
          <p class="find-password">비밀번호를 찾아보세요</p>
          <form @submit.prevent="submitForgotPassword">
            <div class="input-group">
              <input 
                type="email" 
                id="forgot-email" 
                v-model="forgotPasswordForm.email"
                placeholder="john.doe@gmail.com" 
                maxlength="100"
              >
              <label for="forgot-email">Email</label>
            </div>
                                 
            <div class="options">
              <button type="submit" class="forgot-password-button">제출</button>
            </div>
          </form>
                               
          <div class="divider">
            <span class="divider-beeline"></span>
            <span>Or login with</span>
            <span class="divider-beeline"></span>
          </div>
                               
          <!-- Social Login Buttons -->
          <div class="social-login">
             <button class="social-btn kakao-btn" @click="loginWithKakao">
              <img src="../../assets/login_img/kakao_login_medium_narrow.png" alt="카카오 로그인" width="24" height="24">
            </button>
            <button class="social-btn" @click="loginWithGoogle">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button class="social-btn" @click="loginWithApple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
               
      <!-- Right Image Section -->
      <div class="image-section">
        <div class="slider-container">
          <div class="slider-wrapper" :style="{ transform: `translateX(${-currentSlideIndex * 33.333}%)` }">
            <div class="slide">
              <img src="/images/slide1.jpg" alt="Hotel slide 1" />
            </div>
            <div class="slide">
              <img src="/images/slide2.jpg" alt="Hotel slide 2" />
            </div>
            <div class="slide">
              <img src="/images/paris.jpg" alt="Paris hotel" />
            </div>
          </div>
          <div class="image-dots">
            <div 
              v-for="(slide, index) in 3" 
              :key="index"
              class="dot" 
              :class="{ active: currentSlideIndex === index }"
              @click="slideToImage(index)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Verify Code Screen -->
    <div class="container screen" :class="{ active: currentScreen === 'verify-code' }">
      <!-- Left Form Section -->
      <div class="form-section">
        <div class="form-section-content">
          <a href="#" class="back-link" @click="showScreen('login')">
            &lt; Back to login
          </a>
          <h1>인증하기</h1>
          <p class="email-retransmit">이메일로 받은 인증번호를 입력해주세요</p>
          <form @submit.prevent="submitVerifyCode">
            <div class="input-group">
              <input 
                type="text" 
                id="enter-code" 
                v-model="verifyCodeForm.code"
                placeholder="7789BM6X" 
                maxlength="8"
              >
              <label for="enter-code">Enter Code</label>
            </div>
            <div class="retransmit" @click="retransmit">재전송하기</div>      
            <div class="options">
              <button type="submit" class="forgot-password-verify-button">인증하기</button>
            </div>
          </form>
        </div>
      </div>
               
      <!-- Right Image Section -->
      <div class="image-section">
        <div class="slider-container">
          <div class="slider-wrapper" :style="{ transform: `translateX(${-currentSlideIndex * 33.333}%)` }">
            <div class="slide">
              <img src="/images/slide1.jpg" alt="Hotel slide 1" />
            </div>
            <div class="slide">
              <img src="/images/slide2.jpg" alt="Hotel slide 2" />
            </div>
            <div class="slide">
              <img src="/images/paris.jpg" alt="Paris hotel" />
            </div>
          </div>
          <div class="image-dots">
            <div 
              v-for="(slide, index) in 3" 
              :key="index"
              class="dot" 
              :class="{ active: currentSlideIndex === index }"
              @click="slideToImage(index)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Set Password Screen -->
    <div class="container screen" :class="{ active: currentScreen === 'set-password' }">
      <!-- Left Form Section -->
      <div class="form-section">
        <div class="form-section-content">
          <h1>비밀번호 설정</h1>
          <p class="password-reset">비밀번호 다시 설정하기</p>
          <form @submit.prevent="submitSetPassword">
            <div class="input-group">
              <div class="password-input-wrapper">
                <input 
                  :type="showPassword.create ? 'text' : 'password'" 
                  id="create-password" 
                  v-model="setPasswordForm.password"
                  placeholder="••••••••••••••••" 
                  maxlength="255"
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="togglePassword('create')"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path v-if="!showPassword.create" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle v-if="!showPassword.create" cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path v-if="showPassword.create" d="M9.88 9.88a3 3 0 1 0 4.24 4.24M2 12s3-7 10-7a9.902 9.902 0 0 1 5.13 1.31m3.15 3.15a7.98 7.98 0 0 1 1.72 4.54s-3 7-10 7a9.902 9.902 0 0 1-5.13-1.31M2 2l20 20" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </button>
              </div>
              <label for="create-password">Create Password</label>
            </div>
            <div class="input-group">
              <div class="password-input-wrapper">
                <input 
                  :type="showPassword.reenter ? 'text' : 'password'" 
                  id="re-enter-password" 
                  v-model="setPasswordForm.confirmPassword"
                  placeholder="••••••••••••••••" 
                  maxlength="255"
                >
                <button 
                  type="button" 
                  class="password-toggle" 
                  @click="togglePassword('reenter')"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path v-if="!showPassword.reenter" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle v-if="!showPassword.reenter" cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path v-if="showPassword.reenter" d="M9.88 9.88a3 3 0 1 0 4.24 4.24M2 12s3-7 10-7a9.902 9.902 0 0 1 5.13 1.31m3.15 3.15a7.98 7.98 0 0 1 1.72 4.54s-3 7-10 7a9.902 9.902 0 0 1-5.13-1.31M2 2l20 20" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                </button>
              </div>
              <label for="re-enter-password">Re-enter Password</label>
            </div>
                                 
            <div class="options">
              <button type="submit" class="set-password-button">비밀번호설정</button>
            </div>
          </form>
        </div>
      </div>
               
      <!-- Right Image Section -->
      <div class="image-section">
        <div class="slider-container">
          <div class="slider-wrapper" :style="{ transform: `translateX(${-currentSlideIndex * 33.333}%)` }">
            <div class="slide">
              <img src="/images/slide1.jpg" alt="Hotel slide 1" />
            </div>
            <div class="slide">
              <img src="/images/slide2.jpg" alt="Hotel slide 2" />
            </div>
            <div class="slide">
              <img src="/images/paris.jpg" alt="Paris hotel" />
            </div>
          </div>
          <div class="image-dots">
            <div 
              v-for="(slide, index) in 3" 
              :key="index"
              class="dot" 
              :class="{ active: currentSlideIndex === index }"
              @click="slideToImage(index)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelLogin',
  data() {
    return {
      currentScreen: 'login',
      currentSlideIndex: 0,
      
      // Password visibility states
      showPassword: {
        login: false,
        create: false,
        reenter: false
      },
      
      // Form data
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      
      forgotPasswordForm: {
        email: ''
      },
      
      verifyCodeForm: {
        code: ''
      },
      
      setPasswordForm: {
        password: '',
        confirmPassword: ''
      }
    }
  },
  mounted() {
    // 카카오 로그인 결과 처리 추가
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get('login');
    const provider = urlParams.get('provider');
  
    if (loginStatus === 'success' && provider === 'kakao') {
      const userId = urlParams.get('userId');
      const name = urlParams.get('name');
      alert(`카카오 로그인 성공! 환영합니다, ${name}님`);
       alert(`카카오 로그인 성공! 환영합니다, ${name}님 (ID: ${userId})`);
      // 성공 후 처리 로직 (예: 다른 페이지로 이동)
    } else if (loginStatus === 'error' && provider === 'kakao') {
      const message = urlParams.get('message');
      alert(`카카오 로그인 실패: ${message}`);
    }

    // Auto slide images
    setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % 3;
    }, 5000);
  },
  methods: {
    // Screen navigation
    showScreen(screenName) {
      this.currentScreen = screenName;
      
      // Reset forms when navigating
      if (screenName === 'login') {
        this.resetAllForms();
      }
    },
    
    // Image slider
    slideToImage(index) {
      this.currentSlideIndex = index;
    },
    
    // Password visibility toggle
    togglePassword(fieldType) {
      this.showPassword[fieldType] = !this.showPassword[fieldType];
    },
    
    // Form submissions
    handleLogin() {
      if (!this.loginForm.email || !this.loginForm.password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
      }
      
      // Here you would typically make an API call
      console.log('Login attempt:', this.loginForm);
      alert('로그인 기능이 구현되지 않았습니다.');
    },
    
    submitForgotPassword() {
      if (!this.forgotPasswordForm.email) {
        alert('이메일을 입력해주세요.');
        return;
      }
      
      alert('인증번호가 ' + this.forgotPasswordForm.email + '로 전송되었습니다.');
      this.showScreen('verify-code');
    },
    
    submitVerifyCode() {
      if (!this.verifyCodeForm.code) {
        alert('인증번호를 입력해주세요.');
        return;
      }
      
      if (this.verifyCodeForm.code === '7789BM6X') {
        alert('인증이 완료되었습니다!');
        this.showScreen('set-password');
      } else {
        alert('잘못된 인증번호입니다. (힌트: 7789BM6X)');
      }
    },
    
    submitSetPassword() {
      if (!this.setPasswordForm.password || !this.setPasswordForm.confirmPassword) {
        alert('모든 필드를 입력해주세요.');
        return;
      }
      
      if (this.setPasswordForm.password === this.setPasswordForm.confirmPassword) {
        alert('비밀번호가 성공적으로 설정되었습니다!');
        this.showScreen('login');
      } else {
        alert('비밀번호가 일치하지 않습니다.');
      }
    },
    
    // Utility functions
    retransmit() {
      alert("재전송 되었습니다!");
    },
    
    resetAllForms() {
      this.loginForm = {
        email: '',
        password: '',
        rememberMe: false
      };
      this.forgotPasswordForm = { email: '' };
      this.verifyCodeForm = { code: '' };
      this.setPasswordForm = {
        password: '',
        confirmPassword: ''
      };
      this.showPassword = {
        login: false,
        create: false,
        reenter: false
      };
    },
    
  // Social login functions
    loginWithKakao() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/kakao';
    },
    
    loginWithGoogle() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/google';
    },
    
    loginWithApple() {
      alert('Apple 로그인 기능');
    }
  }
}
</script>

<style scoped>
/* 기본 설정 */
.hotel-login-container {
  width: 100%;
  min-height: 100vh;
  font-family: 'Montserrat', sans-serif;
}

/* 메인 컨테이너 */
.container {
  display: flex;
  width: 100%;
  height: 100vh;
}

/* 좌측 폼 영역 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 2rem;
}

/* 폼 내부 콘텐츠 */
.form-section-content {
  width: 512px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 우측 이미지 영역 */
.image-section {
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  width: 50%;
}

/* 슬라이더 컨테이너 */
.slider-container {
  width: 618px;
  height: 816px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  background: #f5f5f5;
}

.slide {
  width: 618px;
  height: 816px;
  flex-shrink: 0;
}

/* 슬라이드 래퍼 */
.slider-wrapper {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

/* 각 슬라이드 */
.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

/* Placeholder images with different colors - fallback */
.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.slide1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.slide2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.slide3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* 슬라이더 점들 */
.image-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.dot.active {
  background-color: #7dd3c0;
  width: 32px;
  height: 10px;
  border-radius: 5px;
  opacity: 1;
}

.dot:hover {
  opacity: 0.8;
}

/* 폼 스타일 */
h1 {
  font-family: 'Acme', sans-serif;
  font-weight: 400;
  font-size: 40px;
  line-height: 1.2;
  margin-bottom: 8px;
  color: #112211;
}

.subtitle,
p {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  color: #666;
  margin-bottom: 32px;
}

.find-password {
  margin-bottom: 48px;
}

.email-retransmit {
  margin-bottom: 48px;
}

.password-reset {
  margin-bottom: 48px;
}

/* 입력 필드 스타일 */
.input-group {
  margin-bottom: 24px;
  position: relative;
}

.input-group label {
  position: absolute;
  left: 12px;
  top: -8px;
  background: white;
  padding: 0 4px;
  font-size: 12px;
  color: #79747E;
  font-weight: 500;
  z-index: 1;
}

.input-group input {
  width: 100%;
  height: 56px;
  padding: 16px 12px;
  border: 1px solid #79747E;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  background: transparent;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #7dd3c0;
  border-width: 2px;
}

.input-group input:focus + label {
  color: #7dd3c0;
}

/* 비밀번호 필드 */
.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #79747E;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #333;
}

.options {
  width: 100%;
  margin: 20px 0;
}

.retransmit {
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  color: #112211;
  cursor: pointer;
  margin-bottom: 20px;
}

.retransmit:hover {
  color: #000;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.forgot-password {
  color: #ff6b6b;
  text-decoration: none;
  cursor: pointer;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* 버튼 스타일 */
.login-button,
.forgot-password-button,
.forgot-password-verify-button,
.set-password-button {
  width: 100%;
  height: 48px;
  padding: 8px 16px;
  background-color: #7dd3c0;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 16px;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.login-button:hover,
.forgot-password-button:hover,
.forgot-password-verify-button:hover,
.set-password-button:hover {
  background-color: #6bc4a8;
}

.signup-link {
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  display: block;
  color: #333;
  text-decoration: none;
  margin-bottom: 32px;
}

.signup-link:hover {
  text-decoration: underline;
}

.divider {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
  color: #666;
}

.divider-beeline {
  width: 30%;
  height: 1px;
  background: rgba(17, 34, 17, 0.25);
}

.divider span {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 14px;
  padding: 0 16px;
}

/* 소셜 로그인 버튼들 */
.social-login {
  display: flex;
  gap: 12px;
  justify-content: center;
  width: 100%;
}

.social-btn {
  width: 160px;
  height: 56px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  padding: 16px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.social-btn svg {
  width: 24px;
  height: 24px;
}

/* 뒤로가기 링크 */
.back-link {
  text-decoration: none;
  color: #112211;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 24px;
  display: inline-block;
}

.back-link:hover {
  color: #007bff;
}

/* 화면 전환 */
.screen {
  display: none;
}

.screen.active {
  display: flex;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .slider-container {
    width: 500px;
    height: 650px;
  }
  
  .slide {
    width: 500px;
    height: 650px;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .form-section,
  .image-section {
    width: 100%;
  }
  
  .image-section {
    height: 300px;
  }
  
  .slider-container {
    width: 100%;
    height: 300px;
  }
  
  .slide {
    width: 100%;
    height: 300px;
  }
}
</style>