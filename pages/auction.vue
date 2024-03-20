<template>
  <div>
    <PageTitle class="mb-8 px-6 lg:p-0">
      <template #default>Auction</template>
      <template #subtitle>
        This is a Dutch auction, the chart below illustrates the price
        decreasing over time once the auction begins.
      </template>
    </PageTitle>

    <div class="grid grid-cols-3 font-inter">
      <div
        class="col-span-3 lg:col-span-2 order-2 lg:order-1 bg-grey-800 p-6 lg:p-8 py-10"
      >
        <div class="flex flex-wrap gap-8 text-grey-500">
          <div>
            <p class="mb-2 text-xxs uppercase">Power Tokens Available</p>
            <MTokenAmount
              name="power"
              image="/img/tokens/power.svg"
              :size="30"
              :amount="isTransferEpoch ? formatNumber(amountLeftToAuction) : 0"
            />
          </div>
          <div>
            <p class="mb-2 text-xxs uppercase">
              {{ currentCashToken?.symbol }}/POWER Rate
            </p>
            <MTokenAmount
              :name="currentCashToken?.symbol"
              :image="`/img/tokens/${currentCashToken?.symbol?.toLowerCase()}.png`"
              :size="30"
              :amount="
                isTransferEpoch
                  ? formatNumber(formatEther(currentCost?.value || 0n))
                  : 0
              "
            />
          </div>
        </div>
        <div class="mt-8 min-h-48 lg:min-h-72">
          <p class="text-xs text-grey-500">Rate projection</p>
          <AuctionChart
            v-if="isTransferEpoch && !noPowerTokens"
            :show-options="true"
          />
        </div>
      </div>

      <div
        v-if="isTransferEpoch && !noPowerTokens"
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 p-6 lg:p-8 py-10 form-column"
      >
        <div class="flex items-center justify-between mb-1">
          <label for="buy-input" class="text-gray-100 text-xs"
            >Amount for purchase:</label
          >
        </div>
        <MInput
          id="buy-input"
          v-model="purchaseAmount"
          class="input"
          type="text"
          placeholder="0"
          @update:model-value="getCurrentCost"
        />
        <button
          class="text text-xs text-grey-500"
          @click="setMaxPossiblePurchase"
        >
          Max: {{ amountLeftToAuction }}
        </button>

        <div class="my-2 lg:my-12"></div>
        <p class="text-gray-200 text-xs uppercase mb-2">Total price:</p>
        <MTokenAmount
          :name="currentCashToken?.symbol"
          class="text-grey-500"
          :image="`/img/tokens/${currentCashToken?.symbol?.toLowerCase()}.png`"
          :size="20"
          :amount="totalPrice"
        />
        <div class="text-grey-500 text-xs mt-4">
          <p>Available balance:</p>
          <span
            :class="{ 'text-red-600 font-bold': totalPrice > cashTokenBalance }"
          >
            {{ cashTokenBalance }}
            {{ cashToken.data.value.symbol }}
          </span>
        </div>
        <MButton
          :disabled="
            !purchaseAmount ||
            !userAccount ||
            !userAgreeMinAmount ||
            isLoadingTransaction ||
            totalPrice > cashTokenBalance
          "
          class="mt-4 w-full flex justify-center"
          type="submit"
          :is-loading="isLoadingTransaction"
          data-test="button-submit-buy"
          @click="auctionBuy()"
        >
          Buy
        </MButton>
        <MCheckbox v-model="userAgreeMinAmount" class="text-xs mt-3"
          >Buy any amount up to specified limit for purchase</MCheckbox
        >
      </div>

      <div
        v-else-if="!isTransferEpoch"
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 bg-accent-blue p-6 lg:p-8 py-10"
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

      <div
        v-else-if="noPowerTokens"
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 bg-accent-blue p-8 py-10"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAccount } from "use-wagmi";
import {
  Hash,
  formatEther,
  erc20Abi,
  parseEther,
  parseAbi,
  decodeEventLog,
  formatUnits,
} from "viem";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { readPowerToken, writePowerToken } from "@/lib/sdk";
import { useMBalances } from "@/lib/hooks";

const alerts = useAlertsStore();
const { forceSwitchChain } = useCorrectChain();
const { address: userAccount } = useAccount();
const spog = storeToRefs(useSpogStore());

const { cashToken, refetch: refetchBalances } = useMBalances(userAccount);

