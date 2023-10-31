<template>
  <a href="/" class="inline-block items-center mb-4">
    <span
      class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
    >
      M&#94;ZERO <span class="text-sm text-gray-400">Governance</span>
    </span>
  </a>

  <NuxtLink class="block" to="/proposal/create/">
    <MButton class="mb-4">Create Proposal</MButton>
  </NuxtLink>

  <nav class="text-white text-xl mb-8">
    <ul>
      <li>
        <NuxtLink to="/proposals/" active-class="active"> proposals </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/lists/" active-class="active">lists</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/config/governance/" active-class="active">
          governance config
        </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/config/protocol/" active-class="active">
          M0 Protocol config
        </NuxtLink>
      </li>
    </ul>
  </nav>

  <div v-if="isConnected">
    <div class="flex justify-between items-center mb-6">
      <NuxtLink to="/profile/me/" class="underline">MY PROFILE</NuxtLink>
      <div class="truncate w-28 text-xs text-gray-400">
        {{ userAccount }}
      </div>
    </div>

    <div class="p-4">
      <p class="uppercase text-xxs mb-4 text-gray-400">current voting power</p>
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

    <div
      v-show="hasDelegatedPower || hasDelegatedZero"
      class="p-4 bg-primary-darker text-white"
    >
      <div class="mb-2">
        <p class="uppercase mb-2 text-xxs">Voting power is delegated to:</p>

        <div v-show="hasDelegatedPower" class="flex items-center">
          <MIconPower class="h-6 w-6 mr-1" />
          <p class="underline text-xs truncate flex">
            {{ powerDelegates }}
          </p>
        </div>

        <div v-show="hasDelegatedZero" class="flex items-center">
          <MIconZero class="h-6 w-6 mr-1" />
          <p class="underline text-xs truncate flex">{{ zeroDelegates }}</p>
        </div>
      </div>
      <MButton version="outline-light" class="w-full">
        <NuxtLink to="/delegate/">re-delegate</NuxtLink>
      </MButton>
    </div>

    <button
      id="button-disconnect-wallet"
      type="button"
      class="block w-full p-2 hover:underline text-left uppercase text-xs"
      @click="() => disconnect()"
    >
      Disconnect
    </button>
  </div>
  <div v-else>
    <MModalWeb3Connect />
  </div>

  <li>
    <NuxtLink to="/settings/" active-class="active" class="text-xs"
      >settings</NuxtLink
    >
  </li>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect } from "use-wagmi";
import { useMVotingPower } from "@/lib/hooks";

const { address: userAccount, isConnected } = useAccount();
const { disconnect } = useDisconnect();

const { powerTokenVotingPower, zeroTokenVotingPower } =
  useMVotingPower(userAccount);

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();
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
