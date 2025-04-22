import api from './api'

class RestaurantService {
  async getRestaurants() {
    return api.get('/restaurants')
  }

  async getRecommendedRestaurants() {
    return api.get('/restaurants/recommended')
  }

  async getRestaurantDetail(id) {
    return api.get(`/restaurants/${id}`)
  }

  async filterRestaurants(filters) {
    return api.post('/restaurants/filter', filters)
  }

  async addFavorite(restaurantId) {
    return api.post('/favorites', { restaurantId })
  }

  async removeFavorite(restaurantId) {
    return api.delete(`/favorites/${restaurantId}`)
  }

  async getFavorites() {
    return api.get('/favorites')
  }
}

export default new RestaurantService()