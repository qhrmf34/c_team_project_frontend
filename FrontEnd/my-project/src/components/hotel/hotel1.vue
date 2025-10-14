<template>
  <div>
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

    <section class="hero-section">
      <img src="/images/hotel_img/plushotel.jpg" alt="Hero Background">
      <div class="hero-content">
        <h1 class="hero-title">플러스 호텔 및 다양한 숙소를 확인하세요!</h1>
        <p class="hero-subtitle">검색을 통해 요금을 비교하고 무료 취소를 포함한 특가도 확인하세요!</p>
      </div>

      <div class="search-form">
        <h2 class="search-title">Where are you staying?</h2>
        <div class="search-fields">
          <div class="form-field destination-field">
            <label>Enter Destination</label>
            <input type="text" placeholder="신라스테이 춘천, 춘천, 서울" v-model="searchData.destination">
          </div>
          <div class="form-field date-field">
            <label>Check In</label>
            <input type="date" v-model="searchData.checkIn">
          </div>
          <div class="form-field date-field">
            <label>Check Out</label>
            <input type="date" v-model="searchData.checkOut">
          </div>
          <div class="form-field guests-field">
            <label>Rooms & Guests</label>
            <select v-model="searchData.guests">
              <option>1 room, 2 guests</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <main class="main-content">
      <section class="travel-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">여행에 빠지다</h2>
            <p class="section-subtitle">특가상품으로 진행하는 여행을 예약해보세요</p>
          </div>
          <button class="see-all-btn travel-section-btn" @click="goToHotelSearch">See All</button>
        </div>

      <!-- 1. 도시 카드의 Book a Hotel 버튼에 클릭 이벤트 추가 -->
      <div class="destination-cards">
        <div v-for="city in featuredCities" :key="city.id" class="destination-card">
          <img :src="getCityImageUrl(city.cityImagePath)" 
               :alt="city.cityName" 
               style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
          <div class="card-overlay">
            <div class="card-content">
              <div class="card-info">
                <h3>{{ city.cityName }}</h3>
                <p>{{ city.cityContent || 'Amazing journey' }}</p>
              </div>
              <div class="card-price">{{ formatPrice(city.minPrice) }}</div>
            </div>
            <button class="book-btn" @click="bookHotelByCity(city.cityName)">Book a Hotel</button>
          </div>
        </div>
      </div>
    </section>

      <section class="travel-section">
        <div class="section-header">
          <div>
            <h2 class="section-title more-travel-title">여행 더보기</h2>
            <p class="section-subtitle">Going somewhere to celebrate this season? Whether you're going home or somewhere to roam, we've got the travel tools to get you to your<br> destination.</p>
          </div>
          <button class="see-all-btn">See All</button>
        </div>

        <div class="more-travel">
          <div class="malaka-tour">
            <div class="tour-header">
              <h2 class="tour-title">말라카 투어</h2>
              <div class="price-tag">
                <div class="from">From</div>
                <div class="price">$700</div>
              </div>
            </div>

            <p class="tour-description">오래된 시간의 숨결이 머무는 도시, 말라카(Melaka). 말레이시아의 작은 보석 같은 이 도시는 동서양 문화가 만나는 관문이자, 세계문화유산으로 지정된 매혹적인 여행지입니다. 단 하루만 머물러도 그 깊은 매력에 빠지고, 며칠을 살아보면 다시 찾고 싶은 마음이 샘솟는 곳. 이제 저희 여행사가 준비한 특별한 말라카 투어상품과 함께 그 여정을 시작해 보세요.</p>

            <button class="tour-btn">Book Flight</button>
          </div>

          <div class="tour-images">
            <div class="image-row">
              <img src="/images/hotel_img/tour-image-1.jpg" alt="Tour Image 1" class="tour-image">
              <img src="/images/hotel_img/tour-image-2.jpg" alt="Tour Image 2" class="tour-image">
            </div>
            <div class="image-row">
              <img src="/images/hotel_img/tour-image-3.jpg" alt="Tour Image 3" class="tour-image">
              <img src="/images/hotel_img/tour-image-4.jpg" alt="Tour Image 4" class="tour-image">
            </div>
          </div>
        </div>
      </section>
    </main>

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
            <input type="email" class="newsletter-input" placeholder="Your email address" v-model="newsletter.email">
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
          <img src="/images/hotel_img/facebook.jpg"/>
          <img src="/images/hotel_img/twitter.jpg"/>
          <img src="/images/hotel_img/youtube.jpg"/>
          <img src="/images/hotel_img/instagram.jpg"/>
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
// HotelOne.vue의 script 부분만 업데이트
import { authUtils, hotelAPI, adminAPI,memberCouponAPI  } from '@/utils/commonAxios'

