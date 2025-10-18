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
            <div class="user-avatar">
              <div class="online-dot"></div>
            </div>
            <span>{{ displayUserName }}</span>
          </div>
        </div>
      </nav>
    </header>

    <!-- Dropdown - 기존과 동일 -->
    <div class="user-dropdown" :class="{ active: isDropdownActive }" ref="userDropdown">
      <div class="dropdown-header">
        <div class="dropdown-avatar"></div>
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
    </div>

    <!-- ✅ Loading -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>티켓을 불러오는 중...</p>
    </div>

    <!-- ✅ Error -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="$router.push('/hotelaccount')" class="btn-back">예약 내역으로</button>
    </div>

    <!-- ✅ Ticket Content -->
    <div v-else-if="ticket">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a href="#" style="color: rgba(255, 134, 130, 1);">{{ ticket.countryName }}</a> > 
        <a href="#" style="color: rgba(255, 134, 130, 1);">{{ ticket.cityName }}</a> > 
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

        <!-- Ticket -->
        <div class="ticket-container">
          <div class="ticket" ref="ticketElement">
            <!-- 좌측 날짜 -->
            <div class="ticket-left">
              <div class="ticket-left-updown">
                <div class="left-label">{{ formatDate(ticket.checkInDate) }}</div>
                <div class="left-check">Check-In</div>
              </div>
              <div class="left-image">
                <img src="/images/hotel_account_img/travel.jpg"  alt="travel"/>
              </div>
              <div class="ticket-left-updown">
                <div class="left-label">{{ formatDate(ticket.checkOutDate) }}</div>
                <div class="left-check">Check-Out</div>
              </div>
            </div>

            <!-- 중앙 -->
            <div class="ticket-center">
              <div class="top-bar">
                <div class="guest">
                  <img :src="getImageUrl(ticket.profileImage)" alt="profile">
                  <span>{{ ticket.memberName }}</span>
                </div>
                <div class="center-bedroom">{{ ticket.roomName }} - {{ ticket.bedInfo }}</div>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <div>
                    <img src="/images/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
                  </div>
                  <div class="info-item-content">
                    <div class="info-check">체크인</div>          
                    <div class="info-item-time">12:00pm</div>
                  </div>
                </div>

                <div class="info-item">
                  <div>
                    <img src="/images/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
                  </div>
                  <div class="info-item-content">
                    <div class="info-check">체크아웃</div>  
                    <div class="info-item-time">11:30am</div>
                  </div>
                </div>

                <div class="info-item">
                  <div>
                    <img src="/images/hotel_account_img/room.jpg" class="info-item-img" alt="room"/>
                  </div>
                  <div class="info-item-content">
                    <div class="info-check">방번호</div>   
                    <div class="info-item-time">{{ ticket.roomNumber }}</div>
                  </div>
                </div>
              </div>

              <div class="ticket-number">
                <div class="ticket-air">
                  TKT 
                  <div class="ticket-num">{{ ticket.barcode }}</div>
                </div>
                <div class="barcode">
                  <svg class="barcode-svg"></svg>
                </div>
              </div>
            </div>
            
            <!-- 오른쪽 호텔 이미지 -->
            <div class="ticket-right">
              <div>
                <img :src="getImageUrl(ticket.hotelImage)" alt="hotel"/>
              </div>
            </div>
          </div>
        </div>

        <!-- ✅ 환불 버튼 섹션 추가 -->
        <div class="refund-section" v-if="!ticket.refund">
          <button class="refund-btn" @click="requestRefund">
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
  </div>
</template>

<script>
import { authUtils, ticketAPI, paymentAPI, adminAPI } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'
import JsBarcode from 'jsbarcode'

