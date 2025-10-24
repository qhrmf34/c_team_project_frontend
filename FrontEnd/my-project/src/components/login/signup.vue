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

            <!-- ✅ 주소 검색 섹션 (DB 구조에 맞춤) -->
            <div class="address-section">
              <!-- 주소 + 주소 검색 버튼 -->
              <div class="input-group address-with-button">
                <input 
                  type="text" 
                  id="road-address" 
                  v-model="signupForm.roadAddress"
                  placeholder="주소" 
                  readonly
                  required
                >
                <label for="road-address">주소</label>
                
                <!-- 다음 주소 검색 컴포넌트 -->
                <DaumAddressPopup @address-selected="handleAddressSelected">
                  <template #trigger="{ open }">
                    <button type="button" class="inline-search-btn" @click="open">
                      주소 검색
                    </button>
                  </template>
                </DaumAddressPopup>
              </div>

              <!-- 상세 주소 (사용자 입력) -->
              <div class="input-group">
                <input 
                  type="text" 
                  id="detail-address" 
                  v-model="signupForm.detailAddress"
                  placeholder="상세 주소를 입력하세요 (예: 101동 1001호)" 
                  maxlength="50"
                >
                <label for="detail-address">상세 주소</label>
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

<script>
// commonAxios에서 필요한 API들 불러오기
import { memberAPI, paymentMethodAPI } from '@/utils/commonAxios'
import DaumAddressPopup from '@/components/login/DaumAddres.vue'

