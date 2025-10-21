<template>
  <div>
    <!-- ========== HEADER ========== -->
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

    <!-- ========== USER DROPDOWN ========== -->
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


    <!-- ========== BREADCRUMB ========== -->
    <div class="breadcrumb" v-if="hotel">
      <a href="#" @click.prevent="searchByCountry(hotel.countryName)" style="color: rgba(255, 134, 130, 1);">
        {{ hotel.countryName || 'Turkey' }}
      </a> > 
      <a href="#" @click.prevent="searchByCity(hotel.cityName)" style="color: rgba(255, 134, 130, 1);">
        {{ hotel.cityName || 'Istanbul' }}
      </a> > 
      <span>{{ hotel.hotelName }}</span>
    </div>

    <!-- ========== MAIN CONTENT ========== -->
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
            <button class="action-btn" @click="toggleWishlist" :class="{ wishlisted: hotel.wishlisted }">
              <img src="/images/hotel_img/heart2.jpg"/>
            </button>
            <button class="action-btn" @click="shareHotel">
              <img src="/images/hotel_img/share.jpg">
            </button>
            <button class="book-now-btn">Book now</button>
          </div>
        </div>
      </div>

      <!-- Image Gallery -->
      <div class="image-gallery">
        <div class="main-image">
          <img :src="hotel.images && hotel.images.length > 0 ? getImageUrl(hotel.images[0]) : '/images/hotel_img/findhotel1.jpg'" :alt="hotel.hotelName">
        </div>
        <div class="sub-images">
          <div class="sub-row">
            <div class="gallery-item">
              <img src="/images/hotel_img/findhotel2.jpg" alt="호텔 객실">
            </div>
            <div class="gallery-item item3">
              <img src="/images/hotel_img/findhotel3.jpg" alt="호텔 로비">
            </div>
          </div>  
          <div class="sub-row">
            <div class="gallery-item">
              <img src="/images/hotel_img/findhotel4.jpg" alt="호텔 외관">
            </div>
            <div class="gallery-item item5">
              <img src="/images/hotel_img/findhotel5.jpg" alt="호텔 수영장">
              <button class="view-all-photos" @click="openGallery">View all photos</button>
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
            
            <div v-if="groupedRooms && groupedRooms.length > 0">
              <div v-for="(group, index) in groupedRooms" :key="index" class="room-item">
                <img :src="group.image || '/images/hotel_img/room-default.jpg'" :alt="group.roomName" class="room-image">
                <div class="room-info">
                  <div class="room-details">
                    {{ group.roomName }} · {{ group.bedType }}
                    <span class="room-stock"> (재고: {{ group.rooms.length }}개)</span>
                  </div>
                </div>
                <div class="room-price-section">
                  <div class="room-price">{{ formatPrice(group.totalPrice) }}<span style="font-size: 14px; font-weight: 400;"> / {{ group.nights }}박</span></div>
                  <button class="room-book-btn" @click="showRoomSelectionModal(group)">호실 선택</button>
                </div>
              </div>
            </div>
            <div v-else class="no-rooms">
              <p>선택하신 날짜에 예약 가능한 객실이 없습니다.</p>
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
              <div class="amenity-item" v-for="(amenity, index) in displayedAmenities" :key="index">
                <span><img :src="getAmenityIcon(amenity.amenitiesName)"></span>
                <span class="amenity-text">{{ amenity.amenitiesName }}</span>
              </div>
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
            <h3 class="review-form-title">{{ isEditMode ? '리뷰 수정하기' : '리뷰 작성하기' }}</h3>
            
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
              <button v-if="!isEditMode" class="submit-review-btn" @click="submitReview">등록</button>
              <button v-if="isEditMode" class="edit-review-btn" @click="submitReview">수정</button>
              <button v-if="isEditMode" class="delete-review-btn" @click="deleteReview">삭제</button>
            </div>
          </div>
          
          <!-- Review Filters -->
          <div class="review-filters">
            <button v-for="filter in reviewFilters" :key="filter.key" class="filter-btn" :class="{ active: activeFilter === filter.key }" @click="filterReviews(filter.key)">
              {{ filter.label }}
            </button>
          </div>

          <!-- Review List -->
          <div id="reviewsList">
            <div v-for="review in filteredReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="review-user-info">
                  <div class="reviewer-avatar"></div>
                <div class="reviewer-info">
                  <div class="reviewer-name">{{ review.rating }}.0 {{ getRatingText(review.rating) }} | {{ review.displayName || review.memberName }}</div>
                  <div class="review-rating">{{ formatDate(review.createdAt) }}</div>
                </div>
              </div>

              <!-- 본인 리뷰면 수정+삭제 버튼, 아니면 신고 버튼 -->
               <div v-if="review.isMyReview" class="my-review-buttons">
                <button class="edit-my-review-btn" @click="editMyReview(review)">수정</button>
                <button class="delete-my-review-btn" @click="deleteMyReview(review.id)">삭제</button>
              </div>
              <button v-else class="report-btn" @click="showReportModal(review.id)">신고</button>
            </div>
            <p class="review-text">{{ review.reviewContent }}</p>
          </div>
        </div>

          <!-- Review Pagination -->
          <div class="review-pagination">
            <button class="pagination-btn">‹</button>
            <span class="pagination-info">1 of {{ Math.ceil(hotel.reviewCount / 10) }}</span>
            <button class="pagination-btn">›</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== MODALS ========== -->
    
    <!-- 호실 선택 모달 -->
    <div class="modal-overlay" :class="{ active: isRoomSelectionModalVisible }" @click="hideRoomSelectionModal">
      <div class="modal-content room-selection-modal" @click.stop>
        <h3 class="modal-title">호실 선택</h3>
        
        <div v-if="selectedRoomGroup" class="selected-room-type">
          <h4>{{ selectedRoomGroup.roomName }}</h4>
          <p>{{ selectedRoomGroup.bedType }}</p>
          <p class="price-info">{{ formatPrice(selectedRoomGroup.totalPrice) }} / {{ selectedRoomGroup.nights }}박</p>
        </div>

        <div class="room-numbers-grid">
          <button 
            v-for="room in selectedRoomGroup?.rooms" 
            :key="room.roomId"
            class="room-number-btn"
            :class="{ selected: selectedRoomId === room.roomId }"
            @click="selectRoom(room.roomId, room.roomNumber)">
            <div class="room-num-text">{{ room.roomNumber }}호</div>
            <div class="room-floor-text">{{ Math.floor(room.roomNumber / 100) }}층</div>
          </button>
        </div>

        <div class="modal-buttons">
          <button class="modal-cancel-btn" @click="hideRoomSelectionModal">취소</button>
          <button 
            class="modal-submit-btn" 
            @click="confirmRoomSelection"
            :disabled="!selectedRoomId">
            예약하기
          </button>
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

    <!-- 공유 모달 -->
    <div class="modal-overlay" :class="{ active: isShareModalVisible }" @click="hideShareModal">
      <div class="modal-content share-modal" @click.stop>
        <h3 class="modal-title">공유하기</h3>

        <div class="share-options">
          <button class="share-option-btn kakao" @click="shareToKakao">
            <div class="share-icon kakao-icon">K</div>
            <span>카카오톡</span>
          </button>

          <button class="share-option-btn link" @click="copyLink">
            <div class="share-icon link-icon">🔗</div>
            <span>링크 복사</span>
          </button>
        </div>

        <button class="modal-cancel-btn" @click="hideShareModal">닫기</button>
      </div>
    </div>

    <!-- 이미지 갤러리 슬라이드 모달 -->
    <div class="gallery-modal" :class="{ active: isGalleryVisible }" v-if="hotel && hotel.images && hotel.images.length > 0">
      <div class="gallery-modal-content">
        <button class="gallery-close-btn" @click="closeGallery">×</button>

        <button class="gallery-nav-btn prev" @click="prevImage" v-if="currentImageIndex > 0">‹</button>

        <div class="gallery-image-container">
          <img :src="getImageUrl(hotel.images[currentImageIndex])" :alt="hotel.hotelName">
          <div class="gallery-counter">{{ currentImageIndex + 1 }} / {{ hotel.images.length }}</div>
        </div>

        <button class="gallery-nav-btn next" @click="nextImage" v-if="currentImageIndex < hotel.images.length - 1">›</button>

        <div class="gallery-thumbnails">
          <div 
            v-for="(image, index) in hotel.images" 
            :key="index"
            class="gallery-thumbnail"
            :class="{ active: index === currentImageIndex }"
            @click="goToImage(index)">
            <img :src="getImageUrl(image)" :alt="`이미지 ${index + 1}`">
          </div>
        </div>
      </div>
    </div>

    <!-- ========== NEWSLETTER & FOOTER ========== -->
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
import { authUtils, hotelAPI, paymentAPI, adminAPI, memberCouponAPI, memberImageAPI} from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'

