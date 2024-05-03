<template>
  <div v-if="address" class="px-6 lg:p-0">
    <div class="flex justify-between mb-6">
      <div>
        <p class="text-grey-600 text-xs font-inter">Address</p>
        <p class="text-white text-md">
          <MAddressAvatar
            :address="address"
            :show-copy="true"
            :show-avatar="false"
          />
        </p>
      </div>
    </div>
    <ProfileBalances class="mb-6" :address="address" />
    <!-- tables -->
    <ProfileTables :address="address" />
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center h-80 text-grey-400"
  >
    User not found
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";

const route = useRoute();
const address = ref(route.params.address as Hash);

useHead({
  titleTemplate: `%s - Profile ${shortenAddress(address.value)}`,
});
</script>
