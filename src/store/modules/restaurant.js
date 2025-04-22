import RestaurantService from '@/services/restaurant.service'

export default {
  namespaced: true,
  
  state: {
    restaurants: [],
    recommendedRestaurants: [],
    currentRestaurant: null,
    loading: false
  },
  
  mutations: {
    setRestaurants(state, restaurants) {
      state.restaurants = restaurants
    },
    setRecommendedRestaurants(state, restaurants) {
      state.recommendedRestaurants = restaurants
    },
    setCurrentRestaurant(state, restaurant) {
      state.currentRestaurant = restaurant
    },
    setLoading(state, status) {
      state.loading = status
    }
  },
  
  actions: {
    fetchRestaurants({ commit }) {
      commit('setLoading', true)
      return RestaurantService.getRestaurants().then(
        response => {
          commit('setRestaurants', response.data)
          commit('setLoading', false)
          return Promise.resolve(response.data)
        },
        error => {
          commit('setLoading', false)
          return Promise.reject(error)
        }
      )
    },
    fetchRecommendedRestaurants({ commit }) {
      commit('setLoading', true)
      return RestaurantService.getRecommendedRestaurants().then(
        response => {
          commit('setRecommendedRestaurants', response.data)
          commit('setLoading', false)
          return Promise.resolve(response.data)
        },
        error => {
          commit('setLoading', false)
          return Promise.reject(error)
        }
      )
    },
    fetchRestaurantDetail({ commit }, id) {
      commit('setLoading', true)
      return RestaurantService.getRestaurantDetail(id).then(
        response => {
          commit('setCurrentRestaurant', response.data)
          commit('setLoading', false)
          return Promise.resolve(response.data)
        },
        error => {
          commit('setLoading', false)
          return Promise.reject(error)
        }
      )
    },
    filterRestaurants({ commit }, filters) {
      commit('setLoading', true)
      return RestaurantService.filterRestaurants(filters).then(
        response => {
          commit('setRestaurants', response.data)
          commit('setLoading', false)
          return Promise.resolve(response.data)
        },
        error => {
          commit('setLoading', false)
          return Promise.reject(error)
        }
      )
    }
  },
  
  getters: {
    allRestaurants: state => state.restaurants,
    recommendedRestaurants: state => state.recommendedRestaurants,
    restaurantDetail: state => state.currentRestaurant,
    isLoading: state => state.loading
  }
}