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
              :amount="
                isTransferEpoch ? useNumberFormatterEth(amountLeftToAuction) : 0
              "
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
                  ? useNumberFormatterEth(formatEther(currentCost?.value || 0n))
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
        class="col-span-3 lg:col-span-1 order-1 lg:order-2 p-6 lg:p-8 py-10 bg-grey-800"
      >
        <div class="flex items-center justify-between mb-1">
          <label for="buy-input" class="text-gray-100 text-xs"
            >Amount for purchase:</label
          >
        </div>
        <MInput
          id="buy-input"
          v-model="auctionBuyForm.amount"
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
            {{ useNumberFormatterEth(cashTokenBalance) }}
            {{ cashToken?.data?.value?.symbol }}
          </span>
        </div>
        <div class="my-2">
          <label class="flex items-center gap-2 text-xs leading-3 mb-0">
            <input
              v-model="customDestination"
              type="checkbox"
              class="w-3 h-3 accent-accent-mint"
              data-test="reason-vote-checkbox"
            />
            Set destination address
          </label>
          <MInput
            v-if="customDestination"
            id="custom-destination"
            v-model="auctionBuyForm.destination"
            class="input mt-2"
            type="text"
            placeholder="0x..."
            :errors="$auctionBuyValidation.destination?.$errors"
          />
        </div>
        <MButton
          :disabled="
            !auctionBuyForm.amount ||
            !userAccount ||
            isLoadingTransaction ||
            totalPrice > cashTokenBalance
          "
          class="w-full flex justify-center"
          type="submit"
          :is-loading="isLoadingTransaction"
          data-test="button-submit-buy"
          @click="auctionBuy()"
        >
          Buy
        </MButton>
        <div class="flex items-start gap-2 mt-4">
          <img class="w-4 lg:w-8" src="/img/icon-info.svg" alt="" />
          <span class="text-xs">
            You may purchase any amount up to the specified limit.
          </span>
        </div>
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
  isAddress,
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
import { writePowerToken } from "@/lib/sdk";
import { useMBalances } from "@/lib/hooks";
import { helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const alerts = useAlertsStore();
const { forceSwitchChain } = useCorrectChain();
const { address: userAccount } = useAccount();
const ttg = storeToRefs(useTtgStore());

const { cashToken, refetch: refetchBalances } = useMBalances(userAccount);

const cashTokenBalance = computed(() => cashToken?.data?.value?.formatted);

const auctionBuyForm = reactive({
  amount: 0,
  destination: "",
  loading: false,
});

const customDestination = ref(false);
const isLoadingTransaction = ref(false);
const { epoch, currentCashToken } = storeToRefs(ttg);
const wagmiConfig = useWagmiConfig();
const {
  amountLeftToAuction,
  currentCost,
  getCurrentCost,
  getAmountLeftToAuction,
} = useAuction();

const isTransferEpoch = computed(
  () => ttg.epoch.value.current?.type === "TRANSFER",
);

const noPowerTokens = computed(() => Number(amountLeftToAuction.value) === 0);

const totalPrice = computed(() => {
  if (!currentCost.value || !auctionBuyForm.amount) return "0";
  return useNumberFormatterEth(
    formatEther(
      BigInt(currentCost.value.value) * BigInt(auctionBuyForm.amount),
    ),
  );
});

const addressValidation = (val: Hash) => isAddress(val);
const addressValidationRule = {
  addressValidation: helpers.withMessage("Invalid address", addressValidation),
};

const auctionBuyRules = {
  destination: {
    ...addressValidationRule,
  },
};

const $auctionBuyValidation = useVuelidate(auctionBuyRules, auctionBuyForm);

async function setMaxPossiblePurchase() {
  await getAmountLeftToAuction();
  auctionBuyForm.amount = Number(amountLeftToAuction.value);
}

async function auctionBuy() {
  if (!userAccount.value) return;
  isLoadingTransaction.value = true;
  await forceSwitchChain();
  try {
    await writeAllowance(totalPrice.value).catch(() => {
      alerts.errorAlert("Error getting approval!");
    });

    if (customDestination.value) {
      await $auctionBuyValidation.value.$validate();
      if ($auctionBuyValidation.value.$error) return;
    }

    const hash = await writePowerToken(wagmiConfig, {
      address: ttg.contracts.value.powerToken as Hash,
      functionName: "buy",
      args: [
        1n, // Minimun amount the user is willing to buy
        BigInt(auctionBuyForm.amount), // Maximum and IDEAL amount the user is willing to buy
        customDestination.value
          ? (auctionBuyForm.destination as Hash)
          : (userAccount.value as Hash),
        epoch.value.current?.asNumber, // expiryEpoch_ should send the current epoch as it UP TO this epoch we buy
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
          currentCashToken?.value?.decimals,
        )} ${currentCashToken?.value?.symbol}`,
      );
      refetchBalances();
      getAmountLeftToAuction();

      auctionBuyForm.amount = 0;
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
    address: ttg.contracts.value.cashToken as Hash,
    functionName: "allowance",
    args: [userAccount.value as Hash, ttg.contracts.value.powerToken as Hash], // address owner, address spender
    account: userAccount.value as Hash,
  });

  if (!allowance || allowance < parseEther(value)) {
    const hash = await writeContract(wagmiConfig, {
      abi: erc20Abi,
      address: ttg.contracts.value.cashToken as Hash,
      functionName: "approve",
      args: [ttg.contracts.value.powerToken as Hash, parseEther(value)], // address spender, uint256 amount
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
</script>
