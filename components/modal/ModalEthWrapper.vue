<template>
  <div class="inline-block">
    <slot>
      <a class="underline cursor-pointer" @click="show = true"
        >Click here to wrap ETH</a
      >
    </slot>
    <Teleport to="body">
      <div
        v-if="show"
        class="fixed top-0 z-50 w-full h-dvh flex items-center justify-center bg-grey-1000 bg-opacity-70"
      >
        <div ref="dialog" class="p-4 bg-grey-800">
          <div class="mb-4 text-xl">Convert ETH to WETH</div>
          <div>
            <p class="text-grey-500 text-sm">
              To use ETH as an ERC-20 token, you need to wrap it.
            </p>

            <div class="flex justify-between w-[70%] mx-auto my-6 gap-6">
              <div>
                <label class="mb-0">You need:</label>
                <span>{{ ttgValuesFormatted.setProposalFee }} WETH</span>
              </div>
              <div>
                <label class="mb-0">You have:</label>
                <span>
                  {{
                    useNumberFormatterEth(
                      formatEther(cashToken?.data?.value?.value || 0n),
                    )
                  }}
                  WETH</span
                >
              </div>
            </div>

            <p class="text-grey-500 text-xs">
              You are about to convert
              {{ useNumberFormatterEth(formatEther(convertionAmount)) }}
              ETH to the same amount of WETH
            </p>
          </div>
          <div class="flex justify-between">
            <MButton version="outline-light" class="mt-6" @click="show = false"
              >Close</MButton
            >
            <!-- <MButton version="outline-light" class="mt-6" @click="withdraw"
              >Widthdraw</MButton
            > -->
            <MButton :is-loading="loadingTx" class="mt-6" @click="convert"
              >Convert</MButton
            >
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Hash, formatEther, parseAbi } from "viem";
import { useAccount } from "use-wagmi";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useMBalances } from "@/lib/hooks";

const show = ref(false);
const dialog = ref();
const loadingTx = ref(false);

const alerts = useAlertsStore();
const ttg = useTtgStore();
const wagmiConfig = useWagmiConfig();
const { address: account } = useAccount();
const { getValuesFormatted: ttgValuesFormatted, getValues } = storeToRefs(ttg);

const { cashToken, refetch: refetchBalances } = useMBalances(account);

const convertionAmount = computed(
  () =>
    BigInt(getValues.value.proposalFee) - (cashToken.data.value?.value || 0n),
);

const abi = parseAbi(["function deposit() external payable"]);

const convert = async () => {
  if (convertionAmount.value < 0n) return;
  loadingTx.value = true;
  try {
    const tx = await writeContract(wagmiConfig, {
      address: ttg.tokens.cash.address as Hash,
      abi: abi,
      functionName: "deposit",
      value: convertionAmount.value,
    });

    const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
      confirmations: 1,
      hash: tx,
    });

    if (txReceipt.status !== "success") {
      throw new Error("Transaction was rejected");
    }

    alerts.successAlert("You successfully wrapped ETH");

    refetchBalances();
  } catch (error) {
    console.error(error);
  } finally {
    loadingTx.value = false;
    show.value = false;
  }
};

onClickOutside(dialog, () => (show.value = false));
</script>
