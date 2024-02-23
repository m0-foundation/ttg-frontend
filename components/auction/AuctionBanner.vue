<template lang="">
  <div class="p-6 bg-grey-800 font-inter text-grey-500">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="font-ppformula text-grey-100 text-xl">Auction</h3>
      <MBadge>Active</MBadge>
    </div>
    <div class="grid grid-cols-5 gap-3 mb-6">
      <div
        class="max-sm:col-span-5 col-span-3 flex justify-center items-center gap-3 border border-grey-700"
      >
        <div>
          <span class="text-xs leading-3">WETH/Power rate</span>
          <MTokenAmount
            name="power"
            image="/img/tokens/power.svg"
            :size="24"
            :amount="formatNumber(formatEther(currentCost?.value || 0n))"
          />
        </div>
        <div>
          <span class="text-xs leading-3">Rate projection</span>
          <AuctionChart class="max-sm:col-span-3" :height="120" />
        </div>
      </div>
      <div
        class="max-sm:col-span-5 col-span-2 flex justify-center items-center gap-8"
      >
        <div>
          <span class="text-xs leading-3">Power tokens available</span>
          <MTokenAmount
            name="power"
            image="/img/tokens/power.svg"
            :size="24"
            :amount="formatNumber(amountLeftToAuction || 0n)"
          />
        </div>
        <NuxtLink to="/auction" class="text-xs">
          <MButton>Buy Tokens</MButton>
        </NuxtLink>
      </div>
    </div>
    <p class="text-xxs lg:text-xs">
      This is a Dutch auction, the price decreasing over time once the auction
      begins. Rate of Decrease: information on the rate or interval at which the
      price decreases during the auction.
    </p>
  </div>
</template>

<script setup lang="ts">
import { formatEther } from "viem";

const { currentCost, amountLeftToAuction } = useAuction();
</script>
