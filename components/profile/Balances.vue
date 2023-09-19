<template>
  <div class="flex justify-between gap-8 my-8">
    <!-- power tokens -->
    <div class="flex w-full justify-between">
      <div>
        <p class="uppercase text-xs">balance power tokens</p>
        <p class="text-4xl inline-flex items-center my-2">
          <MIconPower class="h-8 w-8 mr-4" />
          {{ powerToken?.data.value?.formatted }}
        </p>
      </div>

      <div>
        <p class="uppercase text-xs text-grey-primary">Epoch Voting Power</p>
        <p class="text-4xl inline-flex items-center my-2">
          {{ powerTokenVotingPower?.data.value }}
        </p>
      </div>
    </div>
    <div class="flex border-r border-r-primary-darker mx-2"></div>
    <!-- zero tokens -->
    <div class="flex w-full justify-between">
      <div>
        <p class="uppercase text-xs">balance zero tokens</p>
        <p class="text-4xl inline-flex items-center my-2">
          <MIconZero class="h-8 w-8 mr-4" />
          {{ zeroToken?.data.value?.formatted }}
        </p>
      </div>

      <div>
        <p class="uppercase text-xs text-grey-primary">Epoch Voting Power</p>
        <p class="text-4xl inline-flex items-center my-2">
          {{ zeroTokenVotingPower?.data?.value }}
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

const { powerToken, zeroToken } = useMBalances(address);
const { powerTokenVotingPower, zeroTokenVotingPower } =
  useMVotingPower(address);
</script>
