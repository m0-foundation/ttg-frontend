<template>
  <div class="mb-20 w-full xl:w-1/2 mx-auto">
    <h1 class="text-white text-2xl p-8 text-center">Delegate Tokens</h1>
    <p class="text-grey-primary text-center">
      In order to start voting delegate your Power tokens to yourself or
      somebody else.
    </p>

    <form class="my-4" @submit.prevent="delegateVote">
      <div class="bg-secondary-dark p-8">
        <div class="flex justify-between my-4">
          <div class="text-2xl">Delegate Power tokens</div>
          <div class="flex">
            <MIconPower class="h-8 w-8 mr-4" />
            <span class="mx-2 flex items-center text-2xl text-primary">
              {{ powerTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
            </span>
          </div>
        </div>
        <label class="text-grey-primary">Enter address</label>
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
            class="underline text-grey-primary"
            @click="onUseMyAddressVote"
          >
            Use my address
          </button>
        </div>

        <div v-if="hasDelegatedPower" class="my-4 text-xs text-grey-primary">
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
            <span class="mx-2 flex items-center text-2xl text-primary">
              {{ zeroTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
            </span>
          </div>
        </div>
        <label class="text-grey-primary">Enter address</label>
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
            class="underline text-grey-primary"
            @click="onUseMyAddressValue"
          >
            Use my address
          </button>
        </div>

        <div v-if="hasDelegatedZero" class="my-4 text-xs text-grey-primary">
          <p>Current Delegatee:</p>
          <p class="underline">{{ zeroDelegates }}</p>
        </div>
      </div>

      <p class="text-primary my-4">
        /* The delegated tokens will be available for voting starting from the
        next epoch. Next epoch starts {{ nextEpochAsDate }}. */
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
import type { Hash } from "viem";
import { useAccount } from "use-wagmi";
import { writePowerToken, writeZeroToken } from "@/lib/sdk";

const spog = storeToRefs(useSpogStore());

const inputPowerDelegates = ref();
const inputZeroDelegates = ref();

const { address: userAccount, isConnected } = useAccount();

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(spog.epoch.value.next?.asTimestamp));
  return toFormat("LLL");
});

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

function delegateVote() {
  return writePowerToken({
    address: spog.contracts.value.powerToken as Hash,
    functionName: "delegate",
    args: [inputPowerDelegates.value! as Hash],
  });
}

function delegateValue() {
  return writeZeroToken({
    address: spog.contracts.value.zeroToken as Hash,
    functionName: "delegate",
    args: [inputZeroDelegates.value! as Hash],
  });
}
</script>
