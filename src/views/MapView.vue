<template>
  <div class="map-page">
    <!-- 검색창 및 필터 영역 -->
    <div class="search-bar">
      <div class="search-input">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="키워드 검색"
          @keyup.enter="searchPlaces"
        />
        <button class="search-btn" @click="searchPlaces">
          <i class="fas fa-search"></i>
        </button>
      </div>

      <div class="filter-toggle" @click="toggleFilters">
        <span>필터 {{ showFilters ? '접기' : '펼치기' }}</span>
        <i :class="['fas', showFilters ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
      </div>

      <div class="filter-categories" v-show="showFilters">
      <!-- 카테고리 및 옵션 선택 UI -->
      <div class="filter-categories">
        <div class="category-section">
          <div class="category-title">음식 종류</div>
          <div class="categories-row">
            <button
              v-for="category in foodCategories"
              :key="category.value"
              :class="[
                'category-btn',
                { active: activeCategory === category.value },
              ]"
              @click="setCategoryAndSearch(category.value)"
            >
              {{ category.label }}
            </button>
          </div>
        </div>

        <!-- 사용자 카테고리 -->
        <div class="category-section">
          <div class="category-title">성별</div>
          <div class="categories-row">
            <button
              v-for="gender in genderOptions"
              :key="gender.value"
              :class="['category-btn', { active: activeGender === gender.value }]"
              @click="setGenderAndSearch(gender.value)"
            >
              {{ gender.label }}
            </button>
          </div>
        </div>

        <div class="category-section">
          <div class="category-title">나이</div>
          <div class="categories-row">
            <button
              v-for="age in ageOptions"
              :key="age.value"
              :class="['category-btn', { active: activeAge === age.value }]"
              @click="setAgeAndSearch(age.value)"
            >
              {{ age.label }}
            </button>
          </div>
        </div>

        <div class="category-section">
          <div class="category-title">직업군</div>
          <div class="categories-row">
            <button
              v-for="job in jobOptions"
              :key="job.value"
              :class="['category-btn', { active: activeJob === job.value }]"
              @click="setJobAndSearch(job.value)"
            >
              {{ job.label }}
            </button>
          </div>
        </div>

        <!-- 비즈니스 카테고리 -->
        <div class="category-section">
          <div class="category-title">목적</div>
          <div class="categories-row">
            <button
              v-for="purpose in purposeOptions"
              :key="purpose.value"
              :class="['category-btn', { active: activePurpose === purpose.value }]"
              @click="setPurposeAndSearch(purpose.value)"
            >
              {{ purpose.label }}
            </button>
          </div>
        </div>

        <div class="category-section">
          <div class="category-title">인원</div>
          <div class="categories-row">
            <button
              v-for="count in peopleCountOptions"
              :key="count.value"
              :class="['category-btn', { active: activePeopleCount === count.value }]"
              @click="setPeopleCountAndSearch(count.value)"
            >
              {{ count.label }}
            </button>
          </div>
        </div>

        <div class="category-section">
          <div class="category-title">분위기</div>
          <div class="categories-row">
            <button
              v-for="mood in moodOptions"
              :key="mood.value"
              :class="['category-btn', { active: activeMood === mood.value }]"
              @click="setMoodAndSearch(mood.value)"
            >
              {{ mood.label }}
            </button>
          </div>
        </div>

        <!-- 상황별 카테고리 -->
        <div class="category-section">
          <div class="category-title">상황별</div>
          <div class="categories-row">
            <button
              v-for="situation in situationOptions"
              :key="situation.value"
              :class="['category-btn', { active: activeSituation === situation.value }]"
              @click="setSituationAndSearch(situation.value)"
            >
              {{ situation.label }}
            </button>
          </div>
        </div>

        <!-- <div class="category-section">
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
        </div> -->
      </div>
    </div>
    </div>

    <!-- 지도 컨테이너 -->
    <div class="map-container">
      <div id="map" ref="mapElement"></div>

      <!-- <div class="map-controls">
        <button class="map-btn location-btn" @click="centerToMyLocation">
          <i class="fas fa-location-arrow"></i>
        </button>
        <button class="map-btn reset-btn" @click="resetMapAndSearch">
          <i class="fas fa-redo-alt"></i> <span class="btn-text">전체</span>
        </button>
        <button class="map-btn distance-btn" @click="filterByDistance">
          <i class="fas fa-street-view"></i>
          <span class="btn-text">반경 1km</span>
        </button>
        <button class="map-btn recommend-btn" @click="showRecommendations">
          <i class="fas fa-utensils"></i> <span class="btn-text">매장추천</span>
        </button>
      </div> -->
    </div>

    <!-- 하단 추천 영역 -->
    <Recommendation
      :isLoading="isLoading"
      :currentRecommendation="currentRecommendation"
      :openNaverMap="openNaverMap"
    />

    <div class="bottom-actions">
      <button class="action-btn" @click="centerToMyLocation">
        <i class="fas fa-location-arrow"></i>
      </button>
      <!-- <div class="recommendation">
        맛집 {{ searchResults.length }}개를 확인하려면?
      </div>
      <div class="page-indicator" @click="goToMyPage">내정보</div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "axios";
