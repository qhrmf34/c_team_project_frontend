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
  </div>
      
  <!-- Ticket (화면에 안보이게 숨김) -->
  <div class="ticket-container">
    <div class="ticket" ref="ticketElement" v-if="ticket">
      <!-- 좌측 날짜 -->
      <div class="ticket-left">
        <div class="ticket-left-updown">
          <div class="left-label">{{ formatDate(ticket.checkInDate) }}</div>
          <div class="left-check">Check-In</div>
        </div>
        <div class="left-image">
          <img src="/images/hotel_account_img/travel.jpg"  alt="travel"/>
        </div>
        <div class="ticket-left-updown">
          <div class="left-label">{{ formatDate(ticket.checkOutDate) }}</div>
          <div class="left-check">Check-Out</div>
        </div>
      </div>

      <!-- 중앙 -->
      <div class="ticket-center">
        <div class="top-bar">
          <div class="guest">
            <img :src="getImageUrl(ticket.profileImage)" alt="profile" >
            <span>{{ ticket.memberName }}</span>
          </div>
          <div class="center-bedroom">{{ ticket.roomName }} - {{ ticket.bedInfo }}</div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div>
              <img src="/images/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
            </div>
            <div class="info-item-content">
              <div class="info-check">체크인</div>          
              <div class="info-item-time">{{formatBookingTime(ticket.checkInTime)}}</div>
            </div>
          </div>

          <div class="info-item">
            <div>
              <img src="/images/hotel_account_img/check.jpg" class="info-item-img" alt="check"/>
            </div>
            <div class="info-item-content">
              <div class="info-check">체크아웃</div>  
              <div class="info-item-time">{{formatBookingTime(ticket.checkOutTime)}}</div>
            </div>
          </div>

          <div class="info-item">
            <div>
              <img src="/images/hotel_account_img/room.jpg" class="info-item-img" alt="room"/>
            </div>
            <div class="info-item-content">
              <div class="info-check">방번호</div>   
              <div class="info-item-time">{{ ticket.roomNumber }}</div>
            </div>
          </div>
        </div>

        <div class="ticket-number">
          <div class="ticket-air">
            TKT 
            <div class="ticket-num">{{ ticket.barcode }}</div>
          </div>
          <div class="barcode">
            <svg class="barcode-svg"></svg>
          </div>
        </div>
      </div>

      <!-- 오른쪽 호텔 이미지 -->
      <div class="ticket-right">
        <div>
          <img :src="getImageUrl(ticket.hotelImage)" alt="hotel" />
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
      ticket: null,
      countdown: 5,
      countdownTimer: null,
      isUploadingImage: false
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
          
          // 2. 티켓 로드 및 이미지 생성 (백그라운드)
          this.loadTicketAndCreateImage();
          
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
        console.log('📋 티켓 로드 시작');
        await this.loadTicket();
        
        if (this.ticket && !this.ticket.ticketImagePath) {
          console.log('📸 티켓 이미지 생성 시작');
          await this.captureAndUploadTicket();
        }
      } catch (error) {
        console.error('❌ 티켓 이미지 생성 실패:', error);
      }
    },
    
    async loadTicket() {
      try {
        const response = await ticketAPI.getTicketByPaymentId(this.paymentId);

        if (response.code === 200) {
          this.ticket = response.data;

          await this.$nextTick();
          setTimeout(() => {
            this.generateBarcode();
          }, 100);
        }

      } catch (error) {
        console.error('티켓 로드 실패:', error);
      }
    },
    
    generateBarcode() {
      if (!this.ticket || !this.ticket.barcode) {
        console.log('티켓 또는 바코드 정보 없음:', this.ticket);
        return;
      }

      try {
        const barcodeElement = document.querySelector('.barcode-svg');
        console.log('바코드 요소:', barcodeElement);
        console.log('바코드 데이터:', this.ticket.barcode);

        if (barcodeElement) {
          JsBarcode(barcodeElement, this.ticket.barcode, {
            format: 'CODE128',
            width: 2,
            height: 60,
            displayValue: false,
            margin: 0
          });
          console.log('바코드 생성 완료');
        } else {
          console.error('바코드 SVG 요소를 찾을 수 없습니다');
        }
      } catch (error) {
        console.error('바코드 생성 실패:', error);
      }
    },
    
    // ✅ 티켓 캡처 및 업로드
    async captureAndUploadTicket() {
      if (this.isUploadingImage) return;
      
      try {
        this.isUploadingImage = true;
        
        await this.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const ticketElement = this.$refs.ticketElement;
        if (!ticketElement) {
          console.error('티켓 요소를 찾을 수 없습니다');
          return;
        }
        
        console.log('티켓 캡처 시작');
        
        const canvas = await html2canvas(ticketElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false
        });
        
        console.log('Canvas 생성 완료');
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        
        console.log('Blob 생성 완료, 크기:', blob.size);
        
        const formData = new FormData();
        formData.append('file', blob, `ticket_${this.ticket.barcode}.png`);
        formData.append('barcode', this.ticket.barcode);
        
        console.log('서버에 업로드 시작');
        
        const response = await ticketAPI.uploadTicketImage(
          this.ticket.ticketId, 
          formData
        );
        
        if (response.code === 200) {
          this.ticket.ticketImagePath = response.data.imagePath;
          console.log('✅ 티켓 이미지 업로드 완료:', response.data.imagePath);
        }
        
      } catch (error) {
        console.error('티켓 이미지 업로드 실패:', error);
      } finally {
        this.isUploadingImage = false;
      }
    },
    
    formatBookingTime(time) {
      if (!time) return '12:00pm';

      const [hourStr, minuteStr] = time.split(':');
      let hour = parseInt(hourStr);
      const minute = minuteStr || '00';
      const suffix = hour >= 12 ? 'pm' : 'am';

      if (hour === 0) hour = 12;
      else if (hour > 12) hour -= 12;

      return `${hour.toString().padStart(2, '0')}:${minute}${suffix}`;
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
      return '₩' + price.toLocaleString();
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    },
    
    getImageUrl(imagePath) {
      if (!imagePath) return '/images/hotel_img/hotel1.jpg';
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return adminAPI.getImageUrl(imagePath);
    },
    
    goBack() {
      this.$router.push('/hotelaccount');
    }
  }
}
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
.payment-success-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.processing, .success, .error {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon, .error-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #112211;
  margin-bottom: 20px;
}

