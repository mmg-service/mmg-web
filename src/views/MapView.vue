<template>
    <div class="map-page">
      <div class="search-bar">
        <div class="search-input">
          <input type="text" v-model="searchKeyword" placeholder="장소, 메뉴, 지역 검색" />
          <div class="search-categories">
            <button :class="['category-btn', { active: activeCategory === 'location' }]" @click="setCategory('location')">
              음식점
            </button>
            <button :class="['category-btn', { active: activeCategory === 'menu' }]" @click="setCategory('menu')">
              카페
            </button>
            <button :class="['category-btn', { active: activeCategory === 'alcohol' }]" @click="setCategory('alcohol')">
              술집
            </button>
            <button :class="['category-btn', { active: activeCategory === 'dessert' }]" @click="setCategory('dessert')">
              디저트
            </button>
            <button :class="['category-btn', { active: activeCategory === 'etc' }]" @click="setCategory('etc')">
              기타가게
            </button>
          </div>
        </div>
      </div>
  
      <div class="map-view-container">
        <MapView />
      </div>
  
      <div class="bottom-actions">
        <button class="action-btn" @click="showMyLocation">
          <i class="fas fa-location-arrow"></i>
        </button>
        <div class="recommendation">
          맛집 2+를 확인하려면?
        </div>
        <div class="page-indicator">
          내정보
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  //import { useRouter } from 'vue-router'
  import MapView from '@/components/map/MapView.vue'
  
  const store = useStore()
  //const router = useRouter()
  
  const searchKeyword = ref('')
  const activeCategory = ref('location')
  
  const setCategory = (category) => {
    activeCategory.value = category
    // 카테고리별 검색 필터 적용
    store.dispatch('search/applyThemeFilter', category)

    search()
  }
  
  const search = () => {
    if (searchKeyword.value.trim()) {
      store.dispatch('search/search', searchKeyword.value)
        .then(() => {
          // 검색 결과가 있는 경우 마커 업데이트
          const restaurants = store.getters['restaurant/allRestaurants']
          store.dispatch('map/updateMapMarkers', restaurants)
        })
    }
  }
  
  const showMyLocation = () => {
    store.dispatch('map/getUserLocation')
      .then(location => {
        console.log('User location:', location)
      })
  }
  </script>
  
  <style scoped>
  .map-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .search-bar {
    padding: 10px;
    background-color: white;
    z-index: 10;
  }
  
  .search-input {
    position: relative;
  }
  
  .search-input input {
    width: 100%;
    padding: 12px;
    border: 1px solid #dde2e6;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .search-categories {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
    white-space: nowrap;
  }
  
  .category-btn {
    padding: 8px 15px;
    margin-right: 10px;
    border-radius: 20px;
    border: 1px solid #dde2e6;
    background-color: white;
    font-size: 14px;
  }
  
  .category-btn.active {
    background-color: #4285F4;
    color: white;
    border-color: #4285F4;
  }
  
  .map-view-container {
    flex: 1;
    position: relative;
  }
  
  .bottom-actions {
    display: flex;
    padding: 15px;
    background-color: white;
    border-top: 1px solid #f1f3f5;
    align-items: center;
  }
  
  .action-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #dde2e6;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
  }
  
  .recommendation {
    flex: 1;
    text-align: center;
    color: #4285F4;
    font-weight: bold;
  }
  
  .page-indicator {
    color: #868e96;
  }
  </style>