<!-- src/components/order/MenuList.vue -->
<template>
    <div class="menu-list-component">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>메뉴를 불러오는 중...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchMenus" class="retry-button">다시 시도</button>
      </div>
      
      <div v-else class="menu-grid">
        <div v-for="menu in menus" :key="menu.id" class="menu-item">
          <div class="menu-image-container">
            <img :src="menu.image || require('@/assets/images/default-menu.png')" :alt="menu.name" class="menu-image">
            <span v-if="menu.isRecommended" class="menu-badge">추천</span>
          </div>
          <div class="menu-info">
            <h3 class="menu-name">{{ menu.name }}</h3>
            <p class="menu-price">{{ formatPrice(menu.price) }}원</p>
          </div>
          <button class="add-to-cart-button" @click="$emit('add-to-cart', menu)">담기</button>
        </div>
      </div>
      
      <div v-if="!loading && !error && menus.length === 0" class="empty-state">
        <p>해당 카테고리에 메뉴가 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MenuList',
    props: {
      /**
       * 메뉴 카테고리
       */
      category: {
        type: String,
        default: ''
      },
      /**
       * 외부에서 제공된 메뉴 목록 (API 호출 없이 사용할 경우)
       */
      providedMenus: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        menus: [],
        loading: false,
        error: null
      };
    },
    watch: {
      category() {
        this.fetchMenus();
      },
      providedMenus: {
        handler(newMenus) {
          if (newMenus && newMenus.length > 0) {
            this.menus = newMenus;
            this.loading = false;
            this.error = null;
          }
        },
        immediate: true
      }
    },
    mounted() {
      if (!this.providedMenus.length) {
        this.fetchMenus();
      }
    },
    methods: {
      formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      },
      async fetchMenus() {
        // API 연동이 없는 경우 더미 데이터 사용
        if (this.providedMenus.length) {
          this.menus = this.providedMenus;
          return;
        }
        
        this.loading = true;
        this.error = null;
        
        try {
          // 실제 서비스에서는 API 호출로 대체
          // const response = await orderService.getMenus(this.category);
          // this.menus = response.data;
          
          // 더미 데이터 (API 연동 전 테스트용)
          setTimeout(() => {
            this.menus = [
              {
                id: 1,
                name: '꼬짜떡볶이',
                price: 5000,
                image: require('@/assets/images/menu-tteokbokki-1.jpg'),
                isRecommended: true
              },
              {
                id: 2,
                name: '돈까스떡볶이',
                price: 6000,
                image: require('@/assets/images/menu-tteokbokki-2.jpg')
              },
              {
                id: 3,
                name: '즉석떡볶이',
                price: 9000,
                image: require('@/assets/images/menu-tteokbokki-3.jpg')
              }
            ];
            this.loading = false;
          }, 500);
        } catch (error) {
          this.error = '메뉴를 불러오는데 실패했습니다. 다시 시도해 주세요.';
          this.loading = false;
          console.error('메뉴 로딩 오류:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .menu-list-component {
    padding: 10px;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #00c2b3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-container {
    text-align: center;
    padding: 30px 0;
    color: #f44336;
  }
  
  .retry-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .menu-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .menu-item {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }
  
  .menu-image-container {
    position: relative;
    width: 100%;
    height: 180px;
  }
  
  .menu-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .menu-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #f44336;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .menu-info {
    padding: 12px;
    flex: 1;
  }
  
  .menu-name {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
  }
  
  .menu-price {
    margin: 0;
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }
  
  .add-to-cart-button {
    background-color: #222;
    color: white;
    border: none;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
  }
  
  .empty-state {
    padding: 40px 0;
    text-align: center;
    color: #666;
  }
  
  /* 반응형 디자인 */
  @media (min-width: 640px) {
    .menu-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 768px) {
    .menu-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  </style>