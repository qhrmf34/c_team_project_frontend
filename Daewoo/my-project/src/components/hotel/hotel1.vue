<template>
  <div class="hotel-search">
    <!-- Header -->
    <header class="header">
      <nav>
        <div class="nav-left">
          <a href="#" class="nav-item">
            <span><img src="../hotel_img/hotel.jpg"></span>
            Hotels
          </a>
        </div>
        
        <div class="nav-right">
          <a href="#" class="nav-item">
            <span><img src="../hotel_img/heart.jpg"></span>
            찜하기
          </a>
          <span>|</span>
          <div class="user-profile" @click="toggleDropdown">
            <div class="user-avatar">
              <div class="online-dot"></div>
            </div>
            <span>{{ user.name }}</span>
          </div>
        </div>
      </nav>
    </header>

    <!-- User Dropdown -->
    <div class="user-dropdown" :class="{ active: isDropdownOpen }" ref="userDropdown">
      <div class="dropdown-header">
        <div class="dropdown-avatar"></div>
        <div class="dropdown-info">
          <h3>{{ user.name }}</h3>
          <p>{{ user.status }}</p>
        </div>
      </div>
      <div class="dropdown-menu">
        <a href="#" class="dropdown-item" v-for="item in dropdownItems" :key="item.id">
          <img :src="item.icon">{{ item.label }}
        </a>
        <hr style="border: 0.5px solid rgba(17, 34, 17, 0.25);">
        <a href="#" class="dropdown-item" @click="logout">
          <img src="../hotel_img/logout.jpg">로그아웃
        </a>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
      <img src="../hotel_img/plushotel.jpg" alt="Hero Background" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
      <div class="hero-content">
        <h1 class="hero-title">{{ heroContent.title }}</h1>
        <p class="hero-subtitle">{{ heroContent.subtitle }}</p>
      </div>

      <!-- Search Form -->
      <div class="search-form">
        <h2 class="search-title">Where are you staying?</h2>
        <div class="search-fields">
          <div class="form-field destination-field">
            <label>Enter Destination</label>
            <input 
              type="text" 
              v-model="searchForm.destination"
              :placeholder="searchForm.destinationPlaceholder"
            >
          </div>
          <div class="form-field date-field">
            <label>Check In</label>
            <input type="date" v-model="searchForm.checkIn">
          </div>
          <div class="form-field date-field">
            <label>Check Out</label>
            <input type="date" v-model="searchForm.checkOut">
          </div>
          <div class="form-field guests-field">
            <label>Rooms & Guests</label>
            <select v-model="searchForm.roomsGuests">
              <option v-for="option in roomGuestOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Travel Section -->
      <section class="travel-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">여행에 빠지다</h2>
            <p class="section-subtitle">특가상품으로 진행하는 여행을 예약해보세요</p>
          </div>
          <button class="see-all-btn travel-section-btn">See All</button>
        </div>

        <div class="destination-cards">
          <div 
            class="destination-card" 
            v-for="destination in destinations" 
            :key="destination.id"
          >
            <img 
              :src="destination.image" 
              :alt="destination.name" 
              style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;"
            >
            <div class="card-overlay">
              <div class="card-content">
                <div class="card-info">
                  <h3>{{ destination.name }}</h3>
                  <p>{{ destination.description }}</p>
                </div>
                <div class="card-price">{{ formatPrice(destination.price) }}</div>
              </div>
              <button class="book-btn" @click="bookHotel(destination)">Book a Hotel</button>
            </div>
          </div>
        </div>
      </section>

      <!-- More Travel Section -->
      <section class="travel-section">
        <div class="section-header">
          <div>
            <h2 class="section-title more-travel-title">여행 더보기</h2>
            <p class="section-subtitle">{{ moreTravel.subtitle }}</p>
          </div>
          <button class="see-all-btn">See All</button>
        </div>

        <div class="more-travel">
          <div class="malaka-tour">
            <div class="tour-header">
              <h2 class="tour-title">{{ malakaTour.title }}</h2>
              <div class="price-tag">
                <div class="from">From</div>
                <div class="price">${{ malakaTour.price }}</div>
              </div>
            </div>

            <p class="tour-description">{{ malakaTour.description }}</p>
            <button class="tour-btn" @click="bookFlight">Book Flight</button>
          </div>

          <div class="tour-images">
            <div class="image-row" v-for="(row, index) in tourImageRows" :key="index">
              <img 
                v-for="image in row" 
                :key="image.id"
                :src="image.src" 
                :alt="image.alt" 
                class="tour-image"
              >
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
      <div class="newsletter-content">
        <div class="newsletter-left">
          <h2 class="newsletter-title">{{ newsletter.title }}</h2>

          <div class="newsletter-info">
            <div class="newsletter-brand">{{ newsletter.brand }}</div>
            <p class="newsletter-desc">{{ newsletter.description }}</p>
          </div>

          <div class="newsletter-form">
            <input 
              type="email" 
              class="newsletter-input" 
              v-model="newsletter.email"
              :placeholder="newsletter.placeholder"
            >
            <button class="subscribe-btn" @click="subscribe">Subscribe</button>
          </div>
        </div>

        <!-- Mailbox Design -->
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

      <!-- Footer -->
      <div class="footer-content">
        <div class="social-icons">
          <img 
            v-for="social in socialIcons" 
            :key="social.name"
            :src="social.icon"
            :alt="social.name"
            @click="openSocialLink(social.url)"
          />
        </div>

        <div class="footer-links">
          <div 
            class="footer-column" 
            v-for="column in footerColumns" 
            :key="column.title"
          >
            <h4>{{ column.title }}</h4>
            <a 
              v-for="link in column.links" 
              :key="link.name"
              :href="link.url"
            >
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

