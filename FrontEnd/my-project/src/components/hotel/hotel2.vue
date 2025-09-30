<template>
  <div style="text-align: left;">
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
        <a href="#" class="dropdown-item">
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

    <section class="search-bar">
      <div class="search-form2">
        <div class="form-field destination-field">
          <label>Enter Destination</label>
          <input type="text" placeholder="신라스테이 춘천, 서울" v-model="searchData.destination">
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
        <button class="search-btn" @click="search"><img src="/images/hotel_img/glass.jpg"/></button>
      </div>
    </section>

    <main class="main-content">
      <aside class="filters-section">
        <h2 class="filters-title">Filters</h2>
        
        <div class="filter-group">
          <div class="filter-header" @click="toggleFilter('price')">
            <h3>Price</h3>
            <span class="filter-toggle">
              <img :src="filters.price.collapsed ? '/images/hotel_img/down.jpg' :'/images/hotel_img/up.jpg'"/>
            </span>
          </div>
          <div class="filter-content" :class="{ collapsed: filters.price.collapsed }">
            <div class="price-slider-container">
              <div class="price-range-slider">
                <div class="price-range-track" :style="priceTrackStyle"></div>
                <input 
                  type="range" 
                  min="50" 
                  max="1200" 
                  v-model="priceRange.min" 
                  class="price-range-input"
                  @input="updatePriceSlider">
                <input 
                  type="range" 
                  min="50" 
                  max="1200" 
                  v-model="priceRange.max" 
                  class="price-range-input"
                  @input="updatePriceSlider">
              </div>
              <div class="price-values">
                <span>${{ priceRange.min }}</span>
                <span>${{ priceRange.max }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-header" @click="toggleFilter('rating')">
            <h3>Rating</h3>
            <span class="filter-toggle">
              <img :src="filters.rating.collapsed ? '/images/hotel_img/down.jpg' : '/images/hotel_img/up.jpg'"/>
            </span>
          </div>
          <div class="filter-content" :class="{ collapsed: filters.rating.collapsed }">
            <div class="rating-options">
              <button 
                v-for="rating in ratingOptions" 
                :key="rating"
                class="rating-btn" 
                :class="{ active: selectedRating === rating }"
                @click="selectRating(rating)">
                {{ rating }}+
              </button>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-header" @click="toggleFilter('freebies')">
            <h3>Freebies</h3>
            <span class="filter-toggle">
              <img :src="filters.freebies.collapsed ? '/images/hotel_img/down.jpg' : '/images/hotel_img/up.jpg'"/>
            </span>
          </div>
          <div class="filter-content" :class="{ collapsed: filters.freebies.collapsed }">
            <div class="checkbox-group">
              <div class="checkbox-item" v-for="freebie in freebies" :key="freebie.id">
                <input type="checkbox" :id="freebie.id" v-model="freebie.checked">
                <label :for="freebie.id">{{ freebie.label }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-header" @click="toggleFilter('amenities')">
            <h3>Amenities</h3>
            <span class="filter-toggle">
              <img :src="filters.amenities.collapsed ? '/images/hotel_img/down.jpg' : '/images/hotel_img/up.jpg'"/>
            </span>
          </div>
          <div class="filter-content" :class="{ collapsed: filters.amenities.collapsed }">
            <div class="checkbox-group">
              <div class="checkbox-item" v-for="amenity in amenities" :key="amenity.id">
                <input type="checkbox" :id="amenity.id" v-model="amenity.checked">
                <label :for="amenity.id">{{ amenity.label }}</label>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <div class="vertical-line"></div>
      
      <section class="results-section">
        <div class="tabs-container">
          <button 
            v-for="tab in tabs" 
            :key="tab.name"
            class="tab" 
            :class="{ active: activeTab === tab.name }"
            @click="setActiveTab(tab.name)">
            <span class="tab-title">{{ tab.title }}</span>
            <span class="tab-count">{{ tab.count }} places</span>
          </button>
        </div>

        <div class="results-header">
          <div class="results-count">Showing <span>{{ showingCount }}</span> of <span style="color: red;">257 places</span></div>
          <div class="sort-container">
            <span class="sort-label">Sort by</span>
            <div class="custom-select-wrapper">
              <select class="sort-select" v-model="sortBy">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
              <span class="select-arrow">∨</span>
            </div>
          </div>
        </div>

        <div class="hotel-cards" :class="{ 'show-all': showingAll }">
          <div v-for="(hotel, index) in hotels" :key="hotel.id" 
               class="hotel-card" 
               :class="{ 'hidden-hotels': index >= 3 }">
            <div class="hotel-image-container">
              <img :src="hotel.image" :alt="hotel.title" class="hotel-image">
              <div class="image-count">{{ hotel.imageCount }} images</div>
            </div>
            <div class="hotel-content">
              <div class="top-section">
                <h3 class="hotel-title">{{ hotel.title }}</h3>
                <div class="price-info">
                  <div class="price-label">starting from</div>
                  <div class="price-amount">{{ hotel.price }}<span class="price-unit">/night</span></div>
                  <div class="price-tax">excl. tax</div>
                </div>
              </div>
              <div class="hotel-location">
                <span><img src="/images/hotel_img/map.jpg"/></span>
                <span>{{ hotel.location }}</span>
              </div>
              <div class="hotel-meta">
                <span class="stars">{{ hotel.stars }}</span>
                <span class="hotel-type">{{ hotel.type }}</span>
                <span class="amenities">
                  <img src="/images/hotel_img/coffee.jpg"/> {{ hotel.amenitiesCount }}+ Amenities
                </span>
              </div>
              <div class="rating-section">
                <span class="rating-score">{{ hotel.rating }}</span>
                <span class="rating-text">{{ hotel.ratingText }} {{ hotel.reviewCount }} reviews</span>
              </div>
              <div class="hotel-beeline"></div>
              <div class="bottom-section">
                <div class="button-container">
                  <button 
                    class="wishlist-btn" 
                    @click="toggleWishlist(hotel.id)"
                    :style="{ color: hotel.wishlisted ? '#FF6B6B' : '#000000' }">
                    {{ hotel.wishlisted ? '♥' : '♡' }}
                  </button>
                  <button class="view-place-btn" @click="viewPlace(hotel)">View Place</button>
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
          <span><img src="/images/hotel_img/facebook.jpg"></span>
          <span><img src="/images/hotel_img/twitter.jpg"></span>
          <span><img src="/images/hotel_img/youtube.jpg"></span>
          <span><img src="/images/hotel_img/instagram.jpg"></span>
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
import { authUtils } from '@/utils/commonAxios'

export default {
  name: 'HotelTwo',
  data() {
    return {
      isDropdownActive: false,
      showingAll: false,
      searchData: {
        destination: '',
        checkIn: '2024-12-12',
        checkOut: '2024-12-14',
        guests: '1 room, 2 guests'
      },
      newsletter: {
        email: ''
      },
      filters: {
        price: { collapsed: false },
        rating: { collapsed: false },
        freebies: { collapsed: false },
        amenities: { collapsed: false }
      },
      priceRange: {
        min: 50,
        max: 1200
      },
      ratingOptions: [0, 1, 2, 3, 4],
      selectedRating: 4,
      freebies: [
        { id: 'free-breakfast', label: '조식포함', checked: false },
        { id: 'free-parking', label: '무료주차', checked: false },
        { id: 'wifi', label: 'WiFi', checked: false },
        { id: 'room-service', label: '룸서비스', checked: false },
        { id: 'spa', label: '무료취소', checked: false }
      ],
      amenities: [
        { id: 'fitness', label: '24시 프론트데스크', checked: false },
        { id: 'pool', label: '야외수영장', checked: false },
        { id: 'business', label: '피트니스', checked: false },
        { id: 'pets', label: '수영장', checked: false }
      ],
      tabs: [
        { name: 'hotels', title: 'Hotels', count: 257 },
        { name: 'motels', title: 'Motels', count: 51 },
        { name: 'resorts', title: 'Resorts', count: 72 }
      ],
      activeTab: 'hotels',
      sortBy: 'Recommended',
      hotels: [
        {
          id: 1,
          title: '해튼호텔',
          image: '/images/hotel_img/hotel1.jpg',
          imageCount: 9,
          price: '₩240,000',
          location: 'Gümüşsuyu Mah. İnönü Cad. No:8, Istanbul 34437',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 20,
          rating: '4.2',
          ratingText: 'Very Good',
          reviewCount: 371,
          wishlisted: false
        },
        {
          id: 2,
          title: '마제스틱 말라카 호텔',
          image: '/images/hotel_img/hotel2.jpg',
          imageCount: 9,
          price: '₩120,000',
          location: 'Kuçukayasofya No. 40 Sultanahmet, Istanbul 34022',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 20,
          rating: '4.2',
          ratingText: 'Very Good',
          reviewCount: 54,
          wishlisted: false
        },
        {
          id: 3,
          title: '카나휘 리모 호텔',
          image: '/images/hotel_img/hotel3.jpg',
          imageCount: 9,
          price: '₩130,000',
          location: 'Kuçukayasofya No. 40 Sultanahmet, Istanbul 34022',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 20,
          rating: '4.2',
          ratingText: 'Very Good',
          reviewCount: 54,
          wishlisted: false
        },
        {
          id: 4,
          title: '베이알 호텔',
          image: '/images/hotel_img/hotel4.jpg',
          imageCount: 9,
          price: '₩104,000',
          location: 'Kuçukayasofya No. 40 Sultanahmet, Istanbul 34022',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 20,
          rating: '4.2',
          ratingText: 'Very Good',
          reviewCount: 54,
          wishlisted: false
        },
        {
          id: 5,
          title: '그랜드 플라자 호텔',
          image: '/images/hotel_img/hotel5.jpg',
          imageCount: 12,
          price: '₩85,000',
          location: 'Beyoğlu, Galata Kulesi Sk. No:15, Istanbul 34421',
          stars: '★★★★☆',
          type: '4 Star Hotel',
          amenitiesCount: 15,
          rating: '4.0',
          ratingText: 'Good',
          reviewCount: 289,
          wishlisted: false
        },
        {
          id: 6,
          title: '오션뷰 리조트',
          image: '/images/hotel_img/hotel6.jpg',
          imageCount: 15,
          price: '₩320,000',
          location: 'Kadıköy, Bağdat Cd. No:234, Istanbul 34710',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 25,
          rating: '4.5',
          ratingText: 'Excellent',
          reviewCount: 156,
          wishlisted: false
        },
        {
          id: 7,
          title: '시티센터 비즈니스 호텔',
          image: '/images/hotel_img/hotel7.jpg',
          imageCount: 8,
          price: '₩95,000',
          location: 'Şişli, Büyükdere Cd. No:145, Istanbul 34394',
          stars: '★★★★☆',
          type: '4 Star Hotel',
          amenitiesCount: 12,
          rating: '3.8',
          ratingText: 'Good',
          reviewCount: 423,
          wishlisted: false
        },
        {
          id: 8,
          title: '부티크 가든 호텔',
          image: '/images/hotel_img/hotel8.jpg',
          imageCount: 11,
          price: '₩180,000',
          location: 'Beşiktaş, Çırağan Cd. No:32, Istanbul 34349',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 18,
          rating: '4.3',
          ratingText: 'Very Good',
          reviewCount: 198,
          wishlisted: false
        },
        {
          id: 9,
          title: '럭셔리 스파 리조트',
          image: '/images/hotel_img/hotel9.jpg',
          imageCount: 20,
          price: '₩450,000',
          location: 'Ortaköy, Mecidiye Köprüsü Sk. No:1, Istanbul 34347',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 30,
          rating: '4.7',
          ratingText: 'Excellent',
          reviewCount: 89,
          wishlisted: false
        },
        {
          id: 10,
          title: '테스트',
          image: '/images/hotel_img/hotel10.jpg',
          imageCount: 20,
          price: '₩550,000',
          location: 'Ortaköy, Mecidiye Köprüsü Sk. No:1, Istanbul 34347',
          stars: '★★★★★',
          type: '5 Star Hotel',
          amenitiesCount: 30,
          rating: '4.7',
          ratingText: 'Excellent',
          reviewCount: 89,
          wishlisted: false
        }
      ],
      // 사용자 정보
      userInfo: null,
      isLoggedIn: false
    }
  },
  computed: {
    showingCount() {
      return this.showingAll ? this.hotels.length : Math.min(3, this.hotels.length);
    },
    priceTrackStyle() {
      const minPercent = ((this.priceRange.min - 50) / (1200 - 50)) * 100;
      const maxPercent = ((this.priceRange.max - 50) / (1200 - 50)) * 100;
      return {
        left: minPercent + '%',
        width: (maxPercent - minPercent) + '%'
      };
    },
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
    toggleFilter(filterName) {
      this.filters[filterName].collapsed = !this.filters[filterName].collapsed;
    },
    selectRating(rating) {
      this.selectedRating = rating;
    },
    setActiveTab(tabName) {
      this.activeTab = tabName;
    },
    toggleWishlist(hotelId) {
      const hotel = this.hotels.find(h => h.id === hotelId);
      if (hotel) {
        hotel.wishlisted = !hotel.wishlisted;
      }
    },
    viewPlace(hotel) {
      console.log('View place:', hotel.title);
      // 호텔 상세 페이지로 이동하는 로직
    },
    toggleShowMore() {
      this.showingAll = !this.showingAll;
      if (!this.showingAll) {
        // Scroll back to top of results
        this.$nextTick(() => {
          const resultsSection = document.querySelector('.results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      }
    },
    updatePriceSlider() {
      // Ensure min is not greater than max
      if (parseInt(this.priceRange.min) > parseInt(this.priceRange.max) - 10) {
        this.priceRange.min = parseInt(this.priceRange.max) - 10;
      }
      if (parseInt(this.priceRange.max) < parseInt(this.priceRange.min) + 10) {
        this.priceRange.max = parseInt(this.priceRange.min) + 10;
      }
    },
    search() {
      console.log('Search:', this.searchData);
      // 검색 로직
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
          // 사용자 정보 로드
    loadUserInfo() {
      this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
      
      if (this.isLoggedIn) {
        this.userInfo = authUtils.getUserInfo();
        console.log('사용자 정보:', this.userInfo);
      } else {
        this.userInfo = null;
      }
    },
    
    // 로그아웃 처리 (개선된 버전)
    async handleLogout() {
      if (confirm('로그아웃하시겠습니까?')) {
        try {
          // 서버 API 호출하여 토큰을 블랙리스트에 등록
          await authUtils.logout();
          
          // 사용자 정보 다시 로드
          this.loadUserInfo();
          
          alert('로그아웃되었습니다.');
          this.$router.push('/login');
        } catch (error) {
          console.error('로그아웃 중 오류:', error);
          
          // 서버 오류가 발생해도 로컬 정보는 삭제
          authUtils.logout();
          this.loadUserInfo();
          
          alert('로그아웃되었습니다.');
          this.$router.push('/login');
        }
      }
    },
    
    // 계정 페이지로 이동
    goToAccount() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelaccount');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    //찜목록 페이지로 이동
    goToFavourites() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelsix');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    //호텔 페이지로 이동
    goToHotel() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelone');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    }
  },


  

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo(); // 컴포넌트 마운트 시 사용자 정보 로드
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
    // 라우터 변경 시에도 사용자 정보 다시 확인
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
        
        .vertical-line{
            width: 0.5px;
            height: 1420px;
            top: 287px;
            left: 471px;
            opacity: 0.25;
            background: rgba(17, 34, 17, 1);

        }

        /* Search Bar */
        .search-bar {
            width: 1232px;
            height: 120px;
            top: 135px;
            left: 104px;
            border-radius: 16px;
            padding: 32px 24px;
            gap: 32px;
            margin: 120px auto 0 auto;
            background: #FFFFFF;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .search-form2 {
            display: flex;
            gap: 16px;
            align-items: center;
            max-width: 1232px;
            margin: 0 auto;
            margin-top: 0px;
            width: 100%;
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
            width: 344px;
        }

        .date-field {
            width: 240px;
        }

        .guests-field {
            width: 240px;
        }

        .search-btn {
            padding: 16px 24px;
            background: #8DD3BB;
            border: none;
            border-radius: 4px;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 14px;
            color: #112211;
            cursor: pointer;
            height: 56px;
            width: 56px;
            display: flex;
            align-items: center; 
            justify-content: center;
        }

        /* Main Content */
        .main-content {
            display: flex;
            gap: 40px;
            padding: 24px 104px 60px;
            max-width: 1440px;
            margin: 0 auto;
            flex: 1;
        }

        /* Filters Section */
        .filters-section {
            width: 343px;
            padding: 24px;
            height: fit-content;
        }

        .filters-title {
            font-family: Montserrat;
            font-weight: 600;
            font-size: 20px;
            line-height: 100%;
            color: #112211;
            margin-bottom: 24px;
        }

        .filter-group {
            border-bottom: 1px solid rgba(17, 34, 17, 0.1);
            padding-bottom: 24px;
            margin-bottom: 24px;
        }

        .filter-group:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .filter-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            margin-bottom: 16px;
        }

        .filter-header h3 {
            font-family: Montserrat;
            font-weight: 600;
            font-size: 16px;
            line-height: 100%;
            color: #112211;
        }

        .filter-toggle {
            font-size: 12px;
            color: #112211;
        }

        .filter-content {
            display: block;
        }

        .filter-content.collapsed {
            display: none;
        }

        /* Price Slider */
        .price-slider-container {
            margin: 16px 0;
            padding: 0 8px;
        }

        .price-range-slider {
            position: relative;
            height: 2px;
            background: #e0e0e0;
            border-radius: 3px;
            margin: 20px 0;
        }

        .price-range-track {
            position: absolute;
            height: 2px;
            background: rgba(17, 34, 17, 1);
            border-radius: 3px;
            left: 20%;
            width: 60%;
        }

        .price-range-input {
            position: absolute;
            top: -8px;
            width: 100%;
            height: 20px;
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            pointer-events: none;
        }

        .price-range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #8DD3BB;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            pointer-events: all;
            position: relative;
        }

        .price-range-input::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #8DD3BB;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            pointer-events: all;
        }

        .price-values {
            display: flex;
            justify-content: space-between;
            font-family: Montserrat;
            font-weight: 500;
            font-size: 14px;
            color: #112211;
            margin-top: 8px;
        }

        /* Rating Options */
        .rating-options {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .rating-btn {
            padding: 4px 10px;              /* 작은 버튼 사이즈 */
            border: 1px solid #e0e0e0;     
            border-radius: 3px;
            background: #FFFFFF;
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;               /* Medium */
            font-size: 12px;                /* Figma 기준 */
            line-height: 1;                 /* 100% */
            letter-spacing: 0;
            color: #112211;
            cursor: pointer;
            transition: all 0.2s ease;

            display: inline-flex;           /* 글자 수직정렬 */
            align-items: center;
            justify-content: center;
        }

        .rating-btn:hover {
            border-color: #8DD3BB;
        }

        .rating-btn.active {
            background: #8DD3BB;
            border-color: #8DD3BB;
            color: #112211;
        }

        /* Checkbox Groups */
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .checkbox-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            border: 1px solid #E0E0E0;
            border-radius: 3px;
        }

        .checkbox-item label {
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            color: #112211;
            cursor: pointer;
        }

        /* Results Section */
        .results-section {
            flex: 1;
        }

        /* Tabs */
        .tabs-container {
            background: #FFFFFF;
            border-radius: 12px;
            padding: 4px;
            margin-bottom: 24px;
            display: flex;
            gap: 0;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
            position: relative;
            display: flex;           /* 추가 */
        }

        .tab {
            flex: 1;
            padding: 16px 24px;
            background: transparent;
            border: none;
            font-family: Montserrat;
            font-weight: 500;
            font-size: 16px;
            color: #666666;
            cursor: pointer;
            border-radius: 8px;
            text-align: center;
            position: relative;
            transition: all 0.3s ease;
            
        }

        .tab:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 40px;
            width: 1px;
            background: #E0E0E0;
        }

        .tab.active {
            color: #112211;
            position: relative;
         
        }

        .tab.active::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 248px;
            height: 0px;
            border-width: 4px;
            border: 2px solid rgba(141, 211, 187, 1);
        }

        .tab-title {
            display: block;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .tab-count {
            font-size: 12px;
            opacity: 0.7;
            font-weight: 400;
        }

        /* 정렬 순서 */
        .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .results-count {
            font-family: Montserrat;
            font-weight: 400;
            font-size: 16px;
            color: #112211;
        }

        .sort-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sort-label {
            font-family: Montserrat;
            font-weight: 500;
            font-size: 14px;
            color: #112211;
            padding-right: -70px;
        }

        .sort-select {
            appearance: none;
            padding: 8px 3px;
            border: none;
            font-family: Montserrat;
            font-weight: 700;
            font-size: 14px;
            background: transparent;
            cursor: pointer;
            padding-right: 30px; 
        }
        .custom-select-wrapper { 
            position: relative;
            display: inline-block;
        }       
        .select-arrow { 
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            pointer-events: none;
            font-size: 14px;
            color: #112211;
        
        }

        /* 호텔 카드 */
        
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
         .hotel-cards {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 20px;
        }
        .hotel-card {
            display: flex;
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            height: 272.5px;
            border: 1px solid #f0f0f0;
            width: 840px;
        }

        .hotel-image-container {
            position: relative;
            width: 300px;
            height: 272.5px;
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
            width: 75px;
            height: 32px;
            top: 10px;
            left: 220px;
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
            height: 272.5px;
        }

        .hotel-title {
            font-family: ABeeZee;
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
            width: 492px;
            height: 0.5px;
            angle: 0 deg;
            opacity: 0.25;
            background: rgba(17, 34, 17, 1);

        }

        /* 버튼 컨테이너 추가 */
        .button-container {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .view-place-btn {
            width: 428px;
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

        .hidden-hotels {
            display: none;
        }

        .show-all .hidden-hotels {
            display: flex;
        }
</style>