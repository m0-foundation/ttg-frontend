<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- power -->
    <div class="px-8 py-4 bg-grey-800">
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
              {{ powerVotingPower?.data.value?.relative?.toFixed(2) }}%
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

      <div v-if="hasDelegatedPower" class="bg-accent-blue p-2 w-fit">
        <div class="inline-flex items-center gap-3">
          <p class="text-xs font-mono">Delegated to:</p>
          <span class="font-inter text-xs">
            {{ shortenAddress(powerDelegates) }}
          </span>

          <MIconSimpleCheck
            v-if="isJustCopied"
            class="min-w-5 h-5 fill-white"
          />
          <button v-if="!isJustCopied" @click="copy(powerDelegates)">
            <MIconCopy class="min-w-5 h-5 hover:opacity-75 fill-white" />
          </button>
        </div>
      </div>
    </div>
    <!-- zero -->
    <div class="px-8 py-4 bg-grey-800">
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
              {{ zeroVotingPower?.data.value?.relative?.toFixed(2) }}%
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

      <div v-if="hasDelegatedZero" class="bg-accent-blue p-2 w-fit">
        <div class="inline-flex items-center gap-3">
          <p class="text-xs font-mono">Delegated to:</p>
          <span class="font-inter text-xs">
            {{ shortenAddress(zeroDelegates) }}
          </span>

          <MIconSimpleCheck
            v-if="isJustCopied"
            class="min-w-5 h-5 fill-white"
          />
          <button v-if="!isJustCopied" @click="copy(zeroDelegates)">
            <MIconCopy class="min-w-5 h-5 hover:opacity-75 fill-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";
import { storeToRefs } from "pinia";
import { useMBalances, useMVotingPower, useMDelegates } from "@/lib/hooks";

const props = defineProps<{
  address: Ref<Hash>;
}>();

const address = toRef(props, "address");

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);

const { power: powerVotingPower, zero: zeroVotingPower } =
  useMVotingPower(address);

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useMDelegates(address);

const spog = useSpogStore();
const { getTokens } = storeToRefs(spog);

const { isJustCopied, copy } = useCopyClipboard();
</script>
