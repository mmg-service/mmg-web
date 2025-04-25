<template>
  <div class="body-wrapper">
    <div class="register-container">
      <div class="food-image food-1"></div>
      <div class="food-image food-2"></div>
      <div class="food-image food-3"></div>
      
      <div class="header">
        <i class="fas fa-user-plus header-icon"></i>
        <span>MMG 회원가입</span>
      </div>
      
      <div class="logo-area">
        <div class="logo-circle">
          <span class="logo-text">MMG</span>
        </div>
        <div class="app-slogan">맛있는 메뉴와 맛집을 찾아드립니다</div>
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label for="username">아이디</label>
          <div class="input-wrapper">
            <i class="fas fa-mobile-alt input-icon"></i>
            <input 
              type="text" 
              id="username"
              v-model="username" 
              placeholder="아이디를 입력해주세요." 
              class="form-input" 
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">비밀번호</label>
          <div class="input-wrapper">
            <i class="fas fa-key input-icon"></i>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="비밀번호를 8자 이상 입력해주세요" 
              class="form-input" 
            />
          </div>
        </div>
        
        <button 
          class="btn-primary" 
          @click="signup" 
          :disabled="!canRegister"
          :class="{ 'btn-disabled': !canRegister }"
        >
          <i class="fas fa-check-circle"></i> 회원가입
        </button>
        
        <div class="login-link">
          이미 회원이신가요? <span @click="goToLogin">로그인하기</span>
        </div>
      </div>
      
      <div class="features-preview">
        <div class="feature-item">
          <div class="feature-image feature-1"></div>
          <span>맛집 찾기</span>
        </div>
        <div class="feature-item">
          <div class="feature-image feature-2"></div>
          <span>메뉴 추천</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import authService from '@/services/auth.service'
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');

// 아이디/비밀번호 확인 및 가입 가능 여부
const canRegister = computed(() => {
  return username.value.length && password.value.length >= 8; // 아이디/비밀번호가 입력되어 있으면 버튼 활성화
});

// 회원가입 및 인증 처리 함수
const signup = async () => {
  try { 
    const res = await authService.signup({
      username: username.value,
      password: password.value
    })

    if(res.message !== ""){
      completeRegistration();
    }
  } catch (error) {
    console.error('회원가입 실패:', error);
    alert('회원가입 실패');
  }
};

// 가입 완료 함수
const completeRegistration = async () => {
  try {
    // 성공 메시지 표시
    alert('회원가입이 완료되었습니다!');
    
    // 바로 /map으로 라우팅
    router.push('/map');
  } catch (error) {
    console.error('에러 발생:', error);
    // 에러 발생해도 라우팅
    // router.push('/map');
    alert('에러가 발생했습니다.')
  }
};

const goToLogin = () => {
  router.push('/login');
};

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

.body-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('https://images.unsplash.com/photo-1514986888952-8cd320577b68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  padding: 20px;
}

.body-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 0;
}

.register-container {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  margin: 20px 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF5722, #E91E63);
  color: white;
  padding: 20px;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
}

.header-icon {
  margin-right: 10px;
  font-size: 24px;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 0 15px;
  background-color: #FFF8F6;
}

.logo-circle {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #FF5722, #E91E63);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
}

.logo-text {
  color: white;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
}

.app-slogan {
  font-size: 15px;
  color: #666;
  margin-bottom: 10px;
}

.form-container {
  padding: 20px 25px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
}

.form-input {
  flex: 1;
  padding: 14px;
  padding-left: 40px;
  border: 1px solid #dde2e6;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #FF5722;
  box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.15);
  background-color: white;
}

.form-input:disabled {
  background-color: #f0f0f0;
  color: #999;
  cursor: not-allowed;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.verification-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #F1F3F5;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;
}

.verification-btn:hover:not(:disabled) {
  background-color: #E6E9ED;
}

.verification-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-success {
  background-color: #4CAF50;
  color: white;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.verification-info {
  font-size: 12px;
  color: #FF5722;
  margin-top: 5px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.info-text {
  display: flex;
  margin: 20px 0;
  padding: 15px;
  background-color: #FFF8F6;
  border-radius: 8px;
  border-left: 4px solid #FF5722;
}

.info-icon {
  font-size: 20px;
  color: #FF5722;
  margin-right: 15px;
  display: flex;
  align-items: flex-start;
}

.info-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  flex: 1;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #FF5722, #E91E63);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary i {
  margin-right: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(233, 30, 99, 0.35);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.15);
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}

.login-link span {
  color: #FF5722;
  font-weight: 600;
  cursor: pointer;
}

.login-link span:hover {
  text-decoration: underline;
}

.features-preview {
  display: flex;
  justify-content: space-around;
  background-color: #f8f8f8;
  padding: 15px;
  border-top: 1px solid #eee;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #555;
}

.feature-image {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  margin-bottom: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.feature-1 {
  background-image: url('https://images.unsplash.com/photo-1554679665-f5537f187268?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.feature-2 {
  background-image: url('https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.food-image {
  position: absolute;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  z-index: 2;
}

.food-1 {
  width: 85px;
  height: 85px;
  top: -25px;
  right: -25px;
  background-image: url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  border: 3px solid #FF5722;
}

.food-2 {
  width: 65px;
  height: 65px;
  bottom: 150px;
  right: -20px;
  background-image: url('https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  border: 3px solid #E91E63;
}

.food-3 {
  width: 70px;
  height: 70px;
  bottom: -25px;
  left: -25px;
  background-image: url('https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  border: 3px solid #FF9800;
}

@media (max-width: 480px) {
  .register-container {
    margin: 0;
    border-radius: 0;
    max-width: 100%;
    height: 100%;
  }
  
  .body-wrapper {
    padding: 0;
  }
}
</style>