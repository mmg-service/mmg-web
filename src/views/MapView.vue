<template>
  <div class="map-page">
    <!-- 검색창 및 필터 영역 -->
    <div class="search-bar">
      <div class="search-input">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="장소, 메뉴, 지역 검색" 
          @keyup.enter="searchPlaces"
        />
        <button class="search-btn" @click="searchPlaces">
          <i class="fas fa-search"></i>
        </button>
      </div>
      
      <!-- 카테고리 및 옵션 선택 UI -->
      <div class="filter-categories">
        <div class="category-section">
          <div class="category-title">음식 종류</div>
          <div class="categories-row">
            <button 
              v-for="category in foodCategories" 
              :key="category.value"
              :class="['category-btn', { active: activeCategory === category.value }]" 
              @click="setCategoryAndSearch(category.value)"
            >
              {{ category.label }}
            </button>
          </div>
        </div>
        
        <div class="category-section">
          <div class="category-title">분위기</div>
          <div class="categories-row">
            <button 
              v-for="theme in themeOptions" 
              :key="theme.value"
              :class="['category-btn', { active: activeTheme === theme.value }]" 
              @click="setThemeAndSearch(theme.value)"
            >
              {{ theme.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 지도 컨테이너 -->
    <div class="map-container">
      <div id="map" ref="mapElement"></div>
      
      <div class="map-controls">
        <button class="map-btn location-btn" @click="centerToMyLocation">
          <i class="fas fa-location-arrow"></i>
        </button>
        <button class="map-btn reset-btn" @click="resetMapAndSearch">
          <i class="fas fa-redo-alt"></i> <span class="btn-text">전체</span>
        </button>
        <button class="map-btn distance-btn" @click="filterByDistance">
          <i class="fas fa-street-view"></i> <span class="btn-text">반경 1km</span>
        </button>
        <button class="map-btn recommend-btn" @click="showRecommendations">
          <i class="fas fa-utensils"></i> <span class="btn-text">매장추천</span>
        </button>
      </div>
    </div>

    <!-- 하단 추천 영역 -->
    <div class="ai-recommendation-section">
      <div class="ai-header">
        <div class="ai-title">
          <i class="fas fa-robot ai-icon"></i> MMG AI 추천
        </div>
      </div>
      
      <div class="ai-content">
        <div v-if="isLoading" class="loading-indicator">
          <i class="fas fa-spinner fa-spin"></i>
          <p>추천 정보를 가져오는 중...</p>
        </div>
        
        <div v-else-if="!currentRecommendation" class="no-recommendation">
          <i class="fas fa-info-circle"></i>
          <p>이 지역에 대한 추천 정보가 없습니다.</p>
          <p>다른 위치로 이동하거나 다른 카테고리를 선택해보세요.</p>
        </div>
        
        <template v-else>
          <div class="restaurant-preview">
            <div class="restaurant-image" :style="`background-image: url(${currentRecommendation.image || 'https://via.placeholder.com/80?text=No+Image'})`"></div>
            <div class="restaurant-info">
              <h3>{{ currentRecommendation.name }}</h3>
              <div class="rating">
                <i class="fas fa-star"></i> {{ currentRecommendation.rating || '평점 정보 없음' }}
                <span class="category-label">{{ currentRecommendation.category }}</span>
              </div>
              <p class="distance"><i class="fas fa-map-marker-alt"></i> {{ currentRecommendation.distance || '거리 정보 없음' }}</p>
            </div>
          </div>
          
          <div class="ai-reason">
            <div class="reason-label">추천 이유:</div>
            <p>{{ currentRecommendation.aiReason || '이 매장은 현재 위치에서 가장 가까운 매장입니다.' }}</p>
          </div>
          
          <div class="additional-info" v-if="currentRecommendation.address || currentRecommendation.phone">
            <div v-if="currentRecommendation.address">
              <div class="reason-label">주소:</div>
              <p>{{ currentRecommendation.address }}</p>
            </div>
            <div v-if="currentRecommendation.phone" class="mt-2">
              <div class="reason-label">전화번호:</div>
              <p>{{ currentRecommendation.phone }}</p>
            </div>
          </div>
          
          <button class="view-details-btn" @click="openNaverMap(currentRecommendation)">
            네이버 지도에서 보기
          </button>
        </template>
      </div>
    </div>

    <div class="bottom-actions">
      <button class="action-btn" @click="centerToMyLocation">
        <i class="fas fa-location-arrow"></i>
      </button>
      <div class="recommendation">
        맛집 {{ searchResults.length }}개를 확인하려면?
      </div>
      <div class="page-indicator" @click="goToMyPage">
        내정보
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

// temp data
import foodData from '@/store/data/food.json'

const store = useStore();
const router = useRouter();

// 지도 관련 상태
const mapElement = ref(null);
let map = null;
let markers = [];
let userMarker = null;
let infoWindow = null;
let mapMoveTimer = null;

// 검색 및 필터 관련 상태
const searchKeyword = ref('');
const activeCategory = ref('korean'); // 한식을 기본값으로 설정
const activeTheme = ref('popular');   // 인기있는을 기본값으로 설정
const isLoading = ref(false);
const currentRecommendation = ref(null);
const searchResults = ref([]);
const userRadius = ref(1); // 1km

// 음식 카테고리 목록 - 네이버 지역 API 검색용 키워드 매핑
const foodCategories = [
  { label: '한식', value: 'korean', keyword: '한식' },
  { label: '일식', value: 'japanese', keyword: '일식' },
  { label: '중식', value: 'chinese', keyword: '중식' },
  { label: '양식', value: 'western', keyword: '양식' }
];

// 테마 옵션 목록 - 네이버 지역 API 검색용 키워드 매핑
const themeOptions = [
  { label: '가볍게', value: 'light', keyword: '분식' },
  { label: '푸짐하게', value: 'hearty', keyword: '푸짐한 식당' },
  { label: '나만의', value: 'personal', keyword: '맛집' },
  { label: '인기있는', value: 'popular', keyword: '인기 맛집' }
];

// 스토어에서 가져오는 값들
const userLocation = computed(() => store.getters['map/userLocation']);

// 네이버 지역 API 호출을 위한 설정
const naverApiConfig = {
  clientId: 'q58itu6nad',     // 실제 발급 받은 Client ID로 대체
  clientSecret: 'kWv3UGJ0y6l6m2eh9ZpV7zkwZxKteflKCQ1GdKzw' // 실제 발급 받은 Client Secret으로 대체
};

onMounted(() => {
  // 네이버 지도 스크립트 로드
  if (window.naver && window.naver.maps) {
    initMap();
  } else {
    loadNaverMapsScript();
  }
  
  // 사용자 위치 가져오기
  getUserLocation();
});

onUnmounted(() => {
  // 지도 관련 리소스 정리
  if (map) {
    clearAllMarkers();
    // 이벤트 리스너 제거
    if (window.naver && window.naver.maps) {
      window.naver.maps.Event.removeListener(map, 'dragend', handleMapMoved);
      window.naver.maps.Event.removeListener(map, 'zoom_changed', handleMapMoved);
    }
  }
});

// 네이버 지도 스크립트 로드
const loadNaverMapsScript = () => {
  const script = document.createElement('script');
  
  // 스크립트 로드 오류 처리
  script.onerror = () => {
    console.error('네이버 지도 스크립트 로드 실패');
    showMapErrorMessage();
  };
  
  script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=q58itu6nad&submodules=geocoder`;
  script.async = true;
  script.onload = () => {
    // 스크립트 로드 후 지연 (인증 처리 시간 확보)
    setTimeout(() => {
      try {
        if (window.naver && window.naver.maps && window.naver.maps.Map) {
          initMap();
        } else {
          throw new Error('네이버 지도 API가 제대로 로드되지 않았습니다.');
        }
      } catch (error) {
        console.error('네이버 지도 초기화 실패:', error);
        showMapErrorMessage();
      }
    }, 1000);
  };
  
  document.head.appendChild(script);
};

// 지도 초기화
const initMap = () => {
  if (!mapElement.value) return;

  try {
    // 네이버 지도 초기화
    const mapOptions = {
      center: new window.naver.maps.LatLng(
        userLocation.value?.lat || 37.5666805, 
        userLocation.value?.lng || 126.9784147
      ),
      zoom: 15,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT
      }
    };

    map = new window.naver.maps.Map(mapElement.value, mapOptions);
    
    // 정보창 생성
    infoWindow = new window.naver.maps.InfoWindow({
      content: '',
      borderWidth: 1,
      borderColor: '#ddd',
      backgroundColor: 'white',
      disableAnchor: true,
      pixelOffset: new window.naver.maps.Point(0, -5)
    });

    // 지도 이동 이벤트 설정
    window.naver.maps.Event.addListener(map, 'dragend', handleMapMoved);
    window.naver.maps.Event.addListener(map, 'zoom_changed', handleMapMoved);
    
    // 현재 위치 마커 표시
    if (userLocation.value) {
      addUserLocationMarker(userLocation.value);
      
      // 현재 위치 기반 검색 수행
      searchNearbyPlaces();
    }
  } catch (error) {
    console.error('네이버 지도 초기화 실패:', error);
    showMapErrorMessage();
  }
};

// 지도 이동 시 처리
const handleMapMoved = () => {
  if (!map) return;
  
  if (mapMoveTimer) {
    clearTimeout(mapMoveTimer);
  }
  
  // 지도 이동이 끝나고 0.5초 후에 업데이트 (빈번한 호출 방지)
  mapMoveTimer = setTimeout(() => {
    const center = map.getCenter();
    
    // 스토어 업데이트
    store.dispatch('map/setMapCenter', {
      lat: center.lat(),
      lng: center.lng()
    });
  }, 500);
};

// 현재 위치 가져오기
const getUserLocation = () => {
  isLoading.value = true;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // 스토어에 위치 저장
        store.dispatch('map/setUserLocation', userPos);
        
        // 지도 중심 이동 (지도가 초기화된 경우에만)
        if (map && window.naver) {
          try {
            map.setCenter(new window.naver.maps.LatLng(userPos.lat, userPos.lng));
            
            // 현재 위치 마커 표시
            addUserLocationMarker(userPos);
            
            // 현재 위치 기반 검색 수행
            searchNearbyPlaces();
          } catch (error) {
            console.error('지도 위치 설정 실패:', error);
          }
        }
        
        isLoading.value = false;
      },
      (error) => {
        console.error('위치 정보를 가져오는데 실패했습니다:', error);
        
        // 기본 위치 (서울 중심)로 설정
        const defaultPos = { lat: 37.5666805, lng: 126.9784147 };
        store.dispatch('map/setUserLocation', defaultPos);
        
        if (map && window.naver) {
          try {
            map.setCenter(new window.naver.maps.LatLng(defaultPos.lat, defaultPos.lng));
            
            // 기본 위치 기반 검색 수행
            searchNearbyPlaces();
          } catch (error) {
            console.error('지도 위치 설정 실패:', error);
          }
        }
        
        isLoading.value = false;
      }
    );
  } else {
    console.error('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
    
    // 기본 위치 설정
    const defaultPos = { lat: 37.5666805, lng: 126.9784147 };
    store.dispatch('map/setUserLocation', defaultPos);
    
    if (map && window.naver) {
      map.setCenter(new window.naver.maps.LatLng(defaultPos.lat, defaultPos.lng));
      
      // 기본 위치 기반 검색 수행
      searchNearbyPlaces();
    }
    
    isLoading.value = false;
  }
};

// 현재 위치로 지도 중심 이동
const centerToMyLocation = () => {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }
  
  if (map && window.naver) {
    try {
      map.setCenter(new window.naver.maps.LatLng(userLocation.value.lat, userLocation.value.lng));
      map.setZoom(15); // 적절한 줌 레벨로 설정
      
      // 현재 위치 마커 표시
      addUserLocationMarker(userLocation.value);
      
      // 현재 위치 기반 검색 수행
      searchNearbyPlaces();
    } catch (error) {
      console.error('지도 중심 이동 실패:', error);
    }
  }
};

// 사용자 위치 마커 추가
const addUserLocationMarker = (position) => {
  if (!map || !window.naver) return;
  
  try {
    // 기존 사용자 위치 마커 제거
    if (userMarker) {
      userMarker.setMap(null);
    }
    
    // 사용자 위치 마커 생성
    userMarker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(position.lat, position.lng),
      map: map,
      icon: {
        content: `<div class="user-location-marker"><i class="fas fa-circle-user"></i></div>`,
        anchor: new window.naver.maps.Point(15, 15)
      },
      zIndex: 100
    });
  } catch (error) {
    console.error('사용자 위치 마커 추가 실패:', error);
  }
};

// 모든 마커 제거
const clearAllMarkers = () => {
  markers.forEach(marker => {
    marker.setMap(null);
  });
  markers = [];
  
  // 사용자 위치 마커는 별도 관리
  if (userMarker) {
    userMarker.setMap(null);
    userMarker = null;
  }
};

// 지도 에러 메시지 표시
const showMapErrorMessage = () => {
  if (mapElement.value) {
    mapElement.value.innerHTML = `
      <div class="map-error-container">
        <div class="map-error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <p>지도를 불러오는데 실패했습니다.</p>
          <p class="map-error-detail">네이버 지도 API 인증에 문제가 있습니다.</p>
        </div>
      </div>
    `;
  }
};

// 카테고리 설정 및 검색
const setCategoryAndSearch = (category) => {
  activeCategory.value = category;
  searchPlaces();
};

// 테마 설정 및 검색
const setThemeAndSearch = (theme) => {
  activeTheme.value = theme;
  searchPlaces();
};

// 사용자 위치 주변 장소 검색
const searchNearbyPlaces = () => {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }
  
  // 카테고리 키워드 가져오기
  const categoryObj = foodCategories.find(cat => cat.value === activeCategory.value);
  const categoryKeyword = categoryObj ? categoryObj.keyword : '';
  
  // 현재 위치 주변 식당 검색
  const query = categoryKeyword + ' 식당';
  const coords = `${userLocation.value.lng},${userLocation.value.lat}`; // 경도,위도 순서
  
  searchNaverPlaces(query, coords);
};

// 매장 추천 표시
const showRecommendations = () => {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }
  
  // 테마 키워드 가져오기
  const themeObj = themeOptions.find(theme => theme.value === activeTheme.value);
  const themeKeyword = themeObj ? themeObj.keyword : '';
  
  // 현재 위치 주변 추천 맛집 검색
  const query = themeKeyword;
  const coords = `${userLocation.value.lng},${userLocation.value.lat}`; // 경도,위도 순서
  
  searchNaverPlaces(query, coords);
};

// 특정 범위 내 검색
const filterByDistance = () => {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }
  
  // 카테고리 키워드 가져오기
  const categoryObj = foodCategories.find(cat => cat.value === activeCategory.value);
  const categoryKeyword = categoryObj ? categoryObj.keyword : '';
  
  // 현재 위치 주변 1km 내 식당 검색
  const query = categoryKeyword + ' 식당';
  const coords = `${userLocation.value.lng},${userLocation.value.lat}`; // 경도,위도 순서
  
  // 지도에 1km 반경 표시
  if (map && window.naver) {
    const userPos = new window.naver.maps.LatLng(userLocation.value.lat, userLocation.value.lng);
    map.setCenter(userPos);
    
    // 적절한 줌 레벨 설정 (대략 1km 반경이 보이게)
    map.setZoom(14);
  }
  
  searchNaverPlaces(query, coords, 1000); // 1000m = 1km
};

// 검색창 검색
const searchPlaces = () => {
  isLoading.value = true;
  
  let searchTerm = searchKeyword.value;
  
  // 검색어가 비어있으면 카테고리 기반 검색
  if (!searchTerm.trim()) {
    const categoryObj = foodCategories.find(cat => cat.value === activeCategory.value);
    searchTerm = categoryObj ? categoryObj.keyword + ' 식당' : '식당';
  }
  
  // 현재 지도 중심 좌표 가져오기
  let coords = '';
  if (map && window.naver) {
    const center = map.getCenter();
    coords = `${center.lng()},${center.lat()}`;
  } else if (userLocation.value) {
    coords = `${userLocation.value.lng},${userLocation.value.lat}`;
  }
  
  searchNaverPlaces(searchTerm, coords);
};

// 네이버 지역 API로 장소 검색
const searchNaverPlaces = async (query, coords, radius) => {
  isLoading.value = true;

  console.log("searchNaverPlaces")
  
  try {
    // 네이버 지역 검색 API 호출 (서버 측에서 호출해야 함)
    // 프론트엔드에서 직접 호출하면 CORS 및 보안 문제 발생
    // 여기서는 예시로 프록시 서버를 통해 호출한다고 가정
    
    // 실제 구현 시에는 백엔드 API를 통해 호출해야 함
    // const response = await axios.get('/api/search/local', {
    //   params: {
    //     query,
    //     display: 10,
    //     start: 1,
    //     sort: 'random',
    //     coords,
    //     radius: radius || 5000 // 기본 5km
    //   }
    // });
    
    // 백엔드 API 호출이 불가능하므로 샘플 데이터로 대체
    const mockResults = generateMockSearchResults(query, coords, 10);
    // const mockResults = foodData.items


    // 검색 결과 처리
    searchResults.value = mockResults;
    
    // 마커 생성
    updateMapMarkers(mockResults);
    
    // 첫 번째 결과로 추천 정보 설정
    if (mockResults.length > 0) {
      setRecommendation(mockResults[0]);
    } else {
      currentRecommendation.value = null;
    }
    
    // 지도 중심 및 줌 레벨 조정 (모든 마커가 보이도록)
    if (map && window.naver && mockResults.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();
      
      mockResults.forEach(place => {
        bounds.extend(new window.naver.maps.LatLng(place.mapy / 10000000, place.mapx / 10000000));
      });
      
      // map.fitBounds(bounds);
      const center = bounds.getCenter();
      map.setCenter(center);
      map.setZoom(15);
    }
  } catch (error) {
    console.error('장소 검색 실패:', error);
    searchResults.value = [];
    currentRecommendation.value = null;
  } finally {
    isLoading.value = false;
  }
};

// 지도에 검색 결과 마커 표시
const updateMapMarkers = (places) => {
  if (!map || !window.naver) return;
  
  // 기존 마커 제거
  clearAllMarkers();
  
  // 마커 생성
  places.forEach((place, index) => {
    // 좌표가 네이버 좌표체계(EPSG:3857)로 제공되므로 변환 필요
    // 실제로는 더 정확한 변환이 필요할 수 있음
    
    const lat = place.mapy / 10000000;
    const lng = place.mapx / 10000000;
    
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map: map,
      title: place.title,
      icon: {
        content: createMarkerContent(place.title, place.category, index + 1),
        anchor: new window.naver.maps.Point(15, 35)
      },
      zIndex: 50
    });
    
    // 마커 클릭 이벤트
    window.naver.maps.Event.addListener(marker, 'click', () => {
      // 클릭한 장소 정보를 추천 정보로 설정
      setRecommendation(place);
      
      // 마커에 정보 창 표시
      showInfoWindow(place, marker);
    });
    
    markers.push(marker);
  });
};

// 마커 HTML 콘텐츠 생성
const createMarkerContent = (title, category, index) => {
  return `
    <div class="custom-marker">
      <div class="marker-pin">
        <span>${index}</span>
      </div>
      <div class="marker-tail"></div>
    </div>
  `;
};

// 정보 창 표시
const showInfoWindow = (place, marker) => {
  if (!map || !window.naver || !infoWindow) return;
  
  const content = `
    <div class="info-window">
      <div class="info-title">${place.title}</div>
      <div class="info-category">${place.category}</div>
      <div class="info-address">${place.address}</div>
      <div class="info-phone">${place.telephone || '정보 없음'}</div>
    </div>
  `;
  
  infoWindow.setContent(content);
  infoWindow.open(map, marker);
};

// 추천 정보 설정
const setRecommendation = (place) => {
  if (!place) {
    currentRecommendation.value = null;
    return;
  }
  
  // 거리 계산 - 사용자 위치로부터의 거리
  let distance = '알 수 없음';
  if (userLocation.value) {
    const lat1 = userLocation.value.lat;
    const lng1 = userLocation.value.lng;
    // 네이버 좌표체계 변환
    const lat2 = place.mapy / 10000000;
    const lng2 = place.mapx / 10000000;
    
    // 거리 계산 (미터 단위)
    const distanceInMeters = calculateDistance(lat1, lng1, lat2, lng2) * 1000;
    distance = `${Math.round(distanceInMeters)}m`;
  }
  
  // HTML 태그 제거 및 정보 정리
  const cleanTitle = place.title.replace(/<[^>]*>/g, '');
  const cleanCategory = place.category.replace(/<[^>]*>/g, '');
  const cleanAddress = place.address.replace(/<[^>]*>/g, '');
  
  // 추천 정보 구성
  currentRecommendation.value = {
    id: place.id,
    name: cleanTitle,
    category: cleanCategory,
    rating: place.rating || (4 + Math.random()).toFixed(1), // 샘플 데이터에는 평점이 없어서 임의 생성
    distance,
    address: cleanAddress,
    phone: place.telephone || '',
    image: place.image || `https://via.placeholder.com/80?text=${encodeURIComponent(cleanTitle.substring(0, 5))}`,
    mapx: place.mapx,
    mapy: place.mapy,
    aiReason: generateRecommendationReason(place, distance)
  };
};

// 추천 이유 생성
const generateRecommendationReason = (place, distance) => {
  const reasons = [
    `${place.title}은(는) 현재 위치에서 ${distance} 거리에 있는 ${place.category} 매장입니다.`,
    `이 매장은 현재 위치 주변에서 많은 이용자들이 방문하는 인기있는 ${place.category}입니다.`,
    `${place.title}은(는) ${place.category} 중에서 현재 위치와 가깝고 사용자 평가가 좋은 매장입니다.`,
    `이 ${place.category}은(는) 현재 위치에서 접근성이 좋은 매장으로 추천드립니다.`
  ];
  
  // 랜덤하게 이유 선택
  const randomIndex = Math.floor(Math.random() * reasons.length);
  return reasons[randomIndex];
};

// 두 위치 간 거리 계산 (하버사인 공식) - km 단위
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반경 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // km 단위 거리
};

