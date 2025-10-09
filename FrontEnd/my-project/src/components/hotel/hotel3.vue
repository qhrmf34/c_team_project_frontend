<template>
  <div>
    <!-- Header -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item" @click="goToHotel">
            <span><img src="/images/hotel_img/hotel.jpg"></span>
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

    <!-- User Dropdown -->
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

    <!-- Breadcrumb -->
    <div class="breadcrumb" v-if="hotel">
      <a href="#" @click.prevent="searchByCountry(hotel.countryName)" style="color: rgba(255, 134, 130, 1);">
        {{ hotel.countryName || 'Turkey' }}
      </a> > 
      <a href="#" @click.prevent="searchByCity(hotel.cityName)" style="color: rgba(255, 134, 130, 1);">
        {{ hotel.cityName || 'Istanbul' }}
      </a> > 
      <span>{{ hotel.hotelName }}</span>
    </div>

    <div class="main-content" v-if="hotel">
      <!-- Hotel Header -->
      <div class="hotel-header">
        <div class="hotel-info">
          <h1 class="hotel-title">
            {{ hotel.hotelName }}
            <span class="stars">{{ generateStars(hotel.starRating) }}</span>
            <span class="stars-hotel">{{ hotel.starRating }} Star Hotel</span>
          </h1>
          <div class="hotel-location-line">
            <span><img src="/images/hotel_img/map.jpg"></span>
            <span>{{ hotel.address }}</span>
          </div>
          <div class="hotel-meta-left">
            <div class="rating-info">
              <span class="rating-score">{{ hotel.averageRating ? hotel.averageRating.toFixed(1) : '0.0' }}</span>
              <span class="rating-text1">{{ getRatingText(hotel.averageRating) }} </span>
              <span class="rating-text2">{{ hotel.reviewCount }} reviews</span>
            </div>
          </div>
        </div>
    
        <div class="hotel-actions">
          <div class="hotel-price">
            <div class="price-amount">{{ formatPrice(hotel.minPrice) }}<span class="price-unit">/night</span></div>
          </div>
          <div class="hotel-buttons">
            <button class="action-btn" @click="toggleWishlist">
              <img src="/images/hotel_img/heart2.jpg"/>
            </button>
            <button class="action-btn"><img src="/images/hotel_img/share.jpg"></button>
            <button class="book-now-btn">Book now</button>
          </div>
        </div>
      </div>

      <!-- Image Gallery -->
      <div class="image-gallery">
        <div class="main-image">
          <img :src="hotel.images[0] || '/images/hotel_img/findhotel1.jpg'" :alt="hotel.hotelName">
        </div>
        <div class="sub-images">
          <div class="sub-row">
            <div class="gallery-item">
              <img :src="hotel.images[1] || '/images/hotel_img/findhotel2.jpg'" alt="호텔 객실">
            </div>
            <div class="gallery-item item3">
              <img :src="hotel.images[2] || '/images/hotel_img/findhotel3.jpg'" alt="호텔 로비">
            </div>
          </div>  
          <div class="sub-row">
            <div class="gallery-item">
              <img :src="hotel.images[3] || '/images/hotel_img/findhotel4.jpg'" alt="호텔 외관">
            </div>
            <div class="gallery-item item5">
              <img :src="hotel.images[4] || '/images/hotel_img/findhotel5.jpg'" alt="호텔 수영장">
              <button class="view-all-photos">View all photos</button>
            </div>
          </div>     
        </div>
      </div>

      <div class="content-layout">
        <div class="content-main">
          <!-- Overview Section -->
          <div class="overview-section">
            <h2 class="overview-title">Overview</h2>
            <p class="overview-text">{{ hotel.description }}</p>

            <div class="content-row">
              <div class="rating-box" @click="filterByCard(null)">
                <div class="rating-number">{{ hotel.averageRating ? hotel.averageRating.toFixed(1) : '0.0' }}</div>
                <div class="rating-label">전체</div>
                <div class="review-count">{{ hotel.reviewCount }} reviews</div>
              </div>
              <div class="rating-box" 
                   v-for="(count, card) in reviewCardStats" 
                   :key="card"
                   @click="filterByCard(card)">
                <div class="rating-number"><img src="/images/hotel_img/star.jpg"></div>
                <div class="rating-label">{{ getCardLabel(card) }}</div>
                <div class="review-count">{{ count }} reviews</div>
              </div>
            </div>
          </div>
          <div class="beeline"></div>
          
          <!-- Room List -->
          <div class="room-section">
            <h3 class="room-title">잔여 객실</h3>
            
            <div v-for="room in hotel.rooms" :key="room.id" class="room-item">
              <img :src="room.image || '/images/hotel_img/room-default.jpg'" :alt="room.roomName" class="room-image">
              <div class="room-info">
                <div class="room-details">{{ room.roomName }} · {{ room.bedType }}</div>
              </div>
              <div class="room-price-section">
                <div class="room-price">{{ formatPrice(room.basePrice) }}<span style="font-size: 14px; font-weight: 400;">/night</span></div>
                <button class="room-book-btn">Book now</button>
              </div>
            </div>
          </div>
          <div class="beeline"></div>
          
          <!-- Map Section -->
          <div class="map-section">
            <h3 class="map-title">지도보기</h3>
            <div id="googleMap" class="map-container"></div>
            <div class="map-actions">
              <div class="map-address">
                <img src="/images/hotel_img/map.jpg"/> {{ hotel.address }}
              </div>
              <button class="view-map-btn" @click="openGoogleMaps">View on google maps</button>
            </div>
          </div>
          <div class="beeline"></div>
          
          <!-- Amenities Section -->
          <div class="amenities-section">
            <h3 class="amenities-title">Amenities</h3>
            <div class="amenities-grid">
              <!-- 실제 편의시설 표시 -->
              <div class="amenity-item" v-for="(amenity, index) in displayedAmenities" :key="index">
                <span><img :src="getAmenityIcon(amenity.amenitiesName)"></span>
                <span class="amenity-text">{{ amenity.amenitiesName }}</span>
              </div>
    
              <!-- more/less 버튼 (편의시설이 3개보다 많을 때만 표시) -->
              <div class="amenity-item" v-if="hotel.amenities && hotel.amenities.length > 3">
                <span class="amenity-text plus" @click="toggleAmenities">
                  {{ amenitiesExpanded ? '− less' : `+ ${hotel.amenities.length - 3} more` }}
                </span>
              </div>
            </div>
          </div>

          <div class="beeline"></div>
          
          <!-- Reviews Section -->
          <div class="reviews-section">
            <div class="reviews-header single-row">
              <div class="reviews-info">
                <h3 class="reviews-title">Reviews</h3>
                <div class="reviews-summary">
                  <span class="review-score-big">{{ hotel.averageRating ? hotel.averageRating.toFixed(1) : '0.0' }}</span>
                  <div>
                    <div class="review-summary-text">{{ getRatingText(hotel.averageRating) }}</div>
                    <div class="review-summary-text2">{{ hotel.reviewCount }} verified reviews</div>
                  </div>
                </div>
              </div>
              <button class="review-btn" @click="showReviewForm">Give your review</button>
            </div>
          </div>
          
          <!-- Review Form Section -->
          <div class="review-form-section" :class="{ active: isReviewFormVisible }">
            <h3 class="review-form-title">리뷰 작성하기</h3>
            
            <div class="rating-input">
              <label for="star-rating">평점을 선택해주세요</label>
              <div class="star-rating" id="star-rating">
                <div>
                  <span v-for="n in 5" :key="n" class="star" :class="{ active: n <= selectedRating }" @click="setRating(n)">★</span>
                </div>
                <div>
                  <span class="star-choice-btn" 
                        v-for="card in reviewCardOptions" 
                        :key="card.value"
                        :class="{ active: selectedCard === card.value }"
                        @click="selectCard(card.value)">
                    {{ card.label }}
                  </span>
                </div>
              </div>
            </div>
            
            <textarea 
              id="reviewText"
              name="reviewText"
              class="review-textarea" 
              placeholder="이 호텔에 대한 솔직한 후기를 작성해주세요..."
              v-model="reviewText"
            ></textarea>
            
            <div class="review-form-buttons">
              <button class="cancel-btn" @click="hideReviewForm">취소</button>
              <button class="submit-review-btn" @click="submitReview">리뷰 등록</button>
            </div>
          </div>
          
          <div class="review-filters">
            <button v-for="filter in reviewFilters" :key="filter.key" class="filter-btn" :class="{ active: activeFilter === filter.key }" @click="filterReviews(filter.key)">{{ filter.label }}</button>
          </div>

          <div id="reviewsList">
            <div v-for="review in filteredReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="review-user-info">
                  <div class="reviewer-avatar"></div>
                  <div class="reviewer-info">
                    <div class="reviewer-name">{{ review.rating }}.0 {{ getRatingText(review.rating) }} | {{ review.memberName }}</div>
                    <div class="review-rating">{{ formatDate(review.createdAt) }}</div>
                  </div>
                </div>
                <button class="report-btn" @click="showReportModal(review.id)">신고</button>
              </div>
              <p class="review-text">{{ review.reviewContent }}</p>
            </div>
          </div>

          <div class="review-pagination">
            <button class="pagination-btn">‹</button>
            <span class="pagination-info">1 of {{ Math.ceil(hotel.reviewCount / 10) }}</span>
            <button class="pagination-btn">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Modal -->
    <div class="modal-overlay" :class="{ active: isReportModalVisible }" @click="hideReportModalOnOverlay">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">신고하기</h3>
        
        <div class="report-options">
          <div v-for="option in reportOptions" :key="option.value" class="report-option">
            <input type="radio" :id="option.value" name="reportReason" :value="option.value" v-model="selectedReportReason">
            <label :for="option.value">{{ option.label }}</label>
          </div>
        </div>
        
        <textarea 
          id="reportDescription"
          name="reportDescription"
          class="report-textarea" 
          placeholder="신고 사유를 자세히 설명해주세요..."
          v-model="reportDescription"
        ></textarea>
        
        <div class="modal-buttons">
          <button class="modal-cancel-btn" @click="hideReportModal">취소</button>
          <button class="modal-submit-btn" @click="submitReport">신고하기</button>
        </div>
      </div>
    </div>

    <!-- Newsletter & Footer -->
    <section class="newsletter-section"></section>
    <div class="newsletter-content">
      <div class="newsletter-left">
        <h2 class="newsletter-title">구독서비스<br>신청해보세요</h2>
        <div class="newsletter-info">
          <div class="newsletter-brand">The Travel</div>
          <p class="newsletter-desc">구독자로 여행 할인, 팁 및 비하인드 정보를 받아보세요</p>
        </div>
        <div class="newsletter-form">
          <input 
            type="email" 
            id="newsletterEmail"
            name="newsletterEmail"
            class="newsletter-input" 
            placeholder="Your email address" 
            v-model="newsletterEmail"
          >
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
import { authUtils, hotelAPI } from '@/utils/commonAxios'

