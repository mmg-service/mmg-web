<template>
    <div class="curation-view">
      <header-bar title="회원별 큐레이션" :backButton="true"></header-bar>
      
      <div class="curation-items">
        <div class="curation-item">
          <div class="item-header">
            <h3>회원 1: 회원가입</h3>
            <div class="item-subtitle">큐레이션 ID 1: 회원가입</div>
          </div>
        </div>
        
        <div class="curation-item">
          <div class="item-header">
            <h3>회원 2: 홍 회원(지도)</h3>
            <div class="item-subtitle">큐레이션 ID 2: 주변 맛집 표시</div>
          </div>
        </div>
        
        <div class="curation-item">
          <div class="item-header">
            <h3>회원 3: 검색 조건 입력</h3>
            <div class="item-subtitle">큐레이션 ID 6: 검색 조건 입력</div>
          </div>
        </div>
        
        <div class="curation-item">
          <div class="item-header">
            <h3>회원 4: 매장/메뉴 추천 결과</h3>
            <div class="item-subtitle">큐레이션 ID 4: 맛집 추천 결과</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import HeaderBar from '@/components/common/HeaderBar.vue'
  </script>
  
  <style scoped>
  .curation-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .curation-items {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
  }
  
  .curation-item {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .item-header h3 {
    font-size: 16px;
    font-weight: bold;
    color: #4285F4;
    margin-bottom: 5px;
  }
  
  .item-subtitle {
    font-size: 14px;
    color: #868e96;
  }
  </style>