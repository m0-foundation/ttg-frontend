<template>
  <div>
    <PageTitle>Auction</PageTitle>

    <div class="grid grid-cols-3">
      <div
        class="col-span-3 lg:col-span-2 order-2 lg:order-1 bg-neutral-900 p-8 py-10"
      >
        <div class="flex gap-12 text-grey-400">
          <div>
            <p class="mb-2 text-xxs uppercase">WETH/POWER Rate</p>
            <MTokenAmount
              name="Eth"
              image="/img/tokens/eth.svg"
              :size="30"
              :amount="Number(purchasePrice)"
              data-test="cash-token-amount"
            />
          </div>
          <div>
            <p class="mb-2 text-xxs uppercase">Power Tokens Available</p>
            <MTokenAmount
              name="Power"
              :size="30"
              :amount="amountLeftToAuction"
              data-test="power-tokens-amount-to-auction"
            />
          </div>
        </div>
        <div>
          <span>{{ dataRead }}</span>
        </div>
        <div class="mt-4">
          <AuctionChart :show-data="userCanBuy" />
        </div>
      </div>

      <div
        v-if="userCanBuy"
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
        <button
          class="text text-xs text-grey-400"
          @click="setMaxPossiblePurchase"
        >
          Max: {{ amountLeftToAuction }}
        </button>
        <div class="my-12"></div>
        <p class="text-gray-200 text-xs uppercase mb-2">Value for purchase:</p>
        <MTokenAmount
          class="text-zinc-500"
          image="/img/tokens/eth.svg"
          :size="36"
          :amount="purchaseCost"
        />
        <MButton
          :disabled="!purchaseAmount || !userAccount"
          class="mt-4 w-full flex justify-center"
          type="submit"
          :is-loading="isLoadingTransaction"
          @click="auctionBuy()"
        >
          Buy
        </MButton>
      </div>

      <div
        v-else-if="isTransferEpoch"
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 bg-green-900 p-8 py-10"
      >
        <p class="text-gray-200 text-xs uppercase mb-2">No power tokens</p>
        <div class="flex items-start gap-2">
          <img src="/img/icon-info.svg" alt="" />
          <p>
            No power tokens available for the auction. Please, check again in
            the next transfer epoch.
          </p>
        </div>
      </div>

      <div
        v-else
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 bg-green-900 p-8 py-10"
      >
        <p class="text-gray-200 text-xs uppercase mb-2">Auction unavailable</p>
        <div class="flex items-start gap-2">
          <img src="/img/icon-info.svg" alt="" />
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
import { waitForTransaction } from "@wagmi/core";
import { readPowerToken, writePowerToken } from "@/lib/sdk";
import { useMBalances } from "@/lib/hooks";

const { address: userAccount } = useAccount();
const { data: blockNumber } = useBlockNumber();
const { powerToken: balancePowerToken } = useMBalances(userAccount?.value);

const spog = storeToRefs(useSpogStore());

const purchaseAmount = ref();
const purchaseCost = ref(0n);
const purchasePrice = ref(0n);
const lastEpochTotalSupply = ref();
const amountLeftToAuction = ref();
const isLoadingTransaction = ref(false);
const { epoch } = storeToRefs(spog);

const isTransferEpoch = computed(
  () => epoch?.value.current?.type === "TRANSFER"
);
const userCanBuy = computed(() => {
  return isTransferEpoch.value && Number(amountLeftToAuction.value) > 0n;
});

async function getLastEpochTotalSupply() {
  try {
    lastEpochTotalSupply.value = await readPowerToken({
      address: spog.contracts.value.powerToken as Hash,
      functionName: "pastTotalSupply",
      args: [BigInt(epoch.value.current?.asNumber - 1)],
    });
  } catch (error) {
    console.log(error);
  }
}

function setMaxPossiblePurchase() {
  getAmountLeftToAuction();
  getPurchaseCost();
  purchaseAmount.value = Number(amountLeftToAuction.value);
}

function getPurchaseCost() {
  purchaseCost.value = getAuctionPurchaseCost(
    BigInt(purchaseAmount.value),
    epoch.value,
    lastEpochTotalSupply.value
  );
}

watch(
  () => lastEpochTotalSupply.value,
  (newValue) => {
    purchasePrice.value = getAuctionPurchaseCost(1n, epoch.value, newValue);
  }
);

async function getAmountLeftToAuction() {
  try {
    amountLeftToAuction.value = await readPowerToken({
      address: spog.contracts.value.powerToken as Hash,
      functionName: "amountToAuction",
    });
  } catch (error) {
    console.log(error);
  }
}

async function auctionBuy() {
  if (!userAccount.value) return;
  isLoadingTransaction.value = true;
  try {
    const { hash } = await writePowerToken({
      address: spog.contracts.value.powerToken as Hash,
      functionName: "buy",
      args: [
        BigInt(purchaseAmount.value / 2), // TODO: Check what number is better here
        BigInt(purchaseAmount.value),
        userAccount.value,
      ],
      account: userAccount.value,
    });

    const txReceipt = await waitForTransaction({ confirmations: 1, hash });
    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoadingTransaction.value = false;
  }
}

onMounted(() => {
  getLastEpochTotalSupply();
  getAmountLeftToAuction();
});
</script>
