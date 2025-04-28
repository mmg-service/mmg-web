<!-- src/components/order/OrderComplete.vue -->
<template>
    <div class="order-complete">
      <div class="modal-content">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        
        <h2 class="success-title">주문 완료 하였습니다.</h2>
        
        <div class="order-info" v-if="order">
          <div class="order-item">
            <span class="label">주문번호</span>
            <span class="value">{{ order.orderId }}</span>
          </div>
          <div class="order-item">
            <span class="label">주문시간</span>
            <span class="value">{{ formatDate(order.orderDate) }}</span>
          </div>
          <div class="order-item">
            <span class="label">주문금액</span>
            <span class="value">{{ formatPrice(order.totalAmount) }}원</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="$emit('close')" class="close-button">확인</button>
          <button @click="$emit('view-orders')" class="view-orders-button">주문내역 보기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrderComplete',
    props: {
      order: {
        type: Object,
        default: null
      }
    },
    methods: {
      formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hour}:${minute}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .order-complete {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: #fff;
    width: 90%;
    max-width: 400px;
    border-radius: 8px;
    padding: 32px 24px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .success-icon {
    font-size: 64px;
    color: #4CAF50;
    margin-bottom: 16px;
  }
  
  .success-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px;
    color: #333;
  }
  
  .order-info {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .order-item:last-child {
    margin-bottom: 0;
  }
  
  .label {
    color: #666;
  }
  
  .value {
    font-weight: 600;
    color: #333;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
  
  .close-button {
    flex: 1;
    background-color: #00c2b3;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .view-orders-button {
    flex: 1;
    background-color: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
  </style>