<template>
    <div class="detail-view">
      <header-bar title="매장 상세" :backButton="true"></header-bar>
      
      <div class="restaurant-header">
        <h1 class="restaurant-name">{{ restaurant?.name || '로딩 중...' }}</h1>
        <div class="restaurant-location">{{ restaurant?.location || '' }} | {{ restaurant?.categories?.join(', ') || '' }}</div>
        <div class="restaurant-rating">
          <span class="stars">★ {{ restaurant?.rating || '0.0' }}</span>
          <span class="review-count">({{ restaurant?.reviewCount || '0' }})</span>
        </div>
        <div class="business-hours">영업중 | 오전 11:00 - 오후 10:00</div>
      </div>
      
      <div class="features">
        <div class="feature-item">
          <div class="icon map"></div>
          <div class="label">메뉴</div>
        </div>
        <div class="feature-item">
          <div class="icon call"></div>
          <div class="label">전화</div>
        </div>
        <div class="feature-item">
          <div class="icon share"></div>
          <div class="label">공유</div>
        </div>
        <div class="feature-item">
          <div class="icon bookmark"></div>
          <div class="label">저장</div>
        </div>
      </div>
      
      <div class="menu-section">
        <h3>사쿠라리</h3>
        <div class="menu-price">22,000원</div>
        <div class="menu-description">
          자연산 연어와 같은 품미의 소스가 어우러진 시그니처 메뉴입니다.
        </div>
      </div>
      
      <div class="set-menu-section">
        <h3>와인 세트</h3>
        <div class="menu-price">48,000원</div>
        <div class="menu-description">
          세트 추천 와인과 페어링 플레이트
        </div>
      </div>
      
      <div class="ai-recommendation">
        <h3>AI 추천 이유</h3>
        <ol class="recommendation-list">
          <li>당신의 프로필과 선호도 분석 결과</li>
          <li>2-4인 모임에 적합한 메뉴</li>
          <li>친구 만남에 어울리는 분위기와 맛</li>
        </ol>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute } from 'vue-router'
  import HeaderBar from '@/components/common/HeaderBar.vue'
  
  const store = useStore()
  const route = useRoute()
  
  const restaurantId = computed(() => route.params.id)
  const restaurant = computed(() => store.getters['restaurant/restaurantDetail'])
  
  onMounted(() => {
    // 레스토랑 상세 정보 가져오기
    store.dispatch('restaurant/fetchRestaurantDetail', restaurantId.value)
  })
  </script>
  
  <style scoped>
  .detail-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f8f9fa;
  }
  
  .restaurant-header {
    padding: 20px;
    background-color: white;
    border-bottom: 1px solid #f1f3f5;
  }
  
  .restaurant-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .restaurant-location {
    color: #868e96;
    margin-bottom: 8px;
  }
  
  .restaurant-rating {
    margin-bottom: 5px;
  }
  
  .stars {
    color: #f59f00;
    font-weight: bold;
  }
  
  .review-count {
    color: #868e96;
    margin-left: 5px;
  }
  
  .business-hours {
    color: #495057;
  }
  
  .features {
    display: flex;
    padding: 15px;
    background-color: white;
    margin-bottom: 10px;
  }
  
  .feature-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f1f3f5;
    margin-bottom: 5px;
  }
  
  .label {
    font-size: 14px;
    color: #495057;
  }
  
  .menu-section, .set-menu-section {
    padding: 20px;
    background-color: white;
    margin-bottom: 10px;
  }
  
  .menu-price {
    color: #ff6b6b;
    font-weight: bold;
    font-size: 18px;
    margin: 5px 0;
  }
  
  .menu-description {
    color: #868e96;
    line-height: 1.5;
  }
  
  .ai-recommendation {
    padding: 20px;
    background-color: white;
  }
  
  .ai-recommendation h3 {
    margin-bottom: 10px;
    color: #4285F4;
  }
  
  .recommendation-list {
    padding-left: 20px;
    line-height: 1.6;
  }
  
  .recommendation-list li {
    margin-bottom: 5px;
    color: #495057;
  }
  </style>