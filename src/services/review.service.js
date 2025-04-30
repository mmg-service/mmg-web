import { requestWithBaseURL } from './api'
const reviewApi = requestWithBaseURL(process.env.VUE_APP_REVIEW_API_URL) 

class ReviewService {
  async getClaudeReview(queryParams) {
    console.log('Using baseURL:', process.env.VUE_APP_REVIEW_API_URL)

    const response = await reviewApi.get('/claude', {
      params: queryParams
    });
    
    if (response.data.token) {
      localStorage.setItem('user-token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  }

  async getReviewSummary(queryParams={}) {
    console.log('Using baseURL:', process.env.VUE_APP_REVIEW_API_URL)

    const response = await reviewApi.get('/reviewSummary', {
      query: queryParams
    });
    
    if (response.data.token) {
      localStorage.setItem('user-token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  }

  
}

export default new ReviewService()