.payment-info {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.payment-info p {
  margin: 10px 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  color: #333;
}

.redirect-message {
  color: #666;
  margin: 20px 0;
}

.error-message {
  color: #ff4444;
  margin: 20px 0;
}

.btn-primary, .btn-secondary {
  padding: 15px 40px;
  border: none;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
}

.btn-primary {
  background: #8DD3BB;
  color: #112211;
}

.btn-primary:hover {
  background: #7CC5AE;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(141, 211, 187, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #112211;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

/* 티켓 스타일 */
  .ticket-container {
      display: flex;
      justify-content: center;
      margin: 4000px 0;
  }

  .ticket {
      position: fixed;
      display: flex;
      width: 1231px;
      height: 309px;
      overflow: hidden;
      margin: 0 auto; 
  }
/* 왼쪽 날짜 구역 */
.ticket-left {
    width: 246px;
    height: 100%;
    background: #e5f2ed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-weight: bold;
    color: #333;
    border-radius: 12px 0 0 12px;
}

.ticket-left-updown{
    width: 188px;
    height: 58px;
    angle: 0 deg;
    opacity: 1;
    gap: 4px;
    padding-left: 20px;
}

.left-label{
    width: 188px;
    height: 39px;
    angle: 0 deg;
    opacity: 1;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 30px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
}
.left-check{
    width: 70px;
    height: 15px;
    angle: 0 deg;
    opacity: 0.6;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: left;
}

.left-image{
    width: 60px;
    height: 92px;
    angle: -0 deg;
    opacity: 1;
    gap: 8px;
    border-radius: 4px;
    padding-left: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.left-image img{
  width: 36px;
  height: 100%;
}

/* 중앙 메인 구역 */
.ticket-center {
    width: 610px;
    height: 309px;
    angle: 0 deg;
    opacity: 1;
    position: relative;
    border-radius: 0 12px 12px 0;
    background-color: white;
}
.top-bar {
    width: 100%;
    height: 96px;
    angle: 0 deg;
    opacity: 1;
    gap: 46px;
    border-radius: 0px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #8DD3BB;
}
.top-bar > div {
    margin: 0 14px; /* 각 요소에 좌우 여백 */
}
.guest {
    display: flex;
    align-items: center;
}
.guest img {
    width: 48px;
    height: 48px;
    angle: 0 deg;
    opacity: 1;
    border: 1px solid #FFFFFF;
    border-radius: 50%;
    margin-right: 10px;
}
.guest span{
    width: 141px;
    height: 25px;
    angle: 0 deg;
    opacity: 1;
    font-family: Acme;
    font-weight: 400;
    font-style: Regular;
    font-size: 20px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: #112211;
}

.center-bedroom{
    width: 228px;
    height: 36px;
    angle: 0 deg;
    opacity: 1;
    font-family: Acme;
    font-weight: 400;
    font-style: Regular;
    font-size: 14px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: right;

}

.info-grid {
    width: 610px;
    height: 83px;
    angle: 0 deg;
    opacity: 1;
    gap: 32px;
    padding: 24px;
    display: flex;
}

.info-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 108px;
    height: 35px;
    angle: 0 deg;
    opacity: 1;
    gap: 8px;

}
.info-item-img{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    angle: 0 deg;
    opacity: 1;
    border-radius: 4px;
}
.info-item-content {
    width: 68px;
    height: 35px;
    angle: 0 deg;
    opacity: 1;
}

.info-item-check{
    width: 34px;
    height: 15px;
    angle: 0 deg;
    opacity: 0.6;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
}

.info-item-time{
    width: 68px;
    height: 20px;
    angle: 0 deg;
    opacity: 1;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;

}

.info-check{
    width: 50px;
    height: 15px;
    angle: 0 deg;
    opacity: 0.6;
    font-family: Montserrat;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;

}

.info-item-time{
    width: 68px;
    height: 20px;
    angle: 0 deg;
    opacity: 1;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 16px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;

}

.ticket-number{
    height: 130px;
    width: 610px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ticket-air{
    width: 45px;
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
    padding-left: 30px;
}
.ticket-num{
    width: 60px;
    height: 15px;
    angle: 0 deg;
    opacity: 0.6;
    font-family: Montserrat;
    font-weight: 500;
    font-style: Medium;
    font-size: 12px;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    margin-top: 10px;
}


.barcode {
    width: 248px;
    height: 100%;
    angle: 0 deg;
    opacity: 1;
    display: flex;
    flex-direction: column;   
    justify-content: flex-end; 
    align-items: center; 
}

.barcode img{
    height: 81px;
}

/* 오른쪽 호텔 로고 (독립 카드) */
.ticket-right {
    width: 375px;
    height: 100%;
    background: white;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    margin-left: 2px;
}
.ticket-right img{
    width: 100%;
    height: 100%;
    angle: 0 deg;
    opacity: 1;
    top: 74px;
    left: 107px;
}
  /* 바코드 SVG 스타일 */
  .barcode-svg {
    width: 100%;
    height: auto;
    margin: 0px 20px 20px 0px;
  }
</style>