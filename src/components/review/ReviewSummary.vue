<template>
    <div class="review-summary-container">
      <h3 class="review-summary-title">리뷰 요약</h3>
      <div class="review-summary-content">
        <pre>{{ summaryText }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReviewSummary',
    props: {
      summaryText: {
        type: String,
        default: '이 음식점은 대체로 긍정적인 평가를 받고 있습니다. 특히 서비스와 맛에 대한 언급이 많습니다.'
      }
    }
  }
  </script>
  
  <style scoped>
  .review-summary-container {
    background-color: #fff;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 15px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    min-height: 50px; /* 최소 높이를 설정하고 컨텐츠에 따라 확장되도록 변경 */
    display: flex;
    flex-direction: column;
  }
  
  .review-summary-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
  }
  
  .review-summary-content {
    font-size: 14px;
    color: #666;
    margin: 0;
    /* 말줄임표 관련 스타일 제거 */
    /* overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical; */
    
    /* 줄바꿈 허용 */
    white-space: normal;
    word-wrap: break-word;
  }
  
  /* p 태그 스타일 */
  .review-summary-content p {
    margin: 0;
    line-height: 1.4;
  }
  </style>