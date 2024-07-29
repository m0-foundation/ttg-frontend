<template>
  <div v-if="address" class="px-6 lg:p-0">
    <PageTitle class="mb-6">
      My Profile<template #subtitle>
        <MAddressAvatar
          class="text-grey-500 normal-case"
          :short-address="!largerThanSm"
          :address="address"
          :show-avatar="false"
          :show-copy="true"
        />
      </template>
      <template #side>
        <NuxtLink to="/delegate/">
          <MButton
            class="w-full justify-center mt-4 lg:mt-0"
            data-test="profile-button-redelegate"
          >
            delegate
          </MButton>
        </NuxtLink>
      </template>
    </PageTitle>

    <ProfileBalances :address="address" />

    <!-- tables -->
    <ProfileTables :address="address" />
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center h-80 text-grey-600"
  >
    User not connected
  </div>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const largerThanSm = useBreakpoints(breakpointsTailwind).greater("sm");
const { address } = useAccount();

useHead({
  titleTemplate: "%s - My profile",
});
</script>
