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
        <img src="@/assets/images/kt-logo.png" alt="KT 로고" class="kt-logo" />
        <span class="hiorder-text">하이오더</span>
      </div>
    </header>

    <!-- <div class="menu-tabs">
      <button class="tab-button active">주메뉴</button>
      <button class="tab-button">사이드</button>
      <button class="tab-button">음료</button>
    </div> -->

    <!-- 새로운 리뷰 요약 컴포넌트 -->
    <ReviewSummary :summaryText="restaurantReviewSummary" />

    <div class="menu-list">
      <div v-for="menu in menuItems" :key="menu.id" class="menu-card">
        <div class="menu-image-container">
          <img :src="menu.image" :alt="menu.name" class="menu-image" />
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
        주문하기
        <span v-if="totalAmount > 0">({{ formatPrice(totalAmount) }}원)</span>
      </button>
    </div>

    <!-- 주문내역 모달 -->
    <div class="cart-modal" v-if="showCart">
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h3>주문 내역</h3>
          <button class="close-button" @click="showCart = false">
            &times;
          </button>
        </div>
        <div class="cart-items" v-if="cartItems.length > 0">
          <div
            v-for="(item, index) in cartItems"
            :key="index"
            class="cart-item"
          >
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
          <p>
            총 주문금액: <strong>{{ formatPrice(totalAmount) }}원</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- 주문 완료 모달 -->
    <div class="order-complete-modal" v-if="orderComplete">
      <div class="order-complete-content">
        <h3>주문 완료 하였습니다.</h3>
        <div class="order-complete-buttons">
          <button class="confirm-button" @click="orderComplete = false">
            확인
          </button>
          <button class="review-button" @click="openReviewModal">
            리뷰작성하기
          </button>
        </div>
      </div>
    </div>

    <!-- 리뷰 작성 모달 -->
    <div class="review-modal" v-if="showReviewModal">
      <div class="review-modal-content">
        <div class="review-modal-header">
          <h3>리뷰를 작성해주세요</h3>
          <button class="close-button" @click="showReviewModal = false">
            &times;
          </button>
        </div>
        <div class="review-form">
          <textarea
            class="review-textbox"
            v-model="reviewText"
            placeholder="리뷰를 작성해주세요"
            rows="5"
          ></textarea>
        </div>
        <div class="review-actions">
          <button class="save-button" @click="submitReview">완료</button>
        </div>
      </div>
    </div>

    <!-- 로딩 인디케이터 -->
    <div class="loading-modal" v-if="isLoading">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>AI가 리뷰를 작성 중입니다...</p>
      </div>
    </div>

    <!-- 리뷰 저장 성공 모달 -->
    <div class="review-success-modal" v-if="showReviewSuccessModal">
      <div class="review-success-content">
        <div class="review-success-header">
          <h3>AI가 완성한 리뷰입니다✨</h3>
          <button class="close-button" @click="closeReviewSuccessModal">
            &times;
          </button>
        </div>
        <div class="review-response-data">
          <div class="response-data-box">
            <!-- <pre>{{ JSON.stringify(responseData, null, 2) }}</pre> -->
            <p>{{ responseData?.data?.content }}</p>
          </div>
        </div>
        <div class="review-success-footer">
          <button class="regenerate-button" @click="regenerateReview">
            다시 생성
          </button>
          <button class="confirm-button" @click="showSaveConfirmModal">
            확인
          </button>
        </div>
      </div>
    </div>

    <!-- 저장 확인 모달 -->
    <div class="save-confirm-modal" v-if="showSaveConfirm">
      <div class="save-confirm-content">
        <h3>이대로 저장하시겠습니까?</h3>
        <div class="save-confirm-buttons">
          <button class="cancel-button" @click="showSaveConfirm = false">
            취소
          </button>
          <button class="confirm-button" @click="saveReview">
            확인
          </button>
        </div>
      </div>
    </div>

    <!-- 저장 완료 모달 -->
    <div class="save-success-modal" v-if="showSaveSuccess">
      <div class="save-success-content">
        <h3>저장되었습니다</h3>
        <button class="confirm-button" @click="closeSaveSuccessModal">
          확인
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import reviewService from "@/services/review.service";
import ReviewSummary from '@/components/review/ReviewSummary.vue'

