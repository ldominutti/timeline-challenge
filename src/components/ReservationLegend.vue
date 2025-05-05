<template>
    <div class="legend-container">
      <div 
        v-for="item in items" 
        :key="item.class" 
        class="legend-item"
        :aria-label="`Tipo de reserva: ${item.label}`"
      >
        <div class="legend-color" :class="item.class"></div>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReservationLegend',
    props: {
      items: { 
        type: Array,
        required: true,
        validator: (items) => items.every(item => item.class && item.label)
      }
    }
  };
  </script>
  
  <style scoped>
  .legend-container {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #727272;
  }
  
  .legend-color {
    width: 8px;
    height: 8px;
  }
  
  .legend-color.available {
    border: 1px solid #ddd;
    background: white;
  }
  
  .legend-color.reserved {
    background-color: #fff48c;
  }
  
  .legend-color.my-reservation {
    background-color: #91feb5;
  }
  </style>