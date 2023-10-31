<template>
  <div>
    <!-- TODO: Change to new PageTitle component -->
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
            <MTokenAmount
              name="Eth"
              image="/img/tokens/eth.svg"
              :size="30"
              amount="120"
            />
          </div>
          <div class="col-span-3 lg:col-span-1 text-zinc-500 text-xs uppercase">
            <p class="mb-2">Total available</p>
            <MTokenAmount
              name="Power"
              :size="30"
              :amount="balancePowerToken?.data.value?.formatted"
            />
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
        v-if="transferEpoch"
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 bg-neutral-800 p-8 py-10"
      >
        <p class="text-gray-200 text-xs uppercase mb-2">Value for purchase:</p>
        <MInput
          v-model="purchaseAmount"
          class="input"
          type="text"
          placeholder="0"
          @update:model-value="getPurchaseCost"
        />
        <p class="text-zinc-500 text-xs mt-2">Max: 0</p>
        <div class="my-12"></div>
        <p class="text-gray-200 text-xs uppercase mb-2">Value for purchase:</p>
        <MTokenAmount
          class="text-zinc-500"
          image="/img/tokens/eth.svg"
          :size="36"
          :amount="purchaseCost + ''"
        />
        <MButton :disabled="!purchaseAmount" class="mt-4 w-full" type="submit">
          Buy
        </MButton>
      </div>
      <div
        v-else
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 bg-green-900 p-8 py-10"
      >
        <p class="text-gray-200 text-xs uppercase mb-2">Warning</p>
        <div class="flex items-start gap-2">
          <img src="/img/icon-warning.svg" alt="" />
          <p>
            The transfer epoch has concluded. You will be able to participate in
            the auction in the next transfer epoch.
          </p>
        </div>
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
import { storeToRefs } from "pinia";
import { useBlockNumber, useAccount } from "use-wagmi";
import { Hash } from "viem";
import { readPowerBootstrapToken } from "@/lib/sdk";

const { address: userAccount } = useAccount();
const { data: blockNumber } = useBlockNumber();

const spog = storeToRefs(useSpogStore());

const purchaseAmount = ref("");
const purchaseCost = ref(0n);
const lastEpochTotalSupply = ref();
const transferEpoch = isTransferEpoch(blockNumber.value || 0n);
const { epoch } = storeToRefs(spog);

async function getLastEpochTotalSupply() {
  try {
    lastEpochTotalSupply.value = await readPowerBootstrapToken({
      address: spog.contracts.value.powerToken as Hash,
      functionName: "totalSupplyAt",
      args: [BigInt(epoch.value.current?.asNumber - 1)],
    });
  } catch (error) {
    console.log(error);
  }
}

function getPurchaseCost() {
  purchaseCost.value = getAuctionPurchaseCost(
    BigInt(purchaseAmount.value),
    blockNumber.value,
    lastEpochTotalSupply.value
  );
}

getLastEpochTotalSupply();
</script>
