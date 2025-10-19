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
          <label>Guests</label>
          <select v-model="searchData.guests">
            <option :value="1">1 guests</option>
            <option :value="2">2 guests</option>
            <option :value="3">3 guests</option>
            <option :value="4">4 guests</option>
            <option :value="5">5 guests</option>
            <option :value="6">6 guests</option>
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
        :min="priceRange.dynamicMin" 
        :max="priceRange.dynamicMax" 
        step="50"
        v-model.number="priceRange.min" 
        class="price-range-input"
        @input="updatePriceSlider">
      <input 
        type="range" 
        :min="priceRange.dynamicMin" 
        :max="priceRange.dynamicMax" 
        step="50"
        v-model.number="priceRange.max" 
        class="price-range-input"
        @input="updatePriceSlider">
    </div>
    <div class="price-values">
      <span>₩{{ formatPriceDisplay(priceRange.min) }}</span>
      <span>₩{{ formatPriceDisplay(priceRange.max) }}</span>
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
                <input type="checkbox" :id="'freebie-' + freebie.id" v-model="freebie.checked">
                <label :for="'freebie-' + freebie.id">{{ freebie.label }}</label>
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
                <input type="checkbox" :id="'amenity-' + amenity.id" v-model="amenity.checked">
                <label :for="'amenity-' + amenity.id">{{ amenity.label }}</label>
              </div>
            </div>
          </div>
        </div>
        <button class="reset-filters-btn" @click="resetFilters">
          Reset All Filters
        </button>
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
          <div class="results-count">Showing <span>{{ showingCount }}</span> of <span style="color: red;">{{ totalCount }} places</span></div>
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
          <div v-for="hotel in hotels" :key="hotel.id" 
               class="hotel-card"
               :class="{ 'sold-out': !hotel.available }">
            <div class="hotel-image-container">
              <img :src="hotel.image" :alt="hotel.title" class="hotel-image">
              <div class="image-count">{{ hotel.imageCount }} images</div>
              <div v-if="!hotel.available" class="sold-out-badge">예약 마감</div> 
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
                <span class="hotel-type">
                  <template v-if="hotel.hotelType === 'hotel'">Hotel</template>
                  <template v-else-if="hotel.hotelType === 'motel'">Motel</template>
                  <template v-else-if="hotel.hotelType === 'resort'">Resort</template>
                </span>
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
                  <button 
                    class="view-place-btn"
                    :class="{ 'sold-out-btn': !hotel.available }"  
                    @click="viewPlace(hotel)">
                    {{ hotel.available ? 'View Place' : '예약 마감' }}  
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      <button v-if="hasMoreHotels" class="show-more-btn" @click="loadMoreHotels"
        :disabled="isLoading">
        {{ isLoading ? 'Loading...' : `Show more results (${hotels.length}/${totalCount})` }}
      </button>

      <button v-else-if="hotels.length > pageSize" class="show-more-btn" @click="search">
        Show less results
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
import { authUtils, hotelAPI, adminAPI } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'
export default {
  name: 'HotelTwo',
  data() {
    return {
      isDropdownActive: false,
      showingAll: false,
      searchData: {
        destination: '',
        checkIn: '',
        checkOut: '',
        guests: 2  // 기본값 2명
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
      selectedRating: 0,
      freebies: [],
      amenities: [],
      tabs: [
        { name: 'hotels', title: 'Hotels', count: 0 },
        { name: 'motels', title: 'Motels', count: 0 },
        { name: 'resorts', title: 'Resorts', count: 0 }
      ],

      hotels: [],
      activeTab: 'hotels',
      sortBy: 'Recommended',

      totalCount: 0,
      isLoading: false,
      availableCount: 0,    // 예약 가능한 호텔만 (showing-count용)
      currentOffset: 0,   
      pageSize: 3,
      
      // 사용자 정보
      userInfo: null,
      isLoggedIn: false,
      debouncedSearch: null
    }
  },
  
  computed: {
    showingCount() {
      return this.availableCount;
    },

     hasMoreHotels() {
        return this.hotels.length < this.totalCount;
    },

    priceTrackStyle() {
      const range = this.priceRange.dynamicMax - this.priceRange.dynamicMin;
      const minPercent = ((this.priceRange.min - this.priceRange.dynamicMin) / range) * 100;
      const maxPercent = ((this.priceRange.max - this.priceRange.dynamicMin) / range) * 100;
      return {
      left: minPercent + '%',
      width: (maxPercent - minPercent) + '%'
  };
},

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

  created() {
    this.debouncedSearch = this.debounce(this.search, 500);
  },
  
  methods: {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    toggleFilter(filterName) {
      this.filters[filterName].collapsed = !this.filters[filterName].collapsed;
    },
    
    updatePriceSlider() {
      if (parseInt(this.priceRange.min) > parseInt(this.priceRange.max) - 10) {
        this.priceRange.min = parseInt(this.priceRange.max) - 10;
      }
      if (parseInt(this.priceRange.max) < parseInt(this.priceRange.min) + 10) {
        this.priceRange.max = parseInt(this.priceRange.min) + 10;
      }
    },
    
    viewPlace(hotel) {
      console.log('View place:', hotel.title);
      this.$router.push({
        path: '/hotelthree',
        query: { 
          hotelId: hotel.id,
          checkIn: this.searchData.checkIn,
          checkOut: this.searchData.checkOut,
          guests: this.searchData.guests,
          available: hotel.available
        }
      });
    },

    convertHotelType(tabName) {
      const typeMap = {
        'hotels': 'hotel',
        'motels': 'motel',
        'resorts': 'resort'
      };
      return typeMap[tabName] || null;
    },
    
    toggleShowMore() {
      this.showingAll = !this.showingAll;
      if (!this.showingAll) {
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
    
    // ===== 사용자 관련 =====
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
    
    goToFavourites() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelsix');
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
    
    goToHotel() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelone');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    
    updateTabCounts(hotelTypeCounts) {
      this.tabs.forEach(tab => {
        const type = this.convertHotelType(tab.name); 
        if (type && hotelTypeCounts[type] !== undefined) {
          tab.count = hotelTypeCounts[type];
        } else {
          tab.count = 0;
        }
      });
      console.log('업데이트된 탭:', this.tabs);
    },
    
    // ===== 날짜 관련 메서드 =====
    initializeDates() {
      if (!this.searchData.checkIn) {
        this.searchData.checkIn = this.getTodayDate();
      }
      if (!this.searchData.checkOut) {
        this.searchData.checkOut = this.getTomorrowDate();
      }
    },
    
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    getTomorrowDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const day = String(tomorrow.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    validateDates() {
      const today = this.getTodayDate();
      
      if (this.searchData.checkIn < today) {
        alert('체크인 날짜는 오늘 이후여야 합니다.');
        this.searchData.checkIn = this.getTodayDate();
        return false;
      }
      
      if (this.searchData.checkOut <= this.searchData.checkIn) {
        alert('체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.');
        this.searchData.checkOut = this.getTomorrowDate();
        return false;
      }
      
      return true;
    },
    
    calculateNights() {
      const checkIn = new Date(this.searchData.checkIn);
      const checkOut = new Date(this.searchData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    
    // ===== 필터 옵션 로드 =====
    async loadFilterOptions() {
  try {
    const response = await hotelAPI.getFilterOptions();
    
    if (response.code === 200) {
      const filters = response.data;
      
      this.freebies = filters.freebies.map(item => ({
        id: item.id,
        label: item.freebiesName,
        checked: false
      }));
      
      this.amenities = filters.amenities.map(item => ({
        id: item.id,
        label: item.amenitiesName,
        checked: false
      }));
      
      if (filters.priceRange) {
        // 최고가에 20% 여유 추가 (천원 단위)
        const maxPrice = Math.ceil(filters.priceRange.max * 1.2 / 1000);
        
        // 최소 2000까지는 보장 (너무 낮은 가격 방지)
        const finalMax = Math.max(maxPrice, 2000);
        
        this.priceRange = {
          min: 0,                    
          max: finalMax,
          dynamicMin: 0,             
          dynamicMax: finalMax
        };
        
        console.log('가격 범위 설정:', {
          min: 0,
          max: finalMax,
          original: filters.priceRange.max
        });
      }
    }
  } catch (error) {
    console.error('필터 옵션 로드 중 오류:', error);
  }
},
    
    // ===== 호텔 검색 =====
    async search() {
    if (this.isLoading) return;

      console.log('검색 시작...');
      
      if (!this.validateDates()) {
        return;
      }

      try {
        const params = {
          destination: this.searchData.destination || null,
          checkIn: this.searchData.checkIn || null,
          checkOut: this.searchData.checkOut || null,
          guests: this.searchData.guests,
          minPrice: this.priceRange.min * 1000,
          maxPrice: this.priceRange.max * 1000,
          rating: this.selectedRating,
          hotelType: this.convertHotelType(this.activeTab),
          freebies: this.getSelectedFreebies(),
          amenities: this.getSelectedAmenities(),
          sortBy: this.convertSortBy(this.sortBy),
          offset: 0,              
          size: this.pageSize     
        };

        console.log('검색 파라미터:', params);
      
        const response = await hotelAPI.searchHotels(params);

        if (response.code === 200) {
          const data = response.data;
          console.log('받은 데이터:', data);
        
          this.hotels = data.hotels.map(hotel => this.convertHotelData(hotel));
          this.totalCount = data.totalCount;              // 전체 (페이지네이션용)
          this.availableCount = data.availableCount;      // 예약 가능만 (표시용)
          this.currentOffset = this.hotels.length;

            // 검색 결과 기반으로 탭 카운트 업데이트 (예약 가능만)
        if (data.hotelTypeCounts) {
              console.log('호텔 타입 카운트:', data.hotelTypeCounts);
              this.updateTabCounts(data.hotelTypeCounts);
          }

          console.log('변환된 호텔 목록:', this.hotels);
          console.log('totalCount (전체):', this.totalCount);
          console.log('availableCount (예약 가능):', this.availableCount);
          console.log('currentOffset:', this.currentOffset);
          console.log('hasMoreHotels:', this.hasMoreHotels);
      }


      } catch (error) {
        console.error('검색 중 오류:', error);
        alert('검색 중 오류가 발생했습니다.');
      } finally {
        this.isLoading = false;
      }
    },

    async loadMoreHotels() {
        if (this.isLoading || !this.hasMoreHotels) return;

        this.isLoading = true;
    
        try {
            const params = {
                destination: this.searchData.destination || null,
                checkIn: this.searchData.checkIn || null,
                checkOut: this.searchData.checkOut || null,
                guests: this.searchData.guests,
                minPrice: this.priceRange.min * 1000,
                maxPrice: this.priceRange.max * 1000,
                rating: this.selectedRating,
                hotelType: this.convertHotelType(this.activeTab),
                freebies: this.getSelectedFreebies(),
                amenities: this.getSelectedAmenities(),
                sortBy: this.convertSortBy(this.sortBy),
                offset: this.currentOffset,
                size: this.pageSize
            };

            console.log('추가 로드 파라미터:', params);
          
            const response = await hotelAPI.searchHotels(params);
          
            if (response.code === 200) {
                const data = response.data;

                console.log('추가로 받은 호텔:', data.hotels.length);
            
                const newHotels = data.hotels.map(hotel => this.convertHotelData(hotel));
                this.hotels.push(...newHotels);

                // ✅ currentOffset 업데이트
                this.currentOffset = this.hotels.length;

                console.log('현재 총 호텔 수:', this.hotels.length);
                console.log('전체 호텔 수:', this.totalCount);
                console.log('다음 offset:', this.currentOffset);
            }
          
        } catch (error) {
            console.error('추가 로드 중 오류:', error);
            alert('추가 로드 중 오류가 발생했습니다.');
        } finally {
            this.isLoading = false;
        }
    },
    
    selectRating(rating) {
      this.selectedRating = rating;
      this.search();
    },
    
    setActiveTab(tabName) {
      this.activeTab = tabName;
      this.search();
    },
    
    // ===== 찜하기 =====
    async toggleWishlist(hotelId) {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
  
      const hotel = this.hotels.find(h => h.id === hotelId);
      if (hotel) {
        try {
          await hotelAPI.toggleWishlist(hotelId);
          hotel.wishlisted = !hotel.wishlisted;
        } catch (error) {
          console.error('찜하기 처리 중 오류:', error);
          alert('찜하기 처리 중 오류가 발생했습니다.');
        }
      }
    },
    
    // ===== 유틸리티 메서드 =====
    convertHotelData(hotel) {
      return {
        id: hotel.id,
        title: hotel.title,
        image: this.getImageUrl(hotel.image),
        imageCount: hotel.imageCount || 0,
        price: this.formatPrice(hotel.price),
        location: hotel.location || hotel.cityName,
        stars: this.generateStars(hotel.stars),
        type: hotel.type,
        hotelType: hotel.hotelType,
        amenitiesCount: hotel.amenitiesCount || 0,
        rating: hotel.rating ? hotel.rating.toFixed(1) : '0.0',
        ratingText: hotel.ratingText || 'No Rating',
        reviewCount: hotel.reviewCount || 0,
        wishlisted: hotel.wishlisted || false,
        cityName: hotel.cityName,
        available: hotel.available !== undefined ? hotel.available : true
      };
    },
    
    resetFilters() {
      this.$router.push('/hoteltwo').then(() => {
        window.location.reload();
      });
    },
    
    formatPrice(price) {
      if (!price) return '₩0';
      return '₩' + Math.floor(price).toLocaleString('ko-KR');
    },
    
    generateStars(starCount) {
      if (!starCount) return '';
      const fullStars = '★'.repeat(starCount);
      const emptyStars = '☆'.repeat(5 - starCount);
      return fullStars + emptyStars;
    },
    
    getSelectedFreebies() {
      return this.freebies
        .filter(f => f.checked)
        .map(f => f.id);
    },
    
    getSelectedAmenities() {
      return this.amenities
        .filter(a => a.checked)
        .map(a => a.id);
    },
    
    convertSortBy(sortBy) {
      const sortMap = {
        'Recommended': 'recommended',
        'Price: Low to High': 'price_asc',
        'Price: High to Low': 'price_desc',
        'Rating': 'rating'
      };
      return sortMap[sortBy] || 'recommended';
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/hotel1.jpg';
      if (imagePath.startsWith('/images/')) return imagePath;
      return adminAPI.getImageUrl(imagePath);
    },

    formatPriceDisplay(price) {
      if (price === 0) return '0';
      return (price * 1000).toLocaleString('ko-KR');
    },
  },

  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();
    
    // 날짜 초기화
    this.initializeDates();
    
    // URL 쿼리 파라미터 읽기
    if (this.$route.query.destination) {
      this.searchData.destination = this.$route.query.destination;
    }
    if (this.$route.query.checkIn) {
      this.searchData.checkIn = this.$route.query.checkIn;
    }
    if (this.$route.query.checkOut) {
      this.searchData.checkOut = this.$route.query.checkOut;
    }
    if (this.$route.query.guests) {
      this.searchData.guests = parseInt(this.$route.query.guests);
    }
    
    // 필터 옵션 로드 후 검색 실행
    await this.loadFilterOptions();
    this.search();
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  
  watch: {
    '$route'() {
      this.loadUserInfo();
    },
     'searchData.destination'() {
      this.debouncedSearch();
    },
    'searchData.checkIn'() {
      if (this.validateDates()) {
        this.debouncedSearch();
      }
    },
    'searchData.checkOut'() {
      if (this.validateDates()) {
        this.debouncedSearch();
      }
    },
    'searchData.guests'() {
      this.search();
    },
    
    // 가격 슬라이더 - debounce 적용
    'priceRange.min'() {
      this.debouncedSearch();
    },
    'priceRange.max'() {
      this.debouncedSearch();
    },
    
    // 정렬
    'sortBy'() {
      this.search();
    },
    
    // Freebies와 Amenities
    freebies: {
      handler() {
        this.search();
      },
      deep: true
    },
    amenities: {
      handler() {
        this.search();
      },
      deep: true
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
            min-width: 0.5px;
            flex-shrink: 0;
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
            gap: 32px;
            padding: 24px 104px 60px;
            max-width: 1440px;
            margin: 0 auto;
            flex: 1;
        }

        /* Filters Section */
        .filters-section {
            max-width: 343px;
            min-width: 343px;
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
            max-width: 840px;
            width: auto;
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

        /* 초기화 버튼 스타일 추가 */
        .reset-filters-btn {
          width: 100%;
          padding: 14px 20px;
          margin-top: 24px;
          background: #FFFFFF;
          border: 1.5px solid #8DD3BB;
          border-radius: 8px;
          font-family: Montserrat;
          font-weight: 600;
          font-size: 14px;
          color: #112211;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .reset-filters-btn:hover {
          background: #8DD3BB;
          transform: translateY(-2px);
          box-shadow: 0px 4px 12px rgba(141, 211, 187, 0.3);
        }

        .reset-filters-btn:active {
          transform: translateY(0);
          box-shadow: 0px 2px 6px rgba(141, 211, 187, 0.2);
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
            width: 72px;
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
                .image-count {
            position: absolute;
            width: 72px;
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

        .sold-out-badge {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #FF0000;
            color: #FFFFFF;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 700;
            font-size: 16px;
            z-index: 10;
            box-shadow: 0px 4px 12px rgba(255, 0, 0, 0.3);
        }
</style>