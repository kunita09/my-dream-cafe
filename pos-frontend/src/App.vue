<template>
  <div id="app">
    <!-- <h1>ระบบขายของ</h1> -->
    <router-view />
  </div>
</template>

<script setup>
  import manageProduct from './components/manageProduct.vue'
  import manageOrder from './components/manageOrder.vue'
  import newOrder from './components/newOrder.vue'
</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
