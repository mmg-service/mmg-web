// search.js
// 검색 관련 Vuex 스토어

export default {
  namespaced: true,
  
  state: {
    keyword: '',
    filters: {
      foodCategory: null, // 한식, 일식, 중식, 양식 등
      theme: null,        // 가볍게, 푸짐하게, 나만의, 인기있는 등
      location: null,     // 위치 반경 (km)
      price: null,        // 가격대
      openNow: false      // 현재 영업 중
    },
    results: [],
    loading: false,
    error: null
  },
  
  getters: {
    keyword: state => state.keyword,
    filters: state => state.filters,
    activeFilters: state => {
      const active = {};
      Object.keys(state.filters).forEach(key => {
        if (state.filters[key] !== null && state.filters[key] !== false) {
          active[key] = state.filters[key];
        }
      });
      return active;
    },
    searchResults: state => state.results,
    isLoading: state => state.loading,
    hasError: state => state.error !== null,
    errorMessage: state => state.error
  },
  
  mutations: {
    SET_KEYWORD(state, keyword) {
      state.keyword = keyword;
    },
    SET_FILTER(state, { key, value }) {
      state.filters[key] = value;
    },
    RESET_FILTERS(state) {
      Object.keys(state.filters).forEach(key => {
        state.filters[key] = null;
      });
      state.filters.openNow = false;
    },
    SET_RESULTS(state, results) {
      state.results = results;
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
    // 기본 검색
    search({ commit, dispatch }, keyword) {
      commit('SET_KEYWORD', keyword);
      commit('SET_LOADING', true);
      commit('CLEAR_ERROR');
      
      // 실제로는 API 호출로 대체
      setTimeout(() => {
        dispatch('restaurant/fetchRestaurants', null, { root: true })
          .then(restaurants => {
            // 키워드 필터링 로직 (실제로는 백엔드에서 처리)
            let filteredResults = restaurants;
            
            if (keyword && keyword.trim() !== '') {
              filteredResults = restaurants.filter(restaurant => 
                restaurant.title.toLowerCase().includes(keyword.toLowerCase()) ||
                restaurant.category.toLowerCase().includes(keyword.toLowerCase())
              );
            }
            
            commit('SET_RESULTS', filteredResults);
            commit('SET_LOADING', false);
          })
          .catch(error => {
            commit('SET_ERROR', error.message || '검색 중 오류가 발생했습니다.');
            commit('SET_LOADING', false);
          });
      }, 100);
    },
    
    // 필터 적용 검색
    searchWithFilters({ commit, state, dispatch }, filters) {
      // 키워드 설정
      if (filters.keyword !== undefined) {
        commit('SET_KEYWORD', filters.keyword);
      }
      
      // 각 필터 설정
      if (filters.category !== undefined) {
        commit('SET_FILTER', { key: 'foodCategory', value: filters.category });
      }
      
      if (filters.theme !== undefined) {
        commit('SET_FILTER', { key: 'theme', value: filters.theme });
      }
      
      if (filters.location !== undefined) {
        commit('SET_FILTER', { key: 'location', value: filters.location });
      }
      
      if (filters.price !== undefined) {
        commit('SET_FILTER', { key: 'price', value: filters.price });
      }
      
      if (filters.openNow !== undefined) {
        commit('SET_FILTER', { key: 'openNow', value: filters.openNow });
      }
      
      commit('SET_LOADING', true);
      
      // 실제로는 필터링된 결과를 API에서 가져옴
      return new Promise((resolve) => {
        setTimeout(() => {
          // restaurant 스토어에서 음식점 정보 가져오기
          dispatch('restaurant/fetchRestaurants', null, { root: true })
            .then(restaurants => {
              // 필터링 로직 구현 (실제로는 백엔드에서 처리)
              let filteredResults = [...restaurants];
              
              // 키워드 필터링
              if (state.keyword && state.keyword.trim() !== '') {
                filteredResults = filteredResults.filter(restaurant => 
                  restaurant.title.toLowerCase().includes(state.keyword.toLowerCase()) ||
                  restaurant.category.toLowerCase().includes(state.keyword.toLowerCase())
                );
              }
              
              // 음식 카테고리 필터링
              if (state.filters.foodCategory) {
                const categoryMap = {
                  'korean': '한식',
                  'japanese': '일식',
                  'chinese': '중식',
                  'western': '양식'
                };
                
                const categoryName = categoryMap[state.filters.foodCategory] || state.filters.foodCategory;
                
                filteredResults = filteredResults.filter(restaurant => 
                  restaurant.category === categoryName
                );
              }
              
              // 테마 필터링 (실제로는 백엔드에서 복잡한 로직으로 처리)
              if (state.filters.theme) {
                // 테마별 필터링 로직 구현 (예시)
                switch(state.filters.theme) {
                  case 'light':
                    // 가볍게 먹을 수 있는 음식점 필터링
                    break;
                  case 'hearty':
                    // 푸짐한 음식점 필터링
                    break;
                  case 'personal':
                    // 개인 취향 기반 필터링
                    break;
                  case 'popular':
                    // 인기순 정렬
                    filteredResults.sort((a, b) => b.rating - a.rating);
                    break;
                }
              }
              
              commit('SET_RESULTS', filteredResults);
              resolve(filteredResults);
            })
            .catch(error => {
              commit('SET_ERROR', error.message || '검색 중 오류가 발생했습니다.');
              resolve([]);
            })
            .finally(() => {
              commit('SET_LOADING', false);
            });
        }, 300);
      });
    },
    
    // 음식 카테고리 필터 적용
    applyFoodCategoryFilter({ commit }, category) {
      commit('SET_FILTER', { key: 'foodCategory', value: category });
    },
    
    // 테마 필터 적용
    applyThemeFilter({ commit }, theme) {
      commit('SET_FILTER', { key: 'theme', value: theme });
    },
    
    // 위치 필터 적용
    applyLocationFilter({ commit }, radiusKm) {
      commit('SET_FILTER', { key: 'location', value: radiusKm });
    },
    
    // 모든 필터 초기화
    resetAllFilters({ commit }) {
      commit('RESET_FILTERS');
      commit('SET_KEYWORD', '');
    }
  }
}