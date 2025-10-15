<template>
  <div class="hotel-signup-container">
    <!-- Sign Up Screen -->
    <div class="container screen" :class="{ active: currentScreen === 'signup' }">
      <!-- Image Slider Section -->
      <section class="image-section">
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
      </section>

      <!-- Sign Up Form Section -->
      <section class="form-section">
        <div class="form-wrapper">
          <!-- Form Header -->
          <header class="form-header">
            <h1>Sign up</h1>
            <p>회원 가입</p>
          </header>

          <form @submit.prevent="submitSignUp">
            <!-- Name Input Section -->
            <div class="signup-name-row">
              <div class="input-group">
                <input 
                  type="text" 
                  id="first-name" 
                  v-model="signupForm.firstName"
                  placeholder="성" 
                  maxlength="50" 
                  required
                >
                <label for="first-name">First Name</label>
              </div>
              <div class="input-group">
                <input 
                  type="text" 
                  id="last-name" 
                  v-model="signupForm.lastName"
                  placeholder="이름" 
                  maxlength="50" 
                  required
                >
                <label for="last-name">Last Name</label>
              </div>
            </div>

            <!-- Contact Input Section -->
            <div class="signup-contact-row">
              <div class="input-group">
                <input 
                  type="email" 
                  id="signup-email" 
                  v-model="signupForm.email"
                  placeholder="john.doe@gmail.com" 
                  maxlength="100" 
                  required
                >
                <label for="signup-email">Email</label>
              </div>
              <div class="input-group">
                <input 
                  type="text" 
                  id="phone-number" 
                  v-model="signupForm.phoneNumber"
                  placeholder="010-1234-1234" 
                  maxlength="30" 
                  required
                >
                <label for="phone-number">Phone Number</label>
              </div>
            </div>

            <!-- Password Input Section -->
            <div class="signup-password-group">
              <div class="input-group">
                <div class="password-input-wrapper">
                  <input 
                    :type="showPassword.signup ? 'text' : 'password'" 
                    id="signup-password" 
                    v-model="signupForm.password"
                    placeholder="*************" 
                    maxlength="255" 
                    required
                  >
                  <button 
                    type="button" 
                    class="password-toggle" 
                    @click="togglePassword('signup')"
                  >
                  <img 
                    :src="showPassword.signup ? '/images/login_img/close-eye.jpg' : '/images/login_img/open-eye.jpg'" 
                    alt="Toggle Password" 
                  />
                  </button>
                </div>
                <label for="signup-password">Password</label>
              </div>
              <div class="input-group">
                <div class="password-input-wrapper">
                  <input 
                    :type="showPassword.confirm ? 'text' : 'password'" 
                    id="confirm-password" 
                    v-model="signupForm.confirmPassword"
                    placeholder="*************" 
                    maxlength="255" 
                    required
                  >
                  <button 
                    type="button" 
                    class="password-toggle" 
                    @click="togglePassword('confirm')"
                  >
                  <img 
                    :src="showPassword.confirm ? '/images/login_img/close-eye.jpg' : '/images/login_img/open-eye.jpg'" 
                    alt="Toggle Password" 
                  />
                  </button>
                </div>
                <label for="confirm-password">Confirm Password</label>
              </div>
            </div>

              <!-- Cloudflare Turnstile 위젯 -->
              <div class="turnstile-wrapper">
                <div 
                  ref="turnstileWidget"
                  class="cf-turnstile"
                ></div>
              </div>

            <!-- Options and Button Section -->
            <div class="form-options">
              <div class="checkbox-group">
                <input type="checkbox" id="agreement-checkbox" v-model="signupForm.agreement" required>
                <label for="agreement-checkbox">동의 하기</label>
              </div>
              <button type="submit" class="submit-button" :disabled="isLoading">
                {{ isLoading ? '가입 중...' : '계정 생성' }}
              </button>
            </div>
          </form>
          
          <!-- Divider -->
          <div class="divider">
            <span class="divider-beeline"></span>
            <span>Or Sign up with</span>
            <span class="divider-beeline"></span>
          </div>
          
          <!-- Social Login Section -->
          <div class="social-login">
            <!-- 카카오 버튼-->
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
      </section>
    </div>

    <!-- Payment Method Screen -->
    <div class="container screen" :class="{ active: currentScreen === 'payment' }">
      <!-- Image Slider Section -->
      <section class="image-section">
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
      </section>

      <!-- Payment Form Section -->
      <section class="form-section">
        <div class="payment-form-wrapper">
          <!-- Back Button and Header -->
          <header class="payment-header">
            <button type="button" class="back-button" @click="showScreen('signup')">
              <span>‹</span> Back
            </button>
            <h1>결제수단 추가</h1>
            <p>결제수단을 추가해주세요</p>
          </header>

          <form @submit.prevent="submitPaymentMethod">
            <!-- Card Number Input Section -->
            <div class="input-group" style="margin-bottom: 25px;">
              <div class="card-input-wrapper">
                <input 
                  type="text" 
                  id="card-number" 
                  v-model="paymentForm.cardNumber"
                  placeholder="4330 1234 5678 1234" 
                  inputmode="numeric" 
                  maxlength="19" 
                  required
                  @input="formatCardNumber"
                >
                <div class="card-logo">
                  <img src="/images/login_img/login_visa.jpg" alt="VISA">
                </div>
              </div>
              <label for="card-number">Card Number</label>
            </div>

            <!-- Card Details Input Section -->
            <div class="payment-row">
              <div class="input-group">
                <input 
                  type="text" 
                  id="exp-date" 
                  v-model="paymentForm.expDate"
                  maxlength="5" 
                  placeholder="02/27" 
                  inputmode="numeric" 
                  required
                  @input="formatExpDate"
                >
                <label for="exp-date">Exp. Date</label>
              </div>
              <div class="input-group">
                <input 
                  type="password" 
                  id="card-password" 
                  v-model="paymentForm.cardPassword"
                  placeholder="12" 
                  maxlength="2" 
                  pattern="[0-9]{2}" 
                  required
                  @input="formatCardPassword"
                >
                <label for="card-password">카드 비밀번호 (앞 2자리)</label>
              </div>
            </div>
          
            <!-- Name Input Section -->
            <div class="input-group" style="margin-bottom: 25px;">
              <input 
                type="text" 
                id="name-card" 
                v-model="paymentForm.nameOnCard"
                placeholder="홍길동" 
                maxlength="50" 
                required
              >
              <label for="name-card">Name on Card</label>
            </div>
          
            <!-- Country Select Section -->
            <div class="input-group" style="margin-bottom: 25px;">
              <select name="country" id="country-select" v-model="paymentForm.country" required>
                <option value="KR">대한민국</option>
                <option value="US">United States</option>
                <option value="JP">Japan</option>
              </select>
              <label for="country-select">Country or Region</label>
            </div>
            
            <!-- Checkbox Section -->
            <div class="payment-checkbox">
              <input type="checkbox" id="onetouch-checkbox" v-model="paymentForm.saveCard">
              <label for="onetouch-checkbox">정보 저장하기</label>
            </div>
          
            <!-- Payment Buttons Section -->
            <div class="payment-buttons">
              <button type="submit" class="payment-submit-button" :disabled="isPaymentLoading">
                {{ isPaymentLoading ? '추가 중...' : 'Add Card' }}
              </button>
              
              <button type="button" class="skip-payment-button" @click="skipPayment" :disabled="isPaymentLoading">
                다음에 하기
              </button>
            </div>
          </form>
          
          <!-- Terms Section -->
          <div class="payment-terms">
            By confirming your subscription, you allow The Outdoor Inn Crowd Limited to charge<br>
            your card for this payment and future payments in accordance with their terms. You can<br>
            always cancel your subscription.
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