export default {
  name: 'HotelThree',
  data() {
    return {
      profileImageUrl: '/images/hotel_account_img/member.jpg',
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
      isShareModalVisible: false,
      isGalleryVisible: false,
      currentImageIndex: 0,
      hotel: null,
      reviews: [],
      reviewCardStats: {},
      showCouponModal: false,
      receivedCoupons: [],

      availableRooms: [],
      checkIn: null,
      checkOut: null,
      reviewEligibility: null,
      isEditMode: false,
      editingReviewId: null,
      guests: 2,  

      isRoomSelectionModalVisible: false,
      selectedRoomGroup: null,
      selectedRoomId: null,
      selectedRoomNumber: null,

      isRoomNumberModalVisible: false,
      selectedRoomForBooking: null,
      
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
        return this.hotel.amenities;
      }
      return this.hotel.amenities.slice(0, 3);
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
    },
    
    groupedRooms() {
      if (!this.availableRooms || this.availableRooms.length === 0) {
        return [];
      }
      
      const groups = {};
      
      this.availableRooms.forEach(room => {
        const key = `${room.roomName}_${room.bedType}`;
        
        if (!groups[key]) {
          groups[key] = {
            roomName: room.roomName,
            bedType: room.bedType,
            totalPrice: room.totalPrice,
            nights: room.nights,
            image: room.image,
            rooms: []
          };
        }
        
        groups[key].rooms.push({
          roomId: room.roomId,
          roomNumber: room.roomNumber,
          totalPrice: room.totalPrice
        });
      });
      
      return Object.values(groups);
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();
    
    const hotelId = this.$route.query.hotelId;
    this.checkIn = this.$route.query.checkIn || this.getToday();
    this.checkOut = this.$route.query.checkOut || this.getTomorrow();
      // ✅ 날짜 검증 추가
    if (!this.validateDatesOnMount()) {
      return;
    }
  
    if (hotelId) {
      await this.loadHotelDetail(hotelId);
      await this.loadRoomAvailability(hotelId);
      await this.loadReviewsData(hotelId);
      await this.loadReviewStats(hotelId);
      
      if (this.isLoggedIn) {
        await this.checkReviewEligibility(hotelId);
      }
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
    goToLogin() {
      this.isDropdownActive = false;
      this.$router.push('/login');
    },

    validateDatesOnMount() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkInDate = new Date(this.checkIn);
      const checkOutDate = new Date(this.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);

      // 체크인이 과거인 경우
      if (checkInDate < today) {
        alert('과거 날짜로는 예약할 수 없습니다. 검색 페이지로 돌아갑니다.');
        this.$router.push('/hoteltwo');
        return false;
      }

      // 체크아웃이 체크인보다 이전이거나 같은 경우
      if (checkOutDate <= checkInDate) {
        alert('잘못된 날짜입니다. 검색 페이지로 돌아갑니다.');
        this.$router.push('/hoteltwo');
        return false;
      }

      return true;
    },
    // ========== API 메서드 ==========
    
    async loadRoomAvailability(hotelId) {
      try {
        const response = await hotelAPI.getRoomAvailability({
          hotelId: hotelId,
          checkIn: this.checkIn,
          checkOut: this.checkOut
        });
        
        if (response.code === 200) {
          this.availableRooms = response.data;
          
          if (this.availableRooms && this.availableRooms.length > 0) {
            await this.loadRoomImagesForAvailableRooms();
          }
        }
      } catch (error) {
        console.error('객실 재고 조회 중 오류:', error);
      }
    },
    
    async loadRoomImagesForAvailableRooms() {
      for (let room of this.availableRooms) {
        try {
          const response = await hotelAPI.getRoomImages(room.roomId);
          if (response.code === 200 && response.data.length > 0) {
            const imagePath = response.data[0].roomImagePath;
            room.image = adminAPI.getImageUrl(imagePath);
          }
        } catch (error) {
          console.error(`객실 ${room.roomId} 이미지 로드 실패:`, error);
          room.image = '/images/hotel_img/room-default.jpg';
        }
      }
    },
    
    // ===== 리뷰 작성 가능 여부 체크 =====
    async checkReviewEligibility(hotelId) {
      try {
        const response = await hotelAPI.checkReviewEligibility(hotelId);

        if (response.code === 200) {
          this.reviewEligibility = response.data;

          console.log('리뷰 작성 가능 여부:', this.reviewEligibility);

          // status에 따라 canWrite 설정
          this.reviewEligibility.canWrite = (this.reviewEligibility.status === 'ELIGIBLE');
        }
      } catch (error) {
        console.error('리뷰 작성 가능 여부 체크 중 오류:', error);
      }
    },
    
    async bookRoom(room) {
      // 날짜 검증만 수행 (로그인 체크 제거)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkInDate = new Date(this.checkIn);
      const checkOutDate = new Date(this.checkOut);
      checkInDate.setHours(0, 0, 0, 0);
      checkOutDate.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        alert('체크인 날짜는 오늘 이후여야 합니다.');
        return;
      }

      if (checkOutDate <= checkInDate) {
        alert('체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.');
        return;
      }

      if (checkOutDate < today) {
        alert('체크아웃 날짜가 이미 지났습니다.');
        return;
      }

      console.log('예약 시작');

      // 로그인하지 않은 경우: 예약 정보만 쿼리로 전달
      if (!this.isLoggedIn) {
        await this.$router.push({
          path: '/hotelfour',
          query: {
            roomId: room.roomId,
            hotelId: this.hotel.id,
            hotelName: this.hotel.hotelName,
            roomName: room.roomName,
            roomNumber: room.roomNumber || '',
            checkIn: this.checkIn,
            checkOut: this.checkOut,
            totalPrice: room.totalPrice,
            nights: room.nights,
            guests: this.guests,
            needLogin: 'true'
          }
        });
        return;
      }

      // 로그인한 경우: 기존 예약 생성 로직
      try {
        const reservationData = {
          roomId: Number(room.roomId),
          checkInDate: this.checkIn,
          checkOutDate: this.checkOut,
          guestsCount: Number(this.guests) || 2,
          basePayment: String(room.totalPrice),
          reservationsStatus: false
        };

        const reservationResponse = await paymentAPI.createReservation(reservationData);

        if (reservationResponse.code !== 200) {
          throw new Error(reservationResponse.message || '예약 생성 실패');
        }

        const reservationId = reservationResponse.data.id;

        await this.$router.push({
          path: '/hotelfour',
          query: {
            reservationId: reservationId,
            roomId: room.roomId,
            hotelId: this.hotel.id,
            hotelName: this.hotel.hotelName,
            roomName: room.roomName,
            roomNumber: room.roomNumber || '',
            checkIn: this.checkIn,
            checkOut: this.checkOut,
            totalPrice: room.totalPrice,
            nights: room.nights,
            guests: this.guests
          }
        });

      } catch (error) {
        console.error('예약 생성 실패:', error);

        if (error.response?.status === 409) {
          const existingReservationId = error.response.data?.reservationId;

          if (existingReservationId) {
            if (confirm('미결제된 예약이 있습니다. 이어서 진행하시겠습니까?')) {
              await this.$router.push({
                path: '/hotelfour',
                query: {
                  reservationId: existingReservationId,
                  roomId: room.roomId,
                  hotelId: this.hotel.id,
                  hotelName: this.hotel.hotelName,
                  roomName: room.roomName,
                  roomNumber: room.roomNumber || '',
                  checkIn: this.checkIn,
                  checkOut: this.checkOut,
                  totalPrice: room.totalPrice,
                  nights: room.nights,
                  guests: this.guests
                }
              });
              return;
            }
          } else {
            alert('이미 해당 날짜에 예약이 존재합니다.');
          }
          return;
        }

        let errorMessage = '예약 생성에 실패했습니다.';

        if (error.response?.data) {
          const errorData = error.response.data;

          if (errorData.errors) {
            const errors = Object.entries(errorData.errors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join('\n');
            errorMessage = `입력 오류:\n${errors}`;
          }
          else if (errorData.message) {
            errorMessage = errorData.message;
          }
        }

        alert(errorMessage);
      }
    },
    // ===== 리뷰 작성 폼 표시 =====
    async showReviewForm() {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }

      // 리뷰 작성 가능 여부 체크
      await this.checkReviewEligibility(this.hotel.id);

      // 상태별 메시지 처리
      if (this.reviewEligibility?.status === 'ALREADY_WRITTEN') {
        if (confirm('이미 작성한 리뷰가 있습니다. 수정하시겠습니까?')) {
          await this.loadMyReview();
        }
        return;
      }

      if (this.reviewEligibility?.status === 'NO_BOOKING') {
        alert('예약 내역이 없습니다. 호텔 예약 후 리뷰를 작성할 수 있습니다.');
        return;
      }

      if (this.reviewEligibility?.status === 'NOT_ELIGIBLE') {
        // 체크아웃 날짜 확인
        if (this.reviewEligibility.checkOut) {
          const checkOutDate = new Date(this.reviewEligibility.checkOut);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          checkOutDate.setHours(0, 0, 0, 0);

          if (checkOutDate > today) {
            const daysRemaining = Math.ceil((checkOutDate - today) / (1000 * 60 * 60 * 24));
            alert(`체크아웃 날짜(${this.reviewEligibility.checkOut}) 이후 ${daysRemaining}일 뒤에 리뷰를 작성할 수 있습니다.`);
          } else {
            alert('결제가 완료된 예약만 리뷰를 작성할 수 있습니다.');
          }
        } else {
          alert('체크아웃 후에 리뷰를 작성할 수 있습니다.');
        }
        return;
      }

      if (!this.reviewEligibility?.canWrite) {
        alert('리뷰를 작성할 수 없습니다.');
        return;
      }

      // 리뷰 작성 가능 - 폼 표시
      this.isEditMode = false;
      this.isReviewFormVisible = true;
      this.selectedRating = 0;
      this.selectedCard = null;
      this.reviewText = '';

      this.$nextTick(() => {
        this.$el.querySelector('.review-form-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    },


    // ===== 리뷰 등록/수정 =====
    async submitReview() {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }

      // 유효성 검사
      if (!this.selectedRating || this.selectedRating === 0) {
        alert('평점을 선택해주세요.');
        return;
      }

      if (!this.selectedCard) {
        alert('리뷰 카드를 선택해주세요.');
        return;
      }

      if (!this.reviewText || this.reviewText.trim().length < 2) {
        alert('리뷰 내용을 2자 이상 입력해주세요.');
        return;
      }

      try {
        let response;

        if (this.isEditMode) {
          // 수정 모드
          const reviewData = {
            hotelId: this.hotel.id,
            rating: this.selectedRating.toString(),
            reviewContent: this.reviewText.trim(),
            reviewCard: this.selectedCard
          };

          console.log('리뷰 수정 데이터:', reviewData);

          response = await hotelAPI.updateReview(this.editingReviewId, reviewData);

          if (response.code === 200) {
            alert('리뷰가 수정되었습니다.');
          }
        } else {
          const reviewData = {
            hotelId: this.hotel.id,
            rating: this.selectedRating.toString(),
            reviewContent: this.reviewText.trim(),
            reviewCard: this.selectedCard
            // reservationsId는 백엔드에서 자동으로 처리
          };

          console.log('리뷰 작성 데이터:', reviewData);

          response = await hotelAPI.createReview(reviewData);

          if (response.code === 200) {
            alert('리뷰가 작성되었습니다.');
          }
        }

        // 리뷰 목록 및 평점 정보 새로고침
        await this.loadReviewsData(this.hotel.id);
        await this.loadReviewStats(this.hotel.id);
        await this.loadHotelRatingStats(this.hotel.id);

        // 리뷰 작성 가능 여부 재확인
        await this.checkReviewEligibility(this.hotel.id);

        this.hideReviewForm();

      } catch (error) {
        console.error('=== 리뷰 처리 중 오류 ===');
        console.error('error:', error);
        console.error('error.response:', error.response);
        console.error('error.response.data:', error.response?.data);

        // 상세한 에러 메시지 표시
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else if (error.response?.data?.errors) {
          const errors = error.response.data.errors;
          const errorMessages = Object.entries(errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          alert(`입력 오류:\n${errorMessages}`);
        } else {
          alert(this.isEditMode ? '리뷰 수정 중 오류가 발생했습니다.' : '리뷰 작성 중 오류가 발생했습니다.');
        }
      }
    },

    // ===== 내 리뷰 불러오기 (수정용) =====
    async loadMyReview() {
      try {
        const response = await hotelAPI.getMyReview(this.hotel.id);

        if (response.code === 200 && response.data) {
          const myReview = response.data;

          // 폼에 기존 리뷰 데이터 채우기
          this.isEditMode = true;
          this.editingReviewId = myReview.id;
          this.selectedRating = parseFloat(myReview.rating);
          this.selectedCard = myReview.reviewCard;
          this.reviewText = myReview.reviewContent;
          this.isReviewFormVisible = true;

          this.$nextTick(() => {
            this.$el.querySelector('.review-form-section')?.scrollIntoView({ behavior: 'smooth' });
          });
        } else if (response.code === 404) {
          alert('작성한 리뷰가 없습니다.');
        }
      } catch (error) {
        console.error('내 리뷰 로드 중 오류:', error);

        if (error.response?.status === 404) {
          alert('작성한 리뷰가 없습니다.');
        } else {
          alert('리뷰 로드 중 오류가 발생했습니다.');
        }
      }
    },

    // ===== 리뷰 목록에서 수정 버튼 클릭 =====
    editMyReview(review) {
      this.isEditMode = true;
      this.editingReviewId = review.id;
      this.selectedRating = parseFloat(review.rating);
      this.selectedCard = review.reviewCard;
      this.reviewText = review.reviewContent;
      this.isReviewFormVisible = true;
    
      // 리뷰 폼으로 스크롤
      this.$nextTick(() => {
        this.$el.querySelector('.review-form-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    },

    // ===== 리뷰 삭제 (폼에서) =====
    async deleteReview() {
      if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
        return;
      }

      try {
        const response = await hotelAPI.deleteReview(this.editingReviewId);

        if (response.code === 200) {
          alert('리뷰가 삭제되었습니다.');

          await this.loadReviewsData(this.hotel.id);
          await this.loadReviewStats(this.hotel.id);
          await this.loadHotelRatingStats(this.hotel.id);
          await this.checkReviewEligibility(this.hotel.id);

          this.hideReviewForm();
        }
      } catch (error) {
        console.error('리뷰 삭제 중 오류:', error);
        alert(error.response?.data?.message || '리뷰 삭제 중 오류가 발생했습니다.');
      }
    },

    // ===== 리뷰 삭제 (목록에서) =====
    async deleteMyReview(reviewId) {
      if (!confirm('정말 이 리뷰를 삭제하시겠습니까?')) {
        return;
      }

      try {
        const response = await hotelAPI.deleteReview(reviewId);

        if (response.code === 200) {
          alert('리뷰가 삭제되었습니다.');

          // 리뷰 목록 및 평점 정보 새로고침
          await this.loadReviewsData(this.hotel.id);
          await this.loadReviewStats(this.hotel.id);
          await this.loadHotelRatingStats(this.hotel.id);
          await this.checkReviewEligibility(this.hotel.id);
        }
      } catch (error) {
        console.error('리뷰 삭제 중 오류:', error);
        alert(error.response?.data?.message || '리뷰 삭제 중 오류가 발생했습니다.');
      }
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
      
      if (!this.reportDescription || this.reportDescription.length < 2) {
        alert('신고 사유를 2자 이상 입력해주세요.');
        return;
      }

      const reportData = {
        reviewsId: this.selectedReviewId,
        memberId: this.userInfo.id,
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
    
    async loadHotelDetail(hotelId) {
      try {
        const response = await hotelAPI.getHotelDetail(hotelId);

        if (response.code === 200) {
          this.hotel = response.data;
          await this.loadHotelRatingStats(hotelId);

          this.$nextTick(() => {
            this.initializeMap();
          });
        }
      } catch (error) {
        console.error('호텔 정보 로드 중 오류:', error);
        alert('호텔 정보를 불러올 수 없습니다.');
      }
    },
    
    async loadHotelRatingStats(hotelId) {
      try {
        const response = await hotelAPI.getHotelRatingStats(hotelId);
        
        if (response.code === 200) {
          this.hotel.averageRating = parseFloat(response.data.averageRating) || 0;
          this.hotel.reviewCount = parseInt(response.data.reviewCount) || 0;
        }
      } catch (error) {
        console.error('평점 정보 로드 중 오류:', error);
      }
    },
    
    async loadReviewsData(hotelId, sortBy = null, reviewCard = null) {
      try {
        const response = await hotelAPI.getHotelReviews(hotelId, sortBy, reviewCard);
        
        if (response.code === 200) {
          this.reviews = response.data;
          
          // 백엔드에서 이미 memberName이 포맷팅되어 왔음
          this.reviews.forEach(review => {
            review.displayName = review.memberName;
            
            // 내 리뷰 체크
            if (this.isLoggedIn && this.userInfo) {
              review.isMyReview = review.memberId === this.userInfo.id;
            }
          });
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
        }
      } catch (error) {
        console.error('리뷰 통계 로드 중 오류:', error);
      }
    },
    
    // ===== 지도 관련 =====
    
    initializeMap() {
      if (!this.hotel || !window.google) {
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
    
    hideReviewForm() {
      this.isReviewFormVisible = false;
      this.reviewText = '';
      this.selectedRating = 0;
      this.selectedCard = null;
      this.isEditMode = false;
      this.editingReviewId = null;
    },
    
    filterReviews(filter) {
      this.activeFilter = filter;
      
      let sortBy = null;
      if (filter === 'highest') sortBy = 'highest';
      if (filter === 'lowest') sortBy = 'lowest';
      
      this.loadReviewsData(this.hotel.id, sortBy);
    },
    
    filterByCard(card) {
      this.loadReviewsData(this.hotel.id, null, card);
      this.loadHotelRatingStats(this.hotel.id);
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

    
    // ===== 사용자 관련 =====
    
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
            this.profileImageUrl = `http://localhost:8089/uploads${imagePath}`;
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

    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/hotel1.jpg';
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('/images/')) return imagePath;
      return adminAPI.getImageUrl(imagePath);
    },

    // ===== 공유 기능 =====
    
    async shareHotel() {
      this.isShareModalVisible = true;
    },

    async shareToKakao() {
      if (!window.Kakao) {
        alert('카카오톡 공유 기능을 사용할 수 없습니다.');
        return;
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.VUE_APP_KAKAO_SHARE_KEY);
      }

      window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
          title: this.hotel.hotelName,
          description: this.hotel.description,
          imageUrl: this.getImageUrl(this.hotel.images[0]),
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '자세히 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });

      this.isShareModalVisible = false;
    },

    copyLink() {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        alert('링크가 복사되었습니다!');
        this.isShareModalVisible = false;
      }).catch(() => {
        alert('링크 복사에 실패했습니다.');
      });
    },

    hideShareModal() {
      this.isShareModalVisible = false;
    },

    // ===== 사진 갤러리 슬라이드 =====
    
    openGallery() {
      if (!this.hotel || !this.hotel.images || this.hotel.images.length === 0) {
        alert('표시할 이미지가 없습니다.');
        return;
      }
      this.isGalleryVisible = true;
      this.currentImageIndex = 0;
    },

    closeGallery() {
      this.isGalleryVisible = false;
    },

    nextImage() {
      if (this.currentImageIndex < this.hotel.images.length - 1) {
        this.currentImageIndex++;
      }
    },

    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },

    goToImage(index) {
      this.currentImageIndex = index;
    },

    // ===== 찜하기 =====
    
    async toggleWishlist() {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }

      try {
        await hotelAPI.toggleWishlist(this.hotel.id);
        this.hotel.wishlisted = !this.hotel.wishlisted;

        if (this.hotel.wishlisted) {
          alert('찜 목록에 추가되었습니다.');
        } else {
          alert('찜 목록에서 제거되었습니다.');
        }
      } catch (error) {
        console.error('찜하기 처리 중 오류:', error);
        alert('찜하기 처리 중 오류가 발생했습니다.');
      }
    },

    showRoomNumberModal(room) {
      if (!this.isLoggedIn) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
      
      this.selectedRoomForBooking = room;
      this.isRoomNumberModalVisible = true;
    },
    
    hideRoomNumberModal() {
      this.isRoomNumberModalVisible = false;
      this.selectedRoomForBooking = null;
    },
    
    confirmRoomBooking() {
      if (!this.selectedRoomForBooking) {
        return;
      }
      
      this.hideRoomNumberModal();
      this.bookRoom(this.selectedRoomForBooking);
    },
// 호실 선택 모달 열기
    showRoomSelectionModal(group) {
      
      this.selectedRoomGroup = group;
      this.selectedRoomId = null;
      this.selectedRoomNumber = null;
      this.isRoomSelectionModalVisible = true;
    },
    
    hideRoomSelectionModal() {
      this.isRoomSelectionModalVisible = false;
      this.selectedRoomGroup = null;
      this.selectedRoomId = null;
      this.selectedRoomNumber = null;
    },
    
    // 호실 선택
    selectRoom(roomId, roomNumber) {
      this.selectedRoomId = roomId;
      this.selectedRoomNumber = roomNumber;
    },
    
    // 예약 확정
    confirmRoomSelection() {
      if (!this.selectedRoomId) {
        alert('호실을 선택해주세요.');
        return;
      }

      const selectedRoom = this.availableRooms.find(r => r.roomId === this.selectedRoomId);

      this.hideRoomSelectionModal();
      this.bookRoom(selectedRoom);
    }


  }
}
</script>

<style scoped>

  /* 객실 재고 표시 */
  .room-stock {
    color: #8DD3BB;
    font-weight: 600;
    margin-left: 8px;
  }
  
  /* 객실 없음 메시지 */
  .no-rooms {
    text-align: center;
    padding: 40px;
    color: #666666;
    font-family: Montserrat;
  }
  
  .no-rooms p {
    font-size: 16px;
  }
  
  /* 리뷰 삭제 버튼 */
  .delete-review-btn {
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
  
  .delete-review-btn:hover {
    background: #FF5252;
  }
  
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
  /* 찜하기 버튼 */ 
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
  
  /* 찜하기 버튼 활성화 스타일 */
  .action-btn.wishlisted img {
    filter: invert(47%) sepia(86%) saturate(2316%) hue-rotate(331deg) brightness(101%) contrast(101%);
  }
  /* 공유 모달 */
  .share-modal {
    width: 400px;
  }
  
  .share-options {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    justify-content: center;
  }
  
  .share-option-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 24px;
    border: 2px solid #E0E0E0;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
    width: 140px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 14px;
    color: #112211;
  }
  
  .share-option-btn:hover {
    border-color: #8DD3BB;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .share-option-btn.kakao:hover {
    border-color: #FEE500;
    background: #FEE500;
  }
  
  .share-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: bold;
  }
  
  .kakao-icon {
    background: #FEE500;
    color: #3C1E1E;
  }
  
  .link-icon {
    background: #8DD3BB;
    font-size: 32px;
  }
  
  /* 갤러리 슬라이드 모달 */
  .gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    display: none;
    z-index: 3000;
  }
  
  .gallery-modal.active {
    display: flex;
  }
  
  .gallery-modal-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
  
  .gallery-close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 48px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    line-height: 1;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .gallery-close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .gallery-image-container {
    position: relative;
    max-width: 90vw;
    max-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .gallery-image-container img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: 8px;
  }
  
  .gallery-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 14px;
  }
  
  .gallery-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 48px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  
  .gallery-nav-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .gallery-nav-btn.prev {
    left: 40px;
  }
  
  .gallery-nav-btn.next {
    right: 40px;
  }
  
  .gallery-thumbnails {
    display: flex;
    gap: 12px;
    margin-top: 30px;
    padding: 20px;
    overflow-x: auto;
    max-width: 90vw;
  }
  
  .gallery-thumbnail {
    width: 100px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.3s;
    flex-shrink: 0;
  }
  
  .gallery-thumbnail:hover {
    border-color: rgba(141, 211, 187, 0.5);
  }
  
  .gallery-thumbnail.active {
    border-color: #8DD3BB;
  }
  
  .gallery-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  .edit-review-btn{
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
  /* 호실 선택 모달 */
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

  .room-selection-modal {
    width: 600px;
    max-width: 90vw;
    max-height: 80vh;
    overflow-y: auto;
  }

  .selected-room-type {
    background: #F5F5F5;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
  }

  .selected-room-type h4 {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 18px;
    color: #112211;
    margin-bottom: 8px;
  }

  .selected-room-type p {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    margin-bottom: 4px;
  }

  .selected-room-type .price-info {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #FF8682;
    margin-top: 8px;
  }

  .room-numbers-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .room-number-btn {
    background: white;
    border: 2px solid #E0E0E0;
    border-radius: 8px;
    padding: 16px 12px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .room-number-btn:hover {
    border-color: #8DD3BB;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .room-number-btn.selected {
    background: #8DD3BB;
    border-color: #8DD3BB;
  }

  .room-num-text {
    font-family: Montserrat;
    font-weight: 600;
    font-size: 16px;
    color: #112211;
  }

  .room-floor-text {
    font-family: Montserrat;
    font-weight: 400;
    font-size: 12px;
    color: #666666;
  }

  .room-number-btn.selected .room-num-text,
  .room-number-btn.selected .room-floor-text {
    color: #112211;
    font-weight: 600;
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
    flex: 1;
  }

  .modal-submit-btn {
    background: #8DD3BB;
    color: #112211;
    border: none;
    border-radius: 4px;
    padding: 12px 24px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
  }

  .modal-submit-btn:disabled {
    background: #E0E0E0;
    color: #999999;
    cursor: not-allowed;
  }

  .modal-submit-btn:not(:disabled):hover {
    background: #7bc4a8;
  }

  /* 내 리뷰 수정 버튼 (초록색) */
  .edit-my-review-btn {
    background: #8DD3BB;
    color: #112211;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .edit-my-review-btn:hover {
    background: #7bc4a8;
  }

  /* 내 리뷰 버튼 그룹 */
  .my-review-buttons {
    display: flex;
    gap: 8px;
  }

  /* 내 리뷰 삭제 버튼 (빨간색) */
  .delete-my-review-btn {
    background: #FF6B6B;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .delete-my-review-btn:hover {
    background: #FF5252;
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