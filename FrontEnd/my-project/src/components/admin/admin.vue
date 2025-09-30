<template>
  <div class="admin-container">
    <!-- Header -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item" @click="goToHotel">
            <span><img src="/images/hotel_img/hotel.jpg" alt="Hotel"></span>
            Hotels
          </a>
        </div>
        
        <div class="nav-right">
          <span class="admin-badge">관리자</span>
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
          <p>관리자</p>
        </div>
      </div>
      <div class="dropdown-menu">
        <a href="#" class="dropdown-item" @click="goToAccount">
          <img src="/images/hotel_img/account.jpg" alt="Account">계정
        </a>
        <hr style="border: 0.5px solid rgba(17, 34, 17, 0.25);">
        <a href="#" class="dropdown-item" @click="handleLogout">
          <img src="/images/hotel_img/logout.jpg" alt="Logout">로그아웃
        </a>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>데이터를 불러오는 중...</p>
      </div>
    </div>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="admin-header">
        <h1>호텔 관리자 페이지</h1>
        <p>모든 테이블의 데이터를 관리할 수 있습니다.</p>
      </div>

      <!-- Table Tabs - 논리적 순서 -->
      <div class="table-tabs">
        <button v-for="table in tableList" :key="table.key" 
                @click="selectTable(table.key)"
                :class="['tab-button', { active: currentTable === table.key }]">
          {{ table.name }}
        </button>
      </div>

      <!-- Search and Actions -->
      <div class="admin-controls">
        <div class="search-section">
          <input v-model="searchQuery" @keyup.enter="handleSearch"
                 placeholder="검색어를 입력하세요..." class="search-input">
          <button @click="handleSearch" class="search-btn">검색</button>
          <!-- searchByName 버튼과 canSearchByName computed 제거됨 -->
        </div>
        <button @click="openCreateModal" class="create-btn">새로 추가</button>
      </div>  

      <!-- Data Table -->
      <div class="table-container">
        <table class="data-table" v-if="currentTableData.length > 0">
          <thead>
            <tr>
              <th v-for="column in currentTableColumns" :key="column.key">
                {{ column.label }}
              </th>
              <th class="action-header">작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentTableData" :key="item.id">
              <td v-for="column in currentTableColumns" :key="column.key">
                <!-- 이미지 -->
                <div v-if="column.type === 'image' && item[column.key]" class="image-cell">
                  <img :src="getImageUrl(item[column.key])" 
                       :alt="column.label" class="table-image">
                </div>
                <!-- 날짜 -->
                <span v-else-if="column.type === 'date'">
                  {{ formatDate(item[column.key]) }}
                </span>
                <!-- 숫자 -->
                <span v-else-if="column.type === 'number'">
                  {{ formatNumber(item[column.key]) }}
                </span>
                <!-- 불린 -->
                <span v-else-if="column.type === 'boolean'" 
                      :class="['boolean-cell', item[column.key] ? 'active' : 'inactive']">
                  {{ item[column.key] ? 'Y' : 'N' }}
                </span>
                <!-- 일반 텍스트 -->
                <span v-else>{{ item[column.key] || '-' }}</span>
              </td>
              <td class="action-cell">
                <button @click="openEditModal(item)" class="edit-btn">수정</button>
                <button @click="confirmDelete(item.id)" class="delete-btn">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-else class="no-data">
          <div class="no-data-icon">📋</div>
          <h3>데이터가 없습니다</h3>
          <p>새로운 데이터를 추가해보세요.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="changePage(currentPage - 1)" 
                :disabled="currentPage <= 1" class="page-btn">이전</button>
        
        <span v-for="page in visiblePages" :key="page">
          <button @click="changePage(page)" 
                  :class="['page-btn', { active: currentPage === page }]">
            {{ page }}
          </button>
        </span>
        
        <button @click="changePage(currentPage + 1)" 
                :disabled="currentPage >= totalPages" class="page-btn">다음</button>
      </div>
    </main>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditMode ? '데이터 수정' : '새 데이터 추가' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="saveItem" class="modal-form">
          <div class="form-scroll">
            <div v-for="field in currentTableFields" :key="field.key" class="form-group">
              <label :for="field.key" class="form-label">
                {{ field.label }}
                <span v-if="field.required" class="required">*</span>
              </label>
              
              <!-- 텍스트 -->
              <input v-if="field.type === 'text'" 
                     :id="field.key" v-model="formData[field.key]" 
                     :placeholder="field.placeholder" :required="field.required"
                     class="form-input">
              
              <!-- 숫자 -->
              <input v-else-if="field.type === 'number'" 
                     type="number" :id="field.key" v-model="formData[field.key]" 
                     :placeholder="field.placeholder" :required="field.required"
                     class="form-input">
              
              <!-- 날짜 -->
              <input v-else-if="field.type === 'date'" 
                     type="date" :id="field.key" v-model="formData[field.key]" 
                     :required="field.required" class="form-input">
              
              <!-- 시간 -->
              <input v-else-if="field.type === 'time'" 
                     type="time" :id="field.key" v-model="formData[field.key]" 
                     :required="field.required" class="form-input">
              
              <!-- 불린 -->
              <select v-else-if="field.type === 'boolean'" 
                      :id="field.key" v-model="formData[field.key]" 
                      :required="field.required" class="form-select">
                <option value="">선택하세요</option>
                <option :value="true">예</option>
                <option :value="false">아니오</option>
              </select>
              
              <!-- Enum -->
              <select v-else-if="field.type === 'enum'" 
                      :id="field.key" v-model="formData[field.key]" 
                      :required="field.required" class="form-select">
                <option value="">선택하세요</option>
                <option v-for="option in field.options" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              
              <!-- 외래키 -->
              <select v-else-if="field.type === 'foreign'" 
                      :id="field.key" v-model="formData[field.key]" 
                      :required="field.required" class="form-select">
                <option value="">선택하세요</option>
                <option v-for="option in field.options" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
              
              <!-- 파일 업로드 -->
              <div v-else-if="field.type === 'file'" class="file-upload-group">
                <input type="file" :id="field.key" 
                       @change="handleFileUpload($event, field.key)"
                       accept="image/*" :required="field.required && !isEditMode"
                       class="file-input" style="display: none;">
                <div class="file-upload-area" @click="triggerFileInput(field.key)">
                  <div v-if="!formData[field.key]" class="upload-placeholder">
                    <div class="upload-icon">📁</div>
                    <p>이미지를 선택하세요</p>
                  </div>
                  <div v-else class="file-preview">
                    <img :src="getImageUrl(formData[field.key])" 
                         alt="미리보기" class="preview-image">
                    <div class="file-info">
                      <p class="file-name">{{ getFileName(formData[field.key]) }}</p>
                      <button type="button" @click.stop="removeFile(field.key)" 
                              class="remove-file-btn">삭제</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 텍스트영역 -->
              <textarea v-else-if="field.type === 'textarea'" 
                        :id="field.key" v-model="formData[field.key]" 
                        :placeholder="field.placeholder" :required="field.required"
                        rows="4" class="form-textarea"></textarea>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">취소</button>
            <button type="submit" class="save-btn" :disabled="isSaving">
              {{ isSaving ? '저장 중...' : (isEditMode ? '수정' : '저장') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Notification -->
    <div v-if="notification" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { authUtils, adminAPI } from '@/utils/commonAxios'

export default {
  name: 'HotelAdmin',
  data() {
    return {
      // UI 상태
      isLoading: false,
      isSaving: false,
      isDropdownActive: false,
      currentTable: 'countries',
      showModal: false,
      isEditMode: false,
      searchQuery: '',
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      
      // 사용자 정보
      userInfo: null,
      isLoggedIn: false,
      
      // 폼 데이터
      formData: {},
      editingId: null,
      
      // 테이블 데이터
      currentTableData: [],
      foreignKeyData: {},
      
      // 알림
      notification: null,
      
      // 테이블 정의 (논리적 순서)
      tableList: [
        { key: 'countries', name: '국가' },
        { key: 'cities', name: '도시' },
        { key: 'city_images', name: '도시 이미지' },
        { key: 'amenities', name: '편의시설' },
        { key: 'freebies', name: '무료서비스' },
        { key: 'hotels', name: '호텔' },
        { key: 'hotel_images', name: '호텔 이미지' },
        { key: 'hotel_amenities', name: '호텔 편의시설' },
        { key: 'hotel_freebies', name: '호텔 무료서비스' },
        { key: 'rooms', name: '객실' },
        { key: 'room_images', name: '객실 이미지' },
        { key: 'room_pricing', name: '객실 가격' },
        { key: 'coupons', name: '쿠폰' }
      ],
      
      // 테이블 컬럼 정의 (ViewDto 기반으로 수정)
      tableColumns: {
        countries: [
          { key: 'id', label: 'ID' },
          { key: 'countryName', label: '국가명' },
          { key: 'idd', label: '국가코드' }
        ],
        cities: [
          { key: 'id', label: 'ID' },
          { key: 'cityName', label: '도시명' },
          { key: 'countryName', label: '국가명' }, // ViewDto에서 가져온 값
          { key: 'cityContent', label: '설명' }
        ],
        city_images: [
          { key: 'id', label: 'ID' },
          { key: 'cityImageName', label: '이미지명' },
          { key: 'cityName', label: '도시명' }, // ViewDto에서 가져온 값
          { key: 'countryName', label: '국가명' }, // ViewDto에서 가져온 값
          { key: 'cityImagePath', label: '이미지', type: 'image' },
          { key: 'cityImageIndex', label: '순서', type: 'number' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        amenities: [
           { key: 'id', label: 'ID' },
           { key: 'amenitiesName', label: '편의시설명' }
        ],
        freebies: [
          { key: 'id', label: 'ID' },
          { key: 'freebiesName', label: '무료서비스명' }
        ],
        hotels: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'cityName', label: '도시' },
          { key: 'hotelType', label: '타입' },
          { key: 'hotelStar', label: '성급', type: 'number' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        hotel_images: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'hotelImageName', label: '이미지명' },
          { key: 'hotelImagePath', label: '이미지', type: 'image' },
          { key: 'hotelImageIndex', label: '순서', type: 'number' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        hotel_amenities: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'amenitiesName', label: '편의시설명' },
          { key: 'isAvailable', label: '이용가능', type: 'boolean' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        hotel_freebies: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'freebiesName', label: '무료서비스명' },
          { key: 'isAvailable', label: '이용가능', type: 'boolean' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        rooms: [
          { key: 'id', label: 'ID' },
          { key: 'roomName', label: '객실명' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'roomNumber', label: '객실번호', type: 'number' },
          { key: 'basePrice', label: '기본가격', type: 'number' },
          { key: 'roomView', label: '전망' }
        ],
        room_images: [
          { key: 'id', label: 'ID' },
          { key: 'roomName', label: '객실명' },
          { key: 'roomImageName', label: '이미지명' },
          { key: 'roomImagePath', label: '이미지', type: 'image' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        room_pricing: [
          { key: 'id', label: 'ID' },
          { key: 'roomName', label: '객실명' },
          { key: 'date', label: '날짜', type: 'date' },
          { key: 'price', label: '가격', type: 'number' }
        ],
        coupons: [
          { key: 'id', label: 'ID' },
          { key: 'couponName', label: '쿠폰명' },
          { key: 'discount', label: '할인율', type: 'number' },
          { key: 'lastDate', label: '만료일', type: 'date' },
          { key: 'isActive', label: '활성화', type: 'boolean' }
        ]
      },
      
      // 폼 필드 정의
      tableFields: {
        countries: [
          { key: 'countryName', label: '국가명', type: 'text', required: true, placeholder: '국가명을 입력하세요' },
          { key: 'idd', label: '국가코드', type: 'text', required: true, placeholder: '국가코드를 입력하세요 (예: +82)' }
        ],
        cities: [
          { key: 'cityName', label: '도시명', type: 'text', required: true, placeholder: '도시명을 입력하세요' },
          { key: 'countryId', label: '국가', type: 'foreign', required: true, options: [] },
          { key: 'cityContent', label: '설명', type: 'textarea', placeholder: '도시 설명을 입력하세요' }
        ],
        city_images: [
          { key: 'cityId', label: '도시', type: 'foreign', required: true, options: [] },
          { key: 'cityImageName', label: '이미지명', type: 'text', required: true, placeholder: '이미지명을 입력하세요' },
          { key: 'cityImagePath', label: '이미지 파일', type: 'file', required: true },
          { key: 'cityImageIndex', label: '순서', type: 'number', required: true, placeholder: '이미지 순서를 입력하세요' }
        ],
        amenities: [
          { key: 'amenitiesName', label: '편의시설명', type: 'text', required: true, placeholder: '편의시설명을 입력하세요' }
        ],
        freebies: [
          { key: 'freebiesName', label: '무료서비스명', type: 'text', required: true, placeholder: '무료서비스명을 입력하세요' }
        ],
        hotels: [
          { key: 'hotelName', label: '호텔명', type: 'text', required: true, placeholder: '호텔명을 입력하세요' },
          { key: 'cityId', label: '도시', type: 'foreign', required: true, options: [] },
          { key: 'hotelType', label: '호텔 타입', type: 'enum', required: true, options: ['hotel', 'motel', 'resort'] },
          { key: 'hotelLatitude', label: '위도', type: 'text', required: true, placeholder: '위도를 입력하세요' },
          { key: 'hotelLongitude', label: '경도', type: 'text', required: true, placeholder: '경도를 입력하세요' },
          { key: 'hotelContent', label: '호텔 설명', type: 'textarea', placeholder: '호텔 설명을 입력하세요' },
          { key: 'hotelStar', label: '성급', type: 'number', placeholder: '호텔 성급 (1-5)' },
          { key: 'hotelNumber', label: '전화번호', type: 'text', placeholder: '호텔 전화번호' },
          { key: 'checkinTime', label: '체크인 시간', type: 'time', required: true },
          { key: 'checkoutTime', label: '체크아웃 시간', type: 'time', required: true }
        ],
        hotel_images: [
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'hotelImageName', label: '이미지명', type: 'text', required: true, placeholder: '이미지명을 입력하세요' },
          { key: 'hotelImagePath', label: '이미지 파일', type: 'file', required: true },
          { key: 'hotelImageIndex', label: '순서', type: 'number', required: true, placeholder: '이미지 순서를 입력하세요' }
        ],
        hotel_amenities: [
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'amenitiesId', label: '편의시설', type: 'foreign', required: true, options: [] },
          { key: 'isAvailable', label: '이용가능 여부', type: 'boolean', required: true }
        ],
        hotel_freebies: [
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'freebiesId', label: '무료서비스', type: 'foreign', required: true, options: [] },
          { key: 'isAvailable', label: '이용가능 여부', type: 'boolean', required: true }
        ],
        rooms: [
          { key: 'roomName', label: '객실명', type: 'text', required: true, placeholder: '객실명을 입력하세요' },
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'roomNumber', label: '객실번호', type: 'number', required: true, placeholder: '객실번호를 입력하세요' },
          { key: 'basePrice', label: '기본가격', type: 'number', required: true, placeholder: '기본가격을 입력하세요' },
          { key: 'roomSingleBed', label: '싱글베드 수', type: 'number', placeholder: '싱글베드 개수' },
          { key: 'roomDoubleBed', label: '더블베드 수', type: 'number', placeholder: '더블베드 개수' },
          { key: 'roomView', label: '전망', type: 'text', placeholder: '객실 전망 (예: 바다뷰, 시티뷰)' }
        ],
        room_images: [
          { key: 'roomId', label: '객실', type: 'foreign', required: true, options: [] },
          { key: 'roomImageName', label: '이미지명', type: 'text', required: true, placeholder: '이미지명을 입력하세요' },
          { key: 'roomImagePath', label: '이미지 파일', type: 'file', required: true }
        ],
        room_pricing: [
          { key: 'roomId', label: '객실', type: 'foreign', required: true, options: [] },
          { key: 'date', label: '날짜', type: 'date', required: true },
          { key: 'price', label: '가격', type: 'number', required: true, placeholder: '해당 날짜의 가격을 입력하세요' }
        ],
        coupons: [
          { key: 'couponName', label: '쿠폰명', type: 'text', required: true, placeholder: '쿠폰명을 입력하세요' },
          { key: 'couponContent', label: '쿠폰 설명', type: 'textarea', placeholder: '쿠폰 설명을 입력하세요' },
          { key: 'discount', label: '할인율', type: 'number', required: true, placeholder: '할인율을 입력하세요 (예: 10.50)' },
          { key: 'lastDate', label: '만료일', type: 'date', required: true },
          { key: 'isActive', label: '활성화', type: 'boolean', required: true }
        ]
      }
    }
  },
  
  computed: {
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
      
      return 'Admin';
    },
    
    currentTableColumns() {
      return this.tableColumns[this.currentTable] || [];
    },
    
    currentTableFields() {
      return this.tableFields[this.currentTable] || [];
    },
    
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  
  methods: {
    // 인증 관련
    loadUserInfo() {
      this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
      
      if (this.isLoggedIn) {
        this.userInfo = authUtils.getUserInfo();
      } else {
        this.userInfo = null;
        this.$router.push('/login');
      }
    },
    
    async handleLogout() {
      if (confirm('로그아웃하시겠습니까?')) {
        try {
          await authUtils.logout();
          this.showNotification('로그아웃되었습니다.', 'success');
          this.$router.push('/login');
        } catch (error) {
          console.error('로그아웃 중 오류:', error);
          this.showNotification('로그아웃되었습니다.', 'success');
          this.$router.push('/login');
        }
      }
    },
    
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    goToHotel() {
      this.$router.push('/hotelone');
    },
    
    goToAccount() {
      this.$router.push('/hotelaccount');
    },

    // 알림
    showNotification(message, type = 'success') {
      this.notification = { message, type };
      setTimeout(() => {
        this.notification = null;
      }, 3000);
    },
    
    // 테이블 선택
    async selectTable(tableKey) {
      this.currentTable = tableKey;
      this.currentPage = 1;
      this.searchQuery = '';
      await this.loadTableData();
    },
    
    // 데이터 로드
    async loadTableData() {
      this.isLoading = true;
      try {
        const params = {
          page: this.currentPage - 1,
          size: this.pageSize,
          search: this.searchQuery
        };

        const response = await adminAPI.getList(this.currentTable, params);
        
        if (response.data.content) {
          this.currentTableData = response.data.content;
          this.totalPages = response.data.totalPages || 1;
        } else {
          this.currentTableData = response.data || [];
          this.totalPages = 1;
        }
        
        await this.loadForeignKeyData();
        
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        this.showNotification('데이터를 불러오는데 실패했습니다.', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    async loadForeignKeyData() {
      try {
        // 국가 데이터
        const countriesResponse = await adminAPI.getList('countries');
        const countries = countriesResponse.data.content || countriesResponse.data || [];
        this.foreignKeyData.countries = countries.map(item => ({
          id: item.id,
          name: item.countryName
        }));
        
        // 도시 데이터
        const citiesResponse = await adminAPI.getList('cities');
        const cities = citiesResponse.data.content || citiesResponse.data || [];
        this.foreignKeyData.cities = cities.map(item => ({
          id: item.id,
          name: item.cityName
        }));
        
        // 호텔 데이터
        const hotelsResponse = await adminAPI.getList('hotels');
        const hotels = hotelsResponse.data.content || hotelsResponse.data || [];
        this.foreignKeyData.hotels = hotels.map(item => ({
          id: item.id,
          name: item.hotelName
        }));
        
        // 객실 데이터
        const roomsResponse = await adminAPI.getList('rooms');
        const rooms = roomsResponse.data.content || roomsResponse.data || [];
        this.foreignKeyData.rooms = rooms.map(item => ({
          id: item.id,
          name: item.roomName
        }));
        
        // 편의시설 데이터
        const amenitiesResponse = await adminAPI.getList('amenities');
        const amenities = amenitiesResponse.data.content || amenitiesResponse.data || [];
        this.foreignKeyData.amenities = amenities.map(item => ({
          id: item.id,
          name: item.amenitiesName
        }));
        
        // 무료서비스 데이터
        const freebiesResponse = await adminAPI.getList('freebies');
        const freebies = freebiesResponse.data.content || freebiesResponse.data || [];
        this.foreignKeyData.freebies = freebies.map(item => ({
          id: item.id,
          name: item.freebiesName
        }));
        
        this.updateForeignKeyOptions();
        
      } catch (error) {
        console.error('외래키 데이터 로드 실패:', error);
      }
    },
    
    updateForeignKeyOptions() {
      Object.keys(this.tableFields).forEach(tableKey => {
        this.tableFields[tableKey].forEach(field => {
          if (field.type === 'foreign') {
            switch (field.key) {
              case 'countryId':
                field.options = this.foreignKeyData.countries || [];
                break;
              case 'cityId':
                field.options = this.foreignKeyData.cities || [];
                break;
              case 'hotelId':
                field.options = this.foreignKeyData.hotels || [];
                break;
              case 'roomId':
                field.options = this.foreignKeyData.rooms || [];
                break;
              case 'amenitiesId':
                field.options = this.foreignKeyData.amenities || [];
                break;
              case 'freebiesId':
                field.options = this.foreignKeyData.freebies || [];
                break;
            }
          }
        });
      });
    },

    // 검색 (기존 이름 검색 기능 제거)
    async handleSearch() {
      this.currentPage = 1;
      await this.loadTableData();
    },

    // 페이지네이션
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadTableData();
      }
    },
    
    // 모달
    openCreateModal() {
      this.isEditMode = false;
      this.editingId = null;
      this.formData = {};
      this.showModal = true;
    },
    
    openEditModal(item) {
      this.isEditMode = true;
      this.editingId = item.id;
      this.formData = { ...item };
      
      // 외래키 ID 설정 (ViewDto 기반으로 수정)
      this.setForeignKeyIds(item);
      
      this.showModal = true;
    },

    setForeignKeyIds(item) {
      if (this.currentTable === 'cities' && item.countryId) {
        this.formData.countryId = item.countryId;
      }
      if (this.currentTable === 'city_images' && item.cityId) {
        this.formData.cityId = item.cityId;
      }
      if (this.currentTable === 'hotels' && item.cityDto) {
        this.formData.cityId = item.cityDto.id;
      }
      if (this.currentTable === 'hotel_images' && item.hotelDto) {
        this.formData.hotelId = item.hotelDto.id;
      }
      if (this.currentTable === 'rooms' && item.hotelDto) {
        this.formData.hotelId = item.hotelDto.id;
      }
      if (this.currentTable === 'room_images' && item.roomDto) {
        this.formData.roomId = item.roomDto.id;
      }
      if (this.currentTable === 'room_pricing' && item.roomDto) {
        this.formData.roomId = item.roomDto.id;
      }
      if (this.currentTable === 'hotel_amenities') {
        if (item.hotelDto) this.formData.hotelId = item.hotelDto.id;
        if (item.amenitiesDto) this.formData.amenitiesId = item.amenitiesDto.id;
      }
      if (this.currentTable === 'hotel_freebies') {
        if (item.hotelDto) this.formData.hotelId = item.hotelDto.id;
        if (item.freebiesDto) this.formData.freebiesId = item.freebiesDto.id;
      }
    },
    
    closeModal() {
      this.showModal = false;
      this.formData = {};
      this.editingId = null;
    },

    // 파일 업로드
    async handleFileUpload(event, fieldKey) {
      const file = event.target.files[0];
      if (!file) return;
      
      try {
        adminAPI.validateImageFile(file);
        
        let folder = 'general';
        if (this.currentTable === 'city_images') {
          folder = 'city';
        } 
        else if (this.currentTable === 'hotel_images') {
          folder = 'hotel';
        }
        else if (this.currentTable === 'room_images') {
          folder = 'room';
        }
        
        const formData = new FormData();
        formData.append('file', file);
        const response = await adminAPI.uploadFile(formData, folder);
        
        this.formData[fieldKey] = response.data.filePath;
        this.showNotification('파일이 업로드되었습니다.', 'success');
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        this.showNotification(error.message || '파일 업로드에 실패했습니다.', 'error');
      }
    },

    triggerFileInput(fieldKey) {
      document.getElementById(fieldKey).click();
    },

    removeFile(fieldKey) {
      this.formData[fieldKey] = null;
    },

    getFileName(filePath) {
      if (!filePath) return '';
      return filePath.split('/').pop();
    },
    
    async saveItem() {
      this.isSaving = true;
      try {
        if (this.isEditMode) {
          await adminAPI.update(this.currentTable, this.editingId, this.formData);
          this.showNotification('수정이 완료되었습니다.', 'success');
        } else {
          await adminAPI.insert(this.currentTable, this.formData);
          this.showNotification('등록이 완료되었습니다.', 'success');
        }
        
        this.closeModal();
        await this.loadTableData();
      } catch (error) {
        console.error('저장 실패:', error);
        this.showNotification(error.response?.data?.message || '저장에 실패했습니다.', 'error');
      } finally {
        this.isSaving = false;
      }
    },
    
    async confirmDelete(id) {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      
      this.isLoading = true;
      try {
        await adminAPI.delete(this.currentTable, id);
        this.showNotification('삭제가 완료되었습니다.', 'success');
        await this.loadTableData();
      } catch (error) {
        console.error('삭제 실패:', error);
        this.showNotification('삭제에 실패했습니다.', 'error');
      } finally {
        this.isLoading = false;
      }
    },

    // 유틸리티
    getImageUrl(imagePath) {
      return adminAPI.getImageUrl(imagePath);
    },

    formatDate(dateString) {
      return adminAPI.formatDate(dateString);
    },

    formatNumber(number) {
      return adminAPI.formatNumber(number);
    },
    
    handleClickOutside(event) {
      if (!this.$refs.userDropdown?.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    }
  },
  
  watch: {
    currentTable() {
      this.loadTableData();
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();
    
    await this.loadForeignKeyData();
    await this.loadTableData();
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
/* 기본 설정 */
.admin-container {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Montserrat', sans-serif;
}

/* 헤더 */
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
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1232px;
  margin: 0 auto;
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #112211;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #8DD3BB;
}

.nav-item img {
  width: 20px;
  height: 20px;
}

.admin-badge {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: #112211;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(141, 211, 187, 0.3);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  color: #112211;
  padding: 8px;
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.user-profile:hover {
  background: rgba(141, 211, 187, 0.1);
}

.user-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  border: 2px solid #fff;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.online-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid #fff;
  border-radius: 50%;
  bottom: 2px;
  right: 2px;
}

/* 드롭다운 */
.user-dropdown {
  position: fixed;
  top: 82px;
  right: 104px;
  width: 329px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.12);
  padding: 32px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1001;
  border: 1px solid rgba(141, 211, 187, 0.2);
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
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
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-info h3 {
  font-weight: 600;
  font-size: 16px;
  color: #112211;
  margin: 0 0 4px 0;
}

.dropdown-info p {
  font-weight: 400;
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid rgba(17, 34, 17, 0.1);
  padding-top: 20px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #112211;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background: rgba(141, 211, 187, 0.1);
  color: #8DD3BB;
}

.dropdown-item img {
  width: 20px;
  height: 20px;
}

/* 로딩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #8DD3BB;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 메인 콘텐츠 */
.admin-main {
  margin-top: 87px;
  padding: 40px 104px;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

.admin-header {
  text-align: center;
  margin-bottom: 48px;
}

.admin-header h1 {
  font-weight: 700;
  font-size: 36px;
  color: #112211;
  margin: 0 0 12px 0;
}

.admin-header p {
  font-weight: 400;
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

/* 테이블 탭 */
.table-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-button {
  padding: 12px 20px;
  border: 2px solid transparent;
  background: #f8fafc;
  color: #64748b;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  background: rgba(141, 211, 187, 0.1);
  color: #8DD3BB;
  border-color: rgba(141, 211, 187, 0.3);
}

.tab-button.active {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  border-color: #8DD3BB;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(141, 211, 187, 0.4);
}

/* 관리 도구 */
.admin-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.search-section {
  display: flex;
  gap: 12px;
  flex: 1;
  max-width: 600px;
}

.search-input {
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.search-input:focus {
  border-color: #8DD3BB;
  background: white;
  box-shadow: 0 0 0 4px rgba(141, 211, 187, 0.1);
}

.search-btn, .search-name-btn, .create-btn {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn {
  background: #112211;
  color: white;
}

.search-btn:hover {
  background: #2a3c2a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(17, 34, 17, 0.3);
}

.search-name-btn {
  background: rgba(141, 211, 187, 0.2);
  color: #0f766e;
  border: 2px solid rgba(141, 211, 187, 0.3);
}

.search-name-btn:hover {
  background: rgba(141, 211, 187, 0.3);
  border-color: #8DD3BB;
  transform: translateY(-2px);
}

.create-btn {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  box-shadow: 0 4px 12px rgba(141, 211, 187, 0.4);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(141, 211, 187, 0.5);
}

/* 데이터 테이블 */
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 24px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 20px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.action-header {
  text-align: center;
  width: 120px;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #374151;
  vertical-align: middle;
}

.data-table tr:hover {
  background: rgba(141, 211, 187, 0.05);
}

/* 셀 타입별 스타일 */
.image-cell {
  display: flex;
  justify-content: center;
}

.table-image {
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  transition: transform 0.3s ease;
}

.table-image:hover {
  transform: scale(1.1);
  border-color: #8DD3BB;
}

.boolean-cell.active {
  color: #059669;
  font-weight: 600;
}

.boolean-cell.inactive {
  color: #dc2626;
  font-weight: 600;
}

/* 액션 버튼 */
.action-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(141, 211, 187, 0.4);
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* 데이터 없음 */
.no-data {
  text-align: center;
  padding: 80px 40px;
  color: #6b7280;
}

.no-data-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-data h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.no-data p {
  font-size: 16px;
  margin: 0;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-btn {
  padding: 8px 12px;
  border: 2px solid transparent;
  background: #f8fafc;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 40px;
  text-align: center;
}

.page-btn:hover:not(:disabled) {
  background: rgba(141, 211, 187, 0.1);
  border-color: rgba(141, 211, 187, 0.3);
  color: #0f766e;
}

.page-btn.active {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  border-color: #8DD3BB;
  box-shadow: 0 2px 8px rgba(141, 211, 187, 0.4);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f1f5f9;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 20px 20px 0 0;
}

.modal-header h3 {
  font-weight: 600;
  font-size: 20px;
  color: #112211;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 모달 폼 */
.modal-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  max-height: 60vh;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 4px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #8DD3BB;
  background: white;
  box-shadow: 0 0 0 4px rgba(141, 211, 187, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 파일 업로드 */
.file-upload-group {
  width: 100%;
}

.file-input {
  display: none;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.file-upload-area:hover {
  border-color: #8DD3BB;
  background: rgba(141, 211, 187, 0.05);
}

.upload-placeholder {
  color: #6b7280;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.upload-placeholder p {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.preview-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin: 0 0 8px 0;
  word-break: break-all;
}

.remove-file-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-file-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* 모달 액션 */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  border-top: 2px solid #f1f5f9;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.cancel-btn, .save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.cancel-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.save-btn {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  box-shadow: 0 4px 12px rgba(141, 211, 187, 0.4);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(141, 211, 187, 0.5);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 알림 */
.notification {
  position: fixed;
  top: 120px;
  right: 32px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 9999;
  animation: slideInRight 0.3s ease;
  min-width: 300px;
  font-weight: 500;
  font-size: 14px;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification.success {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.notification.error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* 반응형 */
@media (max-width: 1024px) {
  .admin-main {
    padding: 20px 40px;
  }
  
  .table-tabs {
    gap: 8px;
    padding: 12px;
  }
  
  .tab-button {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .admin-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-section {
    max-width: none;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
    height: auto;
  }
  
  .user-dropdown {
    right: 20px;
    width: calc(100vw - 40px);
    max-width: 320px;
  }
  
  .admin-main {
    padding: 20px;
    margin-top: 80px;
  }
  
  .admin-header h1 {
    font-size: 28px;
  }
  
  .table-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 12px;
    gap: 6px;
  }
  
  .tab-button {
    padding: 8px 14px;
    font-size: 12px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .search-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .data-table {
    font-size: 12px;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .data-table th, .data-table td {
    padding: 12px 8px;
    min-width: 100px;
  }
  
  .table-image {
    width: 40px;
    height: 30px;
  }
  
  .action-cell {
    flex-direction: column;
    gap: 4px;
  }
  
  .edit-btn, .delete-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
    margin: 20px 10px;
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .modal-header h3 {
    font-size: 18px;
  }
  
  .form-scroll {
    padding: 24px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .preview-image {
    width: 60px;
    height: 45px;
  }
  
  .modal-actions {
    padding: 20px 24px;
    flex-direction: column;
    gap: 8px;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 4px;
    padding: 16px;
  }
  
  .page-btn {
    padding: 6px 10px;
    font-size: 12px;
    min-width: 36px;
  }
  
  .notification {
    right: 16px;
    left: 16px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 12px 16px;
  }
  
  .nav-item {
    font-size: 12px;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
  }
  
  .admin-main {
    padding: 16px;
  }
  
  .admin-header h1 {
    font-size: 24px;
  }
  
  .admin-header p {
    font-size: 14px;
  }
  
  .table-tabs {
    padding: 8px;
  }
  
  .tab-button {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .search-btn, .search-name-btn, .create-btn {
    padding: 10px 16px;
    font-size: 12px;
  }
  
  .admin-controls {
    padding: 16px;
  }
  
  .data-table th, .data-table td {
    padding: 8px 6px;
    min-width: 80px;
  }
  
  .table-image {
    width: 32px;
    height: 24px;
  }
  
  .no-data {
    padding: 40px 20px;
  }
  
  .no-data-icon {
    font-size: 36px;
  }
  
  .no-data h3 {
    font-size: 18px;
  }
  
  .no-data p {
    font-size: 14px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .form-scroll {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-label {
    font-size: 13px;
  }
  
  .form-input, .form-select, .form-textarea {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .file-upload-area {
    padding: 16px;
  }
  
  .upload-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .upload-placeholder p {
    font-size: 14px;
  }
  
  .preview-image {
    width: 50px;
    height: 38px;
  }
  
  .modal-actions {
    padding: 16px 20px;
  }
  
  .cancel-btn, .save-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .page-btn {
    padding: 4px 8px;
    font-size: 11px;
    min-width: 32px;
  }
}

/* 스크롤바 스타일 */
.form-scroll::-webkit-scrollbar {
  width: 8px;
}

.form-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.form-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.form-scroll::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 포커스 관리 */
.tab-button:focus,
.search-btn:focus,
.create-btn:focus,
.page-btn:focus,
.form-input:focus,
.form-select:focus,
.form-textarea:focus,
.cancel-btn:focus,
.save-btn:focus {
  outline: 2px solid #8DD3BB;
  outline-offset: 2px;
}
</style>