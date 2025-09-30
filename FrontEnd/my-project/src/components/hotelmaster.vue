<template>
  <div class="navigation-container">
    <div class="header">
      <h1>Hotel Components Dashboard</h1>
      <p>Vue.js 컴포넌트 네비게이션</p>
    </div>

    <div class="main-content">
      <!-- Hotel Pages Section -->
      <section class="section">
        <h2 class="section-title">Hotel Pages</h2>
        <div class="card-grid">
          <div class="nav-card" @click="navigateTo('/hotelone')">
            <div class="card-icon">🏨</div>
            <h3>Hotel One</h3>
            <p>메인 호텔 페이지</p>
            <div class="card-path">/</div>
          </div>

          <div class="nav-card" @click="navigateTo('/hoteltwo')">
            <div class="card-icon">🏨</div>
            <h3>Hotel Two</h3>
            <p>호텔 투 페이지</p>
            <div class="card-path">/hoteltwo</div>
          </div>

          <div class="nav-card" @click="navigateTo('/hotelthree')">
            <div class="card-icon">🏨</div>
            <h3>Hotel Three</h3>
            <p>호텔 쓰리 페이지</p>
            <div class="card-path">/hotelthree</div>
          </div>

          <div class="nav-card" @click="navigateTo('/hotelfour')">
            <div class="card-icon">🏨</div>
            <h3>Hotel Four</h3>
            <p>호텔 포 페이지</p>
            <div class="card-path">/hotelfour</div>
          </div>

          <div class="nav-card" @click="navigateTo('/hotelfive')">
            <div class="card-icon">🏨</div>
            <h3>Hotel Five</h3>
            <p>호텔 파이브 페이지</p>
            <div class="card-path">/hotelfive</div>
          </div>

          <div class="nav-card" @click="navigateTo('/hotelsix')">
            <div class="card-icon">🏨</div>
            <h3>Hotel Six</h3>
            <p>호텔 식스 페이지</p>
            <div class="card-path">/hotelsix</div>
          </div>

          <div class="nav-card" @click="navigateTo('/hoteltest')">
            <div class="card-icon">🧪</div>
            <h3>Hotel Test</h3>
            <p>테스트 페이지</p>
            <div class="card-path">/hoteltest</div>
          </div>
        </div>
      </section>

      <!-- Account & Authentication Section -->
      <section class="section">
        <h2 class="section-title">Account & Authentication</h2>
        <div class="card-grid">
          <div class="nav-card" @click="navigateTo('/hotelaccount')">
            <div class="card-icon">👤</div>
            <h3>Hotel Account</h3>
            <p>계정 관리 페이지</p>
            <div class="card-path">/hotelaccount</div>
          </div>

          <div class="nav-card" @click="navigateTo('/login')">
            <div class="card-icon">🔐</div>
            <h3>Login</h3>
            <p>로그인 페이지</p>
            <div class="card-path">/login</div>
          </div>

          <div class="nav-card" @click="navigateTo('/signup')">
            <div class="card-icon">📝</div>
            <h3>Sign Up</h3>
            <p>회원가입 페이지</p>
            <div class="card-path">/signup</div>
          </div>

          <div class="nav-card admin-card" @click="navigateTo('/admin')">
            <div class="card-icon">⚙️</div>
            <h3>Admin</h3>
            <p>관리자 페이지</p>
            <div class="card-path">/admin</div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="quick-actions">
          <button class="action-btn primary" @click="navigateTo('/')">
            Home으로 이동
          </button>
          <button class="action-btn secondary" @click="navigateTo('/login')">
            로그인 페이지
          </button>
          <button class="action-btn secondary" @click="navigateTo('/hotelaccount')">
            계정 관리
          </button>
          <button class="action-btn admin" @click="navigateTo('/admin')">
            관리자 페이지
          </button>
          <button class="action-btn outline" @click="refreshPage">
            페이지 새로고침
          </button>
        </div>
      </section>

      <!-- Current Route Info -->
      <section class="section">
        <h2 class="section-title">Current Route</h2>
        <div class="route-info">
          <div class="route-detail">
            <strong>현재 경로:</strong> {{ currentRoute }}
          </div>
          <div class="route-detail">
            <strong>컴포넌트:</strong> {{ currentComponent }}
          </div>
        </div>
      </section>
    </div>

    <div class="footer">
      <p>&copy; 2024 Hotel Components Dashboard - Vue.js Navigation System</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HotelMaster',
  computed: {
    currentRoute() {
      return this.$route.path;
    },
    currentComponent() {
      return this.$route.name || 'Unknown';
    }
  },
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    refreshPage() {
      window.location.reload();
    }
  }
}
</script>

<style scoped>
.navigation-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Montserrat', sans-serif;
}

.header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
  font-weight: 300;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #8dd3bb;
  display: inline-block;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.nav-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8dd3bb, #7bc4a8);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-card:hover::before {
  transform: scaleX(1);
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: #8dd3bb;
}

/* Admin 카드 특별 스타일링 */
.admin-card::before {
  background: linear-gradient(90deg, #ff6b6b, #ee5a24);
}

.admin-card:hover {
  border-color: #ff6b6b;
  box-shadow: 0 8px 30px rgba(255, 107, 107, 0.2);
}

.admin-card .card-path {
  border-left-color: #ff6b6b;
  background: #fff5f5;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
}

.nav-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.nav-card p {
  color: #718096;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-path {
  background: #f7fafc;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #4a5568;
  border-left: 3px solid #8dd3bb;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2rem 0;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 140px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #8dd3bb, #7bc4a8);
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #7bc4a8, #6ab396);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(141, 211, 187, 0.4);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-btn.secondary:hover {
  background: linear-gradient(135deg, #5a6fd8, #6a4190);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* Admin 버튼 특별 스타일링 */
.action-btn.admin {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
}

.action-btn.admin:hover {
  background: linear-gradient(135deg, #ee5a24, #d63031);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.action-btn.outline {
  background: transparent;
  border: 2px solid #8dd3bb;
  color: #8dd3bb;
}

.action-btn.outline:hover {
  background: #8dd3bb;
  color: white;
  transform: translateY(-2px);
}

.route-info {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #8dd3bb;
}

.route-detail {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.route-detail:last-child {
  margin-bottom: 0;
}

.route-detail strong {
  color: #2d3748;
  margin-right: 0.5rem;
}

.footer {
  text-align: center;
  padding: 2rem;
  background: #2d3748;
  color: white;
  margin-top: 3rem;
}

.footer p {
  margin: 0;
  opacity: 0.8;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header {
    padding: 2rem 1rem 1.5rem;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .main-content {
    padding: 0 1rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .nav-card {
    padding: 1.5rem;
  }
  
  .quick-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .nav-card {
    padding: 1.2rem;
  }
  
  .card-icon {
    font-size: 2.5rem;
  }
}
</style>