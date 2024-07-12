<template>
  <div class="inline-block">
    <slot>
      <a class="underline cursor-pointer" @click="show = true">
        Click here to wrap ETH
      </a>
    </slot>
    <Teleport to="body">
      <div
        v-if="show"
        class="fixed top-0 z-50 w-full h-dvh flex items-center justify-center bg-grey-1000 bg-opacity-70"
      >
        <div ref="dialog" class="p-6 bg-grey-800">
          <div class="mb-2 text-xl flex items-center justify-between">
            <span>Convert ETH to WETH</span>
            <button @click="show = false">
              <img src="/img/modals/close.svg" alt="" srcset="" />
            </button>
          </div>
          <div>
            <p class="text-grey-200 text-inter text-sm">
              To pay the submission fee, please wrap your ETH. Only ETH as
              ERC-20 tokens are allowed.
            </p>

            <div class="grid grid-cols-2 my-6 gap-6 font-inter">
              <div>
                <div class="mb-3">
                  <label class="mb-0">Convert:</label>
                  <span class="text-lg font-ppformula">
                    {{ useNumberFormatterEth(formatEther(convertionAmount)) }}
                    ETH
                  </span>
                </div>
                <div class="text-xs text-grey-500">
                  <p>
                    Your balance:
                    <span class="text-nowrap">
                      {{
                        useNumberFormatterEth(
                          formatEther(ethBalance.data.value?.value),
                        )
                      }}
                      ETH
                    </span>
                  </p>
                  <p>
                    Conversion rate:
                    <span class="text-nowrap">1 ETH = 1 WETH</span>
                  </p>
                </div>
              </div>
              <div>
                <div class="mb-3">
                  <label class="mb-0">To:</label>
                  <span class="text-lg font-ppformula">
                    {{ useNumberFormatterEth(formatEther(convertionAmount)) }}
                    WETH
                  </span>
                </div>
                <div class="text-xs text-grey-500">
                  <p>
                    Your balance:
                    <span class="text-nowrap">
                      {{ cashToken.data.value?.formatted }} WETH
                    </span>
                  </p>
                  <p>
                    Submission fee:
                    <span class="text-nowrap">
                      {{ ttgValuesFormatted?.setProposalFee }} WETH
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-4">
            <MButton version="outline-light" @click="show = false">
              Cancel
            </MButton>
            <MButton :is-loading="loadingTx" @click="convert">
              Convert
            </MButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Hash, formatEther, parseAbi } from "viem";
import { useAccount, useBalance } from "use-wagmi";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useMBalances } from "@/lib/hooks";

const show = ref(false);
const dialog = ref();
const loadingTx = ref(false);

const alerts = useAlertsStore();
const ttg = useTtgStore();
const wagmiConfig = useWagmiConfig();
const { address: account } = useAccount();
const ethBalance = useBalance({ address: account });
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
