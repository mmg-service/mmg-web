// map.js
// 지도 관련 Vuex 스토어

export default {
  namespaced: true,
  
  state: {
    userLocation: null,
    mapCenter: {
      lat: 37.5666805, // 서울 시청 (기본값)
      lng: 126.9784147
    },
    markers: [],
    userMarker: null,
    selectedMarkerId: null
  },
  
  getters: {
    userLocation: state => state.userLocation,
    mapCenterPosition: state => state.mapCenter,
    allMarkers: state => state.markers,
    userMarker: state => state.userMarker,
    selectedMarkerId: state => state.selectedMarkerId
  },
  
  mutations: {
    SET_USER_LOCATION(state, location) {
      state.userLocation = location;
    },
    SET_MAP_CENTER(state, center) {
      state.mapCenter = center;
    },
    SET_MARKERS(state, markers) {
      state.markers = markers;
    },
    ADD_MARKER(state, marker) {
      state.markers.push(marker);
    },
    SET_USER_MARKER(state, marker) {
      state.userMarker = marker;
    },
    SET_SELECTED_MARKER_ID(state, id) {
      state.selectedMarkerId = id;
    }
  },
  
  actions: {
    // 사용자 위치 가져오기
    getUserLocation({ commit }) {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              
              commit('SET_USER_LOCATION', location);
              commit('SET_MAP_CENTER', location);
              resolve(location);
            },
            error => {
              console.error('위치 정보를 가져오는데 실패했습니다:', error);
              
              // 기본 위치 (서울 시청)
              const defaultLocation = { lat: 37.5666805, lng: 126.9784147 };
              commit('SET_USER_LOCATION', defaultLocation);
              commit('SET_MAP_CENTER', defaultLocation);
              
              resolve(defaultLocation);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        } else {
          console.error('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
          
          // 기본 위치
          const defaultLocation = { lat: 37.5666805, lng: 126.9784147 };
          commit('SET_USER_LOCATION', defaultLocation);
          commit('SET_MAP_CENTER', defaultLocation);
          
          resolve(defaultLocation);
        }
      });
    },
    
    // 지도 중심 변경
    setMapCenter({ commit }, center) {
      commit('SET_MAP_CENTER', center);
    },
    
    // 지도 마커 업데이트
    updateMapMarkers({ commit }, markers) {
      commit('SET_MARKERS', markers);
    },
    
    // 마커 추가
    addMarker({ commit }, marker) {
      commit('ADD_MARKER', marker);
    },
    
    // 사용자 위치 마커 설정
    setUserMarker({ commit }, marker) {
      commit('SET_USER_MARKER', marker);
    },
    
    // 선택된 마커 ID 설정
    setSelectedMarkerId({ commit }, id) {
      commit('SET_SELECTED_MARKER_ID', id);
    }
  }
}