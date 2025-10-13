<template>
  <div class="payment-success-container">
    <div v-if="isProcessing" class="processing">
      <div class="spinner"></div>
      <h2>결제 확인 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
    
    <div v-else-if="isSuccess" class="success">
      <div class="success-icon">✅</div>
      <h2>결제가 완료되었습니다!</h2>
      <div class="payment-info">
        <p>주문번호: {{ orderId }}</p>
        <p>결제금액: {{ formatPrice(amount) }}</p>
      </div>
      <button @click="goToReservations" class="btn-primary">예약 내역 보기</button>
    </div>
    
    <div v-else class="error">
      <div class="error-icon">❌</div>
      <h2>결제 확인 실패</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <button @click="goBack" class="btn-secondary">돌아가기</button>
    </div>
  </div>
</template>

<script>
import { paymentAPI } from '@/utils/commonAxios'

export default {
  name: 'PaymentSuccess',
  data() {
    return {
      isProcessing: true,
      isSuccess: false,
      errorMessage: '',
      orderId: '',
      amount: 0
    }
  },
  
  async mounted() {
    await this.confirmPayment();
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
        console.log('파라미터:', {
          paymentKey,
          orderId,
          amount,
          reservationId,
          couponId
        });
        
        if (!paymentKey || !orderId || !amount) {
          throw new Error('결제 정보가 올바르지 않습니다.');
        }
        
        // ✅ paymentMethodId 제거
        const response = await paymentAPI.confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
          reservationId: Number(reservationId),
          paymentMethodId: null,  // ✅ null로 전달
          couponId: couponId && couponId !== '' ? Number(couponId) : null
        });
        
        console.log('✅ 결제 승인 응답:', response);
        
        if (response.code === 200) {
          this.isSuccess = true;
          this.orderId = orderId;
          this.amount = Number(amount);
          console.log('✅✅ 결제 완료!');
        } else {
          this.errorMessage = response.message || '결제 확인에 실패했습니다.';
        }
        
      } catch (error) {
        console.error('❌ 결제 승인 실패:', error);
        this.errorMessage = error.response?.data?.message || error.message || '결제 확인 중 오류가 발생했습니다.';
      } finally {
        this.isProcessing = false;
      }
    },
    
    formatPrice(price) {
      if (!price) return '₩0';
      return '₩' + Math.floor(price).toLocaleString('ko-KR');
    },
    
    goToReservations() {
      this.$router.push({
        path: '/hotelaccount',
        query: { tab: 'history' }
      });
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
</style>