<template>
  <div v-if="address" class="px-6 lg:p-0">
    <PageTitle class="mb-6">
      My Profile<template #subtitle
        ><MAddressAvatar
          class="text-grey-500 normal-case"
          :short-address="false"
          :address="address"
          :show-avatar="false"
      /></template>
      <template #side>
        <NuxtLink to="/delegate/">
          <MButton
            class="w-full justify-center mt-4 lg:mt-0"
            :disabled="!canDelegate"
            data-test="profile-button-redelegate"
          >
            re-delegate
          </MButton>
        </NuxtLink>
      </template>
    </PageTitle>

    <ProfileBalances class="mb-6 lg:px-8" :address="address" />

    <!-- tables -->
    <ProfileTables class="lg:px-8" :address="address" />
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center h-80 text-grey-600"
  >
    User not connected
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
const { address } = useAccount();

const spog = storeToRefs(useSpogStore());

useHead({
  titleTemplate: "%s - My profile",
});

const canDelegate = computed(
  () => spog.epoch.value.current.type === "TRANSFER"
);
</script>
