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
          <span v-if="table.key === 'chat' && totalUnreadCount > 0" class="tab-badge">
            {{ totalUnreadCount }}
          </span>
        </button>
      </div>

      <!-- 채팅 관리 패널 -->
      <div v-if="currentTable === 'chat'" class="chat-admin-panel">
        <AdminChatPanel />
      </div>

      <!-- Search and Actions -->
      <div v-if="currentTable !== 'chat'" class="admin-controls">
        <div class="search-section">
          <input v-model="searchQuery" @keyup.enter="handleSearch"
                 placeholder="검색어를 입력하세요..." class="search-input">
          <button @click="handleSearch" class="search-btn">검색</button>
        </div>
        <button @click="openCreateModal" class="create-btn">새로 추가</button>
      </div>

      <!-- Data Table -->
      <div v-if="currentTable !== 'chat'" class="table-container">
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
      <div v-if="currentTable !== 'chat' && totalPages > 1" class="pagination">
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
                     type="number" 
                     :id="field.key" 
                     v-model="formData[field.key]" 
                     :placeholder="field.placeholder"  
                     :required="field.required"
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
                      :id="field.key" 
                      v-model="formData[field.key]" 
                      :required="field.required" 
                      class="form-select"
                      @change="field.onChange ? handleFieldChange(field) : null">
                <!-- onChange 속성이 있으면 handleFieldChange 호출 -->
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
              
              <!-- 다중선택 (편의시설/무료서비스) -->
              <div v-else-if="field.type === 'multiselect'" class="multiselect-container">
                <div class="multiselect-header">
                  <span class="selected-count">{{ getSelectedCount(field.key) }}개 선택됨</span>
                  <button type="button" @click="toggleSelectAll(field.key, field.options)" 
                          class="select-all-btn">
                    {{ isAllSelected(field.key, field.options) ? '전체 해제' : '전체 선택' }}
                  </button>
                </div>
                <div class="multiselect-grid">
                  <label v-for="option in field.options" :key="option.id" 
                         class="multiselect-item">
                    <input type="checkbox" 
                           :value="option.id"
                           v-model="formData[field.key]"
                           class="multiselect-checkbox">
                    <span class="multiselect-label">{{ option.name }}</span>
                  </label>
                </div>
              </div>
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
import { authUtils, adminAPI, memberImageAPI, chatAPI } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'
import AdminChatPanel from '@/components/chat/AdminChatPanel.vue'

