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
                  v-model="signupForm.phone"
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path v-if="!showPassword.signup" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2" fill="none"/>
                      <circle v-if="!showPassword.signup" cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                      <path v-if="showPassword.signup" d="M9.88 9.88a3 3 0 1 0 4.24 4.24M2 12s3-7 10-7a9.902 9.902 0 0 1 5.13 1.31m3.15 3.15a7.98 7.98 0 0 1 1.72 4.54s-3 7-10 7a9.902 9.902 0 0 1-5.13-1.31M2 2l20 20" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path v-if="!showPassword.confirm" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="2" fill="none"/>
                      <circle v-if="!showPassword.confirm" cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                      <path v-if="showPassword.confirm" d="M9.88 9.88a3 3 0 1 0 4.24 4.24M2 12s3-7 10-7a9.902 9.902 0 0 1 5.13 1.31m3.15 3.15a7.98 7.98 0 0 1 1.72 4.54s-3 7-10 7a9.902 9.902 0 0 1-5.13-1.31M2 2l20 20" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                  </button>
                </div>
                <label for="confirm-password">Confirm Password</label>
              </div>
            </div>
            
            <!-- Options and Button Section -->
            <div class="form-options">
              <div class="checkbox-group">
                <input type="checkbox" id="agreement-checkbox" v-model="signupForm.agreement" required>
                <label for="agreement-checkbox">동의 하기</label>
              </div>
              <button type="submit" class="submit-button">계정 생성</button>
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
                  placeholder="4321 4321 4321 4321" 
                  inputmode="numeric" 
                  maxlength="19" 
                  required
                  @input="formatCardNumber"
                >
                <div class="card-logo">
                  <svg width="24" height="15" viewBox="0 0 40 24" fill="none">
                    <rect width="40" height="24" rx="4" fill="#1A1F71"/>
                    <path d="M16.5 7.5h7v9h-7z" fill="#FF5F00"/>
                    <circle cx="13" cy="12" r="6" fill="#EB001B"/>
                    <circle cx="27" cy="12" r="6" fill="#F79E1B"/>
                    <text x="20" y="16" text-anchor="middle" fill="white" font-size="6" font-family="Arial">VISA</text>
                  </svg>
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
                  type="text" 
                  id="cvc" 
                  v-model="paymentForm.cvc"
                  placeholder="123" 
                  maxlength="3" 
                  pattern="[0-9]{3}" 
                  required
                  @input="formatCVC"
                >
                <label for="cvc">CVC</label>
              </div>
            </div>

            <!-- Name Input Section -->
            <div class="input-group" style="margin-bottom: 25px;">
              <input 
                type="text" 
                id="name-card" 
                v-model="paymentForm.nameOnCard"
                placeholder="John Doe" 
                maxlength="50" 
                required
              >
              <label for="name-card">Name on Card</label>
            </div>

            <!-- Country Select Section -->
            <div class="input-group" style="margin-bottom: 25px;">
              <select name="country" id="country-select" v-model="paymentForm.country" required>
                <option value="US">United States</option>
                <option value="KR">South Korea</option>
              </select>
              <label for="country-select">Country or Region</label>
            </div>
            
            <!-- Checkbox Section -->
            <div class="payment-checkbox">
              <input type="checkbox" id="onetouch-checkbox" v-model="paymentForm.saveCard">
              <label for="onetouch-checkbox">저장하고 one 터치로 결제하기</label>
            </div>

            <!-- Payment Submit Button -->
            <button type="submit" class="payment-submit-button">결제수단 추가</button>
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
export default {
  name: 'HotelSignup',
  data() {
    return {
      currentScreen: 'signup',
      currentSlideIndex: 0,
      
      // Password visibility states
      showPassword: {
        signup: false,
        confirm: false
      },
      
      // Sign up form data
      signupForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreement: false
      },
      
      // Payment form data
      paymentForm: {
        cardNumber: '',
        expDate: '',
        cvc: '',
        nameOnCard: '',
        country: 'US',
        saveCard: false
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
      this.currentSlideIndex = 0; // Reset slider when changing screens
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
    submitSignUp() {
      if (!this.signupForm.agreement) {
        alert('약관에 동의해주세요.');
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
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.signupForm.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }
      
      console.log('Sign up data:', this.signupForm);
      alert('회원가입이 완료되었습니다! 이제 결제수단을 추가해주세요.');
      this.showScreen('payment');
    },
    
    submitPaymentMethod() {
      // Validate card number
      const cleanCardNumber = this.paymentForm.cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length !== 16) {
        alert('올바른 카드번호를 입력해주세요.');
        return;
      }
      
      // Validate CVC
      if (this.paymentForm.cvc.length !== 3) {
        alert('올바른 CVC를 입력해주세요.');
        return;
      }
      
      // Validate expiry date format
      if (!this.paymentForm.expDate.match(/^\d{2}\/\d{2}$/)) {
        alert('올바른 만료일을 입력해주세요. (MM/YY)');
        return;
      }
      
      console.log('Payment data:', this.paymentForm);
      alert('결제수단이 성공적으로 추가되었습니다!');
    },
    
    // Input formatting methods
    formatCardNumber() {
      let value = this.paymentForm.cardNumber.replace(/\s/g, '');
      let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) {
        formattedValue = formattedValue.substring(0, 19);
      }
      this.paymentForm.cardNumber = formattedValue;
    },
    
    formatExpDate() {
      let value = this.paymentForm.expDate.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      this.paymentForm.expDate = value;
    },
    
    formatCVC() {
      this.paymentForm.cvc = this.paymentForm.cvc.replace(/\D/g, '');
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

        /* 결제수단 추가 버튼 - submit-button과 동일한 스타일 */
        .payment-submit-button {
            width: 100%;
            height: 48px;
            angle: 0 deg;
            opacity: 1;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 4px;
            background-color: #7dd3c0;
            color: black;
            border: none;
            font-family: Montserrat;
            font-weight: 600;
            font-style: SemiBold;
            font-size: 14px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            cursor: pointer;
            margin-bottom: 15px;
        }

        .payment-submit-button:hover {
            background: #6bc4a6;
        }

        .payment-terms {
            font-family: Montserrat;
            font-weight: 400;
            font-style: Regular;
            font-size: 12px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
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