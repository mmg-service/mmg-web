import { requestWithBaseURL } from './api'
const orderingApi = requestWithBaseURL(process.env.VUE_APP_RECOMMENDATION_API_URL) 

class OrderingService {
  /**
   * 음식점 주문 요청을 보냅니다.
   * @param {string} restaurantName - 주문할 음식점 이름
   * @param {Object} [additionalParams] - 추가 파라미터 (선택사항)
   * @returns {Promise<Object>} - API 응답 데이터
   */
  async getMenuList(title, additionalParams = {}) {
    console.log('Placing order for restaurant:', title)
    console.log('Using baseURL:', process.env.VUE_APP_RECOMMENDATION_API_URL)

    const params = {
      title,
      ...additionalParams
    }

    const response = await orderingApi.get('/ordering', {params: params});
    
    // 토큰이 있다면 로컬 스토리지에 저장
    if (response.data.token) {
      localStorage.setItem('order-token', response.data.token)
      localStorage.setItem('order-details', JSON.stringify(response.data.orderDetails))
    }
    
    return response.data
  }
}

export default new OrderingService();