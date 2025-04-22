<template>
    <div class="map-marker" @click="$emit('click')">
      <div class="marker-content">
        <div class="marker-title">{{ title }}</div>
        <div class="marker-rating">{{ rating }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    position: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    rating: {
      type: [Number, String],
      default: 0
    }
  })
  
  defineEmits(['click']) 
  </script>
  
  <style scoped>
  .map-marker {
    cursor: pointer;
    background-color: white;
    border-radius: 5px;
    padding: 5px 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    min-width: 100px;
  }
  
  .marker-title {
    font-weight: bold;
    font-size: 12px;
  }
  
  .marker-rating {
    color: #f59f00;
    font-size: 12px;
  }
  </style>