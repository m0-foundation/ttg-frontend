<template>
  <div v-if="address">
    <PageTitle class="px-6 lg:p-0 mb-6">
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

    <ProfileBalances class="px-6 lg:p-0 mb-6" :address="address" />

    <div v-if="hasDelegatedPower" class="p-4 bg-green-900 text-white my-2">
      <p class="uppercase text-xs mb-6">
        Your POWER tokens <u>voting power</u> is delegated to the address:
      </p>
      <p class="text-xl underline">{{ powerDelegates }}</p>
      <p class="text-xs uppercase text-[#5CC99E]">
        Voting power will be available to delegatee starting next epoch
      </p>
    </div>

    <div v-if="hasDelegatedZero" class="p-4 bg-green-900 text-white my-2">
      <p class="uppercase text-xs mb-6">
        Your ZERO tokens <u>voting power</u> is delegated to the address:
      </p>
      <p class="text-xl underline">{{ zeroDelegates }}</p>
      <p class="text-xs uppercase text-[#5CC99E]">
        Voting power will be available to delegatee starting next epoch
      </p>
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
