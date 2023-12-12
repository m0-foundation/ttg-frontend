<template>
  <div class="mb-20 w-full mx-auto">
    <h1 class="text-white text-2xl p-8 text-center">Delegate Tokens</h1>
    <p class="text-grey-400 text-center">
      You can delegate your voting power to any address. The tokens will remain
      in your balance, and you can re-delegate them in the future.
    </p>

    <div
      v-show="!canDelegate"
      class="bg-green-900 text-white text-xs px-4 py-5 my-4"
    >
      <p class="uppercase mb-2">Warning</p>

      <div class="flex items-center">
        <MIconWarning class="mr-2" />
        <p>
          The transfer epoch has concluded. You will be able to delegate in the
          next
          <b>Transfer</b> epoch.
        </p>
      </div>
    </div>

    <form class="my-4" @submit.prevent="delegateVote">
      <div class="bg-secondary-dark p-8">
        <div class="flex justify-between my-4">
          <div class="text-2xl">Delegate Power tokens</div>
          <div class="flex">
            <MIconPower class="h-8 w-8 mr-4" />
            <span class="mx-2 flex items-center text-2xl text-green-700">
              {{ powerTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
            </span>
          </div>
        </div>
        <label class="text-grey-400">Enter address</label>
        <input
          id="input-delegate-power"
          v-model="inputPowerDelegates"
          placeholder="0x..."
          type="text"
          class="w-full bg-secondary-dark text-white border border-1 border-gray-500 rounded p-4 mb-4"
        />
        <div class="flex justify-between">
          <button
            id="button-use-my-address-power"
            type="button"
            class="underline text-grey-400"
            @click="onUseMyAddressVote"
          >
            Use my address
          </button>
        </div>

        <div v-if="hasDelegatedPower" class="my-4 text-xs text-grey-400">
          <p>Current Delegatee:</p>
          <p class="underline">{{ powerDelegates }}</p>
        </div>
      </div>

      <div class="flex justify-end gap-2 my-4">
        <MButton
          id="button-delegate-power"
          type="submit"
          :disabled="!isConnected || !canDelegate"
        >
          delegate
        </MButton>
      </div>
    </form>

    <form class="my-4" @submit.prevent="delegateValue">
      <div class="bg-secondary-dark p-8 my-8">
        <div class="flex justify-between my-4">
          <div class="text-2xl">Delegate Zero tokens</div>
          <div class="flex">
            <MIconZero class="h-8 w-8 mr-4" />
            <span class="mx-2 flex items-center text-2xl text-green-700">
              {{ zeroTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
            </span>
          </div>
        </div>
        <label class="text-grey-400">Enter address</label>
        <input
          id="input-delegate-zero"
          v-model="inputZeroDelegates"
          placeholder="0x..."
          type="text"
          class="w-full bg-secondary-dark text-white border border-1 border-gray-500 rounded p-4 mb-4"
        />
        <div class="flex justify-between">
          <button
            id="button-use-my-address-zero"
            type="button"
            class="underline text-grey-400"
            @click="onUseMyAddressValue"
          >
            Use my address
          </button>
        </div>

        <div v-if="hasDelegatedZero" class="my-4 text-xs text-grey-400">
          <p>Current Delegatee:</p>
          <p class="underline">{{ zeroDelegates }}</p>
        </div>
      </div>

      <p class="text-green-700 my-4">
        /* The delegated tokens will be available for voting starting from the
        next <b>Voting</b> epoch. */
      </p>

      <div class="flex justify-end gap-2">
        <MButton
          id="button-delegate-zero"
          type="submit"
          :disabled="!isConnected || !canDelegate"
        >
          delegate
        </MButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { useAccount } from "use-wagmi";
import { useMVotingPower } from "@/lib/hooks";
import { writePowerToken, writeZeroToken } from "@/lib/sdk";

const spog = storeToRefs(useSpogStore());

const inputPowerDelegates = ref();
const inputZeroDelegates = ref();

const { address: userAccount, isConnected } = useAccount();

const { powerTokenVotingPower, zeroTokenVotingPower } =
  useMVotingPower(userAccount);
const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();

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
