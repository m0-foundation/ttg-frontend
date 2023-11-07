<template>
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
    <div class="flex justify-between items-center mb-2 text-sm">
      <NuxtLink to="/profile/me/">MY PROFILE</NuxtLink>
      <div class="text-xs text-gray-400">
        <MAddressAvatar :address="userAccount" />
      </div>
    </div>

    <div class="py-4">
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
      class="p-3 bg-green-900 text-white"
    >
      <div class="mb-2">
        <p class="uppercase mb-2 text-xxs">Voting power is delegated to:</p>

        <div v-show="hasDelegatedPower" class="flex items-center">
          <MIconPower class="h-6 w-6 mr-1" />
          <p class="underline text-xs truncate flex">
            <MAddressAvatar :show-avatar="false" :address="powerDelegates" />
          </p>
        </div>

        <div v-show="hasDelegatedZero" class="flex items-center">
          <MIconZero class="h-6 w-6 mr-1" />
          <p class="underline text-xs truncate flex">
            <MAddressAvatar :show-avatar="false" :address="zeroDelegates" />
          </p>
        </div>
      </div>
      <MButton version="outline-light" class="w-full">
        <NuxtLink to="/delegate/">re-delegate</NuxtLink>
      </MButton>
    </div>

    <button
      id="button-disconnect-wallet"
      type="button"
      class="block w-full py-2 hover:underline text-left uppercase text-xs"
      @click="() => disconnect()"
    >
      Disconnect
    </button>
  </div>
  <div v-else class="py-2">
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
  @apply text-white text-sm py-2 uppercase hover:underline;
}
.active {
  @apply text-green-700;
}

.active::before {
  content: "[> ";
}
</style>
