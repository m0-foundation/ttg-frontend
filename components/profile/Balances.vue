<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- power -->
    <UCard>
      <div class="flex justify-between w-full items-center">
        <div class="flex items-center gap-4">
          <MIconPower class="h-8 w-8" />
          <p class="text-xl">POWER Token</p>
        </div>
        <div>
          <ProfileTokenMenu :token="getTokens?.power" />
        </div>
      </div>

      <div class="flex justify-between gap-4 mt-6">
        <div>
          <p class="dark:text-grey-500 text-xs mb-2 font-inter text-nowrap">
            Voting power
          </p>
          <div class="flex items-center align-middle gap-2">
            <p class="text-xl lg:text-xl dark:text-grey-100">
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
          <p class="dark:text-grey-500 text-xs mb-2 font-inter text-nowrap">
            Token Balance
          </p>
          <div class="flex items-center align-middle gap-2">
            <p class="lg:text-xl dark:text-grey-100">
              {{
                useNumberFormatterPrice(
                  balancePowerToken?.data.value?.formatted || 0n,
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </UCard>
    <!-- zero -->
    <UCard>
      <div class="flex justify-between w-full items-center">
        <div class="flex items-center gap-4">
          <MIconZero class="h-8 w-8" />
          <p class="text-xl">ZERO Token</p>
        </div>
        <div>
          <ProfileTokenMenu :token="getTokens?.zero" />
        </div>
      </div>

      <div class="gap-4 mt-6 flex justify-between">
        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter text-nowrap">
            Voting power
          </p>
          <div class="flex items-center align-middle gap-2">
            <p class="text-xl lg:text-xl dark:text-grey-100">
              {{
                useNumberFormatterPrice(
                  zeroVotingPower?.data.value?.formatted || 0,
                )
              }}
            </p>
          </div>
          <p class="text-xs text-grey-600">
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
            <p class="lg:text-xl dark:text-grey-100">
              {{
                useNumberFormatterPrice(
                  balanceZeroToken?.data.value?.formatted || 0,
                )
              }}
            </p>
          </div>
        </div>
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