export default {
  name: 'HotelThree',
  data() {
    return {
      isDropdownActive: false,
      selectedRating: 0,
      selectedCard: null,
      amenitiesExpanded: false,
      isReviewFormVisible: false,
      isReportModalVisible: false,
      reviewText: '',
      selectedReportReason: '',
      reportDescription: '',
      newsletterEmail: '',
      activeFilter: 'all',
      selectedReviewId: null,
      
      hotel: null,
      reviews: [],
      reviewCardStats: {},
      
      reviewCardOptions: [
        { value: 'NearPark', label: 'Near park' },
        { value: 'NearNightLife', label: 'Near nightlife' },
        { value: 'NearTheater', label: 'Near theater' },
        { value: 'CleanHotel', label: 'Clean Hotel' }
      ],
      
      reviewFilters: [
        { key: 'all', label: 'All reviews' },
        { key: 'highest', label: 'Highest rated' },
        { key: 'lowest', label: 'Lowest rated' }
      ],
      
      reportOptions: [
        { value: 'Spam', label: '스팸/광고' },
        { value: 'Inappropriate', label: '부적절한 내용' },
        { value: 'Fake', label: '허위 정보' },
        { value: 'Abusive', label: '욕설/비방' },
        { value: 'Other', label: '기타' }
      ],
      
      userInfo: null,
      isLoggedIn: false
    }
  },
  
  computed: {
    filteredReviews() {
      let result = [...this.reviews];
      
      if (this.activeFilter === 'highest') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (this.activeFilter === 'lowest') {
        result.sort((a, b) => a.rating - b.rating);
      }
      
      return result;
    },
    
    displayedAmenities() {
      if (!this.hotel || !this.hotel.amenities) return [];
  
      if (this.amenitiesExpanded) {
        return this.hotel.amenities;  // 전체 표시
      }
      return this.hotel.amenities.slice(0, 3);  // 처음 3개만
    },

    displayUserName() {
      if (this.isLoggedIn && this.userInfo) {
        const { provider, firstName, lastName, email } = this.userInfo;
        
        if (provider === 'kakao' || provider === 'google' || provider === 'naver') {
          return firstName || email?.split('@')[0] || 'Social User';
        }
        
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
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();
    
    const hotelId = this.$route.query.hotelId;
    if (hotelId) {
      await this.loadHotelDetail(hotelId);
      await this.loadReviews(hotelId);
      await this.loadReviewStats(hotelId);
    } else {
      alert('호텔 정보를 찾을 수 없습니다.');
      this.$router.push('/hoteltwo');
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
  
  methods: {
    // ===== 백엔드 API 호출 =====
    
    async loadHotelDetail(hotelId) {
  try {
    const response = await hotelAPI.getHotelDetail(hotelId);
    
    if (response.code === 200) {
      this.hotel = response.data;
      console.log('호텔 상세 정보:', this.hotel);
      
      // 각 객실의 이미지를 조회 (추가)
      if (this.hotel.rooms && this.hotel.rooms.length > 0) {
        await this.loadRoomImages();
      }
      
      this.$nextTick(() => {
        this.initializeMap();
      });
    }
  } catch (error) {
    console.error('호텔 정보 로드 중 오류:', error);
    alert('호텔 정보를 불러올 수 없습니다.');
  }
},

    // 객실 이미지 로드 메서드 추가
    async loadRoomImages() {
    for (let room of this.hotel.rooms) {
      try {
        const response = await hotelAPI.getRoomImages(room.id);
        if (response.code === 200 && response.data.length > 0) {
          const imagePath = response.data[0].roomImagePath;
          room.image = `http://localhost:8089/uploads${imagePath}`;
        }
        } catch (error) {
        console.error(`객실 ${room.id} 이미지 로드 실패:`, error);
        room.image = '/images/hotel_img/room-default.jpg';
        }
      }
    },

    // 이미지 URL 생성 메서드 추가
    getRoomImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/room-default.jpg';
      return `http://localhost:8089/uploads${imagePath}`;
    },
    
    async loadReviews(hotelId, sortBy = null, reviewCard = null) {
      try {
        const response = await hotelAPI.getHotelReviews(hotelId, sortBy, reviewCard);
        
        if (response.code === 200) {
          this.reviews = response.data;
          console.log('리뷰 목록:', this.reviews);
        }
      } catch (error) {
        console.error('리뷰 로드 중 오류:', error);
      }
    },
    
    async loadReviewStats(hotelId) {
      try {
        const response = await hotelAPI.getReviewStats(hotelId);
        
        if (response.code === 200) {
          this.reviewCardStats = response.data;
          console.log('리뷰 통계:', this.reviewCardStats);
        }
      } catch (error) {
        console.error('리뷰 통계 로드 중 오류:', error);
      }
    },
    
    async submitReview() {
      alert('예약 완료 후 리뷰를 작성할 수 있습니다.');
      return;
    },
    
    async submitReport() {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
      
      if (!this.selectedReportReason) {
        alert('신고 사유를 선택해주세요.');
        return;
      }

      const reportData = {
        reviewsId: this.selectedReviewId,
        reportType: this.selectedReportReason,
        reportContent: this.reportDescription
      };

      try {
        const response = await hotelAPI.reportReview(reportData);
        
        if (response.code === 200) {
          alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
          this.hideReportModal();
        }
      } catch (error) {
        console.error('신고 중 오류:', error);
        alert(error.response?.data?.message || '신고 처리 중 오류가 발생했습니다.');
      }
    },
    
    async toggleWishlist() {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
      
      try {
        await hotelAPI.toggleWishlist(this.hotel.id);
        this.hotel.wishlisted = !this.hotel.wishlisted;
      } catch (error) {
        console.error('찜하기 처리 중 오류:', error);
        alert('찜하기 처리 중 오류가 발생했습니다.');
      }
    },
    
    // ===== 지도 관련 =====
    
    initializeMap() {
      if (!this.hotel || !window.google) {
        console.log('Google Maps API가 로드되지 않았습니다.');
        return;
      }
      
      if (this.hotel.latitude && this.hotel.longitude) {
        const position = {
          lat: parseFloat(this.hotel.latitude),
          lng: parseFloat(this.hotel.longitude)
        };
        
        const map = new google.maps.Map(document.getElementById('googleMap'), {
          center: position,
          zoom: 15
        });
        
        new google.maps.Marker({
          position: position,
          map: map,
          title: this.hotel.hotelName
        });
      } else {
        this.geocodeAddress(this.hotel.address);
      }
    },
    
    geocodeAddress(address) {
      const geocoder = new google.maps.Geocoder();
      
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          const position = results[0].geometry.location;
          
          const map = new google.maps.Map(document.getElementById('googleMap'), {
            center: position,
            zoom: 15
          });
          
          new google.maps.Marker({
            position: position,
            map: map,
            title: this.hotel.hotelName
          });
        } else {
          console.error('Geocoding 실패:', status);
        }
      });
    },
    
    openGoogleMaps() {
      const address = this.hotel.address;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(url, '_blank');
    },
    
    // ===== UI 메서드 =====
    
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    handleClickOutside(event) {
      if (!this.$refs.userDropdown.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    },
    
    toggleAmenities() {
      this.amenitiesExpanded = !this.amenitiesExpanded;
    },
    
    setRating(rating) {
      this.selectedRating = rating;
    },
    
    selectCard(card) {
      this.selectedCard = card;
    },
    
    showReviewForm() {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
      
      this.isReviewFormVisible = true;
      this.$nextTick(() => {
        this.$el.querySelector('.review-form-section').scrollIntoView({ behavior: 'smooth' });
      });
    },
    
    hideReviewForm() {
      this.isReviewFormVisible = false;
      this.reviewText = '';
      this.selectedRating = 0;
      this.selectedCard = null;
    },
    
    filterReviews(filter) {
      this.activeFilter = filter;
      
      let sortBy = null;
      if (filter === 'highest') sortBy = 'highest';
      if (filter === 'lowest') sortBy = 'lowest';
      
      this.loadReviews(this.hotel.id, sortBy);
    },
    
    filterByCard(card) {
      this.loadReviews(this.hotel.id, null, card);
    },
    
    showReportModal(reviewId) {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
      
      this.selectedReviewId = reviewId;
      this.isReportModalVisible = true;
    },
    
    hideReportModal() {
      this.isReportModalVisible = false;
      this.selectedReportReason = '';
      this.reportDescription = '';
      this.selectedReviewId = null;
    },
    
    hideReportModalOnOverlay(event) {
      if (event.target === event.currentTarget) {
        this.hideReportModal();
      }
    },
    
    subscribe() {
      if (this.newsletterEmail) {
        console.log('Subscribing email:', this.newsletterEmail);
        alert('구독 신청이 완료되었습니다!');
        this.newsletterEmail = '';
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
    
    goToHotel() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelone');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    
    // ===== 유틸리티 메서드 =====
    
    formatPrice(price) {
      if (!price) return '₩0';
      return '₩' + Math.floor(price).toLocaleString('ko-KR');
    },
    
    generateStars(starCount) {
      if (!starCount) return '';
      return '★'.repeat(starCount);
    },
    
    getRatingText(rating) {
      if (!rating) return 'No Rating';
      if (rating >= 4.5) return 'Excellent';
      if (rating >= 4.0) return 'Very Good';
      if (rating >= 3.5) return 'Good';
      if (rating >= 3.0) return 'Average';
      if (rating >= 2.0) return 'Fair';
      return 'Poor';
    },
    
    getCardLabel(card) {
      const labels = {
        'NearPark': 'Near park',
        'NearNightLife': 'Near nightlife',
        'NearTheater': 'Near theater',
        'CleanHotel': 'Clean Hotel'
      };
      return labels[card] || card;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    },
    
    getAmenityIcon(amenityName) {
      const iconMap = {
        'Outdoor pool': '/images/hotel_img/outdoor.jpg',
        'Fitness center': '/images/hotel_img/fitness.jpg',
        'Indoor pool': '/images/hotel_img/outdoor.jpg',
        'Bar/Lounge': '/images/hotel_img/bar.jpg',
        'Spa and wellness center': '/images/hotel_img/spa.jpg',
        'Free Wi-Fi': '/images/hotel_img/wifi.jpg',
        'Restaurant': '/images/hotel_img/restaurant.jpg',
        'Tea/coffee machine': '/images/hotel_img/cafe.jpg',
        'Room service': '/images/hotel_img/roomservice.jpg'
      };
      return iconMap[amenityName] || '/images/hotel_img/default.jpg';
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
  
    // 도시로 검색
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
  
    // 오늘 날짜
    getToday() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
  
    // 내일 날짜
    getTomorrow() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    
    }
  }
}
</script>

<style scoped>

.star-choice-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 130px;
  height: 40px;
  border: 2px solid #8DD3BB;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  margin: 4px;
}

.star-choice-btn:hover {
  background-color: #8DD3BB;
}

.star-choice-btn.active {
  background-color: #8DD3BB;
  font-weight: 600;
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

.hotel-meta-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.stars {
    color: #FF8682;
    font-size: 14px;
    letter-spacing: 2px;
    padding-left: 25px;
    
}
.stars-hotel{
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    
}

.rating-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rating-score {
    background: #fff;
    border: 1px solid #7bc4a8;
    border-radius: 4px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: #112211;
    width: 40px;
    height: 32px;
    gap: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}


.rating-text1 {
    font-family: Montserrat;
    font-weight: 700;
    font-style: Bold;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: rgba(17, 34, 17, 1);
}
.rating-text2 {
    margin-left: -1px;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: rgba(17, 34, 17, 1);
;
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

.book-now-btn {
    background: #8DD3BB;
    color: #112211;
    border: none;
    border-radius: 4px;
    width: 150px;
    height: 48px;
    gap: 4px;
    padding: 8px 16px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
}

/* Image Gallery */
.image-gallery {
    display: flex;
    gap: 8px;
    margin-bottom: 40px;
    border-radius: 12px;
    width: 1232px;  
    height: 550px;
    overflow: hidden;
}

.main-image {
    width: 612px;
    height: 550px;
    position: relative;
    border-radius: 12px 0 0 12px; 
    overflow: hidden;
}

.sub-images {
    display: flex;
    flex-direction: column;
    gap: 8px; 
    width: 612px;
}

.sub-row {
    display: flex;
    gap: 8px;
    height: 271px;
}

.gallery-item {
    width: 302px;
    height: 271px;
    position: relative;
    overflow: hidden;
}

.item3 {
    border-radius: 0 12px 0 0; 
}
.item5{
    border-radius: 0 0 12px 0;
}

.main-image img,
.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.view-all-photos {
    position: absolute;
    bottom: 16px;
    right: 16px;
    background: #8DD3BB;
    color: #112211;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
}

/* Content Layout */
.content-layout {
    display: flex;
    gap: 40px;
}

.content-main {
    flex: 2;
}

.content-sidebar {
    flex: 1;
    max-width: 400px;
}

/* Over view*/
.overview-section {
    width: 1232px;
    margin-bottom: 70px;
}

.overview-title {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 20px;
    color: #112211;
    margin-bottom: 16px;
}

.overview-text {
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.6;
    color: #112211;
    margin-bottom: 24px;
}

.content-row {
    display: flex;       
    gap: 16px;         
    flex-wrap: wrap;     
}

.rating-box {
    background-color: white;
    border: 2px solid rgba(141, 211, 187, 1);
    width: 166px;
    height: 145px;
    padding-top: 16px;
    padding-right: 64px;
    padding-bottom: 16px;
    padding-left: 16px;
    gap: 10px;
    border-radius: 12px;
    padding: 16px 20px;
    flex-shrink: 0;
    cursor: pointer;
}
.rating-box img{
    width: 31.99907875061035px;
    height: 31.999845504760742px;
    top: 0px;
    left: 0px;
    angle: 0 deg;
    opacity: 1;

}

.rating-number {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 32px;
    color: #112211;
    line-height: 1;
    margin-bottom: 40px;
}

.rating-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #112211;
    margin-bottom: 2px;
}

.review-count {
    font-family: 'Montserrat', sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #112211;
}

.rating-box:hover{
    background: rgba(141, 211, 187, 1);

}
.rating-box:active{
    background: rgba(141, 211, 187, 1);

}

/* Room List */
.room-section {
    border-radius: 12px;
    margin-top: 70px;
    margin-bottom: 70px;
    width: 1232px;
}

.room-title {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 20px;
    color: #112211;
    margin-bottom: 24px;
}

.room-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;
}

.room-item:last-child {
    border-bottom: none;
}

.room-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
}

.room-info {
    flex: 1;
}

.room-details {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #112211;
    margin-bottom: 4px;
}



.room-price-section {
    display: flex;
    align-items: center;
    width: 392px;
    height: 48px;
    justify-content: space-between;
}

.room-price {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 24px;
    leading-trim: NONE;
    font-style: Regular;
    line-height: 100%;
    letter-spacing: 0%;
    color: rgba(17, 34, 17, 1);
}


.room-book-btn {
    background: #8DD3BB;
    color: #112211;
    border: none;
    width: 150px;
    height: 48px;
    border-radius: 4px;
    padding: 8px 16px;
    gap: 4px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    flex-shrink: 0;
}


/* Map Section */
.map-section {
    width: 1232px;
    margin-top: 70px;
    border-radius: 12px;
    margin-bottom: 70px;
}

.map-title {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 20px;
    color: #112211;
    margin-bottom: 16px;
}

.map-container {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
    background: #E0E0E0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666666;
    position: relative;
}

.map-placeholder {
    text-align: center;
}

.map-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map-address {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    display: flex;
    align-items: center;
    gap: 8px;
}
.map-address img{
    width: 11.25px;
    height: 15.749412536621094px;
    top: 1.13px;
    left: 3.38px;
    angle: 0 deg;
    opacity: 1;
}

.view-map-btn {
    background: #8DD3BB;
    color: #112211;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
}

/* Amenities Section */
.amenities-section {
    width: 720px;
    gap: 32px;
    border-radius: 12px;
    margin-bottom: 70px;
    margin-top: 70px;
}

.amenities-title {
    font-family: Acme;
    font-weight: 400;
    font-style: Regular;
    font-size: 20px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
    margin-bottom: 24px;
}


.amenities-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.amenity-item {
    display: flex;
    align-items: center;
    gap: 12px;
}
.amenity-item img{
    width: 20px;
    height: 19px;
    top: 2px;
    left: 2px;
    angle: 0 deg;
    opacity: 1;
}

.amenity-text {
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
}


.amenity-text.plus{
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #FF8682;
    cursor: pointer;
}

.amenity-item.hidden {
    display: none;
}

/* Reviews Section */
.reviews-section {
    width: 1232px;
    border-radius: 12px;
    margin-top: 70px;
    margin-bottom: 180px;
}
.reviews-header.single-row {
    display: flex;
    justify-content: space-between;
    align-items: center; 
    gap: 24px;
    margin-bottom: -150px;
}

.reviews-info {
    display: block;
    align-items: center;
    gap: 16px; 
}
.reviews-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
}