// HotelSignup.vue - 결제수단 관련 수정 부분

<script>
// commonAxios에서 필요한 API들 불러오기
import { memberAPI, paymentMethodAPI } from '@/utils/commonAxios'

export default {
  name: 'HotelSignup',
  
  data() {
    return {
      currentScreen: 'signup',
      currentSlideIndex: 0,
      isLoading: false,
      isPaymentLoading: false, // 결제수단 추가용 별도 로딩
      turnstileWidgetId: null, 
      turnstileToken: null,
      turnstileSiteKey: '', 
      showPassword: {
        signup: false,
        confirm: false
      },
      
      signupForm: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        agreement: false
      },
      
      // 결제수단 폼 수정 (CVC → cardPassword)
      paymentForm: {
        cardNumber: '',
        expDate: '',
        cardPassword: '', // CVC에서 cardPassword로 변경
        nameOnCard: '',
        country: 'KR', // 기본값을 한국으로 변경
        saveCard: false
      }
    }
  },
  
  mounted() {
      // Turnstile 스크립트 로드 - 약간의 지연 후 실행
      this.$nextTick(() => {
        setTimeout(() => {
          this.loadTurnstileScript();
        }, 100);
      });
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
    showScreen(screenName) {
      this.currentScreen = screenName;
      this.currentSlideIndex = 0;
    },
    
    slideToImage(index) {
      this.currentSlideIndex = index;
    },
    
    togglePassword(fieldType) {
      this.showPassword[fieldType] = !this.showPassword[fieldType];
    },
    
    async submitSignUp() {
      if (!this.signupForm.agreement) {
        alert('약관에 동의해주세요.');
        return;
      }

      if (!this.turnstileToken) {
        alert('로봇 검증을 완료해주세요.');
        return;
      }

      if (this.signupForm.password !== this.signupForm.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      if (this.signupForm.password.length < 8) {
        alert('비밀번호는 8자 이상이어야 합니다.');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.signupForm.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      this.isLoading = true;
      
      try {
        const result = await memberAPI.signup({
          firstName: this.signupForm.firstName,
          lastName: this.signupForm.lastName,
          email: this.signupForm.email,
          phoneNumber: this.signupForm.phoneNumber,
          password: this.signupForm.password,
          confirmPassword: this.signupForm.confirmPassword,
          agreement: this.signupForm.agreement,
          turnstileToken: this.turnstileToken
        });
        
        if (result.data && result.data.token) {
          // JWT 토큰과 사용자 정보 저장
          localStorage.setItem('jwt_token', result.data.token);
          localStorage.setItem('user_info', JSON.stringify({
            id: result.data.memberId,
            firstName: result.data.firstName,
            lastName: result.data.lastName,
            email: result.data.email,
            provider: result.data.provider
          }));
          
          alert('회원가입이 완료되었습니다!');
          this.showScreen('payment');
        }
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        this.resetTurnstile();

      } finally {
        this.isLoading = false;
      }
    },
    resetTurnstile() {
      this.turnstileToken = null;
      if (window.turnstile && this.$refs.turnstileWidget) {
        window.turnstile.reset(this.$refs.turnstileWidget);
      }
    },
    // 결제수단 추가 메서드 - 실제 API 연동
    async submitPaymentMethod() {
      // 유효성 검사 강화
      if (!this.validatePaymentForm()) {
        return;
      }
      
      this.isPaymentLoading = true;
      
      try {
        // 서버 API 형식에 맞게 데이터 변환
        const cardData = {
          cardNumber: this.paymentForm.cardNumber.replace(/\s/g, ''), // 공백 제거
          cardExpirationMonth: this.paymentForm.expDate.split('/')[0],
          cardExpirationYear: this.paymentForm.expDate.split('/')[1],
          cardPassword: this.paymentForm.cardPassword, // 카드 비밀번호 앞 2자리
          customerName: this.paymentForm.nameOnCard
        };
        
        // 결제수단 등록 API 호출
        const response = await paymentMethodAPI.registerPaymentMethod(cardData);
        
        if (response && response.data) {
          alert('결제수단이 성공적으로 추가되었습니다!');
          this.$router.push('/hotelone');
        }
        
      } catch (error) {
        console.error('결제수단 추가 실패:', error);
        
        let errorMessage = '결제수단 추가에 실패했습니다.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
      } finally {
        this.isPaymentLoading = false;
      }
    },
    
    // 결제수단 유효성 검사 (강화된 버전)
    validatePaymentForm() {
      const validation = paymentMethodAPI.validateCardInfo({
        cardNumber: this.paymentForm.cardNumber,
        expiry: this.paymentForm.expDate,
        cardPassword: this.paymentForm.cardPassword, // CVC → cardPassword
        name: this.paymentForm.nameOnCard
      });

      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return false;
      }

      return true;
    },
    
    // 다음에 하기 버튼 클릭 시
    skipPayment() {
      alert('결제수단은 나중에 추가할 수 있습니다.');
      this.$router.push('/hotelone');
    },
    
    // Input formatting methods - paymentMethodAPI 활용
    formatCardNumber() {
      this.paymentForm.cardNumber = paymentMethodAPI.formatCardNumber(this.paymentForm.cardNumber);
    },
    
    formatExpDate() {
      this.paymentForm.expDate = paymentMethodAPI.formatExpiryDate(this.paymentForm.expDate);
    },
    
    // 카드 비밀번호 포맷팅 (2자리 숫자로 제한)
    formatCardPassword() {
      this.paymentForm.cardPassword = this.paymentForm.cardPassword.replace(/\D/g, '').substring(0, 2);
    },
    
    // Social login functions
    loginWithGoogle() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/google';
    },
    
    loginWithKakao() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/kakao';
    },
    
    loginWithNaver() {
      window.location.href = 'http://localhost:8089/oauth2/authorization/naver';
    }
  },
  
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'success') {
      alert('소셜 로그인이 완료되었습니다!');
      window.history.replaceState({}, document.title, window.location.pathname);
      this.$router.push('/hotelone');
    } else if (urlParams.get('error') === 'oauth_failed') {
      alert('소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}
</script>

<style scoped>
/* ===== 기본 설정 ===== */
.hotel-signup-container {
  width: 100%;
  min-height: 100vh;
  font-family: 'Montserrat', Arial, sans-serif;
}

/* ===== 메인 컨테이너 ===== */
.container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* ===== 이미지 슬라이더 구역 ===== */
.image-section {
  flex: 1;
  width: 50%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-container {
  width: 488px;
  height: 816px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.slider-wrapper {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  width: 488px;
  height: 816px;
  flex-shrink: 0;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
}

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

/* ===== 폼 컨테이너 구역 ===== */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 2rem;
}

.form-wrapper {
  width: 640px;
  max-width: 100%;
}

/* ===== 폼 헤더 구역 ===== */
.form-header h1 {
  font-family: Acme;
  font-weight: 400;
  font-size: 40px;
  line-height: 1.2;
  margin-bottom: 10px;
  color: #333;
}

.form-header p {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 48px;
  color: #666;
}

/* ===== 공통 입력 필드 구역 ===== */
.input-group {
  width: 100%;
  height: 56px;
  margin-bottom: 24px;
  position: relative;
}

.input-group label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: white;
  padding: 0 4px;
  font-family: Montserrat;
  font-weight: 400;
  font-size: 14px;
  color: #666;
  z-index: 1;
}

.input-group input, 
.input-group select {
  width: 100%;
  height: 100%;
  padding: 16px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: Montserrat;
  font-weight: 400;
  font-size: 16px;
  background: white;
  transition: border-color 0.3s ease;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #7dd3c0;
  border-width: 2px;
}

.input-group input:focus + label,
.input-group select:focus + label {
  color: #7dd3c0;
}

/* ===== 회원가입 전용 입력 그룹 ===== */
.signup-name-row {
  display: flex;
  gap: 24px;
  width: 100%;
  margin-bottom: 24px;
}

.signup-name-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

.signup-contact-row {
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 24px;
}

.signup-contact-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

.signup-password-group {
  display: block;
  width: 100%;
  margin-bottom: 24px;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
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
  z-index: 2;
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

/* ===== 옵션 및 버튼 구역 ===== */
.form-options {
  width: 100%;
  margin: 32px 0;
}

.checkbox-group {
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-group input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 0;
}

.checkbox-group label {
  position: static;
  background: none;
  padding: 0;
  font-size: 14px;
  cursor: pointer;
}

.submit-button {
  width: 100%;
  height: 48px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #7dd3c0;
  color: black;
  border: none;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 32px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #6bc4a6;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* ===== 구분선 구역 ===== */
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
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.social-btn {
  width: 50%;
  height: 56px;
  border: 1px solid rgba(141, 211, 187, 1);
  border-radius: 4px;
  background-color: white;
  padding: 16px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.social-btn:hover {
  background-color: #f5f5f5;
}

.social-btn img {
  width: 24px;
  height: 24px;
}

/* ===== 결제수단 전용 스타일 ===== */
.payment-form-wrapper {
  width: 640px;
  height: 668px;
}

.payment-header {
  margin-bottom: 40px;
}

.back-button {
  width: 36px;
  height: 17px;
  angle: 0 deg;
  opacity: 1;
  background: none;
  border: none;
  font-family: Montserrat;
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  color: #333;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-weight: 500;
}

.back-button:hover {
  color: #7dd3c0;
}

.back-button span {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

.payment-header h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.payment-header p {
  font-size: 16px;
  color: #666;
  margin-bottom: 0;
}

/* ===== 결제수단 입력 그룹 - 회원가입과 동일한 스타일 적용 ===== */
.payment-row {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 56px;
  margin-bottom: 25px;
}

.payment-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

/* 카드 로고 스타일 */
.card-input-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-logo {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 4px;
  z-index: 2;
}

.card-logo img{
  width: 24px;
  height: 15.072000503540039px;
  angle: 0 deg;
  opacity: 1;
  top: 4.46px;

}

/* 체크박스 스타일 */
.payment-checkbox {
  margin: 30px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 0;
}

.payment-checkbox label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

/* 결제 버튼들 */
.payment-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.payment-submit-button {
  width: 100%;
  height: 48px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #7dd3c0;
  color: black;
  border: none;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.payment-submit-button:hover {
  background: #6bc4a6;
}

.payment-submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 다음에 하기 버튼 스타일 */
.skip-payment-button {
  width: 100%;
  height: 48px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: transparent;
  color: #7dd3c0;
  border: 2px solid #7dd3c0;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skip-payment-button:hover {
  background-color: #7dd3c0;
  color: white;
}

.skip-payment-button:disabled {
  background-color: transparent;
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}

.payment-terms {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 12px;
  line-height: 100%;
  text-align: center;
}

/* ===== 화면 전환 제어 ===== */
.screen {
  display: none;
}

.screen.active {
  display: flex;
  height: 100vh;
  width: 100%;
}
.turnstile-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>