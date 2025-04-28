<!-- src/views/MenuOrderView.vue -->
<template>
    <div class="menu-order-page">
      <header class="page-header">
        <div class="left-section">
          <div class="back-button" @click="goBack">
            <i class="fas fa-arrow-left"></i>
          </div>
          <h1 class="page-title">메뉴주문</h1>
        </div>
        <div class="logo-container">
          <img src="@/assets/images/kt-logo.png" alt="KT 로고" class="kt-logo">
          <span class="hiorder-text">하이오더</span>
        </div>
      </header>
      
      <div class="menu-tabs">
        <button class="tab-button active">주메뉴</button>
        <button class="tab-button">사이드</button>
        <button class="tab-button">음료</button>
      </div>
      
      <div class="menu-list">
        <div v-for="menu in menuItems" :key="menu.id" class="menu-card">
          <div class="menu-image-container">
            <img :src="menu.image" :alt="menu.name" class="menu-image">
            <span v-if="menu.isBest" class="best-badge">추천</span>
          </div>
          <div class="menu-info">
            <h3 class="menu-name">{{ menu.name }}</h3>
            <p class="menu-price">{{ formatPrice(menu.price) }}원</p>
            <button class="order-button" @click="addToCart(menu)">담기</button>
          </div>
        </div>
      </div>
      
      <div class="order-footer">
        <div class="cart-info">
          <button class="cart-button" @click="showCartItems">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">{{ cartCount }}</span>
          </button>
          <span class="cart-detail">주문내역</span>
        </div>
        <button class="order-submit-button" @click="placeOrder">
          주문하기 <span v-if="totalAmount > 0">({{ formatPrice(totalAmount) }}원)</span>
        </button>
      </div>
      
      <!-- 주문내역 모달 -->
      <div class="cart-modal" v-if="showCart">
        <div class="cart-modal-content">
          <div class="cart-modal-header">
            <h3>주문 내역</h3>
            <button class="close-button" @click="showCart = false">&times;</button>
          </div>
          <div class="cart-items" v-if="cartItems.length > 0">
            <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
              <div class="cart-item-info">
                <h4>{{ item.name }}</h4>
                <p>{{ formatPrice(item.price) }}원</p>
              </div>
              <div class="cart-item-quantity">
                <button @click="decreaseQuantity(index)">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="increaseQuantity(index)">+</button>
              </div>
            </div>
          </div>
          <div class="cart-empty" v-else>
            <p>주문내역이 비어있습니다.</p>
          </div>
          <div class="cart-total">
            <p>총 주문금액: <strong>{{ formatPrice(totalAmount) }}원</strong></p>
          </div>
        </div>
      </div>
  
      <!-- 주문 완료 모달 -->
      <div class="order-complete-modal" v-if="orderComplete">
        <div class="order-complete-content">
          <h3>주문 완료 하였습니다.</h3>
          <button @click="orderComplete = false">확인</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MenuOrderView',
    data() {
      return {
        menuItems: [
          {
            id: 1,
            name: '꼬짜떡볶이',
            price: 5000,
            image: require('@/assets/images/sample_small_menu_tteokbokki_1.jpg'),
            isBest: true
          },
          {
            id: 2,
            name: '돈까스떡볶이',
            price: 6000,
            image: require('@/assets/images/sample_small_menu_tteokbokki_2.jpg'),
            isBest: false
          },
          {
            id: 3,
            name: '즉석떡볶이',
            price: 9000,
            image: require('@/assets/images/sample_small_menu_tteokbokki_1.jpg'),
            isBest: false
          },
          {
            id: 4,
            name: '치즈떡볶이',
            price: 6500,
            image: require('@/assets/images/sample_small_menu_tteokbokki_1.jpg'),
            isBest: false
          },
          {
            id: 5,
            name: '매운떡볶이',
            price: 5500,
            image: require('@/assets/images/sample_small_menu_tteokbokki_2.jpg'),
            isBest: false
          }
        ],
        cartItems: [],
        showCart: false,
        orderComplete: false
      };
    },
    computed: {
      cartCount() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
      },
      totalAmount() {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      addToCart(menu) {
        const existingItem = this.cartItems.find(item => item.id === menu.id);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          this.cartItems.push({
            id: menu.id,
            name: menu.name,
            price: menu.price,
            quantity: 1
          });
        }
      },
      showCartItems() {
        this.showCart = true;
      },
      increaseQuantity(index) {
        this.cartItems[index].quantity += 1;
      },
      decreaseQuantity(index) {
        if (this.cartItems[index].quantity > 1) {
          this.cartItems[index].quantity -= 1;
        } else {
          this.cartItems.splice(index, 1);
        }
      },
      placeOrder() {
        if (this.cartItems.length > 0) {
          // 주문 처리 로직이 필요하면 여기에 추가
          this.orderComplete = true;
          // 주문 완료 후 주문내역 비우기
          this.cartItems = [];
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .logo-container {
    display: flex;
    align-items: right;
  }

  .kt-logo {
    height: 24px;
    margin-right: 4px;
  }

  .hiorder-text {
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
  }

  .menu-order-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 좌우 정렬을 위해 변경 */
    padding: 1rem;
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }

  .left-section {
    display: flex;
    align-items: center;
  }
  
  .back-button {
    font-size: 1.2rem;
    margin-right: 1rem;
    cursor: pointer;
  }
  
  .page-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0;
  }
  
  .menu-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    background-color: #fff;
  }
  
  .tab-button {
    flex: 1;
    padding: 0.8rem;
    font-size: 0.9rem;
    border: none;
    background: none;
    cursor: pointer;
  }
  
  .tab-button.active {
    color: #00c2b3;
    border-bottom: 2px solid #00c2b3;
    font-weight: 600;
  }
  
  .menu-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .menu-card {
    display: flex;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }
  
  .menu-image-container {
    position: relative;
    width: 120px;
    height: 120px;
  }
  
  .menu-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .best-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background-color: #f44336;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .menu-info {
    flex: 1;
    padding: 0.8rem;
    display: flex;
    flex-direction: column;
  }
  
  .menu-name {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }
  
  .menu-price {
    margin: 0 0 auto;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .order-button {
    align-self: flex-end;
    background-color: #222;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .order-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background-color: #fff;
    border-top: 1px solid #eee;
  }
  
  .cart-info {
    display: flex;
    align-items: center;
  }
  
  .cart-button {
    position: relative;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #f44336;
    color: white;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
  }
  
  .cart-detail {
    margin-left: 0.5rem;
    font-size: 0.9rem;
  }
  
  .order-submit-button {
    background-color: #00c2b3;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  /* 모달 스타일 */
  .cart-modal, .order-complete-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .cart-modal-content, .order-complete-content {
    background-color: #fff;
    width: 90%;
    max-width: 500px;
    border-radius: 8px;
    overflow: hidden;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }
  
  .cart-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }
  
  .cart-modal-header h3 {
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  .cart-items {
    padding: 1rem;
    overflow-y: auto;
  }
  
  .cart-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .cart-item-info h4 {
    margin: 0 0 0.5rem;
  }
  
  .cart-item-info p {
    margin: 0;
  }
  
  .cart-item-quantity {
    display: flex;
    align-items: center;
  }
  
  .cart-item-quantity button {
    width: 24px;
    height: 24px;
    border: 1px solid #ddd;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    cursor: pointer;
  }
  
  .cart-empty {
    padding: 2rem;
    text-align: center;
    color: #666;
  }
  
  .cart-total {
    padding: 1rem;
    border-top: 1px solid #eee;
  }
  
  .order-complete-content {
    padding: 2rem;
    text-align: center;
  }
  
  .order-complete-content h3 {
    margin: 0 0 1.5rem;
  }
  
  .order-complete-content button {
    background-color: #00c2b3;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  </style>