<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
// 전역 로직이 필요한 경우 여기에 추가
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Sans KR', sans-serif;
}

.app-container {
  max-width: 480px;
  margin: 0 auto;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.header {
  background-color: #4285F4;
  color: white;
  padding: 15px;
  text-align: left;
  font-weight: bold;
  font-size: 18px;
}

.btn-primary {
  background-color: #FF6B6B;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #F1F3F5;
  color: #495057;
  border: 1px solid #DDE2E6;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
}

.filter-btn {
  border: 1px solid #DDE2E6;
  border-radius: 20px;
  padding: 8px 15px;
  margin: 5px;
  font-size: 14px;
  background-color: white;
}

.filter-btn.active {
  background-color: #4285F4;
  color: white;
  border: 1px solid #4285F4;
}
</style>