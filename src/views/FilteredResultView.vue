<template>
    <div class="filtered-results">
      <header-bar title="추천 결과" :backButton="true"></header-bar>
      
      <div class="filter-summary">
        <div class="filter-tags">
          <div v-if="activeFilters.theme" class="filter-tag">
            {{ getThemeLabel(activeFilters.theme) }}
          </div>
          <div v-if="activeFilters.people" class="filter-tag">
            {{ getPeopleLabel(activeFilters.people) }}
          </div>
          <div v-if="activeFilters.situation" class="filter-tag">
            {{ getSituationLabel(activeFilters.situation) }}
          </div>
        </div>
        
        <div class="result-actions">
          <button class="action-btn" :class="{ active: viewMode === 'best' }" @click="setViewMode('best')">
            베스트 맛집
          </button>
          <button class="action-btn" :class="{ active: viewMode === 'my' }" @click="setViewMode('my')">
            내가 찜한
          </button>
        </div>
      </div>
      
      <div class="results-list" v-if="!loading">
        <div v-if="restaurants.length === 0" class="no-results">
          검색 결과가 없습니다.
        </div>
        
        <div v-else>
          <div v-for="(restaurant, index) in restaurants" :key="restaurant.id" class="restaurant-item">
            <div class="ranking">{{ index + 1 }}. {{ restaurant.name }} <span class="location">{{ restaurant.location }}</span></div>
            <div class="restaurant-info">
              <div class="rating">★ {{ restaurant.rating }} <span class="review-count">리뷰 {{ restaurant.reviewCount }}명</span></div>
              <div class="categories">{{ restaurant.categories.join(', ') }}</div>
              <div class="distance">거리 {{ restaurant.distance }}m 이내</div>
            </div>
            
            <div class="ai-recommendation" v-if="restaurant.aiRecommendation">
              <div class="ai-title">AI 추천 이유</div>
              <div class="ai-reason">{{ restaurant.aiRecommendation }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="loading">
        데이터를 불러오는 중...
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useStore } from 'vuex'
  import HeaderBar from '@/components/common/HeaderBar.vue'
  
  const store = useStore()
  const viewMode = ref('best')
  
  const loading = computed(() => store.getters['restaurant/isLoading'])
  const restaurants = computed(() => store.getters['restaurant/allRestaurants'])
  const activeFilters = computed(() => store.getters['search/currentFilters'])
  
  onMounted(() => {
    // 현재 적용된 필터로 레스토랑 데이터 가져오기
    fetchFilteredRestaurants()
  })
  
  const fetchFilteredRestaurants = () => {
    store.dispatch('restaurant/filterRestaurants', activeFilters.value)
  }
  
  const setViewMode = (mode) => {
    viewMode.value = mode
    // 모드에 따라 다른 데이터 가져오기
    if (mode === 'my') {
      // 찜한 매장 가져오기 로직
    } else {
      fetchFilteredRestaurants()
    }
  }
  
  const getThemeLabel = (value) => {
    const themes = {
      'korean': '한식',
      'western': '양식',
      'japanese': '일식',
      'chinese': '중식',
      'cafe': '카페',
      'etc': '기타'
    }
    return themes[value] || value
  }
  
  const getPeopleLabel = (value) => {
    const people = {
      '1': '1인',
      '2-4': '2-4인',
      '5+': '5인+'
    }
    return people[value] || value
  }
  
  const getSituationLabel = (value) => {
    const situations = {
      'date': '데이트',
      'company': '회식',
      'friends': '친구만남',
      'lunch': '점심식사',
      'dinner': '저녁식사',
      'etc': '기타'
    }
    return situations[value] || value
  }
  </script>
  
  <style scoped>
  .filtered-results {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .filter-summary {
    padding: 15px;
    background-color: white;
    border-bottom: 1px solid #f1f3f5;
  }
  
  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .filter-tag {
    background-color: #e7f5ff;
    color: #4285F4;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .result-actions {
    display: flex;
    border-bottom: 1px solid #f1f3f5;
  }
  
  .action-btn {
    flex: 1;
    border: none;
    background: none;
    padding: 12px;
    font-size: 16px;
    color: #868e96;
    position: relative;
  }
  
  .action-btn.active {
    color: #ff6b6b;
    font-weight: bold;
  }
  
  .action-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #ff6b6b;
  }
  
  .results-list {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
  }
  
  .no-results {
    text-align: center;
    padding: 30px;
    color: #868e96;
  }
  
  .restaurant-item {
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .ranking {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .location {
    font-size: 14px;
    font-weight: normal;
    color: #868e96;
    margin-left: 5px;
  }
  
  .restaurant-info {
    margin-bottom: 15px;
  }
  
  .rating {
    color: #f59f00;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .review-count {
    color: #868e96;
    font-weight: normal;
    font-size: 14px;
  }
  
  .categories {
    color: #495057;
    margin-bottom: 5px;
  }
  
  .distance {
    color: #495057;
  }
  
  .ai-recommendation {
    background-color: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
  }
  
  .ai-title {
    color: #4285F4;
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
  }
  
  .ai-reason {
    color: #495057;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: #868e96;
  }
  </style>