<template>
  <div class="chat-widget">
    <!-- 채팅 버튼 (우측 하단 고정) -->
    <div 
      v-if="!isChatOpen" 
      class="chat-button" 
      @click="openChat"
      :class="{ 'has-notification': unreadCount > 0 }"
    >
      <img src="/images/chat-icon.jpg" alt="Chat" class="chat-icon">
      <div v-if="unreadCount > 0" class="notification-badge">
        {{ unreadCount }}
      </div>
    </div>

    <!-- 채팅 창 -->
    <div v-if="isChatOpen" class="chat-window">
      <!-- 헤더 -->
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="status-dot"></div>
          <div>
            <h3>실시간 상담</h3>
            <p>상담사가 곧 응답합니다</p>
          </div>
        </div>
        <button @click="closeChat" class="close-btn">✕</button>
      </div>

      <!-- FAQ 초기 화면 -->
      <div v-if="!chatStarted" class="faq-section">
        <h4>자주 묻는 질문</h4>
        <div class="faq-list">
          <button 
            v-for="faq in faqs" 
            :key="faq.id" 
            @click="sendFAQ(faq)"
            class="faq-item"
          >
            {{ faq.question }}
          </button>
        </div>
        <button @click="startChat" class="start-chat-btn">
          직접 문의하기
        </button>
      </div>

      <!-- 메시지 영역 -->
      <div v-else class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['message', message.senderType === 'CUSTOMER' ? 'sent' : 'received']"
        >
          <div class="message-bubble">
            <div class="message-sender">{{ message.senderName }}</div>
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        <div v-if="isTyping" class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <!-- 입력 영역 -->
      <div v-if="chatStarted" class="chat-input">
        <input 
          v-model="messageInput"
          @keyup.enter="sendMessage"
          placeholder="메시지를 입력하세요..."
          class="message-input"
        >
        <button @click="sendMessage" class="send-btn" :disabled="!messageInput.trim()">
          <img src="/images/send-icon.jpg" alt="Send">
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { chatAPI, authUtils } from '@/utils/commonAxios';
import { formatMemberName } from '@/utils/nameFormatter';

