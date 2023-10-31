<template>
  <div class="flex justify-start gap-12">
    <!-- power tokens -->
    <div class="flex gap-12">
      <div>
        <p class="uppercase text-xxs text-zinc-400">My vote tokens</p>
        <p class="text-2xl lg:text-3xl inline-flex items-center my-2">
          <MIconPower class="h-8 w-8 mr-3" />
          {{ balancePowerToken?.data.value?.formatted }}
        </p>
      </div>

      <div class="hidden lg:block">
        <p class="uppercase text-xxs text-zinc-400">Voting Power</p>

        <p class="text-3xl inline-flex items-center my-2">
          {{ powerTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
        </p>
      </div>
    </div>
    <div class="border-r border-r-zinc-600 mx-2 hidden lg:flex"></div>
    <!-- zero tokens -->
    <div class="flex gap-12">
      <div>
        <p class="uppercase text-xxs text-zinc-400">My value tokens</p>
        <p class="text-2xl lg:text-3xl inline-flex items-center my-2">
          <MIconZero class="h-8 w-8 mr-3" />
          {{ balanceZeroToken?.data.value?.formatted }}
        </p>
      </div>

      <div class="hidden lg:block">
        <p class="uppercase text-xxs text-zinc-400">Voting Power</p>
        <p class="text-3xl inline-flex items-center my-2">
          {{ zeroTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
        </p>
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
