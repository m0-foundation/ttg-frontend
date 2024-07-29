<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- power -->
    <div class="p-6 bg-grey-800">
      <div class="flex justify-between w-full items-center">
        <div class="flex items-center gap-4">
          <MIconPower class="h-8 w-8" />
          <p class="text-xl">POWER Token</p>
        </div>
        <div>
          <ProfileTokenMenu :token="getTokens?.power" />
        </div>
      </div>

      <div class="flex justify-between gap-4 mt-8 mb-4">
        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter text-nowrap">
            Voting power
          </p>
          <div class="flex items-center align-middle gap-2">
            <p class="text-xl lg:text-xl text-grey-100 mt-2">
              {{
                useNumberFormatterPrice(
                  powerVotingPower?.data.value?.formatted || 0,
                )
              }}
            </p>
          </div>
          <p class="text-xs text-grey-600 mt-2">
            {{ powerVotingPower?.data.value?.relative?.toFixed(4) }}%
            <span class="mx-1 uppercase text-xxs">
              out of total voting power
            </span>
          </p>
        </div>

        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter text-nowrap">
            Token Balance
          </p>
          <div class="flex items-center align-middle gap-2">
            <p class="lg:text-xl text-grey-100 mt-2">
              {{
                useNumberFormatterPrice(
                  balancePowerToken?.data.value?.formatted || 0n,
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- zero -->
    <div class="p-6 bg-grey-800">
      <div class="flex justify-between w-full items-center">
        <div class="flex items-center gap-4">
          <MIconZero class="h-8 w-8" />
          <p class="text-xl">Zero Token</p>
        </div>
        <div>
          <ProfileTokenMenu :token="getTokens?.zero" />
        </div>
      </div>

      <div class="gap-4 mt-8 mb-4 flex justify-between">
        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter text-nowrap">
            Voting power
          </p>
          <div class="flex items-center align-middle gap-2">
            <p class="text-xl lg:text-xl text-grey-100 mt-2">
              {{
                useNumberFormatterPrice(
                  zeroVotingPower?.data.value?.formatted || 0,
                )
              }}
            </p>
          </div>
          <p class="text-xs text-grey-600 mt-2">
            {{ zeroVotingPower?.data.value?.relative?.toFixed(4) }}%
            <span class="mx-1 uppercase text-xxs">
              out of total voting power
            </span>
          </p>
        </div>

        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter text-nowrap">
            Token Balance
          </p>
          <div class="flex items-center align-middle gap-2">
            <p class="lg:text-xl text-grey-100 mt-2">
              {{
                useNumberFormatterPrice(
                  balanceZeroToken?.data.value?.formatted || 0,
                )
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

const ttg = useTtgStore();
const { getTokens } = storeToRefs(ttg);
</script>
