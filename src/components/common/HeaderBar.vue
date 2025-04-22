<template>
    <div class="header">
      <div v-if="backButton" class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </div>
      <div class="title">{{ title }}</div>
      <div class="right-action">
        <slot name="right-action"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  
  
  const router = useRouter()
  
  const goBack = () => {
    router.go(-1)
  }
  </script>
  
  <style scoped>
  .header {
    background-color: #4285F4;
    color: white;
    padding: 15px;
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .back-btn {
    position: absolute;
    left: 15px;
    cursor: pointer;
  }
  
  .title {
    flex: 1;
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }
  
  .right-action {
    position: absolute;
    right: 15px;
  }
  </style>