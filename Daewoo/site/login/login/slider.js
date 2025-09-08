// slider.js - 이미지 슬라이더 기능
class ImageSlider {
    constructor(config = {}) {
        this.currentSlideIndex = 0;
        this.totalSlides = config.totalSlides || 3;
        this.autoSlideInterval = config.autoSlideInterval || null;
        this.autoSlideTimer = null;
        
        // 설정 완료 후 초기화
        this.init();
    }
    
    // 초기화 함수
    init() {
        // DOM이 로드된 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 전역 함수로 등록 (HTML onclick에서 사용 가능)
        window.slideToImage = (index) => this.slideToImage(index);
        
        // 자동 슬라이드 시작 (설정된 경우)
        if (this.autoSlideInterval) {
            this.startAutoSlide();
        }
    }
    
    // 슬라이드로 이동하는 함수
    slideToImage(index) {
        const sliderWrapper = document.getElementById('sliderWrapper');
        const dots = document.querySelectorAll('.dot');
        
        if (!sliderWrapper || dots.length === 0) {
            console.error('슬라이더 요소를 찾을 수 없습니다.');
            return;
        }
        
        // 현재 활성화된 dot 제거
        if (dots[this.currentSlideIndex]) {
            dots[this.currentSlideIndex].classList.remove('active');
        }
        
        // 슬라이드 이동 (transform 사용)
        this.currentSlideIndex = index;
        const translateX = -index * (100 / this.totalSlides);
        sliderWrapper.style.transform = `translateX(${translateX}%)`;
        
        // 새로운 dot 활성화
        if (dots[this.currentSlideIndex]) {
            dots[this.currentSlideIndex].classList.add('active');
        }
    }
    
    // 다음 슬라이드로 이동
    nextSlide() {
        const nextIndex = (this.currentSlideIndex + 1) % this.totalSlides;
        this.slideToImage(nextIndex);
    }
    
    // 이전 슬라이드로 이동
    prevSlide() {
        const prevIndex = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
        this.slideToImage(prevIndex);
    }
    
    // 자동 슬라이드 시작
    startAutoSlide() {
        if (this.autoSlideTimer) {
            clearInterval(this.autoSlideTimer);
        }
        this.autoSlideTimer = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideInterval);
    }
    
    // 자동 슬라이드 정지
    stopAutoSlide() {
        if (this.autoSlideTimer) {
            clearInterval(this.autoSlideTimer);
            this.autoSlideTimer = null;
        }
    }
}

// 슬라이더 초기화 (기본 설정)
const slider = new ImageSlider({
    totalSlides: 3,
    // autoSlideInterval: 5000  // 5초마다 자동 슬라이드 (주석 해제시 활성화)
});