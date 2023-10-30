<template>
  <div v-if="address" class="p-6">
    <div class="lg:flex justify-between gap-4">
      <div>
        <PageTitle title="My Profile"></PageTitle>
        <p class="text-zinc-400 text-xs">
          {{ address }}
        </p>
      </div>
      <div>
        <MButton
          class="w-full justify-center mt-4 lg:mt-0"
          :disabled="!canDelegate"
        >
          <NuxtLink to="/delegate/">re-delegate</NuxtLink>
        </MButton>
      </div>
    </div>
    <ProfileBalances :address="address" />
    <div v-if="hasDelegatedPower" class="p-4 bg-primary-darker text-white my-2">
      <p class="uppercase text-xs mb-6">
        Your POWER tokens <u>voting power</u> is delegated to the address:
      </p>
      <p class="text-xl underline">{{ powerDelegates }}</p>
      <p class="text-xs uppercase text-[#5CC99E]">
        Voting power will be available to delegatee starting next epoch
      </p>
    </div>

    <div v-if="hasDelegatedZero" class="p-4 bg-primary-darker text-white my-2">
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
    class="flex flex-col items-center justify-center h-80 text-grey-primary"
  >
    User not conntecd
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
const { address } = useAccount();
const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();

const spog = storeToRefs(useSpogStore());
const canDelegate = computed(
  () => spog.epoch.value.current.type === "TRANSFER"
);
</script>
