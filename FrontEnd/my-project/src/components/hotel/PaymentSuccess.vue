<template>
  <div class="payment-success-container">
    <!-- 처리 중 -->
    <div v-if="isProcessing" class="processing">
      <div class="spinner"></div>
      <h2>결제 확인 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
    
    <!-- 성공 -->
    <div v-else-if="isSuccess" class="success">
      <div class="success-icon">✅</div>
      <h2>결제가 완료되었습니다!</h2>
      <div class="payment-info">
        <p>주문번호: {{ orderId }}</p>
        <p>결제금액: {{ formatPrice(amount) }}</p>
      </div>
      <p class="redirect-message">{{ countdown }}초 후 티켓 페이지로 이동합니다...</p>
      <button @click="goToTicket" class="btn-primary">티켓 바로 보기</button>
    </div>
    
    <!-- 실패 -->
    <div v-else class="error">
      <div class="error-icon">❌</div>
      <h2>결제 확인 실패</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <button @click="goBack" class="btn-secondary">돌아가기</button>
    </div>

    <!-- 숨겨진 티켓 요소 (캡처용) -->
    <div ref="hiddenTicket" class="hidden-ticket" v-if="ticketData">
      <div class="ticket-preview">
        <!-- 좌측 날짜 영역 -->
        <div class="ticket-left">
          <div class="ticket-left-updown">
            <div class="left-label">{{ formatDate(ticketData.checkInDate) }}</div>
            <div class="left-check">Check-In</div>
          </div>
          <div class="left-image">
            <img src="/images/hotel_account_img/travel.jpg" alt="travel"/>
          </div>
          <div class="ticket-left-updown">
            <div class="left-label">{{ formatDate(ticketData.checkOutDate) }}</div>
            <div class="left-check">Check-Out</div>
          </div>
        </div>

        <!-- 중앙 정보 영역 -->
        <div class="ticket-center">
          <div class="top-bar">
            <div class="guest">
              <img :src="getImageUrl(ticketData.profileImage)" alt="profile">
              <span>{{ ticketData.memberName }}</span>
            </div>
            <div class="center-bedroom">{{ ticketData.roomName }} - {{ ticketData.bedInfo }}</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div>
                <img src="/images/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
              </div>
              <div class="info-item-content">
                <div class="info-check">체크인</div>          
                <div class="info-item-time">{{ticketData.checkInTime}}pm</div>
              </div>
            </div>

            <div class="info-item">
              <div>
                <img src="/images/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
              </div>
              <div class="info-item-content">
                <div class="info-check">체크아웃</div>  
                <div class="info-item-time">{{ticketData.checkoutTime}}am</div>
              </div>
            </div>

            <div class="info-item">
              <div>
                <img src="/images/hotel_account_img/room.jpg" class="info-item-img" alt="room"/>
              </div>
              <div class="info-item-content">
                <div class="info-check">방번호</div>   
                <div class="info-item-time">{{ ticketData.roomNumber }}</div>
              </div>
            </div> 
          </div>

          <div class="ticket-number">
            <div class="ticket-air">
              TKT 
              <div class="ticket-num">{{ ticketData.barcode }}</div>
            </div>
            <div class="barcode">
              <svg class="barcode-svg"></svg>
            </div>
          </div>
        </div>
        
        <!-- 우측 호텔 이미지 -->
        <div class="ticket-right">
          <div>
            <img :src="getImageUrl(ticketData.hotelImage)" alt="hotel"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentAPI, ticketAPI, adminAPI } from '@/utils/commonAxios'
import html2canvas from 'html2canvas'
import JsBarcode from 'jsbarcode'

