<template>
  <div class="cart">
    <div class="user-info">
      <div class="user-button" @click="selectUser">
        <font-awesome-icon icon="fa-solid fa-user" class="user-icon" />
        {{ displayName() }}
      </div>
      <p v-if="isOwnBuyer">Current order for</p>
    </div>
    <div class="cart-items" v-if="!showHistory">
      <div v-for="item in cartItems" :key="item.product.id">
        <CartItemComponent :cart-product="item" />
      </div>
    </div>
    <TransactionHistoryComponent v-if="showTransactions && showHistory" :transactions="transactions" />
    <div class="cart-info">
      <div class="total-info">
        <div class="total-label">Total</div>
        <div class="total-price">€{{ formatPrice(totalPrice) }}</div>
      </div>
      <div class="warning-line" v-if="balance">
        <font-awesome-icon icon="fa-solid fa-exclamation-triangle" />
        Your debit after purchase is €{{ formattedBalanceAfter }}
      </div>
    </div>
    <CartActionsComponent/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useCartStore } from '@/stores/cart.store';
import CartItemComponent from '@/components/Cart/CartItemComponent.vue';
import apiService from '@/services/ApiService';
import { formatPrice } from '@/utils/FormatUtils';
import { logoutService } from '@/services/logoutService';
import TransactionHistoryComponent from
    '@/components/Cart/TransactionHistory/TransactionHistoryComponent.vue';
import { useAuthStore } from "@sudosos/sudosos-frontend-common";
import { BaseTransactionResponse } from "@sudosos/sudosos-client";
import { usePointOfSaleStore } from "@/stores/pos.store";
import CartActionsComponent from "@/components/Cart/CartActionsComponent.vue";

const cartStore = useCartStore();
const authStore = useAuthStore();
const cartItems = cartStore.getProducts;
const current = computed(() => cartStore.getBuyer);
const totalPrice = computed(() => cartStore.getTotalPrice);
const showHistory = ref(true);
const balance = ref<number | null>(null);

const transactions = ref<BaseTransactionResponse[]>([]);
const showTransactions = computed(() => {
  return usePointOfSaleStore().getPos?.useAuthentication;
});

if (cartStore.getBuyer) {
  // todo clean up
  apiService.user
      .getUsersTransactions(
          cartStore.getBuyer?.id,
          cartStore.getBuyer?.id,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          5
      )
      .then((res) => {
        transactions.value.push(...res.data.records);
      });
}

const getBalance = async () => {
  if (!cartStore.buyer) return 0;
  try {
    const response = await apiService.balance.getBalanceId(cartStore.buyer.id);
    return response.data.amount.amount;
  } catch (error) {
    return null;
  }
};

const isOwnBuyer = computed(() => {
  if (!authStore.user) return false;
  return current.value?.id === authStore.user.id;
});
const displayName = () => {
  if (isOwnBuyer.value) {
    return current.value?.firstName;
  } else {
    return `${current.value?.firstName} ${current.value?.lastName}`;
  }
};

onMounted(async () => {
  balance.value = await getBalance();
});

watch(cartItems, () => {
  showHistory.value = false;
});

watch(
  () => cartStore.buyer,
  async () => {
    balance.value = await getBalance();
  }
);

const emit = defineEmits(['selectUser']);
const selectUser = () => {
  emit('selectUser');
};

const formattedBalanceAfter = computed(() => {
  if (!balance.value) return null;
  const price = balance.value - totalPrice.value;
  return formatPrice(price);
});

</script>

<style scoped>
.cart-info {
  display: flex;
  justify-content: space-between;
  background-color: white;
  margin-bottom: 10px;
  font-size: 20px;
  border-radius: 15px;
  flex-direction: column;
  margin-right: 10px;
  padding: 10px 20px 10px 15px;
}

.total-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.total-label {
  font-weight: bold;
}

.total-price {
  font-weight: 900;
  font-size: 21px;
}

.warning-line {
  margin-top: 10px;
  font-size: 14px;
  color: var(--accent-color);
}

.cart {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-info {
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  display: flex;

  > p {
    font-size: 20px;
    font-weight: bolder;
  }
}

.user-icon {
  padding-right: 5px;
}

.user-button {
  background-color: var(--accent-color);
  color: white;
  border-radius: 15px;
  font-size: 25px;
  padding: 5px 20px 5px 15px;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
