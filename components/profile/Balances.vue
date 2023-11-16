<template>
  <div>
    <p class="uppercase text-xs text-grey-300 mb-1">Token Balance</p>
    <div class="flex gap-12">
      <!-- power tokens -->
      <div class="flex gap-2">
        <MIconPower class="h-8 w-8" />
        <div>
          <p class="text-2xl lg:text-3xl inline-flex items-center">
            {{ powerTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
          </p>
          <p class="text-xs text-grey-400">
            {{ balancePowerToken?.data.value?.formatted }}
          </p>
        </div>
      </div>
      <!-- zero tokens -->
      <div class="flex gap-2">
        <MIconZero class="h-8 w-8" />
        <div>
          <p class="text-2xl lg:text-3xl inline-flex items-center">
            {{ zeroTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
          </p>
          <p class="text-xs text-grey-400">
            {{ balanceZeroToken?.data.value?.formatted }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";
import { useMBalances, useMVotingPower } from "@/lib/hooks";

const props = defineProps<{
  address: Ref<Hash>;
}>();

const address = toRef(props, "address");

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);

const { powerTokenVotingPower, zeroTokenVotingPower } =
  useMVotingPower(address);
</script>
