<template>
  <div class="flex justify-between gap-4 w-full">
    <!-- power -->
    <div class="px-8 py-4 bg-grey-800 w-1/2">
      <div class="flex justify-start w-full items-center">
        <p class="text-xl">POWER Token</p>
        <div>
          <ProfileTokenMenu :token="getTokens?.power" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-8 mb-4">
        <div>
          <p class="text-grey-500 text-xs mb-2">Voting power</p>
          <div class="flex items-center align-middle gap-2">
            <MIconPower class="h-8 w-8" />
            <p class="text-2xl lg:text-3xl text-grey-100 mt-2">
              {{ powerVotingPower?.relative?.toFixed(2) }}%
            </p>
          </div>
        </div>

        <div>
          <p class="text-grey-500 text-xs mb-2">Token Balance</p>
          <div class="flex items-center align-middle gap-2">
            <p class="text-2xl lg:text-3xl text-grey-100 mt-2">
              {{
                useNumberFormatterPrice(balancePowerToken?.data.value?.value)
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- zero -->
    <div class="px-8 py-4 bg-grey-800 w-1/2">
      <div class="flex justify-start w-full items-center">
        <p class="text-xl">Zero Token</p>
        <div>
          <ProfileTokenMenu :token="getTokens?.zero" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-8 mb-4">
        <div>
          <p class="text-grey-500 text-xs mb-2">Voting power</p>
          <div class="flex items-center align-middle gap-2">
            <MIconPower class="h-8 w-8" />
            <p class="text-2xl lg:text-3xl text-grey-100 mt-2">
              {{ zeroVotingPower?.relative?.toFixed(2) }}%
            </p>
          </div>
        </div>

        <div>
          <p class="text-grey-500 text-xs mb-2">Token Balance</p>
          <div class="flex items-center align-middle gap-2">
            <p class="text-2xl lg:text-3xl text-grey-100 mt-2">
              {{
                useNumberFormatterPrice(balanceZeroToken?.data.value?.formatted)
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
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

const spog = useSpogStore();
const { getTokens } = storeToRefs(spog);
</script>