export default {
  name: 'HotelFive',
  data() {
    return {
      isDropdownActive: false,
      email: '',
      userInfo: null,
      isLoggedIn: false,
      
      // ✅ 티켓 데이터
      ticket: null,
      isLoading: true,
      error: null
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();
    
    // ✅ 티켓 로드
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
    // 티켓 로드
    async loadTicket() {
      try {
        this.isLoading = true;

        const paymentId = this.$route.query.paymentId;
        if (!paymentId) {
          throw new Error('결제 정보가 없습니다.');
        }

        const response = await ticketAPI.getTicketByPaymentId(paymentId);

        if (response.code === 200) {
          this.ticket = response.data;

          // 바코드 생성 - DOM 렌더링 완전히 대기
          await this.$nextTick();
          setTimeout(() => {
            this.generateBarcode();
          }, 100);
        } else {
          this.error = response.message || '티켓을 불러올 수 없습니다.';
        }

      } catch (error) {
        console.error('티켓 로드 실패:', error);
        this.error = error.response?.data?.message || error.message || '티켓을 불러오는데 실패했습니다.';
      } finally {
        this.isLoading = false;
      }
    },
    

    // 바코드 생성
    generateBarcode() {
      if (!this.ticket || !this.ticket.barcode) {
        console.log('티켓 또는 바코드 정보 없음:', this.ticket);
        return;
      }

      try {
        const barcodeElement = document.querySelector('.barcode-svg');
        console.log('바코드 요소:', barcodeElement);
        console.log('바코드 데이터:', this.ticket.barcode);

        if (barcodeElement) {
          JsBarcode(barcodeElement, this.ticket.barcode, {
            format: 'CODE128',
            width: 2,
            height: 60,
            displayValue: false,
            margin: 0
          });
          console.log('바코드 생성 완료');
        } else {
          console.error('바코드 SVG 요소를 찾을 수 없습니다');
        }
      } catch (error) {
        console.error('바코드 생성 실패:', error);
      }
    },
    // ✅ 날짜 포맷
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    },
    
    // ✅ 이미지 URL
    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/default.jpg';
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('/images/')) return imagePath;
      return adminAPI.getImageUrl(imagePath);
    },
    
    // ✅ 가격 포맷
    formatPrice(price) {
      if (!price) return '₩0';
      return '₩' + Math.floor(price).toLocaleString('ko-KR');
    },
    
    // ✅ 카카오톡 공유
    async shareTicket() {
      if (!window.Kakao) {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.VUE_APP_KAKAO_SHARE_KEY);
      }

      const ticketUrl = `${window.location.origin}/hotelfive?paymentId=${this.$route.query.paymentId}`;

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${this.ticket.hotelName} 예약 티켓`,
          description: `${this.ticket.roomName}\n체크인: ${this.formatDate(this.ticket.checkInDate)}`,
          imageUrl: this.getImageUrl(this.ticket.hotelImage),
          link: {
            mobileWebUrl: ticketUrl,
            webUrl: ticketUrl,
          },
        },
        buttons: [
          {
            title: '티켓 보기',
            link: {
              mobileWebUrl: ticketUrl,
              webUrl: ticketUrl,
            },
          },
        ],
      });
    },
    
    // ✅ 환불 요청
    async requestRefund() {
      if (this.ticket.refund) {
        alert('이미 환불된 티켓입니다.');
        return;
      }
      
      if (!confirm('정말 환불하시겠습니까?\n환불 후에는 예약이 취소됩니다.')) {
        return;
      }
      
      const cancelReason = prompt('환불 사유를 입력해주세요', '고객 요청');
      if (!cancelReason) return;
      
      try {
        const response = await paymentAPI.refundPayment(
          this.ticket.paymentId, 
          cancelReason
        );
        
        if (response.code === 200) {
          alert('환불이 완료되었습니다!');
          this.$router.push({
            path: '/hotelaccount',
            query: { tab: 'history' }
          });
        }
      } catch (error) {
        console.error('환불 실패:', error);
        alert(error.response?.data?.message || '환불 처리 중 오류가 발생했습니다.');
      }
    },
    
    async downloadTicket() {
      try {
        const ticketElement = this.$refs.ticketElement
        
        if (!window.html2canvas) {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
          script.onload = () => this.captureTicket(ticketElement)
          document.head.appendChild(script)
        } else {
          this.captureTicket(ticketElement)
        }
      } catch (error) {
        console.error('티켓 다운로드 중 오류:', error)
        alert('티켓 다운로드에 실패했습니다.')
      }
    },
    
    captureTicket(ticketElement) {
      window.html2canvas(ticketElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: false
      }).then(canvas => {
        const link = document.createElement('a')
        link.download = `hotel-ticket-${new Date().getTime()}.png`
        link.href = canvas.toDataURL()
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    
    loadUserInfo() {
      this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
      if (this.isLoggedIn) {
        this.userInfo = authUtils.getUserInfo();
      } else {
        this.userInfo = null;
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
    
    subscribe() {
      if (this.email) {
        console.log('Subscribed:', this.email)
        this.email = ''
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

        .online-dot {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #112211;
            border-radius: 50%;
            bottom: 2px;
            right: 2px;
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

        /* Ticket styles from first code */
        .ticket-container {
            display: flex;
            justify-content: center;
            margin: 40px 0;
        }

        .ticket {
            display: flex;
            width: 1231px;
            height: 309px;
            overflow: hidden;
            margin: 0 auto; 
        }
        /* 왼쪽 날짜 구역 */
        .ticket-left {
            width: 246px;
            height: 100%;
            background: #e5f2ed;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            font-weight: bold;
            color: #333;
            border-radius: 12px 0 0 12px;
        }

        .ticket-left-updown{
            width: 188px;
            height: 58px;
            angle: 0 deg;
            opacity: 1;
            gap: 4px;
            padding-left: 20px;
        }
        
        .left-label{
            width: 188px;
            height: 39px;
            angle: 0 deg;
            opacity: 1;
            font-family: Montserrat;
            font-weight: 600;
            font-style: SemiBold;
            font-size: 30px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
        }
        .left-check{
            width: 70px;
            height: 15px;
            angle: 0 deg;
            opacity: 0.6;
            font-family: Montserrat;
            font-weight: 500;
            font-style: Medium;
            font-size: 12px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: left;
        }

        .left-image{
            width: 60px;
            height: 92px;
            angle: -0 deg;
            opacity: 1;
            gap: 8px;
            border-radius: 4px;
            padding-left: 20px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .left-image img{
          width: 36px;
          height: 100%;
        }

        /* 중앙 메인 구역 */
        .ticket-center {
            width: 610px;
            height: 309px;
            angle: 0 deg;
            opacity: 1;
            position: relative;
            border-radius: 0 12px 12px 0;
            background-color: white;
        }
        .top-bar {
            width: 100%;
            height: 96px;
            angle: 0 deg;
            opacity: 1;
            gap: 46px;
            border-radius: 0px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #8DD3BB;
        }
        .top-bar > div {
            margin: 0 14px; /* 각 요소에 좌우 여백 */
        }
        .guest {
            display: flex;
            align-items: center;
        }
        .guest img {
            width: 48px;
            height: 48px;
            angle: 0 deg;
            opacity: 1;
            border: 1px solid #FFFFFF;
            border-radius: 50%;
            margin-right: 10px;
        }
        .guest span{
            width: 141px;
            height: 25px;
            angle: 0 deg;
            opacity: 1;
            font-family: Acme;
            font-weight: 400;
            font-style: Regular;
            font-size: 20px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            color: #112211;
        }

        .center-bedroom{
            width: 228px;
            height: 36px;
            angle: 0 deg;
            opacity: 1;
            font-family: Acme;
            font-weight: 400;
            font-style: Regular;
            font-size: 14px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: right;

        }

        .info-grid {
            width: 610px;
            height: 83px;
            angle: 0 deg;
            opacity: 1;
            gap: 32px;
            padding: 24px;
            display: flex;
        }

        .info-item {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 108px;
            height: 35px;
            angle: 0 deg;
            opacity: 1;
            gap: 8px;

        }
        .info-item-img{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            angle: 0 deg;
            opacity: 1;
            border-radius: 4px;
        }
        .info-item-content {
            width: 68px;
            height: 35px;
            angle: 0 deg;
            opacity: 1;
        }

        .info-item-check{
            width: 34px;
            height: 15px;
            angle: 0 deg;
            opacity: 0.6;
            font-family: Montserrat;
            font-weight: 600;
            font-style: SemiBold;
            font-size: 12px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
        }

        .info-item-time{
            width: 68px;
            height: 20px;
            angle: 0 deg;
            opacity: 1;
            font-family: Montserrat;
            font-weight: 500;
            font-style: Medium;
            font-size: 16px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;

        }

        .info-check{
            width: 50px;
            height: 15px;
            angle: 0 deg;
            opacity: 0.6;
            font-family: Montserrat;
            font-weight: 600;
            font-style: SemiBold;
            font-size: 12px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;

        }

        .info-item-time{
            width: 68px;
            height: 20px;
            angle: 0 deg;
            opacity: 1;
            font-family: Montserrat;
            font-weight: 500;
            font-style: Medium;
            font-size: 16px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;

        }

        .ticket-number{
            height: 130px;
            width: 610px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ticket-air{
            width: 45px;
            height: 39px;
            angle: 0 deg;
            opacity: 1;
            font-family: Montserrat;
            font-weight: 600;
            font-style: SemiBold;
            font-size: 32px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            padding-left: 30px;
        }
        .ticket-num{
            width: 60px;
            height: 15px;
            angle: 0 deg;
            opacity: 0.6;
            font-family: Montserrat;
            font-weight: 500;
            font-style: Medium;
            font-size: 12px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
            margin-top: 10px;
        }


        .barcode {
            width: 248px;
            height: 100%;
            angle: 0 deg;
            opacity: 1;
            display: flex;
            flex-direction: column;   
            justify-content: flex-end; 
            align-items: center; 
        }

        .barcode img{
            height: 81px;
       }

        /* 오른쪽 호텔 로고 (독립 카드) */
        .ticket-right {
            width: 375px;
            height: 100%;
            background: white;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            margin-left: 2px;
        }
        .ticket-right img{
            width: 161px;
            height: 161px;
            angle: 0 deg;
            opacity: 1;
            top: 74px;
            left: 107px;
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
;
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

</style>