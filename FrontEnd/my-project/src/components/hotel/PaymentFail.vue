<template>
  <div class="payment-fail-container">
    <div class="error-icon">❌</div>
    <h2>결제가 실패했습니다</h2>
    <div class="error-info">
      <p v-if="errorCode"><strong>오류 코드:</strong> {{ errorCode }}</p>
      <p v-if="errorMessage"><strong>오류 메시지:</strong> {{ errorMessage }}</p>
    </div>
    <button @click="goBack" class="btn-primary">다시 시도하기</button>
  </div>
</template>

<script>
export default {
  name: 'PaymentFail',
  data() {
    return {
      errorCode: '',
      errorMessage: ''
    }
  },
  
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.errorCode = urlParams.get('code');
    this.errorMessage = urlParams.get('message');
    
    console.log('결제 실패:', {
      code: this.errorCode,
      message: this.errorMessage
    });
  },
  
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.payment-fail-container {
  max-width: 600px;
  margin: 100px auto;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #e74c3c;
}

.error-info {
  background: #fff5f5;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #ffebeb;
}

.error-info p {
  margin: 10px 0;
  text-align: left;
  color: #666;
}

button {
  margin-top: 20px;
  padding: 12px 32px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background-color: #45a049;
}
</style>