export default {
  name: 'PaymentSuccess',
  data() {
    return {
      isProcessing: true,
      isSuccess: false,
      errorMessage: '',
      orderId: '',
      amount: 0,
      paymentId: null,
      ticketData: null,
      countdown: 5,
      countdownTimer: null
    }
  },
  
  async mounted() {
    await this.confirmPayment();
  },
  
  beforeUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  
  methods: {
    async confirmPayment() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentKey = urlParams.get('paymentKey');
        const orderId = urlParams.get('orderId');
        const amount = urlParams.get('amount');
        const reservationId = urlParams.get('reservationId');
        const couponId = urlParams.get('couponId');
        
        console.log('✅ 결제 승인 요청 시작');
        console.log('파라미터:', { paymentKey, orderId, amount, reservationId, couponId });
        
        if (!paymentKey || !orderId || !amount) {
          throw new Error('결제 정보가 올바르지 않습니다.');
        }
        
        // 1. 결제 승인
        const response = await paymentAPI.confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
          reservationId: Number(reservationId),
          paymentMethodId: null,
          couponId: couponId && couponId !== '' ? Number(couponId) : null
        });
        
        console.log('✅ 결제 승인 응답:', response);
        
        if (response.code === 200) {
          this.paymentId = response.data.id;
          this.orderId = orderId;
          this.amount = Number(amount);
          this.isSuccess = true;
          this.isProcessing = false;
          
          console.log('✅ 결제 완료! paymentId:', this.paymentId);
          
          // 2. 티켓 정보 로드 및 이미지 생성
          await this.loadTicketAndCreateImage();
          
          // 3. 카운트다운 시작
          this.startCountdown();
          
        } else {
          this.isProcessing = false;
          this.errorMessage = response.message || '결제 확인에 실패했습니다.';
        }
        
      } catch (error) {
        console.error('❌ 결제 승인 실패:', error);
        this.isProcessing = false;
        this.errorMessage = error.response?.data?.message || error.message || '결제 확인 중 오류가 발생했습니다.';
      }
    },
    
    async loadTicketAndCreateImage() {
      try {
        console.log('티켓 정보 로드 시작 - paymentId:', this.paymentId);
        
        // 1. 티켓 정보 조회
        const response = await ticketAPI.getTicketByPaymentId(this.paymentId);
        
        console.log('티켓 정보 응답:', response);
        
        if (response.code === 200) {
          this.ticketData = response.data;
          
          // 2. DOM 렌더링 대기
          await this.$nextTick();
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // 3. 바코드 생성
          this.generateBarcode();
          
          // 4. 티켓 이미지가 없으면 생성 및 업로드
          if (!this.ticketData.ticketImagePath) {
            console.log('티켓 이미지 생성 시작');
            await this.captureAndUploadTicket();
          } else {
            console.log('티켓 이미지 이미 존재:', this.ticketData.ticketImagePath);
          }
        }
        
      } catch (error) {
        console.error('티켓 처리 실패:', error);
        // 티켓 처리 실패해도 페이지 이동은 계속 진행
      }
    },
    
    generateBarcode() {
      try {
        const barcodeElement = document.querySelector('.barcode-svg');
        if (barcodeElement && this.ticketData.barcode) {
          JsBarcode(barcodeElement, this.ticketData.barcode, {
            format: 'CODE128',
            width: 2,
            height: 60,
            displayValue: false,
            margin: 0
          });
          console.log('✅ 바코드 생성 완료');
        }
      } catch (error) {
        console.error('바코드 생성 실패:', error);
      }
    },
    
    async captureAndUploadTicket() {
      try {
        const ticketElement = this.$refs.hiddenTicket;
        if (!ticketElement) {
          console.error('티켓 요소를 찾을 수 없습니다');
          return;
        }
        
        console.log('티켓 캡처 시작');
        
        // HTML을 Canvas로 변환
        const canvas = await html2canvas(ticketElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: 1200,
          height: 600
        });
        
        console.log('Canvas 생성 완료');
        
        // Canvas를 Blob으로 변환
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        console.log('Blob 생성 완료, 크기:', blob.size);
        
        // FormData 생성
        const formData = new FormData();
        formData.append('file', blob, `ticket_${this.ticketData.barcode}.png`);
        formData.append('barcode', this.ticketData.barcode);
        
        console.log('서버에 업로드 시작');
        
        // 서버에 업로드
        const uploadResponse = await ticketAPI.uploadTicketImage(
          this.ticketData.ticketId, 
          formData
        );
        
        if (uploadResponse.code === 200) {
          console.log('✅ 티켓 이미지 업로드 완료:', uploadResponse.data.imagePath);
          this.ticketData.ticketImagePath = uploadResponse.data.imagePath;
        }
        
      } catch (error) {
        console.error('티켓 이미지 업로드 실패:', error);
        // 업로드 실패해도 계속 진행
      }
    },
    
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(this.countdownTimer);
          this.goToTicket();
        }
      }, 1000);
    },
    
    goToTicket() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
      }
      
      this.$router.push({
        path: '/hotelfive',
        query: { paymentId: this.paymentId }
      });
    },
    
    formatPrice(price) {
      if (!price) return '₩0';
      return '₩' + Math.floor(price).toLocaleString('ko-KR');
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/default.jpg';
      if (imagePath.startsWith('http')) return imagePath;
      if (imagePath.startsWith('/images/')) return imagePath;
      return adminAPI.getImageUrl(imagePath);
    },
    
    goBack() {
      this.$router.push('/hotelone');
    }
  }
}
</script>

<style scoped>
.payment-success-container {
  max-width: 600px;
  margin: 100px auto;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.processing, .success, .error {
  padding: 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon, .error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.payment-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.payment-info p {
  margin: 10px 0;
  font-size: 16px;
  color: #666;
}

.redirect-message {
  color: #666;
  margin: 20px 0;
  font-size: 14px;
}

.error-message {
  color: #e74c3c;
  margin: 20px 0;
}

button {
  margin-top: 20px;
  padding: 12px 32px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* 숨겨진 티켓 요소 */
.hidden-ticket {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 1200px;
  height: 600px;
  overflow: hidden;
}

.ticket-preview {
  display: flex;
  background: white;
  width: 1200px;
  height: 600px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

/* 좌측 날짜 영역 */
.ticket-left {
  width: 200px;
  background: linear-gradient(180deg, #FF8682 0%, #FF6B6B 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: white;
  padding: 30px 20px;
}

.ticket-left-updown {
  text-align: center;
}

.left-label {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.left-check {
  font-size: 14px;
  opacity: 0.9;
}

.left-image {
  width: 80px;
  height: 80px;
}

.left-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 중앙 정보 영역 */
.ticket-center {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.guest {
  display: flex;
  align-items: center;
  gap: 10px;
}

.guest img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.guest span {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.center-bedroom {
  font-size: 16px;
  color: #666;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-item-img {
  width: 32px;
  height: 32px;
}

.info-item-content {
  display: flex;
  flex-direction: column;
}

.info-check {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.info-item-time {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.ticket-number {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: auto;
}

.ticket-air {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.ticket-num {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.barcode {
  display: flex;
  justify-content: flex-start;
}

.barcode-svg {
  height: 60px;
}

/* 우측 호텔 이미지 */
.ticket-right {
  width: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ticket-right img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>