export default {
  name: 'HotelAdmin',
  components: {
    AdminChatPanel  
  },
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
      tempUploadedFiles: [], // 임시로 업로드된 파일 경로 추적
      originalFilePath: null, // 수정 모드일 때 원본 파일 경로
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

      totalUnreadCount: 0,

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
        { key: 'coupons', name: '쿠폰' },
        { key: 'chat', name: '💬 실시간 상담' }  

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
          { key: 'countryName', label: '국가명' },
          { key: 'cityContent', label: '설명' }
        ],
        city_images: [
          { key: 'id', label: 'ID' },
          { key: 'cityImageName', label: '이미지명' },
          { key: 'cityName', label: '도시명' },
          { key: 'countryName', label: '국가명' },
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
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        hotel_amenities: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'amenitiesName', label: '편의시설명' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        hotel_freebies: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'freebiesName', label: '무료서비스명' },
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
          { key: 'checkoutTime', label: '체크아웃 시간', type: 'time', required: true },
          { key: 'amenities', label: '편의시설', type: 'multiselect', options: [] },
          { key: 'freebies', label: '무료서비스', type: 'multiselect', options: [] }
        ],
        hotel_images: [
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'hotelImageName', label: '이미지명', type: 'text', required: true, placeholder: '이미지명을 입력하세요' },
          { key: 'hotelImagePath', label: '이미지 파일', type: 'file', required: true },
        ],
        hotel_amenities: [
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'amenitiesId', label: '편의시설', type: 'foreign', required: true, options: [] },
        ],
        hotel_freebies: [
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'freebiesId', label: '무료서비스', type: 'foreign', required: true, options: [] },
        ],
        rooms: [
          { key: 'roomName', label: '객실명', type: 'text', required: true, placeholder: '객실명을 입력하세요' },
          { key: 'hotelId', label: '호텔', type: 'foreign', required: true, options: [] },
          { key: 'roomNumber', label: '객실번호', type: 'number', required: true, placeholder: '객실번호를 입력하세요' },
          { key: 'basePrice', label: '기본가격', type: 'number', required: true, placeholder: '기본가격을 입력하세요' },
          { key: 'roomSingleBed', label: '싱글베드 수', type: 'number', placeholder: '싱글베드 개수' },
          { key: 'roomDoubleBed', label: '더블베드 수', type: 'number', placeholder: '더블베드 개수' },
          { key: 'roomView', label: '전망', type: 'enum', options: ['CityView', 'OceanView'] }
        ],
        room_images: [
          { key: 'roomId', label: '객실', type: 'foreign', required: true, options: [] },
          { key: 'roomImageName', label: '이미지명', type: 'text', required: true, placeholder: '이미지명을 입력하세요' },
          { key: 'roomImagePath', label: '이미지 파일', type: 'file', required: true }
        ],
        room_pricing: [
          { key: 'roomId', label: '객실', type: 'foreign', required: true, options: [], onChange: 'onRoomChange' },
          { key: 'date', label: '날짜', type: 'date', required: true },
          { key: 'price', label: '가격', type: 'number', required: true, placeholder: '해당 날짜의 가격을 입력하세요' }
        ],
        coupons: [
          { key: 'couponName', label: '쿠폰명', type: 'text', required: true, placeholder: '쿠폰명을 입력하세요' },
          { key: 'couponContent', label: '쿠폰 설명', type: 'textarea', placeholder: '쿠폰 설명을 입력하세요' },
          { key: 'discount', label: '할인율', type: 'text', required: true, placeholder: '할인율을 입력하세요 (예: 10.50)' },
          { key: 'lastDate', label: '만료일', type: 'date', required: true },
          { key: 'isActive', label: '활성화', type: 'boolean', required: true }
        ]
      }
    }
  },
  
  computed: {
    displayUserName() {
      if (this.isLoggedIn && this.userInfo) {
        return formatMemberName(this.userInfo);
      }
      return 'Guest';
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
    async loadUserInfo() {
      this.isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
    
      if (this.isLoggedIn) {
        try {
          // ✅ await 추가!
          this.userInfo = await authUtils.getUserInfo();
                    
          if (this.userInfo) {
            this.loadProfileImage();
          } else {
            console.warn('사용자 정보가 null입니다.');
            await authUtils.logout();
            this.isLoggedIn = false;
          }
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error);
          // 토큰이 유효하지 않으면 로그아웃
          if (error.response?.status === 401) {
            await authUtils.logout();
            this.isLoggedIn = false;
            this.userInfo = null;
          }
        }
      } else {
        this.userInfo = null;
        this.profileImageUrl = '/images/hotel_account_img/member.jpg';
      }
    },
    async loadProfileImage() {
      if (!this.isLoggedIn) return;

      try {
        const response = await memberImageAPI.getProfileImage();
        if (response && response.data && response.data.imagePath) {
          this.profileImageUrl = this.getImageUrl(response.data.imagePath);
        }
      } catch (error) {
        console.error('프로필 이미지 로드 실패:', error);
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
      this.$router.push('/');
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

      // ✅ chat은 별도 처리
      if (tableKey !== 'chat') {
        await this.loadTableData();
      }
    },
    
    // 데이터 로드
    async loadTableData() {
      // ✅ chat 테이블은 AdminChatPanel에서 처리하므로 스킵
      if (this.currentTable === 'chat') {
        return;
      }
    
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
    async loadUnreadCount() {
      try {
        const response = await chatAPI.getActiveRooms()
        this.totalUnreadCount = response.data.reduce((sum, room) => sum + room.unreadCount, 0)
      } catch (error) {
        console.error('안 읽은 메시지 수 로드 실패:', error)
      }
    },
    async loadForeignKeyData() {
      try {
        // 국가 데이터
        const countriesResponse = await adminAPI.getList('countries', { page: 0, size: 1000 });
        const countries = countriesResponse.data.content || countriesResponse.data || [];
        this.foreignKeyData.countries = countries.map(item => ({
          id: item.id,
          name: item.countryName
        }));
        
        // 도시 데이터
        const citiesResponse = await adminAPI.getList('cities', { page: 0, size: 1000 });
        const cities = citiesResponse.data.content || citiesResponse.data || [];
        this.foreignKeyData.cities = cities.map(item => ({
          id: item.id,
          name: item.cityName
        }));
        
        // 호텔 데이터
        const hotelsResponse = await adminAPI.getList('hotels', { page: 0, size: 1000 });
        const hotels = hotelsResponse.data.content || hotelsResponse.data || [];
        this.foreignKeyData.hotels = hotels.map(item => ({
          id: item.id,
          name: item.hotelName
        }));
        
        // 객실 데이터 - 호텔명 포함
        const roomsResponse = await adminAPI.getList('rooms', { page: 0, size: 1000 });
        const rooms = roomsResponse.data.content || roomsResponse.data || [];
        this.foreignKeyData.rooms = rooms.map(item => ({
          id: item.id,
          name: `${item.roomName}_${item.hotelName}`,
          basePrice: item.basePrice,
          roomName: item.roomName,
          hotelName: item.hotelName
        }));
        
        // 편의시설 데이터
        const amenitiesResponse = await adminAPI.getList('amenities', { page: 0, size: 1000 });
        const amenities = amenitiesResponse.data.content || amenitiesResponse.data || [];
        this.foreignKeyData.amenities = amenities.map(item => ({
          id: item.id,
          name: item.amenitiesName
        }));
        
        // 무료서비스 데이터
        const freebiesResponse = await adminAPI.getList('freebies', { page: 0, size: 1000 });
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
      handleFieldChange(field) {
      // 객실 선택 필드가 변경되었는지 확인
      if (field.onChange === 'onRoomChange' && field.key === 'roomId') {
        const selectedRoomId = this.formData.roomId;

        if (selectedRoomId) {
          // foreignKeyData.rooms에서 선택한 객실 찾기
          const selectedRoom = this.foreignKeyData.rooms.find(
            room => room.id === selectedRoomId
          );

          if (selectedRoom) {
            // room_pricing 테이블의 필드 정의 가져오기
            const pricingFields = this.tableFields.room_pricing;

            // price 필드 찾기
            const priceField = pricingFields.find(f => f.key === 'price');

            if (priceField) {
              // placeholder 동적 변경 (Vue 반응성에 의해 자동으로 화면 업데이트)
              priceField.placeholder = `기본가격: ${this.formatNumber(selectedRoom.basePrice)}원`;
            }
          }
        }
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
          // multiselect 타입도 처리
          if (field.type === 'multiselect') {
            if (field.key === 'amenities') {
              field.options = this.foreignKeyData.amenities || [];
            } else if (field.key === 'freebies') {
              field.options = this.foreignKeyData.freebies || [];
            }
          }
        });
      });
    },

    // 검색
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
    

    // 파일 업로드
    // 파일 업로드 - 즉시 서버에 업로드하여 검증받음
    async handleFileUpload(event, fieldKey) {
      const file = event.target.files[0]
      if (!file) return
      
      try {
        // 1단계: 클라이언트 측 기본 검증
        adminAPI.validateImageFile(file)
        
        // 폴더 결정
        let folder = 'general'
        if (this.currentTable === 'city_images') {
          folder = 'city'
        } else if (this.currentTable === 'hotel_images') {
          folder = 'hotel'
        } else if (this.currentTable === 'room_images') {
          folder = 'room'
        }
        
        // 2단계: 서버에 실제 업로드 (서버 검증 통과)
        const formData = new FormData()
        formData.append('file', file)
        const response = await adminAPI.uploadFile(formData, folder)
        
        const newFilePath = response.data.filePath
        
        // 3단계: 이전 임시 파일 정리
        // 이전에 업로드된 임시 파일이 있고, 원본 파일이 아니라면 삭제
        if (this.formData[fieldKey] && this.formData[fieldKey] !== this.originalFilePath) {
          await this.deleteTemporaryFile(this.formData[fieldKey])
          this.tempUploadedFiles = this.tempUploadedFiles.filter(
            path => path !== this.formData[fieldKey]
          )
        }
        
        // 4단계: 새 파일 정보 저장
        this.formData[fieldKey] = newFilePath
        
        // 원본 파일이 아닌 경우만 임시 목록에 추가
        if (newFilePath !== this.originalFilePath) {
          this.tempUploadedFiles.push(newFilePath)
        }
        
        this.showNotification('파일이 업로드되었습니다.', 'success')
        
      } catch (error) {
        console.error('파일 업로드 실패:', error)
        // 서버 에러 메시지 표시
        const errorMessage = error.response?.data?.message || error.message || '파일 업로드에 실패했습니다.'
        this.showNotification(errorMessage, 'error')
      }
    },
    // 임시 파일 삭제
    async deleteTemporaryFile(filePath) {
      try {
        await adminAPI.deleteFile(filePath)
        console.log('임시 파일 삭제 완료:', filePath)
      } catch (error) {
        console.error('임시 파일 삭제 실패:', filePath, error)
        // 삭제 실패해도 계속 진행 (파일이 이미 없을 수도 있음)
      }
    },
        // 생성 모달 열기
    async openCreateModal() {
      this.isEditMode = false
      this.editingId = null
      this.formData = {}
      this.tempUploadedFiles = []
      this.originalFilePath = null
      
      if (this.currentTable === 'hotels') {
        this.formData.amenities = []
        this.formData.freebies = []
      }
      
      if (this.currentTable === 'room_pricing') {
        const pricingFields = this.tableFields.room_pricing
        const priceField = pricingFields.find(f => f.key === 'price')
        if (priceField) {
          priceField.placeholder = '객실을 먼저 선택하세요'
        }
      }
      
      await this.loadForeignKeyData()
      this.showModal = true
    },
        // 수정 모달 열기
    openEditModal(item) {
      this.isEditMode = true
      this.editingId = item.id
      this.formData = { ...item }
      this.tempUploadedFiles = []
      
      // 원본 파일 경로 저장 (테이블별로 필드명이 다름)
      if (this.currentTable === 'city_images') {
        this.originalFilePath = item.cityImagePath
      } else if (this.currentTable === 'hotel_images') {
        this.originalFilePath = item.hotelImagePath
      } else if (this.currentTable === 'room_images') {
        this.originalFilePath = item.roomImagePath
      }
      
      this.setForeignKeyIds(item)
      
      if (this.currentTable === 'hotels') {
        this.loadHotelFacilities(item.id)
      }
      
      this.showModal = true
    },
    
    // 모달 닫기
    async closeModal() {
      // 임시 업로드된 파일이 있으면 경고
      if (this.tempUploadedFiles.length > 0) {
        const confirmClose = confirm(
          '업로드된 파일이 저장되지 않았습니다. 정말 닫으시겠습니까?\n(업로드된 파일은 삭제됩니다)'
        )
        
        if (!confirmClose) {
          return // 취소하면 모달 유지
        }
        
        // 확인하면 임시 파일들 모두 삭제
        for (const filePath of this.tempUploadedFiles) {
          await this.deleteTemporaryFile(filePath)
        }
      }
      
      this.showModal = false
      this.formData = {}
      this.editingId = null
      this.tempUploadedFiles = []
      this.originalFilePath = null
    },
    triggerFileInput(fieldKey) {
      document.getElementById(fieldKey).click();
    },

    // 파일 제거 버튼
    async removeFile(fieldKey) {
      const filePath = this.formData[fieldKey]
      
      // 원본 파일이 아닌 임시 파일이면 서버에서도 삭제
      if (filePath && filePath !== this.originalFilePath) {
        await this.deleteTemporaryFile(filePath)
        this.tempUploadedFiles = this.tempUploadedFiles.filter(
          path => path !== filePath
        )
      }
      
      this.formData[fieldKey] = null
    },

    getFileName(filePath) {
      if (!filePath) return '';
      return filePath.split('/').pop();
    },
    
    // 저장
    async saveItem() {
      this.isSaving = true
      try {
        // 저장 로직
        if (this.currentTable === 'hotels') {
          const hotelData = { ...this.formData }
          const selectedAmenities = this.formData.amenities || []
          const selectedFreebies = this.formData.freebies || []
          
          delete hotelData.amenities
          delete hotelData.freebies
          
          let hotelId
          if (this.isEditMode) {
            await adminAPI.update(this.currentTable, this.editingId, hotelData)
            hotelId = this.editingId
          } else {
            const response = await adminAPI.insert(this.currentTable, hotelData)
            hotelId = response.data?.id || this.editingId
          }
          
          if (this.isEditMode) {
            await this.updateHotelFacilities(hotelId, selectedAmenities, 'amenities')
            await this.updateHotelFacilities(hotelId, selectedFreebies, 'freebies')
          } else {
            await this.createHotelFacilities(hotelId, selectedAmenities, 'amenities')
            await this.createHotelFacilities(hotelId, selectedFreebies, 'freebies')
          }
          
          this.showNotification('호텔 및 시설 정보가 저장되었습니다.', 'success')
        } else {
          if (this.isEditMode) {
            await adminAPI.update(this.currentTable, this.editingId, this.formData)
            this.showNotification('수정이 완료되었습니다.', 'success')
          } else {
            await adminAPI.insert(this.currentTable, this.formData)
            this.showNotification('등록이 완료되었습니다.', 'success')
          }
        }
        
        // 저장 성공! 임시 파일 목록 초기화 (실제 파일은 삭제하지 않음)
        this.tempUploadedFiles = []
        this.originalFilePath = null
        
        this.showModal = false
        this.formData = {}
        this.editingId = null
        
        await this.loadTableData()
        
      } catch (error) {
        console.error('저장 실패:', error)
        this.showNotification(
          error.response?.data?.message || '저장에 실패했습니다.',
          'error'
        )
      } finally {
        this.isSaving = false
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
    },
    
    // 호텔 시설 관련 메서드
    async loadHotelFacilities(hotelId) {
      try {
        // 편의시설 로드
        const amenitiesResponse = await adminAPI.getList('hotel_amenities', { 
          search: '', 
          page: 0, 
          size: 1000 
        });
        const hotelAmenities = (amenitiesResponse.data.content || amenitiesResponse.data || [])
          .filter(item => item.hotelId === hotelId)
          .map(item => item.amenitiesId);
        
        // 무료서비스 로드
        const freebiesResponse = await adminAPI.getList('hotel_freebies', { 
          search: '', 
          page: 0, 
          size: 1000 
        });
        const hotelFreebies = (freebiesResponse.data.content || freebiesResponse.data || [])
          .filter(item => item.hotelId === hotelId)
          .map(item => item.freebiesId);
        
        this.formData.amenities = hotelAmenities;
        this.formData.freebies = hotelFreebies;
      } catch (error) {
        console.error('시설 정보 로드 실패:', error);
      }
    },
    
    async createHotelFacilities(hotelId, selectedIds, type) {
      const tableName = type === 'amenities' ? 'hotel_amenities' : 'hotel_freebies';
      const idKey = type === 'amenities' ? 'amenitiesId' : 'freebiesId';
      
      for (const id of selectedIds) {
        try {
          await adminAPI.insert(tableName, {
            hotelId: hotelId,
            [idKey]: id,
          });
        } catch (error) {
          console.error(`${type} 연결 실패:`, error);
        }
      }
    },
    
    async updateHotelFacilities(hotelId, selectedIds, type) {
      const tableName = type === 'amenities' ? 'hotel_amenities' : 'hotel_freebies';
      const idKey = type === 'amenities' ? 'amenitiesId' : 'freebiesId';
      
      try {
        // 기존 연결 조회
        const response = await adminAPI.getList(tableName, { 
          search: '', 
          page: 0, 
          size: 1000 
        });
        const existing = (response.data.content || response.data || [])
          .filter(item => item.hotelId === hotelId);
        
        const existingIds = existing.map(item => item[idKey]);
        
        // 삭제할 항목
        const toDelete = existing.filter(item => !selectedIds.includes(item[idKey]));
        for (const item of toDelete) {
          await adminAPI.delete(tableName, item.id);
        }
        
        // 추가할 항목
        const toAdd = selectedIds.filter(id => !existingIds.includes(id));
        for (const id of toAdd) {
          await adminAPI.insert(tableName, {
            hotelId: hotelId,
            [idKey]: id,
          });
        }
      } catch (error) {
        console.error(`${type} 업데이트 실패:`, error);
      }
    },
    
    // 다중선택 헬퍼 메서드
    getSelectedCount(fieldKey) {
      return (this.formData[fieldKey] || []).length;
    },
    
    toggleSelectAll(fieldKey, options) {
      if (!this.formData[fieldKey]) {
        this.formData[fieldKey] = [];
      }
      
      if (this.isAllSelected(fieldKey, options)) {
        this.formData[fieldKey] = [];
      } else {
        this.formData[fieldKey] = options.map(opt => opt.id);
      }
    },
    
    isAllSelected(fieldKey, options) {
      if (!this.formData[fieldKey] || !options) return false;
      return this.formData[fieldKey].length === options.length;
    }
  },
  
  watch: {
    async '$route'() {
      await this.loadUserInfo();
    },
    currentTable() {
      this.loadTableData();
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    await this.loadUserInfo();
    
    await this.loadForeignKeyData();
    await this.loadTableData();
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    // 혹시 남아있는 임시 파일들 정리
    if (this.tempUploadedFiles.length > 0) {
      console.warn('컴포넌트 언마운트 시 임시 파일 정리:', this.tempUploadedFiles)
      this.tempUploadedFiles.forEach(filePath => {
        this.deleteTemporaryFile(filePath)
      })
    }
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
/* 다중선택 스타일 */
.multiselect-container {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  background: #f8fafc;
}

.multiselect-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.selected-count {
  font-size: 14px;
  font-weight: 600;
  color: #8DD3BB;
}

.select-all-btn {
  padding: 6px 12px;
  background: rgba(141, 211, 187, 0.1);
  color: #0f766e;
  border: 1px solid rgba(141, 211, 187, 0.3);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-all-btn:hover {
  background: rgba(141, 211, 187, 0.2);
  border-color: #8DD3BB;
}

.multiselect-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  max-height: 250px;
  overflow-y: auto;
  padding: 4px;
}

.multiselect-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.multiselect-item:hover {
  border-color: #8DD3BB;
  background: rgba(141, 211, 187, 0.05);
}

.multiselect-checkbox {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #8DD3BB;
}

.multiselect-checkbox:checked + .multiselect-label {
  font-weight: 600;
  color: #0f766e;
}

.multiselect-label {
  font-size: 13px;
  color: #374151;
  user-select: none;
  flex: 1;
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
  /* 다중선택 반응형 */
  .multiselect-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    max-height: 200px;
  }

  .multiselect-item {
    padding: 8px 10px;
  }

  .multiselect-label {
    font-size: 12px;
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
  /* 다중선택 모바일 최적화 */
  .multiselect-grid {
    grid-template-columns: 1fr;
    max-height: 180px;
  }
  
  .multiselect-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .select-all-btn {
    width: 100%;
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
.tab-badge {
  display: inline-block;
  margin-left: 8px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.tab-button.active .tab-badge {
  background: white;
  color: #8DD3BB;
}

/* 채팅 관리 패널 */
.chat-admin-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
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