export default {
    namespaced: true,
    
    state: {
      filters: {
        theme: null, // 한식, 양식, 일식, 중식, 카페, 기타
        people: null, // 1인, 2-4인, 5인+
        situation: null, // 데이트, 회식, 친구만남, 점심식사, 저녁식사, 기타
        location: null // 현재위치 기준 거리
      },
      searchKeyword: '',
      searchResults: []
    },
    
    mutations: {
      setThemeFilter(state, theme) {
        state.filters.theme = theme
      },
      setPeopleFilter(state, people) {
        state.filters.people = people
      },
      setSituationFilter(state, situation) {
        state.filters.situation = situation
      },
      setLocationFilter(state, location) {
        state.filters.location = location
      },
      setSearchKeyword(state, keyword) {
        state.searchKeyword = keyword
      },
      setSearchResults(state, results) {
        state.searchResults = results
      },
      resetFilters(state) {
        state.filters = {
          theme: null,
          people: null,
          situation: null,
          location: null
        }
      }
    },
    
    actions: {
      applyThemeFilter({ commit }, theme) {
        commit('setThemeFilter', theme)
      },
      applyPeopleFilter({ commit }, people) {
        commit('setPeopleFilter', people)
      },
      applySituationFilter({ commit }, situation) {
        commit('setSituationFilter', situation)
      },
      applyLocationFilter({ commit }, location) {
        commit('setLocationFilter', location)
      },
      search({ commit, state, dispatch }, keyword) {
        commit('setSearchKeyword', keyword)
        // 검색 서비스 호출 및 결과 저장
        return dispatch('restaurant/filterRestaurants', {
          keyword: state.searchKeyword,
          ...state.filters
        }, { root: true })
      },
      resetAllFilters({ commit }) {
        commit('resetFilters')
      }
    },
    
    getters: {
      currentFilters: state => state.filters,
      hasActiveFilters: state => {
        return state.filters.theme || state.filters.people || 
               state.filters.situation || state.filters.location
      }
    }
  }