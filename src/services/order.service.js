// src/services/order.service.js
import api from './api';

class OrderService {
  /**
   * 메뉴 목록 조회
   * @param {String} category 카테고리 (optional)
   * @returns {Promise} 메뉴 목록
   */
  async getMenus(category) {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/restaurants/menus', { params });
      return response.data;
    } catch (error) {
      console.error('메뉴 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 주문 생성
   * @param {Object} orderData 주문 정보
   * @returns {Promise} 주문 결과
   */
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('주문 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 주문 히스토리 조회
   * @returns {Promise} 주문 히스토리
   */
  async getOrderHistory() {
    try {
      const response = await api.get('/orders/history');
      return response.data;
    } catch (error) {
      console.error('주문 히스토리 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 주문 상세 조회
   * @param {String} orderId 주문 ID
   * @returns {Promise} 주문 상세 정보
   */
  async getOrderDetail(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('주문 상세 조회 실패:', error);
      throw error;
    }
  }
}

export default new OrderService();