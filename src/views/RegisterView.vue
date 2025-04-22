<template>
    <div class="register-container">
      <div class="header">회원가입</div>
      
      <div class="form-container">
        <div class="form-group">
          <label>휴대폰 번호</label>
          <input type="text" v-model="phoneNumber" placeholder="휴대폰 번호" class="form-input" />
        </div>
        
        <div class="form-group">
          <label>인증번호</label>
          <input type="text" v-model="verificationCode" placeholder="인증번호" class="form-input" />
        </div>
        
        <div class="info-text">
          <p>• 휴대폰 문자인증으로 시작할 것을 처리합니다.</p>
          <p>• 기입한 휴대폰 번호로 인증됩니다.</p>
        </div>
        
        <button class="btn-primary full-width" @click="register">인증요청</button>
      </div>
      
      <div class="footer-info">
        <p>회원 1: 회원가입</p>
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
  
  const register = async () => {
    if (!phoneNumber.value) {
      alert('휴대폰 번호를 입력해주세요.')
      return
    }
    
    try {
      await store.dispatch('auth/register', {
        phoneNumber: phoneNumber.value,
        verificationCode: verificationCode.value
      })
      router.push('/login')
    } catch (error) {
      console.error('Registration failed:', error)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }
  </script>
  
  <style scoped>
  .register-container {
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
  
  .info-text {
    margin: 20px 0;
    font-size: 14px;
    color: #868e96;
    line-height: 1.5;
  }
  
  .full-width {
    width: 100%;
    padding: 15px;
    font-size: 16px;
  }
  
  .footer-info {
    padding: 15px;
    text-align: center;
    color: #4285F4;
    font-weight: bold;
    border-top: 1px solid #f1f3f5;
  }
  </style>