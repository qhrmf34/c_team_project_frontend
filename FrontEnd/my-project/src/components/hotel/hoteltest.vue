<template>
  <div>
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item">
            <span><img src="@/assets/hotel_img/hotel.jpg"></span>
            Hotels
          </a>
        </div>
        
        <div class="nav-right">
          <a href="#" class="nav-item">
            <span><img src="@/assets/hotel_img/heart.jpg"></span>
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

    <div class="user-dropdown" :class="{ active: isDropdownActive }" ref="userDropdown">
      <div class="dropdown-header">
        <div class="dropdown-avatar"></div>
        <div class="dropdown-info">
          <h3>Tomhoon</h3>
          <p>Online</p>
        </div>
      </div>
      <div class="dropdown-menu">
        <a href="#" class="dropdown-item">
          <img src="@/assets/hotel_img/account.jpg">계정
        </a>
        <a href="#" class="dropdown-item">
          <img src="@/assets/hotel_img/card.jpg">결제내역
        </a>
        <a href="#" class="dropdown-item">
          <img src="@/assets/hotel_img/setting.jpg">설정
        </a>
        <hr style="border: 0.5px solid rgba(17, 34, 17, 0.25);">
        <a href="#" class="dropdown-item">
          <img src="@/assets/hotel_img/logout.jpg">로그아웃
        </a>
      </div>
    </div>

    <section class="hero-section">
      <img src="@/assets/hotel_img/plushotel.jpg" alt="Hero Background">
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
          <button class="see-all-btn travel-section-btn">See All</button>
        </div>

        <!-- 기존 하드코딩된 여행지 카드들 (간단히) -->
        <div class="destination-cards">
          <div class="destination-card">
            <img src="@/assets/hotel_img/melbourne.jpg" alt="Melbourne" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
            <div class="card-overlay">
              <div class="card-content">
                <div class="card-info">
                  <h3>멜버른</h3>
                  <p>Amazing journey</p>
                </div>
                <div class="card-price">₩130,000</div>
              </div>
              <button class="book-btn">Book a Hotel</button>
            </div>
          </div>

          <div class="destination-card">
            <img src="@/assets/hotel_img/paris.jpg" alt="Paris" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
            <div class="card-overlay">
              <div class="card-content">
                <div class="card-info">
                  <h3>파리</h3>
                  <p>A Paris Adventure</p>
                </div>
                <div class="card-price">₩150,000</div>
              </div>
              <button class="book-btn">Book a Hotel</button>
            </div>
          </div>

          <div class="destination-card">
            <img src="@/assets/hotel_img/london.jpg" alt="London" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
            <div class="card-overlay">
              <div class="card-content">
                <div class="card-info">
                  <h3>런던</h3>
                  <p>London eye adventure</p>
                </div>
                <div class="card-price">₩130,000</div>
              </div>
              <button class="book-btn">Book a Hotel</button>
            </div>
          </div>

          <div class="destination-card">
            <img src="@/assets/hotel_img/colombia.jpg" alt="Colombia" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
            <div class="card-overlay">
              <div class="card-content">
                <div class="card-info">
                  <h3>콜롬비아</h3>
                  <p>Amazing streets</p>
                </div>
                <div class="card-price">₩150,000</div>
              </div>
              <button class="book-btn">Book a Hotel</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 새로운 무료시설 섹션 추가 -->
      <section class="freebies-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">호텔 무료시설</h2>
            <p class="section-subtitle">우리 호텔에서 제공하는 무료 서비스를 확인해보세요</p>
          </div>
        </div>

        <!-- 로딩 상태 표시 -->
        <div v-if="freebiesLoading" class="loading-message">
          무료시설 정보를 불러오는 중...
        </div>

        <!-- 에러 상태 표시 -->
        <div v-else-if="freebiesError" class="error-message">
          {{ freebiesError }}
        </div>

        <!-- 무료시설 목록 (API에서 가져온 데이터) -->
        <div v-else class="freebies-list">
          <div 
            v-for="freebie in freebiesList" 
            :key="freebie.id" 
            class="freebie-item"
          >
            <div class="freebie-icon">🏨</div>
            <div class="freebie-name">{{ freebie.freebiesName }}</div>
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
              <img src="@/assets/hotel_img/tour-image-1.jpg" alt="Tour Image 1" class="tour-image">
              <img src="@/assets/hotel_img/tour-image-2.jpg" alt="Tour Image 2" class="tour-image">
            </div>
            <div class="image-row">
              <img src="@/assets/hotel_img/tour-image-3.jpg" alt="Tour Image 3" class="tour-image">
              <img src="@/assets/hotel_img/tour-image-4.jpg" alt="Tour Image 4" class="tour-image">
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
          <img src="@/assets/hotel_img/facebook.jpg"/>
          <img src="@/assets/hotel_img/twitter.jpg"/>
          <img src="@/assets/hotel_img/youtube.jpg"/>
          <img src="@/assets/hotel_img/instagram.jpg"/>
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

