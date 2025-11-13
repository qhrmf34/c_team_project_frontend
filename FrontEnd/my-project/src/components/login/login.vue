<template>
  <div class="hotel-login-container">
    <div class="container">
      <!-- Left Form Section - 화면에 따라 내용만 변경 -->
      <div class="form-section">
        <div class="form-section-content">
          <!-- Login Screen -->
          <div v-if="currentScreen === 'login'">
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
                  <img 
                    :src="showPassword.login ? '/images/login_img/close-eye.jpg' : '/images/login_img/open-eye.jpg'" 
                    alt="Toggle Password" 
                  />
                  </button>
                </div>
                <label for="password">Password</label>
              </div>
              <!-- Cloudflare Turnstile 위젯 -->
              <div class="turnstile-wrapper">
                <div 
                  ref="turnstileWidget"
                  class="cf-turnstile"
                ></div>
              </div>

              <div class="options">
                <div class="remember-forgot">
                  <span class="remember-me">
                    <input type="checkbox" id="remember-checkbox" v-model="loginForm.rememberMe">
                    <label for="remember-checkbox">비밀번호 기억하기</label>
                  </span>
                  <a href="#" class="forgot-password" @click="showScreen('forgot-password')">Forgot Password</a>
                </div>
                <button type="submit" class="login-button" :disabled="isLoading">
                  {{ isLoading ? '로그인 중...' : 'Login' }}
                </button>
                <a href="#" class="signup-link" @click="goToSignup">회원가입</a>
              </div>
            </form>
            
            <!-- 소셜 로그인은 로그인 화면에서만 표시 -->
            <div class="divider">
              <span class="divider-beeline"></span>
              <span>Or login with</span>
              <span class="divider-beeline"></span>
            </div>
            
            <div class="social-login">
              <button class="social-btn kakao-btn" @click="loginWithKakao">
                <img src="/images/login_img/kakao.jpg" alt="카카오 로그인" width="24" height="24" style="border-radius: 4px;"/>
              </button>
              <button class="social-btn" @click="loginWithGoogle">
                <img src="/images/login_img/google.jpg" alt="구글 로그인" width="24" height="24" style="border-radius: 4px;"/>
              </button>
              <button class="social-btn" @click="loginWithNaver">
                <img src="/images/login_img/naver.jpg" alt="네이버 로그인" width="24" height="24" style="border-radius: 4px;"/>
              </button>
            </div>
          </div>

          <!-- Forgot Password Screen -->
          <div v-else-if="currentScreen === 'forgot-password'">
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
                  required
                >
                <label for="forgot-email">Email</label>
              </div>
              
              <div class="options">
                <button type="submit" class="forgot-password-button" :disabled="isLoading">
                  {{ isLoading ? '전송 중...' : '제출' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Verify Code Screen -->
          <div v-else-if="currentScreen === 'verify-code'">
            <a href="#" class="back-link" @click="showScreen('forgot-password')">
              &lt; Back to forgot password
            </a>
            <h1>인증하기</h1>
            <p class="email-retransmit">{{ forgotPasswordForm.email }}로 받은 인증번호를 입력해주세요</p>
            <form @submit.prevent="submitVerifyCode">
              <div class="input-group">
                <input 
                  type="text" 
                  id="enter-code" 
                  v-model="verifyCodeForm.code"
                  placeholder="123456" 
                  maxlength="6"
                  pattern="[0-9]{6}"
                  required
                >
                <label for="enter-code">Enter Code</label>
              </div>
              <div class="retransmit" @click="retransmitCode">재전송하기</div>      
              <div class="options">
                <button type="submit" class="forgot-password-verify-button" :disabled="isLoading">
                  {{ isLoading ? '확인 중...' : '인증하기' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Set Password Screen -->
          <div v-else-if="currentScreen === 'set-password'">
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
                    required
                  >
                  <button 
                    type="button" 
                    class="password-toggle" 
                    @click="togglePassword('create')"
                  >
                  <img 
                    :src="showPassword.create ? '/images/login_img/close-eye.jpg' : '/images/login_img/open-eye.jpg'" 
                    alt="Toggle Password" 
                  />
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
                    required
                  >
                  <button 
                    type="button" 
                    class="password-toggle" 
                    @click="togglePassword('reenter')"
                  >
                  <img 
                    :src="showPassword.reenter ? '/images/login_img/close-eye.jpg' : '/images/login_img/open-eye.jpg'" 
                    alt="Toggle Password" 
                  />
                  </button>
                </div>
                <label for="re-enter-password">Re-enter Password</label>
              </div>
              
              <div class="options">
                <button type="submit" class="set-password-button" :disabled="isLoading">
                  {{ isLoading ? '설정 중...' : '비밀번호설정' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Right Image Section - 한 번만 정의하고 고정 -->
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
// commonAxios에서 memberAPI와 authUtils 불러오기
import { memberAPI, authUtils } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'

export default {
  name: 'HotelLogin',
  
  data() {
    return {
      currentScreen: 'login',
      currentSlideIndex: 0,
      isLoading: false,
      turnstileWidgetId: null, 
      turnstileToken: null,
      turnstileSiteKey: '', 

      showPassword: {
        login: false,
        create: false,
        reenter: false
      },
      
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
      this.handleSocialLoginResult();
      
      // Turnstile 스크립트 로드 - 약간의 지연 후 실행
      this.$nextTick(() => {
        setTimeout(() => {
          this.loadTurnstileScript();
        }, 100);
      });
    
      // 슬라이더 자동 전환
      setInterval(() => {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % 3;
      }, 5000);
    },
    
    beforeUnmount() {
      // Turnstile 위젯 제거
      if (window.turnstile && this.turnstileWidgetId !== null) {
        try {
          window.turnstile.remove(this.turnstileWidgetId);
        } catch (error) {
          console.error('Turnstile 위젯 제거 실패:', error);
        }
      }
      
      // 컴포넌트 제거 시 전역 콜백 정리
      if (window.onTurnstileSuccess) {
        delete window.onTurnstileSuccess;
      }
      if (window.onTurnstileError) {
        delete window.onTurnstileError;
      }
    },
  
  methods: {
      loadTurnstileScript() {
        // 이미 스크립트가 로드되어 있는지 확인
        if (window.turnstile) {
          this.initTurnstile();
          return;
        }
      
        // 스크립트가 이미 DOM에 있는지 확인
        const existingScript = document.querySelector('script[src*="turnstile"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            this.initTurnstile();
          });
          return;
        }
      
        // 새로운 스크립트 태그 생성 및 로드
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('Turnstile 스크립트 로드 완료');
          this.initTurnstile();
        };

        script.onerror = () => {
          console.error('Turnstile 스크립트 로드 실패');
          alert('로봇 검증 시스템을 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
        };

        document.head.appendChild(script);
      },
      
      initTurnstile() {
        // 이미 렌더링된 위젯이 있다면 이 함수를 중단합니다.
        if (this.turnstileWidgetId) {
          console.log('Turnstile 위젯이 이미 렌더링되었습니다. 중복 렌더링 방지.');
          return;
        }
        if (this.turnstileWidgetId !== null && window.turnstile) {
          try {
            window.turnstile.remove(this.turnstileWidgetId);
            this.turnstileWidgetId = null;
          } catch (error) {
            console.log('기존 위젯 정리:', error);
          }
        }
        // Turnstile 콜백을 전역으로 등록
        window.onTurnstileSuccess = (token) => {
          this.turnstileToken = token;
          console.log('Turnstile 검증 성공');
        };

        window.onTurnstileError = (error) => {
          this.turnstileToken = null;
          console.error('Turnstile 검증 실패:', error);
          alert('로봇 검증에 실패했습니다. 페이지를 새로고침해주세요.');
        };

        // Turnstile 위젯 렌더링
        this.$nextTick(() => {
          if (window.turnstile && this.$refs.turnstileWidget) {
            try {
              this.turnstileSiteKey=String(process.env.VUE_APP_TURNSTILE_SITE_KEY);
              this.turnstileWidgetId = window.turnstile.render(this.$refs.turnstileWidget, {
                sitekey: this.turnstileSiteKey,
                theme: 'light',
                callback: window.onTurnstileSuccess,
                'error-callback': window.onTurnstileError
              });
              console.log('Turnstile 위젯 렌더링 완료');
            } catch (error) {
              console.error('Turnstile 위젯 렌더링 실패:', error);
            }
          }
        });
      },
      
    async handleLogin() {
      if (!this.loginForm.email || !this.loginForm.password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
      }
      if (!this.turnstileToken) {
        alert('로봇 검증을 완료해주세요.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.loginForm.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      this.isLoading = true;
      
      try {
        const result = await memberAPI.login({
          email: this.loginForm.email,
          password: this.loginForm.password,
          turnstileToken: this.turnstileToken
        });
        
        if (result.data && result.data.token) {
          // JWT 토큰에서 사용자 정보 추출
          const payload = authUtils.decodeToken(result.data.token);
          
          if (!payload) {
            throw new Error('JWT 토큰을 디코딩할 수 없습니다.');
          }
          
          // JWT에서 추출한 정보로 사용자 정보 구성
          const userInfo = {
            id: payload.sub ? parseInt(payload.sub) : null,
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            email: payload.email || '',
            provider: payload.provider || ''
          };
          
          // 사용자 이름 포맷팅
          const memberName = formatMemberName(userInfo);
          
          // JWT 토큰만 저장 (사용자 정보는 토큰에서 추출)
          localStorage.setItem('jwt_token', result.data.token);
          
          alert(`${memberName}님, 환영합니다!`);
          this.$router.push('/hotelone'); // 호텔1 화면으로 이동
        }
      } catch (error) {
        console.error('로그인 실패:', error);
        alert(error.response?.data?.message || '로그인에 실패했습니다.');
        this.resetTurnstile();

      } finally {
        this.isLoading = false;
      }
    },
    
    resetTurnstile() {
        this.turnstileToken = null;
        if (window.turnstile && this.$refs.turnstileWidget) {
          try {
            window.turnstile.reset(this.$refs.turnstileWidget);
          } catch (error) {
            console.error('Turnstile 리셋 실패:', error);
            // 리셋 실패 시 위젯 재렌더링 시도
            this.initTurnstile();
          }
        }
      },
    
    async submitForgotPassword() {
      if (!this.forgotPasswordForm.email) {
        alert('이메일을 입력해주세요.');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.forgotPasswordForm.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      this.isLoading = true;
      
      try {
        await memberAPI.forgotPassword(this.forgotPasswordForm.email);
        alert('인증 코드가 이메일로 전송되었습니다.');
        this.showScreen('verify-code');
      } catch (error) {
        console.error('비밀번호 재설정 요청 실패:', error);
        alert(error.response?.data?.message || '비밀번호 재설정 요청에 실패했습니다.');
      } finally {
        this.isLoading = false;
      }
    },

    async submitVerifyCode() {
      if (!this.verifyCodeForm.code) {
        alert('인증 코드를 입력해주세요.');
        return;
      }
      
      if (this.verifyCodeForm.code.length !== 6) {
        alert('인증 코드는 6자리여야 합니다.');
        return;
      }

      this.isLoading = true;
      
      try {
        await memberAPI.verifyResetCode(
          this.forgotPasswordForm.email, 
          this.verifyCodeForm.code
        );
        alert('인증 코드가 확인되었습니다.');
        this.showScreen('set-password');
      } catch (error) {
        console.error('인증 코드 확인 실패:', error);
        alert(error.response?.data?.message || '인증 코드 확인에 실패했습니다.');
      } finally {
        this.isLoading = false;
      }
    },

    async submitSetPassword() {
      if (!this.setPasswordForm.password || !this.setPasswordForm.confirmPassword) {
        alert('새 비밀번호를 입력해주세요.');
        return;
      }
      
      if (this.setPasswordForm.password.length < 8) {
        alert('비밀번호는 8자 이상이어야 합니다.');
        return;
      }
      
      if (this.setPasswordForm.password !== this.setPasswordForm.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      this.isLoading = true;
      
      try {
        await memberAPI.resetPassword(
          this.forgotPasswordForm.email,
          this.verifyCodeForm.code,
          this.setPasswordForm.password,
          this.setPasswordForm.confirmPassword
        );
        alert('비밀번호가 성공적으로 재설정되었습니다!');
        this.showScreen('login');
        this.resetAllForms();
      } catch (error) {
        console.error('비밀번호 재설정 실패:', error);
        alert(error.response?.data?.message || '비밀번호 재설정에 실패했습니다.');
      } finally {
        this.isLoading = false;
      }
    },

    async retransmitCode() {
      if (!this.forgotPasswordForm.email) {
        alert('이메일 정보가 없습니다.');
        return;
      }

      this.isLoading = true;
      
      try {
        await memberAPI.forgotPassword(this.forgotPasswordForm.email);
        alert('인증 코드가 재전송되었습니다.');
      } catch (error) {
        console.error('재전송 실패:', error);
        alert(error.response?.data?.message || '재전송에 실패했습니다.');
      } finally {
        this.isLoading = false;
      }
    },

    showScreen(screenName) {
      this.currentScreen = screenName;
      if (screenName === 'login') {
        this.resetAllForms();
      }
    },
    
    slideToImage(index) {
      this.currentSlideIndex = index;
    },
    
    togglePassword(fieldType) {
      this.showPassword[fieldType] = !this.showPassword[fieldType];
    },
    
    handleSocialLoginResult() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('login') === 'success') {
        alert('소셜 로그인이 완료되었습니다!');
        window.history.replaceState({}, document.title, window.location.pathname);
        this.$router.push('/hotelone'); // 호텔1 화면으로 이동
      } else if (urlParams.get('error') === 'oauth_failed') {
        alert('소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    },
    
    // Social login methods
    loginWithKakao() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/kakao';
    },
    
    loginWithGoogle() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/google';
    },
    
    loginWithNaver() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/naver';
    },
    
    goToSignup() {
      this.$router.push('/signup');
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
    }
  },
  
  created() {
    // 이미 로그인된 상태라면 호텔1 화면으로 이동
    const token = localStorage.getItem('jwt_token');
    if (token) {
      this.$router.push('/hotelone');
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
.password-toggle img{
  width: 22.50015640258789px;
  height: 15px;
  top: 4.5px;
  left: 0.75px;
  angle: 0 deg;
  opacity: 1;

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
  color: #7dd3c0;
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

.login-button:disabled,
.forgot-password-button:disabled,
.forgot-password-verify-button:disabled,
.set-password-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
  color: #7dd3c0;
}
.turnstile-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
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

</style>