import { requestWithBaseURL } from './api'
const recommendApi = requestWithBaseURL(process.env.VUE_APP_RECOMMENDATION_API_URL) 

class RecommendationService {
  async recommendNearby(queryParams) {
    console.log('Using baseURL:', process.env.VUE_APP_RECOMMENDATION_API_URL)

    const response = await recommendApi.get('/nearby', {
      params: queryParams
    });
    
    if (response.data.token) {
      localStorage.setItem('user-token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  }

  
}

export default new RecommendationService()