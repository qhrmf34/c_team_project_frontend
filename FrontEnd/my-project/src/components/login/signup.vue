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
            <p>{{ isSocialLogin ? '추가 정보 입력' : '회원 가입' }}</p>
          </header>

          <form @submit.prevent="submitSignUp">
            <!-- 이름 입력 섹션 - 소셜 로그인 시 한 칸으로 합침 -->
            <div v-if="isSocialLogin" class="input-group" style="margin-bottom: 25px;">
              <input 
                type="text" 
                id="full-name" 
                :value="displayName"
                placeholder="이름" 
                readonly
                disabled
              >
              <label for="full-name">Name (소셜 계정 정보)</label>
            </div>

            <!-- 일반 로그인 시 성/이름 분리 (기존 구조 유지) -->
            <div v-else class="signup-name-row">
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
              <!-- 이메일 - 소셜 로그인 시 처리 -->
              <div class="input-group">
                <input 
                  type="email" 
                  id="signup-email" 
                  v-model="signupForm.email"
                  placeholder="john.doe@gmail.com" 
                  maxlength="100" 
                  required
                  :readonly="isSocialLogin && socialUserInfo.provider === 'google'"
                  :disabled="isSocialLogin && socialUserInfo.provider === 'google'"
                >
                <label for="signup-email">
                  Email
                  <span v-if="isSocialLogin && socialUserInfo.provider === 'google'"> (소셜 계정 정보)</span>
                  <span v-else-if="isSocialLogin"> (자동 생성)</span>
                </label>
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

            <!-- 주소 검색 섹션 (DB 구조에 맞춤) -->
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

            <!-- Password Input Section - 소셜 로그인 시 숨김 -->
            <div v-if="!isSocialLogin" class="signup-password-group">
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
                {{ isLoading ? '가입 중...' : (isSocialLogin ? '회원가입 완료' : '계정 생성') }}
              </button>
            </div>
          </form>
          
          <!-- 소셜 로그인 버튼 - 일반 회원가입 시만 표시 -->
          <template v-if="!isSocialLogin">
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
          </template>
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
                >
                <label for="exp-date">Exp date</label>
              </div>
              <div class="input-group">
                <input 
                  type="text" 
                  id="cvv" 
                  v-model="paymentForm.cvv"
                  placeholder="123" 
                  inputmode="numeric" 
                  maxlength="4" 
                  required
                >
                <label for="cvv">CVV</label>
              </div>
            </div>

            <!-- Cardholder Name Input Section -->
            <div class="input-group" style="margin-bottom: 25px;">
              <input 
                type="text" 
                id="cardholder-name" 
                v-model="paymentForm.cardholderName"
                placeholder="John Doe" 
                required
              >
              <label for="cardholder-name">Cardholder Name</label>
            </div>

            <!-- Billing Address Input Section -->
            <div class="input-group" style="margin-bottom: 30px;">
              <input 
                type="text" 
                id="billing-address" 
                v-model="paymentForm.billingAddress"
                placeholder="123 Main St, City, State 12345" 
                required
              >
              <label for="billing-address">Billing Address</label>
            </div>

            <!-- Save Card Checkbox -->
            <div class="payment-checkbox">
              <input type="checkbox" id="save-card-checkbox" v-model="paymentForm.saveCard">
              <label for="save-card-checkbox">결제수단 저장</label>
            </div>

            <!-- Payment Buttons -->
            <div class="payment-buttons">
              <button type="submit" class="payment-submit-button" :disabled="isLoading">
                {{ isLoading ? '등록 중...' : '결제수단 등록' }}
              </button>
              <button type="button" class="skip-payment-button" @click="skipPayment" :disabled="isLoading">
                다음에 하기
              </button>
            </div>

            <!-- Terms and Privacy -->
            <p class="payment-terms">
              By signing up, you agree to the 
              <a href="#">Terms of Service</a> and 
              <a href="#">Privacy Policy</a>
            </p>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { memberAPI, paymentMethodAPI, authUtils } from '@/utils/commonAxios';
import DaumAddressPopup from '@/components/login/DaumAddres.vue';
import { formatMemberName } from '@/utils/nameFormatter';

