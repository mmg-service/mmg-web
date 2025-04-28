// src/store/modules/order.js
import OrderService from '@/services/order.service';

export default {
  namespaced: true,
  
  state: {
    menuItems: [],
    cartItems: [],
    orderHistory: [],
    currentOrder: null,
    loading: false,
    error: null
  },
  
  getters: {
    cartCount: state => state.cartItems.reduce((total, item) => total + item.quantity, 0),
    
    cartTotal: state => state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
    
    formattedCartTotal: (state, getters) => {
      return getters.cartTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    hasItemsInCart: state => state.cartItems.length > 0
  },
  
  mutations: {
    SET_MENU_ITEMS(state, menuItems) {
      state.menuItems = menuItems;
    },
    
    ADD_TO_CART(state, menuItem) {
      const existingItem = state.cartItems.find(item => item.id === menuItem.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          ...menuItem,
          quantity: 1
        });
      }
    },
    
    UPDATE_CART_ITEM_QUANTITY(state, { itemId, quantity }) {
      const item = state.cartItems.find(item => item.id === itemId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    
    REMOVE_FROM_CART(state, itemId) {
      state.cartItems = state.cartItems.filter(item => item.id !== itemId);
    },
    
    CLEAR_CART(state) {
      state.cartItems = [];
    },
    
    SET_ORDER_HISTORY(state, orders) {
      state.orderHistory = orders;
    },
    
    SET_CURRENT_ORDER(state, order) {
      state.currentOrder = order;
    },
    
    SET_LOADING(state, status) {
      state.loading = status;
    },
    
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  
  actions: {
    async fetchMenuItems({ commit }, category) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // API 연동 부분 (실제 서비스에서는 API 호출)
        // const orderData = {
        //   items: state.cartItems.map(item => ({
        //     menuId: item.id,
        //     quantity: item.quantity,
        //     price: item.price
        //   })),
        //   totalAmount: getters.cartTotal
        // };
        // const response = await OrderService.createOrder(orderData);
        
        // 테스트용 더미 응답
        const mockResponse = {
          orderId: 'ORD-' + Math.floor(Math.random() * 10000),
          orderDate: new Date().toISOString(),
          status: 'COMPLETED',
          totalAmount: getters.cartTotal,
          items: state.cartItems.map(item => ({
            menuId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        };
        
        commit('SET_CURRENT_ORDER', mockResponse);
        dispatch('clearCart');
        
        return mockResponse;
      } catch (error) {
        commit('SET_ERROR', '주문 처리 중 오류가 발생했습니다.');
        console.error('주문 처리 오류:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchOrderHistory({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await OrderService.getOrderHistory();
        commit('SET_ORDER_HISTORY', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', '주문 내역을 불러오는데 실패했습니다.');
        console.error('주문 내역 조회 오류:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchOrderDetail({ commit }, orderId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        const response = await OrderService.getOrderDetail(orderId);
        commit('SET_CURRENT_ORDER', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', '주문 상세 정보를 불러오는데 실패했습니다.');
        console.error('주문 상세 조회 오류:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};