import recommendationService from "@/services/recommendation.service";

import Recommendation from "@/components/Recommendation.vue";

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
const searchKeyword = ref("");
const activeCategory = ref("korean"); // 한식을 기본값으로 설정
const activeTheme = ref("popular"); // 인기있는을 기본값으로 설정
const isLoading = ref(false);
const currentRecommendation = ref(null);
const searchResults = ref([]);
const userRadius = ref(1); // 1km

const locationName = ref("");

// 새로 추가된 필터 상태
const activeGender = ref(null);
const activeAge = ref(null);
const activeJob = ref(null);
const activePurpose = ref(null);
const activePeopleCount = ref(null);
const activeMood = ref(null);
const activeSituation = ref(null);

// 음식 카테고리 목록 - 네이버 지역 API 검색용 키워드 매핑
const foodCategories = [
  { label: "한식", value: "korean", keyword: "한식" },
  { label: "일식", value: "japanese", keyword: "일식" },
  { label: "중식", value: "chinese", keyword: "중식" },
  { label: "양식", value: "western", keyword: "양식" },
];

// 새로 추가된 카테고리 옵션들
const genderOptions = [
  { label: "남", value: "male" },
  { label: "여", value: "female" },
];

const ageOptions = [
  { label: "10대", value: "10s" },
  { label: "20대", value: "20s" },
  { label: "30대", value: "30s" },
  { label: "40대", value: "40s" },
  { label: "50대", value: "50s" },
  { label: "60대 이상", value: "60s" },
];

const jobOptions = [
  { label: "경영/관리직", value: "management" },
  { label: "의료/보건", value: "healthcare" },
  { label: "IT/기술", value: "it" },
  { label: "교육", value: "education" },
  { label: "금융/회계", value: "finance" },
];

const purposeOptions = [
  { label: "회식", value: "company_dinner" },
  { label: "미팅", value: "meeting" },
  { label: "가족모임", value: "family" },
  { label: "일상식사", value: "daily" },
  { label: "영업", value: "sales" },
];

const peopleCountOptions = [
  { label: "1인", value: "1" },
  { label: "2인", value: "2" },
  { label: "3-4인", value: "3-4" },
  { label: "5-8인", value: "5-8" },
  { label: "9인 이상", value: "9+" },
];

const moodOptions = [
  { label: "편안함", value: "comfortable" },
  { label: "모던함", value: "modern" },
  { label: "캐주얼함", value: "casual" },
  { label: "고급", value: "luxury" },
  { label: "노포", value: "old" },
  { label: "활기찬", value: "lively" },
  { label: "가벼운", value: "light" },
  { label: "조용한", value: "quiet" },
  { label: "신나는", value: "exciting" },
  { label: "편안한", value: "cozy" },
];

const situationOptions = [
  { label: "제철음식", value: "seasonal" },
  { label: "세일중", value: "sale" },
  { label: "프랜차이즈", value: "franchise" },
];

// 테마 옵션 목록 - 네이버 지역 API 검색용 키워드 매핑
const themeOptions = [
  { label: "가볍게", value: "light", keyword: "가벼운" },
  { label: "푸짐하게", value: "hearty", keyword: "푸짐한" },
  // { label: "나만의", value: "personal", keyword: "맛집" },
  { label: "인기있는", value: "popular", keyword: "인기있는" },
];

// 스토어에서 가져오는 값들
const userLocation = computed(() => store.getters["map/userLocation"]);

// 네이버 지역 API 호출을 위한 설정
const naverApiConfig = {
  clientId: "q58itu6nad", // 실제 발급 받은 Client ID로 대체
  clientSecret: "kWv3UGJ0y6l6m2eh9ZpV7zkwZxKteflKCQ1GdKzw", // 실제 발급 받은 Client Secret으로 대체
};

// 새로 추가된 필터 설정 함수들
const setGenderAndSearch = (gender) => {
  activeGender.value = gender;
  searchPlaces();
};