export default {
  name: 'HotelSearch',
  setup() {
    // Reactive data
    const isDropdownOpen = ref(false)
    const userDropdown = ref(null)

    const user = reactive({
      name: 'Tomhoon',
      status: 'Online'
    })

    const heroContent = reactive({
      title: '플러스 호텔 및 다양한 숙소를 확인하세요!',
      subtitle: '검색을 통해 요금을 비교하고 무료 취소를 포함한 특가도 확인하세요!'
    })

    const searchForm = reactive({
      destination: '',
      destinationPlaceholder: '신라스테이 춘천, 춘천, 서울',
      checkIn: '2024-12-12',
      checkOut: '2024-12-14',
      roomsGuests: '1 room, 2 guests'
    })

    const roomGuestOptions = ref([
      { value: '1 room, 2 guests', label: '1 room, 2 guests' },
      { value: '1 room, 1 guest', label: '1 room, 1 guest' },
      { value: '2 rooms, 4 guests', label: '2 rooms, 4 guests' }
    ])

    const dropdownItems = ref([
      { id: 1, icon: '../hotel_img/account.jpg', label: '계정' },
      { id: 2, icon: '../hotel_img/card.jpg', label: '결제내역' },
      { id: 3, icon: '../hotel_img/setting.jpg', label: '설정' }
    ])

    const destinations = ref([
      {
        id: 1,
        name: '멜버른',
        description: 'Amazing journey',
        price: 130000,
        image: '../hotel_img/melbourne.jpg'
      },
      {
        id: 2,
        name: '파리',
        description: 'A Paris Adventure',
        price: 150000,
        image: '../hotel_img/paris.jpg'
      },
      {
        id: 3,
        name: '런던',
        description: 'London eye adventure',
        price: 130000,
        image: '../hotel_img/london.jpg'
      },
      {
        id: 4,
        name: '콜롬비아',
        description: 'Amazing streets',
        price: 150000,
        image: '../hotel_img/colombia.jpg'
      }
    ])

    const moreTravel = reactive({
      subtitle: 'Going somewhere to celebrate this season? Whether you\'re going home or somewhere to roam, we\'ve got the travel tools to get you to your destination.'
    })

    const malakaTour = reactive({
      title: '말라카 투어',
      price: 700,
      description: '오래된 시간의 숨결이 머무는 도시, 말라카(Melaka). 말레이시아의 작은 보석 같은 이 도시는 동서양 문화가 만나는 관문이자, 세계문화유산으로 지정된 매혹적인 여행지입니다. 단 하루만 머물러도 그 깊은 매력에 빠지고, 며칠을 살아보면 다시 찾고 싶은 마음이 샘솟는 곳. 이제 저희 여행사가 준비한 특별한 말라카 투어상품과 함께 그 여정을 시작해 보세요.'
    })

    const tourImageRows = ref([
      [
        { id: 1, src: '../hotel_img/tour-image-1.jpg', alt: 'Tour Image 1' },
        { id: 2, src: '../hotel_img/tour-image-2.jpg', alt: 'Tour Image 2' }
      ],
      [
        { id: 3, src: '../hotel_img/tour-image-3.jpg', alt: 'Tour Image 3' },
        { id: 4, src: '../hotel_img/tour-image-4.jpg', alt: 'Tour Image 4' }
      ]
    ])

    const newsletter = reactive({
      title: '구독서비스\n신청해보세요',
      brand: 'The Travel',
      description: '구독자로 여행 할인, 팁 및 비하인드 정보를 받아보세요',
      email: '',
      placeholder: 'Your email address'
    })

    const socialIcons = ref([
      { name: 'facebook', icon: '../hotel_img/facebook.jpg', url: 'https://facebook.com' },
      { name: 'twitter', icon: '../hotel_img/twitter.jpg', url: 'https://twitter.com' },
      { name: 'youtube', icon: '../hotel_img/youtube.jpg', url: 'https://youtube.com' },
      { name: 'instagram', icon: '../hotel_img/instagram.jpg', url: 'https://instagram.com' }
    ])

    const footerColumns = ref([
      {
        title: 'Our Destinations',
        links: [
          { name: 'Canada', url: '#' },
          { name: 'Alaksa', url: '#' },
          { name: 'France', url: '#' },
          { name: 'Iceland', url: '#' }
        ]
      },
      {
        title: 'Our Activities',
        links: [
          { name: 'Northern Lights', url: '#' },
          { name: 'Cruising & sailing', url: '#' },
          { name: 'Multi-activities', url: '#' },
          { name: 'Kayaking', url: '#' }
        ]
      },
      {
        title: 'Travel Blogs',
        links: [
          { name: 'Bali Travel Guide', url: '#' },
          { name: 'Sri Lanka Travel Guide', url: '#' },
          { name: 'Peru Travel Guide', url: '#' },
          { name: 'Bali Travel Guide', url: '#' }
        ]
      },
      {
        title: 'About Us',
        links: [
          { name: 'Our Story', url: '#' },
          { name: 'Work with us', url: '#' }
        ]
      },
      {
        title: 'Contact Us',
        links: [
          { name: 'Our Story', url: '#' },
          { name: 'Work with us', url: '#' }
        ]
      }
    ])

    // Methods
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value
    }

    const handleClickOutside = (event) => {
      if (userDropdown.value && !userDropdown.value.contains(event.target) && 
          !event.target.closest('.user-profile')) {
        isDropdownOpen.value = false
      }
    }

    const formatPrice = (price) => {
      return `₩${price.toLocaleString()}`
    }

    const bookHotel = (destination) => {
      console.log('Booking hotel for:', destination.name)
      // 호텔 예약 로직 구현
    }

    const bookFlight = () => {
      console.log('Booking flight for Malaka tour')
      // 항공편 예약 로직 구현
    }

    const subscribe = () => {
      if (newsletter.email) {
        console.log('Subscribing email:', newsletter.email)
        // 구독 로직 구현
        newsletter.email = ''
      }
    }

    const logout = () => {
      console.log('User logged out')
      // 로그아웃 로직 구현
      isDropdownOpen.value = false
    }

    const openSocialLink = (url) => {
      window.open(url, '_blank')
    }

    // Lifecycle
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      // Refs
      isDropdownOpen,
      userDropdown,
      
      // Reactive data
      user,
      heroContent,
      searchForm,
      roomGuestOptions,
      dropdownItems,
      destinations,
      moreTravel,
      malakaTour,
      tourImageRows,
      newsletter,
      socialIcons,
      footerColumns,
      
      // Methods
      toggleDropdown,
      formatPrice,
      bookHotel,
      bookFlight,
      subscribe,
      logout,
      openSocialLink
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

.hotel-search {
  font-family: 'Montserrat', sans-serif;
  background: #FAFBFC;
  min-width: 1440px;
  max-width: 1440px;
  min-height: 100vh;
  margin: 0 auto;
  overflow-x: scroll;
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

/* Hero Section */
.hero-section {
  background: linear-gradient(90deg, rgba(0, 35, 77, 0.63) 11.46%, rgba(0, 35, 77, 0) 77.37%);
  height: 537px;
  padding: 80px 174px 120px 126px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  margin-top: 87px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 440px;
}

.hero-title {
  font-family: 'Abhaya Libre ExtraBold';
  font-weight: 800;
  font-size: 45px;
  line-height: 100%;
  color: white;
}

.hero-subtitle {
  font-family: Montserrat;
  font-weight: 500;
  font-size: 20px;
  line-height: 100%;
  color: #FFFFFF;
  width: 375px;
}

/* Search Form */
.search-form {
  position: absolute;
  width: 1232px;
  height: 176px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -88px;
  background: #FFFFFF;
  box-shadow: 0px 4px 16px rgba(17, 34, 17, 0.05);
  border-radius: 16px;
  padding: 32px 24px;
  z-index: 100;
}

.search-title {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
  color: #112211;
  margin-bottom: 32px;
}

.search-fields {
  display: flex;
  gap: 16px;
  align-items: center;
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
  min-width: 416px;
}

.date-field {
  width: 240px;
}

.guests-field {
  width: 240px;
}

/* Main Content */
.main-content {
  padding: 150px 104px 0;
  flex: 1;
}

/* Travel Section */
.travel-section {
  margin-bottom: 120px;
}

.travel-section-btn {
  margin-top: 86px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 80px;
}

.section-title {
  font-family: ABeeZee;
  font-weight: 400;
  font-size: 32px;
  line-height: 100%;
  color: #000000;
  margin-bottom: 16px;
  margin-top: 95px;
}

.section-title.more-travel-title {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 32px;
  line-height: 100%;
  margin-top: -50px;
}

.section-subtitle {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  margin-bottom: -43px;
  color: #000000;
}

.see-all-btn {
  padding: 8px 16px;
  border: 1px solid #8DD3BB;
  border-radius: 4px;
  background: transparent;
  color: rgba(17, 34, 17, 1);
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  cursor: pointer;
}

.destination-cards {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.destination-card {
  width: 296px;
  height: 420px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.card-overlay {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  color: white;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}

.card-info h3 {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
  margin-bottom: 4px;
}

.card-info p {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  opacity: 0.9;
}

.card-price {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 24px;
  line-height: 100%;
}

.book-btn {
  width: 100%;
  padding: 16px;
  background: #8DD3BB;
  border: none;
  border-radius: 4px;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  cursor: pointer;
}

/* More Travel Section */
.more-travel {
  display: flex;
  gap: 24px;
  margin-bottom: 60px;
  justify-content: center;
  margin-top: -50px;
  margin-bottom: 250px;
}

.malaka-tour {
  width: 552px;
  height: 424px;
  background: rgba(141, 211, 187, 1);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.tour-title {
  font-family: ABeeZee;
  font-weight: 400;
  font-size: 40px;
  line-height: 100%;
  color: #112211;
}

.price-tag {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  width: 68px;
}

.price-tag .from {
  font-family: Acme;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #112211;
}

.price-tag .price {
  font-family: Montserrat;
  font-weight: 600;
  font-size: 20px;
  line-height: 100%;
  color: #112211;
}

.tour-description {
  font-family: Montserrat;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #112211;
  margin-bottom: 24px;
  flex: 1;
}

.tour-btn {
  width: 100%;
  padding: 16px;
  background: #FFFFFF;
  border: none;
  border-radius: 4px;
  color: #112211;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  cursor: pointer;
}

.tour-images {
  width: 656px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.image-row {
  display: flex;
  gap: 20px;
}

.tour-image {
  width: 318px;
  height: 200px;
  border: 2px solid rgba(141, 211, 187, 1);     
  border-radius: 12px;
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
  white-space: pre-line;
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

.social-icons img {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.social-icons img:hover {
  opacity: 0.7;
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
  transition: opacity 0.3s ease;
}

.footer-column a:hover {
  opacity: 1;
}
</style>