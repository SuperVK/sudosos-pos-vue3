<template>
  <div>
    <WebSocketDisplayView/>
    <RouterView />
  </div>
</template>


<style scoped>
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  pointer-events: none;
}

.image-overlay img {
  max-height: 100%;
  max-width: 100%;
}
</style>
<script setup lang="ts">
import WebSocketDisplayView from "@/views/WebSocketDisplayView.vue";
</script>