const setAgeAndSearch = (age) => {
  activeAge.value = age;
  searchPlaces();
};

const setJobAndSearch = (job) => {
  activeJob.value = job;
  searchPlaces();
};

const setPurposeAndSearch = (purpose) => {
  activePurpose.value = purpose;
  searchPlaces();
};

const setPeopleCountAndSearch = (count) => {
  activePeopleCount.value = count;
  searchPlaces();
};

const setMoodAndSearch = (mood) => {
  activeMood.value = mood;
  searchPlaces();
};

const setSituationAndSearch = (situation) => {
  activeSituation.value = situation;
  searchPlaces();
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
      window.naver.maps.Event.removeListener(map, "dragend", handleMapMoved);
      window.naver.maps.Event.removeListener(
        map,
        "zoom_changed",
        handleMapMoved
      );
    }
  }
});

// 네이버 지도 스크립트 로드
const loadNaverMapsScript = () => {
  const script = document.createElement("script");

  // 스크립트 로드 오류 처리
  script.onerror = () => {
    console.error("네이버 지도 스크립트 로드 실패");
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
          throw new Error("네이버 지도 API가 제대로 로드되지 않았습니다.");
        }
      } catch (error) {
        console.error("네이버 지도 초기화 실패:", error);
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
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    map = new window.naver.maps.Map(mapElement.value, mapOptions);

    // 정보창 생성
    infoWindow = new window.naver.maps.InfoWindow({
      content: "",
      borderWidth: 1,
      borderColor: "#ddd",
      backgroundColor: "white",
      disableAnchor: true,
      pixelOffset: new window.naver.maps.Point(0, -5),
    });

    // 지도 이동 이벤트 설정
    window.naver.maps.Event.addListener(map, "dragend", handleMapMoved);
    window.naver.maps.Event.addListener(map, "zoom_changed", handleMapMoved);

    // 현재 위치 마커 표시
    if (userLocation.value) {
      addUserLocationMarker(userLocation.value);

      // 현재 위치 기반 검색 수행
      searchNearbyPlaces();
    }
  } catch (error) {
    console.error("네이버 지도 초기화 실패:", error);
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
    store.dispatch("map/setMapCenter", {
      lat: center.lat(),
      lng: center.lng(),
    });
  }, 500);
};

