<template>
  <div>
    <!-- Header -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item" @click="goToHotel">
            <span><img src="/images/hotel_img/hotel.jpg" ></span>
            Hotels
          </a>
        </div>
        
        <div class="nav-right">
          <a href="#" class="nav-item" @click="goToFavourites">
            <span><img src="/images/hotel_img/heart.jpg"></span>
            찜하기
          </a>
          <span>|</span>
          <div class="user-profile" @click="toggleDropdown">
          <div class="user-avatar" :style="{ backgroundImage: `url(${profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
          </div>
            <div class="online-dot">
              <img src="/images/hotel_account_img/dot.jpg"/>
              <div class="online-dot-back"></div>
            </div>
            <span>{{ displayUserName }}</span>
          </div>
        </div>
      </nav>
    </header>

    <div class="user-dropdown" :class="{ active: isDropdownActive }" ref="userDropdown">
      <!-- 로그인된 경우 -->
      <template v-if="isLoggedIn">
        <div class="dropdown-header">
        <div class="dropdown-avatar" :style="{ backgroundImage: `url(${profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>          
        <div class="dropdown-info">
            <h3>{{ displayUserName }}</h3>
            <p>{{ userStatus }}</p>
          </div>
        </div>
        <div class="dropdown-menu">
          <a href="#" class="dropdown-item" @click="goToAccount">
            <img src="/images/hotel_img/account.jpg">계정
          </a>
          <a href="#" class="dropdown-item" @click="goToPaymentHistory">
            <img src="/images/hotel_img/card.jpg">결제내역
          </a>
          <a href="#" class="dropdown-item">
            <img src="/images/hotel_img/setting.jpg">설정
          </a>
          <hr style="border: 0.5px solid rgba(17, 34, 17, 0.25);">
          <a href="#" class="dropdown-item" @click="handleLogout">
            <img src="/images/hotel_img/logout.jpg">로그아웃
          </a>
        </div>
      </template>

      <!-- 로그인되지 않은 경우 -->
      <template v-else>
        <div class="dropdown-header">
        <div class="dropdown-avatar" :style="{ backgroundImage: `url(${profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>          
          <div class="dropdown-info">
            <h3>Guest</h3>
            <p>로그인이 필요합니다</p>
          </div>
        </div>
        <div class="dropdown-menu">
          <a href="#" class="dropdown-item" @click="goToLogin">
            <img src="/images/hotel_img/account.jpg">로그인
          </a>
        </div>
      </template>
    </div>


    <!-- Screen 1: Login (로그인 안한 사용자용) -->
    <div class="screen" :class="{ active: currentScreen === 1 }">
      <main class="main-content">
        <div class="breadcrumb">
          <a href="#" @click.prevent="searchByCountry(hotelInfo.countryName)">{{ hotelInfo?.countryName || 'Turkey' }}</a>
          <span>></span>
          <a href="#" @click.prevent="searchByCity(hotelInfo.cityName)">{{ hotelInfo?.cityName || 'Istanbul' }}</a>
          <span>></span>
          <span>{{ hotelInfo?.hotelName || '호텔' }}</span>
        </div>
      
        <div class="booking-container">
          <div class="left-section">
            <div class="hotel-info">
              <div class="hotel-title-total">
                <h1 class="hotel-title">{{ formattedRoomName }}</h1>
                <span class="hotel-title-price">{{ formatPrice(baseFare) }}/night</span>
              </div>
              <div class="hotel-location">
                <span><img :src="getImageUrl(hotelInfo?.images?.[0])" alt="hotel" /></span>
                <span class="hotel-location-map">
                  <span class="hotel-location-hotel">{{ hotelInfo?.hotelName || '호텔' }}</span>
                  <div class="hotel-location-hotelmap"><img src="/images/hotel_img/map.jpg"/> {{ hotelInfo?.address || '주소' }}</div>
                </span>
              </div>
            
              <div class="date-section">
                <div class="date-item">
                  <div class="date-label">{{ formattedCheckIn }}</div>
                  <div class="date-value">Check-In</div>
                </div>
                <div class="hotel-icon">
                  <div><img src="/images/hotel_img/leftline.jpg" class="img2" alt="leftline"/></div>
                  <div><img src="/images/hotel_img/apart.jpg" class="img1" alt="apart"/></div>
                  <div><img src="/images/hotel_img/rightline.jpg" class="img2" alt="rightline"/></div>
                </div>
                <div class="date-item">
                  <div class="date-label">{{ formattedCheckOut }}</div>
                  <div class="date-value">Check-Out</div>
                </div>
              </div>
            </div>
          
            <!-- 로그인 섹션 (HotelLogin.vue 스타일 적용) -->
            <div class="login-section-full">
              <h2 class="section-title">로그인이 필요합니다</h2>
              <p class="login-subtitle">예약을 완료하려면 로그인해주세요</p>

            <form @submit.prevent="handleLoginInPaymentPage">
              <div class="input-group">
                <input 
                  type="email" 
                  id="email" 
                  v-model="loginForm.email"
                  placeholder="john.doe@gmail.com" 
                  maxlength="100"
                  required
                >
                <label for="email">Email</label>
              </div>

              <div class="input-group">
                <div class="password-input-wrapper">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    id="password" 
                    v-model="loginForm.password"
                    placeholder="••••••••••••••••" 
                    maxlength="255"
                    required
                  >
                  <button 
                    type="button" 
                    class="password-toggle" 
                    @click="togglePasswordVisibility"
                  >
                    <img 
                      :src="showPassword ? '/images/login_img/close-eye.jpg' : '/images/login_img/open-eye.jpg'" 
                      alt="Toggle Password" 
                    />
                  </button>
                </div>
                <label for="password">Password</label>
              </div>
            
              <!-- ✅ Turnstile 위젯 추가 -->
              <div class="turnstile-wrapper">
                <div 
                  ref="turnstileWidget"
                  class="cf-turnstile"
                ></div>
              </div>
            
              <div class="options">
                <button type="submit" class="login-button" :disabled="isLoggingIn">
                  {{ isLoggingIn ? '로그인 중...' : '로그인하고 예약하기' }}
                </button>
                <a href="#" class="signup-link" @click.prevent="goToSignup">회원가입</a>
              </div>
            </form>
            
              <div class="divider">
                <span class="divider-beeline"></span>
                <span>Or login with</span>
                <span class="divider-beeline"></span>
              </div>

              <div class="social-login">
                <button class="social-btn kakao-btn" @click="loginWithKakao">
                  <img src="/images/login_img/kakao.jpg" alt="카카오 로그인" width="24" height="24"/>
                </button>
                <button class="social-btn" @click="loginWithGoogle">
                  <img src="/images/login_img/google.jpg" alt="구글 로그인" width="24" height="24"/>
                </button>
                <button class="social-btn" @click="loginWithNaver">
                  <img src="/images/login_img/naver.jpg" alt="네이버 로그인" width="24" height="24"/>
                </button>
              </div>
            </div>
          </div>
        
          <!-- 우측 요약 정보 -->
          <div class="right-section">
            <div class="booking-summary">
              <div class="hotel-image">
                <img :src="getImageUrl(hotelInfo?.images?.[0])" alt="hotel"/>
                <div class="summary-hotel-info">
                  <div class="summary-title1">{{ hotelInfo?.hotelName || '호텔' }}</div>
                  <div class="summary-title2">{{ formattedRoomName }}</div>

                  <div class="rating">
                    <span class="rating-score">{{ hotelInfo?.averageRating?.toFixed(1) || '0.0' }}</span>
                    <span class="rating-text1">{{ getRatingText(hotelInfo?.averageRating) }}</span>
                    <span class="rating-text2"> {{ hotelInfo?.reviewCount || 0 }} reviews</span>
                  </div>
                </div>
              </div>

              <div class="hotel-beeline"></div>
            
              <div class="golobe-protection">
                Your booking is protected by <strong>golobe</strong>
              </div>
              <div class="hotel-beeline"></div>
            
              <div class="price-details">
                <div class="price-title">Price Details</div>

                <div class="price-breakdown">
                  <div class="price-item">
                    <span class="price-label">Base Fare ({{ bookingInfo.nights }}박)</span>
                    <span class="price-value">{{ formatPrice(baseFare) }}</span>
                  </div>
                </div>
                <div class="hotel-beeline"></div>
              
                <div class="total-price">
                  <div class="price-item">
                    <span class="price-label">Total</span>
                    <span class="price-value">{{ formatPrice(totalPrice) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <!-- Screen 2: Payment Method Selection -->
    <div class="screen" :class="{ active: currentScreen === 2 }">
      <main class="main-content">
        <div class="breadcrumb">
          <a href="#" @click.prevent="searchByCountry(hotelInfo.countryName)">{{ hotelInfo?.countryName || 'Turkey' }}</a>
          <span>></span>
          <a href="#" @click.prevent="searchByCity(hotelInfo.cityName)">{{ hotelInfo?.cityName || 'Istanbul' }}</a>
          <span>></span>
          <span>{{ hotelInfo?.hotelName || '호텔' }}</span>
        </div>

        <div class="booking-container">
          <div class="left-section">
            <div class="hotel-info">
              <div class="hotel-title-total">
                <h1 class="hotel-title">{{ formattedRoomName }}</h1>
                <span class="hotel-title-price">{{ formatPrice(baseFare) }}/night</span>
              </div>
              <div class="hotel-location">
                <span><img :src="getImageUrl(hotelInfo?.images?.[0])" alt="hotel" /></span>
                <span class="hotel-location-map">
                  <span class="hotel-location-hotel">{{ hotelInfo?.hotelName || '호텔' }}</span>
                  <div class="hotel-location-hotelmap"><img src="/images/hotel_img/map.jpg"/> {{ hotelInfo?.address || '주소' }}</div>
                </span>
              </div>
            
              <div class="date-section">
                <div class="date-item">
                  <div class="date-label">{{ formattedCheckIn }}</div>
                  <div class="date-value">Check-In</div>
                </div>
                <div class="hotel-icon">
                  <div><img src="/images/hotel_img/leftline.jpg" class="img2" alt="leftline"/></div>
                  <div><img src="/images/hotel_img/apart.jpg" class="img1" alt="apart"/></div>
                  <div><img src="/images/hotel_img/rightline.jpg" class="img2" alt="rightline"/></div>
                </div>
                <div class="date-item">
                  <div class="date-label">{{ formattedCheckOut }}</div>
                  <div class="date-value">Check-Out</div>
                </div>
              </div>
            </div>
                
            <div class="payment-section">
              <div 
                class="payment-method" 
                :class="{ selected: selectedPaymentMethod === 0 }"
                @click="selectPaymentMethod(0)"
              >
                <span class="payment-method-text">
                  전체결제
                  <div class="payment-method-content">전체 결제 후 예약 확정</div>
                </span>
                <div class="payment-radio"></div>
              </div>
              
              <div 
                class="payment-method" 
                :class="{ selected: selectedPaymentMethod === 1 }"
                @click="selectPaymentMethod(1)"
              >
                <span class="payment-method-text">
                  쿠폰 사용
                  <div class="payment-method-content">할인 쿠폰을 사용하여 결제</div>
                </span>
                <div class="payment-radio"></div>
              </div>
            </div>
            
            <!-- 쿠폰 선택 섹션 (selectedPaymentMethod === 1일 때만 표시) -->
            <div class="coupon-section" v-if="selectedPaymentMethod === 1">
              <h3 class="section-title">사용 가능한 쿠폰</h3>
              <div 
                v-for="coupon in availableCoupons" 
                :key="coupon.id"
                class="coupon-item"
                :class="{ selected: selectedCoupon?.id === coupon.id }"
                @click="selectCoupon(coupon)"
              >
                <div class="coupon-info">
                  <div class="coupon-name">{{ coupon.couponName }}</div>
                  <div class="coupon-discount">{{ coupon.discount }}% 할인</div>
                  <div class="coupon-expiry">만료일: {{ formatDate(coupon.lastDate) }}</div>
                </div>
                <div class="coupon-radio"></div>
              </div>
              
              <div v-if="availableCoupons.length === 0" class="no-coupons">
                사용 가능한 쿠폰이 없습니다.
              </div>
            </div>
            
            <!-- 카드 목록 -->
            <div class="card-list">
              <h3 class="section-title">결제수단 선택</h3>
              
              <!-- 저장된 카드들-->
              <div 
                v-for="(card, index) in savedCards"
                :key="card.id"
                class="saved-card" 
                :class="{ selected: selectedCard === index }"
                @click="selectCard(index)"
              >
                <div class="card-info">
                  <div class="card-icon">
                    <img :src="getCardTypeImage(card.cardType)" :alt="card.cardType">
                  </div>
                  <span class="card-number">****{{ card.lastFour }}</span>
                </div>
                <div class="card-radio"></div>
              </div>

              <!-- 카드 추가 버튼 -->
              <div class="add-card-btn" @click="openAddCardModal">
                <div class="plus-btn">+</div>
                <div class="add-card">Add a new card</div>
              </div>
            </div>
            <!-- ✅ 토스 위젯용 DOM (숨김 처리)
            <div class="toss-payment-section">
              <h3 class="section-title">결제수단 선택</h3>
              <div id="payment-widget"></div>
              <div id="agreement"></div>
            </div> -->

            <!-- <div style="position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;">
              <div id="payment-widget" style="width: 400px; min-height: 300px;"></div>
              <div id="agreement" style="width: 400px; min-height: 100px;"></div>
            </div> -->
            <!-- 결제 버튼 -->
            <button 
              class="payment-btn" 
              @click="openPaymentModal"
              :disabled="isProcessingPayment"
            >
              {{ isProcessingPayment ? '결제 처리 중...' : `${formatPrice(totalPrice)} 결제하기` }}
            </button>

            <!-- Add Card Modal -->
            <div class="modal" :class="{ active: modalActive }" @click="closeModalOnOverlay">
              <div class="modal-full">
                <div class="modal-content">
                  <div class="modal-header">
                    <button class="close-btn" @click="closeAddCardModal">&times;</button>
                  </div>
                  <div class="modal-card">
                    <div class="modal-title">카드추가</div>
                  
                    <form @submit.prevent="addNewCard">
                      <!-- Card Number -->
                      <div class="form-group card-number-group">
                        <label class="form-label">Card Number</label>
                        <div class="card-input-wrapper">
                          <input
                            type="text"
                            class="form-input"
                            placeholder="4330 1234 5678 1234"
                            maxlength="19"
                            v-model="cardForm.cardNumber"
                            @input="formatCardNumber"
                          />
                          <img src="/images/hotel_img/visa2.jpg" alt="VISA" class="card-logo" />
                        </div>
                      </div>
                    
                      <!-- Exp & 카드 비밀번호 -->
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">Exp. Date</label>
                          <input
                            type="text"
                            class="form-input"
                            placeholder="MM/YY"
                            maxlength="5"
                            v-model="cardForm.expDate"
                            @input="formatExpDate"
                          />
                        </div>
                        <div class="form-group">
                          <label class="form-label">카드 비밀번호 (앞 2자리)</label>
                          <input
                            type="password"
                            class="form-input"
                            placeholder="12"
                            maxlength="2"
                            v-model="cardForm.cardPassword"
                            @input="formatCardPassword"
                          />
                        </div>
                      </div>
                    
                      <!-- Name -->
                      <div class="form-group">
                        <label class="form-label">Name on Card</label>
                        <input
                          type="text"
                          class="form-input"
                          placeholder="홍길동"
                          v-model="cardForm.cardName"
                        />
                      </div>
                    
                      <!-- Country -->
                      <div class="form-group">
                        <label class="form-label">Country or Region</label>
                        <select class="form-input" v-model="cardForm.country">
                          <option value="KR">대한민국</option>
                          <option value="US">United States</option>
                          <option value="JP">Japan</option>
                        </select>
                      </div>
                    
                      <!-- Checkbox -->
                      <div class="form-group checkbox-group">
                        <input type="checkbox" id="saveInfo" v-model="cardForm.saveInfo" />
                        <label for="saveInfo">정보 저장하기</label>
                      </div>
                    
                      <!-- Button -->
                      <button 
                        type="submit" 
                        class="save-card-btn"
                        :disabled="isAddingCard"
                      >
                        {{ isAddingCard ? '등록 중...' : 'Add Card' }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="right-section">
            <div class="booking-summary">
              <div class="hotel-image">
                <img :src="getImageUrl(hotelInfo?.images?.[0])" alt="hotel"/>
                <div class="summary-hotel-info">
                  <div class="summary-title1">{{ hotelInfo?.hotelName || '호텔' }}</div>
                  <div class="summary-title2">{{ formattedRoomName }}</div>
                  
                  <div class="rating">
                    <span class="rating-score">{{ hotelInfo?.averageRating?.toFixed(1) || '0.0' }}</span>
                    <span class="rating-text1">{{ getRatingText(hotelInfo?.averageRating) }}</span>
                    <span class="rating-text2"> {{ hotelInfo?.reviewCount || 0 }} reviews</span>
                  </div>
                </div>
              </div>
                  
              <div class="hotel-beeline"></div>

              <div class="golobe-protection">
                Your booking is protected by <strong>golobe</strong>
              </div>
              <div class="hotel-beeline"></div>

              <div class="price-details">
                <div class="price-title">Price Details</div>
                
                <div class="price-breakdown">
                  <div class="price-item">
                    <span class="price-label">Base Fare ({{ bookingInfo.nights }}박)</span>
                    <span class="price-value">{{ formatPrice(baseFare) }}</span>
                  </div>
                  <div class="price-item">
                    <span class="price-label">Discount</span>
                    <span class="price-value">-{{ formatPrice(discount) }}</span>
                  </div>

                </div>
                <div class="hotel-beeline"></div>

                <div class="total-price">
                  <div class="price-item">
                    <span class="price-label">Total</span>
                    <span class="price-value">{{ formatPrice(totalPrice) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div class="payment-modal" :class="{ active: paymentModalActive }" @click="closePaymentModalOnOverlay">
      <div class="payment-modal-content">
        <div class="payment-modal-header">
          <h2>결제하기</h2>
          <button class="close-btn" @click="closePaymentModal">&times;</button>
        </div>

        <div class="payment-modal-body">
          <div class="payment-summary">
            <div class="summary-item">
              <span>결제 금액</span>
              <strong>{{ formatPrice(totalPrice) }}</strong>
            </div>
          </div>

          <div id="payment-widget"></div>
          <div id="agreement"></div>

          <button 
            class="confirm-payment-btn" 
            @click="processPayment"
            :disabled="isProcessingPayment || !isWidgetReady"
          >
            {{ isProcessingPayment ? '결제 처리 중...' : 
               !isWidgetReady ? '결제 준비 중...' :
               `${formatPrice(totalPrice)} 결제하기` }}
          </button>
        </div>
      </div>
    </div>
    <!-- Newsletter Section -->
    <section class="newsletter-section">
            </section>
      <div class="newsletter-content">
        <div class="newsletter-left">
          <h2 class="newsletter-title">구독서비스<br>신청해보세요</h2>

          <div class="newsletter-info">
            <div class="newsletter-brand">The Travel</div>
            <p class="newsletter-desc">구독자로 여행 할인, 팁 및 비하인드 정보를 받아보세요</p>
          </div>

          <div class="newsletter-form">
            <input type="email" class="newsletter-input" placeholder="Your email address" v-model="email">
            <button class="subscribe-btn" @click="subscribe">Subscribe</button>
          </div>
        </div>

        <div class="mailbox-container">
          <div class="mailbox-back"></div>
          <div class="mailbox-base"></div>
          <div class="mailbox-front"></div>
          <div class="mailbox-flag"></div>
          <div class="mailbox-flag2"></div>
          <div class="mailbox-pole"></div>
          <div class="mailbox-stand-base"></div>
          <div class="mailbox-stand-front"></div>
        </div>
      </div>

      <div class="footer-content">
        <div class="social-icons">
          <span><img src="/images/hotel_img/facebook.jpg" alt="facebook"></span>
          <span><img src="/images/hotel_img/twitter.jpg" alt="twitter"></span>
          <span><img src="/images/hotel_img/youtube.jpg" alt="youtube"></span>
          <span><img src="/images/hotel_img/instagram.jpg" alt="instagram"></span>
        </div>

        <div class="footer-links">
          <div class="footer-column">
            <h4>Our Destinations</h4>
            <a href="#">Canada</a>
            <a href="#">Alaksa</a>
            <a href="#">France</a>
            <a href="#">Iceland</a>
          </div>

          <div class="footer-column">
            <h4>Our Activities</h4>
            <a href="#">Northern Lights</a>
            <a href="#">Cruising & sailing</a>
            <a href="#">Multi-activities</a>
            <a href="#">Kayaking</a>
          </div>

          <div class="footer-column">
            <h4>Travel Blogs</h4>
            <a href="#">Bali Travel Guide</a>
            <a href="#">Sri Lanka Travel Guide</a>
            <a href="#">Peru Travel Guide</a>
            <a href="#">Bali Travel Guide</a>
          </div>

          <div class="footer-column">
            <h4>About Us</h4>
            <a href="#">Our Story</a>
            <a href="#">Work with us</a>
          </div>

          <div class="footer-column">
            <h4>Contact Us</h4>
            <a href="#">Our Story</a>
            <a href="#">Work with us</a>
          </div>
        </div>
      </div>
    <!-- 쿠폰 지급 모달 -->
    <div v-if="showCouponModal" class="coupon-modal-overlay" @click="closeCouponModal">
      <div class="coupon-modal" @click.stop>
        <div class="coupon-modal-header">
          <h2>🎉 쿠폰이 지급되었습니다!</h2>
          <button class="modal-close-btn" @click="closeCouponModal">✕</button>
        </div>
        
        <div class="coupon-modal-content">
          <p class="coupon-count">총 {{ receivedCoupons.length }}개의 쿠폰을 받았습니다</p>
          
          <div class="coupon-list">
            <div v-for="coupon in receivedCoupons" :key="coupon.id" class="coupon-item">
              <div class="coupon-badge">
                <span class="discount">{{ formatCouponDiscount(coupon.discount) }}</span>
                <span class="discount-label">할인</span>
              </div>
              
              <div class="coupon-info">
                <h3>{{ coupon.couponName }}</h3>
                <p class="coupon-expiry">유효기간: ~ {{ formatCouponDate(coupon.lastDate) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="coupon-modal-footer">
            <button class="btn-close" @click="closeCouponModal">닫기</button>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import { authUtils, paymentMethodAPI, memberCouponAPI, hotelAPI, adminAPI,paymentAPI,memberAPI,memberImageAPI } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'

export default {
  name: 'HotelFour',
  data() {
    return {
      isDropdownActive: false,
      currentScreen: 1,
      selectedPaymentMethod: 0,
      selectedCard: -1,
      selectedCoupon: null,
      modalActive: false,
      turnstileWidgetId: null,
      turnstileToken: null,
      turnstileSiteKey: '',
      showCouponModal: false,
      receivedCoupons: [],
      phoneNumber: '',
      email: '',
      // 로그인 폼 
      loginForm: {
        email: '',
        password: ''
      },
      showPassword: false,
      isLoggingIn: false,
      // 예약 정보
      // 예약 정보
      bookingInfo: {
        reservationId: null,
        roomId: null,
        hotelId: null,
        checkIn: null,
        checkOut: null,
        nights: 0,
        basePrice: 0
      },
      
      // 호텔 & 객실 정보
      hotelInfo: null,
      roomInfo: null,
      dailyPrices: [],
      
      // 카드 폼
      cardForm: {
        cardNumber: '',
        expDate: '',
        cardPassword: '',
        cardName: '',
        country: 'KR',
        saveInfo: false
      },
      
      // 사용자 정보
      userInfo: null,
      isLoggedIn: false,
      profileImageUrl: '/images/hotel_account_img/member.jpg',

      // 결제수단 & 쿠폰
      isAddingCard: false,
      isProcessingPayment: false,
      savedCards: [],
      availableCoupons: [],

      paymentModalActive: false,

      tossWidgets: null,
      isWidgetReady: false,
      TOSS_CLIENT_KEY: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      // 가격 계산
      baseFare: 0,
      discount: 0,

    }
  },
  
  computed: {
    totalPrice() {
      return this.baseFare - this.discount;
    },
    
    displayUserName() {
      if (this.isLoggedIn && this.userInfo) {
        return formatMemberName(this.userInfo);
      }
      return 'Guest';
    },
    // 침대 정보가 포함된 객실명 생성
    formattedRoomName() {
      if (!this.roomInfo) return 'Superior room';
      
      const bedInfo = [];
      if (this.roomInfo.roomDoubleBed > 0) {
        bedInfo.push(`${this.roomInfo.roomDoubleBed} 더블 베드`);
      }
      if (this.roomInfo.roomSingleBed > 0) {
        bedInfo.push(`${this.roomInfo.roomSingleBed} 싱글 베드`);
      }
      
      const bedText = bedInfo.length > 0 ? ` - ${bedInfo.join(' or ')}` : '';
      return `${this.roomInfo.roomName}${bedText}`;
    },
    
    userStatus() {
      if (this.isLoggedIn && this.userInfo?.provider) {
        const providerNames = {
          'local': 'Local Account',
          'google': 'Google Account',
          'kakao': 'Kakao Account',
          'naver': 'Naver Account'
        };
        return providerNames[this.userInfo.provider] || 'Online';
      }
      return this.isLoggedIn ? 'Online' : 'Offline';
    },
    
    formattedCheckIn() {
      if (!this.bookingInfo.checkIn) return '';
      const date = new Date(this.bookingInfo.checkIn);
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    },
    
    formattedCheckOut() {
      if (!this.bookingInfo.checkOut) return '';
      const date = new Date(this.bookingInfo.checkOut);
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    await this.handleSocialLoginCallback();

    this.loadUserInfo();
    
    // URL 파라미터에서 예약 정보 가져오기
    this.bookingInfo = {
      reservationId: this.$route.query.reservationId ? parseInt(this.$route.query.reservationId) : null,
      roomId: parseInt(this.$route.query.roomId),
      hotelId: parseInt(this.$route.query.hotelId),
      checkIn: this.$route.query.checkIn,
      checkOut: this.$route.query.checkOut,
      nights: parseInt(this.$route.query.nights),
      basePrice: parseFloat(this.$route.query.totalPrice)
    };
  
      // 날짜 검증 추가
    if (!this.validateDatesOnMount()) {
      return;
    }
    // 로그인 여부에 따라 화면 설정
    if (this.isLoggedIn) {
      this.currentScreen = 2;

      // reservationId가 없으면 예약 생성 (로그인 후 돌아온 경우)
      if (!this.bookingInfo.reservationId) {
        await this.createReservationAfterLogin();
      }

      await this.loadBookingData();
      await this.$nextTick();
      await this.loadTossSDK();

      await new Promise(resolve => setTimeout(resolve, 300));
      await this.initializeTossWidget();
    } else {
      // 로그인 안한 상태
      this.currentScreen = 1;
      await this.loadBasicBookingData();

      // Turnstile 로드
      this.$nextTick(() => {
        setTimeout(() => {
          this.loadTurnstileScript();
        }, 100);
      });
    }
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    // Turnstile 위젯 제거
    if (window.turnstile && this.turnstileWidgetId !== null) {
      try {
        window.turnstile.remove(this.turnstileWidgetId);
      } catch (error) {
        console.error('Turnstile 위젯 제거 실패:', error);
      }
    }
    // 전역 콜백 정리
    if (window.onTurnstileSuccess) {
      delete window.onTurnstileSuccess;
    }
    if (window.onTurnstileError) {
      delete window.onTurnstileError;
    }
  },
  
  watch: {
    '$route'() {
      this.loadUserInfo();
    },
    
    async selectedCoupon(newCoupon) {  
      if (newCoupon) {
        this.discount = Math.floor(this.baseFare * (newCoupon.discount / 100));
      } else {
        this.discount = 0;
    }
    await this.updateTossAmount();

    },
  },
  methods: {
    goToLogin() {
      this.isDropdownActive = false;
      this.$router.push('/login');
    },
    searchByCountry(countryName) {
      this.$router.push({
        path: '/hoteltwo',
        query: { 
          destination: countryName,
          checkIn: this.getToday(),
          checkOut: this.getTomorrow()
        }
      });
    },
    searchByCity(cityName) {
      this.$router.push({
        path: '/hoteltwo',
        query: { 
          destination: cityName,
          checkIn: this.getToday(),
          checkOut: this.getTomorrow()
        }
      });
    },
    getToday() {
      const today = new Date();
      return today.toLocaleDateString('en-CA'); // ISO형식 YYYY-MM-DD
    },

    getTomorrow() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString('en-CA');
    },

    // 결제 버튼 클릭 시 모달 열기
    async openPaymentModal() {
      // ✅ 이미 모달이 열려있으면 중단
      if (this.paymentModalActive) {
        console.log('결제 모달이 이미 열려있습니다.');
        return;
      }
    
      this.paymentModalActive = true;

      await this.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 200)); // 100ms -> 200ms로 증가

      try {
        await this.loadTossSDK();
        await this.initializeTossWidget();
      } catch (error) {
        console.error('결제 모듈 초기화 실패:', error);
        alert('결제 모듈을 불러오는데 실패했습니다.');
        this.closePaymentModal();
      }
    },

    // 모달 닫기
    closePaymentModal() {
      this.paymentModalActive = false;
      this.isWidgetReady = false;

      // ✅ 위젯 완전 제거
      if (this.tossWidgets) {
        try {
          // DOM 요소 내용 제거
          const paymentWidget = document.getElementById('payment-widget');
          const agreement = document.getElementById('agreement');
          if (paymentWidget) paymentWidget.innerHTML = '';
          if (agreement) agreement.innerHTML = '';
        } catch (error) {
          console.error('위젯 정리 실패:', error);
        }
      }

      this.tossWidgets = null;
    },
    async handleSocialLoginCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userInfoParam = urlParams.get('userInfo');
      const loginSuccess = urlParams.get('login');
    
      if (loginSuccess === 'success' && token && userInfoParam) {
        try {
          console.log('✅ 소셜 로그인 성공 - 토큰 저장 중...');

          // JWT 토큰 저장
          localStorage.setItem('jwt_token', token);

          // 사용자 정보 파싱 및 저장
          const userInfo = JSON.parse(decodeURIComponent(userInfoParam));
          localStorage.setItem('user_info', JSON.stringify(userInfo));

          // 세션에 저장된 예약 정보 복원
          const pendingReservation = sessionStorage.getItem('pendingReservation');
          const pendingGuests = sessionStorage.getItem('pendingGuests');

          if (pendingReservation) {
            const reservationData = JSON.parse(pendingReservation);

            // URL 파라미터 재설정 (clean URL로)
            const newQuery = {
              roomId: reservationData.roomId,
              hotelId: reservationData.hotelId,
              checkIn: reservationData.checkIn,
              checkOut: reservationData.checkOut,
              nights: reservationData.nights,
              totalPrice: reservationData.basePrice,
              guests: pendingGuests || 2
            };

            // URL 정리 (토큰과 userInfo 제거)
            await this.$router.replace({ 
              path: '/hotelfour', 
              query: newQuery 
            });

            // 세션 정리
            sessionStorage.removeItem('pendingReservation');
            sessionStorage.removeItem('pendingGuests');

            console.log('✅ 소셜 로그인 후 예약 정보 복원 완료');
          }

        } catch (error) {
          console.error('❌ 소셜 로그인 콜백 처리 실패:', error);
          alert('로그인 정보 처리에 실패했습니다.');
        }
      }
    },

  // ===== Turnstile 관련 =====
  
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
    // 이미 렌더링된 위젯이 있다면 중단
    if (this.turnstileWidgetId) {
      console.log('Turnstile 위젯이 이미 렌더링되었습니다.');
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
    validateDatesOnMount() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkInDate = new Date(this.bookingInfo.checkIn);
      const checkOutDate = new Date(this.bookingInfo.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);

      // 체크인이 과거인 경우
      if (checkInDate < today) {
        alert('과거 날짜로는 예약할 수 없습니다. 검색 페이지로 돌아갑니다.');
        this.$router.push('/hoteltwo');
        return false;
      }

      // 체크아웃이 체크인보다 이전이거나 같은 경우
      if (checkOutDate <= checkInDate) {
        alert('잘못된 날짜입니다. 검색 페이지로 돌아갑니다.');
        this.$router.push('/hoteltwo');
        return false;
      }

      return true;
    },
      // 로그인 후 예약 생성
    async createReservationAfterLogin() {
      try {
        const reservationData = {
          roomId: Number(this.bookingInfo.roomId),
          checkInDate: this.bookingInfo.checkIn,
          checkOutDate: this.bookingInfo.checkOut,
          guestsCount: Number(this.$route.query.guests) || 2,
          basePayment: String(this.bookingInfo.basePrice),
          reservationsStatus: false
        };

        const response = await paymentAPI.createReservation(reservationData);

        if (response.code === 200) {
          this.bookingInfo.reservationId = response.data.id;
          console.log('로그인 후 예약 생성 완료:', this.bookingInfo.reservationId);
        }
      } catch (error) {
        console.error('로그인 후 예약 생성 실패:', error);

        if (error.response?.status === 409) {
          const existingReservationId = error.response.data?.reservationId;
          if (existingReservationId) {
            this.bookingInfo.reservationId = existingReservationId;
            console.log('기존 예약 사용:', existingReservationId);
            return;
          }
        }

        alert('예약 생성에 실패했습니다. 다시 시도해주세요.');
        this.$router.push('/hoteltwo');
      }
    },
    // 결제 페이지 내 로그인 처리
    async handleLoginInPaymentPage() {
      if (!this.loginForm.email || !this.loginForm.password) {
        alert('이메일과 비밀번호를 입력해주세요.');
        return;
      }
    // ✅ Turnstile 검증 확인
    if (!this.turnstileToken) {
      alert('로봇 검증을 완료해주세요.');
      return;
    }
    
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.loginForm.email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      this.isLoggingIn = true;

      try {
        const result = await memberAPI.login({
          email: this.loginForm.email,
          password: this.loginForm.password,
          turnstileToken: this.turnstileToken  // Turnstile 토큰 전송

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

          this.loadUserInfo();

          // 예약 생성
          await this.createReservationAfterLogin();

          // 화면 전환
          this.currentScreen = 2;
          await this.loadBookingData();
          await this.$nextTick();
          await this.loadTossSDK();
          await new Promise(resolve => setTimeout(resolve, 300));
          await this.initializeTossWidget();

          alert('로그인이 완료되었습니다!');
        }
      } catch (error) {
        console.error('로그인 실패:', error);
        alert(error.response?.data?.message || '로그인에 실패했습니다.');
        this.resetTurnstile();  // 로그인 실패 시 Turnstile 리셋
      } finally {
        this.isLoggingIn = false;
      }
    },
      togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    loginWithKakao() {
      sessionStorage.setItem('pendingReservation', JSON.stringify(this.bookingInfo));
      sessionStorage.setItem('pendingGuests', this.$route.query.guests);

      // ✅ 쿠키 설정 추가
      document.cookie = 'returnToPayment=true; path=/; max-age=300'; // 5분 유효

      window.location.href = 'http://localhost:8089/oauth2/authorization/kakao';
    },


    loginWithGoogle() {
      sessionStorage.setItem('pendingReservation', JSON.stringify(this.bookingInfo));
      sessionStorage.setItem('pendingGuests', this.$route.query.guests);

      document.cookie = 'returnToPayment=true; path=/; max-age=300';

      window.location.href = 'http://localhost:8089/oauth2/authorization/google';
    },
    loginWithNaver() {
      sessionStorage.setItem('pendingReservation', JSON.stringify(this.bookingInfo));
      sessionStorage.setItem('pendingGuests', this.$route.query.guests);

      document.cookie = 'returnToPayment=true; path=/; max-age=300';

      window.location.href = 'http://localhost:8089/oauth2/authorization/naver';
    },

    goToSignup() {
      // 예약 정보 세션에 저장 후 회원가입 페이지로
      sessionStorage.setItem('pendingReservation', JSON.stringify(this.bookingInfo));
      sessionStorage.setItem('pendingGuests', this.$route.query.guests);
      this.$router.push('/signup');
    },
    // ===== 토스 SDK 로드 =====
    async loadTossSDK() {
      return new Promise((resolve, reject) => {
        if (window.TossPayments) {
          console.log('토스 SDK 이미 로드됨');
          resolve();
          return;
        }
              const script = document.createElement('script');
        script.src = 'https://js.tosspayments.com/v2/standard';
        script.async = true;
        script.onload = () => {
          console.log('✅ 토스 SDK 로드 완료');
          resolve();
        };
        script.onerror = (error) => {
          console.error('❌ 토스 SDK 로드 실패', error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    },
    
    // ===== 토스 위젯 초기화 =====
    async initializeTossWidget() {
      if (!window.TossPayments) {
        console.error('토스 SDK가 로드되지 않음');
        return;
      }
    
      // ✅ 이미 초기화되어 있으면 중단
      if (this.tossWidgets && this.isWidgetReady) {
        console.log('토스 위젯이 이미 초기화되어 있습니다.');
        return;
      }
    
      try {
        console.log('토스 위젯 초기화 시작...');
      
        await this.$nextTick();
      
        const paymentWidgetElement = document.getElementById('payment-widget');
        const agreementElement = document.getElementById('agreement');
      
        if (!paymentWidgetElement || !agreementElement) {
          console.error('결제 UI 요소를 찾을 수 없습니다');
          await new Promise(resolve => setTimeout(resolve, 500));
        
          if (!document.getElementById('payment-widget')) {
            throw new Error('결제 UI 요소가 렌더링되지 않았습니다');
          }
        }
      
        // ✅ 기존 내용 제거
        paymentWidgetElement.innerHTML = '';
        agreementElement.innerHTML = '';
      
        const tossPayments = window.TossPayments(this.TOSS_CLIENT_KEY);
        const customerKey = 'customer_' + this.userInfo.id;
        console.log('customerKey:', customerKey);
      
        this.tossWidgets = tossPayments.widgets({ customerKey });
      
        await this.tossWidgets.setAmount({
          currency: 'KRW',
          value: this.totalPrice
        });
      
        console.log('결제 UI 렌더링 시작...');
      
        await this.tossWidgets.renderPaymentMethods({
          selector: '#payment-widget',
          variantKey: 'DEFAULT'
        });
      
        console.log('이용약관 UI 렌더링 시작...');
      
        await this.tossWidgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT'
        });
      
        this.isWidgetReady = true;
        console.log('✅✅ 토스 위젯 초기화 및 렌더링 완료');
      
      } catch (error) {
        console.error('❌ 토스 위젯 초기화 실패:', error);
        console.error('에러 상세:', error.message);
      }
    },

        // ===== 금액 변경 시 위젯 업데이트 =====
        async updateTossAmount() {
          if (this.tossWidgets && this.isWidgetReady) {
            try {
              await this.tossWidgets.setAmount({
                currency: 'KRW',
                value: this.totalPrice
              });
              console.log('금액 업데이트:', this.totalPrice);
            } catch (error) {
              console.error('금액 업데이트 실패:', error);
            }
          }
        },  
    // 기본 예약 데이터 로드 (로그인 안한 상태)
    async loadBasicBookingData() {
      try {
        // 1. 호텔 정보 로드
        const hotelResponse = await hotelAPI.getHotelDetail(this.bookingInfo.hotelId, {
          checkIn: this.bookingInfo.checkIn,
          checkOut: this.bookingInfo.checkOut
        });
        if (hotelResponse.code === 200) {
          this.hotelInfo = hotelResponse.data;
        }
        
        // 2. 객실 상세 정보 로드
        const roomResponse = await hotelAPI.getRoomDetail(this.bookingInfo.roomId);
        if (roomResponse.code === 200) {
          this.roomInfo = roomResponse.data;
        }
        
        // 3. 날짜별 가격 로드
        const pricesResponse = await hotelAPI.getRoomDailyPrices(
          this.bookingInfo.roomId,
          this.bookingInfo.checkIn,
          this.bookingInfo.checkOut
        );
        if (pricesResponse.code === 200) {
          this.dailyPrices = pricesResponse.data;
          
          // Base Fare 계산
          this.baseFare = this.dailyPrices.reduce((sum, day) => sum + parseFloat(day.price), 0);
          

        }
        
      } catch (error) {
        console.error('예약 데이터 로드 실패:', error);
        alert('예약 정보를 불러오는데 실패했습니다.');
      }
    },
    
    // 전체 예약 데이터 로드 (로그인 상태)
    async loadBookingData() {
      try {
        await this.loadBasicBookingData();
        
        // 4. 저장된 카드 로드
        await this.loadSavedCards();
        
        // 5. 사용 가능한 쿠폰 로드
        await this.loadAvailableCoupons();
        
      } catch (error) {
        console.error('예약 데이터 로드 실패:', error);
        alert('예약 정보를 불러오는데 실패했습니다.');
      }
    },
    
    async loadSavedCards() {
      if (!this.isLoggedIn) return;
      
      try {
        const response = await paymentMethodAPI.getMyPaymentMethods();
        if (response && response.data) {
          this.savedCards = response.data.map(card => ({
            id: card.id,
            lastFour: card.cardLastFour || '****',
            expiryDate: '**/**',
            cardType: card.cardType || 'VISA',
          }));
        }
      } catch (error) {
        console.error('저장된 카드 로드 실패:', error);
      }
    },
    
    async loadAvailableCoupons() {
      if (!this.isLoggedIn) return;
      
      try {
        const response = await memberCouponAPI.getMyCoupons();
        if (response && response.data) {
          this.availableCoupons = response.data;
        }
      } catch (error) {
        console.error('쿠폰 로드 실패:', error);
      }
    },
    
    selectPaymentMethod(index) {
      this.selectedPaymentMethod = index;
      if (index === 0) {
        // 전체결제 선택 시 쿠폰 해제
        this.selectedCoupon = null;
      }
    },
    
    selectCard(index) {
  console.log('🔘 Card clicked:', {
    index,
    card: this.savedCards[index],
    currentSelectedCard: this.selectedCard
  });
  
  // ✅ Vue의 반응성을 위해 명시적으로 업데이트
  this.selectedCard = index;
  

  
  console.log('✅ Card selection updated:', this.selectedCard);    },
    
    selectCoupon(coupon) {
      if (this.selectedCoupon?.id === coupon.id) {
        // 이미 선택된 쿠폰을 다시 클릭하면 해제
        this.selectedCoupon = null;
      } else {
        this.selectedCoupon = coupon;
      }
    },
    

  // ===== 결제 처리 =====
  async processPayment() {
    console.log('=== 결제 시작 ===');
  
    // ✅ 이미 처리 중이면 중단
    if (this.isProcessingPayment) {
      console.log('이미 결제 처리 중입니다.');
      return;
    }
  
    if (!this.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    if (!this.tossWidgets || !this.isWidgetReady) {
      alert('결제 모듈이 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
  
    if (!this.bookingInfo.reservationId) {
      alert('예약 정보가 없습니다.');
      return;
    }
  
    this.isProcessingPayment = true;
  
    try {
      const orderId = 'ORDER_' + Date.now() + '_' + this.bookingInfo.reservationId;
    
      console.log('결제 요청:', {
        orderId,
        totalPrice: this.totalPrice,
        reservationId: this.bookingInfo.reservationId,
        couponId: this.selectedCoupon?.id || null
      });
    
      await this.tossWidgets.requestPayment({
        orderId: orderId,
        orderName: '호텔 예약 결제',
        successUrl: `${window.location.origin}/payment/success?reservationId=${this.bookingInfo.reservationId}&couponId=${this.selectedCoupon?.id || ''}`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: this.userInfo.email || 'customer@example.com',
        customerName: this.displayUserName,
        customerMobilePhone: this.phoneNumber || '01012341234'
      });
    
    } catch (error) {
      console.error('❌ 결제 요청 실패:', error);
    
      if (error.code === 'USER_CANCEL') {
        alert('결제가 취소되었습니다.');
      } else if (error.message?.includes('이미 다른 요청')) {
        alert('결제 처리 중입니다. 잠시만 기다려주세요.');
      } else {
        alert(error.message || '결제 처리 중 오류가 발생했습니다.');
      }
      
      this.isProcessingPayment = false;
    }
    // ✅ finally 제거 - 결제 성공 시 페이지 이동하므로
  },
    
    // 카드 추가
    async addNewCard(event) {
      event.preventDefault();
      
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        return;
      }
      
      if (!this.validateCardForm()) {
        return;
      }
      
      this.isAddingCard = true;
      
      try {
        const cardData = {
          cardNumber: this.cardForm.cardNumber.replace(/\s/g, ''),
          cardExpirationMonth: this.cardForm.expDate.split('/')[0],
          cardExpirationYear: this.cardForm.expDate.split('/')[1],
          cardPassword: this.cardForm.cardPassword,
          customerName: this.cardForm.cardName
        };
        
        const response = await paymentMethodAPI.registerPaymentMethod(cardData);
        
        if (response && response.data) {
          this.savedCards.push({
            id: response.data.id,
            lastFour: cardData.cardNumber.slice(-4),
            expiryDate: this.cardForm.expDate,
            cardType: this.determineCardType(cardData.cardNumber),
          });
          
          this.closeAddCardModal();
          alert('카드가 성공적으로 등록되었습니다!');
        }
        
      } catch (error) {
        console.error('카드 등록 실패:', error);
        alert(error.response?.data?.message || '카드 등록에 실패했습니다.');
      } finally {
        this.isAddingCard = false;
      }
    },
    
    showScreen(screenNumber) {
      if (screenNumber === 2 && !this.isLoggedIn) {
        alert('로그인이 필요합니다.');
        this.$router.push('/login');
        return;
      }
      
      if (screenNumber === 2) {
        this.loadBookingData();
      }
      
      this.currentScreen = screenNumber;
    },
    
    // 유틸리티 메서드들
    formatPrice(price) {
      if (!price) return '₩0';
      return '₩' + Math.floor(price).toLocaleString('ko-KR');
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/hotelflow4.jpg';
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('/images/')) return imagePath;
      return adminAPI.getImageUrl(imagePath);
    },
    
    getRatingText(rating) {
      if (!rating) return 'No Rating';
      if (rating >= 4.5) return 'Excellent';
      if (rating >= 4.0) return 'Very Good';
      if (rating >= 3.5) return 'Good';
      if (rating >= 3.0) return 'Average';
      return 'Fair';
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR');
    },
    
    validateCardForm() {
      const validation = paymentMethodAPI.validateCardInfo({
        cardNumber: this.cardForm.cardNumber,
        expiry: this.cardForm.expDate,
        cardPassword: this.cardForm.cardPassword,
        name: this.cardForm.cardName
      });

      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return false;
      }

      return true;
    },
    
    formatCardNumber() {
      this.cardForm.cardNumber = paymentMethodAPI.formatCardNumber(this.cardForm.cardNumber);
    },
    
    formatExpDate() {
      this.cardForm.expDate = paymentMethodAPI.formatExpiryDate(this.cardForm.expDate);
    },
    
    formatCardPassword() {
      this.cardForm.cardPassword = this.cardForm.cardPassword.replace(/\D/g, '').substring(0, 2);
    },
    
    determineCardType(cardNumber) {
      if (cardNumber.startsWith('4')) return 'VISA';
      if (cardNumber.startsWith('5')) return 'MasterCard';
      if (cardNumber.startsWith('3')) return 'AMEX';
      if (cardNumber.startsWith('35')) return 'JCB';
      if (cardNumber.startsWith('30')) return 'DinersClub';
      return 'CARD';
    },
    
    getCardTypeImage(cardType) {
      return paymentMethodAPI.getCardTypeImage(cardType);
    },
    
    openAddCardModal() {
      this.modalActive = true;
      this.resetCardForm();
    },
    
    closeAddCardModal() {
      this.modalActive = false;
      this.resetCardForm();
    },
    
    closeModalOnOverlay(event) {
      if (event.target === event.currentTarget) {
        this.closeAddCardModal();
      }
    },
    
    resetCardForm() {
      this.cardForm = {
        cardNumber: '',
        expDate: '',
        cardPassword: '',
        cardName: '',
        country: 'KR',
        saveInfo: false
      };
    },
    
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    handleClickOutside(event) {
      if (this.$refs.userDropdown && 
          !this.$refs.userDropdown.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    },
    
    async subscribe() {
      // 로그인 확인
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.')
        this.$router.push('/login')
        return
      }

      // 이메일 입력 여부 무시하고 바로 쿠폰 지급
      try {
        const response = await memberCouponAPI.subscribeAndReceiveCoupons()
        
        if (response.code === 200) {
          this.receivedCoupons = response.data || []
          this.showCouponModal = true
          this.newsletter.email = '' // 이메일 입력창 초기화
        }
      } catch (error) {
        console.error('쿠폰 지급 실패:', error)
        
        if (error.response?.status === 404) {
          alert('현재 지급 가능한 쿠폰이 없습니다.')
        } else if (error.response?.status === 401) {
          alert('로그인이 필요한 서비스입니다.')
          this.$router.push('/login')
        } else {
          alert(error.response?.data?.message || '쿠폰 지급 중 오류가 발생했습니다.')
        }
      }
    },

    closeCouponModal() {
      this.showCouponModal = false
      this.receivedCoupons = []
    },

    formatCouponDiscount(discount) {
      return `${discount}%`
    },

    formatCouponDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    },

    
    loadUserInfo() {
      this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
    
      if (this.isLoggedIn) {
        this.userInfo = authUtils.getUserInfo();
        console.log('사용자 정보:', this.userInfo);
        this.loadProfileImage();
      } else {
        this.userInfo = null;
        this.profileImageUrl = '/images/hotel_account_img/member.jpg';
      }
    },
    async loadProfileImage() {
      try {
        const response = await memberImageAPI.getProfileImage();
        if (response.code === 200 && response.data.imagePath) {
          const imagePath = response.data.imagePath;
          if (imagePath.startsWith('http')) {
            this.profileImageUrl = imagePath;
          } else {
            this.profileImageUrl = `http://localhost:8089/uploads${imagePath}`;
          }
        }
      } catch (error) {
        console.error('프로필 이미지 로드 실패:', error);
        this.profileImageUrl = '/images/hotel_account_img/member.jpg';
      }
    },

    
    async handleLogout() {
      if (confirm('로그아웃하시겠습니까?')) {
        try {
          await authUtils.logout();
          this.loadUserInfo();
          alert('로그아웃되었습니다.');
          this.$router.push('/login');
        } catch (error) {
          authUtils.logout();
          this.loadUserInfo();
          alert('로그아웃되었습니다.');
          this.$router.push('/login');
        }
      }
    },
    
    goToHotel() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelone');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    
    goToFavourites() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelsix');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },

    goToAccount() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelaccount');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    
    goToPaymentHistory() {
      if (this.isLoggedIn) {
        this.$router.push({
          path: '/hotelaccount',
          query: { tab: 'history' }
        });
        this.isDropdownActive = false;
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    }
  }
}
</script>

<style scoped>
        
  /* Header */
  .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 21px 104px;
      background: #FFFFFF;
      box-shadow: 0px 4px 16px rgba(17, 34, 17, 0.05);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 87px;
      width: 100%;
  }

  nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1232px;
      margin: 0 auto;
  }

  .nav-left {
      display: flex;
      align-items: center;
      gap: 4px;
  }

  .nav-right {
      display: flex;
      align-items: center;
      gap: 32px;
  }

  .nav-item {
      font-family: Montserrat;
      font-weight: 600;
      font-size: 14px;
      line-height: 100%;
      display: flex;
      align-items: center;
      gap: 4px;
      color: #112211;
      text-decoration: none;
  }

  .user-profile {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      font-family: Montserrat;
      font-weight: 600;
      font-size: 14px;
      line-height: 100%;
      color: #112211;
  }

  .user-avatar {
      width: 45px;
      height: 45px;
      background: #D9D9D9;
      border: 1px solid #000000;
      border-radius: 50%;
      position: relative;
  }

  .online-dot{
    display: flex;
  }
  .online-dot img{
      position: absolute;
      width: 18px;
      height: 18px;
      margin: 7px 0 0 -18px;
      z-index: 2;
  }
  .online-dot-back{
      position: absolute;
      width: 10px;
      height: 10px;
      margin: 10px 0 0 -15px;
      background-color: black;
      z-index: 1;
      border-radius: 50%;
  }

  /* User Dropdown */
  .user-dropdown {
      position: fixed;
      top: 82px;
      left: 64%;
      width: 329px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
      padding: 32px;
      display: none;
      z-index: 1001;
  }

  .user-dropdown.active {
      display: block;
  }

  .dropdown-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
  }

  .dropdown-avatar {
      width: 64px;
      height: 64px;
      background: #D9D9D9;
      border-radius: 50%;
  }

  .dropdown-info h3 {
      font-family: Montserrat;
      font-weight: 600;
      font-size: 16px;
      line-height: 100%;
      color: #112211;
      margin-bottom: 4px;
  }

  .dropdown-info p {
      font-family: Montserrat;
      font-weight: 400;
      font-size: 14px;
      line-height: 100%;
      color: #112211;
      opacity: 0.75;
  }

  .dropdown-menu {
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-top: 0.5px solid rgba(17, 34, 17, 0.25);
      padding-top: 24px;
  }

  .dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #112211;
      text-decoration: none;
      font-family: Montserrat;
      font-weight: 500;
      font-size: 14px;
      line-height: 100%;
      padding: 4px 0;
  }
  
  /* Main Content */
  .main-content {
      margin-top: 87px;
      padding: 40px 104px 60px;
      max-width: 1440px;
      margin: 87px auto 0;
      flex: 1;
  }

  /* Breadcrumb */
  .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 32px;
      font-family: Montserrat;
      font-weight: 400;
      font-size: 14px;
  }

  .breadcrumb a {
      color: #FF6B6B;
      text-decoration: none;
  }

  .breadcrumb span {
      color: #666666;
  }

  /* Hotel Info Section */
  .booking-container {
      display: flex;
      width: 1280px;
      height: auto;
      top: 181px;
      left: 80px;
      gap: 40px;
      angle: 0 deg;
      opacity: 1;
      margin-bottom: 140px;
  }

  .left-section {
      flex: 1;
      width: 790px;
      height: auto;
  }

  .hotel-info {
      width: 790px;
      height: 305px;
      border-radius: 12px;
      gap: 24px;
      angle: 0 deg;
      opacity: 1;
      padding: 32px 24px;
      background: #FFFFFF;
      box-shadow: 0px 4px 16px 0px #1122110D;
      margin-bottom: 40px;
  }
  .hotel-title-total{
    width: 742px;
    height: 33px;
    display: flex;
    justify-content: space-between;
        margin-bottom: 20px;
  }
  .hotel-title {

    font-family: Noto Sans;
    font-weight: 700;
    font-style: Bold;
    font-size: 24px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;

  }
  .hotel-title-price{
    width: 176px;
    height: 32px;
    angle: 0 deg;
    opacity: 1;
    font-family: Static/Headline Small/Font;
    font-weight: 500;
    font-style: Medium;
    font-size: Static/Headline Small/Size;
    leading-trim: NONE;
    line-height: Static/Headline Small/Line Height;
    letter-spacing: Static/Headline Small/Tracking;
    text-align: right;
    color: #FF8682;

  }
  .hotel-location {
      width: 742px;
      height: 95px;
      border-radius: 8px;
      gap: 24px;
      angle: 0 deg;
      opacity: 1;
      border: 0.5px solid #8DD3BB;
      padding: 16px 32px;
      gap: 4px;
      margin-bottom: 30px;
      display: flex;
  }

  .hotel-location img{
      width: 63px;
      height: 63px;
      border-radius: 12px;
      angle: 0 deg;
      opacity: 1;
  }
  
  .hotel-location-map{
      width: 372px;
      height: 50px;
      gap: 8px;
      angle: 0 deg;
      opacity: 1;
      padding-top: 5px;
  }
  
  .hotel-location-hotel{
      font-family: ABeeZee;
      font-weight: 400;
      font-style: Regular;
      font-size: 20px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }
  
  .hotel-location-hotelmap{
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      margin-top: 10px;
  }
  .hotel-location-hotelmap img{
    width: 10px;
    height: 13px;
    
  }

  /* Date Selection */
  .date-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 742px;
      height: 49px;
      gap: 24px;
      margin-bottom: 32px;
  }

  .date-item {
      display: flex;
      flex-direction: column;
      align-items: left;
  }

  .date-label {
      font-family: Montserrat;
      font-weight: 600;
      font-style: SemiBold;
      font-size: 20px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      margin-bottom: 4px;
  }

  .date-value {
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #666666;
  }

  .hotel-icon{
      width: 168px;
      height: 100%;
      gap: 24px;
      angle: 90 deg;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1px;
  }

  .hotel-icon .img1{
      width: 42px;
      height: 45px;
      top: 1.5px;
      left: 3px;
      angle: -0 deg;
      opacity: 1;
  }
  
  .hotel-icon .img2{
      width: 36px;
      height: 5px;
  }

  /* Payment Section */
  .payment-section {
      width: 790px;
      height: 217px;
      gap: 16px;
      angle: 0 deg;
      opacity: 1;
      padding: 16px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
      margin-bottom: 40px;
  }

  .section-title {
      font-family: Montserrat;
      font-weight: 600;
      font-size: 18px;
      color: #112211;
      margin-bottom: 24px;
  }

  /* Payment Method Section */
  .payment-method {
      width: 758px;
      height: 80px;
      border-radius: 12px;
      justify-content: space-between;
      angle: 0 deg;
      opacity: 1;
      padding: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      transition: background-color 0.3s ease;
  }
  
  .payment-method:hover{
      background: #8DD3BB;
  }
  
  .payment-method.selected {
      background: #8DD3BB;
  }
  
  .payment-method.selected .payment-radio {
      border: 2px solid #FFFFFF;
  }
  
  .payment-method.selected .payment-radio::after {
      content: '';
      width: 8px;
      height: 8px;
      background: #FFFFFF;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }
  
  .payment-radio {
      width: 20px;
      height: 20px;
      border: 2px solid #112211;
      border-radius: 50%;
      position: relative;
      background: transparent;
  }

  .payment-method-text {
      font-family: Noto Sans;
      font-weight: 700;
      font-style: Bold;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211; 
  }
  
  .payment-method-content{
      padding-top: 5px;
      font-family: Montserrat;
      font-weight: 400;
      font-style: Regular;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
  }

  /* Login Form */
  .login-section{
      width: 790px;
      height: 438px;
      border-radius: 12px;
      gap: 24px;
      angle: 0 deg;
      opacity: 1;
      padding: 24px;
      background: #FFFFFF;
      box-shadow: 0px 4px 16px 0px #1122110D;
  }

  .phone-input {
      width: 742px;
      height: 56px;
      border-radius: 4px;
      gap: 10px;
      angle: 0 deg;
      opacity: 1;
      border: 1px solid #79747E;           
      font-family: Montserrat;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 15px;
      padding-left: 15px;
  }

  .input-note {
      width: 742px;
      height: 17px;
      angle: 0 deg;
      opacity: 1;
      font-family: Montserrat;
      font-weight: 400;
      font-style: Regular;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #666666;
      margin-bottom: 15px;
  }

  .continue-btn {
      border: none;
      width: 742px;
      height: 48px;
      border-radius: 4px;
      gap: 4px;
      angle: 0 deg;
      opacity: 1;
      padding: 8px 16px;
      font-family: Montserrat;
      font-weight: 600;
      font-size: 14px;
      background: #8DD3BB;
      color: #112211;
      cursor: pointer;
      margin-bottom: 15px;
  }

  .divider {
      width: 742px;
      height: 20px;
      gap: 24px;
      angle: 0 deg;
      opacity: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;   
      margin-bottom: 15px;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }
  
  .continue-beeline{
      width: 337px;
      height: 0px;
      angle: 0 deg;
      opacity: 0.25;
      border-width: 1px;
      border: 1px solid #112211
  }

  /* Social Login Buttons */
  .social-login {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
  }

  .social-btn {
      flex: 1;
      padding: 12px;
      border: 1px solid #8DD3BB;
      border-radius: 4px;
      background: #FFFFFF;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
  }

  .social-btn img{
      width: 24px;
      height: 24px;
      angle: 0 deg;
      opacity: 1;
  }

  .email-login {
      width: 742px;
      height: 56px;
      gap: 16px;
      angle: 0 deg;
      opacity: 1;
      border: 1px solid #8DD3BB;
      border-radius: 4px;
      cursor: pointer;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
  }

  .email-login img{
      width: 21px;
      height: 16.5px;
      top: 3.75px;
      left: 1.5px;
      angle: 0 deg;
      opacity: 1;
  }

  /* Card List */
  .card-list {
      width: 790px;
      min-height: 316.8339538574219px;
      border-radius: 12px;
      gap: 16px;
      angle: 0 deg;
      opacity: 1;
      padding: 16px;
      box-shadow: 0px 4px 16px 0px #1122110D;
  }

  .saved-card {
      width: 758px;
      height: 80px;
      background: #FFFFFF;
      border: 2px solid #8DD3BB;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      transition: all 0.3s ease;
  }
  
  .saved-card.selected {
      background: #8DD3BB;
      border: 2px solid #8DD3BB;
  }
  
  .saved-card.selected .card-radio {
      border: 2px solid #FFFFFF;
  }
  
  .saved-card.selected .card-radio::after {
      content: '';
      width: 8px;
      height: 8px;
      background: #FFFFFF;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }
  
  .card-radio {
      width: 20px;
      height: 20px;
      border: 2px solid #112211;
      border-radius: 50%;
      position: relative;
      background: transparent;
  }

  .card-info {
      width: 164px;
      height: 32px;
      gap: 32px;
      angle: 0 deg;
      opacity: 1;
      display: flex;
      align-items: center;
  }

  .card-icon img{
      width: 32px;
      height: 20.09600067138672px;
      angle: 0 deg;
      opacity: 1;
      top: 5.95px;
  }

  .card-number {
      width: 53px;
      height: 20px;
      angle: 0 deg;
      opacity: 1;
      font-family: Acme;
      font-weight: 400;
      font-style: Regular;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      padding-left: 16px;
  }
  
  .card-date{
      width: 39px;
      height: 17px;
      angle: 0 deg;
      opacity: 1;
      font-family: Montserrat;
      font-weight: 400;
      font-style: Regular;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }

  .add-card-btn {
      width: 758px;
      height: 188.83395385742188px;
      border-radius: 15px;
      gap: 10px;
      angle: 0 deg;
      opacity: 1;
      border-width: 2px;
      border-style: dashed;
      dashes: 8, 8;
      border-color:  #8DD3BB;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 8px;
      color: #8DD3BB;
      background-color: white;
  }
  
  .plus-btn{
      width: 48px;
      height: 48px;
      angle: 0 deg;
      opacity: 1;
      border: 2px solid rgba(141, 211, 187, 1);
      border-radius: 50%;
      angle: 0 deg;
      opacity: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Montserrat;
      font-weight: 500;
      font-size: 30px;
      padding-bottom: 7px;
  }
  
  .add-card{
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      vertical-align: middle;
      color: rgba(17, 34, 17, 1);
  }

  /* Right Section - Booking Summary */
  .right-section {
      width: 450px;
      height: 1040px;
  }

  .booking-summary {
      background: #FFFFFF;
      width: 100%;
      height: 469.5px;
      border-radius: 12px;
      gap: 16px;
      angle: 0 deg;
      opacity: 1;
      padding: 24px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 120px;
  }

  .hotel-beeline{
      width: 402px;
      height: 0.5px;
      angle: 0 deg;
      opacity: 0.25;
      background: #112211;
  }

  .hotel-image{
      width: 100%;
      height: 120px;
      font-family: Montserrat;
      font-weight: 600;
      font-style: SemiBold;
      font-size: 20px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      display: flex;
      margin-bottom: 20px;
  }

  .hotel-image img{
      width: 121px;
      height: 120px;
      border-radius: 12px;
      angle: 0 deg;
      opacity: 1;
      position: relative;
      overflow: hidden;
  }

  .summary-hotel-info {
      margin-bottom: 16px;
      margin-left: 12px;
  }

  .summary-title1{
      width: 257px;
      height: 20px;
      angle: 0 deg;
      opacity: 0.75;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      margin-bottom: 10px;
  }
  
  .summary-title2{
      width: 257px;
      height: 48px;
      angle: 0 deg;
      opacity: 1;
      font-family: Montserrat;
      font-weight: 600;
      font-style: SemiBold;
      font-size: 20px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }

  .rating {
      width: 257px;
      height: 32px;
      gap: 8px;
      angle: 0 deg;
      opacity: 1;
      display: flex;
      align-items: center;
      gap: 8px;
  }

  .rating-score {
      width: 40px;
      height: 32px;
      gap: 10px;
      angle: 0 deg;
      opacity: 1;
      background: white;
      border: 1px solid #8DD3BB;
      border-radius: 4px;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .rating-text1 {
      font-family: Montserrat;
      font-weight: 700;
      font-style: Bold;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
  }
  
  .rating-text2 {
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 12px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      margin-left: -4px;
  }

  .golobe-protection {
      width: 296px;
      height: 20px;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      margin-top: 20px;
      margin-bottom: 20px;
  }

  /* Price Details */
  .price-details {
      width: 402px;
      height: 164px;
      gap: 16px;
      angle: 0 deg;
      opacity: 1;
      margin-top: 20px;
      margin-bottom: 20px;
  }
  
  .price-title{
      width: 50%;
      height: 20px;
      angle: 0 deg;
      opacity: 1;
      font-family: Acme;
      font-weight: 400;
      font-style: Regular;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }

  .price-breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px 0;
  }

  .price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .price-label {
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
  }

  .price-value {
      font-family: Montserrat;
      font-weight: 600;
      font-style: SemiBold;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
  }

  .total-price {
      width: 402px;
      height: 20px;
      justify-content: space-between;
      angle: 0 deg;
      opacity: 1;
      margin-top: 20px;
  }

  .total-price .price-label {
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }

  .total-price .price-value {
      font-family: Montserrat;
      font-weight: 600;
      font-style: SemiBold;
      font-size: 16px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }


  /* Newsletter Section */
  .newsletter-section {
      background: rgba(141, 211, 187, 1);
      padding: 80px 104px;
      position: relative;
      height: 422px;
      display: flex;
      flex-direction: column;
      margin-top: 60px;
      z-index: 0;
      margin-bottom: -513px;
  }

  .newsletter-content {
      background: rgba(205, 234, 225, 1);
      border-radius: 20px;
      padding: 48px;
      box-shadow: 0px 4px 16px rgba(17, 34, 17, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 1232px;
      height: 305px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
      margin-bottom: 40px;
  }

  .newsletter-left {
      flex: 1;
      max-width: 500px;
  }

  .newsletter-title {
      font-family: 'Noto Sans', sans-serif;
      font-weight: 900;
      font-size: 44px;
      line-height: 54px;
      color: #112211;
      margin-bottom: 24px;
  }

  .newsletter-info {
      margin-bottom: 24px;
  }

  .newsletter-brand {
      font-family: Acme;
      font-weight: 400;
      font-size: 20px;
      line-height: 100%;
      color: #112211;
      opacity: 0.8;
      margin-bottom: 8px;
  }

  .newsletter-desc {
      font-family: Montserrat;
      font-weight: 500;
      font-size: 16px;
      line-height: 100%;
      color: #112211;
      opacity: 0.7;
  }

  .newsletter-form {
      display: flex;
      gap: 16px;
      align-items: center;
  }

  .newsletter-input {
      flex: 1;
      padding: 16px;
      border: none;
      border-radius: 4px;
      font-family: Montserrat;
      font-weight: 400;
      font-size: 16px;
      line-height: 100%;
      height: 56px;
  }

  .subscribe-btn {
      padding: 16px 24px;
      background: #112211;
      color: #FFFFFF;
      border: none;
      border-radius: 4px;
      font-family: Montserrat;
      font-weight: 600;
      font-size: 14px;
      line-height: 100%;
      cursor: pointer;
      height: 56px;
  }

  /* Mailbox Design */
  .mailbox-container {
      position: relative;
      width: 400px;
      height: 305px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
  }

  .mailbox-back {
      position: absolute;
      width: 208px;
      height: 191px;
      top: 47px;
      left: 0px;
      background: rgba(101, 181, 153, 1);
      border-top-left-radius: 70px; 
      border-top-right-radius: 70px; 
      z-index: 5;
  }

  .mailbox-base {
      position: absolute;
      width: 187px;
      height: 179px;
      top: 59px;
      left: 10px;
      border-top-left-radius: 70px; 
      border-top-right-radius: 70px; 
      background: rgba(84, 104, 105, 1);
      z-index: 10;
  }

  .mailbox-front {
      position: absolute;
      width: 291px;
      height: 191px;
      top: 47px;
      left: 71px;
      background: rgba(17, 34, 17, 1);
      border-top-left-radius: 70px; 
      border-top-right-radius: 70px; 
      z-index: 4;
  }

  .mailbox-flag {
      position: absolute;
      width: 169px;
      height: 40px;
      top: 154px;
      left: 231px;
      background: rgba(255, 134, 130, 1);
      z-index: 6;
  }

  .mailbox-flag2 {
      position: absolute;
      width: 39px;
      height: 77px;
      top: 154px;
      left: 361px;
      background: rgba(255, 134, 130, 1);
      z-index: 6;
  }

  .mailbox-pole {
      position: absolute;
      width: 47px;
      height: 188px;
      top: 117px;
      left: 194px;
      background: rgba(164, 128, 109, 1);
      z-index: 3;
  }

  .mailbox-stand-base {
      position: absolute;
      width: 85px;
      height: 57px;
      top: 212px;
      left: 156px;
      background: rgba(164, 128, 109, 1);
      z-index: 3;
  }

  .mailbox-stand-front {
      position: absolute;
      width: 85px;
      height: 188px;
      top: 117px;
      left: 156px;
      background: rgba(223, 173, 146, 1);
      z-index: 2;
  }

  /* Footer Content */
  .footer-content {
      max-width: 1232px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      z-index: 1;
      gap: 64px;
      padding-bottom: 40px;
  }

  .social-icons {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
  }

  .footer-links {
      display: flex;
      gap: 60px;
  }

  .footer-column {
      display: flex;
      flex-direction: column;
      gap: 12px;
  }

  .footer-column h4 {
      font-family: Acme;
      font-weight: 400;
      font-size: 16px;
      line-height: 100%;
      color: #112211;
      margin-bottom: 8px;
  }

  .footer-column a {
      font-family: Montserrat;
      font-weight: 500;
      font-size: 14px;
      line-height: 100%;
      color: #112211;
      text-decoration: none;
      opacity: 0.7;
  }

  .footer-column a:hover {
      opacity: 1;
  }

  /* Modal Base */
  .modal {
    display: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
  }
  
  .modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Modal Box */
  .modal-full {
    width: 640px;
    height: 686.2418823242188px;
    border-radius: 12px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    width: 512px;
    height: 590px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow-y: auto;
  }

  /* Header */
  .modal-header {
    display: flex;
    justify-content: flex-end;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  /* Title */
  .modal-title {
    font-family: Noto Sans, sans-serif;
    font-weight: 700;
    font-size: 32px;
    margin: 16px 0 24px;
    color: #112211;
  }

  /* Form */
  .form-group {
    margin-bottom: 20px;
    position: relative;
  }
  
  .form-label {
    position: absolute;
    top: -8px;
    left: 12px;
    background: #FFFFFF;
    padding: 0 4px;
    font-family: Montserrat, sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #112211;
    z-index: 1;
  }
  
  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    box-sizing: border-box;
  }
  
  .form-row {
    display: flex;
    gap: 16px;
  }
  
  .form-row .form-group {
    flex: 1;
  }

  /* Card Number + VISA */
  .card-input-wrapper {
    position: relative;
  }
  
  .card-input-wrapper input {
    padding-right: 50px;
    height: 56px;
  }
  
  .card-logo {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    height: 20px;
  }

  /* Checkbox */
  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    color: #112211;
    margin-bottom: 20px;
    padding-left: 0;
  }
  
  .checkbox-group label {
    position: static;
    background: none;
    padding: 0;
  }

  /* Button */
  .save-card-btn {
    width: 100%;
    height: 48px;
    padding: 8px 16px;
    gap: 4px;
    background: #8dd3bb;
    border: none;
    border-radius: 4px;
    font-family: Montserrat, sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #112211;
    cursor: pointer;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;

  }
  /* 쿠폰 섹션 */
  .coupon-section {
    width: 790px;
    min-height: 200px;
    border-radius: 12px;
    gap: 16px;
    padding: 24px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px #1122110D;
    margin-bottom: 40px;
  }

  .coupon-item {
    width: 742px;
    min-height: 100px;
    background: #FFFFFF;
    border: 2px solid #8DD3BB;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .coupon-item:hover {
    background: #F0F9F6;
  }

  .coupon-item.selected {
    background: #8DD3BB;
    border: 2px solid #8DD3BB;
  }

  .coupon-item.selected .coupon-radio {
    border: 2px solid #FFFFFF;
  }

  .coupon-item.selected .coupon-radio::after {
    content: '';
    width: 8px;
    height: 8px;
    background: #FFFFFF;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .coupon-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .coupon-name {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 18px;
    color: #112211;
  }

  .coupon-discount {
    font-family: Montserrat;
    font-weight: 700;
    font-size: 24px;
    color: #FF6B6B;
  }

  .coupon-expiry {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }

  .coupon-radio {
    width: 20px;
    height: 20px;
    border: 2px solid #112211;
    border-radius: 50%;
    position: relative;
    background: transparent;
  }

  .no-coupons {
    width: 100%;
    padding: 40px;
    text-align: center;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 16px;
    color: #666666;
  }

  /* 카드 섹션 제목 */
  .card-list .section-title {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 18px;
    color: #112211;
    margin-bottom: 16px;
  }


  /* 결제 버튼 */
  .payment-btn {
    width: 790px;
    height: 56px;
    border-radius: 8px;
    background: #8DD3BB;
    border: none;
    font-family: Montserrat;
    font-weight: 700;
    font-size: 18px;
    color: #112211;
    cursor: pointer;
    margin-top: 24px;
    transition: all 0.3s ease;
  }

  .payment-btn:hover:not(:disabled) {
    background: #7BC4AD;
    transform: translateY(-2px);
    box-shadow: 0px 4px 12px rgba(141, 211, 187, 0.4);
  }

  .payment-btn:disabled {
    background: #CCCCCC;
    cursor: not-allowed;
    opacity: 0.6;
  }
  /* 로그인 섹션 전체 (Screen 1) */
  .login-section-full {
    width: 790px;
    min-height: 600px;
    border-radius: 12px;
    padding: 40px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px #1122110D;
  }

  .login-section-full .section-title {
    font-family: Noto Sans;
    font-weight: 700;
    font-size: 32px;
    color: #112211;
    margin-bottom: 8px;
  }

  .login-section-full .login-subtitle {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 16px;
    color: #666666;
    margin-bottom: 32px;
  }

  /* 입력 필드 스타일 (HotelLogin 스타일) */
  .login-section-full .input-group {
    margin-bottom: 24px;
    position: relative;
  }

  .login-section-full .input-group label {
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

  .login-section-full .input-group input {
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

  .login-section-full .input-group input:focus {
    outline: none;
    border-color: #7dd3c0;
    border-width: 2px;
  }

  .login-section-full .input-group input:focus + label {
    color: #7dd3c0;
  }

  /* 비밀번호 필드 */
  .login-section-full .password-input-wrapper {
    position: relative;
  }

  .login-section-full .password-toggle {
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

  .login-section-full .password-toggle img {
    width: 22.5px;
    height: 15px;
  }

  .login-section-full .password-toggle:hover {
    color: #333;
  }

  /* 로그인 버튼 */
  .login-section-full .login-button {
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

  .login-section-full .login-button:hover:not(:disabled) {
    background-color: #6bc4a8;
  }

  .login-section-full .login-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .login-section-full .signup-link {
    font-family: Montserrat;
    font-weight: 500;
    font-size: 14px;
    text-align: center;
    display: block;
    color: #333;
    text-decoration: none;
    margin-bottom: 32px;
  }

  .login-section-full .signup-link:hover {
    text-decoration: underline;
  }

  /* 구분선 */
  .login-section-full .divider {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 32px 0;
    color: #666;
  }

  .login-section-full .divider-beeline {
    width: 30%;
    height: 1px;
    background: rgba(17, 34, 17, 0.25);
  }

  .login-section-full .divider span {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    padding: 0 16px;
  }

  /* 소셜 로그인 버튼들 */
  .login-section-full .social-login {
    display: flex;
    gap: 12px;
    justify-content: center;
    width: 100%;
  }

  .login-section-full .social-btn {
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

  .login-section-full .social-btn:hover {
    background-color: #f5f5f5;
    border-color: #ccc;
  }

  .login-section-full .social-btn img {
    border-radius: 4px;
  }
  /* Turnstile 위젯 */
  .login-section-full .turnstile-wrapper {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  .payment-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }

  .payment-modal.active {
    display: flex;
  }

  .payment-modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .payment-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .payment-modal-body {
    padding: 20px;
  }

  .payment-summary {
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .confirm-payment-btn {
    width: 100%;
    padding: 16px;
    background: #8DD3BB;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 20px;
  }

  .confirm-payment-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  /* Screen transitions */
  .screen {
      display: none;
  }

  .screen.active {
      display: block;
  }
   /* 쿠폰 모달 스타일 */
  .coupon-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .coupon-modal {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .coupon-modal-header {
    padding: 32px 32px 24px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .coupon-modal-header h2 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 24px;
    color: #112211;
    margin: 0;
  }
  
  .modal-close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }
  
  .modal-close-btn:hover {
    color: #112211;
  }
  
  .coupon-modal-content {
    padding: 24px 32px;
    overflow-y: auto;
    flex: 1;
  }
  
  .coupon-count {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
    text-align: center;
  }
  
  .coupon-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .coupon-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #8DD3BB 0%, #7CC5AE 100%);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(141, 211, 187, 0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .coupon-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(141, 211, 187, 0.4);
  }
  
  .coupon-badge {
    background: white;
    border-radius: 12px;
    padding: 16px;
    min-width: 80px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .discount {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 28px;
    color: #8DD3BB;
    line-height: 1;
    margin-bottom: 4px;
  }
  
  .discount-label {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 12px;
    color: #666;
  }
  
  .coupon-info {
    flex: 1;
  }
  
  .coupon-info h3 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 18px;
    color: white;
    margin: 0 0 8px 0;
  }
  
  .coupon-expiry {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
  
  .coupon-modal-footer {
    padding: 24px 32px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 12px;
  }
  
  .btn-use-coupon,
  .btn-close {
    flex: 1;
    padding: 16px;
    border: none;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-use-coupon {
    background: #8DD3BB;
    color: #112211;
  }
  
  .btn-use-coupon:hover {
    background: #7CC5AE;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(141, 211, 187, 0.4);
  }
  
  .btn-close {
    background: white;
    color: #112211;
    border: 2px solid #e0e0e0;
  }
  
  .btn-close:hover {
    border-color: #8DD3BB;
    color: #8DD3BB;
  }
  
  /* 반응형 */
  @media screen and (max-width: 768px) {
    .coupon-modal {
      width: 95%;
      max-height: 90vh;
    }
  
    .coupon-modal-header {
      padding: 24px 20px 16px;
    }
  
    .coupon-modal-header h2 {
      font-size: 20px;
    }
  
    .coupon-modal-content {
      padding: 16px 20px;
    }
  
    .coupon-item {
      flex-direction: column;
      align-items: flex-start;
      padding: 16px;
    }
  
    .coupon-badge {
      align-self: flex-start;
    }
  
    .coupon-modal-footer {
      flex-direction: column;
      padding: 16px 20px;
    }
  }

</style>