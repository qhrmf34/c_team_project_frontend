<template>
  <div class="hotel-ticket-container">
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
          <a href="#" class="dropdown-item" @click="goToPaymentTab">
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


    <!-- ✅ Loading -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>티켓을 불러오는 중...</p>
    </div>

    <!-- ✅ Error -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <div class="error-actions">
        <button @click="$router.push('/hotelaccount?tab=history')" class="btn-back">
          예약 내역으로
        </button>
        <button 
          v-if="errorPaymentId && !isRefunded" 
          @click="openRefundModal" 
          class="btn-refund-error"
        >
          환불 요청
        </button>
      </div>
      <p v-if="isRefunded" class="refunded-info">이 결제는 이미 환불되었습니다.</p>
    </div>

    <!-- ✅ Ticket Content -->
    <div v-else-if="ticket">
      <!-- Breadcrumb -->
      <div class="breadcrumb">     
        <a href="#" @click.prevent="searchByCountry(ticket.countryName)" style="color: rgba(255, 134, 130, 1);">{{ ticket.countryName }}</a> > 
        <a href="#" @click.prevent="searchByCity(ticket.cityName)" style="color: rgba(255, 134, 130, 1);">{{ ticket.cityName }}</a> > 
        <span>{{ ticket.hotelName }}</span>
      </div>

      <div class="main-content">
        <!-- Hotel Header -->
        <div class="hotel-header">
          <div class="hotel-info">
            <h1 class="hotel-title">{{ ticket.hotelName }}</h1>
            <div class="hotel-location-line">
              <span><img src="/images/hotel_img/map.jpg" alt="map"></span>
              <span>{{ ticket.address }}</span>
            </div>
          </div>
      
          <div class="hotel-actions">
            <div class="hotel-price">
              <div class="price-amount">{{ formatPrice(ticket.paymentAmount) }}<span class="price-unit">/total</span></div>
            </div>
            <div class="hotel-buttons">
              <button class="action-btn" @click="shareTicket">
                <img src="/images/hotel_img/share.jpg" alt="share">
              </button>
              <button class="action-btn-download" @click="downloadTicket">Download</button>
            </div>
          </div>
        </div>

        <!-- 티켓 이미지 표시 -->
        <div class="ticket-container">
          <div class="ticket-image-wrapper">
            <img 
              v-if="ticket.ticketImagePath" 
              :src="getImageUrl(ticket.ticketImagePath)" 
              alt="티켓 이미지"
              class="ticket-image"
            >
            <div v-else class="no-ticket-image">
              <p>티켓 이미지를 불러올 수 없습니다.</p>
            </div>
          </div>
        </div>

        <!-- ✅ 환불 버튼 섹션 추가 -->
        <div class="refund-section" v-if="!ticket.refund">
          <button class="refund-btn" @click="openRefundModal">
            <img src="/images/hotel_img/refund.jpg" alt="refund" v-if="false">
            환불 요청
          </button>
          <p class="refund-notice">
            * 환불 시 예약이 취소되며, 티켓은 사용할 수 없게 됩니다.
          </p>
        </div>
        
        <div class="refund-section" v-else>
          <div class="refunded-notice">
            ⚠️ 이 티켓은 환불 처리되었습니다.
          </div>
        </div>

        <!-- Terms and Conditions Section -->
        <div class="terms-section">
          <h2 class="terms-title">Terms and Conditions</h2>
          
          <div class="terms-payment">
            <h3 class="section-title">Payments</h3>
          <ul class="terms-list">
            <li>If you are purchasing your ticket using a debit or credit card via the Website, we will process these payments via the automated secure common payment gateway which will be subject to fraud screening purposes.</li>
            <li>If you do not supply the correct card billing address and/or cardholder information, your booking will not be confirmed and the overall cost may increase. We reserve the right to cancel your booking if payment is declined for any reason or if you have supplied incorrect card information. If we become aware of, or is notified of, any fraud or illegal activity associated with the payment for the booking, the booking will be cancelled and you will be charged a cancellation fee along with any other costs arising from such cancellation, without prejudice to any action that may be taken against us.</li>
            <li>Golobe may require the card holder to provide additional payment verification upon request by either submitting an online form or visiting the nearest Golobe office, or at the airport at the time of check-in. Golobe reserves the right to deny boarding or to collect a guarantee payment (in cash or from another credit card) if the card originally used for the purchase cannot be presented by the cardholder at check-in or when collecting the tickets, or in the event that the credit card on which the original payment was made has been withheld or disputed by the card issuing bank. Credit card details are held in a secured environment and transferred through an internationally accepted system.</li>
          </ul>
          </div>
          
          <div class="contact-info">
            <h4 class="contact-title">Contact Us</h4>
            <div class="contact-details">
              If you have any questions about our Website or our Terms of Use, please contact:
              Golobe Group QCSC<br>
              Golobe Tower<br>
              P.O. Box: 22550<br>
              Doha, State of Qatar<br>
              Further contact details can be found at <a href="#" class="contact-link"><u>golobe.com/help</u></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Section - 기존과 동일 -->
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
    <!-- 환불 사유 모달 추가 -->
    <div v-if="showRefundModal" class="modal-overlay" @click.self="closeRefundModal">
      <div class="refund-modal">
        <div class="modal-header">
          <h2>환불 요청</h2>
          <button class="modal-close-btn" @click="closeRefundModal">&times;</button>
        </div>
      
        <div class="modal-content">
          <div class="refund-notice-box">
            <p>⚠️ 환불 시 예약이 취소되며, 티켓은 사용할 수 없게 됩니다.</p>
          </div>
        
          <!-- 환불 사유 선택 -->
          <div class="form-group">
            <label for="mainReason">환불 사유 <span class="required">*</span></label>
            <select
              id="mainReason"
              v-model="refundForm.mainReason"
              required
              class="select-input"
            >
              <option value="" disabled>환불 사유를 선택하세요</option>
              <option 
                v-for="option in refundReasonOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        
          <!-- 세부 사유 입력 -->
          <div class="form-group">
            <label for="detailReason">세부 사유</label>
            <textarea
              id="detailReason"
              v-model="refundForm.detailReason"
              placeholder="환불 사유를 상세히 입력해주세요 (선택사항)"
              rows="4"
              maxlength="1000"
            ></textarea>
            <p class="char-count">{{ refundForm.detailReason.length }} / 1000</p>
          </div>
        </div>
      
        <div class="modal-footer">
          <button @click="closeRefundModal" class="btn-cancel">취소</button>
          <button 
            @click="requestRefund" 
            class="btn-confirm"
            :disabled="!refundForm.mainReason || isProcessing"
          >
            {{ isProcessing ? '처리 중...' : '환불 신청' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authUtils, ticketAPI, paymentAPI, adminAPI, memberCouponAPI, memberImageAPI } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'


export default {
  name: 'HotelFive',
  data() {
    return {
      isDropdownActive: false,
      email: '',
      userInfo: null,
      isLoggedIn: false,
      showCouponModal: false,
      receivedCoupons: [],
      profileImageUrl: '/images/hotel_account_img/member.jpg',
      ticket: null,
      isLoading: true,
      error: null,
      errorPaymentId: null, 
      isRefunded: false,
      
      showRefundModal: false,
      refundReasonOptions: [],
      refundForm: {
        mainReason: '',
        detailReason: ''
      },
      isProcessing: false
      
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();

    await this.loadRefundReasonOptions();

    await this.loadTicket();  
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  
  watch: {
    '$route'() {
      this.loadUserInfo();
    }
  },
  
  computed: {
    displayUserName() {
      if (this.isLoggedIn && this.userInfo) {
        return formatMemberName(this.userInfo);
      }
      return 'Guest';
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
    }
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
      return today.toLocaleDateString('en-CA');
    },
    
    getTomorrow() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString('en-CA');
    },
    
    async loadTicket() {
      try {
        this.isLoading = true;
      
        const paymentId = this.$route.query.paymentId;
        if (!paymentId) {
          throw new Error('결제 정보가 없습니다.');
        }
      
        // ✅ paymentId 저장 (환불 요청 시 사용)
        this.errorPaymentId = paymentId;
      
        const response = await ticketAPI.getTicketByPaymentId(paymentId);
      
        if (response.code === 200) {
          this.ticket = response.data;
          this.isRefunded = response.data.refund || false; // ✅ 환불 여부 저장
          console.log('✅ 티켓 로드 완료:', this.ticket);
        
          if (this.ticket.ticketImagePath) {
            console.log('✅ 티켓 이미지 경로:', this.ticket.ticketImagePath);
          }
        } else {
          this.error = response.message || '티켓을 불러올 수 없습니다.';
        }
      
      } catch (error) {
        console.error('티켓 로드 실패:', error);
        this.error = error.response?.data?.message || error.message || '티켓을 불러오는데 실패했습니다.';

        // ✅ 에러 응답에서 refund 정보 확인
        if (error.response?.data?.refund !== undefined) {
          this.isRefunded = error.response.data.refund;
        }
      } finally {
        this.isLoading = false;
      }
    },
     
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    },
    formatBookingTime(time) {
      if (!time) return '12:00pm';

      const [hourStr, minuteStr] = time.split(':');
      let hour = parseInt(hourStr);
      const minute = minuteStr || '00';
      const suffix = hour >= 12 ? 'pm' : 'am';

      if (hour === 0) hour = 12;
      else if (hour > 12) hour -= 12;

      return `${hour.toString().padStart(2, '0')}:${minute}${suffix}`;
    },

    // ✅ 이미지 URL (기본 이미지 처리 추가)
    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/hotel1.jpg'; // ✅ 기본 이미지
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('/images/')) return imagePath;
      return adminAPI.getImageUrl(imagePath);
    },
    
    formatPrice(price) {
      if (!price) return '₩0';
      return '₩' + Math.floor(price).toLocaleString('ko-KR');
    },
    
    // ✅ 카카오톡 공유 (티켓 이미지만 공유)
    async shareTicket() {
      if (!window.Kakao) {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
      }
    
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.VUE_APP_KAKAO_SHARE_KEY);
      }
    
      // ✅ 티켓 이미지가 없으면 먼저 생성
      if (!this.ticket.ticketImagePath) {
        alert('티켓 이미지를 생성하는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
    
      // ✅ adminAPI 사용
      const ticketImageUrl = adminAPI.getImageUrl(this.ticket.ticketImagePath);

      console.log('공유할 티켓 이미지:', ticketImageUrl);
    
      try {
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `${this.ticket.hotelName} 예약 티켓`,
            description: `체크인: ${this.formatDate(this.ticket.checkInDate)} | 체크아웃: ${this.formatDate(this.ticket.checkOutDate)}`,
            imageUrl: ticketImageUrl,
            link: {
              mobileWebUrl: ticketImageUrl,
              webUrl: ticketImageUrl,
            },
          }
        });
      } catch (error) {
        console.error('카카오톡 공유 실패:', error);
        alert('카카오톡 공유에 실패했습니다.');
      }
    },
    // ✅ 환불 사유 옵션 로드
    async loadRefundReasonOptions() {
      try {
        const response = await paymentAPI.getRefundReasonOptions();
        if (response.code === 200) {
          this.refundReasonOptions = response.data;
        }
      } catch (error) {
        console.error('환불 사유 옵션 로드 실패:', error);
      }
    },

    // ✅ 환불 모달 열기
    openRefundModal() {
      console.log('openRefundModal 호출됨');
      console.log('ticket:', this.ticket);
      
      // ✅ ticket null 체크 추가!
      if (!this.ticket) {
        alert('티켓 정보를 불러오는 중입니다.');
        return;
      }
      
      if (this.ticket.refund) {
        alert('이미 환불된 티켓입니다.');
        return;
      }
    
      this.showRefundModal = true;
      this.refundForm = {
        mainReason: '',
        detailReason: ''
      };
    },
    // ✅ 환불 모달 닫기
    closeRefundModal() {
      this.showRefundModal = false;
      this.refundForm = {
        mainReason: '',
        detailReason: ''
      };
    },

    // ✅ 에러 화면에서 환불 요청
    async requestRefundFromError() {
      if (this.isRefunded) {
        alert('이미 환불된 결제입니다.');
        return;
      }
    
      if (!this.errorPaymentId) {
        alert('결제 정보를 찾을 수 없습니다.');
        return;
      }
    
      // 모달 열기
      this.showRefundModal = true;
      this.refundForm = {
        mainReason: '',
        detailReason: '티켓 이미지 생성 실패'
      };
    },
    // 환불 요청
    async requestRefund() {
      if (!this.refundForm.mainReason) {
        alert('환불 사유를 선택해주세요');
        return;
      }

      if (!confirm('정말 환불하시겠습니까?\n환불 후에는 예약이 취소됩니다.')) {
        return;
      }

      this.isProcessing = true;

      try {
        const refundData = {
          cancelReason: this.refundForm.detailReason || '고객 요청',
          mainReason: this.refundForm.mainReason,
          detailReason: this.refundForm.detailReason
        };

        // ✅ paymentAPI 사용
        const response = await paymentAPI.refundPayment(
          this.ticket.paymentId,
          refundData
        );

        if (response.code === 200) {
          alert('환불이 완료되었습니다!');
          this.closeRefundModal();
          this.$router.push({
            path: '/hotelaccount',
            query: { tab: 'history' }
          });
        }
      } catch (error) {
        console.error('환불 실패:', error);
        alert(error.response?.data?.message || '환불 처리 중 오류가 발생했습니다.');
      } finally {
        this.isProcessing = false;
      }
    },
    // ✅ 티켓 다운로드 (adminAPI 사용)
    async downloadTicket() {
      if (!this.ticket || !this.ticket.ticketImagePath) {
        alert('다운로드할 티켓 이미지가 없습니다.');
        return;
      }
    
      try {
        const imageUrl = this.getImageUrl(this.ticket.ticketImagePath);

        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket_${this.ticket.barcode}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log('✅ 티켓 다운로드 완료');
      } catch (error) {
        console.error('❌ 티켓 다운로드 실패:', error);
        alert('티켓 다운로드에 실패했습니다.');
      }
    },
    
    async subscribe() {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.')
        this.$router.push('/login')
        return
      }

      try {
        const response = await memberCouponAPI.subscribeAndReceiveCoupons()
        
        if (response.code === 200) {
          this.receivedCoupons = response.data || []
          this.showCouponModal = true
          this.email = ''
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
            this.profileImageUrl = adminAPI.getImageUrl(imagePath);
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
    
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    handleClickOutside(event) {
      if (!this.$refs.userDropdown.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    },
    
    goToHotel() {
        this.$router.push('/hotelone');
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
    },
    goToPaymentTab() {
      if (this.isLoggedIn) {
        this.$router.push({
          path: '/hotelaccount',
          query: { tab: 'payments' }
        });
        this.isDropdownActive = false; // 드롭다운 닫기
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
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

  /* Breadcrumb */
  .breadcrumb {
      width: 100%;
      height: 24px;
      gap: 8px;
      background: #F8F9FA;
      margin-top: 135px;
      font-family: Montserrat;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      display: flex;
      align-items: center;
      margin-left: 104px;
      margin-bottom: 30px;
  }     

  .breadcrumb a {
      color: #666666;
      text-decoration: none;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
  }

  .breadcrumb a:hover {
      color: #112211;
  }

  /* Main Content */
  .main-content {
      flex: 1;
      padding: 20px 104px;
      max-width: 1440px;
      width: 100%;
  }

  /* Hotel Header */
  .hotel-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-radius: 12px;
      gap: 32px;
      margin-bottom: 30px;
  }

  /* 왼쪽 호텔 정보 */
  .hotel-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
  }

  .hotel-title {
      font-family: 'ABeeZee', sans-serif;
      font-weight: 400;
      font-size: 20px;
      color: #112211;
      display: flex;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 12px;
  }

  .hotel-location-line {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #666666;
  }
  .hotel-location-line img{
      width: 11.25px;
      height: 15.749412536621094px;
      top: 1.13px;
      left: 3.38px;
      angle: 0 deg;
      opacity: 1;
  }

  /* 오른쪽 가격 & 버튼 */
  .hotel-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      flex-shrink: 0;
  }

  .hotel-price {
      text-align: right;
  }

  .price-amount {
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
      font-size: 32px;
      color: rgba(255, 134, 130, 1);
  }

  .price-unit {
      font-size: 24px;
      color: rgba(255, 134, 130, 1);
  }

  .hotel-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
  }

  .action-btn {
      background: none;
      border: 1px solid #8DD3BB;
      border-radius: 4px;
      color: #112211;
      cursor: pointer;
      width: 48px;
      height: 48px;
      gap: 10px;
      font-family: 'Montserrat', sans-serif;
      font-weight: 500;
      font-size: 12px;
      display: flex;
      align-items: center;    
      justify-content: center;
      
  }
  
  .action-btn img{
      width: 15.001760482788086px;
      height: 16.24186897277832px;
      top: 1.88px;
      left: 2.5px;
      angle: 0 deg;
      opacity: 1;
      border-width: 0.05px;
  }
  
  .action-btn-download{
      width: 150px;
      height: 48px;
      angle: 0 deg;
      opacity: 1;
      gap: 4px;
      border-radius: 4px;
      padding: 8px 16px;
      background: rgba(141, 211, 187, 1);
      border: none;
      font-family: Montserrat;
      font-weight: 600;
      font-style: SemiBold;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      cursor: pointer;

  }

  /* 티켓 이미지 컨테이너 */
  .ticket-container {
    margin: 40px 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ticket-image-wrapper {
    width: 100%;
    max-width: 1231px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .ticket-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .no-ticket-image {
    padding: 100px 20px;
    text-align: center;
    color: #999;
    font-size: 18px;
  }

  /* Terms and Conditions Section */
  .terms-section {
      width: 1232px;
      height: 549px;
      angle: 0 deg;
      opacity: 1;
      gap: 34px;  
      margin: 60px auto;
  }

  .terms-title {
      width: 100%;
      height: 29px;
      angle: 0 deg;
      opacity: 1;
      gap: 8px;
      angle: 0 deg;
      opacity: 1;
      font-family: Montserrat;
      font-weight: 600;
      font-style: SemiBold;
      font-size: 24px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      margin-bottom: 32px;
  }

  .terms-payment {
      width: 1232px;
      height: 272px;
      angle: 0 deg;
      opacity: 1;
      gap: 16px;

  }

  .section-title {
      width: 103px;
      height: 24px;
      angle: 0 deg;
      opacity: 1;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 20px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      margin-bottom: 16px;
      margin-top: 32px;
  }

  .section-title:first-child {
      margin-top: 0;
  }

  .terms-text {
      font-family: Montserrat;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.6;
      color: #112211;
      margin-bottom: 16px;
  }

  .terms-list {
      margin: 16px 0;
      padding-left: 20px;
  }

  .terms-list li {
      font-family: Montserrat;
      font-weight: 400;
      font-size: 14px;
      line-height: 1.6;
      color: #112211;
      margin-bottom: 8px;
  }

  .contact-info {
      width: 1232px;
      height: 180px;
      angle: 0 deg;
      opacity: 1;
      gap: 16px;
      margin-top: 40px;
  }

  .contact-title {
      width: 112px;
      height: 24px;
      angle: 0 deg;
      opacity: 1;
      font-family: Montserrat;
      font-weight: 500;
      font-style: Medium;
      font-size: 20px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
      color: #112211;
      margin-bottom: 12px;
  }

  .contact-details {
      width: 100%;
      height: 140px;
      angle: 0 deg;
      opacity: 1;
      font-family: Montserrat;
      font-weight: 400;
      font-style: Regular;
      font-size: 14px;
      leading-trim: NONE;
      line-height: 20px;
      letter-spacing: 0%;
      color: #112211;
  }

  .contact-link {
    color: rgba(17, 34, 17, 1);
    text-decoration: none;
  }

  .contact-link:hover {
      text-decoration: underline;
  }

  /* Newsletter Section */
  .newsletter-section {
    background: rgba(141, 211, 187, 1);
    padding: 80px 104px 80px 104px;
    position: relative;
    width: 100%;
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

  /* 우체통 디자인 */
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

  /* Social Icons */
  .social-icons {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
  }

  /* Footer Columns */
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
  /* ✅ Loading & Error 스타일 */
  .loading-container, .error-container {
    max-width: 600px;
    margin: 200px auto;
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #8DD3BB;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    color: #e74c3c;
    font-size: 18px;
    margin-bottom: 20px;
  }

  .btn-back {
    padding: 12px 32px;
    background: #8DD3BB;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
  }

  .btn-back:hover {
    background: #7bc4ad;
  }

  /* ✅ 환불 섹션 스타일 */
  .refund-section {
    margin: 40px auto;
    max-width: 1231px;
    text-align: center;
    padding: 30px;
    background: #fff5f5;
    border-radius: 12px;
    border: 1px solid #ffcccc;
  }

  .refund-btn {
    width: 200px;
    height: 56px;
    background: #ff5252;
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 0 auto;
  }

  .refund-btn:hover {
    background: #e04848;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 82, 82, 0.3);
  }

  .refund-btn:active {
    transform: translateY(0);
  }

  .refund-notice {
    margin-top: 15px;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    color: #666;
    font-style: italic;
  }

  .refunded-notice {
    padding: 20px;
    background: #ffe0e0;
    border: 2px solid #ff5252;
    border-radius: 8px;
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #d32f2f;
  }

  /* 바코드 SVG 스타일 */
  .barcode-svg {
    width: 100%;
    height: auto;
    margin: 0px 20px 20px 0px;
  }

  /* 프로필 이미지 스타일 개선 */
  .guest img {
    width: 48px;
    height: 48px;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }

  /*호텔 이미지 스타일 */
  .ticket-right img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0 12px 12px 0;
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
  .error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 20px;
  }
  
  .btn-back {
    padding: 12px 32px;
    background: #8DD3BB;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .btn-back:hover {
    background: #7bc4ad;
    transform: translateY(-2px);
  }
  
  .btn-refund-error {
    padding: 12px 32px;
    background: #ff5252;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    transition: all 0.3s;
  }
  
  .btn-refund-error:hover {
    background: #e04848;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 82, 82, 0.3);
  }
  
  .refunded-info {
    margin-top: 20px;
    padding: 12px 20px;
    background: #ffe0e0;
    border: 1px solid #ff5252;
    border-radius: 8px;
    color: #d32f2f;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
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
  .modal-overlay {
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
  
  .modal-header {
    padding: 32px 32px 24px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-header h2 {
    font-family: 'TradeGothic', sans-serif;
    font-weight: bold;
    font-size: 24px;
    color: #112211;
    margin: 0;
  }
  
  .modal-close-btn {
    background: none;
    border: none;
    font-size: 32px;
    color: #112211;
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
    color: #8DD3BB;
  }
  
  .modal-content {
    padding: 24px 32px;
    overflow-y: auto;
    flex: 1;
  }
  
  .modal-footer {
    padding: 24px 32px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 16px;
  }

  /* ✅ 환불 모달 스타일 */
  .refund-modal {
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
  
  .refund-notice-box {
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .refund-notice-box p {
    margin: 0;
    color: #856404;
    font-size: 14px;
    font-weight: 600;
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-group label {
    display: block;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #112211;
    margin-bottom: 8px;
  }
  
  .required {
    color: #ff4444;
  }
  
  .select-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
    transition: border-color 0.2s;
  }
  
  .select-input:focus {
    outline: none;
    border-color: #8DD3BB;
  }
  
  textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
    resize: vertical;
    min-height: 100px;
  }
  
  textarea:focus {
    outline: none;
    border-color: #8DD3BB;
  }
  
  .char-count {
    font-size: 12px;
    color: #999;
    text-align: right;
    margin-top: 4px;
  }
  
  .btn-cancel,
  .btn-confirm {
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
  
  .btn-cancel {
    background: white;
    color: #112211;
    border: 2px solid #e0e0e0;
  }
  
  .btn-cancel:hover {
    border-color: #8DD3BB;
    color: #8DD3BB;
  }
  
  .btn-confirm {
    background: #8DD3BB;
    color: #112211;
  }
  
  .btn-confirm:hover:not(:disabled) {
    background: #7CC5AE;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(141, 211, 187, 0.4);
  }
  
  .btn-confirm:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  /* 반응형 */
  @media screen and (max-width: 768px) {
    .refund-modal {
      width: 95%;
      max-height: 90vh;
    }
  
    .modal-header {
      padding: 24px 20px 16px;
    }
  
    .modal-header h2 {
      font-size: 20px;
    }
  
    .modal-content {
      padding: 16px 20px;
    }
  
    .modal-footer {
      flex-direction: column;
      padding: 16px 20px;
    }
  }
</style>