.reviews-left {
    display: flex;
    align-items: flex-start;
    gap: 24px;
}

.reviews-title {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 20px;
    color: #112211;
}

.reviews-summary {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
}

.review-score-big {
    font-family: Montserrat;
    font-weight: 700;
    font-size: 48px;
    color: #112211;
}

.review-summary-text {
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 20px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
}


.review-summary-text2 {
    font-family: Montserrat;
    font-weight: 400;
    font-style: Regular;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
    margin-top: 6px;
}
.review-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.review-btn {
    background: #8DD3BB;
    color: #112211;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
}

.review-filters {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
}

.filter-btn {
    background: #F5F5F5;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 12px;
    cursor: pointer;
}

.filter-btn.active {
    background: #8DD3BB;
    color: #112211;
}

.review-item {
    border-bottom: 1px solid #f0f0f0;
    padding: 20px 0;
}

.review-item:last-child {
    border-bottom: none;
}

.review-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 8px;
}

.review-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #D9D9D9;
    flex-shrink: 0;
}

.reviewer-info {
    flex: 1;
}

.reviewer-name {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #112211;
    margin-bottom: 2px;
}

.review-rating {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 12px;
    color: #666666;
}

.report-btn {
    background: #FF6B6B;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 12px;
    cursor: pointer;
    flex-shrink: 0;
}

