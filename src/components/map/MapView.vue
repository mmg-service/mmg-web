<template>
    <div class="map-container">
      <div class="map-wrapper" ref="mapElement"></div>
      <div class="map-controls">
        <button class="map-btn" @click="resetMap">전체</button>
        <button class="map-btn" @click="filterByDistance">반경 1km</button>
      </div>
      <div class="map-markers">
        <div v-for="marker in markers" :key="marker.id" class="marker">
          <MapMarker 
            :position="marker.position" 
            :title="marker.title" 
            :rating="marker.rating"
            @click="handleMarkerClick(marker.id)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import MapMarker from './MapMarker.vue'
  
  const store = useStore()
  const router = useRouter()
  const mapElement = ref(null)
  let map = null
  
  const markers = computed(() => store.getters['map/allMarkers'])
  const mapCenter = computed(() => store.getters['map/mapCenterPosition'])
  
  onMounted(() => {
    // 여기서는 Kakao Maps 등의 실제 지도 API를 연결해야 함
    // 아래는 예시 코드 (실제 구현시 맞는 지도 API로 교체 필요)
    initMap()
    store.dispatch('map/getUserLocation')
  })
  
  watch(mapCenter, (newCenter) => {
    if (map) {
      // 맵 센터 업데이트 로직
      console.log('Map center updated', newCenter)
    }
  })
  
  const initMap = () => {
    // 지도 초기화 로직
    console.log('Map initialized with element', mapElement.value)
    
    // 실제로는 아래와 같이 Kakao Maps 등을 초기화
    /*
    if (window.kakao && window.kakao.maps) {
      map = new window.kakao.maps.Map(mapElement.value, {
        center: new window.kakao.maps.LatLng(mapCenter.value.lat, mapCenter.value.lng),
        level: 3
      })
    }
    */
  }
  
  const resetMap = () => {
    store.dispatch('search/resetAllFilters')
    store.dispatch('restaurant/fetchRestaurants')
  }
  
  const filterByDistance = () => {
    store.dispatch('search/applyLocationFilter', 1) // 1km 반경
    store.dispatch('restaurant/filterRestaurants', {
      location: store.getters['map/userLocation'],
      radius: 1 // 1km
    })
  }
  
  const handleMarkerClick = (restaurantId) => {
    router.push({ name: 'Detail', params: { id: restaurantId } })
  }
  </script>
  
  <style scoped>
  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .map-wrapper {
    width: 100%;
    height: 100%;
    background-color: #f1f3f5; /* 지도 로드 전 배경색 */
  }
  
  .map-controls {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    z-index: 10;
  }
  
  .map-btn {
    background-color: white;
    border: 1px solid #dde2e6;
    border-radius: 20px;
    padding: 8px 15px;
    margin: 0 5px;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  </style>