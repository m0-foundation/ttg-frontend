<template>
  <div class="flex items-end gap-4 leading-4 pt-16 lg:pt-8 mb-6 z-50">
    <NuxtLink to="/proposals">
      <img class="h-[24px]" src="/img/mzero-logo-white.svg" alt="" />
    </NuxtLink>
    <span class="lg:hidden">Gov</span>
    <span class="hidden lg:block text-grey-600 text-nowrap"
      >[ Governance ]</span
    >
  </div>

  <NuxtLink class="block" to="/proposal/create/">
    <MButton
      class="mb-6 w-full flex justify-center"
      data-test="sidebar-button-create-proposal"
    >
      Create Proposal
    </MButton>
  </NuxtLink>

  <nav class="text-grey-100 mb-6">
    <ul>
      <li>
        <NuxtLink
          to="/proposals/"
          active-class="active"
          data-test="sidebar-link-proposals"
        >
          Home
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/lists/"
          active-class="active"
          data-test="sidebar-link-lists"
        >
          Lists
        </NuxtLink>
      </li>

      <li v-if="$config.public.auctionActive">
        <NuxtLink to="/auction/" active-class="active">auction</NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/config/governance/"
          active-class="active"
          data-test="sidebar-link-governance"
        >
          Governance Config
        </NuxtLink>
      </li>

      <li>
        <NuxtLink
          to="/config/protocol/"
          active-class="active"
          data-test="sidebar-link-protocol"
        >
          M0 Protocol Config
        </NuxtLink>
      </li>
    </ul>
  </nav>

  <hr class="border-grey-800 my-6" />

  <div v-if="isConnected" class="text-grey-100">
    <div class="mb-4">
      <NuxtLink
        to="/profile/me/"
        data-test="sidebar-link-my-profile"
        active-class="active"
      >
        My Profile
      </NuxtLink>
    </div>

    <div v-if="isCorrectChain" class="mb-4 bg-grey-800 p-4">
      <p class="text-xs mb-4 text-grey-600">Current voting power</p>
      <div class="flex justify-between">
        <div class="flex">
          <MIconPower class="h-6 w-6" />
          <div class="flex flex-col">
            <span
              >{{
                powerTokenVotingPower?.data?.value?.relative?.toFixed(0)
              }}%</span
            >
            <span class="text-grey-600 text-xxs">{{
              balancePowerToken?.data?.value?.formatted
            }}</span>
          </div>
        </div>

        <div class="flex">
          <MIconZero class="h-6 w-6" />
          <div class="flex flex-col">
            <span
              >{{
                zeroTokenVotingPower?.data?.value?.relative?.toFixed(0)
              }}%</span
            >
            <span class="text-grey-600 text-xxs">{{
              balanceZeroToken?.data?.value?.formatted
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="(hasDelegatedPower || hasDelegatedZero) && isCorrectChain"
      class="p-4 bg-accent-teal text-white"
    >
      <div class="mb-2">
        <p class="uppercase mb-2 text-xxs">Tokens delegated to:</p>

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
      <MButton
        version="outline-light"
        class="w-full"
        data-test="sidebar-link-delegate"
      >
        <NuxtLink to="/delegate/"> Re-delegate </NuxtLink>
      </MButton>
    </div>

    <button
      id="button-disconnect-wallet"
      type="button"
      class="block w-full my-4 hover:underline text-left text-xs"
      data-test="sidebar-button-disconnect"
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
import { useMVotingPower, useMBalances } from "@/lib/hooks";

const { isConnected, address } = useAccount();
const { disconnect } = useDisconnect();
const { isCorrectChain } = useCorrectChain();

const { powerTokenVotingPower, zeroTokenVotingPower } = useMVotingPower();

const { powerDelegates, zeroDelegates, hasDelegatedPower, hasDelegatedZero } =
  useDelegate();

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);
</script>

<style scoped>
li {
  list-style-type: none;
  @apply text-grey-100 py-1 hover:text-green-700;
}
.active {
  @apply text-green-700 bg-transparent;
}

.active::after {
  content: "_";
  margin-left: -3px;
}
</style>