export default {
  name: 'HotelOne',
  data() {
    return {
      isDropdownActive: false,
      searchData: {
        destination: '',
        checkIn: '2024-12-12',
        checkOut: '2024-12-14',
        guests: '1 room, 2 guests'
      },
      newsletter: {
        email: ''
      },
      // 사용자 정보
      userInfo: null,
      isLoggedIn: false,
      featuredCities: [],
      showCouponModal: false,
      receivedCoupons: []

    }
  },
  
  computed: {
    // 표시할 사용자 이름 계산 (소셜 로그인 개선)
    displayUserName() {
      if (this.isLoggedIn && this.userInfo) {
        const { provider, firstName, lastName, email } = this.userInfo;
        
        // 소셜 로그인의 경우 firstName만 사용
        if (provider === 'kakao' || provider === 'google' || provider === 'naver') {
          return firstName || email?.split('@')[0] || 'Social User';
        }
        
        // local 로그인의 경우 firstName + lastName 사용
        if (provider === 'local') {
          if (firstName && lastName) {
            return `${firstName} ${lastName}`;
          } else if (firstName) {
            return firstName;
          } else if (email) {
            return email.split('@')[0];
          }
        }
      }
      
      // 로그인하지 않은 경우 기본 이름
      return 'Guest';
    },
    
    // 사용자 상태 표시
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
        toggleDropdown() {
          this.isDropdownActive = !this.isDropdownActive;
        },

        handleClickOutside(event) {
          if (!this.$refs.userDropdown.contains(event.target) && 
              !event.target.closest('.user-profile')) {
            this.isDropdownActive = false;
          }
        },

        loadUserInfo() {
          this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();

          if (this.isLoggedIn) {
            this.userInfo = authUtils.getUserInfo();
            console.log('사용자 정보:', this.userInfo);
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
              console.error('로그아웃 중 오류:', error);
              authUtils.logout();
              this.loadUserInfo();
              alert('로그아웃되었습니다.');
              this.$router.push('/login');
            }
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

        async loadFeaturedCities() {
          try {
            const response = await hotelAPI.getFeaturedCities(4);
            this.featuredCities = response.data || [];
          } catch (error) {
            console.error('추천 도시 로드 실패:', error);
            this.featuredCities = [];
          }
        },

        getCityImageUrl(imagePath) {
          if (!imagePath) {
            return '/images/hotel_img/melbourne.jpg';
          }
          return adminAPI.getImageUrl(imagePath);
        },

        formatPrice(price) {
          if (!price) return '₩0';
          return '₩' + adminAPI.formatNumber(price);
        },

        bookHotelByCity(cityName) {
          this.$router.push({
            path: '/hoteltwo',
            query: { 
              destination: cityName,
              checkIn: this.getToday(),
              checkOut: this.getTomorrow()
            }
          });
        },

        goToHotelSearch() {
          this.$router.push('/hoteltwo');
        },

        getToday() {
          const today = new Date();
          return today.toISOString().split('T')[0];
        },

        getTomorrow() {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          return tomorrow.toISOString().split('T')[0];
        },      
        goToPaymentHistory() {
          if (this.isLoggedIn) {
            this.$router.push({
              path: '/hotelaccount',
              query: { tab: 'history' }
            });
            this.isDropdownActive = false; // 드롭다운 닫기
          } else {
            alert('로그인이 필요한 서비스입니다.');
            this.$router.push('/login');
          }
        }
      },

      mounted() {
        document.addEventListener('click', this.handleClickOutside);
        this.loadUserInfo();
        this.loadFeaturedCities();
      },

      beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
      },

      watch: {
        '$route'() {
          this.loadUserInfo();
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
        font-style: SemiBold;
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
        cursor: pointer;
    }
    .dropdown-item:hover {
        color: #7dd3c0;
    }
    
    .hero-section {
        background: #000; /* 폴백 배경 */
        height: 537px;
        padding: 80px 174px 120px 126px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        margin-top: 87px;
    }
    
    .hero-section img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
    }
    
    /* 이미지 위에 오버레이 추가 */
    .hero-section::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(0, 35, 77, 0.63) 11.46%, rgba(0, 35, 77, 0) 77.37%);
        z-index: 2;
    }
    
    .hero-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 440px;
        position: relative;
        z-index: 3;
    }

    .hero-title {
        font-family: 'Abhaya Libre ExtraBold';
        font-weight: 800;
        font-size: 45px;
        line-height: 100%;
        color: white;
    }

    .hero-subtitle {
        font-family: Montserrat;
        font-weight: 500;
        font-size: 20px;
        line-height: 100%;
        color: #FFFFFF;
        width: 375px;
    }

    /* Search Form */
    .search-form {
        position: absolute;
        width: 1232px;
        height: 176px;
        left: 50%;
        transform: translateX(-50%);
        bottom: -88px;
        background: #FFFFFF;
        box-shadow: 0px 4px 16px rgba(17, 34, 17, 0.05);
        border-radius: 16px;
        padding: 32px 24px;
        z-index: 100;
    }

    .search-title {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 20px;
        line-height: 100%;
        color: #112211;
        margin-bottom: 32px;
    }

    .search-fields {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    .form-field {
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .form-field input, .form-field select {
        background: #FFFFFF;
        border: 1px solid #79747E;
        border-radius: 4px;
        padding: 16px;
        font-family: Montserrat;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        height: 56px;
    }

    .form-field label {
        position: absolute;
        top: -8px;
        left: 12px;
        background: #FFFFFF;
        padding: 0 4px;
        font-family: Montserrat;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        color: #112211;
    }

    .destination-field {
        flex: 1;
        min-width: 416px;
    }

    .date-field {
        width: 240px;
    }

    .guests-field {
        width: 240px;
    }

    /* Main Content */
    .main-content {
        padding: 150px 104px 0;
        flex: 1;
    }

    /* Travel Section */
    .travel-section {
        margin-bottom: 120px;
    }

    .travel-section-btn {
         margin-top: 86px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 80px;
    }

    .section-title {
        font-family: ABeeZee;
        font-weight: 400;
        font-size: 32px;
        line-height: 100%;
        color: #000000;
        margin-bottom: 16px;
        margin-top: 95px;
    }

    .section-title.more-travel-title {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 32px;
        line-height: 100%;
        margin-top: -50px;
    }

    .section-subtitle {
        font-family: Montserrat;
        font-weight: 400;
        font-size: 16px;
        line-height: 100%;
        margin-bottom: -43px;
        color: #000000;
    }

    .see-all-btn {
        padding: 8px 16px;
        border: 1px solid #8DD3BB;
        border-radius: 4px;
        background: transparent;
        color: rgba(17, 34, 17, 1);
        font-family: Montserrat;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        cursor: pointer;
    }

    .destination-cards {
        display: flex;
        gap: 16px;
        justify-content: center;
    }

    .destination-card {
        width: 296px;
        height: 420px;
        border-radius: 12px;
        position: relative;
        overflow: hidden;
        background-size: cover;
        background-position: center;
    }

    .card-overlay {
        position: absolute;
        bottom: 24px;
        left: 24px;
        right: 24px;
        color: white;
    }

    .card-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 16px;
    }

    .card-info h3 {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 24px;
        line-height: 100%;
        margin-bottom: 4px;
    }

    .card-info p {
        font-family: Montserrat;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        opacity: 0.9;
    }

    .card-price {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 24px;
        line-height: 100%;
    }

    .book-btn {
        width: 100%;
        padding: 16px;
        background: #8DD3BB;
        border: none;
        border-radius: 4px;
        font-family: Montserrat;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        cursor: pointer;
    }

    /* More Travel Section */
    .more-travel {
        display: flex;
        gap: 24px;
        margin-bottom: 60px;
        justify-content: center;
        margin-top: -50px;
        margin-bottom: 250px;
    }

    .malaka-tour {
        width: 552px;
        height: 424px;
        background: rgba(141, 211, 187, 1);
        border-radius: 20px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .tour-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
    }

    .tour-title {
        font-family: ABeeZee;
        font-weight: 400;
        font-size: 40px;
        line-height: 100%;
        color: #112211;
    }

    .price-tag {
        background: #FFFFFF;
        border-radius: 8px;
        padding: 8px;
        text-align: center;
        width: 68px;
    }

    .price-tag .from {
        font-family: Acme;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        color: #112211;
    }

    .price-tag .price {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 20px;
        line-height: 100%;
        color: #112211;
    }

    .tour-description {
        font-family: Montserrat;
        font-weight: 400;
        font-size: 14px;
        line-height: 100%;
        color: #112211;
        margin-bottom: 24px;
        flex: 1;
    }

    .tour-btn {
        width: 100%;
        padding: 16px;
        background: #FFFFFF;
        border: none;
        border-radius: 4px;
        color: #112211;
        font-family: Montserrat;
        font-weight: 500;
        font-size: 14px;
        line-height: 100%;
        cursor: pointer;
    }

    .tour-images {
        width: 656px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .image-row {
        display: flex;
        gap: 20px;
    }

    .tour-image {
        width: 318px;
        height: 200px;
        border: 2px solid rgba(141, 211, 187, 1);     
        border-radius: 12px;
    }

    /* Newsletter Section */
    .newsletter-section {
        background: rgba(141, 211, 187, 1);
        padding: 80px 104px 80px 104px;
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
    /* 반응형 디자인 - 노트북 */
    
    /* 1366px - 1536px (작은 노트북) */
    @media screen and (max-width: 1536px) {
        .header {
            padding: 21px 60px;
        }

        .search-form {
            width: 90%;
            max-width: 1100px;
        }

        .main-content {
            padding: 150px 60px 0;
        }

        .newsletter-section {
            padding: 80px 60px;
        }

        .destination-cards {
            gap: 12px;
        }

        .destination-card {
            width: 280px;
            height: 400px;
        }

        .tour-images {
            width: 600px;
        }

        .tour-image {
            width: 290px;
            height: 190px;
        }

        .mailbox-container {
            transform: scale(0.95);
        }
    }

    /* 1200px - 1366px (중간 노트북) */
    @media screen and (max-width: 1366px) {
        .header {
            padding: 21px 40px;
        }

        .hero-section {
            padding: 80px 40px 120px;
        }

        .search-form {
            width: 90%;
            max-width: 1000px;
            padding: 24px 20px;
        }

        .search-fields {
            gap: 12px;
        }

        .destination-field {
            min-width: 350px;
        }

        .date-field,
        .guests-field {
            width: 200px;
        }

        .main-content {
            padding: 150px 40px 0;
        }

        .section-header {
            margin-bottom: 60px;
        }

        .destination-cards {
            gap: 10px;
        }

        .destination-card {
            width: 260px;
            height: 380px;
        }

        .more-travel {
            gap: 20px;
        }

        .malaka-tour {
            width: 480px;
            height: 400px;
            padding: 20px;
        }

        .tour-title {
            font-size: 36px;
        }

        .tour-images {
            width: 520px;
        }

        .image-row {
            gap: 16px;
        }

        .tour-image {
            width: 252px;
            height: 180px;
        }

        .newsletter-section {
            padding: 60px 40px;
        }

        .newsletter-content {
            padding: 40px;
        }

        .newsletter-title {
            font-size: 38px;
            line-height: 48px;
        }

        .mailbox-container {
            transform: scale(0.85);
        }

        .footer-links {
            gap: 40px;
        }
    }

    /* 1024px - 1200px (작은 노트북 / 큰 태블릿) */
    @media screen and (max-width: 1200px) {
        .header {
            padding: 16px 30px;
            height: 75px;
        }

        nav {
            max-width: 100%;
        }

        .nav-item {
            font-size: 13px;
        }

        .hero-section {
            height: 480px;
            padding: 60px 30px 100px;
        }

        .hero-content {
            width: 100%;
            max-width: 400px;
        }

        .hero-title {
            font-size: 38px;
        }

        .hero-subtitle {
            font-size: 18px;
            width: 100%;
            max-width: 350px;
        }

        .search-form {
            width: 90%;
            max-width: 900px;
            height: auto;
            bottom: -100px;
            padding: 20px;
        }

        .search-title {
            font-size: 18px;
            margin-bottom: 20px;
        }

        .search-fields {
            flex-wrap: wrap;
            gap: 12px;
        }

        .destination-field {
            min-width: 100%;
        }

        .date-field,
        .guests-field {
            width: calc(50% - 6px);
        }

        .main-content {
            padding: 170px 30px 0;
        }

        .section-title {
            font-size: 28px;
            margin-top: 60px;
        }

        .section-subtitle {
            font-size: 14px;
        }

        .destination-cards {
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .destination-card {
            width: 48%;
            min-width: 240px;
            height: 360px;
        }

        .more-travel {
            flex-direction: column;
            align-items: center;
            margin-bottom: 180px;
        }

        .malaka-tour {
            width: 100%;
            max-width: 600px;
            height: auto;
            min-height: 350px;
        }

        .tour-title {
            font-size: 32px;
        }

        .tour-images {
            width: 100%;
            max-width: 600px;
        }

        .image-row {
            gap: 12px;
        }

        .tour-image {
            width: calc(50% - 6px);
            height: 160px;
        }

        .newsletter-section {
            padding: 50px 30px;
            min-height: 422px;
        }

        .newsletter-content {
            padding: 32px;
            min-height: 305px;
        }

        .newsletter-title {
            font-size: 32px;
            line-height: 42px;
        }

        .newsletter-form {
            width: 100%;
        }

        .mailbox-container {
            transform: scale(0.75);
        }

        .footer-links {
            gap: 30px;
        }
    }

    /* 768px - 1024px (태블릿) */
    @media screen and (max-width: 1024px) {
        .user-dropdown {
            left: auto;
            right: 20px;
            width: 300px;
        }

        .destination-card {
            width: 45%;
            min-width: 220px;
        }

        .travel-section {
            margin-bottom: 80px;
        }

        .tour-image {
            height: 140px;
        }

        .mailbox-container {
            transform: scale(0.7);
        }
    }
</style>
