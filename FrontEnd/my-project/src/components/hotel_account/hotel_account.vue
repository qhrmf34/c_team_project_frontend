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
            예약내역
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
          <div class="booking-wrap">
            <div class="booking-list">
              <div 
                v-for="booking in sortedBookings" 
                :key="booking.id" 
                class="booking-card"
              >
                <div class="bc-logo">
                  <img src="/images/hotel_account_img/cvk.jpg" alt="hotel logo">
                </div>
                
                <!-- 날짜 -->
                <div class="bc-dates">
                  <div class="bc-date-section">
                    <div class="label">Check-In</div>
                    <div class="val">{{ booking.checkIn }}</div>
                  </div>
                  <div class="bc-separator"></div>
                  <div class="bc-date-section">
                    <div class="label">Check Out</div>
                    <div class="val">{{ booking.checkOut }}</div>
                  </div>
                  <div class="bc-beeline"></div>
                </div>
                
                <!-- 시간 -->
                <div class="bc-times">
                  <div class="bc-time-info">
                    <img class="time-icon" src="/images/hotel_account_img/check.jpg" alt="check">
                    <div>
                      <div class="label">체크인</div>
                      <div class="val">{{ booking.checkInTime }}</div>
                    </div>
                  </div>
                  <div class="bc-time-info">
                    <img class="time-icon" src="/images/hotel_account_img/check.jpg" alt="check">
                    <div>
                      <div class="label">체크아웃</div>
                      <div class="val">{{ booking.checkOutTime }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- 방번호 -->
                <div class="bc-guest">
                  <div class="bc-time-info">
                    <img class="time-icon" src="/images/hotel_account_img/room.jpg" alt="room">
                    <div>
                      <div class="label">방번호</div>
                      <div class="val">{{ booking.roomNumber }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- 버튼 -->
                <div class="bc-actions">
                  <button class="bc-btn" @click="downloadTicket(booking)">Download Ticket</button>
                  <div class="bc-next" @click="viewBookingDetails(booking)">
                    <img src="/images/hotel_account_img/right.jpg" alt="arrow"/>
                  </div>
                </div>
              </div>
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
  </div>
</template>

<script>
import { authUtils, memberAPI, paymentMethodAPI } from '@/utils/commonAxios'

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
      
      // Booking Data (예시 데이터)
      sortOption: 'upcoming',
      bookings: [
        {
          id: 1,
          checkIn: 'Thur, Dec 8',
          checkOut: 'Fri, Dec 9',
          checkInTime: '12:00pm',
          checkOutTime: '11:30am',
          roomNumber: 'On arrival'
        },
        {
          id: 2,
          checkIn: 'Mon, Dec 12',
          checkOut: 'Wed, Dec 14',
          checkInTime: '3:00pm',
          checkOutTime: '11:00am',
          roomNumber: '201'
        },
        {
          id: 3,
          checkIn: 'Fri, Dec 16',
          checkOut: 'Sun, Dec 18',
          checkInTime: '2:00pm',
          checkOutTime: '12:00pm',
          roomNumber: 'On arrival'
        }
      ],
      
      // Payment Cards - 빈 배열로 초기화 (실제 데이터는 API에서 가져옴)
      paymentCards: [],
      
      // 카드 로딩 상태
      isLoadingCards: false,
      
      // 카드 추가 시 로딩 상태
      isAddingCard: false,
      
      // Modal States
      addCardModalActive: false,
      editModalActive: false,
      passwordModalActive: false,
      
      // New Card Data - cardPassword로 변경
      newCard: {
        number: '',
        expiry: '',
        cardPassword: '', // cvc에서 cardPassword로 변경
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
    },
    
    // 계정 타입 확인
    isLocalAccount() {
      return this.userInfo?.provider === 'local';
    },
    
    isSocialAccount() {
      return ['google', 'kakao', 'naver'].includes(this.userInfo?.provider);
    },
    
    // 실제 사용자 정보 표시
    displayUserInfo() {
      if (!this.actualUserInfo) return {};
      
      const info = {
        name: this.actualUserInfo.firstName || '',
        email: this.actualUserInfo.email || '',
        phone: this.actualUserInfo.phoneNumber || '전화번호 없음',
        provider: this.actualUserInfo.provider || 'local'
      };
      
      // local 계정의 경우 firstName + lastName 조합
      if (this.isLocalAccount && this.actualUserInfo.lastName) {
        info.name = `${this.actualUserInfo.firstName} ${this.actualUserInfo.lastName}`;
      }
      
      return info;
    },
    
    // 정렬된 예약 목록
    sortedBookings() {
      const bookings = [...this.bookings];
      switch (this.sortOption) {
        case 'recent':
          return bookings.reverse();
        case 'oldest':
          return bookings;
        case 'hotel':
          return bookings.sort((a, b) => a.hotelName?.localeCompare(b.hotelName) || 0);
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
    await this.loadPaymentMethods(); // 결제수단 로드 추가

    // 쿼리 파라미터로 탭 설정
    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    }
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscapeKey);
  },
  
  // 라우터 변경 시에도 사용자 정보 다시 확인
  watch: {
    '$route'(to) {
      this.loadUserInfo();
      // 쿼리 파라미터가 변경되면 탭도 변경
       if (to.query.tab) {
      this.activeTab = to.query.tab;
    }
    }
  },
  
  methods: {
    // 사용자 정보 로드
    loadUserInfo() {
      this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
      
      if (this.isLoggedIn) {
        this.userInfo = authUtils.getUserInfo();
        console.log('사용자 정보:', this.userInfo);
      } else {
        this.userInfo = null;
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        this.$router.push('/login');
      }
    },
    
    // 서버에서 실제 사용자 프로필 정보 가져오기
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
    //계정에서 결제내역 클릭
    goToPaymentHistory() {
      this.activeTab = 'history';
      this.isDropdownActive = false; 
    },

    // 결제수단 목록 로드
    async loadPaymentMethods() {
    if (!this.isLoggedIn) return;
    
    try {
      this.isLoadingCards = true;
      const response = await paymentMethodAPI.getMyPaymentMethods();
      
      if (response && response.data) {
        // 서버에서 받은 데이터를 화면용 형식으로 변환
        this.paymentCards = response.data.map(card => ({
          id: card.id,
          lastFour: card.cardLastFour || '****', // 서버에서 직접 제공하는 마지막 4자리
          expiryDate: '**/**', // 보안상 숨김
          cardCompany: card.cardCompany || '카드사', // 카드사 정보
          cardType: card.cardType || 'VISA', // 카드 타입 (VISA, MasterCard 등)
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
    // 카드 타입에 따른 이미지 반환
    getCardImage(cardType) {
      return paymentMethodAPI.getCardTypeImage(cardType);
    },
    getKoreanCardCompany(cardCompany) {
      return paymentMethodAPI.getKoreanCardCompany(cardCompany);
    },

    
    // Dropdown Methods
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
    
    // 로그아웃 처리
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
    
    // 계정 페이지로 이동 (이미 계정 페이지이므로 아무것도 하지 않음)
    goToAccount() {
      // 이미 계정 페이지임
    },
    
    // 호텔 페이지로 이동
    goToHotel() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelone');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    
    // 찜목록 페이지로 이동
    goToFavourites() {
      if (this.isLoggedIn) {
        this.$router.push('/hotelsix');
      } else {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
      }
    },
    
    // Image Upload Methods
    handleCoverImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.coverImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    
    handleAvatarImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileAvatar = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    
    // Edit Modal Methods (수정됨)
    openEditModal(type) {
      // 소셜 로그인 계정의 경우 이름 변경 불가
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
    
    // 정보 수정 저장 (서버 API 연동)
    async saveEdit() {
      if (!this.editValue.trim()) {
        alert('값을 입력해주세요.');
        return;
      }
      
      try {
        const updateData = {};
        
        // 타입별로 업데이트 데이터 설정
        switch (this.editType) {
          case 'name':
            // local 계정의 경우 이름을 firstName, lastName으로 분리
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
        
        // 서버에 업데이트 요청
        const response = await memberAPI.updateProfile(updateData);
        
        if (response && response.data) {
          // 성공 시 실제 사용자 정보 다시 로드
          await this.loadUserProfile();
          
          // localStorage 정보도 업데이트 (필요한 경우)
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
    
    // Password Modal Methods (local 계정만 가능)
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
          // 비밀번호 확인 성공 - 2단계로 이동
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
          // 서버 API 호출하여 토큰을 블랙리스트에 등록
          await authUtils.logout();
          
          // 사용자 정보 다시 로드
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

    // Payment Card Methods - 실제 API 연동
    openAddCardModal() {
      this.addCardModalActive = true;
      this.resetNewCard();
    },
    
    closeAddCardModal() {
      this.addCardModalActive = false;
      this.resetNewCard();
    },

    // 카드 추가 처리 - 실제 API 연동
    async addNewCard() {
      if (!this.validateCardForm()) return;
      
      try {
        this.isAddingCard = true;
        
        // 프론트엔드 데이터를 서버 형식으로 변환 (이메일 제거)
        const cardData = {
          cardNumber: this.newCard.number.replace(/\s/g, ''), // 공백 제거
          cardExpirationMonth: this.newCard.expiry.split('/')[0],
          cardExpirationYear: this.newCard.expiry.split('/')[1],
          cardPassword: this.newCard.cardPassword, // 카드 비밀번호 앞 2자리
          customerName: this.newCard.name
        };

        // 서버에 카드 등록 요청
        const response = await paymentMethodAPI.registerPaymentMethod(cardData);
        
        if (response && response.data) {
          // 성공 시 카드 목록 다시 로드
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

    // 카드 삭제 - 실제 API 연동
    async deleteCard(cardId) {
      if (!confirm('정말로 이 카드를 삭제하시겠습니까?')) {
        return;
      }

      try {
        const response = await paymentMethodAPI.deletePaymentMethod(cardId);
        
        if (response) {
          // 성공 시 카드 목록 다시 로드
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

    // 카드 정보 유효성 검사 강화 (수정됨)
    validateCardForm() {
      // API 서비스의 유효성 검사 사용 (cardPassword로 변경)
      const validation = paymentMethodAPI.validateCardInfo({
        cardNumber: this.newCard.number,
        expiry: this.newCard.expiry,
        cardPassword: this.newCard.cardPassword, // 파라미터명 통일
        name: this.newCard.name
      });

      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        return false;
      }

      return true;
    },
    
    // 새 카드 데이터 초기화
    resetNewCard() {
      this.newCard = {
        number: '',
        expiry: '',
        cardPassword: '', // cvc에서 cardPassword로 변경
        name: '',
        country: 'KR', // 한국으로 기본값 설정
        saveInfo: false
      };
    },
    
    // 카드 번호 포맷팅 개선
    formatCardNumber() {
      this.newCard.number = paymentMethodAPI.formatCardNumber(this.newCard.number);
    },

    // 만료일 포맷팅 개선  
    formatExpiryDate() {
      this.newCard.expiry = paymentMethodAPI.formatExpiryDate(this.newCard.expiry);
    },

    // 카드 비밀번호 입력 제한 (2자리)
    formatCardPassword() {
      this.newCard.cardPassword = this.newCard.cardPassword.replace(/\D/g, '').substring(0, 2);
    },

    // 카드 소유자명 포맷팅 (숫자 제거)
    formatCardName() {
      this.newCard.name = this.newCard.name.replace(/[0-9]/g, '');
    },
    
    // Booking Methods
    downloadTicket(booking) {
      console.log('Downloading ticket for booking:', booking.id);
      alert('티켓 다운로드가 시작됩니다.');
    },
    
    viewBookingDetails(booking) {
      console.log('Viewing details for booking:', booking.id);
    },
    
    // Newsletter Methods
    subscribe() {
      if (!this.newsletterEmail) {
        alert('이메일을 입력해주세요.');
        return;
      }
      
      console.log('Subscribed:', this.newsletterEmail);
      this.newsletterEmail = '';
      alert('구독이 완료되었습니다.');
    },
    
    // Utility Methods
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
/* ==================== 기본 설정 ==================== */
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
  text-align: left;
  margin-right: -30px;
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
</style>