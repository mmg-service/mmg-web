<template>
    <div class="login-container">
      <div class="header">로그인</div>
      
      <div class="form-container">
        <div class="form-group">
          <label>휴대폰 번호</label>
          <input type="text" v-model="phoneNumber" placeholder="휴대폰 번호" class="form-input" />
        </div>
        
        <div class="form-group">
          <label>인증번호</label>
          <input type="text" v-model="verificationCode" placeholder="인증번호" class="form-input" />
        </div>
        
        <button class="btn-primary full-width" @click="login">로그인</button>
        
        <div class="register-link" @click="goToRegister">
          아직 회원이 아니신가요? 회원가입
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
  
  const phoneNumber = ref('')
  const verificationCode = ref('')
  
  const login = async () => {
    if (!phoneNumber.value) {
      alert('휴대폰 번호를 입력해주세요.')
      return
    }
    
    try {
      await store.dispatch('auth/login', {
        phoneNumber: phoneNumber.value,
        verificationCode: verificationCode.value
      })
      router.push('/map')
    } catch (error) {
      console.error('Login failed:', error)
      alert('로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }
  
  const goToRegister = () => {
    router.push('/register')
  }
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .form-container {
    flex: 1;
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #495057;
  }
  
  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #dde2e6;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .full-width {
    width: 100%;
    padding: 15px;
    font-size: 16px;
    margin-top: 20px;
  }
  
  .register-link {
    text-align: center;
    margin-top: 20px;
    color: #4285F4;
    cursor: pointer;
  }
  </style>