<template>
  <div class="h-full flex flex-col">
    <div class="flex items-end gap-4 leading-4 pt-16 lg:pt-8 mb-6 z-50">
      <NuxtLink to="/">
        <img class="h-[24px]" src="/img/mzero-logo-white.svg" alt="" />
      </NuxtLink>
      <span class="text-grey-500 text-sm font-ppformula text-nowrap">
        [ Governance ]
      </span>
    </div>

    <div
      class="h-full overflow-y-scroll lg:overflow-y-auto flex flex-col gap-3"
    >
      <div>
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

          <NuxtLink
            v-if="isAuctionNotActive"
            class="block"
            to="/proposal/create/"
          >
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

        <nav class="text-grey-100 mb-3 lg:mb-6">
          <ul>
            <li
              v-for="item in mainMenuItems.filter((i) => i.isShow)"
              :key="item.path"
            >
              <NuxtLink
                :to="item.path"
                :class="{
                  'notification-dot': item.notification,
                  active: item.exactRoute
                    ? currentRoute?.path === item.path
                    : currentRoute?.path?.includes(item.path),
                }"
                :data-test="item.dataTest"
              >
                {{ item.title }} {{}}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <div v-if="isConnected" class="text-grey-100">
        <hr class="border-grey-700 my-4" />

        <nav class="text-grey-100 mb-3 lg:mb-6">
          <ul>
            <li v-for="item in profileMenuItems" :key="item.to">
              <NuxtLink
                v-if="item.isShow"
                :to="item.path"
                :class="{
                  'notification-dot': item?.notification,
                  active: currentRoute?.path === item.path,
                }"
                :data-test="item.dataTest"
              >
                {{ item.title }} {{}}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div v-if="isCorrectChain" class="mb-4 bg-grey-800 p-4 font-inter">
          <div class="text-xxs text-grey-500 flex justify-between">
            <span>Voting power</span>
            <span>Balance</span>
          </div>
          <hr class="border-grey-700 border-dashed mb-4 mt-2" />
          <p class="text-xs mb-2 text-grey-500">POWER tokens</p>

          <div>
            <div class="flex justify-between items-end gap-3">
              <div class="flex gap-2 items-end">
                <MIconPower class="h-4 w-4" version="light" />
                <span class="text-grey-200 font-ppformula leading-3">
                  {{ powerVotingPower?.data.value?.relative?.toFixed(3) }}%
                </span>
              </div>

              <span class="text-grey-200 text-xxs leading-none">
                {{
                  useNumberFormatterPrice(
                    balancePowerToken?.data.value?.formatted || 0n,
                    0,
                    2,
                  )
                }}
              </span>
            </div>
          </div>

          <hr class="border-grey-700 border-dashed my-4" />

          <p class="text-xs mb-2 text-grey-500">ZERO tokens</p>
          <div>
            <div class="flex justify-between items-end gap-3">
              <div class="flex gap-2 items-end">
                <MIconZero version="light" class="h-4 w-4" />
                <span class="text-grey-200 font-ppformula leading-3">
                  {{ zeroVotingPower?.data.value?.relative?.toFixed(3) }}%
                </span>
              </div>

              <span class="text-grey-200 text-xxs leading-none">
                {{
                  useNumberFormatterPrice(
                    balanceZeroToken?.data.value?.formatted || 0n,
                    0,
                    0,
                  )
                }}
              </span>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useDisconnect } from "use-wagmi";
import { useMVotingPower, useMBalances } from "@/lib/hooks";

const { isConnected, address } = useAccount();
const { disconnect } = useDisconnect();
const { isCorrectChain, forceSwitchChain } = useCorrectChain();
const { amountLeftToAuction } = useAuction();

const ttg = useTtgStore();
const router = useRouter();

const { currentRoute } = router;

const isTransferEpoch = computed(() => ttg.epoch.current?.type === "TRANSFER");

const config = useRuntimeConfig();

const { power: powerVotingPower, zero: zeroVotingPower } =
  useMVotingPower(address);

const { powerToken: balancePowerToken, zeroToken: balanceZeroToken } =
  useMBalances(address);

const auctionActive = computed(() => {
  return config.public.auctionActive as unknown as boolean | string;
});

const isAuctionNotActive = computed(() => {
  return auctionActive.value !== true;
});

const isAuctionActive = computed(() => {
  return auctionActive.value === true || auctionActive.value === "";
});

const mainMenuItems = computed(() => {
  return [
    {
      title: "Home",
      path: "/proposals/",
      isShow: isAuctionNotActive.value,
      dataTest: "sidebar-link-proposals",
      exactRoute: true,
    },
    {
      title: "All proposals",
      path: "/proposals/all",
      isShow: isAuctionNotActive.value,
      dataTest: "sidebar-link-all-proposals",
    },
    {
      title: "Actors",
      path: "/actors/",
      isShow: isAuctionNotActive.value,
      dataTest: "sidebar-link-lists",
    },
    {
      title: "Configs",
      path: "/config/",
      isShow: isAuctionNotActive.value,
      dataTest: "sidebar-link-configs",
    },

    {
      title: "Auction",
      path: "/auction/",
      isShow: isAuctionActive.value,
      dataTest: "sidebar-link-auction",
      notification: amountLeftToAuction.value && isTransferEpoch.value,
    },

    {
      title: "Protocol Fees",
      path: "/fees/",
      isShow: isAuctionActive.value,
      dataTest: "sidebar-link-fees",
    },
  ];
});

const profileMenuItems = computed(() => [
  {
    title: "My Profile",
    path: "/profile/me/",
    isShow: isAuctionNotActive.value,
    dataTest: "sidebar-link-my-profile",
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
