<template>
  <div class="p-6 bg-grey-800 font-inter text-grey-500">
    <div class="flex items-center gap-3 mb-4">
      <h3 class="font-ppformula text-grey-100 text-xl">Auction</h3>
      <MBadge>Active</MBadge>
    </div>
    <div class="flex flex-wrap gap-4 my-4">
      <div class="flex flex-wrap gap-8 p-6 border border-grey-700">
        <div>
          <span class="text-xs">WETH/Power rate</span>
          <MTokenAmount
            name="power"
            image="/img/tokens/power.svg"
            :size="24"
            :amount="formatNumber(formatEther(currentCost.value))"
          />
        </div>
        <div>
          <span class="text-xs">Rate projection</span>
          <AuctionChart class="max-w-40" :height="30" />
        </div>
      </div>
      <div class="flex gap-4 p-6">
        <div>
          <span class="text-xs">Power tokens available</span>
          <MTokenAmount
            name="power"
            image="/img/tokens/power.svg"
            :size="24"
            :amount="formatNumber(amountLeftToAuction)"
          />
        </div>
        <div class="flex items-center">
          <NuxtLink to="/auction" class="text-xs">
            <MButton>Buy Tokens</MButton>
          </NuxtLink>
        </div>
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
