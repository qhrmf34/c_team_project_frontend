<template>
  <div class="hotel-account-container">
    <!-- Header -->
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
            <div class="user-avatar" :style="{ backgroundImage: `url(${profileAvatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
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

    <!-- User Dropdown -->
    <div class="user-dropdown" :class="{ active: isDropdownActive }" ref="userDropdown">
      <!-- 로그인된 경우 -->
      <template v-if="isLoggedIn">
        <div class="dropdown-header">
        <div class="dropdown-avatar" :style="{ backgroundImage: `url(${profileAvatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>          
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


    <!-- Hidden File Inputs -->
    <input 
      type="file" 
      ref="coverImageInput" 
      class="file-input" 
      accept="image/*" 
      @change="handleCoverImageChange"
    >
    <input 
      type="file" 
      ref="avatarImageInput" 
      class="file-input" 
      accept="image/*" 
      @change="handleAvatarImageChange"
    >

    <main class="container">
      <!-- Cover Section -->
      <section class="cover">
        <img :src="coverImage" alt="커버 이미지" class="cover-img"/>
        <button class="upload" @click="$refs.coverImageInput.click()">
          <img src="/images/hotel_account_img/file-upload.jpg" alt="upload">
          Upload new cover
        </button>
      </section>

      <!-- Profile Section -->
      <section class="profile">
        <div class="avatar-container">
          <img class="avatar" :src="profileAvatar" alt="프로필" />
          <div class="avatar-edit" @click="$refs.avatarImageInput.click()">
            <img src="/images/hotel_account_img/pencil.jpg" alt="edit">
          </div>
        </div>
        <h2 class="name">{{ displayUserName }}</h2>
        <div class="email">{{ displayUserInfo.email || '이메일 정보 없음' }}</div>
      </section>

      <!-- Tabs -->
      <div class="tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'account' }" 
          @click="activeTab = 'account'"
        >
          계정
        </div>
        <div class="tab-beeline"></div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'history' }" 
          @click="activeTab = 'history'"
        >
          내역
        </div>
        <div class="tab-beeline"></div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'payments' }" 
          @click="activeTab = 'payments'"
        >
          결제수단
        </div>
      </div>

      <!-- Tab Panels -->
      <div class="panels">
        <!-- Account Panel -->
        <section v-show="activeTab === 'account'" class="panel">
          <div v-if="isLoading" class="loading-message">
            <p>사용자 정보를 불러오는 중...</p>
          </div>
          
          <div v-else>
            <h2 class="account-title">Account</h2>
            <section class="card">
              <div class="content-body">
                <!-- 이름 -->
                <div class="row">
                  <div>
                    <div class="meta">Name</div>
                    <div class="value">{{ displayUserInfo.name || '이름 없음' }}</div>
                  </div>
                  <button 
                    class="btn" 
                    @click="openEditModal('name')"
                    :disabled="isSocialAccount"
                    :class="{ 'btn-disabled': isSocialAccount }"
                    :title="isSocialAccount ? '소셜 로그인 계정은 이름을 변경할 수 없습니다.' : ''"
                  >
                    {{ isSocialAccount ? 'Social Account' : 'Change' }}
                  </button>
                </div>

                <!-- 이메일 -->
                <div class="row">
                  <div>
                    <div class="meta">Email</div>
                    <div class="value">{{ displayUserInfo.email || '이메일 없음' }}</div>
                  </div>
                  <button 
                    class="btn" 
                    @click="openEditModal('email')"
                    :disabled="isSocialAccount"
                    :class="{ 'btn-disabled': isSocialAccount }"
                    :title="isSocialAccount ? '소셜 로그인 계정은 이메일을 변경할 수 없습니다.' : ''"
                  >
                    {{ isSocialAccount ? 'Social Account' : 'Change' }}
                  </button>                
                </div>

                <!-- 비밀번호 (로컬 계정만 표시) -->
                <div class="row" v-if="isLocalAccount">
                  <div>
                    <div class="meta">Password</div>
                    <div class="value">************</div>
                  </div>
                  <button class="btn" @click="openPasswordModal">Change</button>
                </div>

                <!-- 소셜 로그인 정보 표시 (소셜 계정만) -->
                <div class="row" v-if="isSocialAccount">
                  <div>
                    <div class="meta">Login Provider</div>
                    <div class="value">{{ userStatus }}</div>
                  </div>
                  <span class="btn-disabled" title="소셜 로그인 계정입니다">Social Account</span>
                </div>

                <!-- 전화번호 -->
                <div class="row" v-if="isLocalAccount">
                  <div>
                    <div class="meta">Phone number</div>
                    <div class="value">{{ displayUserInfo.phone || '전화번호 없음' }}</div>
                  </div>
                  <button class="btn" @click="openEditModal('phone')">Change</button>
                </div>
              </div>
            </section>
          </div>
        </section>

        <!-- History Panel -->
        <section v-show="activeTab === 'history'" class="panel">
          <div class="booking-title">
            결제내역
            <div class="sort-container">
              <div class="custom-select-wrapper">
                <select class="sort-select" v-model="sortOption">
                  <option value="upcoming">Upcoming</option>
                  <option value="recent">Date: Recent First</option>
                  <option value="oldest">Date: Oldest First</option>
                  <option value="hotel">Hotel Name</option>
                </select>
                <span class="select-arrow">∨</span>
              </div>
            </div>
          </div>
          <div class="booking-sub">
            <img src="/images/hotel_account_img/bedroom.jpg" alt="bedroom"/>
            객실
          </div>


        <!-- ✅ 로딩 상태 -->
        <div v-if="isLoadingReservations" class="loading-message">
          <p>예약 내역을 불러오는 중...</p>
        </div>

        <!-- ✅ 예약 내역이 없을 때 -->
        <div v-else-if="bookings.length === 0" class="empty-message">
          <p>예약 내역이 없습니다.</p>
        </div>

        <!-- ✅ 예약 목록 -->
        <div v-else class="booking-wrap">
          <div class="booking-list">
            <div 
              v-for="booking in sortedBookings" 
              :key="booking.reservationId" 
              class="booking-card"
            >
            
              <div class="bc-logo">
                <img :src="getImageUrl(booking.hotelImage)" alt="hotel logo">
              </div>

              <!-- 날짜 -->
              <div class="bc-dates">
                <div class="bc-date-section">
                  <div class="label">Check-In</div>
                  <div class="val">{{ formatBookingDate(booking.checkInDate) }}</div>
                </div>
                <div class="bc-separator"></div>
                <div class="bc-date-section">
                  <div class="label">Check Out</div>
                  <div class="val">{{ formatBookingDate(booking.checkOutDate) }}</div>
                </div>
                <div class="bc-beeline"></div>
              </div>

              <!-- 시간 -->
              <div class="bc-times">
                <div class="bc-time-info">
                  <img class="time-icon" src="/images/hotel_account_img/check.jpg" alt="check">
                  <div>
                    <div class="label">체크인</div>
                    <div class="val">{{formatBookingTime(booking.checkinTime)}}</div>
                  </div>
                </div>
                <div class="bc-time-info">
                  <img class="time-icon" src="/images/hotel_account_img/check.jpg" alt="check">
                  <div>
                    <div class="label">체크아웃</div>
                    <div class="val">{{formatBookingTime(booking.checkoutTime)}}</div>
                  </div>
                </div>
              </div>

              <!-- 방번호 -->
              <div class="bc-guest">
                <div class="bc-time-info">
                  <img class="time-icon" src="/images/hotel_account_img/room.jpg" alt="room">
                  <div>
                    <div class="label">방번호</div>
                    <div class="val">{{ booking.roomNumber || 'On arrival' }}</div>
                  </div>
                </div>
              </div>
              <!-- 버튼 -->
              <div class="bc-actions">
                <button 
                  class="bc-btn" 
                  @click="downloadTicket(booking)"
                  :disabled="!canDownloadTicket(booking)"
                  :title="getDownloadButtonTitle(booking)"
                >
                  Download Ticket
                </button>
                <div class="bc-next" @click="viewBookingDetails(booking)">
                  <img src="/images/hotel_account_img/right.jpg" alt="arrow"/>
                </div>
              </div>
            </div>
          </div>

          <!-- ✅ 페이지네이션 -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="loadPreviousPage" 
              :disabled="currentPage === 0"
              class="pagination-btn"
            >
              이전
            </button>
            <span class="pagination-info">
              {{ currentPage + 1 }} / {{ totalPages }}
            </span>
            <button 
              @click="loadNextPage" 
              :disabled="currentPage >= totalPages - 1"
              class="pagination-btn"
            >
              다음
            </button>
          </div>
        </div>
      </section>

        <!-- Payments Panel -->
        <section v-show="activeTab === 'payments'" class="panel">
          <div class="payment-title">결제수단</div>
          
          <section class="billing">
            <!-- 로딩 상태 -->
            <div v-if="isLoadingCards" class="loading-message">
              <p>결제수단을 불러오는 중...</p>
            </div>
            
            <div v-else class="grid">
              <!-- 실제 카드들 -->
              <!-- 기존 템플릿의 카드 표시 부분을 다음과 같이 수정 -->
              <div 
                v-for="card in paymentCards" 
                :key="card.id" 
                class="credit-card"
              >
                <div class="cc-top">
                  <div>
                    <div class="cc-star">**** **** ****</div>
                    <!-- 실제 카드번호 마지막 4자리 표시 -->
                    <div class="cc-number">{{ card.lastFour }}</div>
                  </div>
                  <div class="cc-delete" @click="deleteCard(card.id)">
                    <img src="/images/hotel_account_img/garbage.jpg" alt="delete"/>
                  </div>
                </div>
                <div class="cc-bottom">
                  <div class="cc-valid">
                    <div class="cc-meta">{{ getKoreanCardCompany(card.cardCompany) }}</div>
                    <div class="cc-meta-bold">{{ card.expiryDate }}</div>
                  </div>
                  <div class="cc-brand">
                    <!-- 동적으로 카드 타입에 맞는 이미지 표시 -->
                    <img :src="getCardImage(card.cardType)" :alt="card.cardType"/>
                  </div>
                </div>
              </div>
              
              <!-- 카드 추가 버튼 -->
              <div class="add-card" @click="openAddCardModal">
                <div class="plus">+</div>
                <div class="new-card">Add a new card</div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>

    <!-- Add Card Modal -->
    <div class="card-modal" :class="{ active: addCardModalActive }">
      <div class="modal-full">
        <div class="modal-content">
          <div class="modal-header">
            <button class="close-btn" @click="closeAddCardModal">&times;</button>
          </div>
          <div class="modal-card">
            <div class="modal-title">카드추가</div>
            
            <form @submit.prevent="addNewCard">
              <!-- Card Number -->
              <div class="form-group card-number-group">
                <label class="form-label">Card Number</label>
                <div class="card-input-wrapper">
                  <input
                    type="text"
                    class="form-input"
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    v-model="newCard.number"
                    @input="formatCardNumber"
                  />
                  <img src="/images/hotel_img/visa2.jpg" alt="VISA" class="card-logo" />
                </div>
              </div>
              
              <!-- Exp & Card Password -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Exp. Date</label>
                  <input
                    type="text"
                    class="form-input"
                    placeholder="MM/YY"
                    maxlength="5"
                    v-model="newCard.expiry"
                    @input="formatExpiryDate"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">카드 비밀번호 (앞 2자리)</label>
                  <input
                    type="password"
                    class="form-input"
                    placeholder="12"
                    maxlength="2"
                    v-model="newCard.cardPassword"
                    @input="formatCardPassword"
                  />
                </div>
              </div>
              
              <!-- Name -->
              <div class="form-group">
                <label class="form-label">Name on Card</label>
                <input
                  type="text"
                  class="form-input"
                  placeholder="홍길동"
                  v-model="newCard.name"
                  @input="formatCardName"
                />
              </div>
              
              <!-- Country -->
              <div class="form-group">
                <label class="form-label">Country or Region</label>
                <select class="form-input" v-model="newCard.country">
                  <option value="KR">대한민국</option>
                  <option value="US">United States</option>
                  <option value="JP">Japan</option>
                </select>
              </div>
              
              <!-- Checkbox -->
              <div class="form-group checkbox-group">
                <input type="checkbox" id="saveInfo" v-model="newCard.saveInfo" />
                <label for="saveInfo">정보 저장하기</label>
              </div>
              
              <!-- Button -->
              <button 
                type="submit" 
                class="save-card-btn"
                :disabled="isAddingCard"
              >
                {{ isAddingCard ? '등록 중...' : 'Add Card' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal" :class="{ open: editModalActive }">
      <div class="backdrop" @click="closeEditModal"></div>
      <div class="card">
        <button class="close" @click="closeEditModal">&times;</button>
        <h2 class="title">{{ editModalTitle }}</h2>
        
        <form @submit.prevent="saveEdit">
          <div class="field">
            <label class="label">{{ editFieldLabel }}</label>
            <input 
              class="input" 
              :type="editInputType" 
              v-model="editValue" 
              :placeholder="editPlaceholder"
              required
            >
          </div>
          <button class="submit" type="submit">저장</button>
        </form>
      </div>
    </div>

    <!-- Password Modal -->
    <div class="modal" :class="{ open: passwordModalActive }">
      <div class="backdrop" @click="closePasswordModal"></div>
      <div class="card">
        <button class="close" @click="closePasswordModal">&times;</button>
        <h2 class="title">비밀번호 변경</h2>
        
        <!-- Step 1: Verify current password -->
        <div v-if="passwordStep === 1">
          <p style="margin-bottom: 16px; color: #6b7280; font-size: 14px;">
            보안을 위해 현재 비밀번호를 입력해주세요.
          </p>
          <form @submit.prevent="verifyPassword">
            <div class="field">
              <label class="label">현재 비밀번호</label>
              <input 
                class="input" 
                type="password" 
                v-model="currentPassword" 
                placeholder="현재 비밀번호를 입력하세요" 
                required
              >
            </div>
            <button class="submit" type="submit">확인</button>
          </form>
        </div>
        
        <!-- Step 2: Set new password -->
        <div v-if="passwordStep === 2">
          <p style="margin-bottom: 16px; color: #6b7280; font-size: 14px;">
            새로운 비밀번호를 설정해주세요.
          </p>
          <form @submit.prevent="changePassword">
            <div class="field">
              <label class="label">새 비밀번호</label>
              <input 
                class="input" 
                type="password" 
                v-model="newPassword" 
                placeholder="새 비밀번호" 
                required
              >
            </div>
            <div class="field">
              <label class="label">새 비밀번호 확인</label>
              <input 
                class="input" 
                type="password" 
                v-model="confirmPassword" 
                placeholder="새 비밀번호 확인" 
                required
              >
            </div>
            <button class="submit" type="submit">비밀번호 변경</button>
          </form>
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
            <input type="email" class="newsletter-input" placeholder="Your email address" v-model="newsletterEmail">
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
import { authUtils, memberAPI, paymentMethodAPI, memberImageAPI, adminAPI, memberCouponAPI, reservationAPI, ticketAPI } from '@/utils/commonAxios'

export default {
  name: 'HotelAccount',
  data() {
    return {
      isDropdownActive: false,
      // 사용자 정보
      userInfo: null,
      isLoggedIn: false,
      activeTab: 'account',
      coverImage: '/images/hotel_account_img/back.jpg',
      profileAvatar: '/images/hotel_account_img/member.jpg',
      
      // 실제 사용자 정보 (API에서 가져옴)
      actualUserInfo: null,
      
      // Booking Data
      sortOption: 'upcoming',
      bookings: [], // ✅ 중복 제거 - 하나만 남김
      
      // 페이지네이션
      isLoadingReservations: false,
      currentPage: 0,
      pageSize: 3,
      totalCount: 0,
      
      // Payment Cards
      paymentCards: [],
      
      // 카드 로딩 상태
      isLoadingCards: false,
      
      // 카드 추가 시 로딩 상태
      isAddingCard: false,
      
      //쿠폰
      showCouponModal: false,
      receivedCoupons: [],

      // Modal States
      addCardModalActive: false,
      editModalActive: false,
      passwordModalActive: false,
      
      // New Card Data
      newCard: {
        number: '',
        expiry: '',
        cardPassword: '',
        name: '',
        country: 'KR',
        saveInfo: false
      },
      
      // Edit Modal Data
      editType: '',
      editModalTitle: '',
      editFieldLabel: '',
      editPlaceholder: '',
      editInputType: 'text',
      editValue: '',
      
      // Password Modal Data
      passwordStep: 1,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      
      // Newsletter
      newsletterEmail: '',
      
      // 로딩 상태
      isLoading: true
    }
  },
  
  computed: {
    totalPages() {
      // ✅ 0으로 나누기 방지 및 최소 1페이지
      if (this.totalCount === 0) return 1;
      return Math.ceil(this.totalCount / this.pageSize);
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
    },
    
    isLocalAccount() {
      return this.userInfo?.provider === 'local';
    },
    
    isSocialAccount() {
      return ['google', 'kakao', 'naver'].includes(this.userInfo?.provider);
    },
    
    displayUserInfo() {
      if (!this.actualUserInfo) return {};
      
      const info = {
        name: this.actualUserInfo.firstName || '',
        email: this.actualUserInfo.email || '',
        phone: this.actualUserInfo.phoneNumber || '전화번호 없음',
        provider: this.actualUserInfo.provider || 'local'
      };
      
      if (this.isLocalAccount && this.actualUserInfo.lastName) {
        info.name = `${this.actualUserInfo.firstName} ${this.actualUserInfo.lastName}`;
      }
      
      return info;
    },
    
    sortedBookings() {
      const bookings = [...this.bookings];
      switch (this.sortOption) {
        case 'recent':
          return bookings.sort((a, b) => 
            new Date(b.checkInDate) - new Date(a.checkInDate)
          );
        case 'oldest':
          return bookings.sort((a, b) => 
            new Date(a.checkInDate) - new Date(b.checkInDate)
          );
        case 'hotel':
          return bookings.sort((a, b) => 
            a.hotelName.localeCompare(b.hotelName)
          );
        default:
          return bookings;
      }
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('keydown', this.handleEscapeKey);
    await this.loadUserInfo();
    await this.loadUserProfile();
    await this.loadPaymentMethods();
    await this.loadMemberImages();
    await this.loadReservations(); // ✅ 예약 내역 로드
    
    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    }
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscapeKey);
  },
  
  watch: {
    '$route'(to) {
      this.loadUserInfo();
      if (to.query.tab) {
        this.activeTab = to.query.tab;
      }
    }
  },
  
  methods: {
    goToLogin() {
      this.isDropdownActive = false;
      this.$router.push('/login');
    },

    loadUserInfo() {
      this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
      
      if (this.isLoggedIn) {
        this.userInfo = authUtils.getUserInfo();
        console.log('사용자 정보:', this.userInfo);
      } else {
        this.userInfo = null;
        this.$router.push('/login');
      }
    },
    
    async loadUserProfile() {
      if (!this.isLoggedIn) return;
      
      try {
        this.isLoading = true;
        const response = await memberAPI.getProfile();
        
        if (response && response.data) {
          this.actualUserInfo = response.data;
          console.log('실제 사용자 정보:', this.actualUserInfo);
        }
      } catch (error) {
        console.error('프로필 로드 실패:', error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        this.isLoading = false;
      }
    },
    
    async loadMemberImages() {
      if (!this.isLoggedIn) return;

      try {
        const profileResponse = await memberImageAPI.getProfileImage();
        if (profileResponse && profileResponse.data && profileResponse.data.imagePath) {
          this.profileAvatar = this.getImageUrl(profileResponse.data.imagePath);
        }

        const backgroundResponse = await memberImageAPI.getBackgroundImage();
        if (backgroundResponse && backgroundResponse.data && backgroundResponse.data.imagePath) {
          this.coverImage = this.getImageUrl(backgroundResponse.data.imagePath);
        }
      } catch (error) {
        console.error('이미지 로드 실패:', error);
      }
    },
    
    goToPaymentHistory() {
      this.activeTab = 'history';
      this.isDropdownActive = false; 
    },
    // ✅ 티켓 다운로드 가능 여부
    canDownloadTicket(booking) {
      if (!booking.paymentId) return false;
      if (!booking.reservationsStatus) return false;
      if (!booking.hasTicket) return false; // ✅ 티켓 이미지가 없으면 비활성화

      const status = booking.paymentStatus?.toString().toLowerCase();
      return status === 'paid';
    },
  
    // ✅ 버튼 툴팁 메시지
    getDownloadButtonTitle(booking) {
      if (!booking.paymentId) return '결제 정보가 없습니다';
      if (!booking.reservationsStatus) return '예약이 확정되지 않았습니다';
      if (!booking.hasTicket) return '티켓이 아직 생성되지 않았습니다'; // ✅ 추가

      const status = booking.paymentStatus?.toString().toLowerCase();
      if (status === 'refunded') return '환불된 예약입니다';
      if (status === 'failed') return '결제 실패한 예약입니다';
      if (status === 'paid') return '티켓 다운로드';

      return '티켓을 다운로드할 수 없습니다';
    },
    getImageUrl(imagePath) {
      if (!imagePath) {
        return '/images/hotel_img/hotel1.jpg';
      }

      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
      }

      if (imagePath.startsWith('/images/')) {
        return imagePath;
      }

      return adminAPI.getImageUrl(imagePath);
    },
    
    async loadPaymentMethods() {
      if (!this.isLoggedIn) return;
      
      try {
        this.isLoadingCards = true;
        const response = await paymentMethodAPI.getMyPaymentMethods();
        
        if (response && response.data) {
          this.paymentCards = response.data.map(card => ({
            id: card.id,
            lastFour: card.cardLastFour || '****',
            expiryDate: '**/**',
            cardCompany: card.cardCompany || '카드사',
            cardType: card.cardType || 'VISA',
            tossKey: card.tossKey,
            createdAt: card.createdAt
          }));
        }
      } catch (error) {
        console.error('결제수단 로드 실패:', error);
        if (error.response?.status !== 404) {
          alert('결제수단을 불러오는데 실패했습니다.');
        }
      } finally {
        this.isLoadingCards = false;
      }
    },
    
    getCardImage(cardType) {
      return paymentMethodAPI.getCardTypeImage(cardType);
    },
    
    getKoreanCardCompany(cardCompany) {
      return paymentMethodAPI.getKoreanCardCompany(cardCompany);
    },
    
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    handleClickOutside(event) {
      if (this.$refs.userDropdown && 
          !this.$refs.userDropdown.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    },
    
    handleEscapeKey(event) {
      if (event.key === 'Escape') {
        this.closeAllModals();
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
      // 이미 계정 페이지임
    },
    
    goToHotel() {
      this.$router.push('/hotelone');
    },
    
    goToFavourites() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelsix');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    
    async handleCoverImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하만 가능합니다.');
          return;
        }

        const response = await memberImageAPI.uploadBackgroundImage(file);

        if (response && response.data && response.data.imagePath) {
          this.coverImage = this.getImageUrl(response.data.imagePath);
          alert('배경 이미지가 변경되었습니다.');
        }
      } catch (error) {
        console.error('배경 이미지 업로드 실패:', error);
        const errorMessage = error.response?.data?.message || '배경 이미지 업로드에 실패했습니다.';
        alert(errorMessage);
      }
    },
    
    async handleAvatarImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        if (!file.type.startsWith('image/')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB 이하만 가능합니다.');
          return;
        }

        const response = await memberImageAPI.uploadProfileImage(file);

        if (response && response.data && response.data.imagePath) {
          this.profileAvatar = this.getImageUrl(response.data.imagePath);
          alert('프로필 이미지가 변경되었습니다.');
        }
      } catch (error) {
        console.error('프로필 이미지 업로드 실패:', error);
        const errorMessage = error.response?.data?.message || '프로필 이미지 업로드에 실패했습니다.';
        alert(errorMessage);
      }
    },
    
    openEditModal(type) {
      if (this.isSocialAccount) {
        alert('소셜 로그인 계정은 정보를 변경할 수 없습니다.');
        return;
      }
      
      this.editType = type;
      this.editModalActive = true;
      
      const config = {
        name: {
          title: '이름 변경',
          label: '이름',
          placeholder: '이름을 입력하세요',
          type: 'text',
          value: this.displayUserInfo.name
        },
        email: {
          title: '이메일 변경',
          label: '이메일',
          placeholder: '이메일을 입력하세요',
          type: 'email',
          value: this.displayUserInfo.email
        },
        phone: {
          title: '전화번호 변경',
          label: '전화번호',
          placeholder: '전화번호를 입력하세요',
          type: 'tel',
          value: this.displayUserInfo.phone === '전화번호 없음' ? '' : this.displayUserInfo.phone
        }
      };
      
      const currentConfig = config[type];
      if (currentConfig) {
        this.editModalTitle = currentConfig.title;
        this.editFieldLabel = currentConfig.label;
        this.editPlaceholder = currentConfig.placeholder;
        this.editInputType = currentConfig.type;
        this.editValue = currentConfig.value;
      }
    },
    
    closeEditModal() {
      this.editModalActive = false;
      this.resetEditModal();
    },
    
    resetEditModal() {
      this.editType = '';
      this.editValue = '';
    },
    
    async saveEdit() {
      if (!this.editValue.trim()) {
        alert('값을 입력해주세요.');
        return;
      }
      
      try {
        const updateData = {};
        
        switch (this.editType) {
          case 'name':
            if (this.isLocalAccount) {
              const nameParts = this.editValue.trim().split(' ');
              updateData.firstName = nameParts[0];
              updateData.lastName = nameParts.slice(1).join(' ') || '';
            }
            break;
          case 'email':
            updateData.email = this.editValue;
            break;
          case 'phone':
            updateData.phoneNumber = this.editValue;
            break;
        }
        
        const response = await memberAPI.updateProfile(updateData);
        
        if (response && response.data) {
          await this.loadUserProfile();
          
          if (this.editType === 'name' && this.isLocalAccount) {
            const userInfo = authUtils.getUserInfo();
            userInfo.firstName = updateData.firstName;
            userInfo.lastName = updateData.lastName;
            authUtils.saveAuth(authUtils.getToken(), userInfo);
            this.loadUserInfo();
          }
          
          this.closeEditModal();
          alert(`${this.editFieldLabel}이(가) 변경되었습니다.`);
        }
      } catch (error) {
        console.error('정보 수정 실패:', error);
        const serverMessage = error.response?.data?.message || error.message;
        alert(serverMessage);
      }
    },
    
    openPasswordModal() {
      if (this.isSocialAccount) {
        alert('소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.');
        return;
      }
      this.passwordModalActive = true;
      this.passwordStep = 1;
    },
    
    closePasswordModal() {
      this.passwordModalActive = false;
      this.resetPasswordModal();
    },
    
    resetPasswordModal() {
      this.passwordStep = 1;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },
    
    async verifyPassword() {
      if (this.currentPassword.length < 4) {
        alert('비밀번호가 올바르지 않습니다.');
        return;
      }
      try {
        const response = await memberAPI.accountForgot(this.currentPassword);
        
        if (response && response.code === 200) {
          this.passwordStep = 2;
        }
      } catch (error) {
        console.error('비밀번호 확인 실패:', error);
        if (error.response?.status === 400) {
          alert('현재 비밀번호가 일치하지 않습니다.');
        } else if (error.response?.status === 403) {
          alert('소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.');
          this.closePasswordModal();
        } else {
          alert('비밀번호 확인 중 오류가 발생했습니다.');
        }
      }
    },
    
    async changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      
      if (this.newPassword.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
      }
      
      try {
        const response = await memberAPI.accountPasswordReset(
          this.newPassword, 
          this.confirmPassword
        );
        
        if (response && response.code === 200) {
          this.closePasswordModal();
          alert('비밀번호가 성공적으로 변경되었습니다.');
          await authUtils.logout();
          
          this.loadUserInfo();

          this.$router.push('/login');
        }
      } catch (error) {
        console.error('비밀번호 변경 실패:', error);
        if (error.response?.status === 400) {
          alert(error.response.data?.message || '비밀번호 변경 요청이 올바르지 않습니다.');
        } else if (error.response?.status === 403) {
          alert('소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.');
          this.closePasswordModal();
        } else {
          alert('비밀번호 변경 중 오류가 발생했습니다.');
        }
      }
    },

    openAddCardModal() {
      this.addCardModalActive = true;
      this.resetNewCard();
    },
    
    closeAddCardModal() {
      this.addCardModalActive = false;
      this.resetNewCard();
    },

    async addNewCard() {
      if (!this.validateCardForm()) return;
      
      try {
        this.isAddingCard = true;
        
        const cardData = {
          cardNumber: this.newCard.number.replace(/\s/g, ''),
          cardExpirationMonth: this.newCard.expiry.split('/')[0],
          cardExpirationYear: this.newCard.expiry.split('/')[1],
          cardPassword: this.newCard.cardPassword,
          customerName: this.newCard.name
        };

        const response = await paymentMethodAPI.registerPaymentMethod(cardData);
        
        if (response && response.data) {
          await this.loadPaymentMethods();
          this.closeAddCardModal();
          alert('카드가 성공적으로 등록되었습니다.');
        }
        
      } catch (error) {
        console.error('카드 등록 실패:', error);
        
        let errorMessage = '카드 등록에 실패했습니다.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        alert(errorMessage);
      } finally {
        this.isAddingCard = false;
      }
    },

    async deleteCard(cardId) {
      if (!confirm('정말로 이 카드를 삭제하시겠습니까?')) {
        return;
      }

      try {
        const response = await paymentMethodAPI.deletePaymentMethod(cardId);
        
        if (response) {
          await this.loadPaymentMethods();
          alert('카드가 삭제되었습니다.');
        }
        
      } catch (error) {
        console.error('카드 삭제 실패:', error);
        
        let errorMessage = '카드 삭제에 실패했습니다.';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        alert(errorMessage);
      }
    },

    validateCardForm() {
      const validation = paymentMethodAPI.validateCardInfo({
        cardNumber: this.newCard.number,
        expiry: this.newCard.expiry,
        cardPassword: this.newCard.cardPassword,
        name: this.newCard.name
      });

      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return false;
      }

      return true;
    },
    
    resetNewCard() {
      this.newCard = {
        number: '',
        expiry: '',
        cardPassword: '',
        name: '',
        country: 'KR',
        saveInfo: false
      };
    },
    
    formatCardNumber() {
      this.newCard.number = paymentMethodAPI.formatCardNumber(this.newCard.number);
    },

    formatExpiryDate() {
      this.newCard.expiry = paymentMethodAPI.formatExpiryDate(this.newCard.expiry);
    },

    formatCardPassword() {
      this.newCard.cardPassword = this.newCard.cardPassword.replace(/\D/g, '').substring(0, 2);
    },

    formatCardName() {
      this.newCard.name = this.newCard.name.replace(/[0-9]/g, '');
    },
    
    // ✅ 예약 내역 로드
  async loadReservations() {
    if (!this.isLoggedIn) return;
    
    try {
      this.isLoadingReservations = true;
      
      const response = await reservationAPI.getMyReservationHistory({
        offset: this.currentPage * this.pageSize,
        size: this.pageSize
      });
      
      if (response && response.data) {
        this.bookings = response.data.reservations || [];
        this.totalCount = response.data.totalCount || 0;
        
        // ✅ 빈 페이지 체크: 데이터가 없고 첫 페이지가 아니면 이전 페이지로
        if (this.bookings.length === 0 && this.currentPage > 0) {
          this.currentPage--;
          await this.loadReservations();
        }
      }
      
    } catch (error) {
      console.error('결제 내역 로드 실패:', error);
      alert('결제 내역을 불러오는데 실패했습니다.');
    } finally {
      this.isLoadingReservations = false;
    }
  },
  
    
    // ✅ 다음 페이지 (데이터 있을 때만)
    async loadNextPage() {
      const maxPage = Math.ceil(this.totalCount / this.pageSize) - 1;
      if (this.currentPage < maxPage) {
        this.currentPage++;
        await this.loadReservations();
      }
    },

    // ✅ 이전 페이지
    async loadPreviousPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
        await this.loadReservations();
      }
    },

    
    formatBookingDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    },
    formatBookingTime(time) {
      if (!time) return '12:00pm';
    
      const [hourStr, minuteStr] = time.split(':');
      let hour = parseInt(hourStr);
      const minute = minuteStr || '00';
      const suffix = hour >= 12 ? 'pm' : 'am';
    
      if (hour === 0) hour = 12;       // 00시 → 12am
      else if (hour > 12) hour -= 12;  // 13~23시 → 1~11pm
    
      const formattedHour = hour.toString().padStart(2, '0');
      return `${formattedHour}:${minute}${suffix}`;
    },
    
    // ✅ 티켓 다운로드 (adminAPI 사용)
    async downloadTicket(booking) {
      console.log('다운로드 시도:', booking);
      
      if (!booking.paymentId) {
        alert('결제 정보가 없습니다.');
        return;
      }
      
      try {
        const response = await ticketAPI.getTicketByPaymentId(booking.paymentId);
        
        console.log('티켓 응답:', response);
        
        if (response.code === 200 && response.data.ticketImagePath) {
          const imageUrl = adminAPI.getImageUrl(response.data.ticketImagePath);
          
          const imageResponse = await fetch(imageUrl);
          const blob = await imageResponse.blob();
          
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `ticket_${response.data.barcode}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          
          console.log('✅ 티켓 다운로드 완료');
        } else {
          alert('티켓 이미지를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('티켓 다운로드 실패:', error);
        alert('티켓 다운로드에 실패했습니다.');
      }
    },
    
    // ✅ 티켓 상세 보기 (중복 제거)
    viewBookingDetails(booking) {
      if (!booking.paymentId) {
        alert('결제 정보가 없습니다.');
        return;
      }
      
      this.$router.push({
        path: '/hotelfive',
        query: { paymentId: booking.paymentId }
      });
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
          this.newsletterEmail = ''
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
    
    closeAllModals() {
      this.addCardModalActive = false;
      this.editModalActive = false;
      this.passwordModalActive = false;
      this.isDropdownActive = false;
      this.resetNewCard();
      this.resetEditModal();
      this.resetPasswordModal();
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

  .hotel-account-container {
    font-family: 'Montserrat', system-ui, -apple-system, "Noto Sans KR", Arial, sans-serif;
    color: #112211;
    background: #FAFBFC;
    min-width: 1440px;
    max-width: 1440px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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

  /* ==================== 메인 컨테이너 ==================== */
  .container {
    max-width: 1232px;
    width: 1232px;
    margin: 0 auto 80px;
    padding: 0;
  }

  /* ==================== 커버 이미지 ==================== */
  .cover {
    width: 100%;
    height: 350px;
    angle: 0 deg;
    opacity: 1;
    margin-top: 150px;
    display: flex;
    position: relative;
    border-radius: 12px;
  }

  .cover-img {
    width: 100%;
    height: 100%;
    z-index: 0;
    border-radius: 12px;
    object-fit: cover;
  }

  .upload {
    position: absolute;
    top: 270px;
    right: 20px;
    width: 180px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 4px solid #8DD3BB;
    border-radius: 4px;
    background: #8DD3BB;
    cursor: pointer;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 14px;
    color: #112211;
    z-index: 1;
  }

  .upload img {
    width: 16px;
    height: 13.013124465942383px;
    angle: 0 deg;
    opacity: 1;
    top: 1.49px;
    border-width: 0.05px;
  }

  .upload:hover {
    background: #7cc5a8;
    border-color: #7cc5a8;
  }

  /* ==================== 프로필 섹션 ==================== */
  .profile {
    margin-top: -58px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .profile .avatar-container {
    position: relative;
    display: inline-block;
  }

  .profile .avatar {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #FF8682;
    box-shadow: 0 10px 30px rgba(17, 34, 17, 0.08);
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 10;
  }

  .avatar-edit {
    position: absolute;
    width: 44px;
    height: 44px;
    left: 80px;
    bottom: 0px;
    gap: 10px;
    angle: 0 deg;
    opacity: 1;
    border-radius: 45px;
    background: #FF8682;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 11;
  }

  .avatar-edit img {
    width: 17.437562942504883px;
    height: 17.437328338623047px;
    angle: 0 deg;
    opacity: 1;
    top: 3.28px;
    left: 3.28px;
    border-width: 2.06px;
  }

  .avatar-edit:hover {
    background: #7cc5a8;
  }

  .name {
    margin-top: 10px;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 24px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
  }

  .email {
    padding-top: 10px;
    font-family: Montserrat;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    color: #112211;
  }

  /* ==================== 탭 메뉴 ==================== */
  .tabs {
    width: 1232px;
    height: 80px;
    margin: 24px auto 0;
    display: flex;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(17, 34, 17, 0.05);
    overflow: hidden;
  }

  .tab {
    flex: 1;
    padding: 16px 24px;
    text-align: left;
    font-weight: 600;
    font-size: 16px;
    color: #6b7280;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    background: transparent;
    position: relative;
    transition: all 0.3s ease;
  }

  /* 탭 사이 구분선 */
  .tab-beeline {
    width: 0px;
    height: 48.00000000000004px;
    angle: -90 deg;
    opacity: 1;
    border-width: 1px;
    border: 1px solid #D7E2EE;
    margin-top: 16px;
  }

  .tab:hover {
    color: #112211;
    background: #f9f9f9;
  }

  /* 클릭(활성) 상태일 때 밑줄 */
  .tab.active {
    color: #112211;
  }

  .tab.active::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 20px;
    width: 215px;
    height: 0px;
    border: 4px solid #8DD3BB;
  }

  /* ==================== 패널 시스템 ==================== */
  .panels .panel {
    margin-bottom: 100px;
  }

  /* ==================== Account 섹션 ==================== */
  .account-title {
    font-family: Acme;
    font-weight: 400;
    font-style: Regular;
    font-size: 32px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
    margin: 32px 0 24px;
    text-align: left;
  }

  /* ==================== 카드 컴포넌트 ==================== */
  .card {
    max-width: 1232px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(17, 34, 17, 0.05);
    margin-bottom: 50px;
  }

  .payment-title {
    width: 130px;
    height: 41px;
    angle: 0 deg;
    opacity: 1;
    font-family: Acme;
    font-weight: 400;
    font-style: Regular;
    font-size: 32px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    margin: 32px 0 24px;
  }

  .content-body {
    width: 1232px;
    height: auto;
    angle: 0 deg;
    opacity: 1;
    border-radius: 16px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 8px 8px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 24px;
    border-top: 1px solid #e5e7eb;
  }

  .row:first-child {
    border-top: 0;
  }

  .meta {
    font-family: Montserrat;
    font-weight: 400;
    font-style: Regular;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
    margin-bottom: 8px;
  }

  .value {
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 20px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
  }

  .btn {
    padding: 10px 14px;
    border-radius: 999px;
    background: #ecfdf5;
    border: 1px solid #bbf7d0;
    color: #065f46;
    font-weight: 700;
    font-size: 12px;
    cursor: pointer;
  }

  /* ==================== 예약내역 스타일 ==================== */
  .booking-wrap {
    max-width: 1232px;
    height: auto;
    margin-bottom: 100px;
  }

  .booking-title {
    font-family: Noto Sans;
    font-weight: 900;
    font-style: Display Black;
    font-size: 32px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    margin: 32px 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sort-container {
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .custom-select-wrapper {
    position: relative;
  }

  .sort-select {
    appearance: none;
    border: none;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 14px;
    leading-trim: NONE;
    line-height: normal;
    letter-spacing: 0%;
    text-align: right;
    margin-right: 15px;
    background: transparent;
    cursor: pointer;
  }

  .select-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 14px;
    color: #112211;
    right: 1px;
    top: 22px;
  }

  .booking-sub {
    width: 1232px;
    height: 56px;
    border-radius: 12px;
    padding: 16px 24px;
    gap: 12px;
    angle: 0 deg;
    opacity: 1;
    display: flex;
    align-items: center;
    color: #111827;
    margin-bottom: 12px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px #1122110D;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
  }

  .booking-sub img {
    width: 21px;
    height: 16.5px;
    angle: 0 deg;
    opacity: 1;
    top: 3.75px;
  }

  .booking-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .booking-card {
    width: 1232px;
    height: 144px;
    border-radius: 16px;
    padding: 32px 24px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px #1122110D;
    display: grid;
    grid-template-columns: 80px 1fr 1fr 1fr auto;
    align-items: center;
    gap: 16px;
  }

  /* 로고 */
  .bc-logo {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    border: 0.5px solid #8DD3BB;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .bc-logo img {
    width: 70px;
    height: 70px;
  }

  /* 날짜 */
  .bc-dates {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .bc-date-section .label {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .bc-date-section .val {
    width: 98px;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
  }

  .bc-separator {
    width: 20px;
    height: 0px;
    angle: 0 deg;
    opacity: 1;
    border: 1px solid black;
  }

  .bc-beeline {
    width: 0px;
    height: 48.00000000000004px;
    angle: -90 deg;
    opacity: 1;
    border-width: 1px;
    border: 1px solid #D7E2EE;
  }

  /* 시간 */
  .bc-times {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .bc-time-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .bc-time-info .label {
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
  }

  .bc-time-info .val {
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #111827;
  }

  .bc-guest {
    height: 100%;
    display: flex;
    align-items: flex-start;
  }

  .time-icon {
    width: 32px;
    height: 32px;
    angle: 0 deg;
    opacity: 1;
    border-radius: 4px;
  }

  /* 버튼 */
  .bc-actions {
    width: 216px;
    height: 48px;
    angle: 0 deg;
    opacity: 1;
    gap: 16px;
    display: flex;
  }

  .bc-btn {
    width: 152px;
    height: 100%;
    angle: 0 deg;
    opacity: 1;
    gap: 4px;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    background: #8DD3BB;
    border: none;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
  }

  .bc-next {
    width: 48px;
    height: 100%;
    angle: 0 deg;
    opacity: 1;
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid #8DD3BB;
    border-radius: 4px;
  }

  .bc-next img {
    width: 4.5px;
    height: 9px;
    angle: 0 deg;
    opacity: 1;
    top: 3.5px;
    left: 6px;
    border-width: 1.5px;
  }

  .bc-next:hover {
    background-color: #8DD3BB;
  }

  /* ==================== 결제수단 스타일 ==================== */
  .billing {
    max-width: 1232px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(17, 34, 17, 0.05);
  }

  .billing .head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 800;
    font-size: 20px;
  }

  /* ==================== 그리드 ==================== */
  .billing .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 378px);
    grid-auto-rows: 212px;
    gap: 16px;
    padding: 24px;
  }

  /* ==================== 신용카드 ==================== */
  .credit-card {
    width: 378px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-self: center;
    padding: 20px;
    border-radius: 16px;
    background: #8DD3BB;
  }

  .cc-top {
    width: 346px;
    height: 61.5px;
    angle: 0 deg;
    opacity: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cc-number {
    width: 71px;
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
    vertical-align: middle;
    color: #112211;
  }

  .cc-star {
    width: 200px;
    height: 29px;
    angle: 0 deg;
    opacity: 1;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 24px;
    leading-trim: NONE;
    letter-spacing: 0%;
  }

  .cc-bottom {
    width: 346px;
    height: 61.5px;
    angle: 0 deg;
    opacity: 1;
    gap: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .cc-meta {
    width: 62px;
    height: 15px;
    angle: 0 deg;
    opacity: 1;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #112211;
  }

  .cc-meta-bold {
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 20px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
    color: #112211;
  }

  .cc-brand {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cc-brand img {
    width: 51.77358627319336px;
    height: 32.51381301879883px;
    angle: 0 deg;
    opacity: 1;
  }

  /* 삭제 버튼 */
  .cc-delete {
    align-self: flex-start;
  }

  .cc-delete img {
    width: 24px;
    height: 24px;
    angle: 0 deg;
    opacity: 1;
    cursor: pointer;
  }

  /* ==================== 카드 추가 버튼 ==================== */
  .add-card {
    width: 378px;
    height: 212px;
    gap: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    align-self: center;
    border-radius: 16px;
    background: #fff;
    border-radius: 16px;
    border-width: 2px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px dashed #8DD3BB;
  }

  .add-card:hover {
    background: #f3f4f6;
  }

  .add-card .plus {
    width: 48px;
    height: 48px;
    angle: 0 deg;
    opacity: 1;
    top: 8px;
    left: 8px;
    border: 2px solid #8DD3BB;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    font-weight: 100;
    color: #8DD3BB;
    padding-bottom: 8px;
  }

  .new-card {
    width: 96px;
    height: 15px;
    angle: 0 deg;
    opacity: 0.75;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
  }

  /* ==================== 파일 입력 스타일 ==================== */
  .file-input {
    display: none;
  }

  /* ==================== 모달 스타일 ==================== */
  .modal {
    position: fixed;
    inset: 0;
    display: none;
    z-index: 3000;
  }

  .modal.open {
    display: block;
  }

  .modal .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: saturate(120%) blur(2px);
  }

  .modal .card {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 640px;
    max-width: calc(100% - 40px);
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.20);
    padding: 28px;
  }

  .modal .title {
    font-size: 28px;
    font-weight: 900;
    margin-bottom: 18px;
  }

  .modal .close {
    position: absolute;
    right: 18px;
    top: 14px;
    font-size: 20px;
    line-height: 1;
    background: transparent;
    border: 0;
    cursor: pointer;
    color: #111827;
    opacity: 0.7;
  }

  .modal form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /*카드 모달*/
  .card-modal {
    display: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
  }

  .card-modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-full {
    width: 640px;
    height: 686.2418823242188px;
    border-radius: 12px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    width: 512px;
    height: 590px;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    overflow-y: auto;
  }

  /* Header */
  .modal-header {
    display: flex;
    justify-content: flex-end;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  /* Title */
  .modal-title {
    font-family: Noto Sans, sans-serif;
    font-weight: 700;
    font-size: 32px;
    margin: 16px 0 24px;
    color: #112211;
  }

  /* Form */
  .form-group {
    margin-bottom: 20px;
    position: relative;
  }

  .form-label {
    position: absolute;
    top: -8px;
    left: 12px;
    background: #FFFFFF;
    padding: 0 4px;
    font-family: Montserrat, sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #112211;
    z-index: 1;
  }

  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    box-sizing: border-box;
  }

  .form-row {
    display: flex;
    gap: 16px;
  }

  .form-row .form-group {
    flex: 1;
  }

  /* Card Number + VISA */
  .card-input-wrapper {
    position: relative;
  }

  .card-input-wrapper input {
    padding-right: 50px;
    height: 56px;
  }

  .card-logo {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    height: 20px;
  }

  /* Checkbox */
  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    color: #112211;
    margin-bottom: 20px;
    padding-left: 0;
  }

  .checkbox-group label {
    position: static;
    background: none;
    padding: 0;
  }

  /* Button */
  .save-card-btn {
    width: 100%;
    height: 48px;
    padding: 8px 16px;
    gap: 4px;
    background: #8dd3bb;
    border: none;
    border-radius: 4px;
    font-family: Montserrat, sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #112211;
    cursor: pointer;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
  }

  /* ==================== 폼 요소 스타일 ==================== */
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .label {
    font-size: 13px;
    color: #374151;
    padding-bottom: 3px;
  }

  .input,
  .select {
    height: 44px;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    background: #ffffff;
  }

  .input:focus,
  .select:focus {
    border-color: #86efac;
    box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.35);
  }

  .submit {
    height: 44px;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    background: #A7DCC6;
    font-weight: 700;
    color: #0f3f2e;
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
  /* 비활성화된 버튼 스타일 */
  .btn-disabled {
    padding: 10px 14px;
    border-radius: 999px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    color: #6b7280;
    font-weight: 700;
    font-size: 12px;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .btn:disabled {
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* 로딩 메시지 */
  .loading-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-family: Montserrat;
    font-size: 16px;
    color: #6b7280;
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

  /* 페이지네이션 스타일 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
    padding: 20px 0;
  }

  .pagination-btn {
    padding: 10px 20px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .pagination-btn:hover:not(:disabled) {
    background: #FF8682;
    color: white;
    border-color: #FF8682;
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-info {
    font-size: 16px;
    color: #333;
  }

  .empty-message {
    text-align: center;
    padding: 60px 20px;
    color: #666;
  }

  .loading-message {
    text-align: center;
    padding: 60px 20px;
    color: #666;
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