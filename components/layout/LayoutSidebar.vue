<template>
  <div class="flex items-end gap-4 leading-4 pt-16 lg:pt-8 mb-6 z-50">
    <NuxtLink to="/proposals">
      <img class="h-[24px]" src="/img/mzero-logo-white.svg" alt="" />
    </NuxtLink>
    <span class="text-grey-500 text-sm font-ppformula text-nowrap">
      [ Governance ]
    </span>
  </div>

  <div class="flex flex-col gap-3">
    <MModalWeb3Connect v-if="!isConnected">
      <template #default="{ connect }">
        <MButton
          class="w-full flex justify-center"
          data-test="sidebar-button-connect-wallet"
          @click="connect"
        >
          Connect Wallet
        </MButton>
      </template>
    </MModalWeb3Connect>

    <NuxtLink class="block" to="/proposal/create/">
      <MButton
        :disabled="$route.path === '/proposal/create/'"
        class="mb-6 w-full flex justify-center"
        data-test="sidebar-button-create-proposal"
        :version="isConnected ? 'primary' : 'outline-light'"
      >
        Create Proposal
      </MButton>
    </NuxtLink>
  </div>

  <nav class="text-grey-100 mb-6">
    <ul>
      <li v-for="item in mainMenuItems" :key="item.to">
        <NuxtLink
          v-if="item.isShow"
          :to="item.path"
          :class="{
            'notification-dot': item.notification,
            active: currentRoute?.path?.includes(item.path),
          }"
          :data-test="item.dataTest"
        >
          {{ item.title }} {{}}
        </NuxtLink>
      </li>
    </ul>
  </nav>

  <div v-if="isConnected" class="text-grey-100">
    <hr class="border-grey-700 my-4" />

    <nav class="text-grey-100 mb-6">
      <ul>
        <li v-for="item in profileMenuItems" :key="item.to">
          <NuxtLink
            v-if="item.isShow"
            :to="item.path"
            :class="{
              'notification-dot': item?.notification,
              active: currentRoute?.path?.includes(item.path),
            }"
            :data-test="item.dataTest"
          >
            {{ item.title }} {{}}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div v-if="isCorrectChain" class="mb-4 bg-grey-800 p-4">
      <p class="text-xs mb-2 text-grey-600">POWER tokens</p>

      <div>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <MIconPower
              class="h-5 w-5"
              :version="hasDelegatedPower ? 'dark' : 'light'"
            />
            <span :class="[hasDelegatedPower ? 'text-grey-600' : 'text-white']">
              {{ powerVotingPower?.data.value?.relative?.toFixed(2) }}%
            </span>
          </div>
          <span class="text-grey-600 text-xxs">
            {{
              useNumberFormatterCompact(
                balancePowerToken?.data?.value?.formatted || 0
              )
            }}
          </span>
        </div>
        <div
          v-if="hasDelegatedPower"
          class="bg-accent-blue p-2 py-1 mt-2 text-center"
        >
          <p class="text-xxs font-inter">Voting power is delegated</p>
        </div>

        <div
          v-if="hasReceivedPowerVotingPower"
          class="bg-green-800 p-2 py-1 mt-2 text-left w-fit"
        >
          <p class="text-xxs font-inter">Delegatee</p>
        </div>
      </div>

      <hr class="border-grey-700 border-dashed my-4" />

      <p class="text-xs mb-2 text-grey-600">ZERO tokens</p>
      <div>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <MIconZero
              :version="hasDelegatedZero ? 'dark' : 'light'"
              class="h-5 w-5"
            />
            <span :class="[hasDelegatedZero ? 'text-grey-600' : 'text-white']">
              {{ zeroVotingPower?.data.value?.relative?.toFixed(2) }}%
            </span>
          </div>
          <span class="text-grey-600 text-xxs">
            {{
              useNumberFormatterCompact(
                balanceZeroToken?.data?.value?.formatted || 0
              )
            }}
          </span>
        </div>
        <div
          v-if="hasDelegatedZero"
          class="bg-accent-blue p-2 py-1 mt-2 text-center"
        >
          <p class="text-xxs font-inter">Voting power is delegated</p>
        </div>

        <div
          v-if="hasReceivedZeroVotingPower"
          class="bg-green-800 p-2 py-1 mt-2 text-left w-fit"
        >
          <p class="text-xxs font-inter">Delegatee</p>
        </div>
      </div>
    </div>
    <div v-else class="mb-4 bg-grey-800 p-4">
      <p class="bg-red-500 text-white w-fit p-2 text-xs">
        Wrong network!<br />
        <button
          class="text-xxs underline hover:no-underline"
          @click="forceSwitchChain"
        >
          Switch network
        </button>
      </p>
    </div>

    <button
      id="button-disconnect-wallet"
      type="button"
      class="block w-full my-4 hover:underline text-left text-xs font-ppformula"
      data-test="sidebar-button-disconnect"
      @click="() => disconnect()"
    >
      Disconnect
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect } from "use-wagmi";
import { useMVotingPower, useMBalances, useMDelegates } from "@/lib/hooks";

const { isConnected, address } = useAccount();
const { disconnect } = useDisconnect();
const { isCorrectChain, forceSwitchChain } = useCorrectChain();
const { amountLeftToAuction } = useAuction();

const spog = useSpogStore();
const router = useRouter();

const { currentRoute } = router;

const isTransferEpoch = computed(() => spog.epoch.current?.type === "TRANSFER");

const config = useRuntimeConfig();

const { hasDelegatedPower, hasDelegatedZero } = useMDelegates(address);

const { power: powerVotingPower, zero: zeroVotingPower } =
  useMVotingPower(address);

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);

const hasReceivedPowerVotingPower = computed(
  () =>
    powerVotingPower?.data?.value?.value! >
    balancePowerToken.data?.value?.value!
);

const hasReceivedZeroVotingPower = computed(
  () =>
    zeroVotingPower?.data?.value?.value! > balanceZeroToken.data?.value?.value!
);

const isAuctionActive = computed(() => {
  return config.public.auctionActive;
});

const mainMenuItems = computed(() => {
  return [
    {
      title: "Home",
      path: "/proposals/",
      isShow: !isAuctionActive.value,
      dataTest: "sidebar-link-proposals",
    },
    {
      title: "Actors",
      path: "/actors/",
      isShow: !isAuctionActive.value,
      dataTest: "sidebar-link-lists",
    },
    {
      title: "Configs",
      path: "/config/",
      isShow: !isAuctionActive.value,
      dataTest: "sidebar-link-configs",
    },
    {
      title: "Rewards",
      path: "/rewards/",
      isShow: !isAuctionActive.value,
      dataTest: "sidebar-link-rewards",
    },
    {
      title: "Auction",
      path: "/auction/",
      isShow: isAuctionActive.value,
      dataTest: "sidebar-link-auction",
      notification: amountLeftToAuction.value && isTransferEpoch.value,
    },
  ];
});

const profileMenuItems = computed(() => [
  {
    title: "My Profile",
    path: "/profile/me/",
    isShow: !isAuctionActive.value,
    dataTest: "sidebar-link-my-profile",
  },
  {
    title: "Delegate",
    path: "/delegate/",
    isShow: !isAuctionActive.value,
    dataTest: "sidebar-link-delegate",
  },
]);
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
.notification-dot::after {
  content: "";
  @apply absolute ml-1 bg-accent-mint w-[6px] h-[6px];
}
</style>
