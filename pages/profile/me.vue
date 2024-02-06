<template>
  <div v-if="address" class="px-6 lg:p-0">
    <PageTitle class="mb-6">
      My Profile<template #subtitle
        ><MAddressAvatar
          class="text-grey-600 normal-case"
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

    <ProfileBalances class="mb-6" :address="address" />

    <div v-if="hasDelegatedPower" class="p-4 bg-accent-blue my-6">
      <p class="uppercase text-xs font-mono mb-2">
        $POWER Tokens are DELEGATED to address:
      </p>
      <div class="flex items-center gap-3">
        <MIconPower class="h-6 w-6" />
        <span class="hidden lg:block">-></span>
        <span class="underline font-inter text-xxs lg:text-base">
          {{ powerDelegates }}</span
        >
      </div>
    </div>

    <div v-if="hasDelegatedZero" class="p-4 bg-accent-blue my-6">
      <p class="uppercase text-xs font-mono mb-2">
        $ZERO Tokens are DELEGATED to address:
      </p>
      <div class="flex items-center gap-3">
        <MIconZero class="h-6 w-6" />
        <span class="hidden lg:block">-></span>
        <span class="underline font-inter text-xxs lg:text-base">
          {{ zeroDelegates }}</span
        >
      </div>
    </div>

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
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
const { address } = useAccount();
const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();

const spog = storeToRefs(useSpogStore());

useHead({
  titleTemplate: "%s - My profile",
});

const canDelegate = computed(
  () => spog.epoch.value.current.type === "TRANSFER"
);
</script>
