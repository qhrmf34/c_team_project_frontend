<template>
  <div class="admin-chat-container">
    <!-- 좌측: 채팅방 목록 -->
    <div class="chat-rooms-sidebar">
      <div class="sidebar-header">
        <h3>활성 상담 ({{ activeRooms.length }})</h3>
        <button @click="refreshRooms" class="refresh-btn">🔄</button>
      </div>
      
      <div class="rooms-list">
        <div 
          v-for="room in activeRooms" 
          :key="room.id"
          @click="selectRoom(room)"
          :class="['room-item', { active: selectedRoom?.id === room.id }]"
        >
          <div class="room-avatar">
            <img 
              v-if="room.customerProfileImage" 
              :src="room.customerProfileImage" 
              :alt="room.customerName"
              @error="handleImageError"
              class="avatar-img"
            >
            <span v-else class="avatar-initial">{{ room.customerName.charAt(0) }}</span>
          </div>
          
          <div class="room-info">
            <div class="room-name">{{ room.customerName }}</div>
            <div class="room-preview">마지막 메시지...</div>
          </div>
          
          <div class="room-meta">
            <div class="room-time">{{ formatTime(room.updatedAt) }}</div>
            <div v-if="room.unreadCount > 0" class="unread-badge">
              {{ room.unreadCount }}
            </div>
          </div>
        </div>
        
        <div v-if="activeRooms.length === 0" class="empty-rooms">
          <div class="empty-icon">💬</div>
          <p>활성 상담이 없습니다</p>
        </div>
      </div>
    </div>

    <!-- 우측: 채팅 창 -->
    <div class="chat-conversation">
      <div v-if="!selectedRoom" class="no-room-selected">
        <div class="empty-icon">👈</div>
        <h3>상담을 선택해주세요</h3>
        <p>좌측에서 고객 상담을 선택하면 대화를 시작할 수 있습니다.</p>
      </div>

      <div v-else class="chat-active">
        <!-- 채팅 헤더 -->
        <div class="chat-conversation-header">
          <div class="header-info">
            <div class="customer-avatar">
              <img 
                v-if="selectedRoom.customerProfileImage" 
                :src="selectedRoom.customerProfileImage" 
                :alt="selectedRoom.customerName"
                @error="handleImageError"
                class="avatar-img"
              >
              <span v-else class="avatar-initial">{{ selectedRoom.customerName.charAt(0) }}</span>
            </div>
            
            <div>
              <h3>{{ selectedRoom.customerName }}</h3>
              <p>고객 ID: {{ selectedRoom.customerId }}</p>
            </div>
          </div>
          
          <div class="header-actions">
            <button @click="closeCurrentRoom" class="close-room-btn">
              상담 종료
            </button>
          </div>
        </div>

        <!-- 메시지 영역 -->
        <div class="chat-conversation-messages" ref="messagesContainer">
          <div 
            v-for="(message, index) in currentMessages" 
            :key="index"
            :class="['admin-message', message.senderType === 'ADMIN' ? 'sent' : 'received']"
          >
            <!-- ✅ 고객 메시지일 때만 프로필 이미지 표시 -->
            <div v-if="message.senderType === 'CUSTOMER'" class="message-avatar-wrapper">
              <img 
                v-if="selectedRoom.customerProfileImage"
                :src="selectedRoom.customerProfileImage" 
                :alt="selectedRoom.customerName"
                class="message-avatar"
                @error="handleImageError"
              >
              <div v-else class="message-avatar-fallback">
                {{ selectedRoom.customerName.charAt(0) }}
              </div>
            </div>
            
            <!-- 메시지 말풍선 -->
            <div class="admin-message-bubble">
              <div class="admin-message-sender">{{ message.senderName }}</div>
              <div class="admin-message-content">{{ message.content }}</div>
              <div class="admin-message-time">
                {{ formatMessageTime(message.timestamp) }}
              </div>
            </div>
          </div>
          
          <div v-if="isCustomerTyping" class="admin-typing-indicator">
            <span></span>
            <span></span>
            <span></span>
            고객이 입력 중...
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="chat-conversation-input">
          <!-- 빠른 답변 -->
          <div class="quick-replies">
            <button 
              v-for="reply in quickReplies" 
              :key="reply.id"
              @click="sendQuickReply(reply.text)"
              class="quick-reply-btn"
            >
              {{ reply.text }}
            </button>
          </div>
          
          <div class="input-area">
            <textarea 
              v-model="messageInput"
              @keydown.enter.exact.prevent="sendAdminMessage"
              placeholder="메시지를 입력하세요... (Enter: 전송, Shift+Enter: 줄바꿈)"
              class="admin-message-input"
              rows="3"
            ></textarea>
            <button 
              @click="sendAdminMessage" 
              :disabled="!messageInput.trim()"
              class="admin-send-btn"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { chatAPI, adminAPI, memberImageAPI, authUtils } from '@/utils/commonAxios'
