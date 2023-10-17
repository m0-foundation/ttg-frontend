<template>
  <a href="/" class="inline-block items-center mb-4">
    <span
      class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
    >
      M&#94;ZERO <span class="text-sm text-gray-400">Governance</span>
    </span>
  </a>

  <NuxtLink class="block" to="/proposal/create">
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
      <NuxtLink to="/profile/me" class="underline">MY PROFILE</NuxtLink>
      <div class="truncate w-28 text-xs text-gray-400">
        {{ userAccount }}
      </div>
    </div>

    <div class="p-4">
      <p class="uppercase text-xs mb-4 text-gray-400">
        current voting power [?]
      </p>
      <div class="flex justify-between mb-4">
        <div class="text-gray-400 flex items-center">
          <MIconPower class="h-6 w-6 mr-2" />
          {{ powerTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
        </div>

        <div class="text-gray-400 flex items-center">
          <MIconZero class="h-6 w-6 mr-2" />
          {{ zeroTokenVotingPower?.data?.value?.relative?.toFixed(2) }}%
        </div>
      </div>
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
import { useAccount, useDisconnect } from "use-wagmi";
import { useMVotingPower } from "@/lib/hooks";

const { address: userAccount, isConnected } = useAccount();
const { disconnect } = useDisconnect();

const { powerTokenVotingPower, zeroTokenVotingPower } =
  useMVotingPower(userAccount);
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
