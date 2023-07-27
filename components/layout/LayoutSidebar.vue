<template>
  <a href="/" class="flex items-center mb-4">
    <span
      class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
    >
      M&#94;ZERO <span class="text-sm text-gray-400">Governance</span>
    </span>
  </a>

  <NuxtLink to="/proposals/create">
    <MButton class="mb-4">Create Proposal</MButton>
  </NuxtLink>

  <MButton
    v-show="!hasVoteDelegator"
    id="button-delegate-vote"
    class="mb-4"
    @click="delegateVote()"
  >
    Delegate Vote
  </MButton>

  <MButton
    v-show="!hasValueDelegator"
    id="button-delegate-value"
    class="mb-4"
    @click="delegateValue()"
  >
    Delegate Value
  </MButton>

  <nav class="text-white text-xl mb-8">
    <ul>
      <li v-for="item in menu" :key="item.label">
        <NuxtLink :to="item.href" active-class="active">
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>

  <div v-if="isConnected">
    <div class="flex justify-between items-center mb-6">
      <div>MY PROFILE</div>
      <div class="truncate w-28 text-xs text-gray-400">
        {{ userAccount }}
      </div>
    </div>

    <div class="p-4">
      <p class="uppercase text-xs mb-4 text-gray-400">
        current voting power [?]
      </p>
      <div class="flex justify-between mb-4">
        <div class="text-gray-400 flex">
          <span class="bg-white text-black rounded-full p-1 mr-4 text-sm">
            VT
          </span>
          {{ voteBalance?.formatted }}
        </div>

        <div class="text-gray-400 flex">
          <span
            class="border border-1-white bg-transparent p-1 text-white rounded-full mr-4 text-sm"
          >
            $V
          </span>
          {{ valueBalance?.formatted }}
        </div>
      </div>
      <p class="uppercase text-primary text-xs">
        Delegated voting power will be available next epoch
      </p>
    </div>

    <button
      type="button"
      class="block w-full py-2 hover:bg-gray-600 text-left uppercase"
      @click="() => disconnect()"
    >
      Disconnect
    </button>
  </div>
  <div v-else>
    <MModalWeb3Connect />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { ref } from "vue";
import { useAccount, useDisconnect, useBalance } from "use-wagmi";
import { whenever } from "@vueuse/core";
import { writeIvote } from "@/lib/sdk";

const menu = [
  {
    label: "proposals",
    href: "/proposals",
  },
  {
    label: "lists",
    href: "/lists",
  },
  {
    label: "delegates",
    href: "/delegates",
  },

  {
    label: "governance config",
    href: "/config/governance",
  },

  {
    label: "M0 Protocol config",
    href: "/config/protocol",
  },

  {
    label: "Settings",
    href: "/settings",
  },
];

const isMenuOpen = ref(false);
const hasVoteDelegator = ref(false);
const hasValueDelegator = ref(false);

const config = useRuntimeConfig();
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
      hasVoteDelegator.value = delegator !== config.public.ZERO_ADDRESS;
    });

    spogClient.client
      .getValueDelegates(userAccount.value!)
      .then((delegator) => {
        console.log("hasValueDelegator", { delegator });
        hasValueDelegator.value = delegator !== config.public.ZERO_ADDRESS;
      });
  },
  { immediate: true }
);
</script>

<style scoped>
li {
  list-style-type: none;
  @apply text-white text-sm  px-2 py-2 uppercase hover:underline;
}
.active {
  @apply text-primary;
}

.active::before {
  content: "[> ";
}
</style>