import { formatMemberName } from '@/utils/nameFormatter'

export default {
  name: 'AdminChatPanel',
  data() {
    return {
      activeRooms: [],
      selectedRoom: null,
      currentMessages: [],
      messageInput: '',
      isCustomerTyping: false,
      
      // WebSocket
      stompClient: null,
      isConnected: false,
      
      // 관리자 정보
      adminInfo: null,
      
      // 빠른 답변
      quickReplies: [
        { id: 1, text: '안녕하세요! 무엇을 도와드릴까요?' },
        { id: 2, text: '잠시만 기다려주시면 확인해드리겠습니다.' },
        { id: 3, text: '추가로 궁금하신 사항이 있으신가요?' },
        { id: 4, text: '감사합니다. 즐거운 하루 되세요!' }
      ]
    }
  },
  
  async mounted() {
    await this.loadAdminInfo()
    await this.loadActiveRooms()
    this.connectWebSocket()
  },
  
  beforeUnmount() {
    this.disconnect()
  },
  
  methods: {
    async loadAdminInfo() {
      this.adminInfo = await authUtils.getUserInfo()
    },
    
    // ✅ 채팅방 목록 로드
    async loadActiveRooms() {
      try {
        const response = await chatAPI.getActiveRooms()
        this.activeRooms = response.data || []

        // ✅ 각 고객의 프로필 이미지 로드
        for (const room of this.activeRooms) {
          room.customerProfileImage = await this.loadCustomerProfileImage(room.customerId)
        }
      } catch (error) {
        console.error('채팅방 목록 로드 실패:', error)
      }
    },
  
    
  // ✅ 고객 프로필 이미지 로드 (기존 API 활용)
// ✅ 고객 프로필 이미지 로드
async loadCustomerProfileImage(customerId) {
  try {
    console.log('🔍 프로필 이미지 요청:', customerId)
    const response = await memberImageAPI.getProfileImageByMemberId(customerId)
    console.log('📦 응답:', response)
    
    if (response && response.data && response.data.memberImagePath) {
      const imageUrl = this.getImageUrl(response.data.memberImagePath)
      console.log('✅ 이미지 URL:', imageUrl)
      return imageUrl
    }
    
    console.log('⚠️ 이미지 없음')
    return null
  } catch (error) {
    console.error('❌ 이미지 로드 실패:', error)
    return null
  }
},
  
  // ✅ 이미지 URL 변환
  getImageUrl(imagePath) {
    if (!imagePath) return '/images/hotel_account_img/member.jpg'
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/images/')) return imagePath
    return adminAPI.getImageUrl(imagePath)
  },
  
  // ✅ 이미지 로드 실패 처리
  handleImageError(event) {
    event.target.style.display = 'none'
  },
  
    
    async refreshRooms() {
      await this.loadActiveRooms()
    },
    
    async selectRoom(room) {
      this.selectedRoom = room
      await this.loadRoomMessages(room.roomId)
      
      // 읽음 처리
      await chatAPI.markAsRead(room.roomId, 'CUSTOMER')
      
      // 안 읽은 수 초기화
      room.unreadCount = 0
    },
    
    async loadRoomMessages(roomId) {
      try {
        const response = await chatAPI.getMessages(roomId)
        this.currentMessages = response.data || []
        
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (error) {
        console.error('메시지 로드 실패:', error)
      }
    },
    
    connectWebSocket() {
      const socket = new SockJS('https://mjc813k.softagape.com/ws-chat')
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
      })
      
      this.stompClient.onConnect = () => {
        console.log('✅ 관리자 WebSocket 연결 성공')
        this.isConnected = true
        
        // 모든 새 메시지 알림 구독
        this.stompClient.subscribe('/topic/admin/notifications', (message) => {
          const notification = JSON.parse(message.body)
          console.log('새 메시지 알림:', notification)
          
          // 채팅방 목록 갱신
          this.loadActiveRooms()
          
          // 알림음 재생 (선택사항)
          // this.playNotificationSound()
        })
        
        // 현재 선택된 채팅방 구독
        if (this.selectedRoom) {
          this.subscribeToRoom(this.selectedRoom.roomId)
        }
      }
      
      this.stompClient.onStompError = (frame) => {
        console.error('❌ WebSocket 오류:', frame)
      }
      
      this.stompClient.activate()
    },
    
    subscribeToRoom(roomId) {
      if (this.isConnected) {
        this.stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body)
          this.currentMessages.push(receivedMessage)
          
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        })
      }
    },
    
    disconnect() {
      if (this.stompClient && this.isConnected) {
        this.stompClient.deactivate()
        this.isConnected = false
        console.log('🔌 관리자 WebSocket 연결 해제')
      }
    },
    
    sendAdminMessage() {
      if (!this.messageInput.trim() || !this.isConnected || !this.selectedRoom) return
      
      const message = {
        type: 'CHAT',
        roomId: this.selectedRoom.roomId,
        senderId: this.adminInfo.id,
        senderName: formatMemberName(this.adminInfo) + ' (상담사)',
        senderType: 'ADMIN',
        content: this.messageInput.trim(),
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      this.stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(message)
      })
      
      this.messageInput = ''
    },
    
    sendQuickReply(text) {
      this.messageInput = text
      this.sendAdminMessage()
    },
    
    async closeCurrentRoom() {
      if (!confirm('정말 이 상담을 종료하시겠습니까?')) return
      
      try {
        await chatAPI.closeRoom(this.selectedRoom.roomId)
        
        // 종료 메시지 전송
        const closeMessage = {
          type: 'CHAT',
          roomId: this.selectedRoom.roomId,
          senderId: this.adminInfo.id,
          senderName: '시스템',
          senderType: 'ADMIN',
          content: '상담이 종료되었습니다. 감사합니다.',
          timestamp: new Date().toISOString(),
          isRead: false
        }
        
        this.stompClient.publish({
          destination: '/app/chat.send',
          body: JSON.stringify(closeMessage)
        })
        
        this.selectedRoom = null
        this.currentMessages = []
        await this.loadActiveRooms()
        
        alert('상담이 종료되었습니다.')
      } catch (error) {
        console.error('상담 종료 실패:', error)
        alert('상담 종료에 실패했습니다.')
      }
    },
    
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      
      if (diffMins < 1) return '방금 전'
      if (diffMins < 60) return `${diffMins}분 전`
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`
      return `${Math.floor(diffMins / 1440)}일 전`
    },
    
    formatMessageTime(timestamp) {
      const date = new Date(timestamp)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    },
    
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      }
    }
  },
  
  watch: {
    selectedRoom(newRoom, oldRoom) {
      if (newRoom && newRoom.roomId !== oldRoom?.roomId) {
        this.subscribeToRoom(newRoom.roomId)
      }
    }
  }
}
</script>

<style scoped>
.admin-chat-container {
  display: flex;
  height: calc(100vh - 300px); /* 고정 높이 */
  max-height: 700px;
  min-height: 500px;
  background: white;
}

/* 좌측 사이드바 */
.chat-rooms-sidebar {
  width: 320px;
  border-right: 2px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #112211;
  margin: 0;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(141, 211, 187, 0.1);
}

.rooms-list {
  flex: 1;
  overflow-y: auto;
}

.room-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.3s ease;
}

.room-item:hover {
  background: rgba(141, 211, 187, 0.05);
}

.room-item.active {
  background: rgba(141, 211, 187, 0.1);
  border-left: 4px solid #8DD3BB;
}

.room-avatar,
.customer-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  position: relative;
  overflow: hidden;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-initial {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.room-info {
  flex: 1;
  min-width: 0;
}

.room-name {
  font-weight: 600;
  font-size: 14px;
  color: #112211;
  margin-bottom: 4px;
}

.room-preview {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.room-time {
  font-size: 11px;
  color: #94a3b8;
}

.unread-badge {
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.empty-rooms {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 우측 채팅 창 */
.chat-conversation {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.no-room-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  padding: 40px;
  text-align: center;
}

.no-room-selected .empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-room-selected h3 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.no-room-selected p {
  font-size: 14px;
  margin: 0;
}

.chat-active {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%; 
}

.chat-conversation-header {
  padding: 20px 24px;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}


.header-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #112211;
  margin: 0 0 4px 0;
}

.header-info p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.close-room-btn {
  padding: 10px 20px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-room-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.chat-conversation-messages {
  flex: 1; 
  padding: 24px;
  overflow-y: auto; /* ✅ 스크롤 */
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
}

.admin-message {
  display: flex;
  align-items: flex-end;
}

.admin-message.sent {
  justify-content: flex-end;
}

.admin-message.received {
  justify-content: flex-start;
}

.admin-message-bubble {
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 16px;
}

.admin-message.sent .admin-message-bubble {
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  border-bottom-right-radius: 4px;
}

.admin-message.received .admin-message-bubble {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.admin-message-sender {
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.8;
}

.admin-message.sent .admin-message-sender {
  text-align: right;
}

.admin-message-content {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.admin-message-time {
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.7;
}

.admin-message.sent .admin-message-time {
  text-align: right;
}

.admin-typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  width: fit-content;
  font-size: 12px;
  color: #64748b;
}

.admin-typing-indicator span {
  width: 8px;
  height: 8px;
  background: #8DD3BB;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.admin-typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.admin-typing-indicator span:nth-child(3) {
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

.chat-conversation-input {
  flex-shrink: 0; /* ✅ 크기 고정 */
  border-top: 2px solid #f1f5f9;
  background: white;
  padding: 16px 24px;
}
/* ✅ 메시지 옆 프로필 이미지 */
.message-avatar-wrapper {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.message-avatar-fallback {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
}
.quick-replies {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.quick-reply-btn {
  padding: 8px 12px;
  background: rgba(141, 211, 187, 0.1);
  color: #0f766e;
  border: 1px solid rgba(141, 211, 187, 0.3);
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-reply-btn:hover {
  background: rgba(141, 211, 187, 0.2);
  border-color: #8DD3BB;
}

.input-area {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.admin-message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.3s ease;
}

.admin-message-input:focus {
  border-color: #8DD3BB;
}

.admin-send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #8DD3BB, #7bc7b0);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.admin-send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(141, 211, 187, 0.4);
}

.admin-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 스크롤바 */
.rooms-list::-webkit-scrollbar,
.chat-conversation-messages::-webkit-scrollbar {
  width: 6px;
}

.rooms-list::-webkit-scrollbar-track,
.chat-conversation-messages::-webkit-scrollbar-track {
  background: transparent;
}

.rooms-list::-webkit-scrollbar-thumb,
.chat-conversation-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.rooms-list::-webkit-scrollbar-thumb:hover,
.chat-conversation-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 반응형 */
@media (max-width: 1024px) {
  .admin-chat-container {
    flex-direction: column;
    height: auto;
  }
  
  .chat-rooms-sidebar {
    width: 100%;
    max-height: 300px;
    border-right: none;
    border-bottom: 2px solid #f1f5f9;
  }
  
  .chat-conversation {
    min-height: 500px;
  }
}
</style>