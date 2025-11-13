<template>
  <div>
    <!-- 주소 검색 버튼 (slot 사용) -->
    <slot name="trigger" :open="openAddressSearch">
      <button type="button" @click="openAddressSearch" class="default-search-btn">
        주소 검색
      </button>
    </slot>

    <!-- 주소 검색 모달 -->
    <div v-if="isOpen" class="address-modal-overlay" @click="closeModal">
      <div class="address-modal-content" @click.stop>
        <div class="modal-header">
          <h3>주소 검색</h3>
          <button type="button" @click="closeModal" class="close-btn">×</button>
        </div>
        <div id="daum-postcode-container" class="postcode-wrapper"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DaumAddressPopup',
  props: {
    // 자동으로 스크립트 로드할지 여부
    autoLoad: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpen: false,
      isScriptLoaded: false
    }
  },
  mounted() {
    if (this.autoLoad) {
      this.loadDaumPostcodeScript();
    }
  },
  methods: {
    /**
     * 다음 우편번호 서비스 스크립트 로드
     */
    loadDaumPostcodeScript() {
      return new Promise((resolve, reject) => {
        // 이미 로드되어 있는지 확인
        if (window.daum && window.daum.Postcode) {
          this.isScriptLoaded = true;
          resolve();
          return;
        }

        // 스크립트가 DOM에 있는지 확인
        const existingScript = document.querySelector('script[src*="postcode.v2.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => {
            this.isScriptLoaded = true;
            resolve();
          });
          return;
        }

        // 새 스크립트 생성
        const script = document.createElement('script');
        script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.async = true;

        script.onload = () => {
          console.log('Daum Postcode 스크립트 로드 완료');
          this.isScriptLoaded = true;
          resolve();
        };

        script.onerror = () => {
          console.error('Daum Postcode 스크립트 로드 실패');
          reject(new Error('주소 검색 서비스를 불러올 수 없습니다.'));
        };

        document.head.appendChild(script);
      });
    },

    /**
     * 주소 검색 팝업 열기
     */
    async openAddressSearch() {
      try {
        // 스크립트가 로드되지 않았다면 로드
        if (!this.isScriptLoaded) {
          await this.loadDaumPostcodeScript();
        }

        this.isOpen = true;

        // DOM이 업데이트된 후 다음 우편번호 서비스 초기화
        this.$nextTick(() => {
          this.initDaumPostcode();
        });
      } catch (error) {
        console.error('주소 검색 열기 실패:', error);
        alert('주소 검색 서비스를 불러오는데 실패했습니다.');
      }
    },

    /**
     * 다음 우편번호 서비스 초기화
     */
    initDaumPostcode() {
      const container = document.getElementById('daum-postcode-container');
      
      if (!container) {
        console.error('주소 검색 컨테이너를 찾을 수 없습니다.');
        return;
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          // 주소 정보를 부모 컴포넌트로 전달
          const addressData = {
            zonecode: data.zonecode,              // 우편번호
            roadAddress: data.roadAddress,        // 도로명 주소 (DB 저장용)
            jibunAddress: data.jibunAddress,      // 지번 주소
            buildingName: data.buildingName,      // 건물명
            apartment: data.apartment,            // 공동주택 여부 (Y/N)
            
            // 상세 정보
            sido: data.sido,                      // 시도
            sigungu: data.sigungu,                // 시군구
            sigunguCode: data.sigunguCode,        // 시군구 코드
            bname: data.bname,                    // 법정동/법정리 이름
            roadname: data.roadname,              // 도로명
            buildingCode: data.buildingCode,      // 건물관리번호
            
            // 영문 주소
            roadAddressEnglish: data.roadAddressEnglish,
            jibunAddressEnglish: data.jibunAddressEnglish,
            
            // 기본 주소 (도로명 우선)
            address: data.roadAddress || data.jibunAddress,
            
            // 사용자 선택 정보
            userSelectedType: data.userSelectedType  // R: 도로명, J: 지번
          };

          // 부모 컴포넌트로 이벤트 전달
          this.$emit('address-selected', addressData);
          
          // 모달 닫기
          this.closeModal();
        },
        onclose: () => {
          // 사용자가 창을 닫았을 때
          this.$emit('address-close');
        },
        width: '100%',
        height: '100%'
      }).embed(container);
    },

    /**
     * 모달 닫기
     */
    closeModal() {
      this.isOpen = false;
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
/* 기본 검색 버튼 */
.default-search-btn {
  padding: 10px 20px;
  background-color: #7dd3c0;
  color: black;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.default-search-btn:hover {
  background-color: #6bc4a6;
}

/* 모달 오버레이 */
.address-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 모달 컨텐츠 */
.address-modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f8f8;
  border-radius: 8px 8px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 닫기 버튼 */
.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #333;
}

/* 우편번호 서비스 래퍼 */
.postcode-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 0 0 8px 8px;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .address-modal-content {
    width: 95%;
    height: 80vh;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
}
</style>