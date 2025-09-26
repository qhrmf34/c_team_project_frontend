<template>
  <div class="admin-container">
    <!-- Header (기존 호텔페이지와 동일) -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item" @click="goToHotel">
            <span><img src="/images/hotel_img/hotel.jpg"></span>
            Hotels
          </a>
        </div>
        
        <div class="nav-right">
          <span class="admin-badge">관리자</span>
          <div class="user-profile" @click="toggleDropdown">f
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
          <p>관리자</p>
        </div>
      </div>
      <div class="dropdown-menu">
        <a href="#" class="dropdown-item" @click="goToAccount">
          <img src="/images/hotel_img/account.jpg">계정
        </a>
        <hr style="border: 0.5px solid rgba(17, 34, 17, 0.25);">
        <a href="#" class="dropdown-item" @click="handleLogout">
          <img src="/images/hotel_img/logout.jpg">로그아웃
        </a>
      </div>
    </div>

    <!-- Admin Content -->
    <main class="admin-main">
      <div class="admin-header">
        <h1>호텔 관리자 페이지</h1>
        <p>모든 테이블의 데이터를 관리할 수 있습니다.</p>
      </div>

      <!-- Table Selection Tabs -->
      <div class="table-tabs">
        <button v-for="table in tableList" :key="table.key" 
                @click="currentTable = table.key"
                :class="['tab-button', { active: currentTable === table.key }]">
          {{ table.name }}
        </button>
      </div>

      <!-- Search and Actions -->
      <div class="admin-controls">
        <div class="search-section">
          <input v-model="searchQuery" @input="handleSearch" 
                 placeholder="검색어를 입력하세요..." 
                 class="search-input">
          <button @click="handleSearch" class="search-btn">검색</button>
        </div>
        <button @click="openCreateModal" class="create-btn">새로 추가</button>
      </div>

      <!-- Data Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="column in currentTableColumns" :key="column.key">
                {{ column.label }}
              </th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentTableData" :key="item.id">
              <td v-for="column in currentTableColumns" :key="column.key">
                <span v-if="column.type === 'image' && item[column.key]">
                  <img :src="adminAPI.getImageUrl(item[column.key])" 
                       alt="이미지" class="table-image">
                </span>
                <span v-else-if="column.type === 'date'">
                  {{ adminAPI.formatDate(item[column.key]) }}
                </span>
                <span v-else-if="column.type === 'number'">
                  {{ adminAPI.formatNumber(item[column.key]) }}
                </span>
                <span v-else-if="column.type === 'boolean'">
                  {{ item[column.key] ? 'Y' : 'N' }}
                </span>
                <span v-else-if="column.type === 'enum'">
                  {{ item[column.key] || '-' }}
                </span>
                <span v-else>
                  {{ item[column.key] || '-' }}
                </span>
              </td>
              <td class="action-cell">
                <button @click="openEditModal(item)" class="edit-btn">수정</button>
                <button @click="deleteItem(item.id)" class="delete-btn">삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="!currentTableData.length" class="no-data">
          데이터가 없습니다.
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

    <!-- Modal for Create/Edit -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditMode ? '데이터 수정' : '새 데이터 추가' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <form @submit.prevent="saveItem" class="modal-form">
          <div v-for="field in currentTableFields" :key="field.key" class="form-group">
            <label :for="field.key">{{ field.label }}</label>
            
            <!-- 텍스트 입력 -->
            <input v-if="field.type === 'text'" 
                   :id="field.key" v-model="formData[field.key]" 
                   :placeholder="field.placeholder"
                   :required="field.required"
                   class="form-input">
            
            <!-- 숫자 입력 -->
            <input v-else-if="field.type === 'number'" 
                   type="number" :id="field.key" v-model="formData[field.key]" 
                   :placeholder="field.placeholder"
                   :required="field.required"
                   step="any"
                   class="form-input">
            
            <!-- 이메일 입력 -->
            <input v-else-if="field.type === 'email'" 
                   type="email" :id="field.key" v-model="formData[field.key]" 
                   :placeholder="field.placeholder"
                   :required="field.required"
                   class="form-input">
            
            <!-- 날짜 입력 -->
            <input v-else-if="field.type === 'date'" 
                   type="date" :id="field.key" v-model="formData[field.key]" 
                   :required="field.required"
                   class="form-input">
            
            <!-- 시간 입력 -->
            <input v-else-if="field.type === 'time'" 
                   type="time" :id="field.key" v-model="formData[field.key]" 
                   :required="field.required"
                   class="form-input">
            
            <!-- 불린 입력 -->
            <select v-else-if="field.type === 'boolean'" 
                    :id="field.key" v-model="formData[field.key]" 
                    :required="field.required"
                    class="form-select">
              <option value="">선택하세요</option>
              <option :value="true">예</option>
              <option :value="false">아니오</option>
            </select>
            
            <!-- Enum 입력 -->
            <select v-else-if="field.type === 'enum'" 
                    :id="field.key" v-model="formData[field.key]" 
                    :required="field.required"
                    class="form-select">
              <option value="">선택하세요</option>
              <option v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            
            <!-- 외래키 선택 -->
            <select v-else-if="field.type === 'foreign'" 
                    :id="field.key" v-model="formData[field.key]" 
                    :required="field.required"
                    class="form-select">
              <option value="">선택하세요</option>
              <option v-for="option in field.options" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
            
            <!-- 파일 업로드 -->
            <input v-else-if="field.type === 'file'" 
                   type="file" :id="field.key" 
                   @change="handleFileUpload($event, field.key)"
                   accept="image/*"
                   class="form-input">
            
            <!-- 텍스트 영역 -->
            <textarea v-else-if="field.type === 'textarea'" 
                      :id="field.key" v-model="formData[field.key]" 
                      :placeholder="field.placeholder"
                      :required="field.required"
                      rows="4"
                      class="form-textarea"></textarea>
            
            <!-- 기본 텍스트 -->
            <input v-else 
                   :id="field.key" v-model="formData[field.key]" 
                   :placeholder="field.placeholder"
                   :required="field.required"
                   class="form-input">
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">취소</button>
            <button type="submit" class="save-btn">{{ isEditMode ? '수정' : '저장' }}</button>
          </div>
        </form>
      </div>
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
      
      // adminAPI 참조 (템플릿에서 사용하기 위해)
      adminAPI: adminAPI,
      
      // 테이블 정의
      tableList: [
        { key: 'countries', name: '국가' },
        { key: 'cities', name: '도시' },
        { key: 'city_images', name: '도시 이미지' },
        { key: 'hotels', name: '호텔' },
        { key: 'hotel_images', name: '호텔 이미지' },
        { key: 'rooms', name: '객실' },
        { key: 'room_images', name: '객실 이미지' },
        { key: 'room_pricing', name: '객실 가격' },
        { key: 'amenities', name: '편의시설' },
        { key: 'freebies', name: '무료서비스' },
        { key: 'hotel_amenities', name: '호텔 편의시설' },
        { key: 'hotel_freebies', name: '호텔 무료서비스' },
        { key: 'coupons', name: '쿠폰' }
      ],
      
      // 테이블 컬럼 정의
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
          { key: 'cityName', label: '도시명' },
          { key: 'cityImageName', label: '이미지명' },
          { key: 'cityImagePath', label: '이미지', type: 'image' },
          { key: 'cityImageIndex', label: '순서' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        hotels: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'cityName', label: '도시' },
          { key: 'hotelType', label: '타입', type: 'enum' },
          { key: 'hotelStar', label: '성급' },
          { key: 'hotelRating', label: '평점', type: 'number' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        hotel_images: [
          { key: 'id', label: 'ID' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'hotelImageName', label: '이미지명' },
          { key: 'hotelImagePath', label: '이미지', type: 'image' },
          { key: 'hotelImageIndex', label: '순서' },
          { key: 'createdAt', label: '등록일', type: 'date' }
        ],
        rooms: [
          { key: 'id', label: 'ID' },
          { key: 'roomName', label: '객실명' },
          { key: 'hotelName', label: '호텔명' },
          { key: 'roomNumber', label: '객실번호' },
          { key: 'basePrice', label: '기본가격', type: 'number' },
          { key: 'roomSingleBed', label: '싱글베드' },
          { key: 'roomDoubleBed', label: '더블베드' },
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
          { key: 'price', label: '가격', type: 'number' },
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
        coupons: [
          { key: 'id', label: 'ID' },
          { key: 'couponName', label: '쿠폰명' },
          { key: 'discount', label: '할인율', type: 'number' },
          { key: 'lastDate', label: '만료일', type: 'date' },
          { key: 'isActive', label: '활성화', type: 'boolean' },
          { key: 'createdAt', label: '등록일', type: 'date' }
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
        hotels: [
          { key: 'hotelName', label: '호텔명', type: 'text', required: true, placeholder: '호텔명을 입력하세요' },
          { key: 'cityId', label: '도시', type: 'foreign', required: true, options: [] },
          { key: 'hotelType', label: '호텔 타입', type: 'enum', required: true, options: ['hotel', 'motel', 'resort'] },
          { key: 'hotelLatitude', label: '위도', type: 'number', required: true, placeholder: '위도를 입력하세요' },
          { key: 'hotelLongitude', label: '경도', type: 'number', required: true, placeholder: '경도를 입력하세요' },
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
        amenities: [
          { key: 'amenitiesName', label: '편의시설명', type: 'text', required: true, placeholder: '편의시설명을 입력하세요' }
        ],
        freebies: [
          { key: 'freebiesName', label: '무료서비스명', type: 'text', required: true, placeholder: '무료서비스명을 입력하세요' }
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
    
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    
    // 네비게이션
    goToHotel() {
      this.$router.push('/hotelone');
    },
    
    goToAccount() {
      this.$router.push('/hotelaccount');
    },
    
    // 데이터 관련
    async loadTableData() {
      try {
        const response = await adminAPI.getList(this.currentTable, {
          page: this.currentPage - 1,
          size: this.pageSize,
          search: this.searchQuery
        });
        
        this.currentTableData = response.content || response;
        this.totalPages = response.totalPages || 1;
        
        // 외래키 데이터 로드
        await this.loadForeignKeyData();
        
      } catch (error) {
        console.error('데이터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
      }
    },
    
    async loadForeignKeyData() {
      try {
        // 국가 데이터
        const countriesResponse = await adminAPI.getList('countries');
        this.foreignKeyData.countries = (countriesResponse.content || countriesResponse).map(item => ({
          id: item.id,
          name: item.countryName
        }));
        
        // 도시 데이터
        const citiesResponse = await adminAPI.getList('cities');
        this.foreignKeyData.cities = (citiesResponse.content || citiesResponse).map(item => ({
          id: item.id,
          name: item.cityName
        }));
        
        // 호텔 데이터
        const hotelsResponse = await adminAPI.getList('hotels');
        this.foreignKeyData.hotels = (hotelsResponse.content || hotelsResponse).map(item => ({
          id: item.id,
          name: item.hotelName
        }));
        
        // 객실 데이터
        const roomsResponse = await adminAPI.getList('rooms');
        this.foreignKeyData.rooms = (roomsResponse.content || roomsResponse).map(item => ({
          id: item.id,
          name: item.roomName
        }));
        
        // 편의시설 데이터
        const amenitiesResponse = await adminAPI.getList('amenities');
        this.foreignKeyData.amenities = (amenitiesResponse.content || amenitiesResponse).map(item => ({
          id: item.id,
          name: item.amenitiesName
        }));
        
        // 무료서비스 데이터
        const freebiesResponse = await adminAPI.getList('freebies');
        this.foreignKeyData.freebies = (freebiesResponse.content || freebiesResponse).map(item => ({
          id: item.id,
          name: item.freebiesName
        }));
        
        // 폼 필드에 외래키 옵션 설정
        this.updateForeignKeyOptions();
        
      } catch (error) {
        console.error('외래키 데이터 로드 실패:', error);
      }
    },
    
    updateForeignKeyOptions() {
      // 각 테이블 필드의 외래키 옵션 업데이트
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
    
    handleSearch() {
      this.currentPage = 1;
      this.loadTableData();
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadTableData();
      }
    },
    
    // 모달 관련
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
      
      // 외래키 ID 설정
      if (this.currentTable === 'cities' && item.countryEntity) {
        this.formData.countryId = item.countryEntity.id;
      }
      if (this.currentTable === 'city_images' && item.cityEntity) {
        this.formData.cityId = item.cityEntity.id;
      }
      if (this.currentTable === 'hotels' && item.cityEntity) {
        this.formData.cityId = item.cityEntity.id;
      }
      if (this.currentTable === 'hotel_images' && item.hotelEntity) {
        this.formData.hotelId = item.hotelEntity.id;
      }
      if (this.currentTable === 'rooms' && item.hotelEntity) {
        this.formData.hotelId = item.hotelEntity.id;
      }
      if (this.currentTable === 'room_images' && item.roomEntity) {
        this.formData.roomId = item.roomEntity.id;
      }
      if (this.currentTable === 'room_pricing' && item.roomEntity) {
        this.formData.roomId = item.roomEntity.id;
      }
      if (this.currentTable === 'hotel_amenities') {
        if (item.hotelEntity) this.formData.hotelId = item.hotelEntity.id;
        if (item.amenitiesEntity) this.formData.amenitiesId = item.amenitiesEntity.id;
      }
      if (this.currentTable === 'hotel_freebies') {
        if (item.hotelEntity) this.formData.hotelId = item.hotelEntity.id;
        if (item.freebiesEntity) this.formData.freebiesId = item.freebiesEntity.id;
      }
      
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.formData = {};
      this.editingId = null;
    },
    
    async handleFileUpload(event, fieldKey) {
      const file = event.target.files[0];
      if (!file) return;
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await adminAPI.uploadFile(formData);
        
        this.formData[fieldKey] = response.filePath;
        alert('파일이 업로드되었습니다.');
      } catch (error) {
        console.error('파일 업로드 실패:', error);
        alert('파일 업로드에 실패했습니다.');
      }
    },
    
    async saveItem() {
      try {
        if (this.isEditMode) {
          await adminAPI.update(this.currentTable, this.editingId, this.formData);
          alert('수정이 완료되었습니다.');
        } else {
          await adminAPI.insert(this.currentTable, this.formData);
          alert('등록이 완료되었습니다.');
        }
        
        this.closeModal();
        this.loadTableData();
      } catch (error) {
        console.error('저장 실패:', error);
        alert(error.response?.data?.message || '저장에 실패했습니다.');
      }
    },
    
    async deleteItem(id) {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      
      try {
        await adminAPI.delete(this.currentTable, id);
        alert('삭제가 완료되었습니다.');
        this.loadTableData();
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    },
    
    handleClickOutside(event) {
      if (!this.$refs.userDropdown.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        this.isDropdownActive = false;
      }
    }
  },
  
  watch: {
    currentTable() {
      this.currentPage = 1;
      this.searchQuery = '';
      this.loadTableData();
    }
  },
  
  async mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserInfo();
    
    // 관리자 권한 체크 (추후 JWT에 role 정보가 추가되면 활성화)
    // if (!this.userInfo?.role || this.userInfo.role !== 'ADMIN') {
    //   alert('관리자만 접근 가능합니다.');
    //   this.$router.push('/hotelone');
    //   return;
    // }
    
    await this.loadForeignKeyData();
    await this.loadTableData();
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style scoped>
/* Header 스타일 (기존과 동일) */
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
  display: flex;
  align-items: center;
  gap: 4px;
  color: #112211;
  text-decoration: none;
}

.admin-badge {
  background: #8DD3BB;
  color: #112211;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-family: Montserrat;
  font-weight: 600;
  font-size: 14px;
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

/* Dropdown 스타일 */
.user-dropdown {
  position: fixed;
  top: 82px;
  right: 104px;
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
  color: #112211;
  margin-bottom: 4px;
}

.dropdown-info p {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 14px;
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
  padding: 4px 0;
  cursor: pointer;
}

.dropdown-item:hover {
  color: #7dd3c0;
}

/* Admin Content 스타일 */
.admin-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-main {
  margin-top: 87px;
  padding: 40px 104px;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

.admin-header {
  text-align: center;
  margin-bottom: 40px;
}

.admin-header h1 {
  font-family: 'Montserrat';
  font-weight: 700;
  font-size: 36px;
  color: #112211;
  margin-bottom: 12px;
}

.admin-header p {
  font-family: 'Montserrat';
  font-weight: 400;
  font-size: 16px;
  color: #666;
}

/* 테이블 탭 */
.table-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  justify-content: center;
}

.tab-button {
  padding: 12px 20px;
  border: 2px solid #8DD3BB;
  background: white;
  color: #112211;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #f0f9f7;
}

.tab-button.active {
  background: #8DD3BB;
  color: #112211;
  font-weight: 600;
}

/* 관리 도구 */
.admin-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-section {
  display: flex;
  gap: 12px;
  flex: 1;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #8DD3BB;
}

.search-btn, .create-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn {
  background: #112211;
  color: white;
}

.search-btn:hover {
  background: #2a3c2a;
}

.create-btn {
  background: #8DD3BB;
  color: #112211;
}

.create-btn:hover {
  background: #7bc7b0;
}

/* 데이터 테이블 */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-family: 'Montserrat';
  font-weight: 600;
  font-size: 14px;
  color: #112211;
  border-bottom: 1px solid #eee;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-family: 'Montserrat';
  font-size: 14px;
  color: #333;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.table-image {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.action-cell {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #8DD3BB;
  color: #112211;
}

.edit-btn:hover {
  background: #7bc7b0;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
}

.delete-btn:hover {
  background: #ff5252;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f0f9f7;
  border-color: #8DD3BB;
}

.page-btn.active {
  background: #8DD3BB;
  color: #112211;
  border-color: #8DD3BB;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-family: 'Montserrat';
  font-weight: 600;
  font-size: 20px;
  color: #112211;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.modal-form {
  padding: 0 24px 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 14px;
  color: #112211;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Montserrat';
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #8DD3BB;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
}

.cancel-btn, .save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #eee;
}

.save-btn {
  background: #8DD3BB;
  color: #112211;
}

.save-btn:hover {
  background: #7bc7b0;
}

/* 반응형 */
@media (max-width: 768px) {
  .admin-main {
    padding: 20px;
  }
  
  .table-tabs {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .admin-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-section {
    max-width: none;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th, .data-table td {
    padding: 8px 6px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>