export default {
  components: {
    ReviewSummary
  },
  name: "MenuOrderView",
  data() {
    return {
      menuItems: [
        {
          id: 1,
          name: "꼬짜떡볶이",
          price: 5000,
          image: require("@/assets/images/sample_small_menu_tteokbokki_1.jpg"),
          isBest: true,
        },
        {
          id: 2,
          name: "돈까스떡볶이",
          price: 6000,
          image: require("@/assets/images/sample_small_menu_tteokbokki_2.jpg"),
          isBest: false,
        },
        {
          id: 3,
          name: "즉석떡볶이",
          price: 9000,
          image: require("@/assets/images/sample_small_menu_tteokbokki_1.jpg"),
          isBest: false,
        },
        {
          id: 4,
          name: "치즈떡볶이",
          price: 6500,
          image: require("@/assets/images/sample_small_menu_tteokbokki_1.jpg"),
          isBest: false,
        },
        {
          id: 5,
          name: "매운떡볶이",
          price: 5500,
          image: require("@/assets/images/sample_small_menu_tteokbokki_2.jpg"),
          isBest: false,
        },
      ],
      cartItems: [],
      showCart: false,
      orderComplete: false,
      showReviewModal: false,
      showReviewSuccessModal: false,
      showSaveConfirm: false,
      showSaveSuccess: false,
      isLoading: false,
      reviewText: "",
      lastOrderId: null,
      responseData: null,
      restaurantReviewSummary: '이 음식점은 신선한 재료와 친절한 서비스로 인기가 많습니다. 특히 주말에는 예약이 필수입니다.이 음식점은 신선한 재료와 친절한 서비스로 인기가 많습니다. 특히 주말에는 예약이 필수입니다.이 음식점은 신선한 재료와 친절한 서비스로 인기가 많습니다. 특히 주말에는 예약이 필수입니다.이 음식점은 신선한 재료와 친절한 서비스로 인기가 많습니다. 특히 주말에는 예약이 필수입니다.이 음식점은 신선한 재료와 친절한 서비스로 인기가 많습니다. 특히 주말에는 예약이 필수입니다.'
    };
  },
  computed: {
    cartCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    totalAmount() {
      return this.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    addToCart(menu) {
      const existingItem = this.cartItems.find((item) => item.id === menu.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({
          id: menu.id,
          name: menu.name,
          price: menu.price,
          quantity: 1,
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
        // 여기서 실제 주문 API를 호출하고 주문 ID를 받아옴
        this.lastOrderId = Math.floor(Math.random() * 10000); // 임시 주문 ID 생성 (실제로는 API에서 받아옴)
        this.orderComplete = true;
        // 주문 완료 후 주문내역 비우기는 리뷰 작성 후 또는 확인 버튼 클릭 시 처리
      }
    },
    openReviewModal() {
      this.orderComplete = false;
      this.showReviewModal = true;
    },
    submitReview() {
      if (!this.reviewText.trim()) {
        alert("리뷰 내용을 입력해주세요.");
        return;
      }

      // 리뷰 데이터 준비
      const reviewData = {
        review: this.reviewText,
      };

      // 로딩 표시 시작
      this.isLoading = true;
      this.showReviewModal = false;

      // API 호출
      this.sendReviewToServer(reviewData);
    },
    async sendReviewToServer(reviewData) {
      try {
        console.log("리뷰 데이터 전송:", reviewData);

        // API 호출
        const responseData = await reviewService.getClaudeReview(reviewData);
        console.log("res: ", responseData);

        // 로딩 완료 및 결과 표시
        this.responseData = responseData;
        setTimeout(() => {
          this.isLoading = false;
          this.showReviewSuccessModal = true;
          // 리뷰 텍스트를 초기화하지 않고 유지 (다시 생성 버튼을 위해)
          // this.reviewText = ""; 
        }, 500); // 로딩 인디케이터를 최소 0.5초 이상 표시
      } catch (error) {
        console.error("리뷰 전송 오류:", error);
        this.isLoading = false;
        alert("리뷰 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
        this.showReviewModal = true;
      }
    },
    closeReviewSuccessModal() {
      this.showReviewSuccessModal = false;
      this.responseData = null;
    },
    regenerateReview() {
      // 리뷰 작성 모달을 다시 표시하지 않고 이전 리뷰 텍스트로 직접 API 재호출
      this.showReviewSuccessModal = false;
      
      // 로딩 표시 시작
      this.isLoading = true;
      
      // 이전에 입력한 reviewText를 사용하여 API 다시 호출
      const reviewData = {
        review: this.reviewText
      };
      
      // API 호출
      this.sendReviewToServer(reviewData);
    },
    showSaveConfirmModal() {
      this.showSaveConfirm = true;
    },
    saveReview() {
      // 실제 저장 로직 (API 호출 등)을 여기에 구현
      // 예시: reviewService.saveReview(this.responseData);
      
      console.log("저장된 리뷰:", this.responseData?.data?.content);
      
      // 모달 전환
      this.showSaveConfirm = false;
      this.showSaveSuccess = true;
      
      // 장바구니 비우기 (리뷰 저장 시)
      this.cartItems = [];
    },
    closeSaveSuccessModal() {
      this.showSaveSuccess = false;
      this.showReviewSuccessModal = false;
      this.responseData = null;
    }
  },
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
.cart-modal,
.order-complete-modal,
.review-modal,
.review-success-modal,
.save-confirm-modal,
.save-success-modal,
.loading-modal {
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

.cart-modal-content,
.order-complete-content,
.review-modal-content,
.review-success-content,
.save-confirm-content,
.save-success-content {
  background-color: #fff;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.cart-modal-header,
.review-modal-header,
.review-success-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.cart-modal-header h3,
.review-modal-header h3,
.review-success-header h3 {
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

.order-complete-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.confirm-button,
.review-button,
.regenerate-button,
.cancel-button {
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
}

.confirm-button {
  background-color: #00c2b3;
  color: white;
}

.regenerate-button {
  background-color: #4285f4;
  color: white;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.review-button {
  background-color: #ff9800;
  color: white;
}

/* 리뷰 모달 스타일 */
.review-form {
  padding: 1rem;
}

.review-textbox {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
}

.review-actions {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background-color: #00c2b3;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

/* 리뷰 성공 모달 스타일 */
.review-response-data {
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.review-response-data h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.response-data-box {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 1rem;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.review-success-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* 저장 확인 모달 스타일 */
.save-confirm-content,
.save-success-content {
  padding: 2rem;
  text-align: center;
}

.save-confirm-content h3,
.save-success-content h3 {
  margin: 0 0 1.5rem;
}

.save-confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* 로딩 스타일 */
.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #00c2b3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  color: #333;
  font-weight: 500;
  margin: 0;
}
</style>