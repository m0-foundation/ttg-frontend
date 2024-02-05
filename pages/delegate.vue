<template>
  <div>
    <PageTitle class="mb-3">Delegate voting power</PageTitle>

    <p class="text-grey-600 mb-6">
      You can delegate your voting power to any address. The tokens will remain
      in your balance, and you can re-delegate them in the future.
    </p>

    <div v-show="!canDelegate" class="bg-accent-blue px-4 py-5 my-6">
      <span class="uppercase mb-2 text-xs">Warning</span>

      <div class="flex items-center gap-3">
        <MIconWarning />
        <p>
          The transfer epoch has concluded. You will be able to delegate in the
          next
          <b>Transfer</b> epoch.
        </p>
      </div>
    </div>

    <form
      class="my-4 bg-grey-800 p-8 py-6 font-inter"
      @submit.prevent="delegateVote"
    >
      <div>
        <div class="flex justify-between items-center my-3">
          <div>$POWER tokens</div>
          <div class="flex gap-1 items-center">
            <MIconPower class="h-6 w-6" />
            <span
              class="flex items-center text-2xl"
              :class="{
                'text-accent-mint': !canDelegate,
              }"
            >
              {{ balancePowerToken?.data.value?.formatted }}
            </span>
          </div>
        </div>
        <label class="text-grey-600">Delegation address</label>
        <input
          id="input-delegate-power"
          v-model="inputPowerDelegates"
          placeholder="0x..."
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-4"
          data-test="delegate-power-input-address"
        />

        <div v-if="hasDelegatedPower" class="my-4 text-xs text-grey-600">
          <p>Current Delegatee:</p>
          <p class="underline">{{ powerDelegates }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center gap-2 my-4">
        <NuxtLink
          class="text-grey-600 underline text-xs cursor-pointer"
          @click="onUseMyAddressVote"
          >Use my address</NuxtLink
        >
        <MButton
          id="button-delegate-power"
          type="submit"
          :disabled="!isConnected || !canDelegate || !inputPowerDelegates"
          data-test="delegate-button-power-submit"
        >
          delegate
        </MButton>
      </div>
    </form>

    <form
      class="my-4 bg-grey-800 p-8 py-6 font-inter"
      @submit.prevent="delegateValue"
    >
      <div>
        <div class="flex justify-between items-center my-3">
          <div>Value tokens</div>
          <div class="flex gap-1 items-center">
            <MIconZero class="h-6 w-6" />
            <span
              :class="{
                'text-accent-mint': !canDelegate,
              }"
              class="mx-2 flex items-center text-2xl"
            >
              {{ balanceZeroToken?.data?.value?.formatted }}
            </span>
          </div>
        </div>
        <label class="text-grey-600">Delegation address</label>
        <input
          id="input-delegate-zero"
          v-model="inputZeroDelegates"
          placeholder="0x..."
          type="text"
          class="w-full border border-gray-600 rounded p-4 mb-4"
          data-test="delegate-zero-input-address"
        />

        <div v-if="hasDelegatedZero" class="my-4 text-xs text-grey-600">
          <p>Current Delegatee:</p>
          <p class="underline">{{ zeroDelegates }}</p>
        </div>
      </div>

      <div class="flex justify-between items-center gap-2 my-4">
        <NuxtLink
          class="text-grey-600 underline text-xs cursor-pointer"
          @click="onUseMyAddressValue"
          >Use my address</NuxtLink
        >
        <MButton
          id="button-delegate-zero"
          type="submit"
          :disabled="!isConnected || !canDelegate || !inputZeroDelegates"
          data-test="delegate-button-zero-submit"
        >
          delegate
        </MButton>
      </div>
    </form>

    <p class="text-grey-600 text-sm font-mono text-end mt-6">
      /* The delegated tokens will be available for voting starting from the
      next epoch. */
    </p>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useAccount } from "use-wagmi";
import { useMBalances } from "@/lib/hooks";
import { writePowerToken, writeZeroToken } from "@/lib/sdk";

const spog = storeToRefs(useSpogStore());

const inputPowerDelegates = ref();
const inputZeroDelegates = ref();

const { address: userAccount, isConnected } = useAccount();

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(userAccount);

function onUseMyAddress(refAddress: Ref<string | undefined>) {
  refAddress.value = userAccount.value!;
}
const onUseMyAddressVote = () => onUseMyAddress(inputPowerDelegates);
const onUseMyAddressValue = () => onUseMyAddress(inputZeroDelegates);

const canDelegate = computed(
  () => spog.epoch.value.current.type === "TRANSFER"
);

const { forceSwitchChain } = useCorrectChain();

useHead({
  titleTemplate: "%s - Delegate",
});

async function delegateVote() {
  await forceSwitchChain();

  return writePowerToken({
    address: spog.contracts.value.powerToken as Hash,
    functionName: "delegate",
    args: [inputPowerDelegates.value! as Hash],
  });
}

async function delegateValue() {
  await forceSwitchChain();

  return writeZeroToken({
    address: spog.contracts.value.zeroToken as Hash,
    functionName: "delegate",
    args: [inputZeroDelegates.value! as Hash],
  });
}
</script>
