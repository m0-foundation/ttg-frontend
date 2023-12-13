<template>
  <div class="flex items-end gap-4 leading-4 pt-16 lg:pt-8 mb-6">
    <NuxtLink to="/">
      <img class="h-[24px]" src="/img/mzero-logo-white.svg" alt=""
    /></NuxtLink>
    <span class="lg:hidden">Gov</span>
    <span class="hidden lg:block text-gray-400">Governance</span>
  </div>

  <NuxtLink class="block" to="/proposal/create/">
    <MButton class="mb-6 w-full flex justify-center">Create Proposal</MButton>
  </NuxtLink>

  <nav class="text-grey-100 text-xl mb-6">
    <ul>
      <li>
        <NuxtLink to="/proposals/" active-class="active"> proposals </NuxtLink>
      </li>

      <li>
        <NuxtLink to="/lists/" active-class="active">lists</NuxtLink>
      </li>

      <li>
        <NuxtLink to="/auction/" active-class="active">auction</NuxtLink>
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

  <div v-if="isConnected" class="text-grey-100">
    <div class="mb-4 text-sm">
      <NuxtLink to="/profile/me/">MY PROFILE</NuxtLink>
    </div>

    <div v-if="isCorrectChain" class="mb-6">
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
      v-show="(hasDelegatedPower || hasDelegatedZero) && isCorrectChain"
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
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect } from "use-wagmi";
import { useMVotingPower } from "@/lib/hooks";

const { address: userAccount, isConnected } = useAccount();
const { disconnect } = useDisconnect();
const { isCorrectChain } = useCorrectChain();

const { powerTokenVotingPower, zeroTokenVotingPower } =
  useMVotingPower(userAccount);

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();
</script>

<style scoped>
li {
  list-style-type: none;
  @apply text-grey-100 text-sm py-2 uppercase hover:underline;
}
.active {
  @apply text-green-700 bg-transparent;
}

.active::before {
  content: "[> ";
}
</style>
