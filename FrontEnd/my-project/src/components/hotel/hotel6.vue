<template>
  <div class="hotel-favourites-container">
    <!-- Header -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item">
            <span>
              <img src="@/assets/hotel_img/airplane.png" alt="airplane"/>
              Find Flight
            </span>
          </a>
          <a href="#" class="nav-item">
            <span>
              <img src="@/assets/hotel_img/hotel.jpg" alt="hotel">
              Find Stays
            </span>
          </a>
        </div>

        <div class="nav-center">
          <a href="#" class="nav-item">
            <img src="@/assets/hotel_img/Logo.png" alt="logo"/>
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
          <img src="@/assets/hotel_img/account.jpg" alt="account">
          계정
        </a>
        <a href="#" class="dropdown-item">
          <img src="@/assets/hotel_img/card.jpg" alt="card">
          결제내역
        </a>
        <a href="#" class="dropdown-item">
          <img src="@/assets/hotel_img/setting.jpg" alt="setting">
          설정
        </a>
        <hr style="border: 0.5px solid rgba(17, 34, 17, 0.25);">
        <a href="#" class="dropdown-item">
          <img src="@/assets/hotel_img/logout.jpg" alt="logout">
          로그아웃
        </a>
      </div>
    </div>

    <!-- Favourites Section -->
    <section class="favourites-section">
      <div class="favourites-title">Favourites</div>
      
      <!-- Tabs -->
      <div class="favourites-tabs">
        <div class="select-tab-btn" :class="{ active: activeTab === 'flights' }" @click="switchTab('flights')">
          Flights
          <span class="tab-count">2 marked</span>
        </div>

        <div class="select-line"></div>

        <div class="select-tab-btn" :class="{ active: activeTab === 'places' }" @click="switchTab('places')">
          Places
          <span class="tab-count">3 marked</span>
        </div>
      </div>

      <!-- Flights Content -->
      <div class="tab-content" :class="{ active: activeTab === 'flights' }">
        <div class="empty-state">
          <h3>항공편 찜하기 목록이 비어있습니다</h3>
          <p>마음에 드는 항공편을 찜해보세요!</p>
        </div>
      </div>

      <!-- Places Content -->
      <div class="tab-content" :class="{ active: activeTab === 'places' }">
        <main class="main-content">
          <section class="results-section">
            <div class="hotel-cards" :class="{ 'show-all': showingAll }">
              <!-- Visible Hotels -->
              <div v-for="hotel in visibleHotels" :key="hotel.id" class="hotel-card">
                <div class="hotel-image-container">
                  <img :src="hotel.image" :alt="hotel.name" class="hotel-image">
                  <div class="image-count">{{ hotel.imageCount }} images</div>
                </div>
                <div class="hotel-content">
                  <h3 class="hotel-title">{{ hotel.name }}</h3>
                  <div class="price-info">
                    <div class="price-label">starting from</div>
                    <div class="price-amount">{{ hotel.price }}<span class="price-unit">/night</span></div>
                    <div class="price-tax">excl. tax</div>
                  </div>
                  <div class="hotel-location">
                    <span><img src="@/assets/hotel_img/map.jpg" alt="map"/></span>
                    <span>{{ hotel.location }}</span>
                  </div>
                  <div class="hotel-meta">
                    <span class="stars">{{ hotel.stars }}</span>
                    <span class="hotel-type">{{ hotel.type }}</span>
                    <span class="amenities">
                      <img src="@/assets/hotel_img/coffee.jpg" alt="coffee"/> {{ hotel.amenities }}
                    </span>
                  </div>
                  <div class="rating-section">
                    <span class="rating-score">{{ hotel.rating }}</span>
                    <span class="rating-text">{{ hotel.ratingText }}</span>
                  </div>
                  <div class="hotel-beeline"></div>
                  <div class="bottom-section">
                    <div class="button-container">
                      <button class="wishlist-btn" @click="toggleWishlist(hotel)" :style="{ color: hotel.wishlisted ? '#FF6B6B' : '#666666' }">
                        {{ hotel.wishlisted ? '♥' : '♡' }}
                      </button>
                      <button class="view-place-btn">View Place</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Hidden Hotels -->
              <div v-for="hotel in hiddenHotels" :key="hotel.id" class="hotel-card hidden-hotels">
                <div class="hotel-image-container">
                  <img :src="hotel.image" :alt="hotel.name" class="hotel-image">
                  <div class="image-count">{{ hotel.imageCount }} images</div>
                </div>
                <div class="hotel-content">
                  <h3 class="hotel-title">{{ hotel.name }}</h3>
                  <div class="price-info">
                    <div class="price-label">starting from</div>
                    <div class="price-amount">{{ hotel.price }}<span class="price-unit">/night</span></div>
                    <div class="price-tax">excl. tax</div>
                  </div>
                  <div class="hotel-location">
                    <span><img src="@/assets/hotel_img/map.jpg" alt="map"/></span>
                    <span>{{ hotel.location }}</span>
                  </div>
                  <div class="hotel-meta">
                    <span class="stars">{{ hotel.stars }}</span>
                    <span class="hotel-type">{{ hotel.type }}</span>
                    <span class="amenities">
                      <img src="@/assets/hotel_img/coffee.jpg" alt="coffee"/> {{ hotel.amenities }}
                    </span>
                  </div>
                  <div class="rating-section">
                    <span class="rating-score">{{ hotel.rating }}</span>
                    <span class="rating-text">{{ hotel.ratingText }}</span>
                  </div>
                  <div class="hotel-beeline"></div>
                  <div class="bottom-section">
                    <div class="button-container">
                      <button class="wishlist-btn" @click="toggleWishlist(hotel)" :style="{ color: hotel.wishlisted ? '#FF6B6B' : '#666666' }">
                        {{ hotel.wishlisted ? '♥' : '♡' }}
                      </button>
                      <button class="view-place-btn">View Place</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button class="show-more-btn" @click="toggleShowMore">
              {{ showingAll ? 'Show less results' : 'Show more results' }}
            </button>
          </section>
        </main>
      </div>
    </section>

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
  name: 'HotelSix',
  data() {
    return {
      dropdownActive: false,
      activeTab: 'places',
      showingAll: false,
      email: '',
      visibleHotels: [
        {
          id: 1,
          name: '해튼호텔',
          image: require('@/assets/hotel_img/hotel1.jpg'),
          imageCount: 9,
          price: '₩240,000',
          location: 'Gümüşsuyu Mah. İnönü Cad. No:8, Istanbul 34437',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenities: '20+ Amenities',
          rating: '4.2',
          ratingText: 'Very Good 371 reviews',
          wishlisted: false
        },
        {
          id: 2,
          name: '마제스틱 말라카 호텔',
          image: require('@/assets/hotel_img/hotel2.jpg'),
          imageCount: 9,
          price: '₩120,000',
          location: 'Kuçukayasofya No. 40 Sultanahmet, Istanbul 34022',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenities: '20+ Amenities',
          rating: '4.2',
          ratingText: 'Very Good 54 reviews',
          wishlisted: false
        },
        {
          id: 3,
          name: '카나휘 리모 호텔',
          image: require('@/assets/hotel_img/hotel3.jpg'),
          imageCount: 9,
          price: '₩130,000',
          location: 'Kuçukayasofya No. 40 Sultanahmet, Istanbul 34022',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenities: '20+ Amenities',
          rating: '4.2',
          ratingText: 'Very Good 54 reviews',
          wishlisted: false
        }
      ],
      hiddenHotels: [
        {
          id: 4,
          name: '베이알 호텔',
          image: require('@/assets/hotel_img/hotel4.jpg'),
          imageCount: 9,
          price: '₩104,000',
          location: 'Kuçukayasofya No. 40 Sultanahmet, Istanbul 34022',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenities: '20+ Amenities',
          rating: '4.2',
          ratingText: 'Very Good 54 reviews',
          wishlisted: false
        },
        {
          id: 5,
          name: '그랜드 플라자 호텔',
          image: require('@/assets/hotel_img/hotel4.jpg'),
          imageCount: 12,
          price: '₩85,000',
          location: 'Beyoğlu, Galata Kulesi Sk. No:15, Istanbul 34421',
          stars: '★★★★☆',
          type: '4 Star Hotel',
          amenities: '15+ Amenities',
          rating: '4.0',
          ratingText: 'Good 289 reviews',
          wishlisted: false
        },
        {
          id: 6,
          name: '오션뷰 리조트',
          image: require('@/assets/hotel_img/hotel4.jpg'),
          imageCount: 15,
          price: '₩320,000',
          location: 'Kadıköy, Bağdat Cd. No:234, Istanbul 34710',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenities: '25+ Amenities',
          rating: '4.5',
          ratingText: 'Excellent 156 reviews',
          wishlisted: false
        },
        {
          id: 7,
          name: '시티센터 비즈니스 호텔',
          image: require('@/assets/hotel_img/hotel4.jpg'),
          imageCount: 8,
          price: '₩95,000',
          location: 'Şişli, Büyükdere Cd. No:145, Istanbul 34394',
          stars: '★★★★☆',
          type: '4 Star Hotel',
          amenities: '12+ Amenities',
          rating: '3.8',
          ratingText: 'Good 423 reviews',
          wishlisted: false
        },
        {
          id: 8,
          name: '부티크 가든 호텔',
          image: require('@/assets/hotel_img/hotel4.jpg'),
          imageCount: 11,
          price: '₩180,000',
          location: 'Beşiktaş, Çırağan Cd. No:32, Istanbul 34349',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenities: '18+ Amenities',
          rating: '4.3',
          ratingText: 'Very Good 198 reviews',
          wishlisted: false
        },
        {
          id: 9,
          name: '럭셔리 스파 리조트',
          image: require('@/assets/hotel_img/hotel4.jpg'),
          imageCount: 20,
          price: '₩450,000',
          location: 'Ortaköy, Mecidiye Köprüsü Sk. No:1, Istanbul 34347',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenities: '30+ Amenities',
          rating: '4.7',
          ratingText: 'Excellent 89 reviews',
          wishlisted: false
        }
      ]
    }
  },
  mounted() {
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
    switchTab(tabName) {
      this.activeTab = tabName
    },
    toggleShowMore() {
      this.showingAll = !this.showingAll
      
      if (!this.showingAll) {
        // Scroll to results section when showing less
        this.$nextTick(() => {
          const resultsSection = document.querySelector('.results-section')
          if (resultsSection) {
            resultsSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        })
      }
    },
    toggleWishlist(hotel) {
      hotel.wishlisted = !hotel.wishlisted
    },
    subscribe() {
      if (this.email) {
        console.log('Subscribed:', this.email)
        this.email = ''
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.hotel-favourites-container {
  font-family: 'Montserrat', sans-serif;
  background: #FAFBFC;
  min-width: 1440px;
  max-width: 1440px;
  min-height: 100vh;
  margin: 0 auto;
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  gap: 40px;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
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
  left: 60%;
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

/* Favourites Section */
.favourites-section {
  width: 1232px;
  height: auto;
  gap: 20px;
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
}

.favourites-title {
  width: 134px;
  height: 41px;
  angle: 0 deg;
  opacity: 1;
  font-family: Acme;
  font-weight: 400;
  font-size: 32px;
  line-height: 100%;
  color: #112211;
  margin-top: 50px;
}

/* Tabs */
.favourites-tabs {
  display: flex;
  width: 100%;
  height: 80px;
  margin-bottom: 40px;
}

.select-tab-btn {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  height: 80px;
  gap: 4px;
  padding: 16px 24px;
  background-color: white;
  border: 1px solid white;
  border-bottom: 2px solid white;
  cursor: pointer;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  color: rgba(17, 34, 17, 1);
}

.select-line {
  width: 1px;
  height: 48px;
  opacity: 1;
  border-width: 1px;
  border: 1px solid rgba(215, 226, 238, 1);
  margin-top: 15px;
}

.select-tab-btn.active {
  border-bottom: 2px solid rgba(141, 211, 187, 1);
}

.tab-count {
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  margin-top: 4px;
}

/* Tab Content */
.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: #666;
  font-family: Montserrat;
}

.results-section {
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
}

/* Hotel Cards */
.hotel-cards {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hotel-card {
  display: flex;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  height: 273.5px;
  border: 1px solid #f0f0f0;
  width: 100%;
}

.hotel-image-container {
  position: relative;
  width: 440px;
  flex-shrink: 0;
  overflow: hidden;
}

.hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-count {
  position: absolute;
  width: 77px;
  height: 32px;
  top: 10px;
  left: 330px;
  background: rgba(255, 255, 255, 0.5);
  color: black;
  padding: 4px 8px;
  border-radius: 8px;
  font-family: Montserrat;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  gap: 10px;
  display: flex;          
  align-items: center;   
  justify-content: center; 
}

.hotel-content {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  height: 273.5px;
  width: 792px;
}

.hotel-title {
  font-family: ABeeZee;
  font-weight: 400;
  font-style: Regular;
  font-size: 20px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  color: #112211;
  margin-top: 21px;
  margin-bottom: -50px;
}

.hotel-location {
  width: 500px;
  height: 15px;
  font-family: Montserrat;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  color: #666666;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.hotel-location img{
  width: 10px;
  height: 14px;
  top: 1px;
  left: 3px;
  angle: 0 deg;
  opacity: 1;
}

.hotel-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.stars {
  angle: 0 deg;
  opacity: 1;
  top: 1px;
  left: 0.5px;
  color: rgba(255, 134, 130, 1);
  font-size: 12px;
  letter-spacing: 1px;
}

.hotel-type {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 12px;
  color: #666666;
}

.amenities {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 12px;
  color: #666666;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.rating-score {
  width: 18px;
  height: 25px;
  font-family: Montserrat;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  color: #112211;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #7bc4a8;
  min-width: 35px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-text {
  font-family: Montserrat;
  font-weight: 700;
  font-style: Bold;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;            
  color: #666666;
}

.bottom-section {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.price-info {
  text-align: right;
  width: 157px;
  height: 66px;
  margin-bottom: -20px;
  margin-top: 20px;
  position: relative;
  margin-left: 220px;
}

.price-label {
  position: absolute;
  right: -270px;
  width: 157px;
  height: 15px;
  font-family: Montserrat;
  font-weight: 500;
  font-style: Medium;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  font-size: 12px;
  color: #666666;
  margin-bottom: 10px;
}

.price-amount {
  position: absolute;
  width: 157px;
  height: 36px;
  left: 300px;
  font-size: Static/Headline Small/Size;
  font-weight: 500;
  font-style: Medium;
  leading-trim: NONE;
  line-height: Static/Headline Small/Line Height;
  letter-spacing: Static/Headline Small/Tracking;
  text-align: right;            
  color: #FF6B6B;
  margin-top: 12px;
}

.price-unit {
  height: 36px;
  left: 300px;
  font-family: Static/Headline Small/Font;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  leading-trim: NONE;
  line-height: Static/Headline Small/Line Height;
  letter-spacing: Static/Headline Small/Tracking;
  text-align: right;
  color: rgba(255, 134, 130, 1);
}

.price-tax {
  position: absolute;
  width: 157px;
  height: 15px;
  right: -320px;
  font-family: Montserrat;
  font-weight: 500;
  font-style: Medium;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  color: #666;
  margin-top: 36px;
}

.hotel-beeline{
  width: 700px;
  height: 0.5px;
  angle: 0 deg;
  opacity: 0.25;
  left: 20px;
  background: rgba(17, 34, 17, 1);
}

/* 버튼 컨테이너 */
.button-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.view-place-btn {
  width: 645px;
  height: 48px;
  padding: 8px 16px;
  background: #8DD3BB;
  border: none;
  border-radius: 4px;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  color: #112211;
  cursor: pointer;
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-place-btn:hover {
  background: #7bc4a8;
}

.wishlist-btn {
  width: 48px;
  height: 48px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: #666666;
}

.wishlist-btn:hover {
  background: #F9FAFB;
}

.hidden-hotels {
  display: none;
}

.show-all .hidden-hotels {
  display: flex;
}

.show-more-btn {
  width: 100%;
  padding: 16px;
  background: #112211;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 24px;
  margin-bottom: 200px;
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