export default {
  name: 'HotelSignUp',
  components: {
    DaumAddressPopup
  },
  data() {
    return {
      currentScreen: 'signup',
      currentSlideIndex: 0,
      isLoading: false,
      
      // 소셜 로그인 관련 데이터
      isSocialLogin: false,
      socialUserInfo: null,
      tempToken: null,
      
      signupForm: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        roadAddress: '',
        detailAddress: '',
        agreement: false
      },
      
      showPassword: {
        signup: false,
        confirm: false
      },
      
      turnstileToken: null,
      turnstileWidgetId: null,
      
      paymentForm: {
        cardNumber: '',
        expDate: '',
        cardPassword: '',
        nameOnCard: '',
        country: 'KR',
        setAsDefault: false
      },
    };
  },
  
  computed: {
    displayName() {
      if (!this.isSocialLogin || !this.socialUserInfo) {
        return '';
      }
      return formatMemberName(this.socialUserInfo);
    }
  },
  
  mounted() {
    this.startImageSlider();
    this.loadTurnstileScript();
    this.handleSocialLoginCallback();
  },
  
  methods: {
    // 소셜 로그인 콜백 처리
    handleSocialLoginCallback() {
      console.log('=== 소셜 로그인 콜백 처리 시작 ===');
      
      // sessionStorage에서 소셜 로그인 데이터 확인만
      const savedSocialData = sessionStorage.getItem('socialSignupData');
      
      if (savedSocialData) {
        try {
          const socialData = JSON.parse(savedSocialData);
          
          this.isSocialLogin = true;
          this.socialUserInfo = socialData.socialInfo;
          this.tempToken = socialData.tempToken;
          
          // 이메일 설정
          if (socialData.socialInfo.provider === 'google') {
            this.signupForm.email = socialData.socialInfo.email || '';
          } else {
            this.signupForm.email = `${socialData.socialInfo.provider} 계정 (서버에서 자동 생성)`;
          }
                    
        } catch (error) {
          sessionStorage.removeItem('socialSignupData');
        }
      } else {
        console.log('sessionStorage에 소셜 데이터 없음 - 일반 회원가입 모드');
      }
    },
    
    // 회원가입 제출
    async submitSignUp() {
      if (this.isSocialLogin) {
        await this.completeSocialSignup();
      } else {
        await this.regularSignup();
      }
    },
    
    // 소셜 회원가입 완료
    async completeSocialSignup() {
      // 유효성 검사
      if (!this.turnstileToken) {
        alert('보안 검증을 완료해주세요.');
        return;
      }
      
      if (!this.signupForm.agreement) {
        alert('약관에 동의해주세요.');
        return;
      }
      
      if (!this.signupForm.phoneNumber) {
        alert('전화번호를 입력해주세요.');
        return;
      }
      
      if (!this.signupForm.roadAddress) {
        alert('주소를 입력해주세요.');
        return;
      }
      
      this.isLoading = true;
      
      try {
        const response = await memberAPI.completeSocialSignup({
          phoneNumber: this.signupForm.phoneNumber,
          roadAddress: this.signupForm.roadAddress,
          detailAddress: this.signupForm.detailAddress || null,
          turnstileToken: this.turnstileToken
        }, this.tempToken);
        
        let finalToken, finalMemberId;
        
        // 응답 구조 파악
        if (response.data.data) {
          // Case 1: { data: { data: { token, memberId } } }
          finalToken = response.data.data.token;
          finalMemberId = response.data.data.memberId;
        } else if (response.data.token) {
          // Case 2: { data: { token, memberId } }
          finalToken = response.data.token;
          finalMemberId = response.data.memberId;
        } else {
          throw new Error('응답에서 토큰을 찾을 수 없습니다.');
        }
        
        console.log('추출된 정보:');
        console.log('- finalToken:', finalToken ? '있음' : '없음');
        console.log('- finalMemberId:', finalMemberId);
        
        if (!finalToken || !finalMemberId) {
          throw new Error('토큰 또는 memberId를 받지 못했습니다.');
        }
        
        // authUtils.saveAuth() 사용 (로그인 상태 유지)
        const finalUserInfo = {
          id: finalMemberId,
          firstName: this.socialUserInfo.firstName,
          lastName: this.socialUserInfo.lastName,
          email: this.socialUserInfo.email,
          provider: this.socialUserInfo.provider
        };
        
        authUtils.saveAuth(finalToken, finalUserInfo);
                
        // sessionStorage 정리 (회원가입 완료)
        sessionStorage.removeItem('socialSignupData');
        
        // 상태 초기화
        const providerName = this.socialUserInfo?.provider || '소셜';
        this.isSocialLogin = false;
        this.socialUserInfo = null;
        this.tempToken = null;
        
        alert(`${providerName} 회원가입이 완료되었습니다!`);
        
        // 메인 페이지로 이동
        this.$router.push('/');
        
      } catch (error) {        
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else if (error.response?.status === 404) {
          alert('API 엔드포인트를 찾을 수 없습니다.');
        } else {
          alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
        
        this.resetTurnstile();
      } finally {
        this.isLoading = false;
      }
    },
    
    // 일반 회원가입
    async regularSignup() {
      // 유효성 검사
      if (this.signupForm.password !== this.signupForm.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      
      if (!this.turnstileToken) {
        alert('보안 검증을 완료해주세요.');
        return;
      }
      
      if (!this.signupForm.agreement) {
        alert('약관에 동의해주세요.');
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
          roadAddress: this.signupForm.roadAddress,
          detailAddress: this.signupForm.detailAddress || null,
          turnstileToken: this.turnstileToken,
          agreement: this.signupForm.agreement
        });
        
        console.log('=== 일반 회원가입 성공 ===');
        console.log('응답:', result.data);
        
        // 일반 회원가입 성공 시 토큰 저장
        if (result.data && result.data.token) {
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('memberId', result.data.memberId);
          
          alert('회원가입이 완료되었습니다!');
          
          // 결제수단 화면으로 이동
          this.showScreen('payment');
        }
        
      } catch (error) {
        console.error('❌ 일반 회원가입 실패:', error);
        
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
        
        this.resetTurnstile();
      } finally {
        this.isLoading = false;
      }
    },
    
    handleAddressSelected(addressData) {
      this.signupForm.roadAddress = addressData.roadAddress || addressData.jibunAddress;
      console.log('주소 선택:', this.signupForm.roadAddress);
    },
    
    loginWithKakao() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      const authUrl = `${baseUrl}/oauth2/authorization/kakao`;
      console.log('Kakao 로그인 시작:', authUrl);
      window.location.href = authUrl;
    },
    
    loginWithGoogle() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      const authUrl = `${baseUrl}/oauth2/authorization/google`;
      console.log('Google 로그인 시작:', authUrl);
      window.location.href = authUrl;
    },
    
    loginWithNaver() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080';
      const authUrl = `${baseUrl}/oauth2/authorization/naver`;
      console.log('Naver 로그인 시작:', authUrl);
      window.location.href = authUrl;
    },
    
    loadTurnstileScript() {
      if (document.getElementById('turnstile-script')) {
        this.renderTurnstile();
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.renderTurnstile();
      };
      document.head.appendChild(script);
    },
    
    renderTurnstile() {
      if (window.turnstile && this.$refs.turnstileWidget) {
        this.turnstileWidgetId = window.turnstile.render(this.$refs.turnstileWidget, {
          sitekey: process.env.VUE_APP_TURNSTILE_SITE_KEY,
          callback: (token) => {
            this.turnstileToken = token;
            console.log('Turnstile 토큰 생성됨');
          },
          'error-callback': () => {
            this.turnstileToken = null;
            console.error('Turnstile 오류 발생');
          },
          'expired-callback': () => {
            this.turnstileToken = null;
            console.warn('Turnstile 토큰 만료');
          },
          theme: 'light',
          size: 'normal'
        });
      }
    },
    
    resetTurnstile() {
      if (window.turnstile && this.turnstileWidgetId !== null) {
        window.turnstile.reset(this.turnstileWidgetId);
        this.turnstileToken = null;
        console.log('Turnstile 리셋됨');
      }
    },
    
    togglePassword(field) {
      this.showPassword[field] = !this.showPassword[field];
    },
    
    startImageSlider() {
      setInterval(() => {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % 3;
      }, 5000);
    },
    
    slideToImage(index) {
      this.currentSlideIndex = index;
    },
    
    showScreen(screen) {
      this.currentScreen = screen;
      console.log('화면 전환:', screen);
    },
    
    formatCardNumber(event) {
      let value = event.target.value.replace(/\s/g, '');
      value = value.replace(/\D/g, '');
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      this.paymentForm.cardNumber = value;
    },
    
    async submitPaymentMethod() {
      if (!this.paymentForm.cardNumber || !this.paymentForm.expDate || 
          !this.paymentForm.cardPassword || !this.paymentForm.nameOnCard) {
        alert('모든 필드를 입력해주세요.');
        return;
      }
      
      const expDateParts = this.paymentForm.expDate.split('/');
      if (expDateParts.length !== 2) {
        alert('만료일을 MM/YY 형식으로 입력해주세요.');
        return;
      }
      
      this.isLoading = true;
      
      try {
        const cardData = {
          cardNumber: this.paymentForm.cardNumber.replace(/\s/g, ''),
          cardExpirationMonth: expDateParts[0],
          cardExpirationYear: expDateParts[1],
          cardPassword: this.paymentForm.cardPassword,
          customerName: this.paymentForm.nameOnCard,
          country: this.paymentForm.country,
          isDefault: this.paymentForm.setAsDefault
        };
        
        const response = await paymentMethodAPI.registerPaymentMethod(cardData);
        
        if (response && response.data) {
          alert('결제수단이 성공적으로 추가되었습니다!');
          this.$router.push('/');
        }
      } catch (error) {
        console.error('결제수단 추가 실패:', error);
        alert(error.response?.data?.message || '결제수단 추가에 실패했습니다.');
      } finally {
        this.isLoading = false;
      }
    },
    
    skipPayment() {
      if (confirm('결제 수단 등록을 건너뛰시겠습니까?')) {
        this.$router.push('/');
      }
    }
  },
  
  beforeUnmount() {
    if (window.turnstile && this.turnstileWidgetId !== null) {
      window.turnstile.remove(this.turnstileWidgetId);
    }
  }
};
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

.address-section {
  margin-bottom: 25px;
}

.address-with-button {
  display: flex;
  gap: 10px;
  align-items: center;
}

.address-with-button input {
  flex: 1;
}

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

.turnstile-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

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

.screen {
  display: none;
}

.screen.active {
  display: flex;
  height: 100vh;
  width: 100%;
}
</style>