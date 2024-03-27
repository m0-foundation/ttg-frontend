<template>
  <div class="flex items-end gap-4 leading-4 pt-16 lg:pt-8 mb-6 z-50">
    <NuxtLink to="/proposals">
      <img class="h-[24px]" src="/img/mzero-logo-white.svg" alt="" />
    </NuxtLink>
    <span class="lg:hidden">Gov</span>
    <span class="hidden lg:block text-grey-600 text-nowrap">
      [ Governance ]
    </span>
  </div>

  <NuxtLink class="block" to="/proposal/create/">
    <MButton
      :disabled="$route.path === '/proposal/create/'"
      class="mb-6 w-full flex justify-center"
      data-test="sidebar-button-create-proposal"
    >
      Create Proposal
    </MButton>
  </NuxtLink>

  <nav class="text-grey-100 mb-6">
    <ul>
      <li v-for="item in mainMenuItems" :key="item.to">
        <NuxtLink
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

  <hr class="border-grey-700 my-4" />

  <div v-if="isConnected" class="text-grey-100">
    <li class="mb-4">
      <NuxtLink
        to="/profile/me/"
        data-test="sidebar-link-my-profile"
        active-class="active"
      >
        My Profile
      </NuxtLink>
    </li>

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
              {{ powerVotingPower?.data.value?.relative?.toFixed(1) }}%
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
        <div v-if="hasDelegatedPower" class="bg-accent-blue p-2 mt-4 w-fit">
          <p class="text-xxs font-mono">Voting power is delegated</p>
        </div>
      </div>

      <hr class="border-grey-700 border-dashed my-6" />
      <p class="text-xs mb-2 text-grey-600">ZERO tokens</p>
      <div>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <MIconZero
              :version="hasDelegatedZero ? 'dark' : 'light'"
              class="h-5 w-5"
            />
            <span :class="[hasDelegatedZero ? 'text-grey-600' : 'text-white']">
              {{ zeroVotingPower?.data.value?.relative?.toFixed(1) }}%
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
        <div v-if="hasDelegatedZero" class="bg-accent-blue p-2 mt-4 w-fit">
          <p class="text-xxs font-mono">Voting power is delegated</p>
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

  <div v-else class="py-2">
    <MModalWeb3Connect />
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

const mainMenuItems = computed(() => {
  return [
    {
      title: "Home",
      path: "/proposals/",
      active: true,
      dataTest: "sidebar-link-proposals",
    },
    {
      title: "Lists",
      path: "/lists/",
      active: true,
      dataTest: "sidebar-link-lists",
    },
    {
      title: "Configs",
      path: "/config/",
      active: true,
      dataTest: "sidebar-link-configs",
    },
    {
      title: "Rewards",
      path: "/rewards/",
      active: true,
      dataTest: "sidebar-link-rewards",
    },
    {
      title: "Auction",
      path: "/auction/",
      active: isAuctionActive.value,
      dataTest: "sidebar-link-auction",
      notification: amountLeftToAuction.value && isTransferEpoch.value,
    },
  ];
});

const isAuctionActive = computed(() => {
  return config.public.auctionActive;
});
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
