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
              {{ votePower && formatEther(votePower as bigint) }}
            </span>
          </div>
        </div>
        <label class="text-grey-primary">Enter address</label>
        <input
          v-model="voteDelegate"
          placeholder="0x..."
          type="text"
          class="w-full bg-secondary-dark text-white border border-1 border-gray-500 rounded p-4 mb-4"
        />
        <div class="flex justify-between">
          <button
            id="button-use-my-address-vote"
            type="button"
            class="underline text-grey-primary"
            @click="onUseMyAddressVote"
          >
            Use my address
          </button>
        </div>
      </div>

      <div class="flex justify-end gap-2 my-4">
        <MButton
          id="button-delegate-vote"
          type="submit"
          :disabled="!isConnected"
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
              {{ valuePower && formatEther(valuePower as bigint) }}
            </span>
          </div>
        </div>
        <label class="text-grey-primary">Enter address</label>
        <input
          v-model="valueDelegate"
          placeholder="0x..."
          type="text"
          class="w-full bg-secondary-dark text-white border border-1 border-gray-500 rounded p-4 mb-4"
        />
        <div class="flex justify-between">
          <button
            id="button-use-my-address-value"
            type="button"
            class="underline text-grey-primary"
            @click="onUseMyAddressValue"
          >
            Use my address
          </button>
        </div>
      </div>

      <p class="text-primary my-4">
        /* The delegated tokens will be available for voting starting from the
        next epoch. Next epoch starts {{ nextEpochAsDate }}. */
      </p>

      <div class="flex justify-end gap-2">
        <MButton
          id="button-delegate-value"
          type="submit"
          :disabled="!isConnected"
          >delegate</MButton
        >
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Hash, formatEther } from "viem";
import { ref } from "vue";
import { useAccount, useContractRead } from "use-wagmi";
import { whenever } from "@vueuse/core";
import { writeVote, voteABI, valueABI, writeValue } from "@/lib/sdk";

const config = useRuntimeConfig();
const store = useSpogStore();
const spogClient = useSpogClientStore();
const spog = storeToRefs(store);

const { address: userAccount, isConnected } = useAccount();

const nextEpochAsDate = computed(() => {
  const { toFormat } = useDate(Number(spog.epoch.value.next?.asTimestamp));
  return toFormat("LLL");
});

const voteDelegate = ref<string>();
const valueDelegate = ref<string>();

function onUseMyAddress(refAddress: Ref<string | undefined>) {
  refAddress.value = userAccount.value!;
}
const onUseMyAddressVote = () => onUseMyAddress(voteDelegate);
const onUseMyAddressValue = () => onUseMyAddress(valueDelegate);

function delegateVote() {
  return writeVote({
    address: spog.contracts.value.vote as Hash,
    functionName: "delegate",
    args: [voteDelegate.value! as Hash],
  });
}

function delegateValue() {
  return writeValue({
    address: spog.contracts.value.value as Hash,
    functionName: "delegate",
    args: [valueDelegate.value! as Hash],
  });
}

const {
  data: votePower,
  isError: voteIsError,
  isLoading: voteIsLoading,
} = useContractRead({
  address: spog.contracts.value.vote as Hash,
  abi: voteABI,
  functionName: "getVotes",
  args: [(userAccount.value || config.public.ZERO_ADDRESS) as Hash],
  watch: true,
});

const {
  data: valuePower,
  isError: valueIsError,
  isLoading: valueIsLoading,
} = useContractRead({
  address: spog.contracts.value.value as Hash,
  abi: valueABI,
  functionName: "getVotes",
  args: [(userAccount.value || config.public.ZERO_ADDRESS) as Hash],
  watch: true,
});

whenever(
  isConnected,
  () => {
    console.log("whenever", { isConnected });
    spogClient.client.getVoteDelegates(userAccount.value!).then((delegate) => {
      console.log("voteDelegate", { delegate });
      voteDelegate.value =
        delegate === config.public.ZERO_ADDRESS
          ? undefined
          : (delegate as Hash);
    });

    spogClient.client.getValueDelegates(userAccount.value!).then((delegate) => {
      console.log("valueDelegate", { delegate });
      valueDelegate.value =
        delegate === config.public.ZERO_ADDRESS
          ? undefined
          : (delegate as Hash);
    });
  },
  { immediate: true }
);
</script>
