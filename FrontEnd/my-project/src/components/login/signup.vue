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
              <!-- ✅ 이메일 - 구글은 읽기전용, 카카오/네이버는 입력 가능 -->
              <div class="input-group">
                <input 
                  type="email" 
                  id="signup-email" 
                  v-model="signupForm.email"
                  placeholder="john.doe@gmail.com" 
                  maxlength="100" 
                  :required="!isSocialLogin || socialUserInfo.provider === 'kakao' || socialUserInfo.provider === 'naver'"
                  :readonly="isSocialLogin && socialUserInfo.provider === 'google'"
                  :disabled="isSocialLogin && socialUserInfo.provider === 'google'"
                >
                <label for="signup-email">
                  Email
                  <span v-if="isSocialLogin && socialUserInfo.provider === 'google'"> (소셜 계정 정보)</span>
                </label>
              </div>
              
              <!-- ✅ 전화번호 - 자동 포맷팅 -->
              <div class="input-group">
                <input 
                  type="tel" 
                  id="phone-number" 
                  v-model="signupForm.phoneNumber"
                  placeholder="010-1234-5678" 
                  maxlength="13"
                  @input="formatPhoneNumber"
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

            <!-- ✅ Password Input Section - 비밀번호 강도 체크 추가 -->
            <div v-if="!isSocialLogin" class="signup-password-section">
              <!-- 비밀번호 입력 -->
              <div class="input-group password-input-group">
                <div class="password-input-wrapper">
                  <input 
                    :type="showPassword.signup ? 'text' : 'password'" 
                    id="signup-password" 
                    v-model="signupForm.password"
                    placeholder="*************" 
                    maxlength="255"
                    @input="checkPasswordStrength"
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
                <label for="signup-password">비밀번호</label>
                
                <!-- ✅ 비밀번호 조건 표시 -->
                <div class="password-requirements">
                  <div class="requirement-item" :class="{ valid: passwordChecks.minLength }">
                    <span class="check-icon">✓</span>
                    <span>최소 8자</span>
                  </div>
                  <div class="requirement-item" :class="{ valid: passwordChecks.hasComplexity }">
                    <span class="check-icon">✓</span>
                    <span>영문, 숫자, 특수문자 3가지 조합</span>
                  </div>
                </div>
              </div>
              
              <!-- 비밀번호 확인 -->
              <div class="input-group password-confirm-group">
                <div class="password-input-wrapper">
                  <input 
                    :type="showPassword.confirm ? 'text' : 'password'" 
                    id="confirm-password" 
                    v-model="signupForm.confirmPassword"
                    placeholder="*************" 
                    maxlength="255"
                    @input="checkPasswordMatch"
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
                <label for="confirm-password">비밀번호 확인</label>
                
                <!-- ✅ 비밀번호 일치 여부 표시 -->
                <div v-if="signupForm.confirmPassword" class="password-match">
                  <div class="requirement-item" :class="{ valid: passwordChecks.match }">
                    <span class="check-icon">{{ passwordChecks.match ? '✓' : '✗' }}</span>
                    <span>{{ passwordChecks.match ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다' }}</span>
                  </div>
                </div>
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
              <button type="submit" class="submit-button" :disabled="isLoading || (!isSocialLogin && !isPasswordValid)">
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
      
      // ✅ 비밀번호 체크 상태
      passwordChecks: {
        minLength: false,
        hasComplexity: false,
        match: false
      },
      
      turnstileToken: null,
      turnstileWidgetId: null,
      
      paymentForm: {
        cardNumber: '',
        expDate: '',
        cvv: '',
        cardholderName: '',
        billingAddress: '',
        saveCard: false,
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
    },
    
    // ✅ 비밀번호 유효성 검사
    isPasswordValid() {
      if (this.isSocialLogin) return true;
      return this.passwordChecks.minLength && 
             this.passwordChecks.hasComplexity && 
             this.passwordChecks.match;
    }
  },
  
  mounted() {
    this.startImageSlider();
    this.loadTurnstileScript();
    
    // ✅ sessionStorage에 socialSignupData가 있을 때만 실행
    const savedSocialData = sessionStorage.getItem('socialSignupData');
    if (savedSocialData) {
      this.handleSocialLoginCallback();
    }
  },
  
  methods: {
    // ✅ 전화번호 자동 포맷팅
    formatPhoneNumber(event) {
      let value = event.target.value.replace(/[^0-9]/g, '');
      
      if (value.length <= 3) {
        this.signupForm.phoneNumber = value;
      } else if (value.length <= 7) {
        this.signupForm.phoneNumber = value.slice(0, 3) + '-' + value.slice(3);
      } else if (value.length <= 11) {
        this.signupForm.phoneNumber = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
      } else {
        this.signupForm.phoneNumber = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
      }
    },
    
    // ✅ 비밀번호 강도 체크
    checkPasswordStrength() {
      const password = this.signupForm.password;
      
      // 최소 8자
      this.passwordChecks.minLength = password.length >= 8;
      
      // 영문, 숫자, 특수문자 3가지 조합
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      const complexityCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
      this.passwordChecks.hasComplexity = complexityCount >= 3;
      
      // 비밀번호 일치 여부도 다시 체크
      this.checkPasswordMatch();
    },
    
    // ✅ 비밀번호 일치 여부 체크
    checkPasswordMatch() {
      if (this.signupForm.confirmPassword) {
        this.passwordChecks.match = this.signupForm.password === this.signupForm.confirmPassword;
      } else {
        this.passwordChecks.match = false;
      }
    },
    
    // 소셜 로그인 콜백 처리
    handleSocialLoginCallback() {
      const savedSocialData = sessionStorage.getItem('socialSignupData');
      
      if (savedSocialData) {
        try {
          const socialData = JSON.parse(savedSocialData);
          
          this.isSocialLogin = true;
          this.socialUserInfo = socialData.socialInfo;
          this.tempToken = socialData.tempToken;
          
          // ✅ 이메일 설정: 구글만 자동 입력, 카카오/네이버는 비워둠
          if (socialData.socialInfo.provider === 'google') {
            this.signupForm.email = socialData.socialInfo.email || '';
          } else {
            // 카카오, 네이버는 사용자가 직접 입력하도록 비워둠
            this.signupForm.email = '';
          }
                    
        } catch (error) {
          console.error('소셜 데이터 파싱 실패:', error);
          sessionStorage.removeItem('socialSignupData');
        }
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
    
    // ✅ 소셜 회원가입 완료
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
      
      // ✅ 카카오/네이버는 이메일 필수
      if ((this.socialUserInfo.provider === 'kakao' || this.socialUserInfo.provider === 'naver') 
          && !this.signupForm.email) {
        alert('이메일을 입력해주세요.');
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
        const requestData = {
          phoneNumber: this.signupForm.phoneNumber.replace(/-/g, ''),
          roadAddress: this.signupForm.roadAddress,
          detailAddress: this.signupForm.detailAddress || null,
          turnstileToken: this.turnstileToken
        };
        
        // ✅ 카카오/네이버만 이메일 추가
        if (this.socialUserInfo.provider === 'kakao' || this.socialUserInfo.provider === 'naver') {
          requestData.email = this.signupForm.email;
        }
        
        console.log('소셜 회원가입 요청 데이터:', requestData);
        
        const response = await memberAPI.completeSocialSignup(requestData, this.tempToken);
        
        // 응답에서 토큰 추출
        let finalToken;
        if (response.data?.data?.token) {
          finalToken = response.data.data.token;
        } else if (response.data?.token) {
          finalToken = response.data.token;
        } else {
          throw new Error('응답에서 토큰을 찾을 수 없습니다.');
        }
        
        if (!finalToken) {
          throw new Error('토큰을 받지 못했습니다.');
        }
        
        // localStorage에 토큰 저장
        localStorage.setItem('jwt_token', finalToken);
        
        // 저장 확인
        const saved = localStorage.getItem('jwt_token');
        if (!saved) {
          alert('토큰 저장에 실패했습니다.');
          this.isLoading = false;
          return;
        }
        
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
        console.error('❌ 소셜 회원가입 실패:', error);
        
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
    
    // 일반 회원가입
    async regularSignup() {
      // ✅ 비밀번호 유효성 검사
      if (!this.isPasswordValid) {
        alert('비밀번호 조건을 모두 만족해주세요.');
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
          phoneNumber: this.signupForm.phoneNumber.replace(/-/g, ''),
          password: this.signupForm.password,
          confirmPassword: this.signupForm.confirmPassword,
          roadAddress: this.signupForm.roadAddress,
          detailAddress: this.signupForm.detailAddress || null,
          turnstileToken: this.turnstileToken,
          agreement: this.signupForm.agreement
        });
        
        // 토큰 저장
        if (result.data?.token) {
          authUtils.saveToken(result.data.token);
          
          alert('회원가입이 완료되었습니다!');
          this.showScreen('payment');
        } else {
          throw new Error('토큰을 받지 못했습니다.');
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
    },
    
    loginWithKakao() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8089';
      const authUrl = `${baseUrl}/oauth2/authorization/kakao`;
      window.location.href = authUrl;
    },
    
    loginWithGoogle() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8089';
      const authUrl = `${baseUrl}/oauth2/authorization/google`;
      window.location.href = authUrl;
    },
    
    loginWithNaver() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8089';
      const authUrl = `${baseUrl}/oauth2/authorization/naver`;
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
          },
          'error-callback': () => {
            this.turnstileToken = null;
          },
          'expired-callback': () => {
            this.turnstileToken = null;
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
    },
    
    formatCardNumber(event) {
      let value = event.target.value.replace(/\s/g, '');
      value = value.replace(/\D/g, '');
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      this.paymentForm.cardNumber = value;
    },
    
    async submitPaymentMethod() {
      if (!this.paymentForm.cardNumber || !this.paymentForm.expDate || 
          !this.paymentForm.cvv || !this.paymentForm.cardholderName) {
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
          cardPassword: this.paymentForm.cardPassword || '00',
          customerName: this.paymentForm.cardholderName,
          country: this.paymentForm.country || 'KR',
          isDefault: this.paymentForm.saveCard
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
  },
  
  beforeRouteLeave(to, from, next) {
    // 회원가입 완료하지 않고 떠나는 경우
    if (to.path === '/login' || to.path === '/hotelone') {
      console.log('회원가입 미완료 상태로 페이지 이동 → 소셜 데이터 정리');
      sessionStorage.removeItem('socialSignupData');
    }
    
    next();
  }
};
</script>

<style scoped>
/* 기존 CSS는 그대로 유지 - 여기서는 생략 */
</style>

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

/* ===== 폼 섹션 - 스크롤 가능 ===== */
.form-section {
  flex: 1;
  width: 50%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 40px 20px 40px;
  background-color: white;
  overflow-y: auto;
  max-height: 100vh;
}

/* 스크롤바 스타일링 (선택사항) */
.form-section::-webkit-scrollbar {
  width: 8px;
}

.form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.form-section::-webkit-scrollbar-thumb {
  background: #7dd3c0;
  border-radius: 10px;
}

.form-section::-webkit-scrollbar-thumb:hover {
  background: #6bc4a6;
}

.form-wrapper {
  width: 640px;
  max-width: 100%;
  padding-bottom: 80px; /* ✅ 하단 여백 증가 */
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

.input-group input[readonly],
.input-group input[disabled] {
  background-color: #f9f9f9;
  cursor: not-allowed;
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

/* ✅ 비밀번호 섹션 스타일 - 높이 자동 조절 */
.signup-password-section {
  margin-bottom: 25px;
}

/* ✅ 비밀번호 입력 그룹 - 높이 자동 */
.password-input-group {
  height: auto;
  min-height: 56px;
  margin-bottom: 15px;
}

/* ✅ 비밀번호 확인 그룹 - 높이 자동 */
.password-confirm-group {
  height: auto;
  min-height: 56px;
  margin-bottom: 0;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
  height: 56px;
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

/* ✅ 비밀번호 조건 표시 스타일 */
.password-requirements,
.password-match {
  margin-top: 12px; /* ✅ 여백 증가 */
  padding: 12px; /* ✅ 패딩 증가 */
  background-color: #f8f9fa;
  border-radius: 4px;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px; /* ✅ 여백 증가 */
  line-height: 1.5; /* ✅ 줄간격 증가 */
}

.requirement-item:last-child {
  margin-bottom: 0;
}

.requirement-item.valid {
  color: #10b981;
}

.requirement-item .check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #9ca3af;
  font-size: 11px;
  font-weight: bold;
  flex-shrink: 0;
}

.requirement-item.valid .check-icon {
  background-color: #10b981;
  color: white;
}

/* ✅ 비밀번호 일치 표시 스타일 */
.password-match .requirement-item {
  margin-bottom: 0;
}

.password-match .requirement-item:not(.valid) {
  color: #ef4444;
}

.password-match .requirement-item:not(.valid) .check-icon {
  background-color: #ef4444;
  color: white;
}

.turnstile-wrapper {
  display: flex;
  justify-content: center;
  margin: 25px 0; /* ✅ 여백 조정 */
  min-height: 65px;
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
  max-height: calc(100vh - 80px);
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