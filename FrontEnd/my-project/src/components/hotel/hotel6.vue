<template>
  <div class="hotel-favourites-container">
    <!-- Header -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item">
            <span>
              <img src="/images/hotel_img/airplane.png" alt="airplane"/>
              Find Flight
            </span>
          </a>
          <a href="#" class="nav-item" >
            <span>
              <img src="/images/hotel_img/hotel.jpg" alt="hotel">
              Find Stays
            </span>
          </a>
        </div>

        <div class="nav-center">
          <a href="#" class="nav-item" @click="goToHotel">
            <img src="/images/hotel_img/Logo.png" alt="logo"/>
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

    <!-- User Dropdown -->
    <div class="user-dropdown" :class="{ active: isDropdownActive }" ref="userDropdown">
      <!-- 로그인된 경우 -->
      <template v-if="isLoggedIn">
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
      </template>

      <!-- 로그인되지 않은 경우 -->
      <template v-else>
        <div class="dropdown-header">
          <div class="dropdown-avatar"></div>
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


    <!-- Favourites Section -->
    <section class="favourites-section">
      <div class="favourites-title">Favourites</div>
      
      <!-- ✅ 수정: Tabs - 동적 개수 표시 -->
      <div class="favourites-tabs">
        <div class="select-tab-btn" :class="{ active: activeTab === 'flights' }" @click="switchTab('flights')">
          Reservations
          <span class="tab-count">0 marked</span>
        </div>

        <div class="select-line"></div>

        <div class="select-tab-btn" :class="{ active: activeTab === 'places' }" @click="switchTab('places')">
          Places
          <span class="tab-count">{{ totalCount }} marked</span>
        </div>
      </div>

      <!-- 예약 목록 -->
      <div class="tab-content" :class="{ active: activeTab === 'flights' }">
        <main class="main-content">
          <section class="results-section">
            <!-- 로딩 중 -->
            <div v-if="isLoadingReservations" class="loading-state">
              <p>로딩 중...</p>
            </div>

            <!-- 예약이 없을 때 -->
            <div v-else-if="reservations.length === 0" class="empty-state">
              <h3>예약 내역이 없습니다</h3>
              <p>호텔을 검색하고 예약해보세요!</p>
            </div>

            <!-- 예약 목록 -->
            <div v-else class="hotel-cards">
              <div v-for="reservation in reservations" :key="reservation.reservationId" 
                class="hotel-card">
                <div class="hotel-image-container">
                  <img :src="getImageUrl(reservation.hotelImage)" :alt="reservation.hotelName" class="hotel-image">
                  <div class="reservation-status" :class="{ paid: reservation.reservationsStatus }">
                    {{ reservation.reservationsStatus ? '결제완료' : '미결제' }}
                  </div>
                </div>
                <div class="hotel-content">
                  <h3 class="hotel-title">{{reservation.hotelName}} - {{ reservation.roomName }}</h3>
                  <div class="price-info">
                    <div class="price-label-total">Total Price</div>
                    <div class="price-amount">{{ formatPrice(reservation.basePayment) }}</div>
                  </div>
                  <div class="hotel-location">
                    <span><img src="/images/hotel_img/map.jpg" alt="map"/></span>
                    <span>{{ reservation.hotelAddress }}</span>
                  </div>
                  <div class="hotel-meta">
                    <span class="stars">{{ generateStars(reservation.hotelStar) }}</span>
                    <span class="hotel-type">{{ convertHotelType(reservation.hotelType) }}</span>
                    <span class="date-range">
                      {{ formatReservationDate(reservation.checkInDate) }} - {{ formatReservationDate(reservation.checkOutDate) }}
                    </span>
                  </div>
                  <div class="rating-section">
                    <span class="rating-score">{{ reservation.hotelRating ? reservation.hotelRating.toFixed(1) : '0.0' }}</span>
                    <span class="rating-text">{{ getRatingText(reservation.hotelRating) }} {{ reservation.reviewCount }} reviews</span>
                  </div>
                  <div class="hotel-beeline"></div>
                  <div class="bottom-section">
                    <div class="button-container">
                      <button 
                        v-if="!reservation.reservationsStatus"
                        class="view-place-btn payment-btn" 
                        @click="goToPayment(reservation)">
                        결제하기
                      </button>
                      <button 
                        v-else
                        class="view-place-btn completed-btn" 
                        disabled>
                        결제완료
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <!-- Places Content -->
      <div class="tab-content" :class="{ active: activeTab === 'places' }">
        <main class="main-content">
          <section class="results-section">
            <!-- 로딩 중 -->
            <div v-if="isLoading" class="loading-state">
              <p>로딩 중...</p>
            </div>

            <!-- 찜한 호텔이 없을 때 -->
            <div v-else-if="hotels.length === 0" class="empty-state">
              <h3>찜한 호텔이 없습니다</h3>
              <p>마음에 드는 호텔을 찜해보세요!</p>
            </div>

            <!-- 찜한 호텔 목록 -->
            <div v-else class="hotel-cards">
              <div v-for="hotel in hotels" :key="hotel.id" 
                class="hotel-card">
                <div class="hotel-image-container">
                  <img :src="getImageUrl(hotel.image)" :alt="hotel.title" class="hotel-image">
                  <div class="image-count">{{ hotel.imageCount }} images</div>
                </div>
                <div class="hotel-content">
                  <h3 class="hotel-title">{{ hotel.title }}</h3>
                  <div class="price-info">
                    <div class="price-label">starting from</div>
                    <div class="price-amount">{{ formatPrice(hotel.price) }}<span class="price-unit">/night</span></div>
                    <div class="price-tax">excl. tax</div>
                  </div>
                  <div class="hotel-location">
                    <span><img src="/images/hotel_img/map.jpg" alt="map"/></span>
                    <span>{{ hotel.location }}</span>
                  </div>
                  <div class="hotel-meta">
                    <span class="stars">{{ generateStars(hotel.stars) }}</span>
                    <span class="hotel-type">{{ hotel.type }}</span>
                    <span class="amenities">
                      <img src="/images/hotel_img/coffee.jpg" alt="coffee"/> {{ hotel.amenitiesCount }}+ Amenities
                    </span>
                  </div>
                  <div class="rating-section">
                    <span class="rating-score">{{ hotel.rating ? hotel.rating.toFixed(1) : '0.0' }}</span>
                    <span class="rating-text">{{ hotel.ratingText }} {{ hotel.reviewCount }} reviews</span>
                  </div>
                  <div class="hotel-beeline"></div>
                  <div class="bottom-section">
                    <div class="button-container">
                      <button 
                        class="wishlist-btn" 
                        @click="toggleWishlist(hotel)"
                        :style="{ color: hotel.wishlisted ? '#FF6B6B' : '#666666' }">
                        {{ hotel.wishlisted ? '♥' : '♡' }}
                      </button>
                      <button class="view-place-btn" @click="viewPlace(hotel)">View Place</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            <!-- ✅ 수정: Show More / Show Less 버튼 -->
            <button v-if="hasMoreHotels" class="show-more-btn" @click="loadMoreHotels"
              :disabled="isLoading">
              {{ isLoading ? 'Loading...' : `Show more results (${hotels.length}/${totalCount})` }}
            </button>

            <button v-else-if="hotels.length > pageSize" class="show-more-btn" @click="showLess">
              Show less results
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
import { authUtils, hotelAPI, adminAPI, memberCouponAPI, reservationAPI } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'

