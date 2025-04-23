// restaurant.js
// 음식점 관련 Vuex 스토어

export default {
  namespaced: true,
  
  state: {
    restaurants: [],
    selectedRestaurant: null,
    loading: false,
    error: null
  },
  
  getters: {
    allRestaurants: state => state.restaurants,
    selectedRestaurant: state => state.selectedRestaurant,
    isLoading: state => state.loading,
    hasError: state => state.error !== null,
    errorMessage: state => state.error
  },
  
  mutations: {
    SET_RESTAURANTS(state, restaurants) {
      state.restaurants = restaurants;
    },
    SET_SELECTED_RESTAURANT(state, restaurant) {
      state.selectedRestaurant = restaurant;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  
  actions: {
    // 모든 음식점 가져오기
    fetchRestaurants({ commit, rootGetters }) {
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      // 실제 API 호출로 대체해야 함
      return new Promise((resolve) => {
        setTimeout(() => {
          const userLocation = rootGetters['map/userLocation'] || { lat: 37.5666805, lng: 126.9784147 };
          
          // 테스트용 데이터
          const restaurants = [
            {
              id: 1,
              title: '온정식당',
              category: '한식',
              position: {
                lat: userLocation.lat + 0.001,
                lng: userLocation.lng - 0.002
              },
              rating: 4.8,
              distance: '350m',
              image: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              aiReason: '현재 위치에서 가깝고 평점이 높은 한식당입니다.',
              recommendedMenus: [
                {
                  name: '특제 소고기 국밥',
                  price: '11,000',
                  image: 'https://images.unsplash.com/photo-1539750920903-59d71d128f5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                },
                {
                  name: '한우 수육',
                  price: '25,000',
                  image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                }
              ]
            },
            {
              id: 2,
              title: '강남 파스타',
              category: '양식',
              position: {
                lat: userLocation.lat - 0.002,
                lng: userLocation.lng + 0.001
              },
              rating: 4.6,
              distance: '450m',
              image: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              aiReason: '현재 위치 주변의 높은 평점을 가진 이탈리안 레스토랑입니다.',
              recommendedMenus: [
                {
                  name: '트러플 크림 파스타',
                  price: '18,000',
                  image: 'https://images.unsplash.com/photo-1608219992759-ceb27f85072a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                },
                {
                  name: '고르곤졸라 피자',
                  price: '22,000',
                  image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d382?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                }
              ]
            },
            {
              id: 3,
              title: '스시오마카세',
              category: '일식',
              position: {
                lat: userLocation.lat + 0.0015,
                lng: userLocation.lng + 0.0015
              },
              rating: 4.9,
              distance: '650m',
              image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              aiReason: '최고 등급의 신선한 회를 사용하는 오마카세 전문점입니다.',
              recommendedMenus: [
                {
                  name: '런치 오마카세',
                  price: '88,000',
                  image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                },
                {
                  name: '마츠 오마카세',
                  price: '150,000',
                  image: 'https://images.unsplash.com/photo-1534766438357-2b275e0a3429?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                }
              ]
            },
            {
              id: 4,
              title: '홍대불맛쭈꾸미',
              category: '한식',
              position: {
                lat: userLocation.lat - 0.001,
                lng: userLocation.lng - 0.001
              },
              rating: 4.5,
              distance: '300m',
              image: 'https://images.unsplash.com/photo-1534766066739-5266cd275fd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              aiReason: '매콤한 맛이 일품인 쭈꾸미 요리 전문점입니다.',
              recommendedMenus: [
                {
                  name: '매운 쭈꾸미',
                  price: '15,000',
                  image: 'https://images.unsplash.com/photo-1534766732424-17ae248f4408?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                },
                {
                  name: '해물파전',
                  price: '12,000',
                  image: 'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                }
              ]
            },
            {
              id: 5,
              title: '북경반점',
              category: '중식',
              position: {
                lat: userLocation.lat + 0.002,
                lng: userLocation.lng + 0.001
              },
              rating: 4.3,
              distance: '550m',
              image: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
              aiReason: '정통 중화요리를 맛볼 수 있는 음식점입니다.',
              recommendedMenus: [
                {
                  name: '짜장면',
                  price: '8,000',
                  image: 'https://images.unsplash.com/photo-1567057419565-4349c49d8a04?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                },
                {
                  name: '탕수육',
                  price: '23,000',
                  image: 'https://images.unsplash.com/photo-1582271929435-0a5a1f6b4145?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                }
              ]
            }
          ];
          
          commit('SET_RESTAURANTS', restaurants);
          commit('SET_LOADING', false);
          resolve(restaurants);
        }, 300); // 실제 API 호출 시뮬레이션을 위한 딜레이
      });
    },
    
    // 음식점 선택
    selectRestaurant({ commit, state }, restaurantId) {
      const restaurant = state.restaurants.find(r => r.id === restaurantId);
      
      if (restaurant) {
        commit('SET_SELECTED_RESTAURANT', restaurant);
      } else {
        commit('SET_ERROR', '음식점을 찾을 수 없습니다.');
      }
    },
    
    // 음식점 필터링 (위치 기반, 카테고리 등)
    filterRestaurants({ commit, state, rootGetters }, filters) {
      commit('SET_LOADING', true);
      
      return new Promise((resolve) => {
        // 실제로는 API 호출로 대체하거나, 더 복잡한 필터링 로직 구현
        setTimeout(() => {
          let filteredRestaurants = [...state.restaurants];
          
          // 위치 기반 필터링 (중심 위치로부터 반경 내)
          if (filters.location && filters.radius) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => {
              // 하버사인 공식으로 두 위치 간 거리 계산
              const distance = calculateDistance(
                filters.location.lat, 
                filters.location.lng,
                restaurant.position.lat,
                restaurant.position.lng
              );
              
              // km 단위로 변환하여 필터
              return distance <= filters.radius;
            });
          }
          
          // 카테고리 필터링
          if (filters.category) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => 
              restaurant.category.toLowerCase() === filters.category.toLowerCase()
            );
          }
          
          commit('SET_RESTAURANTS', filteredRestaurants);
          commit('SET_LOADING', false);
          resolve(filteredRestaurants);
        }, 200);
      });
    }
  }
};

// 두 위치 간 거리 계산 (하버사인 공식)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 지구 반경 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // km 단위 거리
}

function toRad(value) {
  return value * Math.PI / 180;
}