const getAddress = async (userPos) => {
  try {
    const longitude = userPos.lng;
    const latitude = userPos.lat;

    const apiKey = "343ca1816ffa4279a4a706469463a590"; // opencagedata.com에서 발급
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=ko`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // OpenCage API 응답에서 동 이름 추출 시도
      const components = data.results[0].components;

      // 동 이름 찾기 시도 (여러 필드에 있을 수 있음)
      return components.suburb;
    }
  } catch (error) {
    console.error("동 이름 가져오기 실패:", error);
    throw error;
  }
};

// 현재 위치 가져오기
const getUserLocation = () => {
  isLoading.value = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        getAddress(userPos).then(
          (res) =>
            // console.log("현재위치 동이름 : ", res)
            (locationName.value = res)
        );

        // 스토어에 위치 저장
        store.dispatch("map/setUserLocation", userPos);

        // 지도 중심 이동 (지도가 초기화된 경우에만)
        if (map && window.naver) {
          try {
            map.setCenter(
              new window.naver.maps.LatLng(userPos.lat, userPos.lng)
            );

            // 현재 위치 마커 표시
            addUserLocationMarker(userPos);

            // 현재 위치 기반 검색 수행
            searchNearbyPlaces();
          } catch (error) {
            console.error("지도 위치 설정 실패:", error);
          }
        }

        isLoading.value = false;
      },
      (error) => {
        console.error("위치 정보를 가져오는데 실패했습니다:", error);

        // 기본 위치 (서울 중심)로 설정
        const defaultPos = { lat: 37.5666805, lng: 126.9784147 };
        store.dispatch("map/setUserLocation", defaultPos);

        if (map && window.naver) {
          try {
            map.setCenter(
              new window.naver.maps.LatLng(defaultPos.lat, defaultPos.lng)
            );

            // 기본 위치 기반 검색 수행
            searchNearbyPlaces();
          } catch (error) {
            console.error("지도 위치 설정 실패:", error);
          }
        }

        isLoading.value = false;
      }
    );
  } else {
    console.error("이 브라우저에서는 위치 정보를 지원하지 않습니다.");

    // 기본 위치 설정
    const defaultPos = { lat: 37.5666805, lng: 126.9784147 };
    store.dispatch("map/setUserLocation", defaultPos);

    if (map && window.naver) {
      map.setCenter(
        new window.naver.maps.LatLng(defaultPos.lat, defaultPos.lng)
      );

      // 기본 위치 기반 검색 수행
      // searchNearbyPlaces();
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
      map.setCenter(
        new window.naver.maps.LatLng(
          userLocation.value.lat,
          userLocation.value.lng
        )
      );
      map.setZoom(15); // 적절한 줌 레벨로 설정

      // 현재 위치 마커 표시
      addUserLocationMarker(userLocation.value);

      // 현재 위치 기반 검색 수행
      // searchNearbyPlaces();
    } catch (error) {
      console.error("지도 중심 이동 실패:", error);
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
        anchor: new window.naver.maps.Point(15, 15),
      },
      zIndex: 100,
    });
  } catch (error) {
    console.error("사용자 위치 마커 추가 실패:", error);
  }
};

// 모든 마커 제거
const clearAllMarkers = () => {
  markers.forEach((marker) => {
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
// const setThemeAndSearch = (theme) => {
//   activeTheme.value = theme;
//   searchPlaces();
// };

// 사용자 위치 주변 장소 검색
const searchNearbyPlaces = () => {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }

  searchNaverPlaces();
};

// 매장 추천 표시
const showRecommendations = () => {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }

  // 테마 키워드 가져오기
  const themeObj = themeOptions.find(
    (theme) => theme.value === activeTheme.value
  );
  const themeKeyword = themeObj ? themeObj.keyword : "";

  // 현재 위치 주변 추천 맛집 검색
  const query = themeKeyword;
  const coords = `${userLocation.value.lng},${userLocation.value.lat}`; // 경도,위도 순서

  // searchNaverPlaces(query, coords);
};

// 특정 범위 내 검색
const filterByDistance = () => {
  if (!userLocation.value) {
    getUserLocation();
    return;
  }

  // 카테고리 키워드 가져오기
  const categoryObj = foodCategories.find(
    (cat) => cat.value === activeCategory.value
  );
  const categoryKeyword = categoryObj ? categoryObj.keyword : "";

  // 현재 위치 주변 1km 내 식당 검색
  const query = categoryKeyword;
  const coords = `${userLocation.value.lng},${userLocation.value.lat}`; // 경도,위도 순서

  // 지도에 1km 반경 표시
  if (map && window.naver) {
    const userPos = new window.naver.maps.LatLng(
      userLocation.value.lat,
      userLocation.value.lng
    );
    map.setCenter(userPos);

    // 적절한 줌 레벨 설정 (대략 1km 반경이 보이게)
    map.setZoom(14);
  }

  // searchNaverPlaces(query, coords, 1000); // 1000m = 1km
};

// 검색창 검색
const searchPlaces = () => {
  isLoading.value = true;

  searchNaverPlaces();
};

// 네이버 지역 API로 장소 검색
const searchNaverPlaces = async () => {
  isLoading.value = true;

  // 카테고리 키워드 가져오기
  const categoryObj = foodCategories.find(
    (cat) => cat.value === activeCategory.value
  );
  const categoryKeyword = categoryObj ? categoryObj.keyword : "";

  const query = `${locationName.value} ${categoryKeyword} ${searchKeyword.value}`;

  try {
    // 네이버 지역 검색 API 호출 (서버 측에서 호출해야 함)
    const response = await recommendationService.recommendNearby({
      query,
    });

    const mockResults = response.items;

    // 검색 결과 처리
    searchResults.value = mockResults;

    // 마커 생성
    updateMapMarkers(searchResults.value);

    const aiRecommend = JSON.parse(response.claudeItem);

    console.log(aiRecommend.recommendation);

    // 첫 번째 결과로 추천 정보 설정
    if (mockResults.length > 0) {
      // setRecommendation(mockResults[0], aiRecommend.recommendation.reason); // ai recommend
      setRecommendation(mockResults[0], aiRecommend.recommendation);
    } else {
      currentRecommendation.value = null;
    }

    // 지도 중심 및 줌 레벨 조정 (모든 마커가 보이도록)
    if (map && window.naver && mockResults.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds();

      mockResults.forEach((place) => {
        bounds.extend(
          new window.naver.maps.LatLng(
            place.mapy / 10000000,
            place.mapx / 10000000
          )
        );
      });

      map.fitBounds(bounds);
    }
  } catch (error) {
    console.error("장소 검색 실패:", error);
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
        anchor: new window.naver.maps.Point(15, 35),
      },
      zIndex: 50,
    });

    // 마커 클릭 이벤트
    window.naver.maps.Event.addListener(marker, "click", () => {
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
      <div class="info-phone">${place.telephone || "정보 없음"}</div>
    </div>
  `;

  infoWindow.setContent(content);
  infoWindow.open(map, marker);
};

// 추천 정보 설정
const setRecommendation = (place, aiRecommend = null) => {
  if (!place) {
    currentRecommendation.value = null;
    return;
  }

  // 거리 계산 - 사용자 위치로부터의 거리
  let distance = "알 수 없음";
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
  const cleanTitle = place.title.replace(/<[^>]*>/g, "");
  const cleanCategory = place.category.replace(/<[^>]*>/g, "");
  const cleanAddress = place.address.replace(/<[^>]*>/g, "");

  // 추천 정보 구성
  currentRecommendation.value = {
    id: place.id,
    name: aiRecommend?.title || cleanTitle,
    category: aiRecommend?.category || cleanCategory,
    rating: place.rating || (4 + Math.random()).toFixed(1), // 평점은 그대로 유지
    distance,
    address: aiRecommend?.address || cleanAddress,
    phone: aiRecommend?.telephone || place.telephone || "",
    image:     // 이미지
      place.image ||
      `https://via.placeholder.com/80?text=${encodeURIComponent(
        (aiRecommend?.title || cleanTitle).substring(0, 5)
      )}`,
    mapx: place.mapx, // claudeItem에 추가필요
    mapy: place.mapy,
    aiReason:
      aiRecommend?.reason || generateRecommendationReason(place, distance),
    aiMenus: aiRecommend?.menus || null,
    aiMenuText: aiRecommend?.menu || null,
  };
};

// 추천 이유 생성
const generateRecommendationReason = (place, distance) => {
  const reasons = [
    `${place.title}은(는) 현재 위치에서 ${distance} 거리에 있는 ${place.category} 매장입니다.`,
    `이 매장은 현재 위치 주변에서 많은 이용자들이 방문하는 인기있는 ${place.category}입니다.`,
    `${place.title}은(는) ${place.category} 중에서 현재 위치와 가깝고 사용자 평가가 좋은 매장입니다.`,
    `이 ${place.category}은(는) 현재 위치에서 접근성이 좋은 매장으로 추천드립니다.`,
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
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km 단위 거리
};

// 라디안 변환
const toRad = (value) => {
  return (value * Math.PI) / 180;
};

// 지도 및 검색 리셋
const resetMapAndSearch = () => {
  searchKeyword.value = "";

  // 기본 카테고리로 리셋
  // activeCategory.value = "korean";
  // activeTheme.value = "popular";

  // 현재 위치 기준으로 지도 초기화
  centerToMyLocation();

  // 현재 위치 기반 검색 수행
  // searchNearbyPlaces();
};

// 네이버 지도 앱/웹으로 열기
const openNaverMap = (place) => {
  if (!place) return;

  // 네이버 지도 웹으로 연결 (모바일에서는 앱으로 연결됨)
  const title = encodeURIComponent(place.name);
  const lat = place.mapy / 10000000;
  const lng = place.mapx / 10000000;

  const naverMapUrl = `https://map.naver.com/v5/search/${title}?c=${lng},${lat},15,0,0,0,dh`;
  window.open(naverMapUrl, "_blank");
};

// 내 정보 페이지로 이동
const goToMyPage = () => {
  router.push({ name: "MyPage" });
};

// 필터 토글 상태
const showFilters = ref(false);

// 필터 토글 함수
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
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
  border-color: #ff5722;
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
  color: #ff5722;
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
  background-color: #ff5722;
  color: white;
  border-color: #ff5722;
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
  color: #ff5722;
}

.reset-btn,
.distance-btn,
.recommend-btn {
  min-width: 80px; /* 버튼 최소 너비 설정 */
  justify-content: center;
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
  color: #ff5722;
  font-size: 16px;
}

.recommendation {
  flex: 1;
  text-align: center;
  color: #4285f4;
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
  color: #4285f4;
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
  background-color: #ff5722;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

:deep(.marker-tail) {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid #ff5722;
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
  color: #ff5722;
  margin-bottom: 5px;
}

:deep(.info-address) {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

:deep(.info-phone) {
  font-size: 12px;
  color: #1ec800;
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
  color: #ff5722;
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

/* 검색 및 필터 영역 수정 */
.search-bar {
  padding: 10px 15px;
  background-color: white;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 200px; /* 최대 높이 설정 */
  overflow-y: auto; /* 세로 스크롤 추가 */
}
</style>