<!-- src/components/order/OrderCart.vue -->
<template>
    <div class="order-cart">
      <div class="cart-header">
        <h3>주문내역</h3>
        <button v-if="cartItems.length > 0" @click="clearCart" class="clear-cart-button">전체 삭제</button>
      </div>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        <i class="fas fa-shopping-cart empty-cart-icon"></i>
        <p>주문내역이 비어있습니다.</p>
      </div>
      
      <div v-else class="cart-items">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <div class="item-info">
            <h4 class="item-name">{{ item.name }}</h4>
            <p class="item-price">{{ formatPrice(item.price) }}원</p>
          </div>
          <div class="item-quantity">
            <button @click="decreaseQuantity(item)" class="quantity-button">-</button>
            <span class="quantity-value">{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="quantity-button">+</button>
          </div>
          <div class="item-total">
            <p>{{ formatPrice(item.price * item.quantity) }}원</p>
          </div>
        </div>
      </div>
      
      <div class="cart-footer">
        <div class="cart-total">
          <p>총 주문금액</p>
          <p class="total-price">{{ formatPrice(totalAmount) }}원</p>
        </div>
        <button 
          :disabled="cartItems.length === 0" 
          @click="placeOrder" 
          :class="['order-button', { 'disabled': cartItems.length === 0 }]"
        >
          주문하기
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'OrderCart',
    computed: {
      ...mapState('order', ['cartItems']),
      ...mapGetters('order', {
        totalAmount: 'cartTotal'
      })
    },
    methods: {
      ...mapActions('order', [
        'updateCartItemQuantity', 
        'removeFromCart', 
        'clearCart',
        'placeOrder'
      ]),
      
      formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      
      increaseQuantity(item) {
        this.updateCartItemQuantity({ 
          itemId: item.id, 
          quantity: item.quantity + 1 
        });
      },
      
      decreaseQuantity(item) {
        if (item.quantity > 1) {
          this.updateCartItemQuantity({ 
            itemId: item.id, 
            quantity: item.quantity - 1 
          });
        } else {
          this.removeFromCart(item.id);
        }
      },
      
      async onPlaceOrder() {
        try {
          await this.placeOrder();
          this.$emit('order-placed');
        } catch (error) {
          console.error('주문 처리 중 오류가 발생했습니다:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .order-cart {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    max-height: 100%;
  }
  
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }
  
  .cart-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  .clear-cart-button {
    background: none;
    border: none;
    color: #999;
    font-size: 12px;
    cursor: pointer;
  }
  
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    color: #999;
  }
  
  .empty-cart-icon {
    font-size: 40px;
    margin-bottom: 16px;
    color: #ddd;
  }
  
  .cart-items {
    overflow-y: auto;
    flex: 1;
    padding: 0 16px;
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
  }
  
  .item-info {
    flex: 1;
  }
  
  .item-name {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 500;
  }
  
  .item-price {
    margin: 0;
    font-size: 12px;
    color: #666;
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    margin: 0 16px;
  }
  
  .quantity-button {
    width: 28px;
    height: 28px;
    border: 1px solid #eee;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
  }
  
  .quantity-value {
    width: 30px;
    text-align: center;
    font-size: 14px;
  }
  
  .item-total {
    font-size: 14px;
    font-weight: 600;
    min-width: 60px;
    text-align: right;
  }
  
  .cart-footer {
    padding: 16px;
    border-top: 1px solid #eee;
  }
  
  .cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .cart-total p {
    margin: 0;
    font-size: 14px;
  }
  
  .total-price {
    font-weight: 600;
    font-size: 16px !important;
  }
  
  .order-button {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 4px;
    background-color: #00c2b3;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .order-button.disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
  </style>