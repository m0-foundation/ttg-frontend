<template>
  <header class="">
    <div class="w-full flex flex-wrap items-center justify-between mx-auto p-8">
      <a href="/" class="flex items-center">
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
        >
          M&#94;ZERO <span class="text-sm text-gray-400">Governance</span>
        </span>
      </a>

      <div v-if="isConnected" class="flex items-center md:order-2 gap-2">
        <MButton
          v-show="!hasVoteDelegator"
          id="button-delegate-vote"
          @click="delegateVote()"
        >
          Delegate Vote
        </MButton>

        <MButton
          v-show="!hasValueDelegator"
          id="button-delegate-value"
          @click="delegateValue()"
        >
          Delegate Value
        </MButton>

        <NuxtLink to="/proposals/create">
          <MButton>Create Proposal</MButton>
        </NuxtLink>
        <div class="text-white mr-4">
          <span class="bg-white text-black rounded-full p-1 mx-4 text-sm"
            >VT</span
          >
          {{ voteBalance?.formatted }}
        </div>

        <div class="text-white mr-4">
          <span
            class="border border-1-white bg-transparent p-1 text-white rounded-full mx-4 text-sm"
            >$V</span
          >
          {{ valueBalance?.formatted }}
        </div>

        <div
          class="border border-1 border-gray-500 rounded pl-4 py-1 flex items-center"
        >
          <div class="truncate w-28">
            {{ userAccount }}
          </div>
          <button
            class="text-white font-medium text-sm px-4 py-2.5 text-center inline-flex items-center"
            type="button"
            @click="isMenuOpen = !isMenuOpen"
          >
            <svg
              class="w-4 h-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
        <!-- Dropdown menu -->
        <div
          v-show="isMenuOpen"
          class="absolute right-16 top-20 z-10 bg-gray-800 divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <ul
            class="py-2 text-sm text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <a href="#" class="block px-4 py-2 hover:bg-gray-600">
                My Profile
              </a>
            </li>

            <li>
              <hr class="border-gray-500" />
              <button
                type="button"
                class="block w-full px-4 py-2 hover:bg-gray-600 text-left"
                @click="() => disconnect()"
              >
                Disconnect
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div v-else>
        <MModalWeb3Connect />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { ref } from "vue";
import { useAccount, useDisconnect, useBalance } from "use-wagmi";
import { whenever } from "@vueuse/core";
import { writeIvote } from "@/lib/sdk";

const isMenuOpen = ref(false);
const hasVoteDelegator = ref(false);
const hasValueDelegator = ref(false);
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

const store = useSpogStore();
const spogClient = useSpogClientStore();
const spog = storeToRefs(store);

const { address: userAccount, isConnected } = useAccount();
const { disconnect } = useDisconnect();

function delegateVote() {
  return writeIvote({
    address: spog.contracts.value.vote as Hash,
    functionName: "delegate",
    args: [userAccount.value!], // self delegate
  }).then(() => {
    hasVoteDelegator.value = true;
  });
}

function delegateValue() {
  return writeIvote({
    address: spog.contracts.value.value as Hash,
    functionName: "delegate",
    args: [userAccount.value!], // self delegate
  }).then(() => {
    hasValueDelegator.value = true;
  });
}

const {
  data: voteBalance,
  isError: voteIsError,
  isLoading: voteIsLoading,
} = useBalance({
  address: userAccount.value,
  token: spog.contracts.value.vote as Hash,
  watch: true,
});

const {
  data: valueBalance,
  isError: valueIsError,
  isLoading: valueIsLoading,
} = useBalance({
  address: userAccount.value,
  token: spog.contracts.value.value as Hash,
  watch: true,
});

whenever(
  isConnected,
  () => {
    console.log("whenever", { isConnected });
    spogClient.client.getVoteDelegates(userAccount.value!).then((delegator) => {
      console.log("hasVoteDelegator", { delegator });
      hasVoteDelegator.value = delegator !== NULL_ADDRESS;
    });

    spogClient.client
      .getValueDelegates(userAccount.value!)
      .then((delegator) => {
        console.log("hasValueDelegator", { delegator });
        hasValueDelegator.value = delegator !== NULL_ADDRESS;
      });
  },
  { immediate: true }
);
</script>
