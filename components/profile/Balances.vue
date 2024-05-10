<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <!-- power -->
    <div class="p-6 bg-grey-800">
      <div class="flex justify-between w-full items-center">
        <p class="text-xl">POWER Token</p>
        <div>
          <ProfileTokenMenu :token="getTokens?.power" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-8 mb-4">
        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter">Voting power</p>
          <div class="flex items-center align-middle gap-2">
            <MIconPower class="h-8 w-8" />
            <p class="text-2xl lg:text-3xl text-grey-100 mt-2">
              {{ powerVotingPower?.data.value?.relative?.toFixed(4) }}%
            </p>
          </div>
        </div>

        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter">Token Balance</p>
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

      <div v-if="hasDelegatedPower" class="bg-accent-blue balances-badge py-1">
        <div class="inline-flex items-center gap-2">
          <p>Delegated to:</p>
          <span>
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
      <div v-else class="bg-grey-700 text-white balances-badge">
        Self-delegated
        <span v-if="receivedPowerVotingPower">
          ({{ selfDelegatedPowerVotingPercentage }}%)
        </span>
      </div>

      <div
        v-if="receivedPowerVotingPower"
        class="bg-green-700 text-green-900 balances-badge mt-2"
      >
        Delegated to me ({{ receivedPowerVotingPercentage }}%)
      </div>
    </div>
    <!-- zero -->
    <div class="p-6 bg-grey-800">
      <div class="flex justify-between w-full items-center">
        <p class="text-xl">ZERO Token</p>
        <div>
          <ProfileTokenMenu :token="getTokens?.zero" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-8 mb-4">
        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter">Voting power</p>
          <div class="flex items-center align-middle gap-2">
            <MIconZero class="h-8 w-8" />
            <p class="text-2xl lg:text-3xl text-grey-100 mt-2">
              {{ zeroVotingPower?.data.value?.relative?.toFixed(4) }}%
            </p>
          </div>
        </div>

        <div>
          <p class="text-grey-500 text-xs mb-2 font-inter">Token Balance</p>
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

      <div v-if="hasDelegatedZero" class="bg-accent-blue balances-badge">
        <div class="inline-flex items-center gap-2">
          <p>Delegated to:</p>
          <span>
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
      <div v-else class="bg-grey-700 text-white balances-badge">
        Self-delegated
        <span v-if="receivedZeroVotingPercentage">
          ({{ selfDelegatedZeroVotingPercentage }}%)
        </span>
      </div>

      <div
        v-if="receivedZeroVotingPercentage"
        class="bg-green-700 text-green-900 balances-badge mt-2"
      >
        Delegated to me ({{ receivedZeroVotingPercentage }}%)
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
const spog = useSpogStore();
const { getTokens } = storeToRefs(spog);
const { isJustCopied, copy } = useCopyClipboard();

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);

const { power: powerVotingPower, zero: zeroVotingPower } =
  useMVotingPower(address);

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useMDelegates(address);

// Power
const powerTotalSuply = computed(() => spog.tokens.power.totalSupply?.value);

const receivedPowerVotingPower = computed(() => {
  if (!powerVotingPower?.data?.value?.value) return BigInt(0);
  return (
    powerVotingPower.data?.value?.value! - balancePowerToken.data?.value?.value!
  );
});

const receivedPowerVotingPercentage = computed(() => {
  return getVotingPowerPercentageByTotalSupply(
    receivedPowerVotingPower.value,
    powerTotalSuply.value,
  );
});

const selfDelegatedPowerVotingPercentage = computed(() => {
  return getVotingPowerPercentageByTotalSupply(
    balancePowerToken.data?.value?.value!,
    powerTotalSuply.value,
  );
});

// Zero
const zeroTotalSuply = computed(() => spog.tokens.zero.totalSupply?.value);

const receivedZeroVotingPower = computed(() => {
  if (!zeroVotingPower?.data?.value?.value) return BigInt(0);
  return (
    zeroVotingPower?.data?.value?.value! - balanceZeroToken.data?.value?.value!
  );
});

const receivedZeroVotingPercentage = computed(() => {
  return getVotingPowerPercentageByTotalSupply(
    receivedZeroVotingPower.value,
    zeroTotalSuply.value,
  );
});

const selfDelegatedZeroVotingPercentage = computed(() => {
  return getVotingPowerPercentageByTotalSupply(
    balanceZeroToken.data?.value?.value!,
    zeroTotalSuply.value,
  );
});
</script>

<style>
.balances-badge {
  @apply p-2 py-1 w-fit font-inter text-xs leading-3;
}
</style>
