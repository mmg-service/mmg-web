<template>
  <div class="ai-recommendation-section">
    <div class="ai-header">
      <div class="ai-title">
        <i class="fas fa-robot ai-icon"></i> MMG AI 추천
      </div>
    </div>

    <div class="ai-content">
      <div v-if="isLoading" class="loading-indicator">
        <i class="fas fa-spinner fa-spin"></i>
        <p>추천 정보를 가져오는 중...</p>
      </div>

      <div v-else-if="!currentRecommendation" class="no-recommendation">
        <i class="fas fa-info-circle"></i>
        <p>이 지역에 대한 추천 정보가 없습니다.</p>
        <p>다른 위치로 이동하거나 다른 카테고리를 선택해보세요.</p>
      </div>

      <template v-else>
        <div class="restaurant-preview">
          <div 
            class="restaurant-image" 
            :style="`background-image: url(${currentRecommendation.image || 'https://via.placeholder.com/80?text=No+Image'})`">
          </div>
          <div class="restaurant-info">
            <h3>{{ currentRecommendation.name }}</h3>
            <div class="rating">
              <i class="fas fa-star"></i> {{ currentRecommendation.rating || '평점 정보 없음' }}
              <span class="category-label">{{ currentRecommendation.category }}</span>
            </div>
            <p class="distance">
              <i class="fas fa-map-marker-alt"></i> {{ currentRecommendation.distance || '거리 정보 없음' }}
            </p>
          </div>
          <router-link to="/order" class="order-button">하이<br>오더</router-link>
        </div>

        <div class="ai-reason">
          <div class="reason-label">추천 이유:</div>
          <p>{{ currentRecommendation.aiReason || '이 매장은 현재 위치에서 가장 가까운 매장입니다.' }}</p>
        </div>

        <div class="additional-info" v-if="currentRecommendation.address || currentRecommendation.phone">
          <div v-if="currentRecommendation.address">
            <div class="reason-label">주소:</div>
            <p>{{ currentRecommendation.address }}</p>
          </div>
          <div v-if="currentRecommendation.phone" class="mt-2">
            <div class="reason-label">전화번호:</div>
            <p>{{ currentRecommendation.phone }}</p>
          </div>
        </div>

        <button class="view-details-btn" @click="openNaverMap(currentRecommendation)">
          네이버 지도에서 보기
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  isLoading: { type: Boolean, required: true },
  currentRecommendation: { type: Object, default: null },
  openNaverMap: { type: Function, required: true }
});
</script>

<style scoped>
.ai-recommendation-section {
  width: 100%;
  background-color: white;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
  z-index: 5;
  max-height: 40vh;
  overflow-y: auto;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: linear-gradient(135deg, #FF5722, #E91E63);
  color: white;
}

.ai-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
}

.ai-icon {
  margin-right: 8px;
  font-size: 16px;
}

.ai-content {
  padding: 15px;
}

.loading-indicator, .no-recommendation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: #888;
  text-align: center;
}

.loading-indicator i, .no-recommendation i {
  font-size: 32px;
  margin-bottom: 10px;
  color: #FF5722;
}

.restaurant-preview {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.restaurant-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.restaurant-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.restaurant-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.rating {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: #f8b400;
  font-weight: 600;
}

.rating i {
  margin-right: 4px;
}

.category-label {
  margin-left: 8px;
  background-color: #f1f1f1;
  color: #666;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: normal;
}

.distance {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin: 0;
}

.distance i {
  margin-right: 5px;
  color: #FF5722;
}

.ai-reason, .additional-info {
  background-color: #FFF0ED;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.reason-label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #FF5722;
  font-size: 14px;
}

.ai-reason p, .additional-info p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
}

.mt-2 {
  margin-top: 10px;
}

.view-details-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #1EC800, #03C75A); /* 네이버 색상 */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(3, 199, 90, 0.25);
}

.view-details-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(3, 199, 90, 0.35);
}

.order-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;
  vertical-align: middle;
  white-space: nowrap;
}

/* restaurant-info 스타일 수정 */
.restaurant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* restaurant-preview 스타일 수정 */
.restaurant-preview {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
</style>