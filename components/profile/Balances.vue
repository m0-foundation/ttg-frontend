<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- power -->
    <UCard class="bg-grey-200">
      <div class="flex justify-between w-full items-center">
        <h3 class="text-xl">POWER Tokens</h3>
        <div>
          <ProfileTokenMenu :token="getTokens?.power" />
        </div>
      </div>

      <div class="flex justify-between mt-3">
        <span>My token balance</span>
        <div class="flex items-center gap-2">
          <MIconPower class="w-4 h-4" />
          <span>{{
            useNumberFormatterPrice(
              balancePowerToken?.data.value?.formatted || 0n,
            )
          }}</span>
        </div>
      </div>

      <UDivider class="my-3" />

      <div>
        <span>Voting power</span>
        <div class="flex items-center gap-2 mt-2">
          <MIconPower class="w-5 h-5" />
          <span class="text-xl font-ppformula leading-none">{{
            useNumberFormatterPrice(
              powerVotingPower?.data.value?.formatted || 0n,
            )
          }}</span>
        </div>
        <p class="text-xs text-grey-500 mt-2">
          {{ powerVotingPower?.data.value?.relative?.toFixed(4) }}%
          <span class="mx-1 text-xxs"> out of total voting power </span>
        </p>
      </div>
    </UCard>
    <!-- zero -->
    <UCard class="bg-grey-200">
      <div class="flex justify-between w-full items-center">
        <h3 class="text-xl">ZERO Tokens</h3>
        <div>
          <ProfileTokenMenu :token="getTokens?.zero" />
        </div>
      </div>

      <div class="flex justify-between mt-3">
        <span>My token balance</span>
        <div class="flex items-center gap-2">
          <MIconPower class="w-4 h-4" />
          <span>{{
            useNumberFormatterPrice(
              balanceZeroToken?.data.value?.formatted || 0n,
            )
          }}</span>
        </div>
      </div>

      <UDivider class="my-3" />

      <div>
        <span>Voting power</span>
        <div class="flex items-center gap-2 mt-2">
          <MIconPower class="w-5 h-5" />
          <span class="text-xl font-ppformula leading-none">{{
            useNumberFormatterPrice(
              zeroVotingPower?.data.value?.formatted || 0n,
            )
          }}</span>
        </div>
        <p class="text-xs text-grey-500 mt-2">
          {{ zeroVotingPower?.data.value?.relative?.toFixed(4) }}%
          <span class="mx-1 text-xxs"> out of total voting power </span>
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";
import { storeToRefs } from "pinia";
import { useMBalances, useMVotingPower } from "@/lib/hooks";

const props = defineProps<{
  address: Ref<Hash>;
}>();

const address = toRef(props, "address");

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);

const { power: powerVotingPower, zero: zeroVotingPower } =
  useMVotingPower(address);

const ttg = useTtgStore();
const { getTokens } = storeToRefs(ttg);
</script>
