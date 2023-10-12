<template>
  <div>
    <nav class="text-white text-xl p-8">
      <MNavButton class="text-white text-lg">
        Auction<span class="text-primary">_</span>
      </MNavButton>
    </nav>

    <div class="grid grid-cols-3">
      <div
        class="col-span-3 lg:col-span-2 order-2 lg:order-1 bg-neutral-900 p-8 py-10"
      >
        <div class="grid grid-cols-3 gap-8">
          <div class="col-span-3 lg:col-span-1 text-zinc-500 text-xs uppercase">
            <p class="mb-2">WETH / Power token</p>
            <MTokenAmount image="/img/tokens/eth.svg" :size="30" amount="120" />
          </div>
          <div class="col-span-3 lg:col-span-1 text-zinc-500 text-xs uppercase">
            <p class="mb-2">Total available</p>
            <MTokenAmount image="/img/tokens/p.svg" :size="30" amount="343" />
          </div>
        </div>
        <div>
          <span>{{ dataRead }}</span>
        </div>
        <div class="mt-4">
          <AuctionChart />
        </div>
      </div>

      <div
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 bg-neutral-800 p-8 py-10"
      >
        <p class="text-gray-200 text-xs uppercase mb-2">Value for purchase:</p>
        <MInput
          v-model="purchaseAmount"
          class="input"
          type="text"
          placeholder="0"
        />
        <p class="text-zinc-500 text-xs mt-2">Max: 3043</p>
        <div class="my-12"></div>
        <p class="text-gray-200 text-xs uppercase mb-2">Value for purchase:</p>
        <MTokenAmount
          class="text-zinc-500"
          image="/img/tokens/eth.svg"
          :size="36"
          amount="344"
        />
        <MButton :disabled="!purchaseAmount" class="mt-4 w-full" type="submit">
          Buy
        </MButton>
      </div>
    </div>

    <div class="py-4 lg:p-6">
      <p class="text-xs">Rate projection description</p>
      <p class="text-xs text-zinc-500">
        This is a Dutch auction, the chart below illustrates the price
        decreasing over time once the auction begins.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useContractRead, useAccount } from "use-wagmi";
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { ispogGovernorABI } from "@/lib/sdk";

const purchaseAmount = ref("");
const spog = useSpogStore();
const { epoch } = storeToRefs(spog);
const { address: userAccount } = useAccount();

const { data: dataRead } = useContractRead({
  address: spog.contracts.governor as Hash,
  abi: ispogGovernorABI,
  functionName: "hasFinishedVoting",
  args: [BigInt(epoch.value.current?.asNumber), userAccount],
  watch: true,
});
</script>
