<template>
  <div v-if="address">
    <div class="flex justify-between gap-4">
      <div>
        <p class="text-grey-primary text-xs uppercase">voting address</p>
        <p class="text-white text-md">
          {{ address }}
        </p>
      </div>
    </div>
    <ProfileBalances :address="address" />
    <!-- tables -->
    <ProfileTables :address="address" />
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center h-80 text-grey-primary"
  >
    User not found
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";

const route = useRoute();
const address = ref(route.params.address as Hash);
</script>
