<template>
    <div class="search-page">
      <header-bar title="상세 검색"></header-bar>
      
      <div class="filter-section">
        <h3>테마별</h3>
        <div class="filter-buttons">
          <button 
            v-for="theme in themes" 
            :key="theme.value"
            :class="['filter-btn', { active: selectedTheme === theme.value }]"
            @click="selectTheme(theme.value)"
          >
            {{ theme.label }}
          </button>
        </div>
        
        <h3>인원별</h3>
        <div class="filter-buttons">
          <button 
            v-for="people in peopleOptions" 
            :key="people.value"
            :class="['filter-btn', { active: selectedPeople === people.value }]"
            @click="selectPeople(people.value)"
          >
            {{ people.label }}
          </button>
        </div>
        
        <h3>상황별</h3>
        <div class="filter-buttons">
          <button 
            v-for="situation in situations" 
            :key="situation.value"
            :class="['filter-btn', { active: selectedSituation === situation.value }]"
            @click="selectSituation(situation.value)"
          >
            {{ situation.label }}
          </button>
        </div>
      </div>
      
      <div class="search-actions">
        <button class="btn-secondary" @click="resetFilters">초기화</button>
        <button class="btn-primary" @click="applyFilters">적용하기</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import HeaderBar from '@/components/common/HeaderBar.vue'
  
  const store = useStore()
  const router = useRouter()
  
  const selectedTheme = ref(null)
  const selectedPeople = ref(null)
  const selectedSituation = ref(null)
  
  const themes = [
    { value: 'korean', label: '한식' },
    { value: 'western', label: '양식' },
    { value: 'japanese', label: '일식' },
    { value: 'chinese', label: '중식' },
    { value: 'cafe', label: '카페' },
    { value: 'etc', label: '기타' }
  ]
  
  const peopleOptions = [
    { value: '1', label: '1인' },
    { value: '2-4', label: '2-4인' },
    { value: '5+', label: '5인+' }
  ]
  
  const situations = [
    { value: 'date', label: '데이트' },
    { value: 'company', label: '회식' },
    { value: 'friends', label: '친구만남' },
    { value: 'lunch', label: '점심식사' },
    { value: 'dinner', label: '저녁식사' },
    { value: 'etc', label: '기타' }
  ]
  
  const selectTheme = (theme) => {
    selectedTheme.value = theme
    store.dispatch('search/applyThemeFilter', theme)
  }
  
  const selectPeople = (people) => {
    selectedPeople.value = people
    store.dispatch('search/applyPeopleFilter', people)
  }
  
  const selectSituation = (situation) => {
    selectedSituation.value = situation
    store.dispatch('search/applySituationFilter', situation)
  }
  
  const resetFilters = () => {
    selectedTheme.value = null
    selectedPeople.value = null

    selectedSituation.value = null
  store.dispatch('search/resetAllFilters')
}

const applyFilters = () => {
  // 필터 적용 후 결과 페이지로 이동
  router.push('/filtered-results')
}
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.filter-section {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.filter-section h3 {
  margin: 20px 0 10px;
  font-size: 16px;
  color: #495057;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.filter-btn {
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #dde2e6;
  background-color: white;
  font-size: 14px;
}

.filter-btn.active {
  background-color: #4285F4;
  color: white;
  border-color: #4285F4;
}

.search-actions {
  display: flex;
  padding: 15px;
  border-top: 1px solid #f1f3f5;
  background-color: white;
}

.search-actions button {
  flex: 1;
  margin: 0 5px;
}
</style>