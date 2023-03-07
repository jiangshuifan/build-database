<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  width: 100%;
  background-color: #f4f4f4;
  display: flex;

  .app-card {
    margin: auto;
    width: 80%;
    height: 80%;
    background-color: #fff;
    box-shadow: 0 0 10px #66666666;
    color: white;
    overflow: hidden;
  }
}
</style>