export default {
  name: 'ChatWidget',
  data() {
    return {
      isChatOpen: false,
      chatStarted: false,
      messageInput: '',
      messages: [],
      unreadCount: 0,
      isTyping: false,
      
      // WebSocket
      stompClient: null,
      isConnected: false,
      
      // 채팅방 정보
      roomId: null,
      userInfo: null,
      
      // FAQ
      faqs: [
        {
          id: 1,
          question: "체크인은 몇 시부터 가능한가요?",
          answer: "호텔마다 체크인 시작 시간이 다릅니다. 예약 확인 페이지에서 해당 객실의 체크인 시간을 확인해주세요."
        },
        {
          id: 2,
          question: "체크아웃은 몇 시까지 해야 하나요?",
          answer: "호텔마다 체크아웃 시간이 다르니 예약 상세 페이지에서 정확한 시간을 확인해주세요."
        },
        {
          id: 3,
          question: "조식을 신청하려면 어떻게 해야 하나요?",
          answer: "일부 객실은 조식이 포함되어 있지 않습니다. 예약 시 조식 옵션을 선택하거나 호텔에 직접 문의해주세요."
        },
        {
          id: 4,
          question: "예약 취소나 환불은 언제까지 가능한가요?",
          answer: "예약 취소 및 환불은 대부분 입실 전까지만 가능합니다. 세부 조건은 예약 확인 페이지에서 확인해주세요."
        },
        {
          id: 5,
          question: "반려동물과 함께 숙박할 수 있나요?",
          answer: "반려동물 동반 가능 여부는 객실마다 다릅니다. 예약 전 호텔 상세페이지에서 확인하거나 호텔에 문의해주세요."
        },
        {
          id: 6,
          question: "호텔에 주차장이 있나요?",
          answer: "호텔마다 주차 정책이 다릅니다. 주차 가능 여부와 비용은 예약 페이지에서 확인해주세요."
        }
      ]
    };
  },
  
  async mounted() {
    await this.loadUserInfo();
  },
  
  beforeUnmount() {
    this.disconnect();
  },
  
  methods: {
    async loadUserInfo() {
      const isLoggedIn = authUtils.isLoggedIn() && !authUtils.isTokenExpired();
      if (isLoggedIn) {
        this.userInfo = await authUtils.getUserInfo();
      }
    },
    
    async openChat() {
      if (!this.userInfo) {
        alert('로그인이 필요한 서비스입니다.');
        this.$router.push('/login');
        return;
      }
      
      this.isChatOpen = true;
      
      // 기존 채팅방 가져오기 또는 생성
      try {
        const response = await chatAPI.getOrCreateRoom(
          this.userInfo.id,
          formatMemberName(this.userInfo)
        );
        
        this.roomId = response.data.roomId;
        
        // 기존 메시지 로드
        await this.loadMessages();
        
        // WebSocket 연결
        this.connect();
        
      } catch (error) {
        console.error('채팅방 생성 실패:', error);
        alert('채팅방을 열 수 없습니다.');
      }
    },
    
    closeChat() {
      this.isChatOpen = false;
      this.disconnect();
    },
    
    startChat() {
      this.chatStarted = true;
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    async loadMessages() {
      try {
        const response = await chatAPI.getMessages(this.roomId);
        this.messages = response.data || [];
        
        if (this.messages.length > 0) {
          this.chatStarted = true;
        }
        
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        
        // 읽음 처리
        await chatAPI.markAsRead(this.roomId, 'ADMIN');
        
      } catch (error) {
        console.error('메시지 로드 실패:', error);
      }
    },
    
    connect() {
      const socket = new SockJS('http://localhost:8089/ws-chat');
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });
      
      this.stompClient.onConnect = () => {
        console.log('✅ WebSocket 연결 성공');
        this.isConnected = true;
        
        // 채팅방 구독
        this.stompClient.subscribe(`/topic/chat/${this.roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          this.messages.push(receivedMessage);
          
          if (receivedMessage.senderType !== 'CUSTOMER') {
            this.unreadCount++;
          }
          
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        });
      };
      
      this.stompClient.onStompError = (frame) => {
        console.error('❌ WebSocket 오류:', frame);
      };
      
      this.stompClient.activate();
    },
    
    disconnect() {
      if (this.stompClient && this.isConnected) {
        this.stompClient.deactivate();
        this.isConnected = false;
        console.log('🔌 WebSocket 연결 해제');
      }
    },
    
    sendMessage() {
      if (!this.messageInput.trim() || !this.isConnected) return;
      
      const message = {
        type: 'CHAT',
        roomId: this.roomId,
        senderId: this.userInfo.id,
        senderName: formatMemberName(this.userInfo),
        senderType: 'CUSTOMER',
        content: this.messageInput.trim(),
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      this.stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message)
      });
      
      this.messageInput = '';
    },
    
    sendFAQ(faq) {
      if (!this.isConnected) {
        this.startChat();
        setTimeout(() => this.sendFAQ(faq), 500);
        return;
      }
      
      // FAQ 질문 전송
      const questionMessage = {
        type: 'FAQ',
        roomId: this.roomId,
        senderId: this.userInfo.id,
        senderName: formatMemberName(this.userInfo),
        senderType: 'CUSTOMER',
        content: faq.question,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      this.stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(questionMessage)
      });
      
      // 자동 답변 (1초 후)
      setTimeout(() => {
        const answerMessage = {
          type: 'CHAT',
          roomId: this.roomId,
          senderId: 0,
          senderName: '상담사',
          senderType: 'ADMIN',
          content: faq.answer,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        
        this.stompClient.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(answerMessage)
        });
      }, 1000);
      
      this.chatStarted = true;
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      }
    }
  }
};
</script>

<style scoped>
/* 채팅 버튼 */
.chat-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(141, 211, 187, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
}

.chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(141, 211, 187, 0.5);
}

.chat-button.has-notification {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(141, 211, 187, 0.4);
  }
  50% {
    box-shadow: 0 4px 24px rgba(141, 211, 187, 0.8);
  }
}

.chat-icon {
  width: 30px;
  height: 30px;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid white;
}

/* 채팅 창 */
.chat-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 헤더 */
.chat-header {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  padding: 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.chat-header h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.chat-header p {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* FAQ 섹션 */
.faq-section {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.faq-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #112211;
  margin: 0 0 16px 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.faq-item {
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #8DD3BB;
  background: rgba(141, 211, 187, 0.05);
  transform: translateX(4px);
}

.start-chat-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.start-chat-btn:hover {
  transform: translateY(-2px);
}

/* 메시지 영역 */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
}

.message {
  display: flex;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.sent .message-bubble {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.received .message-bubble {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.message-sender {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.8;
}

.message.sent .message-sender {
  text-align: right;
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-time {
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
}

.message.sent .message-time {
  text-align: right;
}

/* 타이핑 인디케이터 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  width: fit-content;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #8DD3BB;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 입력 영역 */
.chat-input {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
  border-radius: 0 0 16px 16px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
}

.message-input:focus {
  border-color: #8DD3BB;
}

.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn img {
  width: 20px;
  height: 20px;
}

/* 스크롤바 */
.chat-messages::-webkit-scrollbar,
.faq-section::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track,
.faq-section::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb,
.faq-section::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover,
.faq-section::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 반응형 */
@media (max-width: 768px) {
  .chat-window {
    width: calc(100vw - 32px);
    height: calc(100vh - 100px);
    bottom: 16px;
    right: 16px;
  }
  
  .chat-button {
    bottom: 16px;
    right: 16px;
    width: 56px;
    height: 56px;
  }
}
</style>