export default {
  name: 'HotelSix',
  data() {
    return {
      isDropdownActive: false,
      activeTab: 'places',
      showingAll: false,
      email: '',
      isLoading: false,
      hotels: [],
      
      // 예약 관련
      isLoadingReservations: false,
      reservations: [],
      reservationsCount: 0,
      
      // 사용자 정보
      userInfo: null,
      isLoggedIn: false,

      showCouponModal: false,
      receivedCoupons: [],

      // 페이지네이션
      currentOffset: 0,
      pageSize: 3,
      totalCount: 0
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();
    
    if (this.isLoggedIn) {
      await this.loadWishlistHotels();
      await this.loadReservations();
    }
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
    hasMoreHotels() {
      return this.hotels.length < this.totalCount;
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
  
  methods: {
    goToLogin() {
      this.isDropdownActive = false;
      this.$router.push('/login');
    },

    /**
     * 예약 목록 로드
     */
    async loadReservations() {
      this.isLoadingReservations = true;
      
      try {
        const response = await reservationAPI.getMyReservations();
        
        if (response.code === 200) {
          this.reservations = response.data;
          this.reservationsCount = this.reservations.length;
        }
      } catch (error) {
        console.error('예약 목록 로드 중 오류:', error);
        alert('예약 목록을 불러올 수 없습니다.');
      } finally {
        this.isLoadingReservations = false;
      }
    },

    /**
     * 결제 화면으로 이동
     */
    goToPayment(reservation) {
      const nights = Math.ceil(
        (new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)) / (1000 * 60 * 60 * 24)
      );
      
      this.$router.push({
        path: '/hotelfour',
        query: {
          reservationId: reservation.reservationId,
          roomId: reservation.roomId,
          hotelId: reservation.hotelId,
          checkIn: reservation.checkInDate,
          checkOut: reservation.checkOutDate,
          nights: nights,
          totalPrice: reservation.basePayment,
          guests: reservation.guestsCount
        }
      });
    },

    /**
     * 날짜 포맷팅
     */
    formatReservationDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    },

    /**
     * 평점 텍스트 변환
     */
    getRatingText(rating) {
      if (!rating) return 'No Rating';
      if (rating >= 4.5) return 'Excellent';
      if (rating >= 4.0) return 'Very Good';
      if (rating >= 3.5) return 'Good';
      if (rating >= 3.0) return 'Fair';
      return 'No Rating';
    },

    /**
     * 처음 3개만 로드
     */
    async loadWishlistHotels() {
      this.isLoading = true;
      
      try {
        const params = {
          offset: 0,
          size: this.pageSize
        };
        
        const response = await hotelAPI.getWishlistHotels(params);
        
        if (response.code === 200) {
          const data = response.data;
          
          this.hotels = data.hotels.map(hotel => this.convertHotelData(hotel));
          this.totalCount = data.totalCount;
          this.currentOffset = this.pageSize;
          
        }
      } catch (error) {
        console.error('찜한 호텔 목록 로드 중 오류:', error);
        alert('찜한 호텔 목록을 불러올 수 없습니다.');
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * 더 많은 호텔 로드
     */
    async loadMoreHotels() {
      if (this.isLoading || !this.hasMoreHotels) return;
      
      this.isLoading = true;
      
      try {
        const params = {
          offset: this.currentOffset,
          size: this.pageSize
        };
        const response = await hotelAPI.getWishlistHotels(params);
        
        if (response.code === 200) {
          const data = response.data;
          
          const newHotels = data.hotels.map(hotel => this.convertHotelData(hotel));
          this.hotels.push(...newHotels);
          this.currentOffset += this.pageSize;
        }
      } catch (error) {
        console.error('추가 로드 중 오류:', error);
        alert('추가 로드 중 오류가 발생했습니다.');
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * Show less (처음으로 초기화)
     */
    async showLess() {
      this.isLoading = true;
      
      try {
        await this.loadWishlistHotels();
        
        this.$nextTick(() => {
          const resultsSection = document.querySelector('.results-section');
          if (resultsSection) {
            resultsSection.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      } catch (error) {
        console.error('Show less 중 오류:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    /**
     * CartDto를 화면용 HotelSummaryDto로 변환
     */
    convertHotelData(cart) {
      const hotel = cart.hotelDto;
      
      return {
        id: hotel.id,
        title: hotel.hotelName,
        image: this.getFirstImage(),
        imageCount: 0,
        price: this.getMinPrice(),
        location: hotel.cityId,
        stars: hotel.hotelStar,
        type: this.convertHotelType(hotel.hotelType),
        hotelType: hotel.hotelType,
        amenitiesCount: 0,
        rating: hotel.hotelRating,
        ratingText: this.getRatingText(hotel.hotelRating),
        reviewCount: 0,
        wishlisted: true,
        cityName: hotel.cityId
      };
    },
    
    convertHotelType(type) {
      const typeMap = {
        'hotel': 'Hotel',
        'motel': 'Motel',
        'resort': 'Resort'
      };
      return typeMap[type] || type;
    },
    
    getFirstImage() {
      return '/images/hotel_img/hotel1.jpg';
    },
    
    getMinPrice() {
      return 100000;
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

    async toggleWishlist(hotel) {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
      
      try {
        await hotelAPI.toggleWishlist(hotel.id);
        
        this.hotels = this.hotels.filter(h => h.id !== hotel.id);
        this.totalCount -= 1;
        
        alert('찜 목록에서 제거되었습니다.');
      } catch (error) {
        console.error('찜하기 처리 중 오류:', error);
        alert('찜하기 처리 중 오류가 발생했습니다.');
      }
    },
    
    viewPlace(hotel) {
      this.$router.push({
        path: '/hotelthree',
        query: { hotelId: hotel.id }
      });
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/hotel1.jpg';
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('/images/')) return imagePath;
      return adminAPI.getImageUrl(imagePath);
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
    
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    handleClickOutside(event) {
      if (!this.$refs.userDropdown.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    },
    
    switchTab(tabName) {
      this.activeTab = tabName;
      
      if (tabName === 'flights' && this.reservations.length === 0) {
        this.loadReservations();
      } else if (tabName === 'places' && this.hotels.length === 0) {
        this.loadWishlistHotels();
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
    margin-left: 260px;
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
  .price-label-total{
    position: absolute;
    right: -300px;
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
    width: 744px;
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
    width: 790px;
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
    margin-top: 200px;
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
    width: 1232px;
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
  /* 로딩 상태 */
  .loading-state {
    text-align: center;
    padding: 60px 0;
    color: #666;
    font-family: Montserrat;
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
  /* 예약 상태 표시 */
  .reservation-status {
    position: absolute;
    width: 77px;
    height: 32px;
    top: 10px;
    left: 10px;
    background: rgba(255, 107, 107, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 8px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 12px;
    line-height: 100%;
    display: flex;          
    align-items: center;   
    justify-content: center;
    z-index: 10;
  }

  .reservation-status.paid {
    background: rgba(141, 211, 187, 0.9);
    color: #112211;
  }

  /* 결제 버튼 스타일 */
  .payment-btn {
    background: #FF6B6B !important;
    color: white !important;
  }

  .payment-btn:hover {
    background: #ff5252 !important;
  }

  .completed-btn {
    background: #8DD3BB !important;
    cursor: not-allowed !important;
    opacity: 0.7;
    color: #112211 !important;
  }

  .completed-btn:hover {
    background: #8DD3BB !important;
  }

  /* 날짜 범위 표시 */
  .date-range {
    font-family: Montserrat;
    font-weight: 500;
    font-size: 12px;
    color: #666666;
    margin-left: 8px;
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