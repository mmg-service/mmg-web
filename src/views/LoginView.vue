<template>
  <div class="body-wrapper">
    <div class="login-container">
      <div class="food-image food-1"></div>
      <div class="food-image food-2"></div>
      <div class="food-image food-3"></div>
      <div class="food-image food-4"></div>
      
      <div class="header">
        <i class="fas fa-utensils food-icon"></i>맛집 추천 서비스
      </div>
      
      <div class="logo-area">
        <div class="logo-circle">
          <span class="logo-text">MMG</span>
        </div>
        <div class="app-name">MMG</div>
        <div class="app-slogan">음식과 메뉴를 AI로 추천받는 서비스</div>
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label for="username">아이디</label>
          <i class="fas fa-mobile-alt input-icon"></i>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="아이디" 
            class="form-input" 
          />
        </div>
        
        <div class="form-group">
          <label for="password">비밀번호</label>
          <i class="fas fa-key input-icon"></i>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="비밀번호" 
            class="form-input" 
          />
        </div>
        
        <button class="btn-primary" @click="login">
          <i class="fas fa-sign-in-alt"></i> 로그인
        </button>
        
        <div class="register-link">
          아직 회원이 아니신가요?<span @click="goToRegister">회원가입</span>
        </div>
      </div>
      
      <div class="food-menu-showcase">
        <div class="menu-item">
          <div class="menu-image menu-image-1"></div>
          <span>맛집 찾기</span>
        </div>
        <div class="menu-item">
          <div class="menu-image menu-image-2"></div>
          <span>메뉴 추천</span>
        </div>
        <div class="menu-item">
          <div class="menu-image menu-image-3"></div>
          <span>주변 검색</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const login = async () => {
  if (!username.value) {
    alert('아이디를 입력해주세요.')
    return
  }
  
  try {
    await store.dispatch('auth/login', {
      username: username.value,
      password: password.value
    })
    router.push('/map')
  } catch (error) {
    console.error('로그인 실패:', error)
    alert('로그인에 실패했습니다. 다시 시도해주세요.')
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

.body-wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.body-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 1;
}

.login-container {
  width: 100%;
  max-width: 450px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.header {
  background: linear-gradient(135deg, #FF5722, #E91E63);
  color: white;
  padding: 18px 20px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  position: relative;
}

.header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='1' d='M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,90.7C1120,85,1280,107,1360,117.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
  background-size: cover;
}

.food-icon {
  display: inline-block;
  margin-right: 10px;
  font-size: 20px;
}

.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 0 10px;
  background: linear-gradient(to bottom, rgba(240, 240, 240, 0.5), transparent);
}

.logo-circle {
  width: 80px;
  height: 80px;
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
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1px;
}

.app-name {
  font-size: 28px;
  font-weight: 700;
  color: #E91E63;
  margin-bottom: 5px;
}

.app-slogan {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.form-container {
  padding: 15px 25px;
}

.form-group {
  margin-bottom: 18px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 14px;
  padding-left: 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-input:focus {
  outline: none;
  border-color: #FF5722;
  box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.2);
  background-color: white;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 42px;
  color: #888;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #FF5722, #E91E63);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(233, 30, 99, 0.4);
}

.btn-primary:active {
  transform: translateY(1px);
}

.register-link {
  text-align: center;
  margin-top: 15px;
  color: #555;
  font-size: 14px;
}

.register-link span {
  color: #FF5722;
  cursor: pointer;
  font-weight: 600;
  margin-left: 5px;
}

.register-link span:hover {
  text-decoration: underline;
}

.food-menu-showcase {
  display: flex;
  justify-content: space-around;
  padding: 15px 10px;
  background-color: #fff9f9;
  border-top: 1px solid #ffe0e0;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.menu-image {
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-size: cover;
  background-position: center;
  margin-bottom: 8px;
  border: 2px solid white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.menu-image-1 {
  background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.menu-image-2 {
  background-image: url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.menu-image-3 {
  background-image: url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
}

.food-image {
  position: absolute;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  z-index: 3;
}

.food-1 {
  width: 90px;
  height: 90px;
  top: -25px;
  right: -25px;
  background-image: url('https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  border: 3px solid #FF5722;
}

.food-2 {
  width: 75px;
  height: 75px;
  bottom: -20px;
  left: -20px;
  background-image: url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  border: 3px solid #E91E63;
}

.food-3 {
  width: 55px;
  height: 55px;
  top: 50px;
  left: -15px;
  background-image: url('https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  border: 2px solid #FF9800;
}

.food-4 {
  width: 60px;
  height: 60px;
  bottom: 70px;
  right: -10px;
  background-image: url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
  border: 2px solid #FFEB3B;
}
</style>