.review-text {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.6;
    color: #112211;
    margin-left: 52px;
}

.review-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 24px;
    margin-bottom: 100px;
}

.pagination-btn {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666666;
}

.pagination-info {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
}

/* Review Form */
.review-form-section {
    background: white;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 32px;
    border: 2px solid #8DD3BB;
    display: none;
}

.review-form-section.active {
    display: block;
}

.review-form-title {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 20px;
    color: #112211;
    margin-bottom: 24px;
}

.rating-input {
    margin-bottom: 24px;
}

.rating-input label {
    font-family: Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #112211;
    display: block;
    margin-bottom: 8px;
}

.star-rating {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    gap: 4px;
    margin-bottom: 16px;
}

.star {
    font-size: 24px;
    color: #E0E0E0;
    cursor: pointer;
    transition: color 0.2s;
    justify-content: space-between;
}
 .star-rating .star:last-of-type{
            margin-right: 80px;
        }

        .star-choice-btn{
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 130px;
            height: 100%;
            border: 2px solid #8DD3BB;
            background-color: white;
            border-radius: 8px;
        }
        .star-choice-btn:hover{
            background-color: #8DD3BB;
            cursor: pointer;
        }

        .star:hover,
        .star.active {
            color: #FFD700;
        }

        .review-textarea {
            width: 100%;
            min-height: 120px;
            padding: 16px;
            border: 1px solid #E0E0E0;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            resize: vertical;
            margin-bottom: 24px;
        }

        .review-form-buttons {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .cancel-btn {
            background: #F5F5F5;
            color: #666666;
            border: none;
            border-radius: 4px;
            padding: 12px 24px;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
        }

        .submit-review-btn {
            background: #8DD3BB;
            color: #112211;
            border: none;
            border-radius: 4px;
            padding: 12px 24px;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
        }

        /* Report Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 32px;
            width: 500px;
            max-width: 90vw;
        }

        .modal-title {
            font-family: Montserrat;
            font-weight: 600;
            font-size: 20px;
            color: #112211;
            margin-bottom: 24px;
            text-align: center;
        }

        .report-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 24px;
        }

        .report-option {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .report-option input[type="radio"] {
            width: 18px;
            height: 18px;
        }

        .report-option label {
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            color: #112211;
            cursor: pointer;
        }

        .report-textarea {
            width: 100%;
            min-height: 100px;
            padding: 16px;
            border: 1px solid #E0E0E0;
            border-radius: 8px;
            font-family: Montserrat;
            font-weight: 400;
            font-size: 14px;
            resize: vertical;
            margin-bottom: 24px;
        }

        .modal-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .modal-cancel-btn {
            background: #F5F5F5;
            color: #666666;
            border: none;
            border-radius: 4px;
            padding: 12px 24px;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
        }

        .modal-submit-btn {
            background: #FF6B6B;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px 24px;
            font-family: Montserrat;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
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
        .beeline{
            width: 1232px;
            height: 1px;
            angle: 0 deg;
            opacity: 0.25;
            background: rgba(17, 34, 17, 1);

        }
    </style>