<template>
  <div class="hotel-ticket-container">
    <!-- Header -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item">
            <span><img src="@/assets/hotel_img/hotel.jpg" alt="hotel"></span>
            Find Stays
          </a>
        </div>
        
        <div class="nav-right">
          <a href="#" class="nav-item">
            <span><img src="@/assets/hotel_img/heart.jpg" alt="heart"></span>
            찜하기
          </a>
          <span>|</span>
          <div class="user-profile" @click="toggleDropdown">
            <div class="user-avatar">
              <div class="online-dot"></div>
            </div>
            <span>Tomhoon</span>
          </div>
        </div>
      </nav>
    </header>

    <!-- User Dropdown -->
    <div class="user-dropdown" :class="{ active: dropdownActive }" ref="dropdown">
      <div class="dropdown-header">
        <div class="dropdown-avatar"></div>
        <div class="dropdown-info">
          <h3>Tomhoon</h3>
          <p>Online</p>
        </div>
      </div>
      <div class="dropdown-menu">
        <a href="#" class="dropdown-item">
          <span><img src="@/assets/hotel_img/account.jpg" alt="account"></span> 계정
        </a>
        <a href="#" class="dropdown-item">
          <span><img src="@/assets/hotel_img/card.jpg" alt="card"></span> 결제내역
        </a>
        <a href="#" class="dropdown-item">
          <span><img src="@/assets/hotel_img/setting.jpg" alt="setting"></span> 설정
        </a>
        <hr style="border: 0.5px solid rgba(17, 34, 17, 0.25);">
        <a href="#" class="dropdown-item">
          <span><img src="@/assets/hotel_img/logout.jpg" alt="logout"></span> 로그아웃
        </a>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="#" style="color: rgba(255, 134, 130, 1);">Turkey</a> > 
      <a href="#" style="color: rgba(255, 134, 130, 1);">Istanbul</a> > 
      <span>해튼호텔</span>
    </div>

    <div class="main-content">
      <!-- Hotel Header -->
      <div class="hotel-header">
        <div class="hotel-info">
          <h1 class="hotel-title">해튼호텔</h1>
          <div class="hotel-location-line">
            <span><img src="@/assets/hotel_img/map.jpg" alt="map"></span>
            <span>Gümüşsuyu Mah. İnönü Cad. No:8, Istanbul 34437</span>
          </div>
        </div>
    
        <div class="hotel-actions">
          <div class="hotel-price">
            <div class="price-amount">₩240,000<span class="price-unit">/night</span></div>
          </div>
          <div class="hotel-buttons">
            <button class="action-btn">
              <img src="@/assets/hotel_img/share.jpg" alt="share">
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
              <div class="left-label">
                Thur, Dec 8
              </div>
              <div class="left-check">
                Check-In
              </div>
            </div>
            <div>
              <img src="@/assets/hotel_account_img/travel.jpg" class="left-image" alt="travel"/>
            </div>
            <div class="ticket-left-updown">
              <div class="left-label">
                Fri, Dec 9
              </div>
              <div class="left-check">
                Check-Out
              </div>
            </div>
          </div>

          <!-- 중앙 -->
          <div class="ticket-center">
            <div class="top-bar">
              <div class="guest">
                <img src="" alt="">
                <span>James Doe</span>
              </div>
              <div class="center-bedroom">Superior room - 1 double bed or 2 twin beds</div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <div>
                  <img src="@/assets/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
                </div>
                <div class="info-item-content">
                  <div class="info-check">
                    체크인
                  </div>          
                   <div class="info-item-time">
                    12:00pm
                  </div>
                </div>
              </div>

              <div class="info-item">
                <div>
                  <img src="@/assets/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
                </div>
                <div class="info-item-content">
                  <div class="info-check">
                    체크아웃
                  </div>  
                   <div class="info-item-time">
                    11:30pm
                  </div>
                </div>
              </div>

              <div class="info-item">
                <div>
                  <img src="@/assets/hotel_account_img/room.jpg" class="info-item-img" alt="room"/>
                </div>
                <div class="info-item-content">
                  <div class="info-check">
                    방번호
                  </div>   
                   <div class="info-item-time">
                    12:00pm
                  </div>
                </div>
              </div>
            </div>

            <div class="ticket-number">
              <div class="ticket-air">EK <div class="ticket-num">ABC12345</div></div>
              <div class="barcode"><img src="@/assets/hotel_account_img/barcode.jpg" alt="barcode"/></div>
            </div>
          </div>
          
          <!-- 오른쪽 CVK 카드 -->
          <div class="ticket-right">
            <div>
              <img src="@/assets/hotel_img/cvk.jpg" alt="cvk"/>
            </div>
          </div>
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
          <span><img src="@/assets/hotel_img/facebook.jpg" alt="facebook"></span>
          <span><img src="@/assets/hotel_img/twitter.jpg" alt="twitter"></span>
          <span><img src="@/assets/hotel_img/youtube.jpg" alt="youtube"></span>
          <span><img src="@/assets/hotel_img/instagram.jpg" alt="instagram"></span>
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
export default {
  name: 'HotelFive',
  data() {
    return {
      dropdownActive: false,
      email: ''
    }
  },
  mounted() {
    // 화면 외부 클릭 시 드롭다운 닫기
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    toggleDropdown() {
      this.dropdownActive = !this.dropdownActive
    },
    handleOutsideClick(event) {
      const dropdown = this.$refs.dropdown
      const userProfile = event.target.closest('.user-profile')
      
      if (dropdown && !dropdown.contains(event.target) && !userProfile) {
        this.dropdownActive = false
      }
    },
    subscribe() {
      if (this.email) {
        console.log('Subscribed:', this.email)
        this.email = ''
      }
    },
    async downloadTicket() {
      try {
        const ticketElement = this.$refs.ticketElement
        
        // html2canvas 동적 로드
        if (!window.html2canvas) {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
          script.onload = () => this.captureTicket(ticketElement)
          document.head.appendChild(script)
        } else {
          this.captureTicket(ticketElement)
        }
      } catch (error) {
        console.error('티켓 다운로드 중 오류가 발생했습니다:', error)
        alert('티켓 다운로드에 실패했습니다. 다시 시도해주세요.')
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
      }).catch(err => {
        console.error('티켓 다운로드 중 오류가 발생했습니다:', err)
        alert('티켓 다운로드에 실패했습니다. 다시 시도해주세요.')
      })
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
            width: 244px;
            height: 24px;
            gap: 8px;
            background: #F8F9FA;
            margin-top: 135px;
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            color: #666666;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 80px;
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
            font-size: 32px;
            leading-trim: NONE;
            line-height: 100%;
            letter-spacing: 0%;
        }
        .left-check{
            width: 55px;
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
            text-align: right;
        }

        .left-image{
            width: 36px;
            height: 92px;
            angle: -0 deg;
            opacity: 1;
            gap: 8px;
            border-radius: 4px;
            padding-left: 20px;
            margin-top: 10px;
            margin-bottom: 10px;
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
</style>