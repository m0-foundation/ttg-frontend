<template>
  <a href="/" class="flex items-center mb-4">
    <span
      class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
    >
      M&#94;ZERO <span class="text-sm text-gray-400">Governance</span>
    </span>
  </a>

  <NuxtLink to="/proposal/create">
    <MButton class="mb-4">Create Proposal</MButton>
  </NuxtLink>

  <nav class="text-white text-xl mb-8">
    <ul>
      <li>
        <NuxtLink to="/proposals/active" active-class="active">
          proposals
        </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/lists" active-class="active">lists</NuxtLink>
      </li>

      <li v-show="isConnected">
        <NuxtLink to="/delegate" active-class="active">delegate</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/config/governance" active-class="active">
          governance config
        </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/config/protocol" active-class="active">
          M0 Protocol config
        </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/settings" active-class="active">settings</NuxtLink>
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
          {{ votePower && formatEther(votePower as bigint) }}
        </div>

        <div class="text-gray-400 flex">
          <span
            class="border border-1-white bg-transparent p-1 text-white rounded-full mr-4 text-sm"
          >
            $V
          </span>
          {{ valuePower && formatEther(valuePower as bigint) }}
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
import { Hash, formatEther } from "viem";
import { useAccount, useDisconnect, useContractRead } from "use-wagmi";
import { voteABI, valueABI } from "@/lib/sdk";

const config = useRuntimeConfig();
const store = useSpogStore();
const spog = storeToRefs(store);

const { address: userAccount, isConnected } = useAccount();
const { disconnect } = useDisconnect();

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