export default {
  name: 'HotelSignup',
  components: {
    DaumAddressPopup
  },
  
  data() {
    return {
      currentScreen: 'signup',
      currentSlideIndex: 0,
      isLoading: false,
      isPaymentLoading: false,
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
        agreement: false,
        
        // ✅ DB 구조에 맞춘 주소 필드
        roadAddress: '',      // VARCHAR(50) - 주소
        detailAddress: ''     // VARCHAR(50) - 상세주소
      },
      
      paymentForm: {
        cardNumber: '',
        expDate: '',
        cardPassword: '',
        nameOnCard: '',
        country: 'KR',
        saveCard: false
      }
    }
  },
  
  mounted() {
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
    if (window.turnstile && this.turnstileWidgetId !== null) {
      try {
        window.turnstile.remove(this.turnstileWidgetId);
      } catch (error) {
        console.error('Turnstile 위젯 제거 실패:', error);
      }
    }
    
    if (window.onTurnstileSuccess) {
      delete window.onTurnstileSuccess;
    }
    if (window.onTurnstileError) {
      delete window.onTurnstileError;
    }
  },
  
  methods: {
    loadTurnstileScript() {
      if (window.turnstile) {
        this.initTurnstile();
        return;
      }
    
      const existingScript = document.querySelector('script[src*="turnstile"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.initTurnstile();
        });
        return;
      }
    
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
      if (this.turnstileWidgetId) {
        console.log('Turnstile 위젯이 이미 렌더링되었습니다. 중복 렌더링 방지.');
        return;
      }
      
      window.onTurnstileSuccess = (token) => {
        this.turnstileToken = token;
        console.log('Turnstile 검증 성공');
      };

      window.onTurnstileError = (error) => {
        this.turnstileToken = null;
        console.error('Turnstile 검증 실패:', error);
        alert('로봇 검증에 실패했습니다. 페이지를 새로고침해주세요.');
      };

      this.$nextTick(() => {
        if (window.turnstile && this.$refs.turnstileWidget) {
          try {
            this.turnstileSiteKey = String(process.env.VUE_APP_TURNSTILE_SITE_KEY);
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
    
    /**
     * ✅ 다음 주소 검색 완료 후 처리 (DB 구조에 맞춤)
     */
    handleAddressSelected(addressData) {
      console.log('선택된 주소:', addressData);
      
      // DB의 road_address 컬럼에 저장 (VARCHAR(50))
      this.signupForm.roadAddress = addressData.roadAddress;
      
      // 건물명이 있고 아파트인 경우 상세주소에 미리 채우기 (선택사항)
      if (addressData.buildingName && addressData.apartment === 'Y') {
        this.signupForm.detailAddress = addressData.buildingName;
      } else {
        this.signupForm.detailAddress = '';
      }
      
      // 상세주소 입력란으로 자동 포커스 이동
      this.$nextTick(() => {
        const detailAddressInput = document.getElementById('detail-address');
        if (detailAddressInput) {
          detailAddressInput.focus();
        }
      });
    },
    
    /**
     * 회원가입 제출
     */
    async submitSignUp() {
      // 기본 유효성 검사
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

      const hasLetter = /[a-zA-Z]/.test(this.signupForm.password);
      const hasNumber = /[0-9]/.test(this.signupForm.password);
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(this.signupForm.password);
      
      if (!hasLetter || !hasNumber || !hasSpecial) {
        alert('비밀번호는 영문, 숫자, 특수기호를 각각 최소 1개 이상 포함해야 합니다.');
        return;
      }

      const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
      if (!phoneRegex.test(this.signupForm.phoneNumber)) {
        alert('01X-XXXX-XXXX 형식으로 입력해주세요.');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.signupForm.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      // ✅ 주소 유효성 검사
      if (!this.signupForm.roadAddress) {
        alert('주소를 검색해주세요.');
        return;
      }

      // DB VARCHAR(50) 길이 제한 체크
      if (this.signupForm.roadAddress.length > 50) {
        alert('주소가 너무 깁니다. (최대 50자)');
        return;
      }

      if (this.signupForm.detailAddress && this.signupForm.detailAddress.length > 50) {
        alert('상세 주소가 너무 깁니다. (최대 50자)');
        return;
      }

      this.isLoading = true;
      
      try {
        // ✅ 서버로 전송할 데이터 (DB 구조에 맞춤)
        const result = await memberAPI.signup({
          firstName: this.signupForm.firstName,
          lastName: this.signupForm.lastName,
          email: this.signupForm.email,
          phoneNumber: this.signupForm.phoneNumber,
          password: this.signupForm.password,
          confirmPassword: this.signupForm.confirmPassword,
          agreement: this.signupForm.agreement,
          
          // ✅ DB 주소 컬럼
          roadAddress: this.signupForm.roadAddress,           // VARCHAR(50)
          detailAddress: this.signupForm.detailAddress || null, // VARCHAR(50) NULL 허용
          
          turnstileToken: this.turnstileToken
        });
        
        if (result.data && result.data.token) {
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
    
    async submitPaymentMethod() {
      if (!this.validatePaymentForm()) {
        return;
      }
      
      this.isPaymentLoading = true;
      
      try {
        const cardData = {
          cardNumber: this.paymentForm.cardNumber.replace(/\s/g, ''),
          cardExpirationMonth: this.paymentForm.expDate.split('/')[0],
          cardExpirationYear: this.paymentForm.expDate.split('/')[1],
          cardPassword: this.paymentForm.cardPassword,
          customerName: this.paymentForm.nameOnCard
        };
        
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
    
    validatePaymentForm() {
      const validation = paymentMethodAPI.validateCardInfo({
        cardNumber: this.paymentForm.cardNumber,
        expiry: this.paymentForm.expDate,
        cardPassword: this.paymentForm.cardPassword,
        name: this.paymentForm.nameOnCard
      });

      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return false;
      }

      return true;
    },
    
    skipPayment() {
      alert('결제수단은 나중에 추가할 수 있습니다.');
      this.$router.push('/hotelone');
    },
    
    formatCardNumber() {
      this.paymentForm.cardNumber = paymentMethodAPI.formatCardNumber(this.paymentForm.cardNumber);
    },
    
    formatExpDate() {
      this.paymentForm.expDate = paymentMethodAPI.formatExpiryDate(this.paymentForm.expDate);
    },
    
    formatCardPassword() {
      this.paymentForm.cardPassword = this.paymentForm.cardPassword.replace(/\D/g, '').substring(0, 2);
    },
    
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
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.dot.active {
  background: white;
}

/* ===== 폼 섹션 ===== */
.form-section {
  flex: 1;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: white;
}

.form-wrapper {
  width: 640px;
  max-width: 100%;
}

/* ===== 폼 헤더 ===== */
.form-header {
  margin-bottom: 40px;
}

.form-header h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.form-header p {
  font-size: 16px;
  color: #666;
  margin-bottom: 0;
}

/* ===== 입력 그룹 ===== */
.input-group {
  position: relative;
  width: 100%;
  height: 56px;
  margin-bottom: 25px;
}

.input-group input,
.input-group select {
  width: 100%;
  height: 56px;
  padding: 16px;
  border: 1px solid rgba(17, 34, 17, 0.15);
  border-radius: 4px;
  font-family: Montserrat;
  font-weight: 400;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.3s;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #7dd3c0;
}

.input-group input[readonly] {
  background-color: #f9f9f9;
  cursor: pointer;
}

.input-group label {
  position: absolute;
  left: 16px;
  top: -8px;
  background: white;
  padding: 0 4px;
  font-size: 12px;
  color: #666;
  font-family: Montserrat;
  font-weight: 500;
}

/* ===== 이름 입력 행 ===== */
.signup-name-row {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 56px;
  margin-bottom: 25px;
}

.signup-name-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

/* ===== 연락처 입력 행 ===== */
.signup-contact-row {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 56px;
  margin-bottom: 25px;
}

.signup-contact-row .input-group {
  flex: 1;
  margin-bottom: 0;
}

/* ✅ ===== 주소 검색 섹션 스타일 ===== */
.address-section {
  margin-bottom: 25px;
}

/* 주소 검색 버튼이 있는 입력 그룹 */
.address-with-button {
  display: flex;
  gap: 10px;
  align-items: center;
}

.address-with-button input {
  flex: 1;
}

/* 인라인 주소 검색 버튼 */
.inline-search-btn {
  height: 56px;
  padding: 0 20px;
  background-color: #7dd3c0;
  color: black;
  border: none;
  border-radius: 4px;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.3s ease;
}

.inline-search-btn:hover {
  background-color: #6bc4a6;
}

.inline-search-btn:active {
  background-color: #5db399;
}

/* ===== 비밀번호 입력 그룹 ===== */
.signup-password-group {
  display: flex;
  gap: 20px;
  width: 100%;
  margin-bottom: 25px;
}

.signup-password-group .input-group {
  flex: 1;
  margin-bottom: 0;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 2;
}

.password-toggle img {
  width: 24px;
  height: 24px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.password-toggle:hover img {
  opacity: 1;
}

/* ===== Turnstile 위젯 ===== */
.turnstile-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

/* ===== 폼 옵션 및 버튼 ===== */
.form-options {
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
  opacity: 1;
  background: none;
  border: none;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #333;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
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

/* ===== 결제수단 입력 그룹 ===== */
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

.card-logo img {
  width: 24px;
  height: 15.072000503540039px;
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
</style>