const cashTokenBalance = computed(() => cashToken?.data?.value?.formatted);

const purchaseAmount = ref();
const userAgreeMinAmount = ref(true);
const lastEpochTotalSupply = ref();
const isLoadingTransaction = ref(false);
const { epoch, currentCashToken } = storeToRefs(spog);
const wagmiConfig = useWagmiConfig();
const { currentCost, amountLeftToAuction, getCurrentCost } = useAuction();

const isTransferEpoch = computed(
  () => spog.epoch.value.current?.type === "TRANSFER"
);

const noPowerTokens = computed(() => Number(amountLeftToAuction.value) === 0);

const totalPrice = computed(() => {
  if (!currentCost.value || !purchaseAmount.value) return "0";
  return formatNumber(
    formatEther(BigInt(currentCost.value.value) * BigInt(purchaseAmount.value))
  );
});

async function getLastEpochTotalSupply() {
  try {
    lastEpochTotalSupply.value = await readPowerToken(wagmiConfig, {
      address: spog.contracts.value.powerToken as Hash,
      functionName: "pastTotalSupply",
      args: [BigInt(epoch.value.current?.asNumber - 1)],
    });
  } catch (error) {
    console.log(error);
  }
}

async function setMaxPossiblePurchase() {
  await getAmountLeftToAuction();
  purchaseAmount.value = Number(amountLeftToAuction.value);
}

async function getAmountLeftToAuction() {
  try {
    amountLeftToAuction.value = await readPowerToken(wagmiConfig, {
      address: spog!.contracts!.value.powerToken! as Hash,
      functionName: "amountToAuction",
    });
  } catch (error) {
    console.log(error);
  }
}

async function auctionBuy() {
  if (!userAccount.value) return;
  isLoadingTransaction.value = true;
  await forceSwitchChain();
  try {
    await writeAllowance(totalPrice.value).catch(() => {
      alerts.errorAlert("Error getting approval!");
    });

    const hash = await writePowerToken(wagmiConfig, {
      address: spog.contracts.value.powerToken as Hash,
      functionName: "buy",
      args: [
        0n, // Minimun amount the user is willing to buy
        BigInt(purchaseAmount.value), // Maximum and IDEAL amount the user is willing to buy
        userAccount.value as Hash,
      ],
      account: userAccount.value as Hash,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });
    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    } else {
      // Get data from successful buy to show in alert
      const { args } = decodeEventLog({
        abi: parseAbi([
          "event Buy(address indexed buyer, uint240 amount, uint256 cost)",
        ]),
        data: txReceipt.logs[0]?.data,
        topics: txReceipt.logs[0]?.topics,
      });

      alerts.successAlert(
        `You bought ${args.amount} Power tokens for ${formatUnits(
          args.cost * args.amount,
          currentCashToken?.value?.decimals
        )} ${currentCashToken?.value?.symbol}`
      );
      refetchBalances();
      getAmountLeftToAuction();
    }
  } catch (error) {
    console.log("ERROR", error);
    alerts.errorAlert("Error buying!");
  } finally {
    isLoadingTransaction.value = false;
  }
}

async function writeAllowance(value: string) {
  const allowance = await readContract(wagmiConfig, {
    abi: erc20Abi,
    address: spog.contracts.value.cashToken as Hash,
    functionName: "allowance",
    args: [userAccount.value as Hash, spog.contracts.value.powerToken as Hash], // address owner, address spender
    account: userAccount.value as Hash,
  });

  if (!allowance || allowance < parseEther(value)) {
    const hash = await writeContract(wagmiConfig, {
      abi: erc20Abi,
      address: spog.contracts.value.cashToken as Hash,
      functionName: "approve",
      args: [spog.contracts.value.powerToken as Hash, parseEther(value)], // address spender, uint256 amount
      account: userAccount.value as Hash,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash,
    });
    // Fail tx
    if (txReceipt.status !== "success") {
      throw new Error("Transaction was not successful");
    }

    return txReceipt;
  }
}

onMounted(() => {
  getLastEpochTotalSupply();
  getAmountLeftToAuction();
});
</script>

<style>
.form-column {
  background: linear-gradient(
      0deg,
      rgba(45, 59, 72, 0.2) 0%,
      rgba(45, 59, 72, 0.2) 100%
    ),
    var(--Colors-Blue-grey-800, #11171d);
}
</style>
