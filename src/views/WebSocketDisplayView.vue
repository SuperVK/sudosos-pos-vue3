<template>
  <div class="overlay" v-if="shouldShow && !init">
    <div class="error">
      <div>
        <h1>
          SudoSOS seems to be down
        </h1>
        <h2>
          Please refresh or try again later.
        </h2>
        <br>
        <h3>
          If the problem persists,
          please contact the ABC (abc@gewis.nl)
        </h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useWebSocketStore } from "@/stores/websocket.store";

const webSocketStore = useWebSocketStore();
const { isConnected, connecting } = storeToRefs(webSocketStore);
const init = ref(true);

onMounted(() => {
  setTimeout(() => {
    init.value = false;
  }, 500);
});

const shouldShow = computed(() => {
  return !isConnected.value || connecting.value;
});
</script>

<style scoped lang="scss">
.overlay {
  background-color: white;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;
}

.error {
  background-color: darkred;
  color:white;
  font-size: 30px;
  width: 100%;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
