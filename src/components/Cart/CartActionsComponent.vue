<template>
  <div class="cart-actions">
    <div class="buttons">
      <button
        class="checkout-button"
        :class="{ countdown: checkingOut, empty: cartStore.cartTotalCount === 0 }"
        @click="checkout"
      >
        {{ checkingOut ? duration : 'CHECKOUT' }}
      </button>
      <button class="clear-button" @click="logout">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useCartStore } from "@/stores/cart.store";
import { logoutService } from "@/services/logoutService";
import { ref, watch } from "vue";
import { usePointOfSaleStore } from "@/stores/pos.store";
import { storeToRefs } from "pinia";

const cartStore = useCartStore();
const posStore = usePointOfSaleStore();

const cartItems = cartStore.getProducts;
const { pointOfSale } = storeToRefs(posStore);

const duration = ref(3);
const checkingOut = ref(false);
let intervalId: number | undefined;

const checkoutTimer = () =>
  setInterval(async () => {
    duration.value -= 1;
    if (duration.value <= 0 && checkingOut.value) {
      await finalizeCheckout();
    }
  }, 1000);

const stopCheckout = () => {
  duration.value = 3;
  checkingOut.value = false;
  clearInterval(intervalId);
};
const logout = async () => {
  if (intervalId) stopCheckout();
  await logoutService();
};

watch(cartItems, () => {
  stopCheckout();
});

const finalizeCheckout = async () => {
  stopCheckout();
  await cartStore.checkout();
  checkingOut.value = false;
  duration.value = 3;
  // TODO only logout if not authenticated pos.
  await logoutService();
};

const checkout = async () => {
  if (cartStore.cartTotalCount === 0) return;
  // Borrel mode
  if (!pointOfSale.value?.useAuthentication) {
    await cartStore.checkout();
  }

  // Normal mode
  if (checkingOut.value) return stopCheckout();
  checkingOut.value = true;
  intervalId = checkoutTimer();
};
</script>

<style scoped>

.cart-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 25px;
}

.buttons {
  display: flex;
  gap: 10px;
}

.clear-button {
  background-color: red;
  color: white;
  font-size: 50px;
  height: 75px;
  width: 75px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.checkout-button {
  background-color: #0055fd;
  font-weight: 500;
  color: white;
  width: 262px;
  font-size: 27px;
  border: none;
  border-radius: 50px;
  margin-right: 10px;
  padding: 15px 55px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &.countdown {
    background-color: green;
  }
}
</style>