// HotelOne.vue의 script 부분을 다음과 같이 수정

// HotelOne.vue의 script 부분을 다음과 같이 수정

<script>
import axios from 'axios'

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
      // 무료시설 API 관련 데이터
      freebiesList: [],
      freebiesLoading: false,
      freebiesError: null,
      // 환경 변수를 제대로 사용하도록 수정
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:8089/api/test'
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    // 디버깅을 위한 로그 추가
    console.log('환경:', process.env.NODE_ENV);
    console.log('API URL:', this.apiBaseUrl);
    console.log('전체 환경변수:', process.env);
    
    // 컴포넌트 마운트 시 무료시설 데이터 로드
    await this.loadFreebies();
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  
  methods: {
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    subscribe() {
      if (this.newsletter.email) {
        alert('구독이 완료되었습니다!');
        this.newsletter.email = '';
      } else {
        alert('이메일을 입력해주세요.');
      }
    },
    
    handleClickOutside(event) {
      if (!this.$refs.userDropdown.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    },
    
    // 무료시설 데이터 로드 (디버깅 강화)
    async loadFreebies() {
      this.freebiesLoading = true;
      this.freebiesError = null;
      
      try {
        console.log('API 호출 시작:', `${this.apiBaseUrl}/freebies`);
        
        // axios 요청에 더 자세한 설정 추가
        const response = await axios({
          method: 'get',
          url: `${this.apiBaseUrl}/freebies`,
          timeout: 10000, // 10초 타임아웃
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('API 응답 전체:', response);
        console.log('API 응답 데이터:', response.data);
        
        // API 응답 구조에 맞게 데이터 추출
        // ApiResponse 구조: { code: 200, message: "success", data: [...] }
        if (response.data && response.data.data) {
          this.freebiesList = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          this.freebiesList = response.data;
        } else {
          console.warn('예상과 다른 응답 구조:', response.data);
          this.freebiesList = [];
        }
        
        // 데이터가 없는 경우 기본 메시지
        if (this.freebiesList.length === 0) {
          this.freebiesError = '현재 표시할 무료시설이 없습니다.';
        }
        
        console.log('처리된 무료시설 데이터:', this.freebiesList);
        
      } catch (error) {
        console.error('무료시설 데이터 로드 실패:', error);
        
        // 에러 타입별로 다른 메시지 표시
        if (error.code === 'ECONNABORTED') {
          this.freebiesError = '요청 시간이 초과되었습니다. 서버 상태를 확인해주세요.';
        } else if (error.response) {
          // 서버에서 응답은 왔지만 에러 상태
          console.log('에러 응답 상태:', error.response.status);
          console.log('에러 응답 데이터:', error.response.data);
          this.freebiesError = `서버 에러 (${error.response.status}): ${error.response.data?.message || '알 수 없는 에러'}`;
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못함
          console.log('응답 없음:', error.request);
          this.freebiesError = '서버와 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
        } else {
          // 요청 설정 중에 에러 발생
          console.log('요청 설정 에러:', error.message);
          this.freebiesError = `요청 에러: ${error.message}`;
        }
        
        // 개발 환경에서 더 자세한 에러 정보 표시
        if (process.env.NODE_ENV === 'development') {
          console.log('Error details:', error);
        }
      } finally {
        this.freebiesLoading = false;
      }
    }
  }
}
</script>

<style scoped>
/* 기존 스타일은 그대로 유지하고 추가 스타일만 작성 */

/* 로딩 및 에러 메시지 스타일 */
.loading-message, .error-message {
  text-align: center;
  padding: 40px;
  font-family: Montserrat;
  font-size: 16px;
  color: #112211;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  border-radius: 8px;
  margin: 20px 0;
}

/* 카드 호버 효과 추가 */
.destination-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}



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
}

.hero-section {
  background: #000;
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
  width: 970.78px;
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

/* 무료시설 섹션 스타일 */
.freebies-section {
  margin-bottom: 120px;
}

.freebies-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.freebie-item {
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 24px;
  width: 280px;
  text-align: center;
  box-shadow: 0px 2px 8px rgba(17, 34, 17, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.freebie-item:hover {
  transform: translateY(-3px);
  box-shadow: 0px 4px 16px rgba(17, 34, 17, 0.1);
}

.freebie-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.freebie-name {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: #112211;
}

.footer-column a:hover {
  opacity: 1;
}
</style>