// 라디안 변환
const toRad = (value) => {
  return value * Math.PI / 180;
};

// 지도 및 검색 리셋
const resetMapAndSearch = () => {
  searchKeyword.value = '';
  
  // 기본 카테고리로 리셋
  activeCategory.value = 'korean';
  activeTheme.value = 'popular';
  
  // 현재 위치 기준으로 지도 초기화
  centerToMyLocation();
  
  // 현재 위치 기반 검색 수행
  searchNearbyPlaces();
};

// 네이버 지도 앱/웹으로 열기
const openNaverMap = (place) => {
  if (!place) return;
  
  // 네이버 지도 웹으로 연결 (모바일에서는 앱으로 연결됨)
  const title = encodeURIComponent(place.name);
  const lat = place.mapy / 10000000;
  const lng = place.mapx / 10000000;
  
  const naverMapUrl = `https://map.naver.com/v5/search/${title}?c=${lng},${lat},15,0,0,0,dh`;
  window.open(naverMapUrl, '_blank');
};

// 내 정보 페이지로 이동
const goToMyPage = () => {
  router.push({ name: 'MyPage' });
};

// 샘플 검색 결과 생성 (실제 API 대신 사용)
const generateMockSearchResults = (query, coords, count = 10) => {
  const [lng, lat] = coords.split(',');
  const baseLatLng = { lat: parseFloat(lat), lng: parseFloat(lng) };
  
  // 음식 종류 추출
  let foodType = '식당';
  foodCategories.forEach(category => {
    if (query.includes(category.keyword)) {
      foodType = category.keyword;
    }
  });
  
  // 검색 결과 생성
  const results = [];
  
  // 음식점 이름 샘플
  const restaurantNames = [
    '맛있는', '행복한', '즐거운', '신선한', '향기로운', '정성담은', '건강한',
    '푸짐한', '특별한', '착한', '새로운', '인기있는', '추천', '명품', '고급스러운'
  ];
  
  // 주소 샘플
  const addresses = [
    '서울시 강남구', '서울시 서초구', '서울시 송파구', '서울시 마포구', 
    '서울시 종로구', '서울시 용산구', '서울시 중구', '서울시 성동구', 
    '서울시 영등포구', '서울시 동작구', '서울시 강서구', '서울시 광진구'
  ];
  
  for (let i = 0; i < count; i++) {
    // 현재 위치 주변 랜덤 좌표 생성 (약 2km 이내)
    const randomLat = baseLatLng.lat + (Math.random() - 0.5) * 0.02;
    const randomLng = baseLatLng.lng + (Math.random() - 0.5) * 0.03;
    
    // 랜덤 매장명 생성
    const nameIndex = Math.floor(Math.random() * restaurantNames.length);
    const addressIndex = Math.floor(Math.random() * addresses.length);
    
    const streetNumber = Math.floor(Math.random() * 100) + 1;
    const buildingName = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + '빌딩';
    
    results.push({
      id: `place_${i}`,
      title: `${restaurantNames[nameIndex]} ${foodType}`,
      link: `https://map.naver.com/v5/entry/place/${i}`,
      category: foodType,
      description: `맛있는 ${foodType}을 제공하는 음식점입니다.`,
      telephone: `02-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      address: `${addresses[addressIndex]} ${streetNumber}길 ${Math.floor(Math.random() * 30) + 1} ${buildingName}`,
      roadAddress: `${addresses[addressIndex]} ${streetNumber}길 ${Math.floor(Math.random() * 30) + 1}`,
      mapx: randomLng * 10000000, // 네이버 API 좌표 형식 (X/Y를 10000000으로 나눠야 실제 좌표)
      mapy: randomLat * 10000000
    });
  }
  
  return results;
};
</script>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
}

/* 검색 영역 스타일 */
.search-bar {
  padding: 10px 15px;
  background-color: white;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input {
  position: relative;
  display: flex;
  margin-bottom: 10px;
}

.search-input input {
  flex: 1;
  padding: 12px 40px 12px 15px;
  border: 1px solid #dde2e6;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  outline: none;
}

.search-input input:focus {
  border-color: #FF5722;
  box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.15);
}

.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: #FF5722;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 카테고리 필터 영역 */
.filter-categories {
  margin-top: 5px;
}

.category-section {
  margin-bottom: 8px;
}

.category-title {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
  padding-left: 2px;
}

.categories-row {
  display: flex;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.categories-row::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.category-btn {
  padding: 6px 14px;
  margin-right: 8px;
  border-radius: 20px;
  border: 1px solid #dde2e6;
  background-color: white;
  font-size: 13px;
  white-space: nowrap;
  color: #555;
}

.category-btn.active {
  background-color: #FF5722;
  color: white;
  border-color: #FF5722;
  font-weight: 500;
}

/* 지도 영역 */
.map-container {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
}

#map {
  width: 100%;
  height: 100%;
  background-color: #f1f3f5; /* 지도 로드 전 배경색 */
}

/* 지도 컨트롤 버튼 */
.map-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 10;
}

.map-btn {
  display: flex;
  align-items: center;
  background-color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 15px;
  margin: 0 5px;
  font-size: 14px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.map-btn:hover {
  background-color: #f9f9f9;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.map-btn i {
  margin-right: 5px;
  font-size: 14px;
}

.btn-text {
  margin-left: 3px;
  display: inline-block;
}

.location-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.location-btn i {
  margin: 0;
  font-size: 16px;
  color: #FF5722;
}

.reset-btn, .distance-btn, .recommend-btn {
  min-width: 80px; /* 버튼 최소 너비 설정 */
  justify-content: center;
}

/* AI 추천 섹션 */
.ai-recommendation-section {
  width: 100%;
  background-color: white;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
  z-index: 5;
  max-height: 40vh;
  overflow-y: auto;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: linear-gradient(135deg, #FF5722, #E91E63);
  color: white;
}

.ai-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
}

.ai-icon {
  margin-right: 8px;
  font-size: 16px;
}

.ai-content {
  padding: 15px;
}

/* 로딩 및 빈 상태 */
.loading-indicator, .no-recommendation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: #888;
  text-align: center;
}

.loading-indicator i, .no-recommendation i {
  font-size: 32px;
  margin-bottom: 10px;
  color: #FF5722;
}

/* 식당 미리보기 */
.restaurant-preview {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.restaurant-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.restaurant-info {
  flex: 1;
}

.restaurant-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.rating {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: #f8b400;
  font-weight: 600;
}

.rating i {
  margin-right: 4px;
}

.category-label {
  margin-left: 8px;
  background-color: #f1f1f1;
  color: #666;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: normal;
}

.distance {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin: 0;
}

.distance i {
  margin-right: 5px;
  color: #FF5722;
}

/* AI 추천 이유 및 추가 정보 */
.ai-reason, .additional-info {
  background-color: #FFF0ED;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.reason-label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #FF5722;
  font-size: 14px;
}

.ai-reason p, .additional-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
}

.mt-2 {
  margin-top: 10px;
}

/* 네이버 지도에서 보기 버튼 */
.view-details-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #1EC800, #03C75A); /* 네이버 색상 사용 */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(3, 199, 90, 0.25);
}

.view-details-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(3, 199, 90, 0.35);
}

/* 하단 액션 바 */
.bottom-actions {
  display: flex;
  padding: 12px 15px;
  background-color: white;
  border-top: 1px solid #f1f3f5;
  align-items: center;
  z-index: 5;
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-btn i {
  color: #FF5722;
  font-size: 16px;
}

.recommendation {
  flex: 1;
  text-align: center;
  color: #4285F4;
  font-weight: bold;
  font-size: 14px;
}

.page-indicator {
  color: #868e96;
  font-size: 14px;
  cursor: pointer;
}

/* 사용자 위치 마커 스타일 */
:deep(.user-location-marker) {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #4285F4;
}

/* 커스텀 마커 스타일 */
:deep(.custom-marker) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.marker-pin) {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FF5722;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

:deep(.marker-tail) {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #FF5722;
  margin-top: -5px;
}

/* 정보 창 스타일 */
:deep(.info-window) {
  padding: 10px;
  width: 200px;
}

:deep(.info-title) {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

:deep(.info-category) {
  font-size: 12px;
  color: #FF5722;
  margin-bottom: 5px;
}

:deep(.info-address) {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

:deep(.info-phone) {
  font-size: 12px;
  color: #1EC800;
}

/* 지도 에러 메시지 스타일 */
.map-error-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.map-error-message {
  text-align: center;
  padding: 20px;
  max-width: 80%;
}

.map-error-message i {
  font-size: 48px;
  color: #FF5722;
  margin-bottom: 15px;
}

.map-error-message p {
  margin: 10px 0;
  font-size: 16px;
  color: #333;
}

.map-error-message .map-error-detail {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}
</style>